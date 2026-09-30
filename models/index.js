const Category = require('./Category');
const Product = require('./Product');

Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

module.exports = { Category, Product };
