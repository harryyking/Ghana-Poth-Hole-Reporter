"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart as RechartsLineChart,
  Line,
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

interface LineChartProps {
  title?: string
  description?: string
  data: DataPoint[]
  lines: {
    dataKey: string
    stroke?: string
    name?: string
  }[]
  xAxisDataKey?: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  badge?: string
  tabs?: string[]
  className?: string
}

export function LineChart({
  title,
  description,
  data,
  lines,
  xAxisDataKey = "name",
  height = 350,
  showGrid = true,
  showLegend = true,
  badge,
  tabs,
  className,
}: LineChartProps) {
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
            <RechartsLineChart
              data={filteredData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxisDataKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke || `hsl(${index * 40}, 70%, 50%)`}
                  name={line.name || line.dataKey}
                  activeDot={{ r: 8 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}