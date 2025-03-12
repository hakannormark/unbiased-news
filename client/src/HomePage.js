import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        const response = await fetch(`${API_URL}/api/news`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        setArticles([]);
      }
    };
    fetchNews();
  }, []);

  if (!articles) return <div>Loading...</div>;

  return (
    <div className="home-page">
      <h1>SVT News</h1>
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
    </div>
  );
};

export default HomePage;