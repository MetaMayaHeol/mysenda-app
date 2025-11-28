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

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            placeholder="Ej: Tulum"
            {...form.register('city')}
          />
          {form.formState.errors.city && (
            <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Input
            id="country"
            defaultValue="México"
            {...form.register('country')}
          />
          {form.formState.errors.country && (
            <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
          )}
        </div>
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

      {/* Languages */}
      <div className="space-y-2">
        <Label>Idiomas que hablas</Label>
        <p className="text-sm text-gray-500 mb-3">Selecciona todos los idiomas en los que puedes guiar</p>
        <div className="grid grid-cols-2 gap-3">
          {(['es', 'en', 'fr', 'pt', 'de', 'it', 'zh', 'ja'] as const).map((lang) => {
            const languageNames = {
              es: 'Español',
              en: 'English',
              fr: 'Français',
              pt: 'Português',
              de: 'Deutsch',
              it: 'Italiano',
              zh: '中文',
              ja: '日本語'
            }
            
            const currentLanguages = form.watch('languages') || []
            const isChecked = currentLanguages.includes(lang)
            
            return (
              <label
                key={lang}
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  isChecked 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    const current = form.getValues('languages') || []
                    if (e.target.checked) {
                      form.setValue('languages', [...current, lang])
                    } else {
                      form.setValue('languages', current.filter(l => l !== lang))
                    }
                  }}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium">{languageNames[lang]}</span>
              </label>
            )
          })}
        </div>
        {form.formState.errors.languages && (
          <p className="text-sm text-red-500">{form.formState.errors.languages.message}</p>
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
