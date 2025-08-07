import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Repeat2, Plus, Check, X } from "lucide-react";
import { useReviewQueue } from "@/hooks/useReviewQueue";
import { useToast } from "@/hooks/use-toast";
import { useTelemetry } from "@/contexts/TelemetryContext";

export const ReviewQueueCard: React.FC = () => {
  const { loading, items, addItem, review, loadDue } = useReviewQueue();
  const { toast } = useToast();
  const telemetry = useTelemetry();
  const [newTopic, setNewTopic] = useState("");

  const handleAdd = async () => {
    if (!newTopic.trim()) return;
    try {
      await addItem(newTopic.trim().toLowerCase().replace(/\s+/g, "-"), newTopic.trim());
      toast({ title: "Adicionado à revisão", description: "Vamos praticar no melhor momento!" });
      telemetry.trackUserAction("add_review_item", "review_queue", { topic: newTopic });
      setNewTopic("");
    } catch (e: any) {
      toast({ title: "Erro ao adicionar", description: e.message, variant: "destructive" });
    }
  };

  const handleReview = async (id: string, success: boolean) => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;
      await review(item, success);
      toast({ title: success ? "Acerto!" : "Reveja com calma", description: success ? "Ótimo! Intervalo ampliado." : "Sem problemas, ajustamos o intervalo." });
      telemetry.trackUserAction("review_item", "review_queue", { success });
    } catch (e: any) {
      toast({ title: "Erro na revisão", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Repeat2 className="w-5 h-5 text-primary" /> Fila de Revisão
        </CardTitle>
        <CardDescription>Prática espaçada com itens de estudo prioritários</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Adicionar tópico (ex: Frações)"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={!newTopic.trim()}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>

        <div className="space-y-3">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum item devido agora. Adicione um tópico acima.</p>
          )}
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">{it.title || it.item_id}</div>
                <div className="text-xs text-muted-foreground">Repetições: {it.repetitions} • Facilidade: {it.ease.toFixed(2)}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleReview(it.id, false)}>
                  <X className="w-4 h-4 mr-1" /> Errei
                </Button>
                <Button size="sm" onClick={() => handleReview(it.id, true)}>
                  <Check className="w-4 h-4 mr-1" /> Acertei
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => loadDue()} disabled={loading}>
            Recarregar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
