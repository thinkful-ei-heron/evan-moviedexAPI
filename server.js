require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const Movies = require('./movies-data-small.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

//validates auth token
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  console.log('validate bearer token middleware');
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

app.get('/movies', (req, res) => {
  const {genre, country, avg_vote} = req.query;
  const genres = ['Animation', 'Drama', 
    'Romantic', 'Comedy', 'Spy', 'Crime', 
    'Thriller', 'Adventure', 'Documentary', 
    'Horror', 'Action', 'Western', 'History', 
    'Biography', 'Musical', 'Fantasy', 'War', 'Grotesque'].map(c => c.toLowerCase());
  let results = Movies;
  if (country) {
    results = results
      .filter(app => app.country.toLowerCase().includes(country.toLowerCase()));
    if(results.length === 0) {
      return res
        .status(400)
        .send('Must choose a valid country');
    }
  }
  if (genre) {
    if(!genres.includes(genre.toLowerCase())) {
      return res
        .status(400)
        .send('Must choose a valid genre type');
    }
  }
  if (genre) {
    results = results
      .filter(app => app.genre.toLowerCase().includes(genre.toLowerCase()));
  }
  if (avg_vote) {
    results = results
      .filter(app => app.avg_vote >= parseFloat(req.query.avg_vote));
  }
  res
    .json(results);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});