import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp, 
  Clock,
  Star,
  ArrowRight,
  Lightbulb
} from "lucide-react";

interface UserProfile {
  level: number;
  learningStyle: string;
  strengths: string[];
  weakAreas: string[];
  recentActivity: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  sessionLength: 'short' | 'medium' | 'long';
}

interface Recommendation {
  id: string;
  type: 'activity' | 'content' | 'method' | 'schedule';
  title: string;
  description: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  confidence: number;
  category: string;
  action: {
    text: string;
    route?: string;
    function?: () => void;
  };
}

interface SmartRecommendationEngineProps {
  userProfile: UserProfile;
  onRecommendationClick: (recommendation: Recommendation) => void;
}

const SmartRecommendationEngine: React.FC<SmartRecommendationEngineProps> = ({
  userProfile,
  onRecommendationClick
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gerar recomendações baseadas no perfil do usuário
  const generateRecommendations = (profile: UserProfile): Recommendation[] => {
    const recs: Recommendation[] = [];

    // Recomendações baseadas em áreas fracas
    if (profile.weakAreas.includes('mathematics')) {
      recs.push({
        id: 'math_weakness',
        type: 'activity',
        title: 'Reforço em Matemática - Método CPA',
        description: 'Pratique conceitos matemáticos usando o método Concreto-Pictorial-Abstrato',
        reason: 'Detectamos que matemática é uma área que precisa de atenção',
        priority: 'high',
        estimatedTime: 25,
        confidence: 92,
        category: 'Matemática',
        action: {
          text: 'Começar Prática',
          route: '/cpa-method'
        }
      });
    }

    // Recomendações baseadas no estilo de aprendizagem
    if (profile.learningStyle === 'visual') {
      recs.push({
        id: 'visual_content',
        type: 'content',
        title: 'Conteúdo Visual Personalizado',
        description: 'Diagramas, mapas mentais e infográficos sobre seus tópicos favoritos',
        reason: 'Seu estilo de aprendizagem é predominantemente visual',
        priority: 'medium',
        estimatedTime: 15,
        confidence: 88,
        category: 'Personalização',
        action: {
          text: 'Ver Conteúdo',
          route: '/visual-content'
        }
      });
    }

    // Recomendações baseadas no horário
    if (profile.timeOfDay === 'morning') {
      recs.push({
        id: 'morning_routine',
        type: 'schedule',
        title: 'Rotina Matinal Otimizada',
        description: 'Atividades cognitivamente desafiadoras pela manhã quando seu cérebro está mais alerta',
        reason: 'Seu melhor desempenho ocorre durante a manhã',
        priority: 'medium',
        estimatedTime: 30,
        confidence: 85,
        category: 'Produtividade',
        action: {
          text: 'Configurar Rotina'
        }
      });
    }

    // Recomendações baseadas em pontos fortes
    if (profile.strengths.includes('logical_reasoning')) {
      recs.push({
        id: 'logic_challenges',
        type: 'activity',
        title: 'Desafios de Lógica Avançados',
        description: 'Problemas complexos que aproveitem seu raciocínio lógico desenvolvido',
        reason: 'Você demonstra excelência em raciocínio lógico',
        priority: 'medium',
        estimatedTime: 20,
        confidence: 90,
        category: 'Lógica',
        action: {
          text: 'Ver Desafios',
          route: '/logic-challenges'
        }
      });
    }

    // Recomendação de inteligência emocional
    if (!profile.recentActivity.includes('emotional_intelligence')) {
      recs.push({
        id: 'ei_development',
        type: 'activity',
        title: 'Desenvolvimento de Inteligência Emocional',
        description: 'Exercícios de autoconsciência e regulação emocional',
        reason: 'Não houve atividade recente em desenvolvimento emocional',
        priority: 'high',
        estimatedTime: 18,
        confidence: 87,
        category: 'Inteligência Emocional',
        action: {
          text: 'Iniciar Módulo',
          route: '/emotional-intelligence'
        }
      });
    }

    // Recomendação de método baseado na duração da sessão
    if (profile.sessionLength === 'short') {
      recs.push({
        id: 'micro_learning',
        type: 'method',
        title: 'Sessões de Micro-Aprendizagem',
        description: 'Técnicas de aprendizado rápido e eficiente para sessões curtas',
        reason: 'Você prefere sessões de estudo mais curtas',
        priority: 'low',
        estimatedTime: 10,
        confidence: 83,
        category: 'Metodologia',
        action: {
          text: 'Aprender Técnica'
        }
      });
    }

    // Recomendação de revisão baseada em atividade recente
    if (profile.recentActivity.length > 0) {
      recs.push({
        id: 'review_session',
        type: 'activity',
        title: 'Sessão de Revisão Inteligente',
        description: 'Revise conceitos estudados recentemente para fortalecer a memória',
        reason: 'Revisão espaçada melhora a retenção do aprendizado',
        priority: 'medium',
        estimatedTime: 22,
        confidence: 91,
        category: 'Revisão',
        action: {
          text: 'Começar Revisão'
        }
      });
    }

    // Ordenar por prioridade e confiança
    return recs.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.confidence - a.confidence;
    });
  };

  useEffect(() => {
    setIsLoading(true);
    // Simular processamento de IA
    setTimeout(() => {
      const newRecommendations = generateRecommendations(userProfile);
      setRecommendations(newRecommendations);
      setIsLoading(false);
    }, 1500);
  }, [userProfile]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'activity': return <Target className="w-4 h-4" />;
      case 'content': return <BookOpen className="w-4 h-4" />;
      case 'method': return <Brain className="w-4 h-4" />;
      case 'schedule': return <Clock className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-learning flex items-center justify-center animate-pulse">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Analisando seu perfil...</h3>
          <p className="text-muted-foreground">
            Nossa IA está gerando recomendações personalizadas para você
          </p>
          <div className="w-48 mx-auto">
            <Progress value={65} className="h-2" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-focus text-white shadow-learning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Recomendações Inteligentes
          </CardTitle>
          <p className="text-white/90 text-sm">
            Baseado em seu perfil de aprendizagem e atividade recente
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((recommendation) => (
          <Card 
            key={recommendation.id} 
            className="hover:shadow-learning transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${getPriorityColor(recommendation.priority)} rounded-lg flex items-center justify-center text-white`}>
                    {getTypeIcon(recommendation.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{recommendation.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {recommendation.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-primary">
                    {recommendation.confidence}% confiança
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {recommendation.estimatedTime}min
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-foreground">{recommendation.description}</p>
              
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <strong>Por que:</strong> {recommendation.reason}
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => onRecommendationClick(recommendation)}
                className="w-full flex items-center justify-center gap-2"
                variant={recommendation.priority === 'high' ? 'default' : 'outline'}
              >
                {recommendation.action.text}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 && (
        <Card className="p-6 text-center">
          <Star className="w-12 h-12 mx-auto text-gold-500 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Perfil Otimizado!</h3>
          <p className="text-muted-foreground">
            Você está seguindo bem suas atividades de aprendizagem. Continue assim!
          </p>
        </Card>
      )}
    </div>
  );
};

export default SmartRecommendationEngine;