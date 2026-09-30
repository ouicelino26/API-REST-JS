const { Product, Category } = require('../models');

const includeCategory = [{ model: Category, as: 'category' }];
const productFields = ['name', 'description', 'price', 'categoryId'];

function pickProductFields(body) {
  return Object.fromEntries(
    productFields
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, body[field]])
  );
}

async function checkCategory(categoryId) {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    const error = new Error('Catégorie introuvable.');
    error.status = 400;
    throw error;
  }
}

exports.list = async (req, res, next) => {
  try {
    const products = await Product.findAll({ include: includeCategory });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: includeCategory });
    if (!product) return res.status(404).json({ error: 'Produit introuvable.' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = pickProductFields(req.body);
    await checkCategory(data.categoryId);
    const product = await Product.create(data);
    res.status(201).json(await Product.findByPk(product.id, { include: includeCategory }));
  } catch (error) {
    next(error);
  }
};

exports.replace = async (req, res, next) => {
  try {
    const data = pickProductFields(req.body);
    if (productFields.some((field) => data[field] === undefined)) {
      return res.status(400).json({ error: 'PUT exige name, description, price et categoryId.' });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit introuvable.' });
    await checkCategory(data.categoryId);
    await product.update(data);
    res.json(await Product.findByPk(product.id, { include: includeCategory }));
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = pickProductFields(req.body);
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Aucun champ produit valide à modifier.' });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit introuvable.' });
    if (data.categoryId !== undefined) await checkCategory(data.categoryId);
    await product.update(data);
    res.json(await Product.findByPk(product.id, { include: includeCategory }));
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit introuvable.' });
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
