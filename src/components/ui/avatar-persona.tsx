import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarPersonaProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  icon?: React.ReactNode;
  gradient?: "primary" | "achievement" | "learning";
}

const sizeMap = {
  sm: "w-12 h-12",
  md: "w-16 h-16", 
  lg: "w-20 h-20",
  xl: "w-24 h-24"
};

const iconSizeMap = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8", 
  xl: "w-10 h-10"
};

const gradientMap = {
  primary: "bg-gradient-achievement",
  achievement: "bg-gradient-achievement", 
  learning: "bg-gradient-learning"
};

export function AvatarPersona({ 
  className, 
  size = "lg", 
  icon,
  gradient = "achievement"
}: AvatarPersonaProps) {
  return (
    <div className={cn(
      "avatar-persona rounded-full p-1",
      gradientMap[gradient],
      sizeMap[size],
      className
    )}>
      <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
        <div className={cn(
          "text-primary",
          iconSizeMap[size]
        )}>
          {icon || <Brain className="w-full h-full" />}
        </div>
      </div>
    </div>
  );
}