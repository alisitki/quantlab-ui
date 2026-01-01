"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl bg-secondary/30 border border-white/5 backdrop-blur-sm hover:border-primary/20 hover:bg-secondary/50 transition-all duration-300 group"
    >
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden selection:bg-primary/20">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-[128px] opacity-70 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">QuantLab</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="#" className="hover:text-white transition-colors">Features</Link>
          <Link href="#" className="hover:text-white transition-colors">Markets</Link>
          <Link href="#" className="hover:text-white transition-colors">Research</Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:block">Log in</button>
          <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 md:pt-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8 animate-fade-in"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          v2.0 is now live
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
        >
          Master the Markets with <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_auto]">Precision</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
        >
          Advanced algorithmic trading implementation for the modern era.
          Real-time analytics, backtesting, and automated execution in one platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button className="h-12 px-8 rounded-xl bg-primary hover:bg-blue-600 text-white font-medium flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
            Start Trading Now <ArrowRight className="w-4 h-4" />
          </button>
          <button className="h-12 px-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all">
            View Documentation
          </button>
        </motion.div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Zap}
            title="Ultra-Low Latency"
            description="Execution times measured in microseconds. Built for high-frequency trading environments."
          />
          <FeatureCard
            icon={Shield}
            title="Enterprise Security"
            description="Bank-grade encryption and access controls. Your algorithms and data remain your property."
          />
          <FeatureCard
            icon={BarChart2}
            title="Advanced Analytics"
            description="Real-time visualization of PnL, exposure, and risk metrics with customizable dashboards."
          />
        </div>
      </div>
    </main>
  );
}
