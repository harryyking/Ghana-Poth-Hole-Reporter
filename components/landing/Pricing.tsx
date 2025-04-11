import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface PricingTier {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  buttonLink: string
  buttonVariant?: "default" | "outline"
  highlighted?: boolean
}

interface PricingSectionProps {
  badge?: string
  title: string
  description: string
  pricingTiers: PricingTier[]
  pricingPeriod?: string
}

export function PricingSection({
  badge,
  title,
  description,
  pricingTiers,
  pricingPeriod = "/month",
}: PricingSectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            {badge && <Badge className="inline-flex">{badge}</Badge>}
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">{title}</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {description}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <PricingCard
              key={index}
              title={tier.title}
              price={tier.price}
              pricingPeriod={pricingPeriod}
              description={tier.description}
              features={tier.features}
              buttonText={tier.buttonText}
              buttonLink={tier.buttonLink}
              buttonVariant={tier.buttonVariant}
              highlighted={tier.highlighted}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface PricingCardProps {
  title: string
  price: string
  pricingPeriod: string
  description: string
  features: string[]
  buttonText: string
  buttonLink: string
  buttonVariant?: "default" | "outline"
  highlighted?: boolean
}

export function PricingCard({
  title,
  price,
  pricingPeriod,
  description,
  features,
  buttonText,
  buttonLink,
  buttonVariant = "default",
  highlighted = false,
}: PricingCardProps) {
  return (
    <Card className={`flex flex-col ${highlighted ? "border-primary shadow-lg" : ""}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground">{pricingPeriod}</span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant={buttonVariant} className="w-full" asChild>
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
