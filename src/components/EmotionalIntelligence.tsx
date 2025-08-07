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
              } bg-white`}
              onClick={() => handleDomainClick(domain.id)}
            >
              {/* Parte superior com fundo verde oliva mais claro - padronizada */}
              <div 
                className="p-6 text-white h-64 flex flex-col justify-between"
                style={{ background: 'linear-gradient(135deg, hsl(82, 25%, 40%), hsl(82, 30%, 45%))' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-white text-2xl">
                    {domain.icon}
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 font-medium text-xs px-2 py-1">
                    {domain.completedActivities}/{domain.activities}
                  </Badge>
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-3 text-white leading-tight">{domain.title}</h3>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">{domain.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-white/90">
                    <span>Progresso</span>
                    <span className="font-medium">{domain.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white/80 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${domain.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Parte inferior com fundo branco - padronizada */}
              <CardContent className="p-4 bg-white h-16 flex items-center justify-center">
                {domain.isUnlocked && (
                  <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-foreground hover:bg-muted font-medium text-sm">
                    <PlayCircle className="w-4 h-4" />
                    Continuar Atividades
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
                
                {!domain.isUnlocked && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <Lock className="w-4 h-4" />
                    Bloqueado
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Guia de Como Funciona - Redesenhada */}
        <div className="relative mb-8 overflow-hidden">
          {/* Background com padrão sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl"></div>
          
          <Card className="relative border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                🚀 Como Funciona sua Jornada Emocional?
              </CardTitle>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Descubra como desenvolver sua inteligência emocional de forma divertida e eficaz!
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Setas conectoras - visíveis apenas em telas médias+ */}
                <div className="hidden md:block absolute top-20 left-1/3 transform -translate-x-1/2">
                  <ArrowRight className="w-6 h-6 text-primary/30" />
                </div>
                <div className="hidden md:block absolute top-20 right-1/3 transform translate-x-1/2">
                  <ArrowRight className="w-6 h-6 text-primary/30" />
                </div>

                {/* Etapa 1 */}
                <div className="group relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    1
                  </div>
                  <Card className="h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto shadow-lg">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <PlayCircle className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <h4 className="font-bold text-lg mb-3 text-foreground">🎮 Aprenda Brincando</h4>
                      <p className="text-sm text-muted-foreground flex-1">
                        Jogos interativos, desafios emocionais e atividades práticas que fazem você aprender sem perceber!
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-primary">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">100% Divertido</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              
                {/* Etapa 2 */}
                <div className="group relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    2
                  </div>
                  <Card className="h-full bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mx-auto shadow-lg">
                          <Heart className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <h4 className="font-bold text-lg mb-3 text-foreground">📖 Reflita e Cresça</h4>
                      <p className="text-sm text-muted-foreground flex-1">
                        Diário emocional personalizado para registrar seus sentimentos e descobrir padrões incríveis sobre você!
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-primary">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Autoconhecimento</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              
                {/* Etapa 3 */}
                <div className="group relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    3
                  </div>
                  <Card className="h-full bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mx-auto shadow-lg">
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <h4 className="font-bold text-lg mb-3 text-foreground">🚀 Evolua Sempre</h4>
                      <p className="text-sm text-muted-foreground flex-1">
                        IA personalizada que se adapta ao seu ritmo, oferecendo desafios e feedback para você se superar!
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-accent">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Evolução Contínua</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                  <Sparkles className="w-5 h-5" />
                  <span>Comece sua jornada emocional agora!</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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