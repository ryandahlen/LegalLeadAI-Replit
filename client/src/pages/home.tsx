import ChatInterface from "@/components/chat/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Speak with a Legal Professional
          </h1>
          <p className="text-lg text-muted-foreground">
            Tell us about your case and we'll connect you with the right legal expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
              alt="Legal consultation"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4">
              Expert Legal Guidance
            </h2>
            <p className="text-muted-foreground mb-6">
              Our team of experienced attorneys is ready to help you navigate your legal challenges.
              We handle a wide range of cases including personal injury, family law, criminal defense,
              and more.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get help whenever you need it
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Free Consultation</h3>
                <p className="text-sm text-muted-foreground">
                  Understand your options
                </p>
              </div>
            </div>
          </div>
        </div>

        <ChatInterface />
      </div>
    </div>
  );
}
