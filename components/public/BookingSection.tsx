'use client'

import { useState, useTransition } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { generateWhatsAppLink, isMobile } from '@/lib/whatsapp'
import { CalendarIcon, Clock, Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { trackWhatsappClick } from '@/lib/actions/analytics'
import { createBooking } from '@/app/actions/booking'
import { toast } from 'sonner'

interface BookingSectionProps {
  serviceName: string
  whatsapp: string
  availableWeekdays: number[]
  availableTimeslots: string[]
  guideId: string
  serviceId: string
}

export function BookingSection({ 
  serviceName, 
  whatsapp, 
  availableWeekdays, 
  availableTimeslots,
  guideId,
  serviceId
}: BookingSectionProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>()
  const [name, setName] = useState('')
  const [customerWhatsapp, setCustomerWhatsapp] = useState('')
  
  const [isPending, startTransition] = useTransition()

  const handleBooking = async () => {
    if (!date || !time || !name || !customerWhatsapp) {
      toast.error('Por favor completa todos los campos')
      return
    }

    // Determine if mobile
    const mobile = isMobile()
    let newWindow: Window | null = null

    // On desktop, open window immediately to avoid popup blockers
    if (!mobile) {
      newWindow = window.open('', '_blank')
      if (newWindow) {
          newWindow.document.write('Cargando WhatsApp...')
      }
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('service_id', serviceId)
        formData.append('user_id', guideId)
        formData.append('customer_name', name)
        formData.append('customer_whatsapp', customerWhatsapp)
        formData.append('date', format(date, 'yyyy-MM-dd'))
        formData.append('time', time)

        const result = await createBooking(null, formData)

        if (!result.success) {
          toast.error(result.error)
          if (newWindow) newWindow.close()
          return
        }

        toast.success(result.message)

        // Track analytics
        trackWhatsappClick('service', guideId, serviceId)
          .catch(err => console.error('Error tracking booking click:', err))

        // Redirect to WhatsApp
        const formattedDate = format(date, 'd MMM yyyy', { locale: es })
        const link = generateWhatsAppLink(whatsapp, serviceName, formattedDate, time)
        
        if (mobile) {
            window.location.href = link
        } else if (newWindow) {
            const webUrl = link.replace('https://wa.me/', 'https://web.whatsapp.com/send?phone=')
            newWindow.location.href = webUrl
        }
        
      } catch (error) {
        console.error(error)
        toast.error('Ocurrió un error inesperado')
        if (newWindow) newWindow.close()
      }
    })
  }

  // Disable dates that are not in availableWeekdays
  const isDateDisabled = (date: Date) => {
    const jsDay = date.getDay()
    const ourDay = jsDay === 0 ? 6 : jsDay - 1
    
    return !availableWeekdays.includes(ourDay) || date < new Date()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Reserva tu lugar</h3>
        
        {/* Date Picker */}
        <div className="space-y-2">
          <Label>Fecha</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-12",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={isDateDisabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Slots */}
        {date && (
          <div className="space-y-2">
            <Label>Horario</Label>
            <div className="grid grid-cols-3 gap-2">
              {availableTimeslots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={cn(
                    "py-2 px-3 rounded-lg text-sm font-medium border transition-colors",
                    time === slot
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User Details */}
        {date && time && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tu Nombre</Label>
              <Input 
                id="name" 
                placeholder="Ej. Juan Pérez" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">Tu WhatsApp</Label>
              <Input 
                id="whatsapp" 
                placeholder="+52..." 
                type="tel" 
                value={customerWhatsapp} 
                onChange={(e) => setCustomerWhatsapp(e.target.value)} 
              />
              <p className="text-xs text-muted-foreground">Te contactaremos a este número para confirmar.</p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <Button 
          onClick={handleBooking}
          disabled={!date || !time || !name || !customerWhatsapp || isPending}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12 text-lg gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Send size={20} />
              Solicitar Reserva
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
