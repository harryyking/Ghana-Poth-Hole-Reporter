"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface OAuthProvider {
  id: string
  name: string
  icon: React.ReactNode
  buttonStyle?: {
    background?: string
    text?: string
    hoverBackground?: string
  }
}

interface OAuthButtonsProps {
  providers: OAuthProvider[]
  onProviderClick: (providerId: string) => Promise<void>
  loading?: string | null // ID of the provider that's loading, or null if none
  layout?: "vertical" | "horizontal"
  className?: string
  dividerText?: string
}

export function OAuthButtons({
  providers,
  onProviderClick,
  loading = null,
  layout = "vertical",
  className = "",
  dividerText = "OR",
}: OAuthButtonsProps) {
  return (
    <div className={className}>
      <div
        className={`grid gap-2 ${
          layout === "horizontal" && providers.length > 1 ? "grid-cols-2 sm:grid-cols-" + providers.length : ""
        }`}
      >
        {providers.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            className={`w-full ${
              provider.buttonStyle
                ? `bg-[${provider.buttonStyle.background}] text-[${provider.buttonStyle.text}] hover:bg-[${provider.buttonStyle.hoverBackground}]`
                : ""
            }`}
            onClick={() => onProviderClick(provider.id)}
            disabled={loading !== null}
          >
            {loading === provider.id ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span className="mr-2">{provider.icon}</span>
            )}
            {provider.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
