import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateWhatsAppLink, isMobile, openWhatsApp } from './whatsapp'

describe('WhatsApp Utils', () => {
  describe('generateWhatsAppLink', () => {
    it('should generate a basic WhatsApp link with service name', () => {
      const link = generateWhatsAppLink('+521234567890', 'Tour Historique')
      
      expect(link).toContain('https://wa.me/521234567890')
      expect(link).toContain('text=')
      expect(link).toContain(encodeURIComponent('Tour Historique'))
    })

    it('should remove spaces and + from phone number', () => {
      const link = generateWhatsAppLink('+52 123 456 7890', 'Test Tour')
      
      expect(link).toContain('https://wa.me/521234567890')
    })

    it('should include date when provided', () => {
      const link = generateWhatsAppLink('+521234567890', 'Tour', '2025-12-25')
      
      expect(link).toContain(encodeURIComponent('Fecha: 2025-12-25'))
    })

    it('should include time when provided', () => {
      const link = generateWhatsAppLink('+521234567890', 'Tour', undefined, '10:00')
      
      expect(link).toContain(encodeURIComponent('Horario: 10:00'))
    })

    it('should include both date and time when provided', () => {
      const link = generateWhatsAppLink('+521234567890', 'Tour Cenote', '2025-12-25', '10:00')
      
      expect(link).toContain(encodeURIComponent('Fecha: 2025-12-25'))
      expect(link).toContain(encodeURIComponent('Horario: 10:00'))
    })

    it('should URL encode special characters in service name', () => {
      const link = generateWhatsAppLink('+521234567890', 'Tour "Especial" & Único')
      
      expect(link).toContain(encodeURIComponent('Tour "Especial" & Único'))
    })
  })

  describe('isMobile', () => {
    const originalNavigator = global.navigator

    beforeEach(() => {
      // Reset navigator mock
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: '' },
        writable: true,
        configurable: true,
      })
    })

    it('should return false when window is undefined (SSR)', () => {
      const originalWindow = global.window
      // @ts-expect-error - testing SSR scenario
      delete global.window
      
      expect(isMobile()).toBe(false)
      
      global.window = originalWindow
    })

    it('should return true for iPhone user agent', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)' },
        writable: true,
        configurable: true,
      })
      
      expect(isMobile()).toBe(true)
    })

    it('should return true for Android user agent', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G960F)' },
        writable: true,
        configurable: true,
      })
      
      expect(isMobile()).toBe(true)
    })

    it('should return false for desktop user agent', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        writable: true,
        configurable: true,
      })
      
      expect(isMobile()).toBe(false)
    })
  })

  describe('openWhatsApp', () => {
    beforeEach(() => {
      // Mock window.location and window.open
      Object.defineProperty(global, 'window', {
        value: {
          location: { href: '' },
          open: vi.fn(),
        },
        writable: true,
        configurable: true,
      })
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: '' },
        writable: true,
        configurable: true,
      })
    })

    it('should redirect to WhatsApp app on mobile', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)' },
        writable: true,
        configurable: true,
      })

      const url = 'https://wa.me/521234567890?text=Hello'
      openWhatsApp(url)
      
      expect(window.location.href).toBe(url)
    })

    it('should open WhatsApp Web in new tab on desktop', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        writable: true,
        configurable: true,
      })

      const url = 'https://wa.me/521234567890?text=Hello'
      openWhatsApp(url)
      
      expect(window.open).toHaveBeenCalledWith(
        'https://web.whatsapp.com/send?phone=521234567890?text=Hello',
        '_blank'
      )
    })
  })
})
