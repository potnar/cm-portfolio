"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Scene3D } from "@/components/Scene3D";
import { ArrowLeft, Globe, Server, Layers, Cpu, Code } from "lucide-react";
import Link from "next/link";

export default function NestJSDemoPage() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans mt-20">
      <Navbar />
      <Scene3D />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20 mt-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-12 group"
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
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <Server className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
              NESTJS<span className="text-emerald-400">/NEXT.JS</span> DEMO
            </h1>
          </div>

          <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
            Kompleksowa demonstracja architektury Fullstack, łącząca wydajność
            Next.js po stronie klienta z solidnością NestJS po stronie serwera.
            Projekt prezentuje najlepsze praktyki w budowaniu nowoczesnych
            aplikacji webowych.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 group hover:border-emerald-500/30 transition-colors">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="text-emerald-400" /> Frontend
              </h3>
              <p className="text-zinc-400 text-sm">
                Wykorzystanie Next.js (App Router) dla optymalnego renderowania
                i SEO. Dynamiczne ładowanie komponentów i płynne przejścia.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 group hover:border-emerald-500/30 transition-colors">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Cpu className="text-emerald-400" /> Backend
              </h3>
              <p className="text-zinc-400 text-sm">
                Skalowalne API oparte na NestJS. Architektura modularna,
                wstrzykiwanie zależności i pełne wsparcie dla TypeScript.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Standardy i Jakość</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Pełna typizacja end-to-end",
                "Integracja z bazą danych przez Prisma",
                "System uwierzytelniania JWT",
                "Validacja danych (Zod / Class-validator)",
                "Dokumentacja API w Swaggerze",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-24 p-12 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-3xl border border-emerald-500/20">
            <h3 className="text-2xl font-bold mb-4">Kod źródłowy</h3>
            <p className="text-zinc-400 mb-8 max-w-lg">
              Architektura została zaprojektowana tak, aby umożliwić łatwą
              rozbudowę o mikrousługi i wspierać rozwój w dużych zespołach
              deweloperskich.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://nestjs-nextjs-demo-frontend.vercel.app/pl/threejs"
                target="_blank"
                className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4" /> Zobacz Live Demo
              </a>
              <button className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 cursor-pointer">
                <Code className="w-4 h-4" /> Zobacz kod
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
