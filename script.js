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
    d
