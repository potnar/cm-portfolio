"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Scene3D } from "@/components/Scene3D";
import {
  ArrowLeft,
  Database,
  FileSpreadsheet,
  Settings,
  Wand2,
  Download,
  Globe,
  Code,
} from "lucide-react";
import Link from "next/link";

export default function DataJanitorPage() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-cyan-500/30 font-sans mt-20">
      <Navbar />
      <Scene3D />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20 mt-20">
        <Link
          href="/#projects"
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
            <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
              <Database className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
              DATA<span className="text-cyan-400">JANITOR</span>
            </h1>
          </div>

          <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
            Inteligentne narzędzie do automatyzacji procesów czyszczenia i
            transformacji danych. Data Janitor zamienia chaos w uporządkowane
            informacje, oszczędzając godziny żmudnej pracy manualnej.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 group hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-4 text-cyan-400">
                <FileSpreadsheet className="w-5 h-5" />
                <h3 className="font-bold">Import CSV/Excel</h3>
              </div>
              <p className="text-sm text-zinc-400">
                Szybki import i podgląd dużych zbiorów danych w popularnych
                formatach arkuszy kalkulacyjnych.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 group hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-4 text-purple-400">
                <Wand2 className="w-5 h-5" />
                <h3 className="font-bold">Automatyczne Reguły</h3>
              </div>
              <p className="text-sm text-zinc-400">
                Definiowanie i aplikowanie reguł naprawczych jednym kliknięciem
                dla tysięcy rekordów jednocześnie.
              </p>
            </div>
          </div>

          <div className="space-y-12 mb-20">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Settings className="text-yellow-400" /> Główne Funkcje
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Standaryzacja",
                  desc: "Ujednolicanie formatów dat, numerów telefonów i adresów email.",
                  icon: <Settings className="w-5 h-5" />,
                },
                {
                  title: "Deduplikacja",
                  desc: "Zaawansowane wykrywanie i scalanie zduplikowanych wpisów.",
                  icon: <Database className="w-5 h-5" />,
                },
                {
                  title: "Eksport",
                  desc: "Pobieranie oczyszczonych danych w formacie gotowym do użycia.",
                  icon: <Download className="w-5 h-5" />,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white/5 rounded-xl border border-white/5"
                >
                  <div className="text-zinc-300 mb-3">{item.icon}</div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-12 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-3xl border border-cyan-500/20">
            <h3 className="text-2xl font-bold mb-4 italic">Nowoczesny Stack</h3>
            <p className="text-zinc-400 mb-8 max-w-lg">
              Aplikacja zbudowana w oparciu o najnowsze standardy webowe,
              gwarantująca szybkość działania i bezpieczeństwo przetwarzanych
              danych lokalnie w przeglądarce.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://data-janitor-pl.vercel.app"
                target="_blank"
                className="px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4" /> Zobacz Live Demo
              </a>
              <a
                href="https://github.com/potnar"
                target="_blank"
                className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Code className="w-4 h-4" /> Przejrzyj Kod
              </a>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
