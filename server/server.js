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
      const titleElement = $(element).find('.TeaserHeadline__root___kr8ht');
      const prefix = titleElement.find('.TeaserHeadline__prefix___VetyL').text().trim();
      const fullTitle = titleElement.text().trim();
      const title = fullTitle.replace(prefix, '').trim();
      const description = $(element).find('.Text__text-M___FnzEm').text().trim() || 
                         $(element).find('.RightNowFeed__prefix___qa6Q8').text().trim() || 'No description';
      const url = $(element).attr('href');
      const fullUrl = url && url.startsWith('http') ? url : `https://www.svt.se${url || ''}`;

      // Skip URLs containing "?inlagg="
      if (fullUrl.includes('?inlagg=')) {
        console.log(`Skipped post-like URL: ${fullUrl}`);
        return; // Continue to the next iteration
      }

      if (title && title !== 'No title' && !articles.some(a => a.url === fullUrl)) {
        articles.push({
          title: title.replace(/^Just nu/, '').trim(),
          description,
          content: description,
          url: fullUrl
        });
        console.log(`Found article ${articles.length}: ${title} (${fullUrl})`);
      }
    });

    const result = articles.slice(0, 25);
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

    // Kontrollera om det är en 404-sida
    const pageTitle = $('title').text().trim();
    if (pageTitle.includes('Oj, sidan finns inte!') || pageTitle.includes('Det finns inget på den här sidan')) {
      return res.status(404).json({ error: 'Article not found on SVT' });
    }

    const content = [];
    const headline = $('.TextArticle__heading___tebP2').text().trim(); // Uppdaterad titel-selector
    if (headline) {
      content.push({ type: 'header', text: headline });
    }

    // Hämta ingress från .Lead__root___PJ6pA
    $('.Lead__root___PJ6pA p').each((i, element) => {
      const text = $(element).text().trim();
      if (text) {
        content.push({ type: 'paragraph', text });
      }
    });

    // Hämta huvudtext från .TextArticle__body___SZ6MK
    $('.TextArticle__body___SZ6MK p').each((i, element) => {
      const text = $(element).text().trim();
      if (text) {
        content.push({ type: 'paragraph', text });
      }
    });

    if (content.length === 0) {
      content.push({ type: 'paragraph', text: 'No content available' });
    }

    res.json({
      title: headline || 'No title',
      content
    });
  } catch (error) {
    console.error('Error scraping article:', error.message);
    res.status(500).json({ error: `Failed to scrape article: ${error.message}` });
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});