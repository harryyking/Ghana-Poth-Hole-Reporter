import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CTASectionProps {
  title: string
  description: string
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
  withEmailSignup?: boolean
  emailPlaceholder?: string
  emailButtonText?: string
  termsText?: string
  termsLink?: string
  background?: "default" | "primary" | "muted"
  alignment?: "center" | "left" | "right"
}

export function CTASection({
  title,
  description,
  buttons,
  withEmailSignup = false,
  emailPlaceholder = "Enter your email",
  emailButtonText = "Get Started",
  termsText = "By signing up, you agree to our Terms & Conditions",
  termsLink = "#",
  background = "default",
  alignment = "center",
}: CTASectionProps) {
  const bgClass =
    background === "primary" ? "bg-primary text-primary-foreground" : background === "muted" ? "bg-muted" : ""

  const alignClass =
    alignment === "left"
      ? "items-start text-left"
      : alignment === "right"
        ? "items-end text-right"
        : "items-center text-center"

  return (
    <section className={`w-full py-12 md:py-24 lg:py-32 ${bgClass}`}>
      <div className="container px-4 md:px-6">
        <div className={`flex flex-col ${alignClass} space-y-4`}>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">{title}</h2>
            <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">{description}</p>
          </div>
          {withEmailSignup ? (
            <div className={`w-full max-w-sm space-y-2 ${alignment === "center" ? "mx-auto" : ""}`}>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder={emailPlaceholder}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button type="submit" className="sm:w-auto">
                  {emailButtonText}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                {termsText.split("Terms & Conditions")[0]}
                <Link href={termsLink} className="underline underline-offset-2">
                  Terms & Conditions
                </Link>
                {termsText.split("Terms & Conditions")[1]}
              </p>
            </div>
          ) : buttons ? (
            <div className={`flex flex-col sm:flex-row gap-4 ${alignment === "center" ? "justify-center" : ""}`}>
              {buttons.primary && (
                <Link href={buttons.primary.href}>
                  <Button size="lg" variant={background === "primary" ? "secondary" : "default"} className="px-8">
                    {buttons.primary.label}
                  </Button>
                </Link>
              )}
              {buttons.secondary && (
                <Link href={buttons.secondary.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className={`px-8 ${background === "primary" ? "border-primary-foreground" : ""}`}
                  >
                    {buttons.secondary.label}
                  </Button>
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
