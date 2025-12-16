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

    it('should require at least one language', () => {
      const result = profileSchema.safeParse({
        name: 'John',
        country: 'Mexico',
        languages: [],
      })
      expect(result.success).toBe(false)
    })

    it('should reject name shorter than 2 characters', () => {
      const result = profileSchema.safeParse({
        name: 'J',
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

    it('should reject invalid date format', () => {
      const result = bookingSchema.safeParse({
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        customer_name: 'Jane',
        customer_whatsapp: '+529991234567',
        date: 'not-a-date',
        time: '10:00',
      })
      expect(result.success).toBe(false)
    })

    it('should reject XSS in customer name', () => {
      const result = bookingSchema.safeParse({
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        customer_name: '<script>alert(1)</script>',
        customer_whatsapp: '+529991234567',
        date: '2025-12-25',
        time: '10:00',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('serviceSchema', () => {
    it('should validate a correct service', () => {
      const result = serviceSchema.safeParse({
        title: 'Tour Histórico Centro',
        price: 500,
        duration: 120,
        locations: ['Mérida'],
        categories: ['cultural'],
      })
      expect(result.success).toBe(true)
    })

    it('should reject negative price', () => {
      const result = serviceSchema.safeParse({
        title: 'Tour Test',
        price: -100,
        duration: 60,
        locations: ['Cancun'],
        categories: ['aventura'],
      })
      expect(result.success).toBe(false)
    })

    it('should reject duration less than 15 minutes', () => {
      const result = serviceSchema.safeParse({
        title: 'Quick Tour',
        price: 100,
        duration: 10, // Too short
        locations: ['Cancun'],
        categories: ['aventura'],
      })
      expect(result.success).toBe(false)
    })

    it('should require at least one location', () => {
      const result = serviceSchema.safeParse({
        title: 'Tour Test',
        price: 100,
        duration: 60,
        locations: [], // Empty
        categories: ['aventura'],
      })
      expect(result.success).toBe(false)
    })

    it('should require at least one category', () => {
      const result = serviceSchema.safeParse({
        title: 'Tour Test',
        price: 100,
        duration: 60,
        locations: ['Cancun'],
        categories: [], // Empty
      })
      expect(result.success).toBe(false)
    })

    it('should reject XSS in title', () => {
      const result = serviceSchema.safeParse({
        title: '<script>alert(1)</script>',
        price: 100,
        duration: 60,
        locations: ['Cancun'],
        categories: ['aventura'],
      })
      expect(result.success).toBe(false)
    })

    it('should accept valid cancellation policy', () => {
      const result = serviceSchema.safeParse({
        title: 'Tour Test',
        price: 100,
        duration: 60,
        locations: ['Cancun'],
        categories: ['cultural'],
        cancellation_policy: 'strict',
      })
      expect(result.success).toBe(true)
    })

    it('should accept max 5 photos', () => {
      const result = serviceSchema.safeParse({
        title: 'Tour Test',
        price: 100,
        duration: 60,
        locations: ['Cancun'],
        categories: ['cultural'],
        photos: [
          'https://example.com/1.jpg',
          'https://example.com/2.jpg',
          'https://example.com/3.jpg',
          'https://example.com/4.jpg',
          'https://example.com/5.jpg',
        ],
      })
      expect(result.success).toBe(true)
    })

    it('should reject more than 5 photos', () => {
      const result = serviceSchema.safeParse({
        title: 'Tour Test',
        price: 100,
        duration: 60,
        locations: ['Cancun'],
        categories: ['cultural'],
        photos: [
          'https://example.com/1.jpg',
          'https://example.com/2.jpg',
          'https://example.com/3.jpg',
          'https://example.com/4.jpg',
          'https://example.com/5.jpg',
          'https://example.com/6.jpg', // Too many
        ],
      })
      expect(result.success).toBe(false)
    })
  })
})
