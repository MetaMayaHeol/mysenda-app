'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceSchema, type ServiceFormValues } from '@/lib/utils/validators'
import { createService, updateService } from '@/app/dashboard/services/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { MultiImageUploader } from '@/components/dashboard/MultiImageUploader'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ServiceFormProps {
  initialData?: ServiceFormValues
  serviceId?: string
  userId: string
}

export function ServiceForm({ initialData, serviceId, userId }: ServiceFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const defaultValues: ServiceFormValues = initialData || {
    title: '',
    description: '',
    price: 0,
    duration: 60,
    active: true,
    photos: [],
  }

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues,
  })

  const onSubmit = async (data: ServiceFormValues) => {
    setLoading(true)
    try {
      let result
      
      if (serviceId) {
        result = await updateService(serviceId, data)
      } else {
        result = await createService(data)
      }

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(serviceId ? 'Servicio actualizado' : 'Servicio creado')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Photos */}
      <MultiImageUploader
        values={form.watch('photos') || []}
        onChange={(urls) => form.setValue('photos', urls)}
        bucket="guide-photos"
        path={`${userId}/services`}
      />

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título del servicio</Label>
        <Input
          id="title"
          placeholder="Ej: Tour Cenote Azul"
          {...form.register('title')}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
        )}
      </div>

      {/* Price & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Precio (MXN/USD)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            {...form.register('price')}
          />
          {form.formState.errors.price && (
            <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duración (minutos)</Label>
          <Input
            id="duration"
            type="number"
            min="15"
            step="15"
            placeholder="60"
            {...form.register('duration')}
          />
          {form.formState.errors.duration && (
            <p className="text-sm text-red-500">{form.formState.errors.duration.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Describe lo que incluye el servicio..."
          rows={4}
          {...form.register('description')}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
        )}
        <p className="text-xs text-gray-500 text-right">
          {form.watch('description')?.length || 0}/300 caracteres
        </p>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Servicio activo</Label>
          <p className="text-sm text-gray-500">
            Visible en tu perfil público
          </p>
        </div>
        <Switch
          checked={form.watch('active')}
          onCheckedChange={(checked) => form.setValue('active', checked)}
        />
      </div>

      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 font-bold h-12" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {serviceId ? 'Guardando...' : 'Crear servicio'}
          </>
        ) : (
          serviceId ? 'Guardar cambios' : 'Crear servicio'
        )}
      </Button>
    </form>
  )
}
