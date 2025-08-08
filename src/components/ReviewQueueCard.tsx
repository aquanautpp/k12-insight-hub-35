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
  const {
    loading,
    items,
    addItem,
    review,
    loadDue
  } = useReviewQueue();
  const {
    toast
  } = useToast();
  const telemetry = useTelemetry();
  const [newTopic, setNewTopic] = useState("");
  const now = Date.now();
  const formatDateTime = (iso?: string | null) => {
    if (!iso) return "agora";
    try {
      const d = new Date(iso);
      return d.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
      });
    } catch {
      return "—";
    }
  };
  const handleAdd = async () => {
    if (!newTopic.trim()) return;
    try {
      await addItem(newTopic.trim().toLowerCase().replace(/\s+/g, "-"), newTopic.trim());
      toast({
        title: "Adicionado à revisão",
        description: "Vamos praticar no melhor momento!"
      });
      telemetry.trackUserAction("add_review_item", "review_queue", {
        topic: newTopic
      });
      setNewTopic("");
    } catch (e: any) {
      toast({
        title: "Erro ao adicionar",
        description: e.message,
        variant: "destructive"
      });
    }
  };
  const handleReview = async (id: string, success: boolean) => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;
      await review(item, success);
      toast({
        title: success ? "Acerto!" : "Reveja com calma",
        description: success ? "Ótimo! Intervalo ampliado." : "Sem problemas, ajustamos o intervalo."
      });
      telemetry.trackUserAction("review_item", "review_queue", {
        success
      });
    } catch (e: any) {
      toast({
        title: "Erro na revisão",
        description: e.message,
        variant: "destructive"
      });
    }
  };
  return <Card className="card-gradient">
      
      
    </Card>;
};