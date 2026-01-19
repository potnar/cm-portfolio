"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "O mnie", href: "/#about" },
  { name: "StrideStack", href: "/projects/stridestack" },
  { name: "Projekty", href: "/#projects" },
  { name: "Umiejętności", href: "/#skills" },
  { name: "Kontakt", href: "/#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled
          ? "bg-black/50 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
            CM
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            PORTFOLIO
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 border-l border-white/10 pl-8 ml-2">
            <a
              href="https://github.com"
              target="_blank"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex gap-6 pt-4 border-t border-white/10">
                <a
                  href="https://github.com"
                  target="_blank"
                  className="cursor-pointer"
                >
                  <Github
                    size={24}
                    className="text-zinc-400 hover:text-white transition-colors"
                  />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  className="cursor-pointer"
                >
                  <Linkedin
                    size={24}
                    className="text-zinc-400 hover:text-white transition-colors"
                  />
                </a>
                <a
                  href="mailto:cholewmikolaj@gmail.com"
                  className="cursor-pointer"
                >
                  <Mail
                    size={24}
                    className="text-zinc-400 hover:text-white transition-colors"
                  />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
