const carrinho = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const botao = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const addStorage = () => {
  localStorage.setItem('cart', carrinho.innerHTML);
  localStorage.setItem('preco', totalPrice.innerHTML);
};

const getStorage = () => {
  carrinho.innerHTML = localStorage.getItem('cart');
  totalPrice.innerHTML = localStorage.getItem('preco');
};

const calcPrice = async (preco, operador) => {
  try {
    const sectionPrice = totalPrice;
    let contador = Number(totalPrice.innerHTML);
    if (operador === '+') contador += preco;
    if (operador === '-') contador -= preco;
    sectionPrice.innerHTML = Math.round(contador * 100) / 100;
    addStorage();
  } catch (error) {
    alert(error);
  }
};

function cartItemClickListener(event) {
  event.target.remove();
  const precoProduto = event.target.querySelector('span').innerText;
  calcPrice(precoProduto, '-');
  addStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span>${salePrice}</span>`;
  carrinho.appendChild(li);
  calcPrice(salePrice, '+');
  return li;
}

const getItemPromise = async (id) => {
  try {
    const itemUrl = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const data = await itemUrl.json();
    createCartItemElement(data);
    addStorage();
  } catch (error) {
    alert(error);
  }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (event) => {
    getItemPromise(event.target.parentElement.firstElementChild.innerText);
  });
  return section;
}

const clearCart = () => {
  botao.addEventListener('click', () => {
    const list = document.querySelectorAll('.cart__item');
    list.forEach((item) => item.parentNode.removeChild(item));
    addStorage();
  });
};

const addItems = (items) => {
  items.forEach((item) => {
    const itemHTML = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemHTML);
  });
};

const getProductPromise = async (product) => {
  try {
  const promise = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`);
  const data = await promise.json();
  loading.remove();
  const result = data.results;
  addItems(result);
  console.log(result);
} catch (erro) {
  console.log(erro);
}
};

const fetchProductPromise = async () => {
  try {
    await getProductPromise('computador');
  } catch (error) {
  console.log(error);
  }
};

carrinho.addEventListener('click', cartItemClickListener);

window.onload = () => {
  fetchProductPromise();
  getStorage();
  clearCart();
};