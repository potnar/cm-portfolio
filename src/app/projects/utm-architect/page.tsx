"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Scene3D } from "@/components/Scene3D";
import {
  ArrowLeft,
  Link as LinkIcon,
  Share2,
  Target,
  ClipboardCheck,
  Globe,
  Code,
  Layers,
} from "lucide-react";
import Link from "next/link";

export default function UtmArchitectPage() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-orange-500/30 font-sans mt-20">
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
            <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center">
              <LinkIcon className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
              UTM<span className="text-orange-400">ARCHITECT</span>
            </h1>
          </div>

          <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
            Kompleksowe rozwiązanie do zarządzania linkami kampanii
            marketingowych. UTM Architect pozwala na szybkie generowanie,
            katalogowanie i walidację parametrów śledzenia, zapewniając spójność
            danych analitycznych.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 group hover:border-orange-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-4 text-orange-400">
                <Target className="w-5 h-5" />
                <h3 className="font-bold">Precyzyjne Trackowanie</h3>
              </div>
              <p className="text-sm text-zinc-400">
                Eliminacja błędów w nazewnictwie kampanii dzięki predefiniowanym
                szablonom i walidacji w czasie rzeczywistym.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 group hover:border-orange-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <Share2 className="w-5 h-5" />
                <h3 className="font-bold">Łatwe Udostępnianie</h3>
              </div>
              <p className="text-sm text-zinc-400">
                Szybkie kopiowanie gotowych linków lub generowanie kodów QR do
                użycia w materiałach offline.
              </p>
            </div>
          </div>

          <div className="space-y-12 mb-20">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Layers className="text-yellow-400" /> Kluczowe Możliwości
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Generator",
                  desc: "Intuicyjny interfejs do budowania linków z parametrami UTM.",
                  icon: <LinkIcon className="w-5 h-5" />,
                },
                {
                  title: "Historia",
                  desc: "Zapisywanie wygenerowanych linków w lokalnej historii przeglądarki.",
                  icon: <ClipboardCheck className="w-5 h-5" />,
                },
                {
                  title: "Szablony",
                  desc: "Zapisywanie zestawów parametrów dla powtarzalnych kampanii.",
                  icon: <Layers className="w-5 h-5" />,
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

          <div className="p-12 bg-gradient-to-br from-orange-500/10 to-transparent rounded-3xl border border-orange-500/20">
            <h3 className="text-2xl font-bold mb-4 italic">Marketing + Tech</h3>
            <p className="text-zinc-400 mb-8 max-w-lg">
              Narzędzie stworzone z myślą o marketerach, którzy potrzebują
              niezawodnego i szybkiego sposobu na zarządzanie strukturą linków
              reklamowych.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://utm-architect-app.vercel.app"
                target="_blank"
                className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-500 transition-colors flex items-center gap-2 cursor-pointer"
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
