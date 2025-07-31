import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';
import logoImage from '@/assets/mantha-logo-corrected.png';

interface ManthaLogoInteractiveProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const ManthaLogoInteractive: React.FC<ManthaLogoInteractiveProps> = ({ 
  size = 'large', 
  className = '' 
}) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [hasShownTooltip, setHasShownTooltip] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  // Verifica se já foi mostrado na sessão
  useEffect(() => {
    const shown = sessionStorage.getItem('mantha-tooltip-shown');
    setHasShownTooltip(!!shown);
  }, []);

  const handleLogoClick = () => {
    if (!hasShownTooltip) {
      setIsTooltipOpen(true);
      setHasShownTooltip(true);
      sessionStorage.setItem('mantha-tooltip-shown', 'true');
    }
  };

  const handleCloseTooltip = () => {
    setIsTooltipOpen(false);
  };

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTooltipOpen(false);
      }
    };

    if (isTooltipOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isTooltipOpen]);

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  };

  const logoSize = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-20 h-20'
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Logo Principal */}
        <motion.div
          ref={logoRef}
          onClick={handleLogoClick}
          className={`${sizeClasses[size]} cursor-pointer relative flex items-center justify-center group`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow Pulsante de Fundo */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Container do Logo com Hover Effects */}
          <motion.div
            className="relative bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-2xl flex items-center justify-center group-hover:bg-white/15 transition-all duration-300"
            style={{ width: '100%', height: '100%' }}
            whileHover={{
              boxShadow: "0 0 30px rgba(124, 138, 124, 0.5)",
              borderColor: "rgba(255, 255, 255, 0.4)",
            }}
          >
            {/* Logo Image com Animações das "Folhas" */}
            <div className="relative">
              <motion.img
                src={logoImage}
                alt="MANTHA Logo"
                className={`${logoSize[size]} object-contain relative z-10`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{
                  rotateY: [0, 5, -5, 0],
                  transition: { duration: 0.8 }
                }}
              />
              
              {/* Pontos Animados das "Folhas" */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${30 + Math.cos((i * Math.PI) / 4) * 20}%`,
                    top: `${30 + Math.sin((i * Math.PI) / 4) * 20}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0.7],
                    scale: [0, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + i * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 2,
                  }}
                />
              ))}
              
              {/* Ripple Effect no Click */}
              <motion.div
                className="absolute inset-0 border border-primary/30 rounded-full"
                initial={{ scale: 1, opacity: 0 }}
                animate={isTooltipOpen ? {
                  scale: [1, 2, 3],
                  opacity: [0.5, 0.2, 0],
                } : { scale: 1, opacity: 0 }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>
          
          {/* Indicador de Clique (apenas se não foi mostrado) */}
          {!hasShownTooltip && (
            <motion.div
              className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Info className="w-3 h-3" />
            </motion.div>
          )}
        </motion.div>

        {/* Caracteres Gregos Decorativos */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/40 text-sm font-mono"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          μανθάνω
        </motion.div>
      </div>

      {/* Tooltip Glassmorphism */}
      <AnimatePresence>
        {isTooltipOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseTooltip}
            />
            
            {/* Tooltip */}
            <motion.div
              className="fixed top-1/2 left-1/2 z-50 w-96 max-w-[90vw]"
              style={{ transform: 'translate(-50%, -50%)' }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                {/* Elementos de Fundo Animados */}
                <div className="absolute inset-0">
                  {/* Ondas Sutis */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                      style={{ bottom: `${i * 8}px` }}
                      animate={{
                        x: ['-100%', '100%'],
                        opacity: [0, 0.5, 0],
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ))}
                  
                  {/* Arraia Nadando */}
                  <motion.div
                    className="absolute top-4 right-4 text-primary/30 text-2xl"
                    animate={{
                      x: [0, 10, 0],
                      y: [0, -5, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    🟢
                  </motion.div>
                </div>
                
                {/* Conteúdo */}
                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <motion.span
                        className="text-2xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        📜
                      </motion.span>
                      <h3 className="text-xl font-bold text-white">
                        Origem do Nome Mantha
                      </h3>
                    </div>
                    
                    <motion.button
                      onClick={handleCloseTooltip}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  {/* Texto Principal */}
                  <motion.p
                    className="text-white/90 leading-relaxed mb-6 text-base"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Mantha deriva de{' '}
                    <motion.span
                      className="font-mono text-primary font-semibold px-1 py-0.5 bg-primary/10 rounded"
                      animate={{ backgroundColor: ["rgba(124, 138, 124, 0.1)", "rgba(124, 138, 124, 0.2)", "rgba(124, 138, 124, 0.1)"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      μανθάνω (manthano)
                    </motion.span>
                    , que significa{' '}
                    <span className="text-primary font-semibold">"aprender"</span> em grego antigo.
                  </motion.p>
                  
                  <motion.p
                    className="text-white/80 leading-relaxed text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    O símbolo da arraia é uma referência criativa à{' '}
                    <span className="text-primary font-medium">arraia-manta</span>, unindo o conceito de 
                    aprendizagem com a elegância e fluidez deste majestoso animal marinho.
                  </motion.p>
                </div>
                
                {/* Seta Apontando para o Logo */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-white/10 backdrop-blur-xl border border-white/20 rotate-45"></div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};