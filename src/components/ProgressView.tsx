import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Calendar,
  Trophy,
  Target,
  Clock,
  Brain
} from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import { useXP } from "@/contexts/XPContext";
import { NarrativeProgressVisualization, sampleProgressMilestones } from "./NarrativeProgress";

const ProgressView: React.FC = () => {
  const { progress } = useProgress();
  const { xpData } = useXP();

  const skillsData = progress.skillsProgress.map(skill => ({
    name: skill.skill,
    progress: skill.level,
    trend: skill.trend
  }));

  const weeklyData = progress.analytics.weeklyProgress;
  const totalMinutes = Math.round(progress.totalHours * 60);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Seu Progresso de Aprendizagem
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seu desenvolvimento e conquistas
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-clean p-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-primary" />
              <Badge variant="outline">{progress.currentStreak} dias</Badge>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {progress.completedActivities}
            </h3>
            <p className="text-sm text-muted-foreground">
              Atividades completadas
            </p>
          </Card>

          <Card className="card-clean p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-primary" />
              <Badge variant="outline">Meta: 15min/dia</Badge>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {totalMinutes}min
            </h3>
            <p className="text-sm text-muted-foreground">
              Tempo total de estudo
            </p>
          </Card>

          <Card className="card-clean p-6">
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-8 h-8 text-primary" />
              <Badge variant="outline">Nível {xpData.currentLevel}</Badge>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {xpData.totalXP}
            </h3>
            <p className="text-sm text-muted-foreground">
              Experiência total
            </p>
          </Card>

          <Card className="card-clean p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-primary" />
              <Badge variant="outline">{progress.analytics.engagementScore}%</Badge>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {Math.round((progress.cpaProgress.concrete + progress.cpaProgress.pictorial + progress.cpaProgress.abstract) / 3)}%
            </h3>
            <p className="text-sm text-muted-foreground">
              Progresso CPA
            </p>
          </Card>
        </div>

        {/* Skills Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="card-clean p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Desenvolvimento de Habilidades
            </h3>
            
            <div className="space-y-4">
              {skillsData.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">
                      {skill.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {skill.progress}%
                      </span>
                      <TrendingUp 
                        className={`w-4 h-4 ${
                          skill.trend === 'up' ? 'text-green-500' : 
                          skill.trend === 'down' ? 'text-red-500' : 
                          'text-yellow-500'
                        }`} 
                      />
                    </div>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="card-clean p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Progresso Semanal (minutos)
            </h3>
            
            <div className="space-y-3">
              {weeklyData.map((minutes, index) => {
                const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground w-8">
                      {days[index]}
                    </span>
                    <div className="flex-1">
                      <Progress value={(minutes / 60) * 100} className="h-2" />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {minutes}min
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Narrative Progress */}
        <div className="mb-8">
          <NarrativeProgressVisualization 
            milestones={sampleProgressMilestones}
            currentLevel={Math.round((progress.cpaProgress.concrete + progress.cpaProgress.pictorial + progress.cpaProgress.abstract) / 3)}
            totalXP={xpData.totalXP}
            streak={progress.currentStreak}
          />
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="pill" size="lg" className="min-w-40">
              <Brain className="w-4 h-4 mr-2" />
              Continuar Estudando
            </Button>
            <Button variant="pill-outline" size="lg" className="min-w-40">
              <Calendar className="w-4 h-4 mr-2" />
              Ver Histórico
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressView;