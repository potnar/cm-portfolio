"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Scene3D } from "@/components/Scene3D";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function CrowderPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-purple-500/30 font-sans mt-20">
      <Navbar />
      <Scene3D />

      <main className="relative z-10 max-w-narrow mx-auto px-gutter py-section-sm mt-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Powrót do strony główne
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-title mb-6">
            CROWDER<span className="text-cyan-400">.PRO</span>
          </h1>
          <p className="text-lead text-muted mb-12">
            Nowoczesna platforma crowdfundingowa zaprojektowana z myślą o
            skalowalności i bezpieczeństwie. System umożliwia twórcom zbieranie
            funduszy, a inwestorom bezpieczne wspieranie projektów.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-section-sm">
            <div className="space-y-6">
              <h2 className="text-heading-md flex items-center gap-3">
                <CheckCircle2 className="text-cyan-400" /> Kluczowe Funkcje
              </h2>
              <ul className="space-y-4">
                {[
                  "Integracja z systemem płatności Stripe",
                  "Zarządzanie kampaniami w czasie rzeczywistym",
                  "Zaawansowany system weryfikacji tożsamości",
                  "Panel analityczny dla twórców",
                  "Automatyczne raporty i powiadomienia",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 text-heading-md border-l-2 border-border pl-10">
              <h2 className="text-heading-md flex items-center gap-3">
                <ShieldCheck className="text-purple-400" /> Stos Technologiczny
              </h2>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  "Next.js",
                  "Node.js",
                  "PostgreSQL",
                  "Tailwind CSS",
                  "Redis",
                  "Docker",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-bold text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-12 rounded-3xl bg-surface-solid border border-border mb-section-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-cyan-400/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-heading-lg">Wyniki i Wdrożenie</h3>
            </div>
            <p className="text-muted mb-8 leading-relaxed">
              Projekt został zoptymalizowany pod kątem szybkości ładowania oraz
              konwersji. Dzięki zastosowaniu Next.js i Server Components, udało
              się osiągnąć świetne wyniki w Core Web Vitals, co bezpośrednio
              przełożyło się na sukces kampanii.
            </p>
            <a
              href="https://crowder.pro"
              target="_blank"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-400 transition-colors"
            >
              Odwiedź Crowder.pro <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
