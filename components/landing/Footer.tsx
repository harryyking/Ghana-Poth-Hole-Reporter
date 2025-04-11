import type React from "react"
import Link from "next/link"

interface FooterColumn {
  title: string
  links: {
    label: string
    href: string
  }[]
}

interface SocialLink {
  icon: React.ReactNode
  href: string
  label: string
}

interface FooterProps {
  logo?: React.ReactNode
  description?: string
  columns?: FooterColumn[]
  socialLinks?: SocialLink[]
  bottomLinks?: {
    label: string
    href: string
  }[]
  copyright?: string
}

export function Footer({
  logo,
  description,
  columns = [],
  socialLinks = [],
  bottomLinks = [],
  copyright = `© ${new Date().getFullYear()} Acme Inc. All rights reserved.`,
}: FooterProps) {
  return (
    <footer className="w-full border-t bg-background py-12">
      <div className="container px-4 md:px-6">
        <div
          className={`grid gap-10 ${columns.length > 0 ? "md:grid-cols-2 lg:grid-cols-" + (columns.length + 1) : ""}`}
        >
          <div className={columns.length > 0 ? "md:col-span-2 lg:col-span-1" : ""}>
            {logo ? (
              logo
            ) : (
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">A</span>
                </div>
                <span className="font-bold">Acme Inc</span>
              </Link>
            )}
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
            {socialLinks.length > 0 && (
              <div className="mt-4 flex gap-4">
                {socialLinks.map((link, index) => (
                  <Link key={index} href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.icon}
                    <span className="sr-only">{link.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="text-sm font-medium">{column.title}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {(bottomLinks.length > 0 || copyright) && (
          <div className="mt-10 border-t pt-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              {copyright && <p className="text-xs text-muted-foreground">{copyright}</p>}
              {bottomLinks.length > 0 && (
                <div className="flex gap-4">
                  {bottomLinks.map((link, index) => (
                    <Link key={index} href={link.href} className="text-xs text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}
