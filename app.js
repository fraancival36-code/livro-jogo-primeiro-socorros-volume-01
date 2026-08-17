// ==============================================
// PRIME — Primeiros Socorros · LÓGICA DO JOGO
// Autor: FRANCIVAL ALVES FARIAS
// ==============================================

let estado = {
  cenaAtual: 0, // ✅ COMEÇA NA CENA 1!
  hp: 10,
  hpMax: 10,
  pontos: 0,
  nivel: 1,
  cenasJogadas: []
};

// Carrega os dados do Volume 1
let desafios = [];

// Inicializa ao abrir
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ PRIME Carregado — Cena 1 de 60');
  // Aqui carrega dados.json depois
});

// Função chamada ao clicar em uma alternativa
function escolherA(indice) {
  const respostasCorretas = [1, 3, 1, 2, 0]; // exemplo
  const ganhoHP = [0, 2, 0, 1, -1]; // exemplo

  // Atualiza HP
  estado.hp = Math.max(0, Math.min(estado.hpMax, estado.hp + ganhoHP[indice]));
  
  // Avança cena
  estado.cenaAtual++;
  
  // Atualiza a tela
  atualizarTela();
  
  alert(`✅ Resposta registrada! Cena ${estado.cenaAtual} de 60`);
}

function atualizarTela() {
  // Atualiza número da cena
  const elementos = document.querySelectorAll('.valor');
  if (elementos[1]) elementos[1].textContent = `${estado.cenaAtual + 1} DE 60`;
  
  // Atualiza barra de HP
  const hpFill = document.querySelector('.hp-fill');
  if (hpFill) hpFill.style.width = `${(estado.hp / estado.hpMax) * 100}%`;
  
  console.log(`Cena: ${estado.cenaAtual + 1} | HP: ${estado.hp}/${estado.hpMax}`);
}
