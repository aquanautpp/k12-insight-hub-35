import React from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageCircle, Target, BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollHijack } from '@/hooks/useScrollHijack';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
      duration: 0.8
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const features = [
  {
    icon: Brain,
    title: "Método CPA",
    description: "Aprendizagem visual e progressiva baseada no método Singapura"
  },
  {
    icon: MessageCircle,
    title: "Tutor IA",
    description: "Assistente inteligente personalizado para sua jornada"
  },
  {
    icon: Target,
    title: "Inteligência Emocional",
    description: "Desenvolvimento de habilidades socioemocionais"
  },
  {
    icon: BookOpen,
    title: "Leitura Personalizada",
    description: "Recomendações baseadas no seu perfil de aprendizagem"
  }
];

export const DashboardFeatures: React.FC = React.memo(() => {
  const isMobile = useIsMobile();
  const featuresRef = React.useRef<HTMLDivElement>(null);
  const { currentIndex } = useScrollHijack(featuresRef, features.length);

  return (
    <motion.section 
      ref={featuresRef}
      className="py-16 bg-gradient-to-b from-secondary/30 to-background"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Recursos de Aprendizagem
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubra as ferramentas que tornam o aprendizado mais eficaz e envolvente
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`card-gradient p-6 rounded-xl hover-scale transition-all duration-500 ${
                !isMobile && currentIndex === index ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
            >
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg text-primary mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
});

DashboardFeatures.displayName = 'DashboardFeatures';