import { Header } from "@/components/ui/Header";
import { Hero } from "@/components/ui/Hero";
import { Features } from "@/components/ui/Features";
import { Subjects } from "@/components/ui/Subjects";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { Testimonials } from "@/components/ui/Testimonials";
import { CTA } from "@/components/ui/CTA";
import { Footer } from "@/components/ui/Footer";

export function Landing() {
    return(
        <div className="min-h-screen bg-white">
            <Header />
            <main>
            <Hero/>
            <Features />
            <Subjects />
            <HowItWorks />
            <Testimonials />
            <CTA />
            </main>
            <Footer />
        </div>

    )
}

export default Landing;