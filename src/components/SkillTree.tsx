import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, Lightbulb, BookOpen, Calculator, Eye, Zap, CheckCircle, Lock, Clock } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'unlocked' | 'available' | 'locked';
  progress: number;
  prerequisites: string[];
  description: string;
  x: number;
  y: number;
  isRecent?: boolean;
}

interface Connection {
  from: string;
  to: string;
}

interface SkillTreeProps {
  currentLevel: number;
  completedActivities: number;
  className?: string;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ 
  currentLevel, 
  completedActivities, 
  className = '' 
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skills: Skill[] = [
    // Tier 1 - Base
    {
      id: 'numbers',
      name: 'Números Básicos',
      icon: Calculator,
      status: 'unlocked',
      progress: 100,
      prerequisites: [],
      description: 'Fundamentos da matemática com números',
      x: 50,
      y: 80,
      isRecent: false
    },
    // Tier 2
    {
      id: 'addition',
      name: 'Adição',
      icon: Brain,
      status: 'unlocked',
      progress: 85,
      prerequisites: ['numbers'],
      description: 'Operações de soma usando método CPA',
      x: 25,
      y: 60,
      isRecent: true
    },
    {
      id: 'subtraction',
      name: 'Subtração',
      icon: Target,
      status: 'available',
      progress: 60,
      prerequisites: ['numbers'],
      description: 'Operações de subtração visual',
      x: 75,
      y: 60,
      isRecent: false
    },
    // Tier 3
    {
      id: 'multiplication',
      name: 'Multiplicação',
      icon: Lightbulb,
      status: currentLevel >= 3 ? 'available' : 'locked',
      progress: 30,
      prerequisites: ['addition'],
      description: 'Multiplicação através de padrões visuais',
      x: 15,
      y: 40,
      isRecent: false
    },
    {
      id: 'division',
      name: 'Divisão',
      icon: BookOpen,
      status: currentLevel >= 3 ? 'available' : 'locked',
      progress: 0,
      prerequisites: ['subtraction'],
      description: 'Divisão usando blocos e modelos',
      x: 85,
      y: 40,
      isRecent: false
    },
    // Tier 4
    {
      id: 'fractions',
      name: 'Frações',
      icon: Eye,
      status: currentLevel >= 5 ? 'available' : 'locked',
      progress: 0,
      prerequisites: ['multiplication', 'division'],
      description: 'Compreensão visual de frações',
      x: 50,
      y: 20,
      isRecent: false
    }
  ];

  const connections: Connection[] = [
    { from: 'numbers', to: 'addition' },
    { from: 'numbers', to: 'subtraction' },
    { from: 'addition', to: 'multiplication' },
    { from: 'subtraction', to: 'division' },
    { from: 'multiplication', to: 'fractions' },
    { from: 'division', to: 'fractions' }
  ];

  const getSkillColor = (skill: Skill) => {
    switch (skill.status) {
      case 'unlocked':
        return 'hsl(var(--success))';
      case 'available':
        return 'hsl(var(--warning))';
      case 'locked':
        return 'hsl(var(--muted))';
      default:
        return 'hsl(var(--muted))';
    }
  };

  const getSkillIcon = (skill: Skill) => {
    switch (skill.status) {
      case 'unlocked':
        return CheckCircle;
      case 'available':
        return Clock;
      case 'locked':
        return Lock;
      default:
        return Lock;
    }
  };

  return (
    <Card className={`card-gradient ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-xl">
          <Zap className="h-5 w-5 text-primary" />
          Seu Caminho Adaptativo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-96 overflow-hidden rounded-xl bg-gradient-to-br from-background/50 to-secondary/30">
          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {connections.map((connection, index) => {
              const fromSkill = skills.find(s => s.id === connection.from);
              const toSkill = skills.find(s => s.id === connection.to);
              
              if (!fromSkill || !toSkill) return null;

              const fromX = (fromSkill.x / 100) * 100;
              const fromY = (fromSkill.y / 100) * 96;
              const toX = (toSkill.x / 100) * 100;
              const toY = (toSkill.y / 100) * 96;

              const isActive = fromSkill.status === 'unlocked' && toSkill.status !== 'locked';

              return (
                <motion.line
                  key={index}
                  x1={`${fromX}%`}
                  y1={`${fromY}%`}
                  x2={`${toX}%`}
                  y2={`${toY}%`}
                  stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                  strokeWidth="2"
                  strokeOpacity={isActive ? 0.8 : 0.3}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              );
            })}
          </svg>

          {/* Skills */}
          {skills.map((skill, index) => {
            const StatusIcon = getSkillIcon(skill);
            const SkillIcon = skill.icon;
            
            return (
              <motion.div
                key={skill.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${skill.x}%`,
                  top: `${skill.y}%`,
                  zIndex: 2
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20
                }}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                {/* Glow effect for recent achievements */}
                {skill.isRecent && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${getSkillColor(skill)}40 0%, transparent 70%)`,
                      scale: 1.5
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                )}

                {/* Skill node */}
                <motion.div
                  className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer border-2"
                  style={{
                    backgroundColor: getSkillColor(skill),
                    borderColor: skill.status === 'unlocked' ? 'hsl(var(--success))' : 
                                skill.status === 'available' ? 'hsl(var(--warning))' : 'hsl(var(--muted))'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SkillIcon className="w-8 h-8 text-white" />
                  
                  {/* Status indicator */}
                  <div className="absolute -top-1 -right-1">
                    <StatusIcon className="w-5 h-5 text-white bg-current rounded-full p-0.5" />
                  </div>

                  {/* Progress ring */}
                  {skill.status !== 'locked' && skill.progress > 0 && (
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="30"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      <motion.circle
                        cx="50%"
                        cy="50%"
                        r="30"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={188.4}
                        initial={{ strokeDashoffset: 188.4 }}
                        animate={{ strokeDashoffset: 188.4 - (188.4 * skill.progress) / 100 }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </svg>
                  )}
                </motion.div>

                {/* Skill name */}
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-xs font-medium text-foreground whitespace-nowrap">
                    {skill.name}
                  </div>
                </div>

                {/* Hover tooltip */}
                {hoveredSkill === skill.id && (
                  <motion.div
                    className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 p-3 bg-popover border rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{ zIndex: 10 }}
                  >
                    <div className="text-sm font-medium text-foreground">{skill.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{skill.description}</div>
                    {skill.progress > 0 && (
                      <div className="text-xs text-primary mt-2">
                        Progresso: {skill.progress}%
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-muted-foreground">Desbloqueado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-muted-foreground">Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <span className="text-muted-foreground">Bloqueado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};