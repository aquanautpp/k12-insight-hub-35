import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const BlurImage: React.FC<BlurImageProps> = ({ src, alt, className, onLoad, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={cn(
        "transition-all duration-500 will-change-transform",
        loaded ? "blur-0 opacity-100" : "blur-sm opacity-80",
        className
      )}
      {...rest}
    />
  );
};

export default BlurImage;
