// client/src/grokPrompts.js

// Define angles dynamically (name and description)
export const angles = [
    { name: 'Neutral', description: 'Rewrite this article in a strictly neutral and objective style, similar to a factual report or a wire service like TT (Tidningarnas Telegrambyrå), dont mentions TTs name in the output. Stick to the core facts of the original text and present them clearly and concisely, without pushing any narrative, agenda, or emotional tone. Do not add or omit information to shape a perspective—include all relevant details from the original while keeping direct quotes and key data intact. Avoid subjective language, speculation, or rhetorical flourishes. The result should feel like a dry, impartial news summary focused solely on informing, not persuading.' },
   { name: 'Vänsterliberal', description: 'Rewrite this article in the style of a Swedish left-leaning publication like Aftonbladet or Dagens ETC. Dont mention these newspaper names in the output. Craft a narrative that emphasizes social justice, empathy for marginalized groups, and critique of power structures or systemic inequalities, as these outlets typically do. Use their characteristic tone—engaging, emotionally resonant, and slightly polemical—to drive a clear goal: advocating for progressive change or exposing injustice. You may add true, relevant facts to strengthen the narrative, and selectively omit details from the original text that dilute the intended message, as long as the core facts and any direct quotes remain accurate. You may not make up quotes or facts. The result should feel like a compelling, authentic newspaper article that aligns with a left-liberal worldview, not just a rehash of the original. Dont add call to actions or messaging of what the reader should think or do, especially not in the end of the article.' },
    { name: 'Högerkonservativ', description: 'Rewrite this article in the style of a Swedish right-leaning publication like Fria Tider or Bulletin. Dont mention these newspaper names in the output. Shape a narrative that highlights threats to national identity, critiques progressive elites or government overreach, and defends traditional values or law-and-order, as these outlets often do. Adopt their typical tone—assertive, alarmist, and skeptical of mainstream consensus—to push a clear agenda: protecting societal stability or exposing hidden agendas. You may include true, relevant facts to reinforce the narrative, and leave out parts of the original text that weaken the intended angle, while keeping core facts and any direct quotes intact. You may not make up quotes or facts. The final piece should read like a convincing, authentic article from a right-wing perspective, not a neutral summary. Dont add call to actions or messaging of what the reader should think or do, especially not in the end of the article.' },
    // Add more angles here as needed, e.g.:
    // { name: 'Miljö', description: 'miljöfokuserad vinkel som lyfter hållbarhet och klimatåtgärder' },
    // { name: 'Ekonomi', description: 'ekonomisk vinkel som prioriterar marknadslösningar och finansiell stabilitet' },
  ];
  
  // Prompt for rewriting an article with a specific angle
  export const getRewritePrompt = (originalText, angleName) => {
    const angle = angles.find(a => a.name === angleName);
    const angleDescription = angle ? angle.description : 'neutral vinkel som upprätthåller objektiv rapportering med balanserade fakta'; // Fallback
  
    return `
        ${angleDescription}. Strukturera texten med tydliga stycken. Svara på samma språk som artikeln är skriven på. Returnera den omskrivna texten som en enda sträng med stycken separerade av dubbla radbrytningar (\n\n). Gör texten ungefär lika lång som orginaltexten. Här är artikeln att skriva om:
  
      "${originalText}"
    `;
  };
  
  // Prompt for summarizing existing angles and narrative elements (unchanged)
  export const getSummaryPrompt = (originalText) => {
    /*return `
      Du är en analytisk journalist som är expert på att identifiera narrativ och vinklar i nyhetsartiklar. Analysera följande artikel och ge en kort sammanfattning (max 200 ord) av vilka vinklar som redan finns i originaltexten (t.ex. vänsterinriktad, neutral, högerinriktad) och hur artikeln använder specifika element för att framhäva sitt narrativ. Fokusera på att bedöma artikelns befintliga ton och budskap, inte på att föreslå nya vinklar. Skriv på samma språk som artikeln (t.ex. svenska om artikeln är på svenska), använd en koncis, professionell ton och formatera svaret med radbrytningar och punktlistor för att lyfta fram nyckelelement (t.ex. "- **Rubrik**: Beskrivning"). Här är artikeln att analysera:
  
      "${originalText}"
    `;*/

    return `
      Analyze this article and provide a concise, fact-based summary of its main angle, narrative, and motive in a short running text of four to five sentences, focusing sharply on the perspective, story, and intent rather than the content itself. Identify the dominant angle (e.g., ideological leaning or target focus), the narrative it constructs (e.g., blame, heroism, or fear), and the underlying motive (e.g., to persuade, alarm, or justify), using minimal examples like key tones or structural choices to support your points. If applicable, note whether any person, company, or political side is clearly portrayed in a positive or negative light, based on the text’s framing, but only include this if evident—otherwise, skip it. Avoid summarizing the article’s details or quoting extensively, keeping it neutral, nuanced, and free of speculation, with emphasis on how the text is crafted to achieve its goals. Write in the same language as the article, eg Swedish.
      "${originalText}"
    `;
  };