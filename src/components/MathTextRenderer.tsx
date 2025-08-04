import React from 'react';

interface MathTextRendererProps {
  content: string;
  className?: string;
}

const MathTextRenderer: React.FC<MathTextRendererProps> = ({ content, className = "" }) => {
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
    
    // Regex para diferentes formatações
    const formatRegex = /(\*\*[^*]+\*\*|\\\[[^\]]+\\\]|\w+\^[0-9²³⁴⁵⁶⁷⁸⁹]+|\b\d+[²³⁴⁵⁶⁷⁸⁹]+|\b[a-zA-Z]+[²³⁴⁵⁶⁷⁸⁹]+)/g;
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
      // Processar fórmulas LaTeX (\[formula\])
      else if (matchedText.startsWith('\\[') && matchedText.endsWith('\\]')) {
        const formula = matchedText.slice(2, -2);
        parts.push(
          <div key={match.index} className="math-formula my-3 p-4 text-center bg-gradient-to-r from-muted to-muted/50 border border-border rounded-lg font-mono text-lg font-semibold">
            {formula}
          </div>
        );
      }
      // Processar potências (x^2, 3², etc.)
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
    
    // Se contém ^ (formato x^2)
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