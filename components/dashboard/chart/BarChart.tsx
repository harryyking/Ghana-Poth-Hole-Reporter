"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface DataPoint {
  name: string
  [key: string]: string | number
}

interface BarChartProps {
  title?: string
  description?: string
  data: DataPoint[]
  bars: {
    dataKey: string
    fill?: string
    name?: string
    stackId?: string
  }[]
  xAxisDataKey?: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  layout?: "vertical" | "horizontal"
  badge?: string
  tabs?: string[]
  className?: string
}

export function BarChart({
  title,
  description,
  data,
  bars,
  xAxisDataKey = "name",
  height = 350,
  showGrid = true,
  showLegend = true,
  layout = "horizontal",
  badge,
  tabs,
  className,
}: BarChartProps) {
  const [activeTab, setActiveTab] = useState(tabs ? tabs[0] : undefined)

  // Filter data if tabs are provided
  const filteredData = activeTab
    ? data.filter((item) => {
        // This is a simple example. Adjust the filtering logic based on your data structure
        return item.category === activeTab || item.period === activeTab
      })
    : data

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col space-y-1">
          {badge && <Badge className="w-fit">{badge}</Badge>}
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {tabs && (
          <Tabs defaultValue={tabs[0]} onValueChange={setActiveTab} className="mt-2">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={filteredData}
              layout={layout}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis
                dataKey={layout === "horizontal" ? xAxisDataKey : undefined}
                type={layout === "horizontal" ? "category" : "number"}
              />
              <YAxis
                dataKey={layout === "vertical" ? xAxisDataKey : undefined}
                type={layout === "vertical" ? "category" : "number"}
              />
              <Tooltip />
              {showLegend && <Legend />}
              {bars.map((bar, index) => (
                <Bar
                  key={index}
                  dataKey={bar.dataKey}
                  fill={bar.fill || `hsl(${index * 40}, 70%, 50%)`}
                  name={bar.name || bar.dataKey}
                  stackId={bar.stackId}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
