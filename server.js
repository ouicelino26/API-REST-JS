require('dotenv').config();

const express = require('express');
const sequelize = require('./config/database');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static('front'));
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable.' });
});

app.use((error, req, res, next) => {
  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: error.errors.map((item) => item.message) });
  }
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || 'Erreur interne du serveur.' });
});

async function start() {
  try {
    await sequelize.authenticate();
    app.listen(port, () => console.log(`API disponible : http://localhost:${port}`));
  } catch (error) {
    console.error('Connexion MySQL impossible :', error.message);
    process.exit(1);
  }
}

start();
