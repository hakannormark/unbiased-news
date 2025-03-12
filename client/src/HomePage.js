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

  if (articles === null) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home-page">
      <h1 className="angles-title">Angles</h1>
      <hr className="title-divider" />
      <ul>
        {articles.map((article, index) => (
          <li key={index}>
            <Link to={`/article/${encodeURIComponent(article.url)}`}>
              <h2>{article.title}</h2>
            </Link>
            <p>{article.description}</p>
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