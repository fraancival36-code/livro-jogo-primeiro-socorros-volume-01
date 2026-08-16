// app.js — SISTEMA DE PONTOS + NÍVEIS + PROGRESSO COMPLETO
let volumeAtual = 1;
let desafioAtual = 0;
let dados = null;
let pontos = 0;
let nivel = 1;
let acertos = 0;
let erros = 0;

// Caminho CERTO
const caminhoDados = "volumes/volume-01/dados.json";

// Níveis conforme pontos
const niveis = [
  { min: 0, nome: "Iniciante", icone: "🌱" },
  { min: 50, nome: "Aprendiz", icone: "📖" },
  { min: 150, nome: "Socorrista", icone: "🩺" },
  { min: 300, nome: "Especialista", icone: "⭐" },
  { min: 500, nome: "Mestre dos Socorros", icone: "👑" }
];

async function carregarVolume(numeroVolume) {
  try {
    const resposta = await fetch(caminhoDados);
    if (!resposta.ok) throw new Error("Arquivo não encontrado");
    dados = await resposta.json();
    volumeAtual = numeroVolume;
    desafioAtual = 0;
    pontos = 0;
    nivel = 1;
    acertos = 0;
    erros = 0;
    mostrarDesafio();
    atualizarInterface();
  } catch (erro) {
    console.error("Erro:", erro);
    alert("❌ Não encontrou o conteúdo. Verifique se dados.json está em volumes/volume-01/");
  }
}

function mostrarDesafio() {
  if (!dados || !dados.desafios[desafioAtual]) {
    mostrarResultadoFinal();
    return;
  }

  const d = dados.desafios[desafioAtual];
  
  // Atualiza todos os elementos
  el("categoria").textContent = d.categoria;
  el("titulo-desafio").textContent = d.titulo;
  el("cenario").textContent = d.cenario;
  el("riscoImediato").textContent = d.riscoImediato;
  el("contadorDesafio").textContent = `${desafioAtual + 1} / ${dados.totalDesafios}`;
  
  // Barra de progresso
  const progresso = ((desafioAtual + 1) / dados.totalDesafios) * 100;
  el("barraProgresso").style.width = `${progresso}%`;

  // Monta alternativas
  const container = el("alternativas");
  container.innerHTML = "";
  d.alternativas.forEach(alt => {
    const btn = document.createElement("button");
    btn.className = "btn alternativa";
    btn.innerHTML = `<strong>${alt.letra}.</strong> ${alt.texto}`;
    btn.onclick = () => responder(alt.letra, d.respostaCorreta);
    container.appendChild(btn);
  });

  atualizarInterface();
}

function responder(letraEscolhida, letraCorreta) {
  const d = dados.desafios[desafioAtual];
  let mensagem = "";
  let ganhouPontos = 0;

  if (letraEscolhida === letraCorreta) {
    ganhouPontos = 10;
    pontos += ganhouPontos;
    acertos++;
    mensagem = `✅ ACERTOU! +${ganhouPontos} pontos!\n\n${d.consequencias.sucesso}`;
  } else {
    erros++;
    mensagem = `❌ ERROU!\n\n${d.consequencias.erro}`;
  }

  // Verifica subida de nível
  const nivelAntigo = nivel;
  atualizarNivel();
  let avisoNivel = "";
  if (nivel > nivelAntigo) {
    avisoNivel = `\n\n🎉 PARABÉNS! Você subiu para o Nível ${nivel} — ${niveis[nivel-1].nome}!`;
  }

  // Mostra resultado
  setTimeout(() => {
    alert(`${mensagem}\n\n📖 O que fazer:\n${d.procedimentoCorreto}${avisoNivel}`);
    proximoDesafio();
  }, 300);
}

function atualizarNivel() {
  for (let i = niveis.length - 1; i >= 0; i--) {
    if (pontos >= niveis[i].min) {
      nivel = i + 1;
      return;
    }
  }
  nivel = 1;
}

function atualizarInterface() {
  el("pontos").textContent = pontos;
  el("nivel").textContent = `${niveis[nivel-1].icone} Nível ${nivel} — ${niveis[nivel-1].nome}`;
  el("acertos").textContent = acertos;
  el("erros").textContent = erros;
}

function mostrarResultadoFinal() {
  const aproveitamento = Math.round((acertos / dados.totalDesafios) * 100);
  alert(`🏆 VOLUME CONCLUÍDO!\n\n📊 Pontuação Final: ${pontos} pontos\n🎖️ Nível Final: ${niveis[nivel-1].icone} ${niveis[nivel-1].nome}\n✅ Acertos: ${acertos} | ❌ Erros: ${erros}\n📈 Aproveitamento: ${aproveitamento}%\n\nParabéns por completar o Volume 1!`);
  window.location.href = "index.html";
}

function proximoDesafio() {
  desafioAtual++;
  mostrarDesafio();
}

function voltarMenu() {
  if (confirm("⚠️ O progresso atual será perdido. Tem certeza?")) {
    window.location.href = "menu-volumes.html";
  }
}

function el(id) { return document.getElementById(id); }

// Inicia
document.addEventListener("DOMContentLoaded", () => {
  const url = new URLSearchParams(window.location.search);
  carregarVolume(parseInt(url.get("volume") || 1));
});
