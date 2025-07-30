import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Brain, 
  Target, 
  Users, 
  Sparkles,
  Lock,
  CheckCircle,
  PlayCircle,
  ArrowRight
} from "lucide-react";
import AutoconscienciaModule from "@/components/EI/AutoconscienciaModule";
import AutorregulacaoModule from "@/components/EI/AutorregulacaoModule";
import AutomotivacaoModule from "@/components/EI/AutomotivacaoModule";
import EmpatiaModule from "@/components/EI/EmpatiaModule";
import HabilidadesSociaisModule from "@/components/EI/HabilidadesSociaisModule";

// Tipos para o sistema de IE
type EIDomain = 'autoconsciencia' | 'autorregulacao' | 'automotivacao' | 'empatia' | 'habilidades_sociais';

interface EmotionalIntelligenceDomain {
  id: EIDomain;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  progress: number;
  isUnlocked: boolean;
  activities: number;
  completedActivities: number;
}

const EmotionalIntelligence = () => {
  const [selectedDomain, setSelectedDomain] = useState<EIDomain | null>(null);

  const domains: EmotionalIntelligenceDomain[] = [
    {
      id: 'autoconsciencia',
      title: 'Autoconsciência Emocional',
      description: 'Aprenda a reconhecer e nomear suas emoções',
      icon: <Brain className="w-8 h-8" />,
      color: 'text-primary',
      bgGradient: 'bg-gradient-to-br from-gradient-start to-gradient-end',
      progress: 75,
      isUnlocked: true,
      activities: 8,
      completedActivities: 6
    },
    {
      id: 'autorregulacao',
      title: 'Autorregulação Emocional',
      description: 'Desenvolva o controle das suas emoções',
      icon: <Heart className="w-8 h-8" />,
      color: 'text-primary',
      bgGradient: 'bg-gradient-to-br from-gradient-start to-gradient-end',
      progress: 50,
      isUnlocked: true,
      activities: 10,
      completedActivities: 5
    },
    {
      id: 'automotivacao',
      title: 'Automotivação & Resiliência',
      description: 'Fortaleça sua motivação e persistência',
      icon: <Target className="w-8 h-8" />,
      color: 'text-primary',
      bgGradient: 'bg-gradient-to-br from-gradient-start to-gradient-end',
      progress: 30,
      isUnlocked: true,
      activities: 7,
      completedActivities: 2
    },
    {
      id: 'empatia',
      title: 'Empatia & Consciência Social',
      description: 'Compreenda melhor os sentimentos dos outros',
      icon: <Users className="w-8 h-8" />,
      color: 'text-primary',
      bgGradient: 'bg-gradient-to-br from-gradient-start to-gradient-end',
      progress: 10,
      isUnlocked: true,
      activities: 9,
      completedActivities: 1
    },
    {
      id: 'habilidades_sociais',
      title: 'Habilidades Sociais',
      description: 'Melhore sua comunicação e relacionamentos',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'text-primary',
      bgGradient: 'bg-gradient-to-br from-gradient-start to-gradient-end',
      progress: 0,
      isUnlocked: true,
      activities: 12,
      completedActivities: 0
    }
  ];

  const overallProgress = Math.round(
    domains.reduce((sum, domain) => sum + domain.progress, 0) / domains.length
  );

  const handleDomainClick = (domainId: EIDomain) => {
    const domain = domains.find(d => d.id === domainId);
    if (domain?.isUnlocked) {
      setSelectedDomain(domainId);
    }
  };

  if (selectedDomain) {
    // Importar componente específico do domínio
    const DomainComponent = getDomainComponent(selectedDomain);
    return <DomainComponent onBack={() => setSelectedDomain(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-heart-primary to-heart-secondary mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Inteligência Emocional
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Desenvolva suas habilidades emocionais através de atividades práticas e reflexivas. 
            Aprenda a conhecer, controlar e expressar suas emoções de forma saudável.
          </p>
          
          {/* Progresso Geral */}
          <Card className="max-w-md mx-auto mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{overallProgress}%</div>
                <p className="text-muted-foreground mb-3">Progresso Geral</p>
                <Progress value={overallProgress} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Domínios da IE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {domains.map((domain, index) => (
            <Card 
              key={domain.id}
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                domain.isUnlocked ? 'shadow-lg' : 'opacity-60'
              } bg-gradient-to-br from-gradient-start to-gradient-end`}
              onClick={() => handleDomainClick(domain.id)}
            >
              <CardContent className="p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-white/90">
                    {domain.icon}
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {domain.completedActivities}/{domain.activities}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white">{domain.title}</h3>
                <p className="text-white/90 text-sm mb-4">{domain.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-white/90">
                    <span>Progresso</span>
                    <span>{domain.progress}%</span>
                  </div>
                  <Progress value={domain.progress} className="h-2 bg-white/20" />
                </div>
                
                {domain.isUnlocked && (
                  <Button variant="ghost" className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20">
                    <PlayCircle className="w-4 h-4" />
                    Continuar Atividades
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
                
                {!domain.isUnlocked && (
                  <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
                    <Lock className="w-4 h-4" />
                    Bloqueado
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Guia de Como Funciona */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              Como Funciona o Treinamento em IE?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Aprenda Através da Prática</h4>
                <p className="text-sm text-muted-foreground">
                  Atividades interativas, jogos e simulações que tornam o aprendizado emocional divertido e eficaz.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Reflita e Registre</h4>
                <p className="text-sm text-muted-foreground">
                  Use o diário emocional para registrar sentimentos e acompanhar seu crescimento pessoal.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Cresça Continuamente</h4>
                <p className="text-sm text-muted-foreground">
                  Receba feedback personalizado e desafios adaptativos para desenvolver suas habilidades emocionais.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avatar Emocional */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl">😊</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Seu Avatar Emocional: Alex, o Explorador
                </h3>
                <p className="text-muted-foreground mb-3">
                  Alex evolui conforme você completa as atividades de IE. Atualmente ele está no nível "Descobridor" 
                  e está ansioso para aprender mais sobre emoções com você!
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Nível Descobridor</Badge>
                  <Badge variant="outline">6 conquistas desbloqueadas</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Função auxiliar para retornar o componente do domínio
const getDomainComponent = (domainId: EIDomain) => {
  switch (domainId) {
    case 'autoconsciencia':
      return AutoconscienciaModule;
    case 'autorregulacao':
      return AutorregulacaoModule;
    case 'automotivacao':
      return AutomotivacaoModule;
    case 'empatia':
      return EmpatiaModule;
    case 'habilidades_sociais':
      return HabilidadesSociaisModule;
    default:
      return ({ onBack }: { onBack: () => void }) => (
        <div className="min-h-screen bg-gradient-subtle p-6">
          <button 
            onClick={onBack}
            className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold">Módulo em desenvolvimento</h1>
        </div>
      );
  }
};

export default EmotionalIntelligence;