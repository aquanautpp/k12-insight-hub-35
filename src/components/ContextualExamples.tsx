import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Calculator, Brain, Target, Lightbulb } from "lucide-react";

interface ContextualExample {
  id: string;
  title: string;
  category: string;
  description: string;
  realWorldApplication: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  skills: string[];
}

interface ContextualExamplesProps {
  examples: ContextualExample[];
  currentSubject?: string;
  className?: string;
}

export const ContextualExamples: React.FC<ContextualExamplesProps> = ({
  examples,
  currentSubject = "mathematics",
  className = ""
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mathematics": return Calculator;
      case "logic": return Brain;
      case "social": return Users;
      case "practical": return Target;
      case "creative": return Lightbulb;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800 border-green-200";
      case "intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const translateDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "Iniciante";
      case "intermediate": return "Intermediário";
      case "advanced": return "Avançado";
      default: return difficulty;
    }
  };

  const filteredExamples = examples.filter(example => 
    currentSubject === "all" || example.category === currentSubject
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Exemplos Contextuais - Aprendizagem Situada
        </h3>
        <p className="text-muted-foreground text-sm">
          Conecte conceitos abstratos com situações reais do seu dia a dia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExamples.map((example) => {
          const IconComponent = getCategoryIcon(example.category);
          
          return (
            <Card key={example.id} className="p-5 card-clean hover-scale group">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-focus flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {example.title}
                    </h4>
                    <Badge className={getDifficultyColor(example.difficulty)}>
                      {translateDifficulty(example.difficulty)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {example.estimatedTime}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {example.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {example.description}
                </p>

                <div className="p-3 bg-gradient-subtle rounded-lg border border-primary/10">
                  <h5 className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Aplicação Real
                  </h5>
                  <p className="text-xs text-foreground leading-relaxed">
                    {example.realWorldApplication}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {example.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Dados de exemplo para demonstração
export const sampleContextualExamples: ContextualExample[] = [
  {
    id: "math-budget",
    title: "Orçamento Familiar Inteligente",
    category: "mathematics",
    description: "Aprenda percentuais e proporções criando um orçamento familiar real com metas de economia.",
    realWorldApplication: "Organize suas finanças pessoais, defina metas de poupança e tome decisões financeiras conscientes.",
    difficulty: "intermediate",
    estimatedTime: "15 min",
    skills: ["Percentuais", "Proporções", "Planejamento", "Análise de dados"]
  },
  {
    id: "logic-puzzle",
    title: "Mistério da Festa Surpresa",
    category: "logic",
    description: "Use raciocínio dedutivo para descobrir quem organizou a festa baseado em pistas lógicas.",
    realWorldApplication: "Desenvolva habilidades de investigação e resolução de problemas complexos no trabalho.",
    difficulty: "beginner",
    estimatedTime: "10 min",
    skills: ["Dedução", "Análise lógica", "Eliminação", "Padrões"]
  },
  {
    id: "social-negotiation",
    title: "Negociação em Grupo",
    category: "social",
    description: "Aprenda matemática de porcentagens negociando divisão justa de recursos em projetos de grupo.",
    realWorldApplication: "Melhore suas habilidades de negociação em reuniões de trabalho e decisões familiares.",
    difficulty: "intermediate",
    estimatedTime: "20 min",
    skills: ["Negociação", "Comunicação", "Percentuais", "Colaboração"]
  },
  {
    id: "practical-cooking",
    title: "Chef Matemático",
    category: "practical",
    description: "Domine frações e proporções ajustando receitas para diferentes números de pessoas.",
    realWorldApplication: "Cozinhe com precisão, ajuste receitas e gerencie ingredientes de forma eficiente.",
    difficulty: "beginner",
    estimatedTime: "12 min",
    skills: ["Frações", "Proporções", "Medidas", "Conversões"]
  }
];