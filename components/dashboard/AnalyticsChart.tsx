interface ChartData {
  date: string
  views: number
}

interface AnalyticsChartProps {
  data: ChartData[]
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const maxViews = Math.max(...data.map(d => d.views), 1)

  return (
    <div className="w-full h-72 flex items-end gap-1 sm:gap-2 pt-8 pb-6 px-2">
      {data.map((item, i) => {
        const heightPercentage = (item.views / maxViews) * 100
        // Show label every 5 days or if data is small
        const showLabel = data.length < 10 || i % 5 === 0

        return (
          <div key={item.date} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative">
            <div 
              className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-sm relative"
              style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 shadow-lg">
                {item.views} vistas ({new Date(item.date).toLocaleDateString()})
              </div>
            </div>
            
            {/* Date Label */}
            <div className="h-4 flex items-center justify-center w-full">
              {showLabel && (
                <div className="text-[10px] text-muted-foreground whitespace-nowrap absolute bottom-0">
                  {new Date(item.date).getDate()}/{new Date(item.date).getMonth() + 1}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
