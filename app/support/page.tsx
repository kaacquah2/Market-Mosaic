import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, Phone, Clock } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { SupportChat } from "@/components/support-chat"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function SupportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How Can We Help?</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to support you 24/7. Get answers to your questions or reach out to our team.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Email Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Send us an email and we'll respond within 24 hours.</p>
              <a href="mailto:support@marketmosaic.com" className="text-primary font-semibold hover:underline">
                support@marketmosaic.com
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Chat with our team in real-time for instant help.</p>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <a href="#chat">Start Chat</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Phone className="h-8 w-8 text-secondary mb-2" />
              <CardTitle>Phone Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Call us during business hours for immediate assistance.
              </p>
              <a href="tel:+1234567890" className="text-primary font-semibold hover:underline">
                +1 (234) 567-890
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monday - Friday: 9AM - 6PM EST
                <br />
                Saturday - Sunday: 10AM - 4PM EST
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="bg-card rounded-xl p-8 border border-border">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "What's your return policy?",
                a: "We offer 30-day returns on all items in original condition with tags attached.",
              },
              {
                q: "How long does shipping take?",
                a: "Standard shipping takes 5-7 business days. Express shipping available for 2-3 days.",
              },
              {
                q: "Do you ship internationally?",
                a: "Yes! We ship to over 100 countries. International shipping rates apply.",
              },
              {
                q: "How can I track my order?",
                a: "You'll receive a tracking number via email once your order ships.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-border pb-6 last:border-0">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Chat Section */}
        <div id="chat" className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Live Support Chat</h2>
          <SupportChat />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 bg-foreground/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Market Mosaic. All rights reserved. Quality marketplace.</p>
        </div>
      </footer>
    </div>
  )
}
