const { Category, Product } = require('../models');

exports.list = async (req, res, next) => {
  try {
    res.json(await Category.findAll());
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      description: req.body.description,
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Catégorie introuvable.' });
    }

    const productCount = await Product.count({
      where: { categoryId: category.id },
    });

    if (productCount > 0) {
      return res.status(409).json({
        error: 'Impossible de supprimer une catégorie liée à des produits.',
      });
    }

    await category.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
