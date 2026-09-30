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
const deleteProductForm = document.getElementById('deleteProductForm');
const deleteProductSelect = document.getElementById('deleteProductId');
const deleteCategoryForm = document.getElementById('deleteCategoryForm');
const deleteCategorySelect = document.getElementById('deleteCategoryId');

async function loadCategories() {
  try {
    const response = await fetch(CATEGORIES_URL);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const categories = await response.json();
    categorySelect.innerHTML = '<option value="">Choisir une catégorie</option>';
    deleteCategorySelect.innerHTML = '<option value="">Choisir une catégorie</option>';

    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
      const deleteOption = document.createElement('option');
      deleteOption.value = category.id;
      deleteOption.textContent = category.name;
      deleteCategorySelect.appendChild(deleteOption);
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
    deleteProductSelect.innerHTML = '<option value="">Choisir un produit</option>';

    products.forEach((product) => {
      const item = document.createElement('li');
      const category = product.category ? product.category.name : 'Sans catégorie';
      item.textContent = `${product.name} — ${product.price} € (${category})`;
      productList.appendChild(item);
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = product.name;
      deleteProductSelect.appendChild(option);
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

async function deleteResource(url, id) {
  const response = await fetch(`${url}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Erreur HTTP : ${response.status}`);
  }
  // Les routes DELETE renvoient 204 : aucun JSON à lire.
}

function handleDeletion(form, select, url, reload) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = select.value;
    if (!id) return;

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      await deleteResource(url, id);
      form.reset();
      await reload();
    } catch (error) {
      console.error('Suppression impossible :', error.message);
      window.alert(error.message);
    } finally {
      button.disabled = false;
    }
  });
}

handleDeletion(deleteProductForm, deleteProductSelect, PRODUCTS_URL, loadProducts);
handleDeletion(deleteCategoryForm, deleteCategorySelect, CATEGORIES_URL, async () => {
  await loadCategories();
  await loadProducts();
});

loadCategories();
loadProducts();
