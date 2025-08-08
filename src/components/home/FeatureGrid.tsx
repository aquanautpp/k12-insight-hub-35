import React, { RefObject } from "react";
import { Progress } from "@/components/ui/progress";

type Feature = {
  icon: React.ElementType<any>;
  title: string;
  description: string;
};

interface FeatureGridProps {
  featuresRef: RefObject<HTMLDivElement>;
  features: Feature[];
  currentIndex: number;
  isMobile: boolean;
  scrollProgress: number;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ featuresRef, features, currentIndex, isMobile, scrollProgress }) => {
  return (
    <section ref={featuresRef} className="bg-gradient-to-b from-secondary/30 to-background py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Recursos de Aprendizagem</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubra as ferramentas que tornam o aprendizado mais eficaz e envolvente
          </p>
        </div>

        <div className="max-w-md mx-auto -mt-4 mb-8">
          <Progress value={scrollProgress} className="h-1" />
          <div className="text-xs text-muted-foreground text-center mt-2">{Math.round(scrollProgress)}% explorado</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-learning card-gradient border border-primary/40 ${
                !isMobile && currentIndex === index ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
            >
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg text-primary mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
