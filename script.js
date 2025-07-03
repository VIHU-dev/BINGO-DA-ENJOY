// === SCRIPT COMPLETO PARA BINGO COM SETA GIRANDO ===
const simbolos = [
  'blouse', 'bow tie', 'boxers', 'bra', 'cap', 'coat', 'gloves', 'hat',
  'hoodie', 'jacket', 'jeans', 'leggings', 'overalls', 'pajamas', 'panties',
  'pants', 'scarf', 'shirt', 'shorts', 'skirt', 'socks', 'stokings', 'suit',
  'sweater', 'swimsuit', 'tie', 't-shirt', 'undewear', 'vest'
];

const reel = document.getElementById('reel');
const tickSound = document.getElementById('tick-sound');
const winSound = document.getElementById('win-sound');
const roletaSound = document.getElementById('roleta-sound');
const seta = document.querySelector('.seta');

let rodando = false;
let posicao = 0;
let velocidade = 0;
let animacao;
const jaSorteados = [];

function criarReel() {
  reel.innerHTML = '';
  const sequencia = [];

  for (let i = 0; i < 50; i++) {
    let simbolo;
    do {
      simbolo = simbolos[Math.floor(Math.random() * simbolos.length)];
    } while (jaSorteados.includes(simbolo) && jaSorteados.length < simbolos.length);
    sequencia.push(simbolo);
  }

  sequencia.forEach(simbolo => {
    const div = document.createElement('div');
    div.classList.add('symbol');
    const img = document.createElement('img');
    img.src = `imgs/${simbolo.replace(/ /g, '_')}.jpg`;
    img.classList.add('icon-img');
    div.appendChild(img);
    reel.appendChild(div);
  });
}

function girar() {
  if (rodando || jaSorteados.length === simbolos.length) return;
  rodando = true;
  criarReel();
  limparDestaques();
  posicao = 0;
  velocidade = 50;
  animar();
  playRoletaSound();
  seta.classList.add('girando');
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
    seta.classList.remove('girando');
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
  const imgSrc = sorteado.querySelector('img').src;
  const nome = imgSrc.substring(imgSrc.lastIndexOf('/') + 1, imgSrc.lastIndexOf('.')).replace(/_/g, ' ');

  if (!jaSorteados.includes(nome)) {
    jaSorteados.push(nome);
  }

  document.getElementById('resultado').innerHTML = `Resultado: ${nome}`;
  sorteado.classList.add('highlight');
  adicionarSorteado(nome);
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
