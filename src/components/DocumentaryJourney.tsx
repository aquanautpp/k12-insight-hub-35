import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Video,
  FileText,
  Users,
  Target,
  BookOpen,
  Lightbulb,
  Clock,
  CheckCircle
} from "lucide-react";

interface LearningChapter {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  videoUrl?: string;
  thumbnail: string;
  concepts: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  completed: boolean;
  transcript?: string;
}

interface DocumentaryJourneyProps {
  title: string;
  description: string;
  chapters: LearningChapter[];
  currentChapter: number;
  onChapterComplete: (chapterId: string) => void;
  className?: string;
}

export const DocumentaryLearningJourney: React.FC<DocumentaryJourneyProps> = ({
  title,
  description,
  chapters,
  currentChapter,
  onChapterComplete,
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const duration = parseInt(chapters[currentChapter]?.duration.split(' ')[0]) * 60 || 300;
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentChapter, chapters]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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

  const currentChapterData = chapters[currentChapter];
  const totalDuration = parseInt(currentChapterData?.duration.split(' ')[0]) * 60 || 300;
  const progressPercentage = (currentTime / totalDuration) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Journey Header */}
      <Card className="sophisticated-reveal magnetic-hover premium-gradient-morph">
        <div className="p-8 text-center text-white">
          <div className="mb-4">
            <Video className="w-12 h-12 mx-auto mb-3 float-animation" />
            <h2 className="text-2xl font-bold mb-2 elegant-text-reveal">{title}</h2>
            <p className="text-white/90 elegant-text-reveal">{description}</p>
          </div>
          
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{chapters.length} capítulos</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{chapters.reduce((acc, ch) => acc + parseInt(ch.duration), 0)} min total</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{chapters.filter(ch => ch.completed).length}/{chapters.length} completos</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="sophisticated-reveal overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              {/* Video Placeholder */}
              <div className="text-center text-white">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 thoughtful-interaction">
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{currentChapterData?.title}</h3>
                <p className="text-white/80 text-sm">{currentChapterData?.subtitle}</p>
              </div>

              {/* Play/Pause Overlay */}
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer thoughtful-interaction"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="p-4 bg-card">
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{currentChapterData?.duration}</span>
                </div>
                
                <Progress value={progressPercentage} className="h-2 progress-glow" />
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="human-touch"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setCurrentTime(0)}
                      className="human-touch"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowTranscript(!showTranscript)}
                      className="human-touch"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Transcrição
                    </Button>
                    
                    {progressPercentage >= 80 && (
                      <Button 
                        size="sm"
                        onClick={() => onChapterComplete(currentChapterData.id)}
                        className="thoughtful-interaction bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Concluir
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Chapter Details */}
          <Card className="sophisticated-reveal">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 elegant-text-reveal">
                    {currentChapterData?.title}
                  </h3>
                  <p className="text-muted-foreground elegant-text-reveal">
                    {currentChapterData?.description}
                  </p>
                </div>
                <Badge className={getDifficultyColor(currentChapterData?.difficulty || "beginner")}>
                  {translateDifficulty(currentChapterData?.difficulty || "beginner")}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Conceitos Abordados:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentChapterData?.concepts.map((concept, index) => (
                      <Badge key={index} variant="outline" className="artistic-emphasis">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>

                {showTranscript && currentChapterData?.transcript && (
                  <div className="p-4 bg-muted/30 rounded-lg digital-maker-glow">
                    <h4 className="font-medium text-foreground mb-2">Transcrição:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {currentChapterData.transcript}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Chapter Navigation */}
        <div className="space-y-4">
          <Card className="sophisticated-reveal">
            <div className="p-4">
              <h4 className="font-semibold text-foreground mb-3">Jornada de Aprendizagem</h4>
              <div className="space-y-2">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all thoughtful-interaction ${
                      index === currentChapter 
                        ? 'bg-primary/10 border-primary/30' 
                        : chapter.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-card border-border hover:border-primary/20'
                    }`}
                    onClick={() => {
                      setCurrentTime(0);
                      setIsPlaying(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        chapter.completed 
                          ? 'bg-green-500 text-white' 
                          : index === currentChapter 
                            ? 'bg-primary text-white' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {chapter.completed ? <CheckCircle className="w-3 h-3" /> : index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm text-foreground truncate">
                          {chapter.title}
                        </h5>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{chapter.duration}</span>
                          <Badge variant="outline" className="text-xs">
                            {translateDifficulty(chapter.difficulty)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Journey Progress */}
          <Card className="sophisticated-reveal digital-maker-glow">
            <div className="p-4">
              <h4 className="font-semibold text-foreground mb-3">Progresso da Jornada</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Capítulos Completos</span>
                  <span className="font-medium">{chapters.filter(ch => ch.completed).length}/{chapters.length}</span>
                </div>
                <Progress 
                  value={(chapters.filter(ch => ch.completed).length / chapters.length) * 100} 
                  className="h-2 progress-glow" 
                />
                <div className="text-xs text-muted-foreground text-center">
                  {chapters.filter(ch => ch.completed).length === chapters.length 
                    ? "🎉 Jornada Completa!" 
                    : `${chapters.length - chapters.filter(ch => ch.completed).length} capítulos restantes`
                  }
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Sample data for demonstration
export const sampleDocumentaryChapters: LearningChapter[] = [
  {
    id: "chapter-1",
    title: "O Mistério dos Números",
    subtitle: "Descobrindo a magia da matemática",
    description: "Uma jornada épica através da história dos números, desde as primeiras contagens até os conceitos modernos.",
    duration: "8 min",
    thumbnail: "/placeholder-thumbnail.jpg",
    concepts: ["História da matemática", "Sistemas numéricos", "Abstração"],
    difficulty: "beginner",
    completed: true,
    transcript: "Bem-vindos à incrível jornada do conhecimento matemático. Hoje vamos explorar como os números surgiram na humanidade..."
  },
  {
    id: "chapter-2", 
    title: "Construindo com Blocos",
    subtitle: "Método CPA na prática",
    description: "Veja como o método Concreto-Pictórico-Abstrato transforma o aprendizado de matemática.",
    duration: "12 min",
    thumbnail: "/placeholder-thumbnail.jpg",
    concepts: ["Método CPA", "Aprendizagem ativa", "Visualização"],
    difficulty: "intermediate",
    completed: false,
    transcript: "O método CPA revolucionou o ensino de matemática em Singapura. Vamos descobrir seus segredos..."
  },
  {
    id: "chapter-3",
    title: "A Arte da Resolução",
    subtitle: "Estratégias avançadas de problem-solving",
    description: "Técnicas sofisticadas para abordar problemas matemáticos complexos com confiança.",
    duration: "15 min",
    thumbnail: "/placeholder-thumbnail.jpg",
    concepts: ["Resolução de problemas", "Pensamento crítico", "Estratégias"],
    difficulty: "advanced",
    completed: false,
    transcript: "Resolver problemas é uma arte. Cada problema é um puzzle único que aguarda sua solução criativa..."
  }
];