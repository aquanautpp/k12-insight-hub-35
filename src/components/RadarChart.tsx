import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Brain, Target, Eye, Lightbulb, BookOpen, MessageSquare } from 'lucide-react';

interface CompetencyData {
  subject: string;
  A: number;
  B?: number;
  fullMark: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface RadarChartProps {
  mathProgress: number;
  reasoningProgress: number;
  className?: string;
}

export const RadarChartComponent: React.FC<RadarChartProps> = ({ 
  mathProgress, 
  reasoningProgress, 
  className = '' 
}) => {
  const data: CompetencyData[] = [
    {
      subject: 'Matemática',
      A: mathProgress,
      fullMark: 100,
      icon: Brain
    },
    {
      subject: 'Raciocínio',
      A: reasoningProgress,
      fullMark: 100,
      icon: Lightbulb
    },
    {
      subject: 'Visual',
      A: 75,
      fullMark: 100,
      icon: Eye
    },
    {
      subject: 'Comunicação',
      A: 65,
      fullMark: 100,
      icon: MessageSquare
    },
    {
      subject: 'Resolução',
      A: 80,
      fullMark: 100,
      icon: Target
    },
    {
      subject: 'Leitura',
      A: 70,
      fullMark: 100,
      icon: BookOpen
    }
  ];

  const maxValue = Math.max(...data.map(item => item.A));
  const averageValue = data.reduce((sum, item) => sum + item.A, 0) / data.length;

  return (
    <Card className={`card-gradient ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-xl">
          <Target className="h-5 w-5 text-primary" />
          Mapa de Competências
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsRadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid 
                  gridType="polygon"
                  stroke="hsl(var(--border))"
                  className="opacity-30"
                />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ 
                    fontSize: 12, 
                    fill: 'hsl(var(--foreground))',
                    fontWeight: 500
                  }}
                  className="text-xs"
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ 
                    fontSize: 10, 
                    fill: 'hsl(var(--muted-foreground))'
                  }}
                  tickCount={6}
                />
                <Radar
                  name="Progresso"
                  dataKey="A"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={{ 
                    r: 4, 
                    fill: 'hsl(var(--primary))',
                    strokeWidth: 2,
                    stroke: 'hsl(var(--background))'
                  }}
                />
              </RechartsRadarChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <motion.div 
              className="text-center p-3 rounded-xl bg-secondary/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-lg font-bold text-primary">{Math.round(averageValue)}%</div>
              <div className="text-xs text-muted-foreground">Média Geral</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-3 rounded-xl bg-secondary/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-lg font-bold text-success">{maxValue}%</div>
              <div className="text-xs text-muted-foreground">Melhor Área</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-3 rounded-xl bg-secondary/30 md:col-span-1 col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-lg font-bold text-warning">
                {data.find(item => item.A === Math.min(...data.map(d => d.A)))?.subject}
              </div>
              <div className="text-xs text-muted-foreground">Para Melhorar</div>
            </motion.div>
          </div>

          {/* Individual Progress Bars */}
          <div className="space-y-3">
            {data.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.subject}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.subject}</span>
                      <span className="text-sm text-muted-foreground">{item.A}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <motion.div
                        className="bg-primary h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.A}%` }}
                        transition={{ 
                          duration: 1, 
                          delay: index * 0.1 + 0.8,
                          ease: 'easeOut'
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};