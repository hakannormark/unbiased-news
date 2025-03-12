import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRewritePrompt, getSummaryPrompt } from './grokPrompts'; // Import prompts
import './ArticlePage.css';

const ArticlePage = () => {
  const { url } = useParams();
  const [article, setArticle] = useState(null);
  const [version, setVersion] = useState('neutral');
  const [isOriginalExpanded, setIsOriginalExpanded] = useState(false);
  const [rewrittenContent, setRewrittenContent] = useState(null);
  const [isLoadingRewrite, setIsLoadingRewrite] = useState(false);
  const [summary, setSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const GROK_API_KEY = process.env.REACT_APP_GROK_API_KEY;

  useEffect(() => {
    const fetchArticleAndSummary = async () => {
      try {
        const decodedUrl = decodeURIComponent(url);
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const response = await fetch(`${API_URL}/api/article?url=${encodeURIComponent(decodedUrl)}`);
        const data = await response.json();
        console.log('Fetched article:', data);
        setArticle(data);
        setRewrittenContent(data.content);

        if (data.content && GROK_API_KEY) {
          setIsLoadingSummary(true);
          const originalText = data.content.map(section => section.text).join('\n\n');
          const summaryPrompt = getSummaryPrompt(originalText); // Use imported prompt

          const summaryResponse = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROK_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'grok-beta',
              messages: [{ role: 'user', content: summaryPrompt }],
              max_tokens: 300,
              temperature: 0.5,
            }),
          });

          if (!summaryResponse.ok) {
            const errorText = await summaryResponse.text();
            throw new Error(`Summary API request failed: ${errorText}`);
          }

          const summaryData = await summaryResponse.json();
          console.log('Summary API response:', summaryData);
          const summaryText = summaryData.choices[0]?.message?.content || 'Fel: Ingen sammanfattning genererades';

          const summaryLines = summaryText.split('\n').filter(line => line.trim());
          const contentArray = summaryLines.map((line, index) => ({
            type: line.startsWith('-') ? 'list-item' : 'paragraph',
            text: line.trim()
          }));
          setSummary(contentArray);
        }
      } catch (error) {
        console.error('Error fetching article or summary:', error.message);
        setArticle({ error: 'Failed to load article' });
        setSummary([{ type: 'paragraph', text: `Fel: Kunde inte generera sammanfattning - ${error.message}` }]);
      } finally {
        setIsLoadingSummary(false);
      }
    };
    fetchArticleAndSummary();
  }, [url]);

  useEffect(() => {
    if (!article || !article.content || !GROK_API_KEY) {
      if (!GROK_API_KEY) {
        console.error('Grok API key is missing from environment variables!');
        setRewrittenContent([{ type: 'paragraph', text: 'Fel: Grok API-nyckel saknas' }]);
      }
      return;
    }

    const rewriteWithGrok = async () => {
      setIsLoadingRewrite(true);
      try {
        const originalText = article.content.map(section => section.text).join('\n\n');
        const prompt = getRewritePrompt(originalText, version); // Use imported prompt

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'grok-beta',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Grok API response:', data);

        const rewrittenText = data.choices[0]?.message?.content || 'Fel: Inget innehåll returnerades';

        const angleLabel = version === 'left' ? '[Vänsterinriktad Perspektiv]' :
                          version === 'right' ? '[Högerinriktad Perspektiv]' :
                          '[Neutralt Perspektiv]';
        const contentArray = rewrittenText.split('\n\n').map((text, index) => ({
          type: index === 0 ? 'header' : 'paragraph',
          text: index === 0 ? `${angleLabel} ${text}` : text
        }));

        setRewrittenContent(contentArray);
      } catch (error) {
        console.error('Error rewriting with Grok:', error.message, error.stack);
        setRewrittenContent([{ type: 'paragraph', text: `Fel: Kunde inte skriva om artikeln - ${error.message}` }]);
      } finally {
        setIsLoadingRewrite(false);
      }
    };

    rewriteWithGrok();
  }, [article, version]);

  if (!article) return <div>Loading...</div>;
  if (article.error || !article.content || !Array.isArray(article.content)) {
    return <div>Fel: {article.error || 'Artikelns innehåll är inte tillgängligt eller ogiltigt'}</div>;
  }

  return (
    <div className="article-page">
      <div className="original-section">
        <button 
          onClick={() => setIsOriginalExpanded(!isOriginalExpanded)}
          className="toggle-button"
        >
          {isOriginalExpanded ? 'Dölj Originalartikel' : 'Visa Originalartikel'}
        </button>
        {isOriginalExpanded && (
          <div className="original-content">
            <h2>Originalartikel</h2>
            {article.content.map((section, index) => (
              section.type === 'header' ? (
                <h3 key={index}>{section.text}</h3>
              ) : (
                <p key={index}>{section.text}</p>
              )
            ))}
          </div>
        )}
      </div>

      <div className="rewritten-section">
        <Link to="/" className="back-link">Tillbaka till nyhetslistan</Link>
        <div className="summary-section">
          <h2>Sammanfattning av vinklar</h2>
          {isLoadingSummary ? (
            <p>Laddar sammanfattning...</p>
          ) : (
            summary && summary.map((section, index) => (
              section.type === 'list-item' ? (
                <p key={index} className="summary-list-item">{section.text}</p>
              ) : (
                <p key={index}>{section.text}</p>
              )
            ))
          )}
        </div>
        <h1>{article.title}</h1>
        <div className="version-buttons">
          <button 
            onClick={() => setVersion('left')} 
            className={version === 'left' ? 'active' : ''} 
            disabled={isLoadingRewrite}
          >
            Vänster
          </button>
          <button 
            onClick={() => setVersion('neutral')} 
            className={version === 'neutral' ? 'active' : ''} 
            disabled={isLoadingRewrite}
          >
            Neutral
          </button>
          <button 
            onClick={() => setVersion('right')} 
            className={version === 'right' ? 'active' : ''} 
            disabled={isLoadingRewrite}
          >
            Höger
          </button>
        </div>
        <div className="article-content">
          {isLoadingRewrite ? (
            <p>Laddar omskrivet innehåll...</p>
          ) : (
            rewrittenContent.map((section, index) => (
              section.type === 'header' ? (
                <h3 key={index}>{section.text}</h3>
              ) : (
                <p key={index}>{section.text}</p>
              )
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;