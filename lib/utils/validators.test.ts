import { describe, it, expect } from 'vitest'
import { profileSchema, bookingSchema, serviceSchema } from './validators'

describe('Validators', () => {
  describe('profileSchema', () => {
    it('should validate a correct profile', () => {
      const result = profileSchema.safeParse({
        name: 'John Doe',
        bio: 'Hello world',
        city: 'Cancun',
        country: 'Mexico',
        whatsapp: '+521234567890',
        languages: ['es', 'en'],
        photo_url: '',
      })
      expect(result.success).toBe(true)
    })

    it('should reject XSS characters in name', () => {
      const result = profileSchema.safeParse({
        name: '<script>alert(1)</script>',
        country: 'Mexico',
        languages: ['es'],
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('No se permiten caracteres especiales')
      }
    })

    it('should reject XSS characters in bio', () => {
       const result = profileSchema.safeParse({
        name: 'John',
        bio: 'I am <bold>cool</bold>',
        country: 'Mexico',
        languages: ['es'],
      })
      expect(result.success).toBe(false)
    })
  })

  describe('bookingSchema', () => {
    it('should validate correct booking', () => {
      const result = bookingSchema.safeParse({
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        customer_name: 'Jane Doe',
        customer_whatsapp: '+529991234567',
        date: '2025-12-25',
        time: '10:00',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid whatsapp', () => {
      const result = bookingSchema.safeParse({
        service_id: 'uuid',
        user_id: 'uuid',
        customer_name: 'Jane',
        customer_whatsapp: '12345', // Too short, no + maybe (regex dependent)
        date: '2025-12-25',
        time: '10:00',
      })
      expect(result.success).toBe(false)
    })
  })
})
