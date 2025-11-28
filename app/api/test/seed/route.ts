import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client with service role key if available, otherwise anon key
// Note: For full user creation we'd need service role, but for public profile testing
// we can try inserting directly if RLS allows, or we might need the user to provide the key.
// For now, assuming we are in dev mode and might have RLS open or using anon key for public tables.

export async function GET(request: Request) {
  // 0. Security Checks
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Test routes disabled in production' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const adminSecret = process.env.TEST_ADMIN_SECRET

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // Use service role key to bypass RLS, fallback to anon key (which will fail for inserts usually)
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const testGuides = [
    {
      name: 'Alejandra García',
      bio: 'Apasionada por la historia de México y la gastronomía local. Llevo 5 años mostrando los secretos del Centro Histórico.',
      city: 'Ciudad de México',
      country: 'México',
      languages: ['es', 'en'],
      whatsapp: '525512345678',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400',
    },
    {
      name: 'Carlos Rivera',
      bio: 'Certified adventure guide. I love taking travelers to hidden cenotes and jungle treks in the Riviera Maya.',
      city: 'Tulum',
      country: 'México',
      languages: ['en', 'es', 'fr'],
      whatsapp: '529981234567',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400',
    },
    {
      name: 'Sophie Martin',
      bio: 'Guide francophone à Oaxaca. Je vous fais découvrir l\'artisanat et les traditions zapatèques.',
      city: 'Oaxaca',
      country: 'México',
      languages: ['fr', 'en'],
      whatsapp: '529511234567',
      photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400',
    },
    {
      name: 'Miguel Ángel',
      bio: 'Experto en arqueología maya. Tours privados a Chichén Itzá y Ek Balam con enfoque histórico.',
      city: 'Valladolid',
      country: 'México',
      languages: ['es'],
      whatsapp: '529851234567',
      photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400',
    },
    {
      name: 'Sarah Jenkins',
      bio: 'Foodie tours in Mexico City. Lets eat tacos, churros and drink mezcal in the best local spots.',
      city: 'Ciudad de México',
      country: 'México',
      languages: ['en', 'es', 'de'],
      whatsapp: '525587654321',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400',
    }
  ]

  const results = []

  for (const guide of testGuides) {
    // 1. Create User (Mocking auth user ID with random UUID)
    const mockId = crypto.randomUUID()
    const email = `test_guide_${mockId.slice(0, 8)}@rutalink.test`
    
    // Insert into users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: mockId,
        email,
        name: guide.name,
        bio: guide.bio,
        city: guide.city,
        country: guide.country,
        whatsapp: guide.whatsapp,
        photo_url: guide.photo_url,
        languages: guide.languages
      })

    if (userError) {
      console.error('Error creating user:', userError)
      results.push({ name: guide.name, status: 'failed', error: userError })
      continue
    }

    // 2. Create Public Link
    const slug = `test-guide-${mockId.slice(0, 8)}`
    const { error: linkError } = await supabase
      .from('public_links')
      .insert({
        user_id: mockId,
        slug
      })

    if (linkError) {
      console.error('Error creating link:', linkError)
    }

    // 3. Create Services
    const services = [
      {
        title: 'Tour Histórico',
        description: 'Recorrido de 3 horas por los principales monumentos.',
        price: 500,
        duration: 180,
        active: true
      },
      {
        title: 'Experiencia Gastronómica',
        description: 'Prueba los mejores tacos de la ciudad.',
        price: 800,
        duration: 240,
        active: true
      }
    ]

    for (const service of services) {
      await supabase
        .from('services')
        .insert({
          user_id: mockId,
          title: service.title,
          description: service.description,
          price: service.price,
          duration: service.duration,
          active: service.active
        })
    }

    results.push({ name: guide.name, slug, status: 'success' })
  }

  return NextResponse.json({ 
    message: 'Seeding completed', 
    results,
    cleanup_url: `${new URL(request.url).origin}/api/test/cleanup?secret=rutalink-test-admin`
  })
}
