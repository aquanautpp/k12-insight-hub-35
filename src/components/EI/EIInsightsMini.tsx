import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { useStudyCycle } from "@/hooks/useStudyCycle";
import { useUserProgress } from "@/hooks/useUserProgress";

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

export const EIInsightsMini: React.FC = () => {
  const { cycle, completedRatio } = useStudyCycle();
  const { progress: userProgress } = useUserProgress();

  const streak = userProgress?.ei_checkin_streak ?? 0;
  const sriData = useMemo(() => {
    const tasksCompletion = completedRatio; // 0..1

    const reflection = (cycle?.reflection || "").toLowerCase();
    const positive = ["consegui","fiquei calmo","organizado","funcionou","aprendi","feliz","motivado","consistente","clareza","entendi"]; 
    const negative = ["difícil","triste","ansioso","frustrado","falhei","desisti","cansado","confuso","errei"]; 
    let score = 0;
    positive.forEach(w => { if (reflection.includes(w)) score += 1; });
    negative.forEach(w => { if (reflection.includes(w)) score -= 1; });
    const sentiment = clamp((score + 5) / 10, 0, 1); // map -5..+5 to 0..1

    const streakFactor = clamp(streak / 7, 0, 1); // 1 week max

    const sri = clamp(Math.round(100 * (0.5 * tasksCompletion + 0.3 * sentiment + 0.2 * streakFactor)), 0, 100);
    const contribTasks = Math.round(tasksCompletion * 50);
    const contribSentiment = Math.round(sentiment * 30);
    const contribStreak = Math.round(streakFactor * 20);
    return { sri, contribTasks, contribSentiment, contribStreak };
  }, [cycle?.reflection, completedRatio, streak]);

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="w-5 h-5 text-primary" /> Índice de Autorregulação (0–100)
        </CardTitle>
        <CardDescription>Leitura rápida da semana (não usa dados sensíveis)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{sriData.sri}</div>
          <Badge variant={sriData.sri >= 70 ? "default" : "secondary"}>{sriData.sri >= 70 ? "Forte" : sriData.sri >= 40 ? "Em progresso" : "Atenção"}</Badge>
        </div>
        <Progress value={sriData.sri} className="h-2" />
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div><span className="font-medium">Tarefas</span><div className="text-muted-foreground">{sriData.contribTasks}/50</div></div>
          <div><span className="font-medium">Reflexão</span><div className="text-muted-foreground">{sriData.contribSentiment}/30</div></div>
          <div><span className="font-medium">Hábito</span><div className="text-muted-foreground">{sriData.contribStreak}/20</div></div>
        </div>
        <p className="text-xs text-muted-foreground">
          Sinal calculado localmente a partir do plano, reflexão e constância. Use para ajustar sua estratégia.
        </p>
      </CardContent>
    </Card>
  );
};
