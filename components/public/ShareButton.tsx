'use client'

import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import { ReactNode } from 'react'

interface ShareButtonProps {
  title: string
  text: string
  url: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  children?: ReactNode
}

export function ShareButton({ title, text, url, className, variant = "outline", children }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        toast.success('Enlace copiado al portapapeles')
      } catch (error) {
        toast.error('No se pudo copiar el enlace')
      }
    }
  }

  return (
    <Button
      variant={variant}
      size={children ? "default" : "icon"}
      className={className || "rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"}
      onClick={handleShare}
      title="Compartir perfil"
    >
      {children || <Share2 size={20} className="text-gray-700" />}
    </Button>
  )
}
