import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle, Lock, Target, Zap, Star, Brain, BookOpen, Calculator, Lightbulb } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'unlocked' | 'available' | 'locked';
  isRecent?: boolean;
  prerequisites: string[];
  position: { x: number; y: number };
}

interface SkillTreeProps {
  currentLevel: number;
  completedModules: string[];
  className?: string;
}

export const SkillTree: React.FC<SkillTreeProps> = ({
  currentLevel,
  completedModules,
  className = ""
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skills: Skill[] = [
    {
      id: "basic-numbers",
      name: "Números Básicos",
      description: "Reconhecimento e contagem de números de 1 a 100",
      icon: Calculator,
      status: 'unlocked',
      isRecent: false,
      prerequisites: [],
      position: { x: 50, y: 50 }
    },
    {
      id: "simple-operations",
      name: "Operações Simples",
      description: "Adição e subtração básica",
      icon: Brain,
      status: 'unlocked',
      isRecent: true,
      prerequisites: ["basic-numbers"],
      position: { x: 200, y: 50 }
    },
    {
      id: "percentuals",
      name: "Percentuais",
      description: "Compreensão de porcentagens e frações",
      icon: Target,
      status: 'available',
      prerequisites: ["simple-operations"],
      position: { x: 50, y: 150 }
    },
    {
      id: "visual-geometry",
      name: "Geometria Visual",
      description: "Formas, áreas e perímetros",
      icon: Star,
      status: 'available',
      prerequisites: ["simple-operations"],
      position: { x: 200, y: 150 }
    },
    {
      id: "advanced-math",
      name: "Matemática Avançada",
      description: "Álgebra e equações complexas",
      icon: Lightbulb,
      status: 'locked',
      prerequisites: ["percentuals", "visual-geometry"],
      position: { x: 350, y: 150 }
    },
    {
      id: "logic-reasoning",
      name: "Raciocínio Lógico",
      description: "Resolução de problemas complexos",
      icon: Zap,
      status: 'locked',
      prerequisites: ["advanced-math"],
      position: { x: 125, y: 250 }
    }
  ];

  const getSkillStatusColors = (status: string, isRecent?: boolean) => {
    switch (status) {
      case 'unlocked':
        return isRecent 
          ? "bg-green-500 text-white border-green-400 shadow-[0_0_20px_hsl(var(--primary))] animate-pulse" 
          : "bg-green-500 text-white border-green-400";
      case 'available':
        return "bg-yellow-500 text-white border-yellow-400 hover:shadow-[0_0_15px_hsl(var(--secondary))]";
      case 'locked':
        return "bg-gray-400 text-gray-200 border-gray-300 opacity-50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getConnections = () => {
    const connections: Array<{ from: { x: number; y: number }; to: { x: number; y: number }; status: string }> = [];
    
    skills.forEach(skill => {
      skill.prerequisites.forEach(prereqId => {
        const prereq = skills.find(s => s.id === prereqId);
        if (prereq) {
          connections.push({
            from: { x: prereq.position.x + 40, y: prereq.position.y + 40 },
            to: { x: skill.position.x + 40, y: skill.position.y + 40 },
            status: skill.status === 'unlocked' ? 'active' : 'inactive'
          });
        }
      });
    });
    
    return connections;
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'unlocked':
        return <CheckCircle className="w-4 h-4" />;
      case 'available':
        return <Target className="w-4 h-4" />;
      case 'locked':
        return <Lock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`${className} card-clean overflow-hidden`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-xl">
          <Brain className="h-5 w-5 text-primary" />
          Sua Árvore de Habilidades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative min-h-[300px] w-full">
          {/* SVG para as conexões */}
          <svg className="absolute inset-0 w-full h-full z-0" style={{ minHeight: '300px' }}>
            {getConnections().map((connection, index) => (
              <motion.line
                key={index}
                x1={connection.from.x}
                y1={connection.from.y}
                x2={connection.to.x}
                y2={connection.to.y}
                stroke={connection.status === 'active' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                strokeWidth="2"
                strokeDasharray={connection.status === 'active' ? '0' : '5,5'}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            ))}
          </svg>

          {/* Habilidades */}
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              className={`absolute z-10 w-20 h-20 rounded-full border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${getSkillStatusColors(skill.status, skill.isRecent)}`}
              style={{
                left: skill.position.x,
                top: skill.position.y,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              onMouseEnter={() => setHoveredSkill(skill.id)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <skill.icon className="w-6 h-6 mb-1" />
              <StatusIcon status={skill.status} />

              {/* Tooltip no hover */}
              {hoveredSkill === skill.id && (
                <motion.div
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-lg p-3 shadow-lg z-20 w-48"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="font-semibold text-sm text-foreground">{skill.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{skill.description}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {skill.status === 'unlocked' ? 'Conquistado' : 
                     skill.status === 'available' ? 'Disponível' : 'Bloqueado'}
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* Labels das habilidades */}
          {skills.map((skill) => (
            <div
              key={`label-${skill.id}`}
              className="absolute z-5 text-xs font-medium text-foreground text-center pointer-events-none"
              style={{
                left: skill.position.x - 10,
                top: skill.position.y + 85,
                width: '100px'
              }}
            >
              {skill.name}
            </div>
          ))}
        </div>

        {/* Legenda */}
        <div className="mt-6 flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">Conquistado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-muted-foreground">Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-muted-foreground">Bloqueado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};