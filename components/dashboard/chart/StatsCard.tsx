import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  change?: number
  icon?: React.ReactNode
  badge?: string
  className?: string
}

export function StatsCard({ title, value, description, change, icon, badge, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1">
          {badge && <Badge className="w-fit">{badge}</Badge>}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || change !== undefined) && (
          <div className="flex items-center space-x-2">
            {change !== undefined && (
              <span
                className={`flex items-center text-xs ${
                  change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                {change > 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : change < 0 ? (
                  <ArrowDown className="mr-1 h-3 w-3" />
                ) : (
                  <Minus className="mr-1 h-3 w-3" />
                )}
                {Math.abs(change)}%
              </span>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
