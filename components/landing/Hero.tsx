import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeroProps {
  badge?: string
  title: string
  description: string
  image?: {
    src: string
    alt: string
    width: number
    height: number
  }
  buttons?: {
    primary?: {
      label: string
      href: string
    }
    secondary?: {
      label: string
      href: string
    }
  }
  imagePosition?: "right" | "left"
}

export function Hero({ badge, title, description, image, buttons, imagePosition = "right" }: HeroProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className={`grid gap-6 lg:grid-cols-2 lg:gap-12 ${imagePosition === "left" ? "lg:grid-flow-dense" : ""}`}>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              {badge && <Badge className="inline-flex">{badge}</Badge>}
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">{title}</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">{description}</p>
            </div>
            {buttons && (
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {buttons.primary && (
                  <Link href={buttons.primary.href}>
                    <Button size="lg" className="px-8">
                      {buttons.primary.label}
                    </Button>
                  </Link>
                )}
                {buttons.secondary && (
                  <Link href={buttons.secondary.href}>
                    <Button size="lg" variant="outline" className="px-8">
                      {buttons.secondary.label}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
          {image && (
            <div className={imagePosition === "left" ? "lg:order-first" : ""}>
              <Image
                src={image.src || "/placeholder.svg"}
                width={image.width}
                height={image.height}
                alt={image.alt}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:aspect-square"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
