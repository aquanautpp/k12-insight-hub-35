import React from 'react';

interface MathTextRendererProps {
  content: string;
  className?: string;
}

const MathTextRenderer: React.FC<MathTextRendererProps> = ({ content, className = "" }) => {
  
  // Pre-processar e normalizar texto LaTeX
  const preprocessText = (text: string): string => {
    return text
      // Remove delimitadores LaTeX
      .replace(/\\\[|\\\]|\\\(|\\\)/g, '')
      .replace(/\$\$|\$/g, '')
      // Limpar comandos LaTeX
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\[a-z]+\s*(?=\{)/gi, '')
      // Normalizar espaços
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Converter símbolos LaTeX para Unicode
  const convertLatexSymbols = (text: string): string => {
    const conversions: Record<string, string> = {
      '\\pm': '±', '\\mp': '∓', '\\times': '×', '\\div': '÷',
      '\\leq': '≤', '\\geq': '≥', '\\neq': '≠', '\\approx': '≈',
      '\\infty': '∞', '\\sqrt': '√', '\\alpha': 'α', '\\beta': 'β',
      '\\gamma': 'γ', '\\delta': 'δ', '\\pi': 'π', '\\theta': 'θ',
      '\\lambda': 'λ', '\\mu': 'μ', '\\sigma': 'σ', '\\phi': 'φ',
      '\\omega': 'ω', '\\Delta': 'Δ', '\\sum': '∑', '\\int': '∫',
      '\\cdot': '·', '\\bullet': '•'
    };

    let result = text;
    for (const [latex, unicode] of Object.entries(conversions)) {
      result = result.replace(new RegExp(latex.replace(/\\/g, '\\\\'), 'g'), unicode);
    }
    return result;
  };

  // Renderizar frações com estilo visual adequado
  const renderFraction = (numerator: string, denominator: string, key: number): React.ReactNode => {
    const cleanNum = processMathParts(numerator.replace(/^\{+|\}+$/g, ''));
    const cleanDen = processMathParts(denominator.replace(/^\{+|\}+$/g, ''));
    
    return (
      <span key={key} className="inline-flex flex-col items-center mx-2 text-lg">
        <span className="px-3 py-1 min-w-[2rem] text-center leading-none font-semibold text-primary">
          {cleanNum}
        </span>
        <div className="border-t-2 border-primary w-full min-w-[3rem] my-1"></div>
        <span className="px-3 py-1 min-w-[2rem] text-center leading-none font-semibold text-primary">
          {cleanDen}
        </span>
      </span>
    );
  };

  // Renderizar potências e expoentes
  const renderSuperscript = (base: string, exp: string, key: number): React.ReactNode => {
    const cleanBase = processMathParts(base);
    const cleanExp = processMathParts(exp);
    
    return (
      <span key={key} className="inline-block font-semibold text-primary">
        {cleanBase}<sup className="text-sm font-bold text-accent">{cleanExp}</sup>
      </span>
    );
  };

  // Processar partes matemáticas individuais
  const processMathParts = (text: string): React.ReactNode => {
    const processed = convertLatexSymbols(preprocessText(text));
    
    // Detectar e renderizar símbolos especiais para Bhaskara
    if (processed.includes('±') || processed.includes('√')) {
      return <span className="font-bold text-primary">{processed}</span>;
    }
    
    return processed;
  };

  // Processar expressões matemáticas com análise melhorada
  const processMathExpression = (text: string): React.ReactNode[] => {
    let result: React.ReactNode[] = [];
    let working = text;
    let key = 0;

    // Detectar fórmula de Bhaskara completa
    const bhaskaraPattern = /x\s*=\s*\\frac\{-b\s*\\pm\s*\\sqrt\{b\^2\s*-\s*4ac\}\}\{2a\}/i;
    if (bhaskaraPattern.test(working)) {
      return [
        <div key="bhaskara" className="flex items-center gap-3 my-4 p-4 bg-muted rounded-lg">
          <span className="text-xl font-bold text-primary">x =</span>
          <div className="inline-flex flex-col items-center text-lg">
            <div className="px-4 py-2 text-center leading-none font-semibold text-primary">
              -b ± √<span className="border-t-2 border-primary px-2 ml-1">b² - 4ac</span>
            </div>
            <div className="border-t-3 border-primary w-full min-w-[8rem] my-2"></div>
            <div className="px-4 py-2 text-center leading-none font-semibold text-primary">
              2a
            </div>
          </div>
        </div>
      ];
    }

    // Processar frações primeiro (maior precedência)
    const fractionRegex = /\\frac\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
    let lastIndex = 0;
    let match;

    while ((match = fractionRegex.exec(working)) !== null) {
      // Adicionar texto antes da fração
      if (match.index > lastIndex) {
        const beforeText = working.substring(lastIndex, match.index);
        if (beforeText.trim()) {
          result.push(<span key={key++} className="font-medium">{convertLatexSymbols(beforeText)}</span>);
        }
      }
      
      // Adicionar fração
      result.push(renderFraction(match[1], match[2], key++));
      lastIndex = match.index + match[0].length;
    }

    // Processar texto restante após frações
    working = working.substring(lastIndex);
    
    // Processar raízes quadradas
    working = working.replace(/\\sqrt\s*\{([^}]+)\}/g, (match, content) => {
      result.push(
        <span key={key++} className="inline-flex items-center font-semibold text-primary">
          √<span className="border-t-2 border-primary px-2 ml-1">{processMathParts(content)}</span>
        </span>
      );
      return '';
    });

    // Processar potências com chaves
    working = working.replace(/([a-zA-Z0-9\(\)]+)\s*\^\s*\{([^}]+)\}/g, (match, base, exp) => {
      result.push(renderSuperscript(base, exp, key++));
      return '';
    });
    
    // Processar potências simples
    working = working.replace(/([a-zA-Z0-9\(\)]+)\s*\^\s*([a-zA-Z0-9]+)/g, (match, base, exp) => {
      result.push(renderSuperscript(base, exp, key++));
      return '';
    });

    // Limpar e adicionar texto restante
    if (working.trim()) {
      const cleaned = convertLatexSymbols(working)
        .replace(/\{([^}]*)\}/g, '$1')
        .replace(/\\?frac/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (cleaned) {
        result.push(<span key={key++} className="font-medium">{cleaned}</span>);
      }
    }

    return result.length > 0 ? result : [<span key="fallback" className="font-medium">{convertLatexSymbols(text)}</span>];
  };

  // Processar formatação de texto incluindo expressões matemáticas
  const processTextFormatting = (text: string): React.ReactNode => {
    // Verificar se parece uma expressão matemática
    const hasMath = /\\frac|\\sqrt|\^|\\[a-zA-Z]+|x\s*=/.test(text);
    
    if (hasMath) {
      return (
        <div className="flex items-center flex-wrap gap-2 my-2">
          {processMathExpression(text)}
        </div>
      );
    }

    // Processar texto normal com formatação em negrito
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