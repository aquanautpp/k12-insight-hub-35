import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/contexts/ProgressContext";
import { 
  TrendingUp, 
  Calendar,
  Clock,
  Target,
  Award,
  Brain,
  BookOpen,
  BarChart3,
  Zap,
  Download,
  Settings
} from "lucide-react";

const ProgressView = () => {
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const { progress } = useProgress();
  
  const weeklyProgress = [
    { day: 'Seg', mathematics: 85, science: 70, language: 90 },
    { day: 'Ter', mathematics: 90, science: 75, language: 85 },
    { day: 'Qua', mathematics: 78, science: 80, language: 92 },
    { day: 'Qui', mathematics: 95, science: 85, language: 88 },
    { day: 'Sex', mathematics: 88, science: 90, language: 94 },
    { day: 'Sáb', mathematics: 92, science: 78, language: 85 },
    { day: 'Dom', mathematics: 86, science: 82, language: 90 }
  ];

  const learningStats = {
    totalHours: 24.5,
    problemsSolved: 156,
    streakDays: 12,
    aiRecommendationsUsed: 8
  };

  const skillsProgress = [
    { skill: 'Álgebra', level: 85, trend: 'up', change: '+12%' },
    { skill: 'Geometria', level: 72, trend: 'up', change: '+8%' },
    { skill: 'Frações', level: 94, trend: 'stable', change: '+2%' },
    { skill: 'Resolução de Problemas', level: 88, trend: 'up', change: '+15%' },
    { skill: 'Pensamento Lógico', level: 76, trend: 'down', change: '-3%' }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-secondary" />;
    if (trend === 'down') return <TrendingUp className="w-4 h-4 text-destructive rotate-180" />;
    return <TrendingUp className="w-4 h-4 text-muted-foreground rotate-90" />;
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-subtle min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Análise de Progresso</h1>
          <p className="text-muted-foreground">Acompanhe seu desenvolvimento e conquistas</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="text-green-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button variant="learning" size="sm" className="text-green-700">
            <Settings className="w-4 h-4 mr-2" />
            Configurar Metas
          </Button>
        </div>
      </div>

      {/* Guia Explicativo */}
      <Card className="p-6 bg-gradient-focus border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">Como Funciona o Acompanhamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <h4 className="font-medium text-foreground mb-1">📊 Métricas Adaptivas</h4>
                <p className="text-foreground/80">A IA monitora seu desempenho em tempo real, identificando padrões de aprendizagem e áreas de melhoria.</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <h4 className="font-medium text-foreground mb-1">🎯 Metas Personalizadas</h4>
                <p className="text-foreground/80">Definimos objetivos baseados no seu ritmo e estilo de aprendizagem para maximizar o progresso.</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <h4 className="font-medium text-foreground mb-1">🚀 Insights Preditivos</h4>
                <p className="text-foreground/80">Prevemos tendências futuras e sugerimos ações para otimizar seu desenvolvimento contínuo.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Learning Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-learning text-white shadow-learning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Tempo de Estudo</p>
              <p className="text-2xl font-bold">{learningStats.totalHours}h</p>
            </div>
            <Clock className="w-8 h-8 text-white/70" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-achievement text-white shadow-achievement">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Problemas Resolvidos</p>
              <p className="text-2xl font-bold">{learningStats.problemsSolved}</p>
            </div>
            <Target className="w-8 h-8 text-white/70" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-focus text-primary border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary/70 text-sm">Sequência de Dias</p>
              <p className="text-2xl font-bold">{learningStats.streakDays}</p>
            </div>
            <Zap className="w-8 h-8 text-primary/70" />
          </div>
        </Card>
        
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">IA Utilizada</p>
              <p className="text-2xl font-bold text-foreground">{learningStats.aiRecommendationsUsed}</p>
            </div>
            <Brain className="w-8 h-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card className="p-6 shadow-card">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">Progresso Semanal</h2>
          <p className="text-sm text-muted-foreground">Seu desempenho geral nos últimos 7 dias</p>
        </div>
        
        <div className="space-y-6">
          {/* Gráfico Principal Simplificado */}
          <div className="grid grid-cols-7 gap-3">
            {weeklyProgress.map((day, index) => {
              const dailyAverage = Math.round((day.mathematics + day.science + day.language) / 3);
              return (
                <div key={index} className="text-center">
                  <div className="mb-3">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-t from-gray-100 to-gray-50 border flex items-end justify-center p-1">
                      <div 
                        className={`w-full rounded-sm transition-all duration-700 ${
                          dailyAverage >= 90 ? 'bg-green-500' :
                          dailyAverage >= 70 ? 'bg-blue-500' :
                          dailyAverage >= 50 ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}
                        style={{ height: `${Math.max(dailyAverage, 8)}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-foreground mb-1">{day.day}</p>
                  <p className="text-xs text-muted-foreground">{dailyAverage}%</p>
                </div>
              );
            })}
          </div>

          {/* Legenda Minimalista */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-muted-foreground">Excelente (90%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-muted-foreground">Bom (70-89%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className="text-muted-foreground">Regular (50-69%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-400"></div>
                <span className="text-muted-foreground">Precisa melhorar (&lt;50%)</span>
              </div>
            </div>
          </div>

          {/* Detalhes por Matéria - Expandível */}
          <div className="border-t pt-4">
            <Button 
              variant="ghost" 
              className="w-full text-sm text-muted-foreground hover:text-foreground"
              onClick={() => {/* Toggle detailed view */}}
            >
              Ver detalhes por matéria ↓
            </Button>
          </div>
        </div>
      </Card>

      {/* Skills Progress */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Progresso por Habilidade</h2>
          <Badge variant="outline">Últimos 30 dias</Badge>
        </div>
        
        <div className="space-y-4">
          {skillsProgress.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{skill.skill}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(skill.trend)}
                  <span className={`text-sm font-medium ${
                    skill.trend === 'up' ? 'text-secondary' : 
                    skill.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {skill.change}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">{skill.level}%</span>
                </div>
              </div>
              <Progress value={skill.level} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-focus border border-primary/20 shadow-learning">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-primary mr-3" />
          <h2 className="text-xl font-bold text-primary">Insights de IA</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/80 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Award className="w-4 h-4 text-secondary mr-2" />
              <span className="font-medium text-foreground">Pontos Fortes</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Excelente progressão em frações e resolução visual de problemas. Continue explorando o método pictórico.
            </p>
          </div>
          
          <div className="bg-white/80 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Target className="w-4 h-4 text-accent mr-2" />
              <span className="font-medium text-foreground">Área de Melhoria</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Foque em pensamento lógico sequencial. Recomendamos mais prática com problemas de múltiplas etapas.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressView;