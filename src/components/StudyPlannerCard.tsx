import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, ClipboardList, Save } from "lucide-react";
import { useStudyCycle, StudyTask } from "@/hooks/useStudyCycle";
import { useToast } from "@/hooks/use-toast";
import { useTelemetry } from "@/contexts/TelemetryContext";

export const StudyPlannerCard: React.FC = () => {
  const { toast } = useToast();
  const telemetry = useTelemetry();
  const { cycle, weekStart, upsertPlan, toggleTaskDone, saveReflection, completedRatio } = useStudyCycle();

  const [goalsText, setGoalsText] = useState("");
  const [tasks, setTasks] = useState<StudyTask[]>([
    { title: "", done: false },
    { title: "", done: false },
    { title: "", done: false },
  ]);
  const [reflection, setReflection] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  React.useEffect(() => {
    const withPadding = (arr: StudyTask[]) => {
      const base = [...arr];
      while (base.length < 3) base.push({ title: "", done: false });
      return base.slice(0, 3);
    };

    const goalsArr = Array.isArray(cycle?.goals) ? cycle!.goals : [];
    setGoalsText(goalsArr.join("\n"));
    const taskArr: StudyTask[] = Array.isArray(cycle?.tasks) ? cycle!.tasks : [];
    setTasks(withPadding(taskArr));
    setReflection(cycle?.reflection || "");
    setRating(cycle?.self_rating || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle?.id, cycle?.tasks]);

  const plannedCount = useMemo(() => tasks.filter(t => t.title.trim()).length, [tasks]);

  const handleSavePlan = async () => {
    try {
      const goals = goalsText
        .split(/\n+/)
        .map(s => s.trim())
        .filter(Boolean);
      const cleanTasks = tasks.filter(t => t.title.trim());
      await upsertPlan(goals, cleanTasks);
      toast({ title: "Plano salvo!", description: "Bons estudos nesta semana." });
      telemetry.trackUserAction("save_plan", "study_planner", { goals: goals.length, tasks: cleanTasks.length });
    } catch (e: any) {
      toast({ title: "Erro ao salvar plano", description: e.message, variant: "destructive" });
    }
  };

  const handleToggle = async (idx: number) => {
    try {
      // Atualização otimista para refletir imediatamente na UI
      setTasks((prev) => {
        const next = [...prev];
        if (next[idx]) next[idx] = { ...next[idx], done: !next[idx].done };
        return next;
      });
      await toggleTaskDone(idx);
      telemetry.trackUserAction("toggle_task", "study_planner", { index: idx });
    } catch (e: any) {
      toast({ title: "Erro ao atualizar tarefa", description: e.message, variant: "destructive" });
    }
  };

  const handleSaveReflection = async () => {
    try {
      await saveReflection(reflection, rating);
      toast({ title: "Reflexão salva", description: "Excelente hábito metacognitivo!" });
      telemetry.trackUserAction("save_reflection", "study_planner", { rating });
    } catch (e: any) {
      toast({ title: "Erro ao salvar reflexão", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="w-5 h-5 text-primary" /> Plano Semanal (início {new Date(weekStart).toLocaleDateString()})
        </CardTitle>
        <CardDescription>Defina metas, tarefas e registre sua reflexão (Plan-Do-Review)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Metas da Semana</label>
          <Textarea
            value={goalsText}
            onChange={(e) => setGoalsText(e.target.value)}
            placeholder="Ex: Resolver 5 problemas de frações\nEstudar 20 min por dia"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Tarefas (faça de 1 a 3)</label>
            <Badge variant="secondary">{Math.round(completedRatio * 100)}% concluído</Badge>
          </div>
          {tasks.map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <Checkbox checked={!!t.done} onCheckedChange={() => handleToggle(i)} />
              <Input
                value={t.title}
                onChange={(e) => {
                  const next = [...tasks];
                  next[i] = { ...next[i], title: e.target.value };
                  setTasks(next);
                }}
                placeholder={`Tarefa ${i + 1}`}
              />
              {t.done && <CheckCircle2 className="w-4 h-4 text-primary" />}
            </div>
          ))}
          <div className="flex gap-2 justify-end">
            <Button size="sm" onClick={handleSavePlan}>
              <Save className="w-4 h-4 mr-2" /> Salvar Plano
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Reflexão da Semana</label>
          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="O que funcionou? Onde tive dificuldade? Como vou ajustar?"
          />
          <div className="flex items-center gap-3 mt-2">
            <label className="text-sm">Autoavaliação (1-5)</label>
            <Input
              type="number"
              className="w-20"
              min={1}
              max={5}
              value={rating ?? ""}
              onChange={(e) => setRating(e.target.value ? Number(e.target.value) : null)}
            />
            <Button variant="secondary" size="sm" onClick={handleSaveReflection}>
              Salvar Reflexão
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
