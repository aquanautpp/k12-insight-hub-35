import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { ManthaLogoInteractive } from '../ManthaLogoInteractive';
import educationalHeroVideo from '@/assets/educational-hero-video.jpg';

interface DashboardHeroProps {
  onViewChange?: (view: string) => void;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({ onViewChange }) => {
  return (
    <div className="relative h-[60vh] md:h-[500px] lg:h-[550px] w-full rounded-2xl mb-32 shadow-card overflow-visible">{/* Aumentei mb para o tooltip */}
      <div className="absolute inset-0">
        <img 
          src={educationalHeroVideo} 
          alt="Educational background" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60"></div>
      </div>
      <div className="relative z-10 h-full flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center space-y-6 max-w-4xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-6 flex flex-col items-center"
          >
            <ManthaLogoInteractive size="lg" showTooltipOnce={true} />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-3xl font-bold text-white mt-4 tracking-wider"
              style={{ 
                fontFamily: 'Georgia, serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              MANTHA
            </motion.h2>
          </motion.div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            Bem-vindo ao <span className="text-gold">Mantha</span>
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
            Sua jornada de aprendizagem personalizada usando IA e metodologias comprovadas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary text-lg px-8 backdrop-blur-sm"
              onClick={() => onViewChange?.('progress')}
            >
              Ver Progresso
              <TrendingUp className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary text-lg px-8 backdrop-blur-sm"
              onClick={() => onViewChange?.('cpa-method')}
            >
              Começar Hoje
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};