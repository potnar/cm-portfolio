"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Scene3D } from "@/components/Scene3D";
import {
  ArrowLeft,
  Database,
  Search,
  Filter,
  Shield,
  Code2,
} from "lucide-react";
import Link from "next/link";

export default function PytajnikDBPage() {
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
          Powrót do strony głównej
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <Database className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-title">
              PYTAJNIK<span className="text-purple-400">DB</span>
            </h1>
          </div>

          <p className="text-lead text-muted mb-12">
            Interaktywna baza danych zaprojektowana dla potrzeb szybkiego
            wyszukiwania i filtrowania ogromnych zbiorów informacji. System
            charakteryzuje się intuicyjnym interfejsem "instant-search" oraz
            potężnymi filtrami.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-section-sm">
            <div className="p-8 rounded-2xl bg-surface border border-border">
              <div className="flex items-center gap-3 mb-4 text-purple-400">
                <Search className="w-5 h-5" />
                <h3 className="font-bold">Instant Search</h3>
              </div>
              <p className="text-sm text-muted">
                Wyniki wyszukiwania pojawiają się w milisekundach dzięki
                zaawansowanemu indeksowaniu i optymalizacji zapytań.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-surface border border-border">
              <div className="flex items-center gap-3 mb-4 text-cyan-400">
                <Filter className="w-5 h-5" />
                <h3 className="font-bold">Filtry Smart</h3>
              </div>
              <p className="text-sm text-muted">
                Dynamiczne filtrowanie zależne od kontekstu, pozwalające na
                precyzyjne dotarcie do poszukiwanych rekordów.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 mb-section-sm">
            {[
              "React",
              "Next.js",
              "Prisma",
              "PostgreSQL",
              "Firebase",
              "TypeScript",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-bold text-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="space-y-12">
            <h2 className="text-heading-lg flex items-center gap-3">
              <Code2 className="text-muted" /> Architektura
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Frontend",
                  desc: "React z pełnym wykorzystaniem hooków dla responsywnego UI.",
                  color: "border-cyan-500/50",
                },
                {
                  title: "Backend",
                  desc: "Firebase firestore dla synchronizacji danych w czasie rzeczywistym.",
                  color: "border-orange-500/50",
                },
                {
                  title: "Security",
                  desc: "Solidny system ról i uprawnień dostępu do danych.",
                  color: "border-purple-500/50",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`p-6 border-l-4 ${item.color} bg-surface`}
                >
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-xs text-subtle leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-section p-12 border-2 border-dashed border-border rounded-3xl text-center">
            <h3 className="text-heading-sm mb-4 italic">
              Certyfikowana Wydajność
            </h3>
            <p className="text-subtle text-sm max-w-md mx-auto">
              Projekt przeszedł rygorystyczne testy obciążeniowe, demonstrując
              stabilność przy tysiącach jednoczesnych zapytań.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
