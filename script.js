const simbolosOriginais = [
  { src: 'img/Blouse.jpg', nome: 'Blouse' },
  { src: 'img/Bow_tie.jpg', nome: 'Bow Tie' },
  { src: 'img/Boxers.jpg', nome: 'Boxers' },
  { src: 'img/Bra.jpg', nome: 'Bra' },
  { src: 'img/Cap.jpg', nome: 'Cap' },
  { src: 'img/Coat.jpg', nome: 'Coat' },
  { src: 'img/Gloves.jpg', nome: 'Gloves' },
  { src: 'img/Hat.jpg', nome: 'Hat' },
  { src: 'img/Hoodie.jpg', nome: 'Hoodie' },
  { src: 'img/Jacket.jpg', nome: 'Jacket' },
  { src: 'img/Jeans.jpg', nome: 'Jeans' },
  { src: 'img/Leggings.jpg', nome: 'Leggings' },
  { src: 'img/Overalls.jpg', nome: 'Overalls' },
  { src: 'img/Pajamas.jpg', nome: 'Pajamas' },
  { src: 'img/Panties.jpg', nome: 'Panties' },
  { src: 'img/Pants.jpg', nome: 'Pants' },
  { src: 'img/Scarf.jpg', nome: 'Scarf' },
  { src: 'img/Shirt.jpg', nome: 'Shirt' },
  { src: 'img/Shorts.jpg', nome: 'Shorts' },
  { src: 'img/Skirt.jpg', nome: 'Skirt' },
  { src: 'img/Socks.jpg', nome: 'Socks' },
  { src: 'img/Stockings.jpg', nome: 'Stockings' },
  { src: 'img/Suit.jpg', nome: 'Suit' },
  { src: 'img/Sweater.jpg', nome: 'Sweater' },
  { src: 'img/Swimsuit.jpg', nome: 'Swimsuit' },
  { src: 'img/Tie.jpg', nome: 'Tie' },
  { src: 'img/T_shirt.jpg', nome: 'T-Shirt' },
  { src: 'img/Underwear.jpg', nome: 'Underwear' },
  { src: 'img/Vest.jpg', nome: 'Vest' },
  { src: 'img/Dress.jpg', nome: 'Dress' }
];

let simbolosDisponiveis = [...simbolosOriginais];

const reel = document.getElementById('reel');
const tickSound = document.getElementById('tick-sound');
const winSound = document.getElementById('win-sound');
const roletaSound = document.getElementById('roleta-sound');
const seta = document.getElementById('seta');

let rodando = false;
let posicao = 0;
let velocidade = 0;
let animacao;

function criarReel() {
  reel.innerHTML = '';
  const sequencia = [];

  if (simbolosDisponiveis.length === 0) {
    alert('Todos os itens já foram sorteados!');
    return;
  }

  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * simbolosDisponiveis.length);
    sequencia.push(simbolosDisponiveis[random]);
  }

  sequencia.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('symbol');
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.nome;
    img.classList.add('icon-img');
    div.appendChild(img);
    reel.appendChild(div);
  });
}

function girar() {
  if (rodando || simbolosDisponiveis.length === 0) return;
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
  const larguraReel = 160 * reel.children.length;

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
  if (!rodando) return;
  rodando = false;
  stopRoletaSound();
}

function desacelerar() {
  if (velocidade > 2) {
    velocidade *= 0.95;
    posicao -= velocidade;

    const larguraReel = 160 * reel.children.length;
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
  const centroContainer = 620 / 2;
  const index = Math.round((Math.abs(posicao) + centroContainer - simboloLargura / 2) / simboloLargura) % reel.children.length;

  posicao = -(index * simboloLargura - centroContainer + simboloLargura / 2);
  reel.style.transform = `translateX(${posicao}px)`;

  const sorteado = reel.children[index];
  const nome = sorteado.querySelector('img').alt;
  document.getElementById('resultado').innerHTML = `Resultado: ${nome}`;
  sorteado.classList.add('highlight');
  adicionarSorteado(nome);

  // Remove item sorteado da lista de disponíveis
  simbolosDisponiveis = simbolosDisponiveis.filter(item => item.nome !== nome);

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
