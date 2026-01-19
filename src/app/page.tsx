"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Code,
  Cpu,
  ExternalLink,
  Globe,
  Layout,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Scene3D } from "@/components/Scene3D";

const projects = [
  {
    title: "StrideStack",
    description:
      "Zaawansowana platforma fitness z parsingiem plików .FIT (Suunto/Strava) i trackingiem zdrowia.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "PWA"],
    link: "/projects/stridestack",
    icon: <Activity className="w-6 h-6" />,
  },
  {
    title: "NestJS/Next.js Demo",
    description:
      "Kompleksowa aplikacja fullstack z integracją API i nowoczesnym interfejsem użytkownika.",
    tags: ["Next.js", "NestJS", "TypeScript", "Tailwind"],
    link: "/projects/nestjs-demo",
    icon: <Globe className="w-6 h-6" />,
  },
  {
    title: "Crowder.pro",
    description:
      "Frontend platformy crowdfundingowej z integracją płatności Tpay i obsługą kampanii.",
    tags: ["React", "Material UI", "Tpay", "JWT", "React Router"],
    link: "/projects/crowder",
    icon: <Layout className="w-6 h-6" />,
  },
  {
    title: "PytajnikDB",
    description:
      "Interaktywna baza danych z zaawansowanym systemem filtrowania i wyszukiwania.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Firebase"],
    link: "/projects/pytajnikdb",
    icon: <Cpu className="w-6 h-6" />,
  },
];

const skills = [
  "React / Next.js",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "Three.js",
  "Framer Motion",
  "NestJS",
  "PostgreSQL",
  "Unreal Engine",
  "Automatyka",
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
      <Navbar />
      <Scene3D />

      {/* Hero Section / About Me */}
      <section id="about" className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Dostępny do nowych projektów</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight">
              KREUJĘ <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400">
                CYFROWĄ PRZYSZŁOŚĆ
              </span>
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-zinc-400 font-medium">
              Ekspert React i pasjonat nowoczesnych technologii. Przekształcam
              złożone pomysły w intuicyjne i wydajne doświadczenia webowe.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/#projects"
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-2 cursor-pointer"
              >
                Zobacz Projekty <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/#contact"
                className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                Kontakt
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">
                Portfolio
              </h2>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight">
                WYBRANE PROJEKTY
              </h3>
            </div>
            <p className="max-w-md text-zinc-400">
              Każdy projekt to nowe wyzwanie i szansa na wdrożenie innowacyjnych
              rozwiązań technicznych.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {project.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{project.title}</h4>
                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/5 rounded border border-white/5 text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-cyan-400 transition-colors"
                >
                  Zobacz szczegóły <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="py-24 bg-white/5 border-y border-white/10 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 overflow-hidden">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">
              Kompetencje
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-8">
              TECHNOLOGIE, KTÓRYCH UŻYWAM
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="px-6 py-3 rounded-2xl bg-black border border-white/10 text-lg font-medium hover:border-purple-500/50 transition-colors"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer
        id="contact"
        className="py-20 px-6 relative z-10 border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-bold mb-2">Gotowy na rozmowę?</h4>
            <div className="space-y-1">
              <p className="text-zinc-400 italic">Mikołaj Cholewa</p>
              <p className="text-zinc-400">cholewmikolaj@gmail.com</p>
              <p className="text-zinc-400">+48 516 175 434</p>
            </div>
          </div>
          <a
            href="mailto:cholewmikolaj@gmail.com"
            className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            Napisz do mnie
          </a>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-sm font-medium">
          <p>© 2026 CM Portfolio. Wszelkie prawa zastrzeżone.</p>
          <div className="flex gap-6">
            <a
              href="https://github.com/potnar"
              target="_blank"
              className="hover:text-white transition-colors cursor-pointer"
            >
              GitHub
            </a>
            <a href="#" className="hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
