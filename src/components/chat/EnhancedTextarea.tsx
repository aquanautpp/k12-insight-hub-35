import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface EnhancedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
}

export interface EnhancedTextareaRef {
  focus: () => void;
}

export const EnhancedTextarea = forwardRef<EnhancedTextareaRef, EnhancedTextareaProps>(
  ({ value, onChange, onKeyDown, placeholder, disabled, maxLength = 500, className }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus()
    }));

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onKeyDown?.(e);
      } else if (onKeyDown) {
        onKeyDown(e);
      }
    };

    const remainingChars = maxLength - value.length;
    const isNearLimit = remainingChars <= 50;

    return (
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(
            "min-h-[44px] max-h-32 resize-none transition-all duration-200",
            "rounded-xl border-2 text-sm md:text-base",
            "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
            className
          )}
          style={{
            height: 'auto',
            minHeight: '44px'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 128) + 'px';
          }}
        />
        
        {/* Character counter */}
        <div className={cn(
          "absolute bottom-2 right-3 text-xs transition-colors",
          isNearLimit ? "text-destructive" : "text-muted-foreground"
        )}>
          {remainingChars}
        </div>
        
        {/* Helper text */}
        <div className="mt-1 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Shift+Enter para nova linha • </span>
          Enter para enviar
        </div>
      </div>
    );
  }
);

EnhancedTextarea.displayName = 'EnhancedTextarea';