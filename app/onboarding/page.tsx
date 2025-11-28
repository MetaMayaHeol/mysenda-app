'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateOnboardingProfile, createOnboardingService, completeOnboarding } from './actions'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Upload, CheckCircle, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // State for Step 1
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleProfileSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      let photoUrl = ''
      
      // Upload photo if selected
      if (photoFile) {
        const supabase = createClient()
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError, data } = await supabase.storage
          .from('guide-photos')
          .upload(fileName, photoFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('guide-photos')
          .getPublicUrl(fileName)
          
        photoUrl = publicUrl
      }

      formData.append('photo_url', photoUrl)
      
      const result = await updateOnboardingProfile(formData)
      if (result.error) throw new Error(result.error)
      
      setStep(2)
      toast.success('Perfil actualizado')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleServiceSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      const result = await createOnboardingService(formData)
      if (result.error) throw new Error(result.error)
      
      setStep(3)
      toast.success('Servicio creado')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      await completeOnboarding()
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -z-10" />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Tu Perfil Profesional</h2>
            <p className="text-gray-500">Esto es lo primero que verán los viajeros.</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-lg group cursor-pointer">
              {photoPreview ? (
                <Image src={photoPreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Upload size={32} />
                </div>
              )}
              <input 
                type="file" 
                name="photo" 
                accept="image/*" 
                onChange={handlePhotoChange} 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium pointer-events-none">
                Cambiar Foto
              </div>
            </div>
          </div>

          <form id="profile-form" className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" name="name" placeholder="Ej: Juan Pérez" required />
            </div>
            
            <div>
              <Label htmlFor="whatsapp">WhatsApp (con código de país)</Label>
              <Input id="whatsapp" name="whatsapp" placeholder="Ej: +52 1 999 123 4567" required />
              <p className="text-xs text-gray-500 mt-1">Fundamental para recibir reservas.</p>
            </div>

            <div>
              <Label htmlFor="bio">Biografía Corta</Label>
              <Textarea id="bio" name="bio" placeholder="Soy un guía apasionado por..." className="h-24" />
            </div>
          </form>

          <Button 
            type="button"
            onClick={async () => {
              const form = document.getElementById('profile-form') as HTMLFormElement
              if (form.checkValidity()) {
                const formData = new FormData(form)
                await handleProfileSubmit(formData)
              } else {
                form.reportValidity()
              }
            }}
            className="w-full h-12 text-lg bg-gray-900 hover:bg-gray-800" 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Continuar <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Tu Primer Servicio</h2>
            <p className="text-gray-500">Crea una oferta simple para empezar.</p>
          </div>

          <form id="service-form" className="space-y-4">
            <div>
              <Label htmlFor="title">Título del Tour</Label>
              <Input id="title" name="title" placeholder="Ej: Tour Histórico Centro" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio (MXN)</Label>
                <Input id="price" name="price" type="number" placeholder="500" required />
              </div>
              <div>
                <Label htmlFor="duration">Duración (minutos)</Label>
                <Input id="duration" name="duration" type="number" placeholder="120" required />
              </div>
            </div>
          </form>

          <Button 
            type="button"
            onClick={async () => {
              const form = document.getElementById('service-form') as HTMLFormElement
              if (form.checkValidity()) {
                const formData = new FormData(form)
                await handleServiceSubmit(formData)
              } else {
                form.reportValidity()
              }
            }}
            className="w-full h-12 text-lg bg-gray-900 hover:bg-gray-800" 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Crear Servicio <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">¡Todo listo! 🎉</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Tu perfil ha sido creado y tu primer servicio está activo. Ya puedes compartir tu enlace.
          </p>

          <Button onClick={handleComplete} className="w-full h-14 text-lg bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Ir a mi Dashboard
          </Button>
        </div>
      )}
    </div>
  )
}
