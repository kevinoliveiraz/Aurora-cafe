/* Aurora Café — JavaScript puro, sem bibliotecas nem backend. */
'use strict';

// Adiciona a classe apenas quando o JavaScript está ativo.
document.documentElement.classList.add('js-enabled');

// O catálogo é demonstrativo: os dados nunca são enviados a um servidor.
const products = Object.freeze({
  latte:     { name: 'Latte clássico',       price: 1590, image: 'latte-classico.webp' },
  caramelo:  { name: 'Caramelo gelado',      price: 1890, image: 'caramelo-gelado.webp' },
  mocha:     { name: 'Mocha indulgente',     price: 2090, image: 'mocha.webp' },
  matcha:    { name: 'Matcha latte',         price: 1990, image: 'matcha.webp' },
  croissant: { name: 'Croissant artesanal',  price: 1490, image: 'croissant.webp' },
  bolo:      { name: 'Bolo de chocolate',    price: 1790, image: 'bolo-chocolate.webp' }
});

// Formata valores inteiros em centavos para evitar erros de ponto flutuante.
const currency = cents => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let cart = {};
let previousFocus = null;
let toastTimeout;

// Restaura apenas os IDs existentes no catálogo e quantidades permitidas.
try {
  const stored = JSON.parse(localStorage.getItem('aurora-cafe-demo-cart') || '{}');
  if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
    Object.entries(stored).forEach(([id, value]) => {
      if (Object.hasOwn(products, id) && Number.isInteger(value) && value > 0 && value <= 99) cart[id] = value;
    });
  }
} catch (_) {
  cart = {};
}

function persistCart() {
  try { localStorage.setItem('aurora-cafe-demo-cart', JSON.stringify(cart)); } catch (_) { /* Navegadores que bloqueiam armazenamento ainda permitem usar o carrinho. */ }
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

// Renderiza a interface sem montar HTML a partir de entrada do usuário.
function renderCart() {
  const ids = Object.keys(cart).filter(id => products[id] && cart[id] > 0);
  const count = ids.reduce((sum, id) => sum + cart[id], 0);
  const total = ids.reduce((sum, id) => sum + cart[id] * products[id].price, 0);
  const counter = $('[data-cart-count]');
  counter.textContent = count;
  counter.hidden = count === 0;
  $('#cart-head-count').textContent = `(${count})`;
  $('#cart-total').textContent = currency(total);
  const container = $('#cart-items');
  container.replaceChildren();
  if (!count) {
    const empty = document.createElement('div');
    empty.className = 'cart-empty';
    empty.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#ico-bag"/></svg><h3>Sua seleção está vazia</h3><p>Adicione seus favoritos do cardápio para experimentar a interface.</p>';
    container.append(empty);
    return;
  }
  ids.forEach(id => {
    const p = products[id];
    const row = document.createElement('article');
    row.className = 'cart-item';
    const img = document.createElement('img');
    img.src = `arquivos/img/${p.image}`;
    img.alt = '';
    img.width = 76;
    img.height = 93;
    const info = document.createElement('div');
    info.className = 'cart-item-content';
    const top = document.createElement('div');
    top.className = 'cart-item-top';
    const heading = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = p.name;
    const price = document.createElement('span');
    price.className = 'cart-item-price';
    price.textContent = currency(p.price);
    heading.append(title, price);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'cart-remove';
    remove.setAttribute('aria-label', `Remover ${p.name}`);
    remove.dataset.cartRemove = id;
    remove.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#ico-trash"/></svg>';
    top.append(heading, remove);
    const quantity = document.createElement('div');
    quantity.className = 'quantity';
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.dataset.cartDecrement = id;
    minus.setAttribute('aria-label', `Diminuir quantidade de ${p.name}`);
    minus.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#ico-minus"/></svg>';
    const value = document.createElement('span');
    value.textContent = cart[id];
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.dataset.cartIncrement = id;
    plus.setAttribute('aria-label', `Aumentar quantidade de ${p.name}`);
    plus.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#ico-plus"/></svg>';
    quantity.append(minus, value, plus);
    info.append(top, quantity);
    row.append(img, info);
    container.append(row);
  });
}

function changeQuantity(id, difference) {
  if (!Object.hasOwn(products, id)) return;
  const next = Math.max(0, Math.min(99, (cart[id] || 0) + difference));
  if (next) cart[id] = next;
  else delete cart[id];
  persistCart();
  renderCart();
}

// Abre e fecha o pedido com retorno do foco ao botão de origem.
function openCart() {
  previousFocus = document.activeElement;
  const drawer = $('#cart-drawer');
  const backdrop = $('#cart-backdrop');
  backdrop.hidden = false;
  document.body.classList.add('no-scroll');
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => backdrop.classList.add('is-visible'));
  $('#cart-close').focus();
}

