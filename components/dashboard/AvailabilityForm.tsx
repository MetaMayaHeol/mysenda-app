'use client'

import { useState } from 'react'
import { saveAvailability, type AvailabilityData } from '@/app/actions/availability'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { useTranslations } from 'next-intl'

interface AvailabilityFormProps {
  initialWeekdays: { weekday: number; active: boolean }[]
  initialTimeslots: { time: string; active: boolean }[]
}

const DEFAULT_TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
]

export function AvailabilityForm({ initialWeekdays, initialTimeslots }: AvailabilityFormProps) {
  const t = useTranslations('availabilityForm')
  const [loading, setLoading] = useState(false)
  
  const weekdayNames = [
    t('monday'),
    t('tuesday'),
    t('wednesday'),
    t('thursday'),
    t('friday'),
    t('saturday'),
    t('sunday'),
  ]
  
  // Initialize state merging defaults with initial data
  // weekday: 0=Lunes, 1=Martes, ..., 6=Domingo (matches database constraint 0-6)
  const [weekdays, setWeekdays] = useState(() => {
    return weekdayNames.map((name, index) => {
      const saved = initialWeekdays.find((d) => d.weekday === index)
      return {
        weekday: index,
        name: name,
        active: saved ? saved.active : true, // Default to true if not set
      }
    })
  })

  const [timeslots, setTimeslots] = useState(() => {
    return DEFAULT_TIME_SLOTS.map((time) => {
      const saved = initialTimeslots.find((t) => t.time === time)
      return {
        time,
        active: saved ? saved.active : true, // Default to true if not set
      }
    })
  })

  const handleWeekdayToggle = (index: number) => {
    const newWeekdays = [...weekdays]
    newWeekdays[index].active = !newWeekdays[index].active
    setWeekdays(newWeekdays)
  }

  const handleTimeslotToggle = (index: number) => {
    const newTimeslots = [...timeslots]
    newTimeslots[index].active = !newTimeslots[index].active
    setTimeslots(newTimeslots)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const data: AvailabilityData = {
      weekdays: weekdays.map(({ weekday, active }) => ({ weekday, active })),
      timeslots: timeslots.map(({ time, active }) => ({ time, active })),
    }

    try {
      const result = await saveAvailability(data)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(t('availabilitySaved'))
      }
    } catch (_error) {
      toast.error(t('unexpectedError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Weekdays */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">{t('availableDays')}</h3>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {weekdays.map((day, index) => (
            <div key={day.weekday} className="flex items-center justify-between p-4">
              <span className="font-medium text-gray-700">{day.name}</span>
              <Switch
                checked={day.active}
                onCheckedChange={() => handleWeekdayToggle(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">{t('availableHours')}</h3>
        <p className="text-sm text-gray-500">
          {t('hoursDesc')}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {timeslots.map((slot, index) => (
            <button
              key={slot.time}
              type="button"
              onClick={() => handleTimeslotToggle(index)}
              className={`py-3 px-4 rounded-xl font-medium transition-colors border ${
                slot.active
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      <LoadingButton 
        type="submit" 
        className="w-full bg-green-500 hover:bg-green-600 font-bold h-12"
        loading={loading}
        loadingText={t('saving')}
      >
        {t('saveAvailability')}
      </LoadingButton>
    </form>
  )
}
