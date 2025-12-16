'use client'

import { useState } from 'react'
import { Phone, Check, X, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateBookingStatus, type BookingWithService } from '@/app/actions/bookings'

interface BookingCardProps {
  booking: BookingWithService
}

const statusConfig = {
  pending_confirmation: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmada',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Check,
  },
  cancelled: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: X,
  },
  completed: {
    label: 'Completada',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Check,
  },
}

export function BookingCard({ booking }: BookingCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(booking.status)
  
  const status = statusConfig[currentStatus]
  const StatusIcon = status.icon

  const handleStatusUpdate = async (newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    setIsLoading(true)
    const result = await updateBookingStatus(booking.id, newStatus)
    if (result.success) {
      setCurrentStatus(newStatus)
    }
    setIsLoading(false)
  }

  const handleWhatsAppContact = () => {
    const cleanPhone = booking.customer_whatsapp.replace(/[\s+]/g, '')
    const message = encodeURIComponent(
      `Hola ${booking.customer_name}! 👋\n\nTe escribo respecto a tu reservación para "${booking.service?.title || 'nuestro tour'}" el día ${formatDate(booking.date)} a las ${booking.time}.\n\n¿Cómo puedo ayudarte?`
    )
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank')
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header with status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {booking.service?.title || 'Servicio eliminado'}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDate(booking.date)} • {booking.time}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
          <StatusIcon size={12} />
          {status.label}
        </span>
      </div>

      {/* Customer info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <p className="text-sm font-medium text-gray-900">{booking.customer_name}</p>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Phone size={14} />
          {booking.customer_whatsapp}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {/* WhatsApp contact button - always visible */}
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
          onClick={handleWhatsAppContact}
        >
          <MessageCircle size={16} className="mr-1" />
          WhatsApp
        </Button>

        {/* Conditional action buttons based on status */}
        {currentStatus === 'pending_confirmation' && (
          <>
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={() => handleStatusUpdate('confirmed')}
              disabled={isLoading}
            >
              <Check size={16} className="mr-1" />
              Confirmar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={isLoading}
            >
              <X size={16} />
            </Button>
          </>
        )}

        {currentStatus === 'confirmed' && (
          <>
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              onClick={() => handleStatusUpdate('completed')}
              disabled={isLoading}
            >
              <Check size={16} className="mr-1" />
              Completar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={isLoading}
            >
              <X size={16} />
            </Button>
          </>
        )}
      </div>

      {/* Created date */}
      <p className="text-xs text-gray-400 mt-3">
        Recibida: {new Date(booking.created_at).toLocaleDateString('es-MX', { 
          day: 'numeric', 
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </div>
  )
}
