import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import BlurImage from "@/components/BlurImage";
import heroImg from "@/assets/cpa-method-hero.jpg";
import ManthaLogoAnimated from "@/components/home/ManthaLogoAnimated";

interface HeroSectionProps {
  nome?: string;
  onViewChange?: (view: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ nome, onViewChange }) => {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden rounded-2xl mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-transparent" />
      <div className="relative z-10 grid gap-8 md:grid-cols-2 items-center px-6 py-12 md:py-16">
        <div>
          <header>
            <h1 id="hero-title" className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Aprenda mais rápido com um plano que se adapta a você{nome ? `, ${nome}` : ''}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Exercícios inteligentes, feedback em tempo real e trilhas personalizadas com o Método CPA.
            </p>
          </header>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button size="lg" onClick={() => onViewChange?.("progress")}>Ver Progresso<TrendingUp className="ml-2 h-4 w-4"/></Button>
            <Button size="lg" variant="outline" onClick={() => onViewChange?.("cpa-method")}>
              Ver como funciona <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
          </div>
        </div>
        <aside className="relative">
          <div className="glass rounded-2xl p-2 relative overflow-hidden">
            <BlurImage src={heroImg} alt="Estudante praticando com o Método CPA" className="w-full h-[260px] md:h-[320px] object-cover rounded-xl" />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <ManthaLogoAnimated />
            </div>
          </div>
        </aside>

      </div>
    </section>
  );
};

export default HeroSection;
