const simbolos = ['🍒', '⭐', '🍇', '🍉', '🔔', '7️⃣', '💎'];
const reel = document.getElementById('reel');
const tickSound = document.getElementById('tick-sound');
const winSound = document.getElementById('win-sound');
const roletaSound = document.getElementById('roleta-sound');

let rodando = false;
let posicao = 0;
let velocidade = 0;
let animacao;

function criarReel() {
  reel.innerHTML = '';
  const sequencia = [];

  for (let i = 0; i < 50; i++) {
    const simbolo = simbolos[Math.floor(Math.random() * simbolos.length)];
    sequencia.push(simbolo);
  }

  sequencia.forEach(simbolo => {
    const div = document.createElement('div');
    div.classList.add('symbol');
    div.innerText = simbolo;
    reel.appendChild(div);
  });
}

function girar() {
  if (rodando) return;
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
  const simboloLargura = 160; // 150 + 10
  const larguraContainer = 620;
  const centroContainer = larguraContainer / 2;
  const index = Math.round((Math.abs(posicao) + centroContainer - simboloLargura / 2) / simboloLargura) % reel.children.length;

  posicao = -(index * simboloLargura - centroContainer + simboloLargura / 2);
  reel.style.transform = `translateX(${posicao}px)`;

  const sorteado = reel.children[index];
  document.getElementById('resultado').innerHTML = `Resultado: ${sorteado.innerText}`;
  sorteado.classList.add('highlight');
  adicionarSorteado(sorteado.innerText);
  playWin();
}

function adicionarSorteado(simbolo) {
  const span = document.createElement('span');
  span.textContent = simbolo;
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
