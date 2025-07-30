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

const Dashboard = () => {
  const { progress } = useProgress();
  const { xpData } = useXP();
  const { unlockedAchievements, checkAchievements } = useAchievement();

  // Update achievements based on current progress
  React.useEffect(() => {
    checkAchievements(progress, xpData);
  }, [progress.completedActivities, progress.currentStreak, xpData.currentLevel, progress.chatInteractions]);

  // Calculate dynamic progress based on actual data
  const studentProgress = {
    mathematics: Math.round((progress.cpaProgress.concrete + progress.cpaProgress.pictorial + progress.cpaProgress.abstract) / 3),
    reasoning: progress.skillsProgress.find(s => s.skill === 'Raciocínio Lógico')?.level || 75,
    creativity: progress.skillsProgress.find(s => s.skill === 'Criatividade')?.level || 70,
    overall: Math.round((progress.completedActivities / progress.totalActivities) * 100)
  };

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
      {/* Hero Section - Inspired by tryrefer.com */}
      <div className="section-spacious text-center">
        <div className="max-w-4xl mx-auto">
          <AvatarPersona 
            size="xl" 
            className="mx-auto mb-8" 
            icon={<Brain />}
          />
          
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight animate-fade-in">
            Bem-vindo de volta, Victor! 👋
          </h1>
          <h2 className="text-2xl md:text-3xl text-primary mb-6 font-medium animate-fade-in">
            Dominar matemática em <span className="text-secondary font-bold">15 minutos por dia</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Sua próxima conquista está a apenas alguns cliques de distância. Continue sua jornada épica de descobertas! 🚀
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button variant="pill" size="lg" className="min-w-48 hover-scale animate-fade-in">
              <BookOpen className="w-5 h-5 mr-2" />
              Alcançar Minha Meta Hoje
            </Button>
            <Button variant="pill-outline" size="lg" className="min-w-48 hover-scale animate-fade-in">
              <Target className="w-5 h-5 mr-2" />
              Celebrar Progresso
            </Button>
          </div>

          <div className="flex justify-center">
            <XPDisplay />
          </div>
        </div>
      </div>

      {/* Progress Overview - Clean Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-semibold text-center mb-12 text-foreground">
          Sua História de Conquistas ⭐
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(studentProgress).map(([subject, progress]) => (
            <Card key={subject} className="card-clean p-8 text-center group magnetic-hover thoughtful-interaction sophisticated-reveal">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-achievement flex items-center justify-center group-hover:scale-110 transition-transform duration-300 digital-maker-glow">
                {subject === 'mathematics' && <Calculator className="w-8 h-8 text-primary-foreground" />}
                {subject === 'reasoning' && <Brain className="w-8 h-8 text-primary-foreground" />}
                {subject === 'creativity' && <Star className="w-8 h-8 text-primary-foreground" />}
                {subject === 'overall' && <TrendingUp className="w-8 h-8 text-primary-foreground" />}
              </div>
              
              <h3 className="text-lg font-semibold mb-4 text-foreground elegant-text-reveal">
                {subject === 'mathematics' ? '🧮 Matemática' : 
                 subject === 'reasoning' ? '🧠 Raciocínio Lógico' :
                 subject === 'creativity' ? '✨ Criatividade' :
                 subject === 'overall' ? '🎯 Jornada Geral' : subject}
              </h3>
              
              <div className="space-y-3">
                <Progress value={progress} className={`h-3 animate-scale-in ${progress >= 85 ? 'progress-glow' : ''}`} />
                <div className="text-2xl font-bold text-primary animate-fade-in artistic-emphasis">{progress}%</div>
                <p className="text-sm text-muted-foreground">
                  {progress >= 80 ? '🏆 Quase dominado!' : 
                   progress >= 50 ? '🚀 Em progresso' : 
                   '🌱 Crescendo'}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Insights Section - Clean Modern Design */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <Card className="card-clean p-12 bg-gradient-focus">
          <div className="text-center mb-8">
            <AvatarPersona 
              size="lg" 
              className="mx-auto mb-6"
              icon={<img src={aiInsightsIcon} alt="AI Insights" className="w-full h-full rounded-full" />}
            />
            
            <h2 className="text-2xl font-semibold text-primary mb-3">
              Insights de IA Personalizada
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Nossa inteligência artificial analisou seu padrão de aprendizagem e criou recomendações personalizadas para você.
            </p>
          </div>
          
          <SmartInsights />
          
          {/* Quick Win Messages */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickWinMessage type="daily" />
            <QuickWinMessage type="skill" />
            <QuickWinMessage type="achievement" />
          </div>
        </Card>
      </div>

      {/* Adaptive Learning Section - Phase 2 */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdaptiveLearningPath 
              currentLevel={studentProgress.overall}
              completedModules={["Números Básicos", "Operações Simples", "Frações Iniciais"]}
              nextModules={["Percentuais Práticos", "Geometria Visual", "Álgebra Introdutória"]}
              successRate={87}
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Sua Trilha Personalizada</h3>
            <p className="text-sm text-muted-foreground">
              Baseado no seu estilo de aprendizagem e progresso atual
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-subtle rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Próximo Marco</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete 3 exercícios de percentuais para desbloquear "Mestre dos Números"
                </p>
              </div>
              <div className="p-3 bg-gradient-focus rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span className="font-medium text-sm">Tempo Estimado</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  15 minutos para completar sua meta diária
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Personality Showcase - Phase 3 */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <BrandPersonalityShowcase />
      </div>

      {/* Contextual Examples Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <ContextualExamples 
          examples={sampleContextualExamples}
          currentSubject="mathematics"
        />
      </div>

      {/* Achievements Section - Modern Layout */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Troféus Conquistados 🏆</h2>
          <p className="text-muted-foreground">Cada conquista te aproxima do próximo nível de maestria</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <Card key={index} className="card-clean p-6 text-center group hover:shadow-achievement">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {achievement.icon}
              </div>
              <h3 className="font-semibold text-base mb-2 text-foreground">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4 elegant-text-reveal">Pronto para Sua Próxima Aventura? 🎮</h2>
          <p className="text-muted-foreground elegant-text-reveal">Escolha seu caminho de aprendizagem e vamos juntos!</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="pill" size="xl" className="min-w-56 thoughtful-interaction premium-gradient-morph text-white border-0">
            <Brain className="w-5 h-5 mr-3" />
            🚀 Dominar CPA Hoje
          </Button>
          <Button variant="pill-outline" size="xl" className="min-w-56 magnetic-hover artistic-emphasis">
            <Target className="w-5 h-5 mr-3" />
            ⚡ Prática de 15min
          </Button>
          <Button variant="pill-secondary" size="xl" className="min-w-56 human-touch digital-maker-glow">
            <Award className="w-5 h-5 mr-3" />
            💪 Fortalecer Emoções
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;