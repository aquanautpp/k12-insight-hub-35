import React from 'react';

interface MathTextRendererProps {
  content: string;
  className?: string;
}

const MathTextRenderer: React.FC<MathTextRendererProps> = ({ content, className = "" }) => {
  
  // Pre-process and normalize LaTeX text
  const preprocessText = (text: string): string => {
    return text
      // Remove LaTeX delimiters completely
      .replace(/\\\[|\\\]|\\\(|\\\)/g, '')
      .replace(/\$\$|\$/g, '')
      // Clean LaTeX commands
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\[a-z]+\s*(?=\{)/gi, '') // Remove LaTeX commands before braces
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Convert LaTeX symbols to Unicode equivalents
  const convertLatexSymbols = (text: string): string => {
    const conversions: Record<string, string> = {
      '\\pm': '±', '\\mp': '∓', '\\times': '×', '\\div': '÷',
      '\\leq': '≤', '\\geq': '≥', '\\neq': '≠', '\\approx': '≈',
      '\\infty': '∞', '\\sqrt': '√', '\\alpha': 'α', '\\beta': 'β',
      '\\gamma': 'γ', '\\delta': 'δ', '\\pi': 'π', '\\theta': 'θ',
      '\\lambda': 'λ', '\\mu': 'μ', '\\sigma': 'σ', '\\phi': 'φ',
      '\\omega': 'ω', '\\Delta': 'Δ', '\\sum': '∑', '\\int': '∫'
    };

    let result = text;
    for (const [latex, unicode] of Object.entries(conversions)) {
      result = result.replace(new RegExp(latex.replace(/\\/g, '\\\\'), 'g'), unicode);
    }
    return result;
  };

  // Render fractions with proper visual styling
  const renderFraction = (numerator: string, denominator: string, key: number): React.ReactNode => {
    const cleanNum = preprocessText(numerator.replace(/^\{+|\}+$/g, ''));
    const cleanDen = preprocessText(denominator.replace(/^\{+|\}+$/g, ''));
    
    return (
      <span key={key} className="inline-flex flex-col items-center mx-1 text-base">
        <span className="px-2 py-0.5 min-w-[1.5rem] text-center leading-tight font-medium">
          {cleanNum}
        </span>
        <div className="border-t-2 border-primary w-full min-w-[2rem]"></div>
        <span className="px-2 py-0.5 min-w-[1.5rem] text-center leading-tight font-medium">
          {cleanDen}
        </span>
      </span>
    );
  };

  // Render superscripts with proper styling
  const renderSuperscript = (base: string, exp: string, key: number): React.ReactNode => {
    return (
      <span key={key} className="inline-block font-medium">
        {base}<sup className="text-xs font-bold text-primary">{exp}</sup>
      </span>
    );
  };

  // Process mathematical expressions with improved parsing
  const processMathExpression = (text: string): React.ReactNode[] => {
    let result: React.ReactNode[] = [];
    let remaining = preprocessText(text);
    let key = 0;

    // Step 1: Process fractions first (highest precedence)
    const fractionRegex = /\\frac\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
    let lastIndex = 0;
    let match;

    while ((match = fractionRegex.exec(remaining)) !== null) {
      // Add text before fraction
      if (match.index > lastIndex) {
        const beforeText = remaining.substring(lastIndex, match.index);
        if (beforeText.trim()) {
          result.push(convertLatexSymbols(beforeText));
        }
      }
      
      // Add fraction
      result.push(renderFraction(match[1], match[2], key++));
      lastIndex = match.index + match[0].length;
    }

    // Process remaining text after fractions
    remaining = remaining.substring(lastIndex);
    
    // Step 2: Process square roots
    remaining = remaining.replace(/\\sqrt\s*\{([^}]+)\}/g, (match, content) => {
      result.push(
        <span key={key++} className="inline-block font-medium">
          √<span className="border-t border-primary px-1">{content}</span>
        </span>
      );
      return '';
    });

    // Step 3: Process superscripts
    remaining = remaining.replace(/([a-zA-Z0-9\(\)]+)\s*\^\s*\{([^}]+)\}/g, (match, base, exp) => {
      result.push(renderSuperscript(base, exp, key++));
      return '';
    });
    
    remaining = remaining.replace(/([a-zA-Z0-9\(\)]+)\s*\^\s*([a-zA-Z0-9]+)/g, (match, base, exp) => {
      result.push(renderSuperscript(base, exp, key++));
      return '';
    });

    // Step 4: Clean up and add remaining text
    if (remaining.trim()) {
      const cleaned = convertLatexSymbols(remaining)
        .replace(/\{([^}]*)\}/g, '$1') // Remove remaining braces
        .replace(/\\?frac/g, '') // Remove stray frac commands
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
      
      if (cleaned) {
        result.push(cleaned);
      }
    }

    return result.length > 0 ? result : [convertLatexSymbols(text)];
  };

  // Process text formatting including math expressions
  const processTextFormatting = (text: string): React.ReactNode => {
    // Check if this looks like a math expression
    const hasMath = /\\frac|\\sqrt|\^|\\[a-zA-Z]+/.test(text);
    
    if (hasMath) {
      return (
        <span className="inline-flex items-center flex-wrap gap-1 font-medium text-primary">
          {processMathExpression(text)}
        </span>
      );
    }

    // Process regular text with bold formatting
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const parts = text.split(boldRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-primary">{part}</strong>;
      }
      return part;
    });
  };

  // Main rendering function for formatted text
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (line.trim() === '') {
        return <br key={lineIndex} />;
      }
      
      // Handle headers
      if (line.startsWith('###')) {
        return <h3 key={lineIndex} className="text-lg font-bold text-primary mb-3 mt-4 first:mt-0">{line.replace(/^###\s*/, '')}</h3>;
      } else if (line.startsWith('##')) {
        return <h2 key={lineIndex} className="text-xl font-bold text-primary mb-3 mt-4 first:mt-0">{line.replace(/^##\s*/, '')}</h2>;
      } else if (line.startsWith('#')) {
        return <h1 key={lineIndex} className="text-2xl font-bold text-primary mb-4 mt-4 first:mt-0">{line.replace(/^#\s*/, '')}</h1>;
      }
      
      // Handle lists
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        const listItem = line.replace(/^[\s]*[•-]\s*/, '');
        return (
          <div key={lineIndex} className="flex items-start gap-2 mb-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span>{processTextFormatting(listItem)}</span>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={lineIndex} className="mb-2 leading-relaxed text-foreground">
          {processTextFormatting(line)}
        </p>
      );
    });
  };

  return (
    <div className={`math-text-renderer ${className}`}>
      {renderFormattedText(content)}
    </div>
  );
};

export default MathTextRenderer;