function closeCart() {
  const drawer = $('#cart-drawer');
  const backdrop = $('#cart-backdrop');
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  backdrop.classList.remove('is-visible');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!drawer.classList.contains('is-open')) backdrop.hidden = true; }, 280);
  if (previousFocus instanceof HTMLElement) previousFocus.focus();
}

$$('[data-cart-open]').forEach(button => button.addEventListener('click', openCart));
$('#cart-close').addEventListener('click', closeCart);
$('#cart-backdrop').addEventListener('click', closeCart);
$('#cart-continue').addEventListener('click', closeCart);

// Ouvinte delegado: também funciona para itens gerados dinamicamente no carrinho.
document.addEventListener('click', event => {
  const add = event.target.closest('[data-add]');
  if (add) {
    const id = add.dataset.add;
    changeQuantity(id, 1);
    showToast(`${products[id].name} adicionado à seleção`);
  }
  const inc = event.target.closest('[data-cart-increment]');
  if (inc) changeQuantity(inc.dataset.cartIncrement, 1);
  const dec = event.target.closest('[data-cart-decrement]');
  if (dec) changeQuantity(dec.dataset.cartDecrement, -1);
  const remove = event.target.closest('[data-cart-remove]');
  if (remove) { delete cart[remove.dataset.cartRemove]; persistCart(); renderCart(); }
});

// Impede que a navegação por Tab escape de uma janela modal aberta.
document.addEventListener('keydown', event => {
  const drawer = $('#cart-drawer');
  if (!drawer.classList.contains('is-open')) return;
  if (event.key === 'Escape') { closeCart(); return; }
  if (event.key !== 'Tab') return;
  const focusable = $$('button:not([disabled]), a[href]').filter(el => drawer.contains(el) && el.getClientRects().length);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

// Filtros do cardápio; a classe do botão e o aria-pressed ficam sincronizados.
function applyFilter(category) {
  $$('.filter').forEach(button => {
    const selected = button.dataset.filter === category;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  $$('.product-card').forEach(card => {
    card.hidden = category !== 'todos' && card.dataset.category !== category;
    if (!card.hidden) card.classList.add('is-visible');
  });
}
$$('.filter').forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
$('[data-show-food]').addEventListener('click', () => applyFilter('comidas'));

// Menu responsivo com estado de acessibilidade atualizado.
const mobileToggle = $('#mobile-toggle');
const mainNav = $('#main-nav');
function closeMobileMenu() {
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.setAttribute('aria-label', 'Abrir menu');
  mainNav.classList.remove('is-open');
}
mobileToggle.addEventListener('click', () => {
  const open = mobileToggle.getAttribute('aria-expanded') !== 'true';
  mobileToggle.setAttribute('aria-expanded', String(open));
  mobileToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mainNav.classList.toggle('is-open', open);
});
$$('.main-nav a').forEach(anchor => anchor.addEventListener('click', closeMobileMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMobileMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMobileMenu(); });

// Revelações leves e opcionais: não bloqueiam o conteúdo sem JS.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px 32px 0px' });
  $$('[data-reveal]').forEach(element => observer.observe(element));
} else {
  $$('[data-reveal]').forEach(element => element.classList.add('is-visible'));
}

// Atualiza o ano automaticamente para manter o rodapé atualizado.
$('#year').textContent = new Date().getFullYear();
renderCart();
