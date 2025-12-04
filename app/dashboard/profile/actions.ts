'use server'

import { createClient } from '@/lib/supabase/server'
import { profileSchema, type ProfileFormValues } from '@/lib/utils/validators'
import { slugify } from '@/lib/utils/formatters'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: ProfileFormValues) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Validate data
  const validatedFields = profileSchema.safeParse(formData)

  if (!validatedFields.success) {
    return { error: 'Datos inválidos' }
  }

  const { name, bio, city, country, whatsapp, languages, photo_url } = validatedFields.data

  // Update user profile
  const { error } = await supabase
    .from('users')
    .update({
      name,
      bio,
      city,
      country,
      whatsapp,
      languages,
      photo_url,
    })
    .eq('id', user.id)

  if (error) {
    return { error: 'Error al actualizar el perfil' }
  }

  // Check if user has a public link
  const { data: publicLink } = await supabase
    .from('public_links')
    .select('slug, active')
    .eq('user_id', user.id)
    .single()

  // If no public link and name is present, create one
  if (!publicLink && name) {
    // Basic slug generation strategy
    let slug = slugify(name)
    
    // Check if slug exists
    const { data: existingSlug } = await supabase
      .from('public_links')
      .select('slug')
      .eq('slug', slug)
      .single()
      
    if (existingSlug) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`
    }

    await supabase.from('public_links').insert({
      user_id: user.id,
      slug,
      active: true, // Force active by default
    })
  } else if (publicLink && !publicLink.active) {
    // If link exists but is inactive, activate it (since they are updating profile)
    await supabase
      .from('public_links')
      .update({ active: true })
      .eq('user_id', user.id)
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profile')
  
  return { success: true }
}
