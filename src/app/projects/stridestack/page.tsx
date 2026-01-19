"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Scene3D } from "@/components/Scene3D";
import {
  ArrowLeft,
  Activity,
  Weight,
  FileCode,
  Map as MapIcon,
  Zap,
  Globe,
  Code,
} from "lucide-react";
import Link from "next/link";

export default function StrideStackPage() {
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
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
              STRIDE<span className="text-blue-400">STACK</span>
            </h1>
          </div>

          <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
            Zaawansowana platforma do monitorowania postępów sportowych i
            zdrowotnych. StrideStack integruje dane z wielu źródeł, pozwalając
            na precyzyjną analizę treningów oraz parametrów organizmu w jednym,
            przejrzystym miejscu.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 group hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <FileCode className="w-5 h-5" />
                <h3 className="font-bold">Parsing Plików .FIT</h3>
              </div>
              <p className="text-sm text-zinc-400">
                Własna implementacja parsera plików .FIT umożliwiająca
                bezpośredni import danych z urządzeń Suunto, Garmin czy
                platformy Strava.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 group hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <Weight className="w-5 h-5" />
                <h3 className="font-bold">Tracking Parametrów</h3>
              </div>
              <p className="text-sm text-zinc-400">
                Monitorowanie zmian masy ciała, BMI oraz innych kluczowych
                wskaźników zdrowia z wizualizacją trendów na interaktywnych
                wykresach.
              </p>
            </div>
          </div>

          <div className="space-y-12 mb-20">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Zap className="text-yellow-400" /> Funkcjonalności
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Analiza Trasy",
                  desc: "Wizualizacja GPS i analiza tempa na mapach Mapbox.",
                  icon: <MapIcon className="w-5 h-5" />,
                },
                {
                  title: "Dashboard",
                  desc: "Personalizowany widok z najnowszymi statystykami i osiągnięciami.",
                  icon: <Activity className="w-5 h-5" />,
                },
                {
                  title: "PWA",
                  desc: "Aplikacja gotowa do instalacji na telefonie z pełnym wsparciem offline.",
                  icon: <Globe className="w-5 h-5" />,
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

          <div className="p-12 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl border border-blue-500/20">
            <h3 className="text-2xl font-bold mb-4 italic">
              Technologia i Wydajność
            </h3>
            <p className="text-zinc-400 mb-8 max-w-lg">
              System oparty na Next.js 15, Prisma ORM oraz PostgreSQL. Do
              parsowania plików binarnych .FIT wykorzystano zoptymalizowane
              algorytmy zapewniające błyskawiczną obróbkę danych po stronie
              klienta i serwera.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://stridestack.vercel.app"
                target="_blank"
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4" /> Zobacz Live Demo
              </a>
              <button className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 cursor-pointer">
                <Code className="w-4 h-4" /> Przejrzyj Kod
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
