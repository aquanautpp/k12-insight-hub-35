import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  children: string;
  className?: string;
  inline?: boolean;
}

const MathText: React.FC<MathTextProps> = ({ children, className = "", inline = false }) => {
  
  const renderMath = (text: string): string => {
    let processedText = text;
    
    // Substitui $$...$$ por renderização em bloco (deve vir antes de $...$)
    processedText = processedText.replace(/\$\$(.*?)\$\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { 
          displayMode: true,
          throwOnError: false,
          output: 'html'
        });
      } catch (error) {
        console.warn('KaTeX render error (block):', error);
        return `<span class="text-red-500 font-mono">Error: ${formula}</span>`;
      }
    });
    
    // Substitui $...$ por renderização inline
    processedText = processedText.replace(/\$([^$]*?)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { 
          displayMode: false,
          throwOnError: false,
          output: 'html'
        });
      } catch (error) {
        console.warn('KaTeX render error (inline):', error);
        return `<span class="text-red-500 font-mono">Error: ${formula}</span>`;
      }
    });
    
    // Substitui \[...\] por renderização em bloco
    processedText = processedText.replace(/\\\[(.*?)\\\]/gs, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { 
          displayMode: true,
          throwOnError: false,
          output: 'html'
        });
      } catch (error) {
        console.warn('KaTeX render error (block bracket):', error);
        return `<span class="text-red-500 font-mono">Error: ${formula}</span>`;
      }
    });
    
    // Substitui \(...\) por renderização inline
    processedText = processedText.replace(/\\\((.*?)\\\)/gs, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { 
          displayMode: false,
          throwOnError: false,
          output: 'html'
        });
      } catch (error) {
        console.warn('KaTeX render error (inline paren):', error);
        return `<span class="text-red-500 font-mono">Error: ${formula}</span>`;
      }
    });
    
    return processedText;
  };

  // Para casos em que só queremos processar markdown sem matemática
  const processMarkdown = (text: string): string => {
    // Normaliza quebras de linha para evitar grandes espaços, especialmente após títulos
    const normalized = text
      .replace(/^(### .*|## .*|# .*)\n+/gm, '$1\n') // apenas uma quebra após títulos
      .replace(/\n{3,}/g, '\n\n'); // colapsa múltiplas quebras

    return normalized
      // Headers (com margens compactas)
      .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold text-primary mb-1 mt-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold text-primary mb-1 mt-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-semibold text-primary mb-1 mt-2">$1</h1>')
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>')
      // Lists
      .replace(/^[•\-] (.*$)/gm, '<div class="flex items-start gap-2 mb-1"><span class="text-primary font-bold mt-0.5">•</span><span>$1</span></div>')
      // Line breaks
      .replace(/\n/g, '<br />');
  };

  const processedContent = processMarkdown(renderMath(children));

  if (inline) {
    return (
      <span 
        className={`math-inline ${className}`}
        dangerouslySetInnerHTML={{ __html: processedContent }} 
      />
    );
  }

  return (
    <div 
      className={`math-text text-sm md:text-[15px] leading-snug ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }} 
    />
  );
};

export default MathText;