import React from 'react';

interface MathTextRendererProps {
  content: string;
  className?: string;
}

const MathTextRenderer: React.FC<MathTextRendererProps> = ({ content, className = "" }) => {
  
  // Específicamente para fórmula de Bhaskara
  const renderBhaskaraFormula = (): React.ReactNode => {
    return (
      <div className="my-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
        <div className="text-center">
          <div className="text-lg font-bold text-primary mb-2">Fórmula de Bhaskara</div>
          <div className="flex items-center justify-center gap-2 text-xl font-semibold">
            <span>x =</span>
            <div className="inline-flex flex-col items-center mx-2">
              <div className="flex items-center gap-1 px-3 py-1">
                <span>-b</span>
                <span className="text-primary font-bold">±</span>
                <span className="flex items-center">
                  <span className="text-lg">√</span>
                  <span className="border-t-2 border-primary px-2 py-1">
                    b<sup className="text-sm">2</sup> - 4ac
                  </span>
                </span>
              </div>
              <div className="border-t-2 border-primary w-full mt-1"></div>
              <div className="px-3 py-1 mt-1">
                2a
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar potências de forma amigável
  const renderExponent = (base: string, exp: string): React.ReactNode => {
    return (
      <span className="inline-flex items-baseline">
        <span className="font-semibold">{base}</span>
        <sup className="text-sm font-bold text-primary ml-0.5">{exp}</sup>
      </span>
    );
  };

  // Renderizar frações de forma visual
  const renderFraction = (numerator: string, denominator: string): React.ReactNode => {
    return (
      <span className="inline-flex flex-col items-center mx-1 text-base">
        <span className="px-2 py-1 font-semibold text-center">
          {numerator}
        </span>
        <div className="border-t-2 border-primary w-full min-w-[3rem]"></div>
        <span className="px-2 py-1 font-semibold text-center">
          {denominator}
        </span>
      </span>
    );
  };

  // Processar equações quadráticas
  const processQuadraticEquation = (text: string): React.ReactNode => {
    // Detectar ax² + bx + c = 0
    const quadraticPattern = /(\d*)x\^?2?\s*([+-])\s*(\d*)x\s*([+-])\s*(\d+)\s*=\s*0/;
    const match = text.match(quadraticPattern);
    
    if (match) {
      const [, a, sign1, b, sign2, c] = match;
      return (
        <div className="my-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center text-lg font-semibold">
            {a || '1'}{renderExponent('x', '2')} 
            <span className="mx-2">{sign1}</span>
            {b && `${b}x`}
            <span className="mx-2">{sign2}</span>
            {c} = 0
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Adaptar linguagem para pré-adolescentes
  const adaptLanguageForTeens = (text: string): string => {
    const adaptations: Record<string, string> = {
      'fórmula de Bhaskara': 'fórmula mágica de Bhaskara',
      'ferramenta utilizada': 'truque especial usado',
      'coeficientes': 'números importantes (a, b e c)',
      'discriminante': 'valor especial (b² - 4ac)',
      'substitua na fórmula': 'coloque os números na fórmula mágica',
      'calcule': 'faça as contas',
      'identifique os valores': 'encontre os números',
      'equação quadrática': 'equação com x²',
      'onde a, b e c são constantes': 'onde a, b e c são os números da sua equação',
      'objetos físicos': 'coisas que você pode tocar',
      'moedas': 'moedinhas',
      'feijões': 'grãozinhos'
    };

    let result = text;
    for (const [technical, friendly] of Object.entries(adaptations)) {
      result = result.replace(new RegExp(technical, 'gi'), friendly);
    }
    
    return result;
  };

  // Processar texto principal
  const processContent = (text: string): React.ReactNode[] => {
    const adaptedText = adaptLanguageForTeens(text);
    const lines = adaptedText.split('\n');
    const result: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      if (line.trim() === '') {
        result.push(<br key={index} />);
        return;
      }

      // Detectar se é sobre Bhaskara
      if (line.toLowerCase().includes('bhaskara') || line.includes('x =')) {
        result.push(
          <div key={index} className="my-4">
            {renderBhaskaraFormula()}
          </div>
        );
        return;
      }

      // Processar equação quadrática
      const quadratic = processQuadraticEquation(line);
      if (quadratic) {
        result.push(<div key={index}>{quadratic}</div>);
        return;
      }

      // Títulos
      if (line.startsWith('##')) {
        const title = line.replace(/^##\s*/, '');
        result.push(
          <h2 key={index} className="text-xl font-bold text-primary mb-3 mt-4 first:mt-0">
            🎯 {title}
          </h2>
        );
        return;
      }

      // Etapas numeradas
      if (/^\d+\./.test(line.trim())) {
        const step = line.replace(/^\d+\.\s*/, '');
        const stepNumber = line.match(/^(\d+)\./)?.[1];
        result.push(
          <div key={index} className="flex items-start gap-3 mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
              {stepNumber}
            </div>
            <div className="flex-1">
              {processInlineText(step)}
            </div>
          </div>
        );
        return;
      }

      // Lista com bullets
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        const item = line.replace(/^[\s]*[•-]\s*/, '');
        result.push(
          <div key={index} className="flex items-start gap-2 mb-2 ml-4">
            <span className="text-primary font-bold mt-1">🔸</span>
            <span>{processInlineText(item)}</span>
          </div>
        );
        return;
      }

      // Parágrafo normal
      result.push(
        <p key={index} className="mb-3 leading-relaxed text-foreground">
          {processInlineText(line)}
        </p>
      );
    });

    return result;
  };

  // Processar texto inline com matemática
  const processInlineText = (text: string): React.ReactNode => {
    let result = text;

    // Substituir potências simples
    result = result.replace(/(\w+)\^(\d+)/g, (match, base, exp) => {
      return `${base}^${exp}`;
    });

    // Substituir símbolos matemáticos
    result = result.replace(/\+-/g, '±');
    result = result.replace(/\±/g, '±');

    // Procurar e substituir expressões matemáticas específicas
    if (result.includes('2x²') || result.includes('2x^2')) {
      return (
        <span>
          {result.split(/(2x[\^²]?2?)/g).map((part, i) => {
            if (part === '2x²' || part === '2x^2') {
              return <span key={i}>2{renderExponent('x', '2')}</span>;
            }
            if (part.includes('b²') || part.includes('b^2')) {
              return <span key={i}>{part.replace(/b[\^²]?2?/g, '')}{renderExponent('b', '2')}</span>;
            }
            return part;
          })}
        </span>
      );
    }

    // Renderizar b² 
    if (result.includes('b²') || result.includes('b^2')) {
      return (
        <span>
          {result.split(/(b[\^²]?2?)/g).map((part, i) => {
            if (part === 'b²' || part === 'b^2') {
              return renderExponent('b', '2');
            }
            return part;
          })}
        </span>
      );
    }

    // Renderizar outras expressões com destaque
    if (/\([a-z]\)/.test(result) || /±/.test(result) || /√/.test(result)) {
      return <span className="font-semibold text-primary">{result}</span>;
    }

    return result;
  };

  return (
    <div className={`math-text-renderer space-y-2 ${className}`}>
      {processContent(content)}
    </div>
  );
};

export default MathTextRenderer;