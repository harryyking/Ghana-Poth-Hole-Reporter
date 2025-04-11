"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { UsernamePasswordForm } from "./username-password"
import { MagicLinkForm } from "./magic-link"
import { OAuthButtons } from "./oauth"

interface AuthFormProps {
  title?: string
  description?: string
  defaultTab?: "login" | "register"
  showTabs?: boolean
  showMagicLink?: boolean
  showOAuth?: boolean
  oauthProviders?: {
    id: string
    name: string
    icon: React.ReactNode
    buttonStyle?: {
      background?: string
      text?: string
      hoverBackground?: string
    }
  }[]
  onLogin: (values: any) => Promise<void>
  onRegister: (values: any) => Promise<void>
  onMagicLink?: (values: { email: string }) => Promise<void>
  onOAuthProviderClick?: (providerId: string) => Promise<void>
  loading?: {
    login?: boolean
    register?: boolean
    magicLink?: boolean
    oauth?: string | null
  }
  error?: {
    login?: string
    register?: string
    magicLink?: string
  }
  magicLinkSuccess?: boolean
  className?: string
}

export function AuthForm({
  title,
  description,
  defaultTab = "login",
  showTabs = true,
  showMagicLink = true,
  showOAuth = true,
  oauthProviders = [],
  onLogin,
  onRegister,
  onMagicLink,
  onOAuthProviderClick,
  loading = {},
  error = {},
  magicLinkSuccess = false,
  className,
}: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab)

  return (
    <Card className={`w-full max-w-md ${className || ""}`}>
      <CardHeader>
        {title && <CardTitle className="text-2xl">{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {showTabs ? (
          <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              {showOAuth && oauthProviders.length > 0 && onOAuthProviderClick && (
                <>
                  <OAuthButtons
                    providers={oauthProviders}
                    onProviderClick={onOAuthProviderClick}
                    loading={loading.oauth}
                  />
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
                    </div>
                  </div>
                </>
              )}
              <UsernamePasswordForm
                type="login"
                onSubmit={onLogin}
                loading={loading.login}
                error={error.login}
                redirectText="Don't have an account?"
                redirectHref="#"
                redirectLinkText="Sign up"
                className="border-none shadow-none"
              />
              {showMagicLink && onMagicLink && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => setActiveTab("magic-link")}
                  >
                    Sign in with magic link
                  </button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="register" className="mt-4">
              {showOAuth && oauthProviders.length > 0 && onOAuthProviderClick && (
                <>
                  <OAuthButtons
                    providers={oauthProviders}
                    onProviderClick={onOAuthProviderClick}
                    loading={loading.oauth}
                  />
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
                    </div>
                  </div>
                </>
              )}
              <UsernamePasswordForm
                type="register"
                onSubmit={onRegister}
                loading={loading.register}
                error={error.register}
                redirectText="Already have an account?"
                redirectHref="#"
                redirectLinkText="Sign in"
                className="border-none shadow-none"
              />
            </TabsContent>
            {showMagicLink && onMagicLink && (
              <TabsContent value="magic-link" className="mt-4">
                <MagicLinkForm
                  onSubmit={onMagicLink}
                  loading={loading.magicLink}
                  error={error.magicLink}
                  success={magicLinkSuccess}
                  redirectText="Back to"
                  redirectHref="#"
                  redirectLinkText="Sign in"
                  className="border-none shadow-none"
                />
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <>
            {showOAuth && oauthProviders.length > 0 && onOAuthProviderClick && (
              <>
                <OAuthButtons
                  providers={oauthProviders}
                  onProviderClick={onOAuthProviderClick}
                  loading={loading.oauth}
                />
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
                  </div>
                </div>
              </>
            )}
            {activeTab === "login" && (
              <UsernamePasswordForm
                type="login"
                onSubmit={onLogin}
                loading={loading.login}
                error={error.login}
                redirectText="Don't have an account?"
                redirectHref="#"
                redirectLinkText="Sign up"
                className="border-none shadow-none"
              />
            )}
            {activeTab === "register" && (
              <UsernamePasswordForm
                type="register"
                onSubmit={onRegister}
                loading={loading.register}
                error={error.register}
                redirectText="Already have an account?"
                redirectHref="#"
                redirectLinkText="Sign in"
                className="border-none shadow-none"
              />
            )}
            {activeTab === "magic-link" && showMagicLink && onMagicLink && (
              <MagicLinkForm
                onSubmit={onMagicLink}
                loading={loading.magicLink}
                error={error.magicLink}
                success={magicLinkSuccess}
                redirectText="Back to"
                redirectHref="#"
                redirectLinkText="Sign in"
                className="border-none shadow-none"
              />
            )}
            {showMagicLink && onMagicLink && activeTab === "login" && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:underline"
                  onClick={() => setActiveTab("magic-link")}
                >
                  Sign in with magic link
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline underline-offset-2 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  )
}
