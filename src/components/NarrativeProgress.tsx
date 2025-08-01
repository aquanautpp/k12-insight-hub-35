import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Clock, Target, Star, Brain, Heart, Zap, BookOpen, Users, Lightbulb, Calendar, BarChart3, Sparkles } from "lucide-react";
interface NarrativeMilestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: "achievement" | "breakthrough" | "challenge" | "discovery";
  emotion: "joy" | "pride" | "determination" | "wonder";
  impact: number; // 1-10 scale
  skills: string[];
  storyText: string;
}
interface ProgressStoryProps {
  milestones: NarrativeMilestone[];
  currentLevel: number;
  totalXP: number;
  streak: number;
  className?: string;
}
export const NarrativeProgressVisualization: React.FC<ProgressStoryProps> = ({
  milestones,
  currentLevel,
  totalXP,
  streak,
  className = ""
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [animatingMilestone, setAnimatingMilestone] = useState<string | null>(null);

  // Auto-animate new milestones
  useEffect(() => {
    const latestMilestone = milestones.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    if (latestMilestone && Date.now() - latestMilestone.date.getTime() < 5000) {
      setAnimatingMilestone(latestMilestone.id);
      setTimeout(() => setAnimatingMilestone(null), 3000);
    }
  }, [milestones]);
  const getMilestoneIcon = (type: string, emotion: string) => {
    switch (type) {
      case "achievement":
        return Award;
      case "breakthrough":
        return Lightbulb;
      case "challenge":
        return Target;
      case "discovery":
        return Star;
      default:
        return BookOpen;
    }
  };
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "joy":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "pride":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "determination":
        return "text-red-600 bg-red-50 border-red-200";
      case "wonder":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };
  const getImpactSize = (impact: number) => {
    if (impact >= 8) return "w-16 h-16";
    if (impact >= 6) return "w-12 h-12";
    if (impact >= 4) return "w-10 h-10";
    return "w-8 h-8";
  };
  const generateProgressNarrative = () => {
    const achievementCount = milestones.filter(m => m.type === "achievement").length;
    const breakthroughCount = milestones.filter(m => m.type === "breakthrough").length;
    if (currentLevel >= 80) {
      return "🏆 Você está dominando a matemática como um verdadeiro mestre! Sua jornada épica está quase completa.";
    } else if (currentLevel >= 60) {
      return "🚀 Que progresso incrível! Você está voando alto e conquistando novos horizontes a cada dia.";
    } else if (currentLevel >= 40) {
      return "💪 Sua determinação está dando frutos! Cada passo te aproxima da maestria matemática.";
    } else if (currentLevel >= 20) {
      return "🌱 Uma jornada épica começou! Você está plantando sementes que se tornarão grandes conquistas.";
    }
    return "🎯 Sua aventura no mundo da matemática está apenas começando. Grandes descobertas te aguardam!";
  };
  const sortedMilestones = milestones.sort((a, b) => b.date.getTime() - a.date.getTime());
  return <div className={`space-y-6 ${className}`}>
      {/* Story Header */}
      <Card className="sophisticated-reveal premium-gradient-morph">
        <div className="p-8 text-center text-primary-foreground">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-4 float-animation">
              <BarChart3 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2 elegant-text-reveal text-foreground">Sua História de Conquistas</h2>
            <p className="text-foreground/90 elegant-text-reveal">
              {generateProgressNarrative()}
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="thoughtful-interaction bg-primary/10 border border-primary/30 rounded-xl p-4">
              <div className="text-2xl font-bold mb-1 text-foreground">{currentLevel}</div>
              <div className="text-sm text-foreground/70">Nível Atual</div>
            </div>
            <div className="thoughtful-interaction bg-primary/10 border border-primary/30 rounded-xl p-4">
              <div className="text-2xl font-bold mb-1 text-foreground">{totalXP.toLocaleString()}</div>
              <div className="text-sm text-foreground/70">XP Total</div>
            </div>
            <div className="thoughtful-interaction bg-primary/10 border border-primary/30 rounded-xl p-4">
              <div className="text-2xl font-bold mb-1 text-foreground">{streak}</div>
              <div className="text-sm text-foreground/70">Dias Seguidos</div>
            </div>
            <div className="thoughtful-interaction bg-primary/10 border border-primary/30 rounded-xl p-4">
              <div className="text-2xl font-bold mb-1 text-foreground">{milestones.length}</div>
              <div className="text-sm text-foreground/70">Marcos Históricos</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline of Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card className="sophisticated-reveal">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6 elegant-text-reveal">
                Linha do Tempo da Jornada
              </h3>

              <div className="space-y-6">
                {sortedMilestones.slice(0, 6).map((milestone, index) => {
                const IconComponent = getMilestoneIcon(milestone.type, milestone.emotion);
                const isSelected = selectedMilestone === milestone.id;
                const isAnimating = animatingMilestone === milestone.id;
                return <div key={milestone.id} className={`relative flex gap-4 cursor-pointer thoughtful-interaction ${isAnimating ? 'celebration-bounce' : ''} ${isSelected ? 'scale-105' : ''}`} onClick={() => setSelectedMilestone(isSelected ? null : milestone.id)}>
                      {/* Timeline Line */}
                      {index < sortedMilestones.length - 1 && <div className="absolute left-6 top-16 w-0.5 h-16 bg-gradient-to-b from-primary to-muted" />}

                      {/* Milestone Icon */}
                      <div className={`
                        ${getImpactSize(milestone.impact)} 
                        rounded-full flex items-center justify-center 
                        ${getEmotionColor(milestone.emotion)}
                        border-2 flex-shrink-0 digital-maker-glow
                        ${isAnimating ? 'animate-pulse' : ''}
                      `}>
                        <IconComponent className="w-6 h-6" />
                      </div>

                      {/* Milestone Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground elegant-text-reveal">
                            {milestone.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {milestone.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {milestone.date.toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {milestone.description}
                        </p>

                        {/* Skills Involved */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {milestone.skills.map((skill, skillIndex) => <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>)}
                        </div>

                        {/* Impact Indicator */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Impacto:</span>
                          <div className="flex gap-1">
                            {[...Array(10)].map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i < milestone.impact ? 'bg-primary' : 'bg-muted'}`} />)}
                          </div>
                        </div>

                        {/* Expanded Story */}
                        {isSelected && <div className="mt-4 p-4 bg-gradient-subtle rounded-lg border artistic-emphasis">
                            <h5 className="font-medium text-foreground mb-2">A História por Trás:</h5>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">
                              "{milestone.storyText}"
                            </p>
                          </div>}
                      </div>
                    </div>;
              })}
              </div>
            </div>
          </Card>
        </div>

        {/* Insights Sidebar */}
        <div className="space-y-4">
          {/* Recent Highlights */}
          <Card className="sophisticated-reveal digital-maker-glow">
            <div className="p-4">
              <h4 className="font-semibold text-foreground mb-3">Destaques Recentes</h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-subtle rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Sequência Épica</div>
                    <div className="text-xs text-muted-foreground">{streak} dias consecutivos</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-subtle rounded-lg">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Nível Máster</div>
                    <div className="text-xs text-muted-foreground">Nível {currentLevel}/100</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-subtle rounded-lg">
                  <Heart className="w-5 h-5 text-red-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Paixão pela Aprendizagem</div>
                    <div className="text-xs text-muted-foreground">Crescendo diariamente</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Next Milestone Prediction */}
          <Card className="sophisticated-reveal">
            <div className="p-4">
              <h4 className="font-semibold text-foreground mb-3">Próxima Conquista</h4>
              
              <div className="space-y-3">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-achievement flex items-center justify-center mx-auto mb-2">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h5 className="font-medium text-foreground">Mestre do CPA</h5>
                  <p className="text-xs text-muted-foreground">Complete 3 estágios</p>
                </div>

                <Progress value={67} className="h-2 progress-glow" />
                
                <div className="text-center text-xs text-muted-foreground">
                  Faltam apenas 2 atividades!
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* Emotional Journey - Full Width */}
      <Card className="sophisticated-reveal">
        <div className="p-8 text-center">
          <h4 className="text-foreground mb-3 font-semibold text-lg">Jornada Emocional</h4>
          
          <div className="space-y-2">
            {[{
            key: "autoconsciencia",
            label: "Autoconsciência Emocional",
            icon: "Brain",
            progress: 75
          }, {
            key: "autorregulacao",
            label: "Autorregulação Emocional",
            icon: "Heart",
            progress: 50
          }, {
            key: "automotivacao",
            label: "Automotivação & Resiliência",
            icon: "Target",
            progress: 30
          }, {
            key: "empatia",
            label: "Empatia & Consciência Social",
            icon: "Users",
            progress: 10
          }, {
            key: "habilidades_sociais",
            label: "Habilidades Sociais",
            icon: "Sparkles",
            progress: 0
          }].map(component => {
            const IconComponent = component.icon === "Brain" ? Brain : component.icon === "Heart" ? Heart : component.icon === "Target" ? Target : component.icon === "Users" ? Users : Sparkles;
            return <div key={component.key} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-primary" />
                      <span className="text-lg">{component.label}</span>
                    </div>
                    <span className="text-primary font-medium text-lg">{component.progress}%</span>
                  </div>
                  <Progress value={component.progress} className="h-1" />
                </div>;
          })}
          </div>
        </div>
      </Card>
    </div>;
};

// Sample milestone data
export const sampleProgressMilestones: NarrativeMilestone[] = [{
  id: "first-cpa",
  title: "Primeira Vitória CPA",
  description: "Completou o primeiro ciclo Concreto-Pictórico-Abstrato com maestria",
  date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  type: "achievement",
  emotion: "joy",
  impact: 8,
  skills: ["Método CPA", "Resolução de Problemas"],
  storyText: "Aquele momento mágico quando os números deixaram de ser símbolos misteriosos e se tornaram ferramentas poderosas em suas mãos. Você tocou, desenhou e finalmente compreendeu - a matemática ganhou vida!"
}, {
  id: "breakthrough-fractions",
  title: "Eureka das Frações",
  description: "Breakthrough revolucionário na compreensão de frações usando pizza de verdade",
  date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  type: "breakthrough",
  emotion: "wonder",
  impact: 9,
  skills: ["Frações", "Visualização", "Aplicação Prática"],
  storyText: "Com uma pizza real na mesa, as frações deixaram de ser conceitos abstratos. Cada fatia cortada era uma descoberta, cada pedaço compartilhado era matemática viva. Seu 'Eureka!' ecoou pela cozinha!"
}, {
  id: "week-streak",
  title: "Semana de Consistência",
  description: "Manteve a prática diária por 7 dias consecutivos com dedicação exemplar",
  date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  type: "challenge",
  emotion: "determination",
  impact: 7,
  skills: ["Disciplina", "Consistência", "Crescimento"],
  storyText: "Cada manhã você escolheu crescer. Cada desafio enfrentado com coragem. Sete dias podem parecer poucos, mas você provou que pequenas ações diárias criam transformações épicas."
}];