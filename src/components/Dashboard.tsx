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

const Dashboard = () => {
  const studentProgress = {
    mathematics: 85,
    reasoning: 78,
    creativity: 91,
    overall: 83
  };

  const aiInsights = [
    {
      type: "strength",
      message: "Você demonstra excelência em resolução visual de problemas",
      confidence: 94
    },
    {
      type: "recommendation",
      message: "Pratique mais problemas de frações usando o método pictórico",
      confidence: 87
    },
    {
      type: "pattern",
      message: "Seu melhor horário de aprendizagem é entre 9h-11h",
      confidence: 92
    }
  ];

  const achievements = [
    { title: "Mestre do Método CPA", description: "Completou todos os estágios", icon: "🏆" },
    { title: "Streak de 7 dias", description: "Praticou matemática 7 dias seguidos", icon: "🔥" },
    { title: "Pensador Visual", description: "Resolveu 50 problemas pictóricos", icon: "👁️" },
    { title: "Explorador de IA", description: "Utilizou todas as recomendações de IA", icon: "🤖" }
  ];

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

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(studentProgress).map(([subject, progress]) => (
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
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium text-primary">{progress}%</span>
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
                  {insight.type === 'strength' && <Target className="w-4 h-4 text-secondary mr-2" />}
                  {insight.type === 'recommendation' && <Brain className="w-4 h-4 text-primary mr-2" />}
                  {insight.type === 'pattern' && <Clock className="w-4 h-4 text-accent mr-2" />}
                  <span className="text-sm font-medium capitalize">{insight.type}</span>
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

      {/* Achievements */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-achievement flex items-center justify-center mr-3">
            <img src={achievementIcon} alt="Achievements" className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Suas Conquistas</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="group">
              <Card className="p-4 text-center hover:shadow-achievement transition-all duration-300 transform group-hover:-translate-y-1 group-hover:scale-105">
                <div className="text-3xl mb-2 group-hover:animate-pulse-glow">{achievement.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{achievement.title}</h3>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </Card>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="learning" className="h-16 text-base text-green-700">
          <Brain className="w-5 h-5 mr-3" />
          Método CPA
        </Button>
        <Button variant="achievement" className="h-16 text-base text-green-700">
          <Target className="w-5 h-5 mr-3" />
          Prática Personalizada
        </Button>
        <Button variant="focus" className="h-16 text-base text-green-700">
          <Award className="w-5 h-5 mr-3" />
          Continuar Estudando
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;