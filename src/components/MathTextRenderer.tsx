import React from 'react';

interface MathTextRendererProps {
  content: string;
  className?: string;
}

const MathTextRenderer: React.FC<MathTextRendererProps> = ({ content, className = "" }) => {
  // Função para converter símbolos LaTeX para Unicode
  const convertLatexSymbols = (text: string): string => {
    const latexToUnicode: { [key: string]: string } = {
      '\\pm': '±',
      '\\mp': '∓',
      '\\times': '×',
      '\\div': '÷',
      '\\sqrt': '√',
      '\\leq': '≤',
      '\\geq': '≥',
      '\\neq': '≠',
      '\\approx': '≈',
      '\\infty': '∞',
      '\\alpha': 'α',
      '\\beta': 'β',
      '\\gamma': 'γ',
      '\\delta': 'δ',
      '\\pi': 'π',
      '\\theta': 'θ',
      '\\lambda': 'λ',
      '\\mu': 'μ',
      '\\sigma': 'σ',
      '\\phi': 'φ',
      '\\omega': 'ω'
    };

    let result = text;
    Object.entries(latexToUnicode).forEach(([latex, unicode]) => {
      result = result.replace(new RegExp(latex.replace('\\', '\\\\'), 'g'), unicode);
    });

    return result;
  };

  // Função para limpar delimitadores LaTeX
  const cleanLatexDelimiters = (text: string): string => {
    return text
      .replace(/\\\[/g, '') // Remove \[
      .replace(/\\\]/g, '') // Remove \]
      .replace(/\\\(/g, '') // Remove \(
      .replace(/\\\)/g, '') // Remove \)
      .replace(/\\text\{([^}]+)\}/g, '$1') // Convert \text{content} to content
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  };

  // Função para renderizar frações de forma visual
  const renderFraction = (numerator: string, denominator: string, key: number): React.ReactNode => {
    const cleanNum = cleanLatexDelimiters(numerator.replace(/^\{+|\}+$/g, ''));
    const cleanDen = cleanLatexDelimiters(denominator.replace(/^\{+|\}+$/g, ''));
    
    return (
      <span key={key} className="inline-flex flex-col items-center mx-1 text-sm">
        <span className="border-b border-current pb-0.5 min-w-[20px] text-center">
          {processFormula(cleanNum)}
        </span>
        <span className="pt-0.5 min-w-[20px] text-center">
          {processFormula(cleanDen)}
        </span>
      </span>
    );
  };

  // Função para processar fórmulas matemáticas
  const processFormula = (formula: string): React.ReactNode => {
    if (!formula) return '';
    
    // Limpar delimitadores primeiro
    let processed = cleanLatexDelimiters(formula);
    
    // Converter símbolos LaTeX
    processed = convertLatexSymbols(processed);
    
    // Processar raízes quadradas primeiro
    processed = processed.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
    processed = processed.replace(/\\sqrt/g, '√');
    
    // Processar potências com chaves x^{2}
    processed = processed.replace(/([a-zA-Z0-9\(\)]+)\^\{([^}]+)\}/g, (match, base, exp) => {
      const superscriptMap: { [key: string]: string } = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', 
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        '+': '⁺', '-': '⁻', '=': '⁼'
      };
      const unicodeExp = exp.split('').map(char => superscriptMap[char] || char).join('');
      return `${base}${unicodeExp}`;
    });
    
    // Processar potências simples x^2
    processed = processed.replace(/([a-zA-Z0-9\(\)]+)\^([0-9]+)/g, (match, base, exp) => {
      const superscriptMap: { [key: string]: string } = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', 
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
      };
      const unicodeExp = exp.split('').map(char => superscriptMap[char] || char).join('');
      return `${base}${unicodeExp}`;
    });
    
    // Limpar chaves extras e comandos restantes
    processed = processed.replace(/\{+/g, '').replace(/\}+/g, '');
    processed = processed.replace(/\\[a-zA-Z]+/g, '');
    processed = processed.replace(/frac/g, ''); // Remove palavra "frac" solta
    
    return processed;
  };

  // Função para renderizar texto com formatação matemática
  const renderFormattedText = (text: string) => {
    // Dividir o texto em linhas para processar
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Verificar se é um título (começando com #)
      if (line.startsWith('###')) {
        const title = line.replace(/^###\s*/, '');
        return (
          <h3 key={lineIndex} className="text-lg font-bold text-primary mb-3 mt-4 first:mt-0">
            {processTextFormatting(title)}
          </h3>
        );
      }
      
      if (line.startsWith('##')) {
        const title = line.replace(/^##\s*/, '');
        return (
          <h2 key={lineIndex} className="text-xl font-bold text-primary mb-3 mt-4 first:mt-0">
            {processTextFormatting(title)}
          </h2>
        );
      }
      
      if (line.startsWith('#')) {
        const title = line.replace(/^#\s*/, '');
        return (
          <h1 key={lineIndex} className="text-2xl font-bold text-primary mb-4 mt-4 first:mt-0">
            {processTextFormatting(title)}
          </h1>
        );
      }
      
      // Verificar se é uma lista (começando com • ou -)
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        const listItem = line.replace(/^[\s]*[•-]\s*/, '');
        return (
          <div key={lineIndex} className="flex items-start gap-2 mb-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span>{processTextFormatting(listItem)}</span>
          </div>
        );
      }
      
      // Linha vazia
      if (line.trim() === '') {
        return <div key={lineIndex} className="h-2" />;
      }
      
      // Texto normal
      return (
        <p key={lineIndex} className="mb-2 leading-relaxed">
          {processTextFormatting(line)}
        </p>
      );
    });
  };

  // Função para processar formatação de texto (negrito, potências, fórmulas)
  const processTextFormatting = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    
    // Limpar texto primeiro
    text = cleanLatexDelimiters(text);
    text = convertLatexSymbols(text);
    
    // Regex aprimorada para capturar frações e outras formatações
    const formatRegex = /(\*\*[^*]+\*\*|\\frac\{([^}]+)\}\{([^}]+)\}|\\\([^)]+\\\)|\\\[[^\]]+\\\]|\w+\^[0-9²³⁴⁵⁶⁷⁸⁹]+|\w+\^\{[^}]+\}|\b\d+[²³⁴⁵⁶⁷⁸⁹]+|\b[a-zA-Z]+[²³⁴⁵⁶⁷⁸⁹]+)/g;
    let match;
    
    while ((match = formatRegex.exec(text)) !== null) {
      // Adicionar texto antes do match
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index));
      }
      
      const matchedText = match[0];
      
      // Processar negrito (**texto**)
      if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
        const boldText = matchedText.slice(2, -2);
        parts.push(
          <strong key={match.index} className="font-bold text-primary">
            {boldText}
          </strong>
        );
      }
      // Processar frações \frac{numerator}{denominator}
      else if (matchedText.includes('\\frac')) {
        const fracMatch = matchedText.match(/\\frac\{([^}]+)\}\{([^}]+)\}/);
        if (fracMatch) {
          const [, numerator, denominator] = fracMatch;
          parts.push(renderFraction(numerator, denominator, match.index));
        }
      }
      // Processar LaTeX inline \(formula\)
      else if (matchedText.startsWith('\\(') && matchedText.endsWith('\\)')) {
        const formula = matchedText.slice(2, -2);
        parts.push(
          <span key={match.index} className="inline-math mx-1 px-2 py-1 bg-accent/20 rounded font-medium text-accent-foreground">
            {processFormula(formula)}
          </span>
        );
      }
      // Processar fórmulas LaTeX block \[formula\]
      else if (matchedText.startsWith('\\[') && matchedText.endsWith('\\]')) {
        const formula = matchedText.slice(2, -2);
        parts.push(
          <div key={match.index} className="math-formula my-4 p-4 text-center bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg text-lg font-semibold">
            {processFormula(formula)}
          </div>
        );
      }
      // Processar potências (x^2, x^{2}, 3², etc.)
      else if (matchedText.includes('^') || /[²³⁴⁵⁶⁷⁸⁹]/.test(matchedText)) {
        parts.push(renderSuperscript(matchedText, match.index));
      }
      // Texto normal
      else {
        parts.push(matchedText);
      }
      
      currentIndex = match.index + matchedText.length;
    }
    
    // Adicionar texto restante
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  // Função para renderizar texto com sobrescrito
  const renderSuperscript = (text: string, key: number) => {
    // Converter símbolos Unicode para sobrescrito HTML
    const unicodeToHtml: { [key: string]: string } = {
      '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', 
      '⁷': '7', '⁸': '8', '⁹': '9', '¹': '1', '⁰': '0'
    };
    
    // Se contém ^ com chaves (formato x^{2})
    if (text.includes('^{')) {
      const match = text.match(/(.+)\^\{([^}]+)\}/);
      if (match) {
        const [, base, exponent] = match;
        return (
          <span key={key} className="font-medium">
            {base}
            <sup className="text-xs font-bold text-primary">{exponent}</sup>
          </span>
        );
      }
    }
    
    // Se contém ^ simples (formato x^2)
    if (text.includes('^')) {
      const [base, exponent] = text.split('^');
      return (
        <span key={key} className="font-medium">
          {base}
          <sup className="text-xs font-bold text-primary">{exponent}</sup>
        </span>
      );
    }
    
    // Se contém símbolos Unicode (formato x²)
    const unicodeMatch = text.match(/(.+)([²³⁴⁵⁶⁷⁸⁹¹⁰]+)/);
    if (unicodeMatch) {
      const [, base, unicodeExp] = unicodeMatch;
      const htmlExp = unicodeExp.split('').map(char => unicodeToHtml[char] || char).join('');
      return (
        <span key={key} className="font-medium">
          {base}
          <sup className="text-xs font-bold text-primary">{htmlExp}</sup>
        </span>
      );
    }
    
    return text;
  };

  return (
    <div className={`math-text-content ${className}`}>
      {renderFormattedText(content)}
    </div>
  );
};

export default MathTextRenderer;