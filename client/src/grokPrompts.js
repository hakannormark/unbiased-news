// client/src/grokPrompts.js

// Define angles dynamically (name and description)
export const angles = [
    { name: 'Neutral', description: 'neutral vinkel som upprätthåller objektiv rapportering med balanserade fakta, tar bort vinklade ordval och känsloladdat språk, bortser från onödiga åsiktsinslag** och behåll bara fakta, lägger till kontext om fakta saknas, men utan att föra in subjektiva tolkningar' },
    { name: 'Orginal 180°', description: 'från en exakt motsatt vinkel (180 grader) mot hur du analyserar artikeln med följande metod. Du får inte ändra på fakta eller citat men du får ta bort och lägga till fakta om det är sant.  Analysera följande nyhetsartikel utifrån narrativ och vinkel. Bedöm dess politiska tendens och hur den framställer olika aktörer. Politisk lutning: - Skala (-5 till +5), där -5 är tydligt vänster, 0 är neutral och +5 är tydligt höger.   Saklighet och faktabas:  - Skala (1-5), där 1 är mycket spekulativ och 5 är strikt faktabaserad.    - Finns det överdrifter, partiska ordval eller sakfel?  Påverkansgrad: - Skala (1-5), där 1 är neutral och 5 är starkt opinionsbildande.   - Försöker artikeln påverka läsaren emotionellt?   Politiska vinnare och förlorare:  - Vilka partier, personer eller ideologier framställs i positiv respektive negativ dager?    Sammanfattning av narrativet - Vad är artikelns huvudsakliga budskap?' },
    { name: 'Vänsterliberal', description: 'samma stil som tidningen Aftonbladet, Arbetet, Flamman eller Dagens ETC hade gjort. Använd samma argument, motiv, vinklingar och narrativ som de brukar använda. Du får inte ändra på fakta eller citat men du får lägga till fakta så länge de är sanna. Du får också ta bort delar ur orginaltexten för att uppnå ditt mål.' },
    { name: 'Högerkonservativ', description: 'samma stil som tidningen Bulletin, Nya Tider, Fria Tider eller Svenska Dagbladet hade gjort. Använd samma argument, motiv, vinklingar och narrativ som de brukar använda. Du får inte ändra på fakta eller citat men du får lägga till fakta så länge de är sanna. Du får också ta bort delar ur orginaltexten för att uppnå ditt mål.' },
    // Add more angles here as needed, e.g.:
    // { name: 'Miljö', description: 'miljöfokuserad vinkel som lyfter hållbarhet och klimatåtgärder' },
    // { name: 'Ekonomi', description: 'ekonomisk vinkel som prioriterar marknadslösningar och finansiell stabilitet' },
  ];
  
  // Prompt for rewriting an article with a specific angle
  export const getRewritePrompt = (originalText, angleName) => {
    const angle = angles.find(a => a.name === angleName);
    const angleDescription = angle ? angle.description : 'neutral vinkel som upprätthåller objektiv rapportering med balanserade fakta'; // Fallback
  
    return `
       Skriv om följande artikel i en professionell journalistisk stil från en ${angleDescription}. Strukturera texten med tydliga stycken. Svara på samma språk som artikeln är skriven på. Returnera den omskrivna texten som en enda sträng med stycken separerade av dubbla radbrytningar (\n\n). Gör texten ungefär lika lång som orginaltexten. Här är artikeln att skriva om:
  
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
      Analysera följande nyhetsartikel utifrån narrativ och vinkel. Bedöm dess politiska tendens och hur den framställer olika aktörer. Besvara enligt följande struktur:

        Politisk lutning:
        - Skala (-5 till +5), där -5 är tydligt vänster, 0 är neutral och +5 är tydligt höger.  
        - Motivera betyget kortfattat.

        Saklighet och faktabas:
        - Skala (1-5), där 1 är mycket spekulativ och 5 är strikt faktabaserad.  
        - Finns det överdrifter, partiska ordval eller sakfel?

        Påverkansgrad:
        - Skala (1-5), där 1 är neutral och 5 är starkt opinionsbildande.  
        - Försöker artikeln påverka läsaren emotionellt?  

        Politiska vinnare och förlorare:
        - Vilka partier, personer eller ideologier framställs i positiv respektive negativ dager?  

        Sammanfattning av narrativet:
        - Vad är artikelns huvudsakliga budskap?  

        Returnera analysen i denna struktur, kortfattat och tydligt.

        Här är artikeln:  
      "${originalText}"
    `;
  };