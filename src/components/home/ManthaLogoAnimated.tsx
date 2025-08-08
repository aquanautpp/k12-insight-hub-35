import React from "react";
import logoCorrected from "@/assets/mantha-logo-corrected.png";

// Animated Mantha logo using design-system animations defined in index.css
// - Container: perspective + optional entrance (ray-swim)
// - Wrapper: fade-in
// - Image: gentle infinite float
const ManthaLogoAnimated: React.FC<{ className?: string }>= ({ className }) => {
  return (
    <div className={`mantha-logo-container ${className ?? ""}`} style={{ animation: "ray-swim 1.2s ease-out forwards" }}>
      <div className="opacity-0 [animation:manthaFadeIn_800ms_ease-out_forwards]">
        <img
          src={logoCorrected}
          alt="Logotipo oficial da Mantha em PNG transparente"
          className="mantha-logo-main select-none pointer-events-none max-w-[220px] md:max-w-[260px] h-auto"
          draggable={false}
          style={{ animation: "manthaFloat 6s ease-in-out infinite" }}
        />
      </div>
      <span aria-hidden className="pulse-dot absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-primary/60" />
    </div>
  );
};

export default ManthaLogoAnimated;
