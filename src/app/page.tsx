"use client";

import { motion } from "framer-motion";
import {
  Database,
  Link as LinkIcon,
  Activity,
  ArrowRight,
  Cpu,
  ExternalLink,
  Globe,
  Layout,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Scene3D } from "@/components/Scene3D";
import {
  Button,
  Card,
  Container,
  GradientText,
  IconBadge,
  SectionHeading,
  Tag,
} from "@/components/ui";

const projects = [
  {
    title: "StrideStack",
    description:
      "Zaawansowana platforma fitness z parsingiem plików .FIT (Suunto/Strava) i trackingiem zdrowia.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "PWA"],
    link: "/projects/stridestack",
    icon: <Activity />,
  },
  {
    title: "Data Janitor",
    description:
      "Narzędzie do czyszczenia i transformacji danych CSV/Excel z automatycznymi regułami.",
    tags: ["React", "TypeScript", "File Parsing", "Utils"],
    link: "/projects/data-janitor",
    icon: <Database />,
  },
  {
    title: "UTM Architect",
    description: "Kreator i walidator linków śledzących kampanie marketingowe.",
    tags: ["React", "Vite", "Analytics", "UX/UI"],
    link: "/projects/utm-architect",
    icon: <LinkIcon />,
  },
  {
    title: "NestJS/Next.js Demo",
    description:
      "Kompleksowa aplikacja fullstack z integracją API i nowoczesnym interfejsem użytkownika.",
    tags: ["Next.js", "NestJS", "TypeScript", "Tailwind"],
    link: "/projects/nestjs-demo",
    icon: <Globe />,
  },
  {
    title: "Crowder.pro",
    description:
      "Frontend platformy crowdfundingowej z integracją płatności Tpay i obsługą kampanii.",
    tags: ["React", "Material UI", "Tpay", "JWT", "React Router"],
    link: "/projects/crowder",
    icon: <Layout />,
  },
  {
    title: "PytajnikDB",
    description:
      "Interaktywna baza danych z zaawansowanym systemem filtrowania i wyszukiwania.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Firebase"],
    link: "/projects/pytajnikdb",
    icon: <Cpu />,
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
    <div className="relative min-h-screen bg-background text-foreground selection:bg-secondary-strong/30 font-sans">
      <Navbar />
      <Scene3D />

      {/* Hero Section / About Me */}
      <section
        id="about"
        className="relative pt-32 pb-section-sm overflow-hidden"
      >
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-muted text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Dostępny do nowych projektów</span>
            </div>

            <h1 className="text-display">
              KREUJĘ <br />
              <GradientText>CYFROWĄ PRZYSZŁOŚĆ</GradientText>
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-muted font-medium">
              Ekspert React i pasjonat nowoczesnych technologii. Przekształcam
              złożone pomysły w intuicyjne i wydajne doświadczenia webowe.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button href="/#projects">
                Zobacz Projekty <ArrowRight className="w-5 h-5" />
              </Button>
              <Button href="/#contact" variant="secondary">
                Kontakt
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-section relative z-10">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <SectionHeading eyebrow="Portfolio" title="WYBRANE PROJEKTY" />
            <p className="max-w-md text-muted">
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
              >
                <Card size="lg" interactive className="relative h-full">
                  <IconBadge className="mb-6 group-hover:scale-110 transition-transform">
                    {project.icon}
                  </IconBadge>
                  <h3 className="text-heading-sm mb-3">{project.title}</h3>
                  <p className="text-muted mb-6 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    className="inline-flex items-center gap-2 text-sm font-bold text-foreground group-hover:text-primary transition-colors"
                  >
                    Zobacz szczegóły <ExternalLink className="w-4 h-4" />
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="py-section bg-surface border-y border-border relative z-10"
      >
        <Container className="overflow-hidden">
          <div className="flex flex-col items-center text-center mb-16">
            <SectionHeading
              eyebrow="Kompetencje"
              title="TECHNOLOGIE, KTÓRYCH UŻYWAM"
              tone="secondary"
              align="center"
              className="mb-8"
            />
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="px-6 py-3 rounded-2xl bg-background border border-border text-lg font-medium hover:border-secondary-strong/50 transition-colors"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Footer / Contact */}
      <footer
        id="contact"
        className="py-section-sm relative z-10 border-t border-border"
      >
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-heading-md mb-2">Gotowy na rozmowę?</h2>
              <div className="space-y-1">
                <p className="text-muted italic">Mikołaj Cholewa</p>
                <p className="text-muted">cholewamikolaj@gmail.com</p>
                <p className="text-muted">+48 516 175 434</p>
              </div>
            </div>
            <Button
              href="mailto:cholewamikolaj@gmail.com"
              variant="gradient"
              size="xl"
            >
              Napisz do mnie
            </Button>
          </div>
          <div className="mt-section-sm pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4 text-subtle text-sm font-medium">
            <p>© 2026 CM Portfolio. Wszelkie prawa zastrzeżone.</p>
            <div className="flex gap-6">
              <a
                href="https://github.com/potnar"
                target="_blank"
                className="hover:text-foreground transition-colors cursor-pointer"
              >
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
