import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Target, Users, Sparkles, Lock, CheckCircle, PlayCircle, ArrowRight } from "lucide-react";
import AutoconscienciaModule from "@/components/EI/AutoconscienciaModule";
import AutorregulacaoModule from "@/components/EI/AutorregulacaoModule";
import AutomotivacaoModule from "@/components/EI/AutomotivacaoModule";
import EmpatiaModule from "@/components/EI/EmpatiaModule";
import HabilidadesSociaisModule from "@/components/EI/HabilidadesSociaisModule";
import EmotionalCheckIn from "@/components/EI/EmotionalCheckIn";

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
  const domains: EmotionalIntelligenceDomain[] = [{
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
  }, {
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
  }, {
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
  }, {
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
  }, {
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
  }];
  const overallProgress = Math.round(domains.reduce((sum, domain) => sum + domain.progress, 0) / domains.length);
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
  return <div className="min-h-screen bg-gradient-subtle">
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

        {/* Check-in Emocional */}
        <EmotionalCheckIn />

        {/* Domínios da IE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {domains.map((domain, index) => <Card key={domain.id} className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${domain.isUnlocked ? 'shadow-lg' : 'opacity-60'} bg-white`} onClick={() => handleDomainClick(domain.id)}>
              {/* Parte superior com fundo verde oliva mais claro - padronizada */}
              <div className="p-6 text-white h-64 flex flex-col justify-between" style={{
            background: 'linear-gradient(135deg, hsl(82, 25%, 40%), hsl(82, 30%, 45%))'
          }}>
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
                    <div className="bg-white/80 h-2 rounded-full transition-all duration-300" style={{
                  width: `${domain.progress}%`
                }}></div>
                  </div>
                </div>
              </div>

              {/* Parte inferior com fundo branco - padronizada */}
              <CardContent className="p-4 bg-white h-16 flex items-center justify-center">
                {domain.isUnlocked && <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-foreground hover:bg-muted font-medium text-sm">
                    <PlayCircle className="w-4 h-4" />
                    Continuar Atividades
                    <ArrowRight className="w-4 h-4" />
                  </Button>}
                
                {!domain.isUnlocked && <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <Lock className="w-4 h-4" />
                    Bloqueado
                  </div>}
              </CardContent>
            </Card>)}
        </div>

        {/* Como Funciona - versão minimalista */}
        <section aria-label="Como funciona" className="mb-8">
          <div className="text-center mb-6">
            <h2 id="como-funciona" className="text-2xl font-semibold tracking-tight">Como funciona</h2>
            <p className="text-sm text-muted-foreground mt-1">Três passos simples para evoluir sua IE</p>
          </div>

          <div className="relative">
            {/* Conector sutil no desktop */}
            <div aria-hidden="true" className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />

            <div className="grid gap-4 md:grid-cols-3">
              {/* Etapa 1 */}
              <article className="relative rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-3 left-5 h-8 w-8 rounded-full bg-background ring-2 ring-primary text-foreground flex items-center justify-center text-xs font-semibold">1</div>
                <Brain className="absolute top-4 right-4 h-5 w-5 text-muted-foreground/70" aria-hidden="true" />
                <h3 className="text-base font-medium">Aprenda praticando</h3>
                <p className="mt-1 text-sm text-muted-foreground">Atividades curtas e objetivas para reconhecer emoções no dia a dia.</p>
              </article>

              {/* Etapa 2 */}
              <article className="relative rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-3 left-5 h-8 w-8 rounded-full bg-background ring-2 ring-primary text-foreground flex items-center justify-center text-xs font-semibold">2</div>
                <Heart className="absolute top-4 right-4 h-5 w-5 text-muted-foreground/70" aria-hidden="true" />
                <h3 className="text-base font-medium">Reflexão guiada</h3>
                <p className="mt-1 text-sm text-muted-foreground">Diário emocional com perguntas simples para consolidar aprendizados.</p>
              </article>

              {/* Etapa 3 */}
              <article className="relative rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-3 left-5 h-8 w-8 rounded-full bg-background ring-2 ring-primary text-foreground flex items-center justify-center text-xs font-semibold">3</div>
                <Target className="absolute top-4 right-4 h-5 w-5 text-muted-foreground/70" aria-hidden="true" />
                <h3 className="text-base font-medium">Evolução contínua</h3>
                <p className="mt-1 text-sm text-muted-foreground">Desafios se adaptam ao seu ritmo para manter o progresso.</p>
              </article>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            
          </div>
        </section>

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
    </div>;
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
      return ({
        onBack
      }: {
        onBack: () => void;
      }) => <div className="min-h-screen bg-gradient-subtle p-6">
          <button onClick={onBack} className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold">Módulo em desenvolvimento</h1>
        </div>;
  }
};
export default EmotionalIntelligence;