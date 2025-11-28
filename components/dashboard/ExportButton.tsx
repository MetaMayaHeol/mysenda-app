'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { downloadAsCsv } from '@/lib/utils/export'

interface ExportButtonProps {
  data: any[]
  filename?: string
}

export function ExportButton({ data, filename = 'analytics.csv' }: ExportButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => downloadAsCsv(data, filename)}
      disabled={!data || data.length === 0}
    >
      <Download className="mr-2 h-4 w-4" />
      Exportar CSV
    </Button>
  )
}
