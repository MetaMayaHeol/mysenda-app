'use server'

import { createClient } from '@/lib/supabase/server'
import { serviceSchema, type ServiceFormValues } from '@/lib/utils/validators'
import { indexSingleService, deleteServiceIndex } from '@/lib/ai/indexer'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { slugify } from '@/lib/utils/formatters'
import { SupabaseClient } from '@supabase/supabase-js'

async function ensureCitiesExist(supabase: SupabaseClient, locations: string[]) {
  if (!locations || locations.length === 0) return

  try {
    for (const location of locations) {
      const slug = slugify(location)
      // We use ignoreDuplicates to not overwrite existing cities with partial data
      const { error } = await supabase.from('cities').upsert({
        slug,
        name: location,
        is_active: true
      }, { onConflict: 'slug', ignoreDuplicates: true })
      
      if (error) {
        console.error('Error upserting city:', error)
      }
    }
  } catch (err) {
    console.error('Unexpected error in ensureCitiesExist:', err)
  }
}

export async function createService(formData: ServiceFormValues) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Ensure user exists in public.users (in case trigger failed)
  const { data: existingUser, error: userCheckError } = await supabase.from('users').select('id').eq('id', user.id).single()
  
  if (userCheckError && userCheckError.code !== 'PGRST116') {
    console.error('Error checking user existence:', userCheckError)
  }
  
  if (!existingUser) {
    const { error: insertUserError } = await supabase.from('users').insert({ id: user.id, email: user.email! })
    if (insertUserError) {
      console.error('Error creating user profile:', insertUserError)
      return { error: 'Error al crear tu perfil. Por favor contacta soporte.' }
    }
  }

  const validatedFields = serviceSchema.safeParse(formData)

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten())
    return { error: 'Datos inválidos: ' + validatedFields.error.issues.map((e: { message: string }) => e.message).join(', ') }
  }

  const { 
    title, subtitle, description, price, duration, active, photos, locations, categories,
    itinerary, includes, excludes, requirements, meeting_point, cancellation_policy, max_pax, languages
  } = validatedFields.data

  // Ensure cities exist in DB
  await ensureCitiesExist(supabase, locations)

  // 1. Create service
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .insert({
      user_id: user.id,
      title,
      subtitle,
      description,
      price,
      duration,
      active,
      locations,
      categories,
      itinerary,
      includes,
      excludes,
      requirements,
      meeting_point,
      cancellation_policy,
      max_pax,
      languages,
    })
    .select()
    .single()

  if (serviceError) {
    console.error('Error creating service:', serviceError)
    return { error: `Error al crear el servicio: ${serviceError.message}` }
  }

  // 2. Insert photos if any
  if (photos && photos.length > 0) {
    const photosToInsert = photos.map((url, index) => ({
      service_id: service.id,
      url,
      order: index + 1,
    }))

    const { error: photosError } = await supabase
      .from('service_photos')
      .insert(photosToInsert)

    if (photosError) {
      console.error('Error uploading photos:', photosError)
    }
  }

  // 3. Trigger Indexing (Background)
  indexSingleService(service.id).catch(console.error)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/services')
  
  return { success: true, serviceId: service.id }
}

export async function updateService(serviceId: string, formData: ServiceFormValues) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const validatedFields = serviceSchema.safeParse(formData)

  if (!validatedFields.success) {
    return { error: 'Datos inválidos' }
  }

  const { 
    title, subtitle, description, price, duration, active, photos, locations, categories,
    itinerary, includes, excludes, requirements, meeting_point, cancellation_policy, max_pax, languages
  } = validatedFields.data

  // Ensure cities exist in DB
  await ensureCitiesExist(supabase, locations)

  // 1. Update service
  const { error: serviceError } = await supabase
    .from('services')
    .update({
      title,
      subtitle,
      description,
      price,
      duration,
      active,
      locations,
      categories,
      itinerary,
      includes,
      excludes,
      requirements,
      meeting_point,
      cancellation_policy,
      max_pax,
      languages,
    })
    .eq('id', serviceId)
    .eq('user_id', user.id) // Security check

  if (serviceError) {
    console.error('Update Service Error:', serviceError)
    return { error: `Error al actualizar: ${serviceError.message}` }
  }

  // 2. Update photos (Replace strategy)
  if (photos) {
    // Delete existing
    await supabase
      .from('service_photos')
      .delete()
      .eq('service_id', serviceId)

    // Insert new
    if (photos.length > 0) {
      const photosToInsert = photos.map((url, index) => ({
        service_id: serviceId,
        url,
        order: index + 1,
      }))

      await supabase
        .from('service_photos')
        .insert(photosToInsert)
    }
  }

  // 3. Trigger Index Update (Background)
  indexSingleService(serviceId).catch(console.error)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/services')
  revalidatePath(`/dashboard/services/${serviceId}`)
  revalidatePath(`/s/${serviceId}`) // Revalidate public service page
  
  // Also revalidate the guide's profile page
  const { data: service } = await supabase
    .from('services')
    .select('user_id')
    .eq('id', serviceId)
    .single()
  
  if (service) {
    const { data: link } = await supabase
      .from('public_links')
      .select('slug')
      .eq('user_id', service.user_id)
      .single()
    
    if (link) {
      revalidatePath(`/g/${link.slug}`) // Revalidate guide profile page
    }
  }
  
  return { success: true }
}

export async function deleteService(serviceId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { error } = await supabase
    .from('services')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', serviceId)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Error al eliminar el servicio' }
  }

  // 3. Remove from Index (Background)
  deleteServiceIndex(serviceId).catch(console.error)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/services')
  
  return { success: true }
}
