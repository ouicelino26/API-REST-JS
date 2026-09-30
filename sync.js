const sequelize = require('./config/database');
require('./models');

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connexion MySQL établie et table products créée.');
  } catch (error) {
    console.error('Erreur MySQL :', error.message);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
