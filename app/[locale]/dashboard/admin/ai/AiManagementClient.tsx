'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { triggerIndexing } from '@/app/actions/admin-ai'
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react'

export function AiManagementClient() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleReindex = async () => {
    if (!confirm('¿Estás seguro de que quieres re-indexar todos los servicios? Esto consumirá tokens de OpenAI.')) return

    setLoading(true)
    setStatus(null)

    const result = await triggerIndexing()

    setLoading(false)

    if (result.error) {
      setStatus({ type: 'error', message: `Error: ${result.error}` })
    } else {
      // Cast to any to access dynamic property or use type assertion if we shared types
      setStatus({ type: 'success', message: `Éxito: ${(result as any).indexed} servicios indexados.` })
    }
  }

  return (
    <div className="grid gap-6">
      {/* Indexer Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              <Database className="text-blue-500" size={20} />
              Indexación de Servicios
            </h3>
            <p className="text-sm text-gray-500">
              Convierte los servicios activos en vectores para la búsqueda semántica.
            </p>
          </div>
          <Button 
            onClick={handleReindex} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Indexando...
              </>
            ) : (
              'Iniciar Indexación'
            )}
          </Button>
        </div>

        {status && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{status.message}</span>
          </div>
        )}

        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-xs text-gray-600 font-mono">
          <p>Target Table: public.knowledge_embeddings</p>
          <p>Model: text-embedding-3-small (1536 dims)</p>
        </div>
      </div>
    </div>
  )
}
