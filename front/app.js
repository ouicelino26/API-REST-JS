const PRODUCTS_URL = '/api/products';
const CATEGORIES_URL = '/api/categories';

const categoryForm = document.getElementById('categoryForm');
const categoryName = document.getElementById('categoryName');
const productForm = document.getElementById('productForm');
const productName = document.getElementById('productName');
const productDescription = document.getElementById('productDescription');
const productPrice = document.getElementById('productPrice');
const categorySelect = document.getElementById('categoryId');
const productList = document.getElementById('productList');

async function loadCategories() {
  try {
    const response = await fetch(CATEGORIES_URL);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const categories = await response.json();
    categorySelect.innerHTML = '<option value="">Choisir une catégorie</option>';

    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Impossible de charger les catégories :', error.message);
  }
}

async function loadProducts() {
  try {
    const response = await fetch(PRODUCTS_URL);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const products = await response.json();
    productList.innerHTML = '';

    products.forEach((product) => {
      const item = document.createElement('li');
      const category = product.category ? product.category.name : 'Sans catégorie';
      item.textContent = `${product.name} — ${product.price} € (${category})`;
      productList.appendChild(item);
    });
  } catch (error) {
    console.error('Impossible de charger les produits :', error.message);
  }
}

async function createCategory(category) {
  const response = await fetch(CATEGORIES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });

  if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
  return response.json();
}

async function createProduct(product) {
  const response = await fetch(PRODUCTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });

  if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
  return response.json();
}

categoryForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    await createCategory({ name: categoryName.value.trim() });
    categoryForm.reset();
    await loadCategories();
  } catch (error) {
    console.error('Impossible de créer la catégorie :', error.message);
  }
});

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    await createProduct({
      name: productName.value.trim(),
      description: productDescription.value.trim(),
      price: Number(productPrice.value),
      categoryId: Number(categorySelect.value),
    });
    productForm.reset();
    await loadProducts();
  } catch (error) {
    console.error('Impossible de créer le produit :', error.message);
  }
});

loadCategories();
loadProducts();
