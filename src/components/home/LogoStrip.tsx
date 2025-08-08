import React from "react";
import BlurImage from "@/components/BlurImage";
import logo1 from "@/assets/mantha-logo.png";
import logo2 from "@/assets/mantha-logo-transparent.png";
import logo3 from "@/assets/mantha-logo-new.png";
import logo4 from "@/assets/mantha-logo-corrected.png";

const logos = [
  { src: logo1, alt: "Logo Mantha" },
  { src: logo2, alt: "Marca Mantha" },
  { src: logo3, alt: "Identidade Mantha" },
  { src: logo4, alt: "Selo Mantha" },
];

const LogoStrip: React.FC = () => {
  return (
    <section aria-label="Confiança de quem usa" className="section-spacious py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs md:text-sm text-muted-foreground mb-4">
          Confiado por estudantes e educadores
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center opacity-80">
          {logos.map((l, i) => (
            <div key={i} className="flex items-center justify-center">
              <BlurImage src={l.src} alt={l.alt} className="h-8 md:h-10 w-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoStrip;
