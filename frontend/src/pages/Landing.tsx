import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Brain, Users, Mail, ChevronDown, Globe, Phone, MapPin, Quote } from "lucide-react";
import teacherPhoto from "@/assets/teacher-full.png";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const navLinks = ["Home", "About", "Classes", "Results", "Contact"];
const categories = ["Physics"];

const testimonials = [
  { name: "Kasun Perera", batch: "2025 A/L", text: "Phy6 Master completely changed how I understand Physics. The teaching style is very easy to follow and exam-oriented." },
  { name: "Nimali Fernando", batch: "2024 A/L", text: "I scored an A for Physics thanks to the structured approach and constant support. Highly recommend to all A/L students!" },
  { name: "Tharindu Silva", batch: "2025 A/L", text: "The online classes are just as effective as in-person. Sir explains even the hardest concepts in a simple way." },
  { name: "Sachini Jayawardena", batch: "2024 A/L", text: "Best Physics class I've attended. The revision sessions and past paper discussions were extremely helpful." },
];

const courses = [
  { id: 1, subject: "Physics", badge: "PHYSICS", badgeColor: "bg-primary text-primary-foreground", title: "Physics – Theory | Mini Group Class | 2027 A/L", day: "Sunday", time: "8:30 AM" },
  { id: 2, subject: "Physics", badge: "PHYSICS", badgeColor: "bg-info text-info-foreground", title: "Physics – Theory | Hybrid Online | 2027 A/L", day: "Sunday", time: "11:00 AM" },
  { id: 3, subject: "Physics", badge: "PHYSICS", badgeColor: "bg-info text-info-foreground", title: "Physics – Theory | Batch 02 | 2027 A/L", day: "Saturday", time: "1:30 PM" },
  { id: 4, subject: "Physics", badge: "PHYSICS", badgeColor: "bg-primary text-primary-foreground", title: "Physics – Revision | Online | 2027 A/L", day: "Sunday", time: "8:00 PM" },
];

export default function Landing() {
  const [catOpen, setCatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-bold text-foreground">Phy6 Master</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <button onClick={() => setCatOpen(!catOpen)} className="relative flex items-center gap-1 px-3 py-2 text-sm text-primary font-medium">
            <Zap className="h-4 w-4" /> Categories <ChevronDown className="h-3 w-3" />
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-border bg-card p-2 shadow-card z-50">
                {categories.map((c) => <div key={c} className="px-3 py-2 text-sm rounded hover:bg-accent cursor-pointer">{c}</div>)}
              </div>
            )}
          </button>
          {[
            { label: "Home", to: "/" },
            { label: "About", to: "/about" },
            { label: "Classes", to: "/classes" },
            { label: "Results", to: "/#results" },
            { label: "Contact", to: "/#contact" },
          ].map((l) => (
            <Link key={l.label} to={l.to} className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">{l.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/signup"><Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm">Sign Up</Button></Link>
          <Link to="/signin"><Button className="gradient-cta text-primary-foreground text-sm font-semibold">Sign In</Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-1">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Enroll Now –<br /><span className="text-gradient">A/L 2027</span><br />Batch
            </h1>
            <p className="mt-6 text-muted-foreground text-lg max-w-md">
              Get a head start with expert guidance. Join the leading A/L Physics classes, online or in person.
            </p>
            <Link to="/signup">
              <Button className="mt-8 gradient-cta text-primary-foreground font-semibold px-8 py-3 text-base">Register Now</Button>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex-1 flex justify-center">
            <div className="w-full max-w-lg rounded-2xl overflow-hidden border-2 border-primary/20 shadow-[0_0_40px_rgba(234,179,8,0.12)]">
              <img src={teacherPhoto} alt="Phy6 Master Teacher" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Classes */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Our Classes</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Interactive and results-driven A/L Physics classes. Available online and in-person, ensuring quality education for every student.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-4 hover:shadow-glow transition-shadow cursor-pointer">
              <div className="aspect-square rounded-lg bg-accent flex items-center justify-center mb-4">
                <Brain className="h-12 w-12 text-muted-foreground" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${c.badgeColor}`}>{c.badge}</span>
              <h3 className="mt-2 font-display text-sm font-semibold text-foreground">{c.title}</h3>
              <p className="mt-1 text-xs text-destructive flex items-center gap-1">🔴 {c.day} | {c.time}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/classes">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-3 text-base rounded-xl">
              Explore All Classes <span className="ml-1">↗</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">What Students Say</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Hear from students who have transformed their A/L Physics results.</p>
        </motion.div>

        <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]} className="relative px-12">
          <CarouselContent>
            {testimonials.map((t, i) => (
              <CarouselItem key={i}>
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <Quote className="h-8 w-8 text-primary mx-auto mb-4 opacity-60" />
                  <p className="text-foreground text-base md:text-lg italic leading-relaxed">"{t.text}"</p>
                  <div className="mt-6">
                    <p className="font-display font-bold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.batch}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="rounded-2xl bg-secondary p-10 md:p-14 text-center border border-border">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Ready to transform your learning experience?</h2>
          <p className="mt-4 text-muted-foreground">Join thousands of students who have already accelerated their careers with our AI-driven platform.</p>
          <Link to="/signup" className="mt-8 inline-block">
            <Button className="gradient-cta text-primary-foreground font-display font-bold px-12 py-4 text-xl rounded-xl">Register Now</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-10">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-display text-lg font-bold text-primary">Phy6 Master</span>
            </div>
            <p className="text-sm text-muted-foreground">Making quality education accessible and personalized for everyone, everywhere through AI innovation.</p>
            <div className="flex gap-3 mt-4">
              <Globe className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Users className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-xs tracking-wider text-foreground mb-4">PRODUCTS</h4>
            {[
              { label: "Registration", to: "/signup" },
              { label: "Classes", to: "/#classes" },
              { label: "My Profile", to: "/signin" },
            ].map((l) => <Link key={l.label} to={l.to} className="block text-sm text-muted-foreground mb-2 hover:text-primary">{l.label}</Link>)}
          </div>
          <div>
            <h4 className="font-display font-bold text-xs tracking-wider text-foreground mb-4">RESOURCES</h4>
            {[
              { label: "Home", to: "/" },
              { label: "About Us", to: "/#about" },
              { label: "Contact", to: "/#contact" },
            ].map((l) => <Link key={l.label} to={l.to} className="block text-sm text-muted-foreground mb-2 hover:text-primary">{l.label}</Link>)}
          </div>
          <div>
            <h4 className="font-display font-bold text-xs tracking-wider text-foreground mb-4">OTHER</h4>
            {[
              { label: "Privacy Policy", to: "#" },
              { label: "Refund Policy", to: "#" },
              { label: "Terms", to: "#" },
            ].map((l) => <Link key={l.label} to={l.to} className="block text-sm text-muted-foreground mb-2 hover:text-primary">{l.label}</Link>)}
          </div>
        </div>
        <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          © 2024 Phy6 Master. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
