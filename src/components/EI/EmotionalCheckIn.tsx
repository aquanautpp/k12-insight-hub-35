import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useXP } from "@/contexts/XPContext";
import { useAchievement } from "@/contexts/AchievementContext";
import { CheckCircle, Flame, Gauge, Smile } from "lucide-react";
import { formatDate } from '@/lib/format';

interface CheckinRow {
  id: string;
  mood: string;
  energy: number;
  focus: number;
  note: string | null;
  created_at: string;
}

const moods = [
  { id: "muito_ruim", label: "😞", title: "Muito ruim" },
  { id: "ruim", label: "🙁", title: "Ruim" },
  { id: "neutro", label: "😐", title: "Neutro" },
  { id: "bem", label: "🙂", title: "Bem" },
  { id: "otimo", label: "🤩", title: "Ótimo" },
];

const EmotionalCheckIn = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addXP } = useXP();
  const { achievements, unlockedAchievements, unlockAchievement } = useAchievement();

  const [mood, setMood] = useState<string>("neutro");
  const [energy, setEnergy] = useState<number>(3);
  const [focus, setFocus] = useState<number>(3);
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<CheckinRow[]>([]);
  const [streak, setStreak] = useState<number>(0);

  const badges = useMemo(() => {
    const earned = [] as { id: string; label: string }[];
    if (streak >= 3) earned.push({ id: "streak-3", label: "🔥 3 dias" });
    if (streak >= 7) earned.push({ id: "streak-7", label: "🏅 7 dias" });
    if (streak >= 14) earned.push({ id: "streak-14", label: "🏆 14 dias" });
    return earned;
  }, [streak]);

  const loadData = async (): Promise<number | undefined> => {
    if (!user) return;
    const [{ data: checkins }, { data: prog }] = await Promise.all([
      supabase
        .from("ei_checkins")
        .select("id, mood, energy, focus, note, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("progresso")
        .select("ei_checkin_streak")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    setHistory(checkins || []);
    const s = prog?.ei_checkin_streak || 0;
    setStreak(s);
    return s;
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const submit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("ei_checkins").insert({
        user_id: user.id,
        mood,
        energy,
        focus,
        note: note || null,
      });
      if (error) {
        // Unique per day
        if ((error as any).code === "23505") {
          toast({
            title: "Check-in já realizado hoje",
            description: "Você já registrou seu check-in emocional hoje.",
          });
        } else {
          console.error(error);
          toast({ title: "Erro ao salvar", description: "Tente novamente." });
        }
      } else {
        toast({
          title: "Check-in registrado!",
          description: "Seu progresso emocional foi atualizado.",
        });
        setNote("");
        const newStreak = await loadData();
        if (typeof newStreak === 'number') {
          const milestones = [
            { id: 'streak_3', target: 3 },
            { id: 'streak_week', target: 7 },
            { id: 'streak_14', target: 14 },
            { id: 'streak_30', target: 30 },
          ];
          const newlyHit = milestones.filter(m => newStreak >= m.target && !achievements.some(a => a.id === m.id && a.isUnlocked));
          if (newlyHit.length > 0) {
            let gainedXP = 0;
            const unlockedNames: string[] = [];
            newlyHit.forEach(m => {
              const ach = achievements.find(a => a.id === m.id);
              if (ach) {
                gainedXP += ach.reward?.xp || 0;
                unlockedNames.push(ach.title);
              }
              unlockAchievement(m.id);
            });
            if (gainedXP > 0) {
              addXP(gainedXP, 'EI Streak');
            }
            toast({
              title: "Conquista desbloqueada!",
              description: `${unlockedNames.join(', ')} • +${gainedXP} XP`,
            });
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-label="Check-in Emocional" className="mb-8">
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground text-lg flex items-center gap-2">
            <Smile className="w-5 h-5 text-primary" />
            Check-in Emocional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Streak & Badges */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">Streak: {streak}d</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {badges.map((b) => (
                <Badge key={b.id} variant="secondary" className="bg-primary/10 text-primary">
                  {b.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-foreground mb-2 block">Humor</Label>
              <div className="flex gap-2">
                {moods.map((m) => (
                  <Button
                    key={m.id}
                    type="button"
                    variant={mood === m.id ? "secondary" : "outline"}
                    onClick={() => setMood(m.id)}
                    className="px-3"
                    aria-label={m.title}
                  >
                    <span className="text-xl" role="img" aria-label={m.title}>
                      {m.label}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-foreground mb-2 block flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary" /> Energia ({energy})
              </Label>
              <Slider value={[energy]} onValueChange={(v) => setEnergy(v[0])} min={1} max={5} step={1} />
            </div>

            <div>
              <Label className="text-foreground mb-2 block flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" /> Foco ({focus})
              </Label>
              <Slider value={[focus]} onValueChange={(v) => setFocus(v[0])} min={1} max={5} step={1} />
            </div>
          </div>

          <div>
            <Label className="text-foreground mb-2 block">Observações (opcional)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Algo que queira registrar hoje..."
              className="bg-background"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={submit} disabled={loading} variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
              Registrar check-in
            </Button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="pt-2">
              <Label className="text-foreground mb-3 block">Histórico recente</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {history.map((h) => (
                  <Card key={h.id} className="border-primary/10">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(h.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-foreground text-sm">
                          Humor: {h.mood.replace("_", " ")}, Energia: {h.energy}, Foco: {h.focus}
                        </div>
                        {h.note && (
                          <div className="text-muted-foreground text-xs mt-1 line-clamp-2">{h.note}</div>
                        )}
                      </div>
                      <Smile className="w-5 h-5 text-primary" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default EmotionalCheckIn;
