import { z } from 'zod'
import { MAX_BIO_LENGTH, SUPPORTED_LANGUAGES } from './constants'

export const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre es muy largo')
    .regex(/^[^<>]*$/, 'No se permiten caracteres especiales (< >)'),
  bio: z.string().max(MAX_BIO_LENGTH, `La biografía no puede exceder ${MAX_BIO_LENGTH} caracteres`)
    .regex(/^[^<>]*$/, 'No se permiten caracteres especiales (< >)').optional().or(z.literal('')),
  city: z.string().min(2, 'La ciudad es requerida').max(50, 'Nombre de ciudad muy largo').optional().or(z.literal('')),
  country: z.string().min(2, 'El país es requerido'),
  whatsapp: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Número de WhatsApp inválido (ej: +521234567890)').optional().or(z.literal('')),
  languages: z.array(z.enum(SUPPORTED_LANGUAGES)).min(1, 'Debes seleccionar al menos un idioma'),
  photo_url: z.string().url().optional().or(z.literal('')),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export const serviceSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100)
    .regex(/^[^<>]*$/, 'No se permiten caracteres especiales (< >)'),
  description: z.string().max(300, 'La descripción es muy larga')
    .regex(/^[^<>]*$/, 'No se permiten caracteres especiales (< >)').optional(),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  duration: z.coerce.number().min(15, 'La duración mínima es 15 minutos'),
  active: z.boolean().default(true),
  photos: z.array(z.string().url()).max(3, 'Máximo 3 fotos por servicio').optional(),
  locations: z.array(z.string()).min(1, 'Selecciona al menos una ciudad'),
  categories: z.array(z.string()).min(1, 'Selecciona al menos una categoría').default([]),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>

// ... existing exports

export const bookingSchema = z.object({
  service_id: z.string().uuid(),
  user_id: z.string().uuid(), // The guide's ID
  customer_name: z.string().min(2, 'Tu nombre es requerido').max(100).regex(/^[^<>]*$/, 'Caracteres no permitidos'),
  customer_whatsapp: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Número de WhatsApp inválido'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida'),
  time: z.string().min(1, 'Hora requerida'),
})

export type BookingFormValues = z.infer<typeof bookingSchema>

