import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Brain, Target, BookOpen, Award, Clock } from "lucide-react";

interface MasteryIndicatorProps {
  skill: string;
  currentLevel: number;
  totalLevels: number;
  masteryPercentage: number;
  timeToMastery?: string;
  className?: string;
}

export const MasteryIndicator: React.FC<MasteryIndicatorProps> = ({
  skill,
  currentLevel,
  totalLevels,
  masteryPercentage,
  timeToMastery,
  className = ""
}) => {
  const getMasteryMessage = (percentage: number) => {
    if (percentage >= 95) return { text: "🏆 MESTRE SUPREMO", color: "text-yellow-600", bg: "bg-gradient-celebration" };
    if (percentage >= 85) return { text: "⭐ QUASE MESTRE", color: "text-purple-600", bg: "bg-gradient-achievement" };
    if (percentage >= 70) return { text: "🚀 AVANÇADO", color: "text-blue-600", bg: "bg-gradient-learning" };
    if (percentage >= 50) return { text: "📈 PROGREDINDO", color: "text-green-600", bg: "bg-gradient-focus" };
    return { text: "🌱 INICIANTE", color: "text-gray-600", bg: "bg-muted" };
  };

  const mastery = getMasteryMessage(masteryPercentage);

  return (
    <Card className={`p-6 ${mastery.bg} border-0 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{skill}</h3>
          <Badge className={`${mastery.color} bg-white/80 border-0`}>
            {mastery.text}
          </Badge>
        </div>
        <div className="text-right text-white">
          <div className="text-2xl font-bold">{currentLevel}/{totalLevels}</div>
          <div className="text-xs opacity-80">Nível Atual</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-white/90 text-sm">
          <span>Progresso para Maestria</span>
          <span>{masteryPercentage}%</span>
        </div>
        
        <Progress 
          value={masteryPercentage} 
          className="h-3 bg-white/20" 
        />

        {timeToMastery && (
          <div className="text-center text-white/80 text-sm">
            <Clock className="w-4 h-4 inline mr-2" />
            Tempo estimado para maestria: {timeToMastery}
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white/20 border-white/40 text-white hover:bg-white/30"
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Estudar
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white/20 border-white/40 text-white hover:bg-white/30"
          >
            <Target className="w-3 h-3 mr-1" />
            Praticar
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Learning Pattern component for educational flow
interface LearningPatternProps {
  patternName: string;
  description: string;
  applicableSubjects: string[];
  effectiveness: number;
  personalizedFor: string;
  className?: string;
}

export const LearningPattern: React.FC<LearningPatternProps> = ({
  patternName,
  description,
  applicableSubjects,
  effectiveness,
  personalizedFor,
  className = ""
}) => {
  return (
    <Card className={`p-4 card-clean hover-scale ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-foreground">{patternName}</h4>
          <Badge variant="outline" className="text-xs mt-1">
            Personalizado para {personalizedFor}
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">{effectiveness}%</div>
          <div className="text-xs text-muted-foreground">Eficácia</div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap gap-1 mb-3">
        {applicableSubjects.map((subject, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {subject}
          </Badge>
        ))}
      </div>

      <Progress value={effectiveness} className="h-2" />
    </Card>
  );
};