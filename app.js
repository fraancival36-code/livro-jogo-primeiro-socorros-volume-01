// ==============================================
// PRIME — Primeiros Socorros · LÓGICA COMPLETA
// Autor: FRANCIVAL ALVES FARIAS
// ==============================================

let estado = {
  cenaAtual: 0,
  hp: 8,
  hpMax: 10,
  totalCenas: 60
};

const ganhoHP = [-1, 1, 0, 1, -1];

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ PRIME INICIADO — Cena 1 de 60');
});

function escolher(indice) {
  estado.hp = Math.max(0, Math.min(estado.hpMax, estado.hp + ganhoHP[indice]));
  estado.cenaAtual++;
  atualizarTela();
  alert(`✅ Cena ${estado.cenaAtual + 1} de ${estado.totalCenas} | HP: ${estado.hp}/${estado.hpMax}`);
}

function atualizarTela() {
  const vals = document.querySelectorAll('.status-val');
  if (vals[1]) vals[1].textContent = `${estado.cenaAtual + 1} DE ${estado.totalCenas}`;
}
