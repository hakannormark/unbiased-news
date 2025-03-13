import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('Fetching news from: /api/news');
        const response = await fetch('/api/news'); // Relativ väg
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched articles:', data);
        setArticles(data.slice(0, 25));
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(error.message);
        setArticles([]);
      }
    };
    fetchNews();
  }, []);

  if (articles === null) return (
    <div className="loading">
      <p>Laddar nyheter...</p>
    </div>
  );

  if (error) return (
    <div className="error-message">
      <p>Kunde inte hämta nyheter. Försök igen senare.</p>
      <button onClick={() => window.location.reload()}>Försök igen</button>
    </div>
  );

  return (
    <div className="home-page">
      <div className="angles-header">
        <h1 className="angles-title">Angles</h1>
        <p className="angles-byline">Nyheter ur alla vinklar</p>
      </div>
      <hr className="title-divider" />
      <ul className="article-list">
        {articles.map((article, index) => (
          <li key={index} className="article-item">
            <Link to={`/article/${encodeURIComponent(article.url)}`}>
              <h2>{article.title}</h2>
            </Link>
            <p>{article.description || "Ingen beskrivning tillgänglig."}</p>
          </li>
        ))}
      </ul>
      <footer className="footer">
        <hr />
        <p>© 2025 Sanningsministeriet</p>
      </footer>
    </div>
  );
};

export default HomePage;