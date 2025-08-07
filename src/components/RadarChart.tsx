import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Brain, Calculator, Target, Lightbulb, Heart, Users } from "lucide-react";

interface RadarChartProps {
  className?: string;
  data?: Array<{
    competencia: string;
    nivel: number;
    fullMark: number;
  }>;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  className = "",
  data
}) => {
  // Dados padrão se não fornecidos
  const defaultData = [
    {
      competencia: 'Matemática',
      nivel: 78,
      fullMark: 100,
    },
    {
      competencia: 'Lógica',
      nivel: 85,
      fullMark: 100,
    },
    {
      competencia: 'Criatividade',
      nivel: 72,
      fullMark: 100,
    },
    {
      competencia: 'Concentração',
      nivel: 90,
      fullMark: 100,
    },
    {
      competencia: 'Persistência',
      nivel: 65,
      fullMark: 100,
    },
    {
      competencia: 'Colaboração',
      nivel: 88,
      fullMark: 100,
    },
  ];

  const chartData = data || defaultData;

  const getCompetencyIcon = (competencia: string) => {
    switch (competencia.toLowerCase()) {
      case 'matemática':
        return <Calculator className="w-4 h-4" />;
      case 'lógica':
        return <Brain className="w-4 h-4" />;
      case 'criatividade':
        return <Lightbulb className="w-4 h-4" />;
      case 'concentração':
        return <Target className="w-4 h-4" />;
      case 'persistência':
        return <Heart className="w-4 h-4" />;
      case 'colaboração':
        return <Users className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Precisa melhorar';
  };

  return (
    <Card className={`${className} card-clean`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-xl">
          <Brain className="h-5 w-5 text-primary" />
          Radar de Competências
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Gráfico de Radar */}
          <motion.div
            className="h-80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsRadarChart data={chartData}>
                <PolarGrid 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeOpacity={0.3}
                />
                <PolarAngleAxis 
                  dataKey="competencia" 
                  tick={{ 
                    fontSize: 12, 
                    fill: 'hsl(var(--foreground))',
                    textAnchor: 'middle'
                  }}
                  className="text-foreground"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ 
                    fontSize: 10, 
                    fill: 'hsl(var(--muted-foreground))' 
                  }}
                />
                <Radar
                  name="Nível"
                  dataKey="nivel"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  animationBegin={0}
                  animationDuration={1500}
                />
              </RechartsRadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Lista de Competências */}
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <motion.div
                key={item.competencia}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {getCompetencyIcon(item.competencia)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">
                      {item.competencia}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {getScoreLevel(item.nivel)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(item.nivel)}`}>
                    {item.nivel}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    de 100
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resumo */}
        <motion.div
          className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h4 className="font-semibold text-sm text-foreground mb-2">
            Análise de Desempenho
          </h4>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {chartData.filter(item => item.nivel >= 80).length}
              </div>
              <div className="text-xs text-muted-foreground">
                Pontos Fortes
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {chartData.filter(item => item.nivel >= 60 && item.nivel < 80).length}
              </div>
              <div className="text-xs text-muted-foreground">
                Em Desenvolvimento
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">
                {chartData.filter(item => item.nivel < 60).length}
              </div>
              <div className="text-xs text-muted-foreground">
                Precisa Atenção
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};