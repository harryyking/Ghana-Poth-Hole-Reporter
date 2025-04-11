"use client"

import type React from "react"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string
  href: string
}

interface HeaderProps {
  logo?: React.ReactNode
  navItems: NavItem[]
  ctaButtons?: {
    primary?: {
      label: string
      href: string
    }
    secondary?: {
      label: string
      href: string
    }
  }
}

export function Header({ logo, navItems, ctaButtons }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
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
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        {ctaButtons && (
          <div className="hidden md:flex gap-4">
            {ctaButtons.secondary && (
              <Link href={ctaButtons.secondary.href}>
                <Button variant="outline">{ctaButtons.secondary.label}</Button>
              </Link>
            )}
            {ctaButtons.primary && (
              <Link href={ctaButtons.primary.href}>
                <Button>{ctaButtons.primary.label}</Button>
              </Link>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4">
          <div className="container flex flex-col gap-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {ctaButtons && (
              <div className="flex gap-4 mt-2">
                {ctaButtons.secondary && (
                  <Link href={ctaButtons.secondary.href} className="w-full">
                    <Button variant="outline" className="w-full">
                      {ctaButtons.secondary.label}
                    </Button>
                  </Link>
                )}
                {ctaButtons.primary && (
                  <Link href={ctaButtons.primary.href} className="w-full">
                    <Button className="w-full">{ctaButtons.primary.label}</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
