const simbolos = [
  { src: 'img/blouse.jpg', nome: 'Blouse' },
  { src: 'img/bow_tie.jpg', nome: 'Bow Tie' },
  { src: 'img/boxers.jpg', nome: 'Boxers' },
  { src: 'img/bra.jpg', nome: 'Bra' },
  { src: 'img/cap.jpg', nome: 'Cap' },
  { src: 'img/coat.jpg', nome: 'Coat' },
  { src: 'img/gloves.jpg', nome: 'Gloves' },
  { src: 'img/hat.jpg', nome: 'Hat' },
  { src: 'img/hoodie.jpg', nome: 'Hoodie' },
  { src: 'img/jacket.jpg', nome: 'Jacket' },
  { src: 'img/jeans.jpg', nome: 'Jeans' },
  { src: 'img/leggings.jpg', nome: 'Leggings' },
  { src: 'img/overalls.jpg', nome: 'Overalls' },
  { src: 'img/pajamas.jpg', nome: 'Pajamas' },
  { src: 'img/panties.jpg', nome: 'Panties' },
  { src: 'img/pants.jpg', nome: 'Pants' },
  { src: 'img/scarf.jpg', nome: 'Scarf' },
  { src: 'img/shirt.jpg', nome: 'Shirt' },
  { src: 'img/shorts.jpg', nome: 'Shorts' },
  { src: 'img/skirt.jpg', nome: 'Skirt' },
  { src: 'img/socks.jpg', nome: 'Socks' },
  { src: 'img/stockings.jpg', nome: 'Stockings' },
  { src: 'img/suit.jpg', nome: 'Suit' },
  { src: 'img/sweater.jpg', nome: 'Sweater' },
  { src: 'img/swimsuit.jpg', nome: 'Swimsuit' },
  { src: 'img/tie.jpg', nome: 'Tie' },
  { src: 'img/t_shirt.jpg', nome: 'T-Shirt' },
  { src: 'img/underwear.jpg', nome: 'Underwear' },
  { src: 'img/vest.jpg', nome: 'Vest' }
];

const reel = document.getElementById('reel');
const tickSound = document.getElementById('tick-sound');
const winSound = document.getElementById('win-sound');
const roletaSound = document.getElementById('roleta-sound');

let rodando = false;
let posicao = 0;
let velocidade = 0;
let animacao;
let simbolosSorteados = [];

function criarReel() {
  reel.innerHTML = '';
  const sequencia = [];

  for (let i = 0; i < 50; i++) {
    const disponiveis = simbolos.filter(s => !simbolosSorteados.includes(s.nome));
    if (disponiveis.length === 0) break;

    const simbolo = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    sequencia.push(simbolo);
  }

  sequencia.forEach(simbolo => {
    const div = document.createElement('div');
    div.classList.add('symbol');

    const img = document.createElement('img');
    img.src = simbolo.src;
    img.alt = simbolo.nome;
    img.dataset.nome = simbolo.nome;
    img.classList.add('icon-img');

    div.appendChild(img);
    reel.appendChild(div);
  });
}

function girar() {
  if (rodando) return;
  if (simbolosSorteados.length >= simbolos.length) {
    alert("Todos os símbolos já foram sorteados!");
    return;
  }

  rodando = true;
  criarReel();
  limparDestaques();
  posicao = 0;
  velocidade = 50;
  animar();
  playRoletaSound();
}

function animar() {
  posicao -= velocidade;
  const larguraReel = (150 + 10) * reel.children.length;

  if (Math.abs(posicao) >= larguraReel) {
    posicao = 0;
  }

  reel.style.transform = `translateX(${posicao}px)`;
  playTick();

  if (rodando) {
    animacao = requestAnimationFrame(animar);
  } else {
    stopRoletaSound();
    desacelerar();
  }
}

function parar() {
  rodando = false;
  stopRoletaSound();
}

function desacelerar() {
  if (velocidade > 2) {
    velocidade *= 0.95;
    posicao -= velocidade;

    const larguraReel = (150 + 10) * reel.children.length;
    if (Math.abs(posicao) >= larguraReel) {
      posicao = 0;
    }

    reel.style.transform = `translateX(${posicao}px)`;
    requestAnimationFrame(desacelerar);
  } else {
    alinharResultado();
  }
}

function alinharResultado() {
  const simboloLargura = 160;
  const larguraContainer = 620;
  const centroContainer = larguraContainer / 2;
  const index = Math.round((Math.abs(posicao) + centroContainer - simboloLargura / 2) / simboloLargura) % reel.children.length;

  posicao = -(index * simboloLargura - centroContainer + simboloLargura / 2);
  reel.style.transform = `translateX(${posicao}px)`;

  const sorteado = reel.children[index];
  const img = sorteado.querySelector('img');
  const nome = img?.dataset.nome || '???';

  document.getElementById('resultado').innerHTML = `Resultado: ${nome}`;
  sorteado.classList.add('highlight');

  if (!simbolosSorteados.includes(nome)) {
    simbolosSorteados.push(nome);
    adicionarSorteado(nome);
  }

  playWin();
}

function adicionarSorteado(nome) {
  const span = document.createElement('span');
  span.textContent = nome;
  document.getElementById('lista-sorteados').appendChild(span);
}

function playTick() {
  tickSound.currentTime = 0;
  tickSound.play();
}

function playWin() {
  winSound.play();
}

function playRoletaSound() {
  roletaSound.currentTime = 0;
  roletaSound.play();
}

function stopRoletaSound() {
  roletaSound.pause();
  roletaSound.currentTime = 0;
}

function limparDestaques() {
  document.querySelectorAll('.symbol').forEach(el => el.classList.remove('highlight'));
}
