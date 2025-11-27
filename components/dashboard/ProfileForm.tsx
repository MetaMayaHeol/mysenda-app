'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormValues } from '@/lib/utils/validators'
import { updateProfile } from '@/app/dashboard/profile/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/dashboard/ImageUploader'
import { toast } from 'sonner'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { useRouter } from 'next/navigation'

interface ProfileFormProps {
  initialData: ProfileFormValues
  userId: string
}

export function ProfileForm({ initialData, userId }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true)
    try {
      const result = await updateProfile(data)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Perfil actualizado correctamente')
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
      {/* Profile Photo */}
      <ImageUploader
        value={form.watch('photo_url') || ''}
        onChange={(url) => form.setValue('photo_url', url)}
        bucket="guide-photos"
        path={`${userId}/profile`}
      />

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <Input
          id="name"
          placeholder="Tu nombre"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Biografía</Label>
        <Textarea
          id="bio"
          placeholder="Cuéntanos sobre ti..."
          rows={4}
          {...form.register('bio')}
        />
        {form.formState.errors.bio && (
          <p className="text-sm text-red-500">{form.formState.errors.bio.message}</p>
        )}
      </div>

      {/* WhatsApp */}
      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input
          id="whatsapp"
          type="tel"
          placeholder="+521234567890"
          {...form.register('whatsapp')}
        />
        {form.formState.errors.whatsapp && (
          <p className="text-sm text-red-500">{form.formState.errors.whatsapp.message}</p>
        )}
      </div>

      {/* Language */}
      <div className="space-y-2">
        <Label htmlFor="language">Idioma principal</Label>
        <select
          id="language"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          {...form.register('language')}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
        {form.formState.errors.language && (
          <p className="text-sm text-red-500">{form.formState.errors.language.message}</p>
        )}
      </div>

      <LoadingButton 
        type="submit" 
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12"
        loading={loading}
        loadingText="Guardando..."
      >
        Guardar cambios
      </LoadingButton>
    </form>
  )
}
