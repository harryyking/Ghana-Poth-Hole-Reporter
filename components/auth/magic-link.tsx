"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Mail } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define form validation schema
const magicLinkSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

interface MagicLinkFormProps {
  onSubmit: (values: { email: string }) => Promise<void>
  loading?: boolean
  error?: string
  success?: boolean
  successMessage?: string
  redirectText?: string
  redirectHref?: string
  redirectLinkText?: string
  className?: string
}

export function MagicLinkForm({
  onSubmit,
  loading = false,
  error,
  success = false,
  successMessage = "Check your email for the magic link",
  redirectText,
  redirectHref,
  redirectLinkText,
  className,
}: MagicLinkFormProps) {
  const [emailSent, setEmailSent] = useState(success)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(30)

  // Initialize the form
  const form = useForm<z.infer<typeof magicLinkSchema>>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  })

  // Handle form submission
  const handleSubmit = async (values: z.infer<typeof magicLinkSchema>) => {
    try {
      await onSubmit(values)
      setEmailSent(true)
      startResendCountdown()
    } catch (error) {
      // Error handling is done via the error prop
    }
  }

  // Handle resend functionality
  const handleResend = async () => {
    if (resendDisabled) return

    const values = form.getValues()
    if (!magicLinkSchema.safeParse(values).success) {
      form.trigger("email")
      return
    }

    try {
      await onSubmit(values)
      startResendCountdown()
    } catch (error) {
      // Error handling is done via the error prop
    }
  }

  // Start countdown for resend button
  const startResendCountdown = () => {
    setResendDisabled(true)
    setCountdown(30)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Magic Link Sign In</CardTitle>
        <CardDescription>
          {emailSent
            ? "Check your email for the magic link"
            : "Enter your email to receive a magic link for passwordless sign in"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {emailSent ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-muted bg-muted/50 p-6 text-center">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Check your inbox</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We've sent a magic link to <strong>{form.getValues().email}</strong>
              </p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Didn't receive the email?{" "}
              <Button variant="link" className="p-0 text-primary" onClick={handleResend} disabled={resendDisabled}>
                {resendDisabled ? `Resend in ${countdown}s` : "Click to resend"}
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Magic Link
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      {redirectText && redirectHref && redirectLinkText && (
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            {redirectText}{" "}
            <Link href={redirectHref} className="font-medium text-primary hover:underline">
              {redirectLinkText}
            </Link>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
