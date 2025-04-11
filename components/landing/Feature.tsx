import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Feature {
  icon?: React.ReactNode
  iconText?: string
  title: string
  description: string
}

interface FeatureSectionProps {
  badge?: string
  title: string
  description: string
  features: Feature[]
  columns?: 2 | 3 | 4
  background?: "default" | "muted"
}

export function FeatureSection({
  badge,
  title,
  description,
  features,
  columns = 3,
  background = "default",
}: FeatureSectionProps) {
  return (
    <section className={`w-full py-12 md:py-24 lg:py-32 ${background === "muted" ? "bg-muted/50" : ""}`}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            {badge && <Badge className="inline-flex">{badge}</Badge>}
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">{title}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {description}
            </p>
          </div>
        </div>
        <div className={`mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-${columns}`}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              iconText={feature.iconText}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  iconText?: string
}

export function FeatureCard({ title, description, icon, iconText }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        {icon && <div className="mb-2">{icon}</div>}
        {iconText && <div className="text-3xl mb-2">{iconText}</div>}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
