import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Palette, 
  Zap, 
  Sparkles,
  Eye,
  Brain,
  Heart,
  Star
} from "lucide-react";

interface PremiumInteractionProps {
  title: string;
  description: string;
  stage: "concrete" | "pictorial" | "abstract";
  progress: number;
  onInteract: () => void;
  className?: string;
}

export const PremiumCPAInteraction: React.FC<PremiumInteractionProps> = ({
  title,
  description,
  stage,
  progress,
  onInteract,
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number}>>([]);

  // Generate floating particles on hover
  useEffect(() => {
    if (isHovered) {
      const newParticles = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered]);

  const getStageConfig = (stage: string) => {
    switch (stage) {
      case "concrete":
        return {
          icon: Brain,
          gradient: "premium-gradient-morph",
          color: "text-blue-600",
          bgAccent: "bg-blue-50",
          borderAccent: "border-blue-200",
          description: "Toque, sinta e manipule"
        };
      case "pictorial":
        return {
          icon: Eye,
          gradient: "bg-gradient-learning",
          color: "text-purple-600", 
          bgAccent: "bg-purple-50",
          borderAccent: "border-purple-200",
          description: "Visualize e desenhe"
        };
      case "abstract":
        return {
          icon: Zap,
          gradient: "bg-gradient-achievement",
          color: "text-green-600",
          bgAccent: "bg-green-50", 
          borderAccent: "border-green-200",
          description: "Simbolize e formalize"
        };
      default:
        return {
          icon: Star,
          gradient: "bg-gradient-focus",
          color: "text-gray-600",
          bgAccent: "bg-gray-50",
          borderAccent: "border-gray-200",
          description: "Explore e descubra"
        };
    }
  };

  const config = getStageConfig(stage);
  const IconComponent = config.icon;

  return (
    <Card 
      className={`relative overflow-hidden magnetic-hover thoughtful-interaction ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.id * 0.1}s`
          }}
        />
      ))}

      <div className={`p-8 ${config.gradient}`}>
        {/* Header with sophisticated reveal */}
        <div className="sophisticated-reveal mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center float-animation">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white elegant-text-reveal">
                  {title}
                </h3>
                <p className="text-white/80 text-sm elegant-text-reveal">
                  {config.description}
                </p>
              </div>
            </div>

            <Badge className="bg-white/20 text-white border-white/30 human-touch">
              Estágio {stage === "concrete" ? "1" : stage === "pictorial" ? "2" : "3"}
            </Badge>
          </div>
        </div>

        {/* Description with artistic emphasis */}
        <div className="artistic-emphasis mb-6">
          <p className="text-white/90 leading-relaxed elegant-text-reveal">
            {description}
          </p>
        </div>

        {/* Progress with digital maker aesthetics */}
        <div className="digital-maker-glow mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-white/80">Progresso da Maestria</span>
            <span className="text-sm text-white font-bold">{progress}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-3 bg-white/20" 
          />
          {progress >= 80 && (
            <div className="mt-2 flex items-center gap-2 text-yellow-300 text-sm">
              <Star className="w-4 h-4 animate-pulse" />
              <span>Próximo da maestria!</span>
            </div>
          )}
        </div>

        {/* Interactive buttons with premium feel */}
        <div className="flex gap-3">
          <Button 
            onClick={onInteract}
            className="flex-1 bg-white/20 hover:bg-white/30 border border-white/30 text-white thoughtful-interaction backdrop-blur-sm"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Explorar Estágio
          </Button>
          
          {progress >= 70 && (
            <Button 
              variant="outline"
              className="bg-white/10 hover:bg-white/20 border-white/30 text-white human-touch"
            >
              <Palette className="w-4 h-4 mr-2" />
              Criar
            </Button>
          )}
        </div>

        {/* Subtle enhancement overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      </div>
    </Card>
  );
};

interface CreativeStudioCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  accent?: "primary" | "secondary" | "creative";
  className?: string;
}

export const CreativeStudioCard: React.FC<CreativeStudioCardProps> = ({
  title,
  subtitle,
  children,
  accent = "primary",
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getAccentStyles = (accent: string) => {
    switch (accent) {
      case "primary":
        return "border-l-primary bg-gradient-to-br from-primary/5 to-background";
      case "secondary":
        return "border-l-secondary bg-gradient-to-br from-secondary/5 to-background";
      case "creative":
        return "border-l-purple-500 bg-gradient-to-br from-purple-50 to-background";
      default:
        return "border-l-primary bg-gradient-to-br from-primary/5 to-background";
    }
  };

  return (
    <Card className={`
      border-l-4 ${getAccentStyles(accent)} 
      magnetic-hover thoughtful-interaction
      ${isVisible ? 'sophisticated-reveal' : 'opacity-0'}
      ${className}
    `}>
      <div className="p-6">
        <div className="elegant-text-reveal mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-1 artistic-emphasis">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>
        
        <div className="digital-maker-glow">
          {children}
        </div>
      </div>
    </Card>
  );
};

interface ThoughtfulProgressProps {
  value: number;
  label: string;
  subtitle?: string;
  showSparkle?: boolean;
  className?: string;
}

export const ThoughtfulProgress: React.FC<ThoughtfulProgressProps> = ({
  value,
  label,
  subtitle,
  showSparkle = false,
  className = ""
}) => {
  return (
    <div className={`space-y-3 human-touch ${className}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground elegant-text-reveal">
            {label}
          </span>
          {showSparkle && value >= 85 && (
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          )}
        </div>
        <div className="text-right">
          <div className="font-bold text-primary">{value}%</div>
          {subtitle && (
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          )}
        </div>
      </div>
      
      <div className="relative">
        <Progress 
          value={value} 
          className={`h-3 transition-all duration-700 ${value >= 85 ? 'progress-glow' : ''}`}
        />
        {value >= 90 && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-ping" />
        )}
      </div>
    </div>
  );
};