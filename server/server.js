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
      // Ta bort prefix och hämta bara huvudsaklig titeltext
      const prefix = titleElement.find('.TeaserHeadline__prefix___VetyL').text().trim();
      const fullTitle = titleElement.text().trim();
      const title = fullTitle.replace(prefix, '').trim(); // Ta bort prefix från titeln
      const description = $(element).find('.Text__text-M___FnzEm').text().trim() || 
                         $(element).find('.RightNowFeed__prefix___qa6Q8').text().trim() || 'No description';
      const url = $(element).attr('href');
      const fullUrl = url && url.startsWith('http') ? url : `https://www.svt.se${url || ''}`;

      if (title && title !== 'No title' && !articles.some(a => a.url === fullUrl)) {
        articles.push({
          title: title.replace(/^Just nu/, '').trim(), // Behåll borttagning av "Just nu"
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

// Övriga rutter (t.ex. /api/article) oförändrade...
app.get('/api/article', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const content = [];

    const headline = $('.ArticleHeader__root___QutIb').text().trim();
    if (headline) {
      content.push({ type: 'header', text: headline });
    }

    $('.RichTextArticleBody__root___mP4Lh p').each((i, element) => {
      const text = $(element).text().trim();
      if (text) {
        content.push({ type: 'paragraph', text });
      }
    });

    res.json({
      title: headline || 'No title',
      content: content.length ? content : [{ type: 'paragraph', text: 'No content available' }]
    });
  } catch (error) {
    console.error('Error scraping article:', error);
    res.status(500).json({ error: 'Failed to scrape article' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});