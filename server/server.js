const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get('https://www.svt.se/nyheter');
    const $ = cheerio.load(response.data);

    const articles = [];
    $('.Feed__root___BOOzQ a[href]').each((i, element) => {
      const title = $(element).find('.TeaserHeadline__root___kr8ht').text().trim() || 'No title';
      const description = $(element).find('.Text__text-M___FnzEm').text().trim() || 
                         $(element).find('.RightNowFeed__prefix___qa6Q8').text().trim() || 'No description';
      const url = $(element).attr('href');
      const fullUrl = url && url.startsWith('http') ? url : `https://www.svt.se${url || ''}`;

      if (title !== 'No title' && !articles.some(a => a.url === fullUrl)) {
        articles.push({
          title: title.replace(/^Just nu/, '').trim(),
          description,
          content: description,
          url: fullUrl
        });
        console.log(`Found article ${articles.length}: ${title} (${fullUrl})`);
      }
    });

    const result = articles.slice(0, 4);
    res.json(result);
  } catch (error) {
    console.error('Error scraping SVT news list:', error);
    res.status(500).json({ error: 'Failed to scrape news list' });
  }
});

app.get('/api/article', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $('.TextArticle__heading___tebP2').text().trim() || 
                  $('.TeaserHeadline__root___kr8ht').first().text().trim() || 'No title';
    
    const content = [];
    $('.Lead__root___PJ6pA p').each((i, el) => {
      const text = $(el).text().trim();
      if (text) content.push({ type: 'paragraph', text });
    });
    $('.TextArticle__body___SZ6MK p').each((i, el) => {
      const text = $(el).text().trim();
      if (text) content.push({ type: 'paragraph', text });
    });
    $('.TextArticle__body___SZ6MK h2').each((i, el) => {
      const text = $(el).text().trim();
      if (text) content.push({ type: 'header', text });
    });

    res.json({
      title,
      content,
      url
    });
  } catch (error) {
    console.error(`Error scraping article ${url}:`, error.message);
    res.status(500).json({ error: 'Failed to scrape article' });
  }
});

// Serve React frontend
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all route for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});