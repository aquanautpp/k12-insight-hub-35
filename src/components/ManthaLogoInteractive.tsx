import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X, Info } from 'lucide-react';

interface ManthaLogoInteractiveProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltipOnce?: boolean;
}

export const ManthaLogoInteractive: React.FC<ManthaLogoInteractiveProps> = ({ 
  size = 'lg',
  showTooltipOnce = true 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipShown, setTooltipShown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -50]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.95]);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  };

  const logoSize = sizeClasses[size];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowTooltip(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (logoRef.current && !logoRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };

    // Debounce event listeners
    let timeoutId: NodeJS.Timeout;
    
    if (showTooltip) {
      timeoutId = setTimeout(() => {
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  const handleLogoClick = () => {
    if (showTooltipOnce && tooltipShown) return;
    
    setShowTooltip(!showTooltip);
    if (!tooltipShown) {
      setTooltipShown(true);
    }
  };

  const leafVariants = {
    initial: (index: number) => ({
      scale: 0,
      opacity: 0,
      transition: { delay: index * 0.1 }
    }),
    animate: (index: number) => ({
      scale: 1,
      opacity: 1,
      transition: { 
        delay: index * 0.1,
        type: "spring" as const,
        stiffness: 200,
        damping: 15
      }
    }),
    hover: (index: number) => ({
      y: Math.sin(index * 0.5) * 2,
      x: Math.cos(index * 0.5) * 1,
      scale: 1.1,
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }),
    glow: (index: number) => ({
      filter: "brightness(1.5) drop-shadow(0 0 8px rgba(255,255,255,0.8))",
      transition: { 
        delay: index * 0.1,
        duration: 0.3
      }
    })
  };

  const mantaVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.6, delay: 0.3 }
    },
    hover: {
      rotateY: [0, 5],
      transition: { 
        duration: 1, 
        repeat: Infinity, 
        repeatType: "reverse" as const,
        ease: "easeInOut" 
      }
    },
    pulse: {
      filter: "drop-shadow(0 0 20px rgba(76, 175, 80, 0.6))",
      scale: 1.05,
      transition: { duration: 0.5 }
    }
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 0.6 },
    animate: {
      scale: [0, 1.5],
      opacity: [0.6, 0],
      transition: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  // Coordenadas das "folhas" (pontos brancos) baseadas no logo
  const leafPositions = [
    { x: 50, y: 35 }, // topo centro
    { x: 45, y: 42 }, // esquerda alta
    { x: 55, y: 42 }, // direita alta
    { x: 40, y: 50 }, // esquerda média
    { x: 60, y: 50 }, // direita média
    { x: 35, y: 58 }, // esquerda baixa
    { x: 65, y: 58 }, // direita baixa
    { x: 50, y: 65 }  // centro baixo
  ];

  return (
    <motion.div 
      className="relative" 
      ref={logoRef}
      style={{ y, scale }}
    >
      {/* Logo Container */}
      <motion.div
        className={`${logoSize} relative cursor-pointer mx-auto`}
        onClick={handleLogoClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover="hover"
        initial="initial"
        animate="animate"
      >
        {/* Glow Background - Reduce animation frequency */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{
            scale: [1, 1.1],
            opacity: [0.2, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ willChange: 'transform, opacity' }}
        />

        {/* Ripple Effect on Click */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/40"
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ 
                scale: [0, 1.5],
                opacity: [0.6, 0]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1.5 }}
            />
          )}
        </AnimatePresence>

        {/* Main Manta Ray Shape */}
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: showTooltip ? 1.05 : 1, 
            opacity: 1,
            rotateY: isHovered ? [0, 5] : 0,
            filter: showTooltip ? "drop-shadow(0 0 20px rgba(76, 175, 80, 0.6))" : "none"
          }}
          transition={{ 
            duration: showTooltip ? 0.5 : isHovered ? 2 : 0.6,
            delay: showTooltip ? 0 : 0.3,
            repeat: isHovered ? Infinity : 0
          }}
        >
          {/* SVG Manta Ray - Baseado no logo Mantha */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
          >
            {/* Manta Ray Body - Formato mais fiel ao logo */}
            <path
              d="M50 15 C20 15, 10 35, 15 55 C18 68, 30 75, 50 75 C70 75, 82 68, 85 55 C90 35, 80 15, 50 15 Z"
              fill="#7A8B47"
              className="transition-all duration-300"
            />
            
            {/* Tail of the manta ray */}
            <path
              d="M50 75 L50 85"
              stroke="#7A8B47"
              strokeWidth="3"
              fill="none"
            />
            
            {/* Central tree structure */}
            <path
              d="M50 45 L50 65"
              stroke="white"
              strokeWidth="2.5"
              fill="none"
            />
            
            {/* Branch structure - more organic like the logo */}
            <motion.path
              d="M50 50 L42 45"
              stroke="white"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
            <motion.path
              d="M50 50 L58 45"
              stroke="white"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
            <motion.path
              d="M50 55 L40 50"
              stroke="white"
              strokeWidth="1.8"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />
            <motion.path
              d="M50 55 L60 50"
              stroke="white"
              strokeWidth="1.8"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            />
            <motion.path
              d="M50 60 L38 55"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            />
            <motion.path
              d="M50 60 L62 55"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            />
          </svg>

          {/* Animated Leaves (white dots) */}
          {leafPositions.map((pos, index) => (
            <motion.div
              key={index}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: isHovered ? Math.sin(index * 0.5) * 2 : 0,
                x: isHovered ? Math.cos(index * 0.5) * 1 : 0,
                filter: showTooltip ? "brightness(1.5) drop-shadow(0 0 8px rgba(255,255,255,0.8))" : "none"
              }}
              transition={{ 
                delay: index * 0.1,
                duration: showTooltip ? 0.3 : isHovered ? 0.3 : 0.6,
                type: "spring",
                stiffness: 200,
                damping: 15,
                repeat: isHovered ? Infinity : 0,
                repeatType: "reverse"
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-50"
          >
            {/* Arrow pointing to logo */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-card border-l border-t border-border rotate-45" />
            
            {/* Tooltip Content */}
            <div className="relative bg-card/95 backdrop-blur-md border border-border rounded-xl p-6 max-w-sm w-80 shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-foreground">Origem do Nome Mantha</h3>
                </div>
                <button
                  onClick={() => setShowTooltip(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Mantha deriva de <span className="font-medium text-primary">μανθάνω (manthano)</span>, 
                  que significa "aprender" em grego antigo. O símbolo da arraia é uma referência criativa 
                  à arraia-manta, unindo o conceito de aprendizagem com a elegância e fluidez deste 
                  majestoso animal marinho.
                </p>

                {/* Greek Characters Animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center py-2"
                >
                  <span className="text-lg font-medium text-primary font-serif">μανθάνω</span>
                </motion.div>

                {/* Swimming Manta Animation */}
                <div className="relative h-12 overflow-hidden rounded-lg bg-gradient-to-r from-blue-500/10 to-teal-500/10">
                  <motion.div
                    animate={{
                      x: [-20, 300],
                      y: [0, -5]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-1/2 transform -translate-y-1/2"
                  >
                    <svg width="24" height="16" viewBox="0 0 24 16" className="text-primary/60">
                      <path
                        d="M12 4 C6 4, 2 8, 4 12 C6 14, 10 13, 12 12 C14 13, 18 14, 20 12 C22 8, 18 4, 12 4 Z"
                        fill="currentColor"
                      />
                    </svg>
                  </motion.div>
                  
                  {/* Water waves */}
                  <motion.div
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};