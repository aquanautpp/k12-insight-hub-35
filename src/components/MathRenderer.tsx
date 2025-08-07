import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className }) => {
  const renderMath = (text: string): string => {
    let processedText = text;
    
    // Substitui $$...$$ por renderização em bloco (deve vir antes de $...$)
    processedText = processedText.replace(/\$\$(.*?)\$\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { 
          displayMode: true,
          throwOnError: false 
        });
      } catch (error) {
        console.warn('KaTeX render error (block):', error);
        return `<span class="text-red-500">Error: ${formula}</span>`;
      }
    });
    
    // Substitui $...$ por renderização inline
    processedText = processedText.replace(/\$([^$]*?)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { 
          displayMode: false,
          throwOnError: false 
        });
      } catch (error) {
        console.warn('KaTeX render error (inline):', error);
        return `<span class="text-red-500">Error: ${formula}</span>`;
      }
    });
    
    // Substitui \[...\] por renderização em bloco
    processedText = processedText.replace(/\\\[(.*?)\\\]/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { 
          displayMode: true,
          throwOnError: false 
        });
      } catch (error) {
        console.warn('KaTeX render error (block bracket):', error);
        return `<span class="text-red-500">Error: ${formula}</span>`;
      }
    });
    
    // Substitui \(...\) por renderização inline
    processedText = processedText.replace(/\\\((.*?)\\\)/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { 
          displayMode: false,
          throwOnError: false 
        });
      } catch (error) {
        console.warn('KaTeX render error (inline paren):', error);
        return `<span class="text-red-500">Error: ${formula}</span>`;
      }
    });
    
    return processedText;
  };

  const processedContent = renderMath(content);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: processedContent }} 
    />
  );
};

export default MathRenderer;