import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Shield, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center space-y-12 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            
            🇬🇭 Made for Ghana
          </Badge>
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Reports Map
              <span className="block text-primary">Ghana</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed md:text-xl">
              Empowering communities across Ghana to report, track, and resolve local issues through transparency and
              collective action.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Location-Based</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Report issues with precise location data for accurate tracking
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Community-Driven</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Built by Ghanaians, for Ghanaians to strengthen our communities
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Transparent</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Track progress and ensure accountability in real-time
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center space-y-4 pt-8">
            <Link href="/map">
              <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-full group">
                Explore the Map
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <p className="text-sm text-muted-foreground max-w-md">
              Join thousands of Ghanaians making their voices heard and driving positive change.
            </p>
          </div>

          {/* Stats or Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>1,000+ Reports Filed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>16 Regions Covered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>500+ Issues Resolved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
