import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brush, 
  Palette, 
  Sparkles, 
  Wand2,
  Heart,
  Brain,
  Target,
  Star,
  Lightbulb
} from "lucide-react";

interface ArtisticBrandElementProps {
  variant?: "human" | "digital" | "maker" | "thinker";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ArtisticBrandElement: React.FC<ArtisticBrandElementProps> = ({
  variant = "human",
  size = "md",
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getVariantConfig = (variant: string) => {
    switch (variant) {
      case "human":
        return {
          icon: Heart,
          title: "Pensador Humano",
          description: "Conectamos conceitos complexos à sua realidade",
          gradient: "bg-gradient-to-br from-pink-500/20 to-red-500/20",
          color: "text-red-600",
          accent: "border-red-200"
        };
      case "digital":
        return {
          icon: Sparkles,
          title: "Criador Digital",
          description: "Tecnologia que amplifica seu potencial natural",
          gradient: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
          color: "text-blue-600",
          accent: "border-blue-200"
        };
      case "maker":
        return {
          icon: Wand2,
          title: "Fazedor de Sonhos",
          description: "Transformamos ideias abstratas em conquistas reais",
          gradient: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
          color: "text-green-600",
          accent: "border-green-200"
        };
      case "thinker":
        return {
          icon: Brain,
          title: "Mente Criativa",
          description: "Cultivamos o pensamento crítico com arte",
          gradient: "bg-gradient-to-br from-purple-500/20 to-indigo-500/20",
          color: "text-purple-600",
          accent: "border-purple-200"
        };
      default:
        return {
          icon: Heart,
          title: "Explorador",
          description: "Descobrindo potenciais únicos",
          gradient: "bg-gradient-to-br from-gray-500/20 to-slate-500/20",
          color: "text-gray-600",
          accent: "border-gray-200"
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm": return "p-4 text-sm";
      case "lg": return "p-8 text-lg";
      default: return "p-6 text-base";
    }
  };

  const config = getVariantConfig(variant);
  const IconComponent = config.icon;
  const sizeClasses = getSizeClasses(size);

  return (
    <Card className={`
      ${config.gradient} ${config.accent} border-l-4
      magnetic-hover thoughtful-interaction artistic-emphasis
      ${isAnimating ? 'celebration-bounce' : ''}
      ${className}
    `}>
      <div className={sizeClasses}>
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className={`
              w-12 h-12 rounded-xl ${config.gradient} 
              flex items-center justify-center
              ${isAnimating ? 'float-animation' : ''}
              digital-maker-glow
            `}>
              <IconComponent className={`w-6 h-6 ${config.color}`} />
            </div>
            {isAnimating && (
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-ping" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h4 className={`font-semibold ${config.color} mb-2 elegant-text-reveal`}>
              {config.title}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed elegant-text-reveal">
              {config.description}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface CreativeWorkspaceProps {
  title: string;
  tools: Array<{
    name: string;
    icon: React.ElementType;
    description: string;
    mastery: number;
  }>;
  className?: string;
}

export const CreativeWorkspace: React.FC<CreativeWorkspaceProps> = ({
  title,
  tools,
  className = ""
}) => {
  const [activeTool, setActiveTool] = useState<number | null>(null);

  return (
    <Card className={`sophisticated-reveal magnetic-hover ${className}`}>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-2 elegant-text-reveal">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm elegant-text-reveal">
            Seu estúdio pessoal de criação e descobertas
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            const isActive = activeTool === index;
            
            return (
              <div
                key={index}
                className={`
                  p-4 rounded-lg border transition-all duration-300 cursor-pointer
                  thoughtful-interaction human-touch
                  ${isActive 
                    ? 'bg-primary/10 border-primary/30 shadow-lg' 
                    : 'bg-card border-border hover:border-primary/20'
                  }
                `}
                onMouseEnter={() => setActiveTool(index)}
                onMouseLeave={() => setActiveTool(null)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}
                    transition-all duration-300 digital-maker-glow
                  `}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">
                      {tool.name}
                    </h4>
                    <div className="text-xs text-muted-foreground">
                      {tool.mastery}% dominado
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {tool.description}
                </p>

                <div className="space-y-1">
                  <div className="w-full bg-muted/50 rounded-full h-1.5">
                    <div 
                      className={`
                        h-1.5 rounded-full transition-all duration-500
                        ${isActive ? 'bg-primary' : 'bg-muted-foreground'}
                      `}
                      style={{ width: `${tool.mastery}%` }}
                    />
                  </div>
                </div>

                {isActive && tool.mastery >= 80 && (
                  <div className="mt-2 flex items-center gap-1 text-yellow-600 text-xs">
                    <Star className="w-3 h-3" />
                    <span>Quase mestre!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <Button className="w-full thoughtful-interaction premium-gradient-morph text-white border-0">
            <Palette className="w-4 h-4 mr-2" />
            Abrir Estúdio Criativo
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Enhanced brand personality showcase
interface BrandPersonalityProps {
  className?: string;
}

export const BrandPersonalityShowcase: React.FC<BrandPersonalityProps> = ({
  className = ""
}) => {
  const [currentPersonality, setCurrentPersonality] = useState(0);
  const personalities = ["human", "digital", "maker", "thinker"] as const;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPersonality((prev) => (prev + 1) % personalities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-foreground mb-2 elegant-text-reveal">
          Nossa Personalidade
        </h3>
        <p className="text-muted-foreground elegant-text-reveal">
          Somos <span className="font-semibold text-primary">humanos pensadores</span> e{" "}
          <span className="font-semibold text-secondary">criadores digitais</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalities.map((personality, index) => (
          <ArtisticBrandElement
            key={personality}
            variant={personality}
            size="md"
            className={`
              transition-all duration-500
              ${currentPersonality === index ? 'scale-105 shadow-lg' : 'scale-100'}
            `}
          />
        ))}
      </div>

      {/* Brand values showcase */}
      <Card className="mt-8 premium-gradient-morph">
        <div className="p-6 text-center">
          <h4 className="text-xl font-semibold text-white mb-4 elegant-text-reveal">
            Nossos Valores Fundamentais
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/90">
            <div className="thoughtful-interaction">
              <Heart className="w-8 h-8 mx-auto mb-2 text-pink-200" />
              <h5 className="font-medium mb-1">Humanidade</h5>
              <p className="text-sm">Conectamos tecnologia com emoção</p>
            </div>
            <div className="thoughtful-interaction">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-200" />
              <h5 className="font-medium mb-1">Criatividade</h5>
              <p className="text-sm">Inovamos no aprendizado</p>
            </div>
            <div className="thoughtful-interaction">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-200" />
              <h5 className="font-medium mb-1">Propósito</h5>
              <p className="text-sm">Cada conquista tem significado</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};