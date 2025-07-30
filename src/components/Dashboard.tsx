import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Award,
  BookOpen,
  Calculator,
  Clock,
  Star
} from "lucide-react";
import aiInsightsIcon from "@/assets/ai-insights-icon.jpg";
import achievementIcon from "@/assets/achievement-icon.jpg";
import { useProgress } from "@/contexts/ProgressContext";
import { useXP } from "@/contexts/XPContext";
import { useAchievement } from "@/contexts/AchievementContext";
import { SmartInsights } from "./SmartInsights";
import { XPDisplay } from "./XPDisplay";
import { AvatarPersona } from "./ui/avatar-persona";
import { AdaptiveLearningPath } from "./AdaptiveLearningPath";
import { QuickWinMessage } from "./QuickWinMessage";
import { ContextualExamples, sampleContextualExamples } from "./ContextualExamples";
import { BrandPersonalityShowcase } from "./ArtisticBranding";
import { DocumentaryLearningJourney, sampleDocumentaryChapters } from "./DocumentaryJourney";
import { AuthenticAITutor, sampleTutorPersonality } from "./AuthenticTutor";
import { NarrativeProgressVisualization, sampleProgressMilestones } from "./NarrativeProgress";

interface DashboardProps {
  onViewChange?: (view: string) => void;
}

const Dashboard = ({ onViewChange }: DashboardProps) => {
  const { progress } = useProgress();
  const { xpData } = useXP();
  const { unlockedAchievements, checkAchievements } = useAchievement();

  // Update achievements based on current progress
  React.useEffect(() => {
    checkAchievements(progress, xpData);
  }, [progress.completedActivities, progress.currentStreak, xpData.currentLevel, progress.chatInteractions]);

  // Calculate dynamic progress based on actual data
  const studentProgress = React.useMemo(() => ({
    mathematics: Math.round((progress.cpaProgress.concrete + progress.cpaProgress.pictorial + progress.cpaProgress.abstract) / 3),
    reasoning: progress.skillsProgress.find(s => s.skill === 'Raciocínio Lógico')?.level || 75,
    overall: Math.round((progress.completedActivities / progress.totalActivities) * 100)
  }), [progress]);

  // Use recent unlocked achievements, fallback to static ones if none
  const achievements = unlockedAchievements.length > 0 
    ? unlockedAchievements.slice(-4)
    : [
        { title: "Mestre do Método CPA", description: "Completou todos os estágios", icon: "🏆" },
        { title: "Streak de 7 dias", description: "Praticou matemática 7 dias seguidos", icon: "🔥" },
        { title: "Pensador Visual", description: "Resolveu 50 problemas pictóricos", icon: "👁️" },
        { title: "Explorador de IA", description: "Utilizou todas as recomendações de IA", icon: "🤖" }
      ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Clean & Focused */}
      <div className="section-spacious text-center">
        <div className="max-w-3xl mx-auto">
          <AvatarPersona 
            size="lg" 
            className="mx-auto mb-6" 
            icon={<Brain className="w-8 h-8" />}
          />
          
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3 tracking-tight animate-fade-in">
            Bem-vindo de volta! 👋
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed animate-fade-in">
            Continue sua jornada de aprendizagem com o método CPA
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <Button variant="pill" size="lg" className="min-w-40 hover-scale animate-fade-in" onClick={() => onViewChange?.('cpa-method')}>
              <BookOpen className="w-4 h-4 mr-2" />
              Estudar Hoje
            </Button>
            <Button variant="pill-outline" size="lg" className="min-w-40 hover-scale animate-fade-in" onClick={() => onViewChange?.('progress')}>
              <Target className="w-4 h-4 mr-2" />
              Ver Progresso
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Overview - Simplified */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="relative">
          <XPDisplay className="absolute top-0 right-0" />
          <h2 className="text-xl font-semibold mb-8 text-foreground">
            Seu Progresso
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(studentProgress).map(([subject, progress]) => (
            <Card key={subject} className="card-clean p-6 text-center group hover-scale">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-achievement flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                {subject === 'mathematics' && <Calculator className="w-6 h-6 text-primary-foreground" />}
                {subject === 'reasoning' && <Brain className="w-6 h-6 text-primary-foreground" />}
                {subject === 'overall' && <TrendingUp className="w-6 h-6 text-primary-foreground" />}
              </div>
              
              <h3 className="text-base font-semibold mb-3 text-foreground">
                {subject === 'mathematics' ? 'Matemática' : 
                 subject === 'reasoning' ? 'Raciocínio' :
                 subject === 'overall' ? 'Geral' : subject}
              </h3>
              
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="text-xl font-bold text-primary">{progress}%</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Insights Section - Integrated */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <Card className="card-clean p-8 bg-gradient-focus border-2 border-primary/20 shadow-card">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              Insights Personalizados
            </h2>
            <p className="text-muted-foreground">
              Recomendações baseadas no seu progresso
            </p>
          </div>
          
          <SmartInsights />
          
          {/* Integrated Quick Win Message */}
          <div className="mt-4">
            <QuickWinMessage type="daily" />
          </div>
        </Card>
      </div>

      {/* Trilha Personalizada - Consolidated */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdaptiveLearningPath 
            currentLevel={studentProgress.overall}
            completedModules={["Números Básicos", "Operações Simples"]}
            nextModules={["Percentuais", "Geometria Visual"]}
            successRate={87}
          />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Próximos Passos</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-subtle rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Meta Diária</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  15 minutos de prática hoje
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section - Simplified */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">Conquistas 🏆</h2>
          <p className="text-muted-foreground text-sm">Suas últimas realizações</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
          {achievements.slice(0, 4).map((achievement, index) => (
            <Card key={index} className="card-clean p-4 text-center group hover-scale">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {achievement.icon}
              </div>
              <h3 className="font-medium text-sm mb-1 text-foreground">{achievement.title}</h3>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions - Simplified */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Continuar Aprendendo</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="pill" size="lg" className="min-w-40 hover-scale" onClick={() => onViewChange?.('cpa-method')}>
            <Brain className="w-4 h-4 mr-2" />
            Método CPA
          </Button>
          <Button variant="pill-outline" size="lg" className="min-w-40 hover-scale" onClick={() => onViewChange?.('activities')}>
            <Target className="w-4 h-4 mr-2" />
            Prática Rápida
          </Button>
          <Button variant="pill" size="lg" className="min-w-40 hover-scale" onClick={() => onViewChange?.('emotional-intelligence')}>
            <Award className="w-4 h-4 mr-2" />
            Int. Emocional
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;