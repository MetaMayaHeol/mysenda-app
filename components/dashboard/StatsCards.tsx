import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, MapPin, User } from 'lucide-react'

interface StatsCardsProps {
  totalViews: number
  profileViews: number
  serviceViews: number
}

export function StatsCards({ totalViews, profileViews, serviceViews }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vistas Totales (30 días)</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalViews}</div>
          <p className="text-xs text-muted-foreground">
            Personas interesadas en tu perfil
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vistas de Perfil</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profileViews}</div>
          <p className="text-xs text-muted-foreground">
            {totalViews > 0 ? Math.round((profileViews / totalViews) * 100) : 0}% del tráfico total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vistas de Servicios</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{serviceViews}</div>
          <p className="text-xs text-muted-foreground">
            {totalViews > 0 ? Math.round((serviceViews / totalViews) * 100) : 0}% del tráfico total
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
