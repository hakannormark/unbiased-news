// client/src/grokPrompts.js

// Prompt for rewriting an article with a specific angle
export const getRewritePrompt = (originalText, version) => {
    const angleDescription = version === 'left'
      ? 'vänsterinriktad vinkel som betonar progressiva värderingar, social rättvisa och statlig intervention'
      : version === 'right'
      ? 'högerinriktad vinkel som fokuserar på traditionella värderingar, individuellt ansvar och begränsad statlig inblandning'
      : 'neutral vinkel som upprätthåller objektiv rapportering med balanserade fakta';
  
    return `
      Du är en kvalificerad journalist med en talang för att skriva engagerande och välstrukturerade artiklar. Skriv om följande artikel i en professionell journalistisk stil från en ${angleDescription}. Behåll alla faktiska detaljer, förbättra läsbarheten med livfullt språk och strukturera texten med tydliga stycken. Svara på samma språk som artikeln är skriven på (t.ex. svenska om artikeln är på svenska) och säkerställ att tonen matchar den begärda vinkeln samtidigt som den förblir informativ och fängslande. Returnera den omskrivna texten som en enda sträng med stycken separerade av dubbla radbrytningar (\n\n). Här är artikeln att skriva om:
  
      "${originalText}"
    `;
  };
  
  // Prompt for summarizing existing angles and narrative elements
  export const getSummaryPrompt = (originalText) => {
    return `
      Du är en analytisk journalist som är expert på att identifiera narrativ och vinklar i nyhetsartiklar. Analysera följande artikel och ge en kort sammanfattning (max 200 ord) av vilka vinklar som redan finns i originaltexten (t.ex. vänsterinriktad, neutral, högerinriktad) och hur artikeln använder specifika element för att framhäva sitt narrativ. Fokusera på att bedöma artikelns befintliga ton och budskap, inte på att föreslå nya vinklar. Skriv på samma språk som artikeln (t.ex. svenska om artikeln är på svenska), använd en koncis, professionell ton och formatera svaret med radbrytningar och punktlistor för att lyfta fram nyckelelement (t.ex. "- **Rubrik**: Beskrivning"). Här är artikeln att analysera:
  
      "${originalText}"
    `;
  };