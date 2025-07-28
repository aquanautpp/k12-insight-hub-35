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
  Star,
  Zap,
  Trophy
} from "lucide-react";
import aiInsightsIcon from "@/assets/ai-insights-icon.jpg";
import achievementIcon from "@/assets/achievement-icon.jpg";
import { useProgress } from "@/contexts/ProgressContext";
import XPSystem from "./XPSystem";
import AchievementSystem from "./AchievementSystem";
import SmartRecommendationEngine from "./SmartRecommendationEngine";

const Dashboard = () => {
  const { progress, addXP, unlockAchievement } = useProgress();
  
  const studentProgress = {
    mathematics: 85,
    reasoning: 78,
    creativity: 91,
    overall: 83
  };

  const aiInsights = [
    {
      type: "pontos_fortes",
      message: "Você demonstra excelência em resolução visual de problemas",
      confidence: 94
    },
    {
      type: "recomendacao",
      message: "Pratique mais problemas de frações usando o método pictórico",
      confidence: 87
    },
    {
      type: "padrao",
      message: "Seu melhor horário de aprendizagem é entre 9h-11h",
      confidence: 92
    }
  ];

  const handleRecommendationClick = (recommendation: any) => {
    console.log('Navigating to:', recommendation);
    if (recommendation.route) {
      // Navigate to route - here you would integrate with your router
      window.location.hash = recommendation.route;
    }
    addXP('Seguiu Recomendação', 25);
  };

  const userProfile = {
    level: progress.currentLevel,
    learningStyle: progress.testResults?.learningStyle || 'visual',
    strengths: ['logical_reasoning'],
    weakAreas: progress.skillsProgress.filter(s => s.level < 70).map(s => s.skill.toLowerCase().replace(' ', '_')),
    recentActivity: ['emotional_intelligence', 'mathematics'],
    timeOfDay: 'morning' as const,
    sessionLength: 'medium' as const
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-subtle min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo ao Meraki! 👋</h1>
          <p className="text-muted-foreground">Pronto para mais uma jornada de aprendizagem, Victor?</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            <Star className="w-4 h-4 mr-1" />
            Nível 12
          </Badge>
          <Button variant="learning" size="sm" className="text-green-700">
            <BookOpen className="w-4 h-4 mr-2" />
            Continuar Estudando
          </Button>
        </div>
      </div>

      {/* XP System */}
      <XPSystem
        currentXP={progress.currentXP}
        currentLevel={progress.currentLevel}
        xpToNextLevel={progress.xpToNextLevel}
        totalXPForNextLevel={progress.totalXPForNextLevel}
        recentGains={progress.recentXPGains}
      />

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(studentProgress).map(([subject, progressValue]) => (
          <Card key={subject} className="p-6 shadow-card hover:shadow-learning transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold capitalize text-foreground">
                {subject === 'mathematics' ? 'Matemática' : 
                 subject === 'reasoning' ? 'Raciocínio Lógico' :
                 subject === 'creativity' ? 'Criatividade' :
                 subject === 'overall' ? 'Geral' : subject}
              </h3>
              <div className="w-8 h-8 rounded-full bg-gradient-learning flex items-center justify-center">
                {subject === 'mathematics' && <Calculator className="w-4 h-4 text-white" />}
                {subject === 'reasoning' && <Brain className="w-4 h-4 text-white" />}
                {subject === 'creativity' && <Star className="w-4 h-4 text-white" />}
                {subject === 'overall' && <TrendingUp className="w-4 h-4 text-white" />}
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={progressValue} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium text-primary">{progressValue}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Insights Section */}
      <Card className="p-6 bg-gradient-focus border border-primary/20 shadow-learning">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/90 flex items-center justify-center mr-4 shadow-md">
            <img src={aiInsightsIcon} alt="AI Insights" className="w-8 h-8 rounded-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">Insights de IA Personalizada</h2>
            <p className="text-primary/70">Análise do seu padrão de aprendizagem</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className="bg-white/80 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {insight.type === 'pontos_fortes' && <Target className="w-4 h-4 text-secondary mr-2" />}
                  {insight.type === 'recomendacao' && <Brain className="w-4 h-4 text-primary mr-2" />}
                  {insight.type === 'padrao' && <Clock className="w-4 h-4 text-accent mr-2" />}
                  <span className="text-sm font-medium capitalize">
                    {insight.type === 'pontos_fortes' ? 'Pontos Fortes' : 
                     insight.type === 'recomendacao' ? 'Recomendação' : 
                     insight.type === 'padrao' ? 'Padrão' : insight.type}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {insight.confidence}% confiança
                </Badge>
              </div>
              <p className="text-sm text-foreground">{insight.message}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Smart Recommendations */}
      <SmartRecommendationEngine
        userProfile={userProfile}
        onRecommendationClick={handleRecommendationClick}
      />

      {/* Achievements */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-achievement flex items-center justify-center mr-3">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Sistema de Conquistas</h2>
        </div>
        
        <AchievementSystem
          achievements={progress.achievements}
          onClaimReward={(achievementId) => {
            const achievement = progress.achievements.find(a => a.id === achievementId);
            if (achievement) {
              addXP('Conquista Desbloqueada', achievement.rewards.xp);
              unlockAchievement(achievementId);
            }
          }}
        />
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="achievement" className="h-16 text-base text-green-700">
          <Brain className="w-5 h-5 mr-3" />
          Método CPA
        </Button>
        <Button variant="achievement" className="h-16 text-base text-green-700">
          <Target className="w-5 h-5 mr-3" />
          Prática Personalizada
        </Button>
        <Button variant="achievement" className="h-16 text-base text-green-700">
          <Award className="w-5 h-5 mr-3" />
          Continuar Estudando
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;