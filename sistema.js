// ==============================================
// LIVRO-JOGO PRIMEIROS SOCORROS — VERSÃO FINAL
// ✅ 60 cenas embaralhadas UMA VEZ no início
// ✅ índice 0 → 1 → 2 → ... → 59 — só avança, NUNCA volta
// ✅ Cada cena = 1x só — eliminação LÓGICA
// ✅ A-B-C-D-E FIXAS → pontuação sempre correta
// ✅ HP nunca zera o jogo → SEMPRE chega nas 60 cenas
// ✅ Nova partida = NOVA sequência aleatória
// ✅ Caminho correto: volumes/volume-01/dados.json
// Autor: FRANCIVAL ALVES FARIAS
// ==============================================

let estado = {
  hp: 10,
  hpMax: 10,
  cenaAtual: 0,
  totalCenas: 60,
  pontos: 0,
  acertos: 0,
  erros: 0,
  escolhas: [],
  listaEmbaralhada: null,
  perfil: { conhecimento:0, prudencia:0, agilidade:0, comunicacao:0, integridade:0 }
};

let dados = null;
// ✅ CAMINHO CERTO — NÃO ALTERAR!
const caminhoDados = "volumes/volume-01/dados.json";

// ==============================================
// EMBARALHA AS CENAS — UMA VEZ POR PARTIDA
// ==============================================
function embaralharCenas(cenas) {
  const embaralhadas = [...cenas];
  for (let i = embaralhadas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [embaralhadas[i], embaralhadas[j]] = [embaralhadas[j], embaralhadas[i]];
  }
  return embaralhadas;
}

// ==============================================
// REINICIA ESTADO — PRESERVA A LISTA EMBARALHADA
// ==============================================
function reiniciarEstado() {
  const listaSalva = estado.listaEmbaralhada;
  estado = {
    hp: 10,
    hpMax: 10,
    cenaAtual: 0,
    totalCenas: 60,
    pontos: 0,
    acertos: 0,
    erros: 0,
    escolhas: [],
    listaEmbaralhada: listaSalva,
    perfil: { conhecimento:0, prudencia:0, agilidade:0, comunicacao:0, integridade:0 }
  };
}

// ==============================================
// INICIAR JOGO — CRIA A LISTA EMBARALHADA
// ==============================================
async function iniciarJogo() {
  try {
    const res = await fetch(caminhoDados);
    dados = await res.json();
    
    estado.listaEmbaralhada = embaralharCenas(dados.cenas);
    estado.totalCenas = estado.listaEmbaralhada.length;
    
    reiniciarEstado();
    mostrarCena();
    
  } catch (erro) {
    alert("❌ Erro ao carregar. Verifique o arquivo dados.json");
    console.error(erro);
  }
}

// ==============================================
// MOSTRAR CENA — LAYOUT OFICIAL
// ==============================================
function mostrarCena() {
  if (estado.cenaAtual >= estado.listaEmbaralhada.length) {
    mostrarResultadoFinal();
    return;
  }

  const cena = estado.listaEmbaralhada[estado.cenaAtual];
  
  document.getElementById("tituloCena").textContent = cena.titulo || "";
  document.getElementById("categoria").textContent = cena.categoria || "";
  document.getElementById("cenario").textContent = cena.cenario || "";
  document.getElementById("avisoRisco").textContent = cena.risco || "";
  
  // ✅ IMAGEM — CAMINHO CERTO
  const imgCena = document.getElementById("imagemCena");
  if (cena.imagem) {
    imgCena.src = `volumes/volume-01/imagens/cenas/${cena.imagem}`;
    imgCena.style.display = "block";
  } else {
    imgCena.style.display = "none";
  }
  
  // ✅ ALTERNATIVAS A-B-C-D-E — ORDEM FIXA!
  const container = document.getElementById("alternativas");
  container.innerHTML = "";
  
  if (cena.alternativas) {
    cena.alternativas.forEach((alt, indice) => {
      const letra = ['A', 'B', 'C', 'D', 'E'][indice];
      const botao = document.createElement("button");
      botao.className = "alternativa";
      botao.innerHTML = `<span class="letra">${letra}</span> ${alt.texto}`;
      botao.onclick = () => escolherAlternativa(alt, cena, letra);
      container.appendChild(botao);
    });
  }
  
  atualizarInterface();
}

// ==============================================
// ESCOLHER ALTERNATIVA — AVANÇA SEM VOLTAR
// ==============================================
function escolherAlternativa(alternativa, cena, letraEscolhida) {
  estado.hp = Math.max(0, Math.min(estado.hp + alternativa.hp, 10));
  estado.pontos += alternativa.hp >= 0 ? 10 : 2;
  if (alternativa.hp >= 0) estado.acertos++;
  else estado.erros++;
  
  if (alternativa.perfil) {
    const p = alternativa.perfil;
    if (p.includes("cauteloso")) estado.perfil.prudencia++;
    if (p.includes("lider")) estado.perfil.comunicacao++;
    if (p.includes("rapido") || p.includes("agil")) estado.perfil.agilidade++;
    if (p.includes("conhecimento")) estado.perfil.conhecimento++;
    if (p.includes("persistente")) estado.perfil.integridade++;
  }
  
  estado.escolhas.push({
    cena: cena.id,
    letra: letraEscolhida,
    hp: alternativa.hp
  });
  
  estado.cenaAtual++; // ✅ SÓ AVANÇA — NÃO VOLTA!
  
  mostrarConsequencia(alternativa, cena);
  setTimeout(() => {
    mostrarCena();
  }, 2000);
}

// ==============================================
// FUNÇÕES AUXILIARES
// ==============================================
function mostrarConsequencia(alt, cena) {
  const container = document.getElementById("consequencia");
  container.className = "consequencia" + (alt.hp < 0 ? " erro" : "");
  container.innerHTML = `
    <strong>${alt.hp >= 0 ? "✅ CORRETO!" : "⚠️ ATENÇÃO!"}</strong><br>
    ${cena.procedimentoCorreto || "Continue aprendendo e praticando."}
  `;
  container.style.display = "block";
  setTimeout(() => {
    container.style.display = "none";
  }, 1800);
}

function atualizarInterface() {
  document.getElementById("hpTexto").textContent = `${estado.hp}/${estado.hpMax}`;
  document.getElementById("hpBarra").style.width = `${(estado.hp/estado.hpMax)*100}%`;
  document.getElementById("cenaAtual").textContent = estado.cenaAtual + 1;
  document.getElementById("totalCenas").textContent = estado.totalCenas;
  document.getElementById("barraProgresso").style.width = `${((estado.cenaAtual+1)/estado.totalCenas)*100}%`;
  document.getElementById("pontos").textContent = `${estado.pontos} pts`;
}

// ==============================================
// RESULTADO FINAL — SÓ DEPOIS DAS 60
// ==============================================
function mostrarResultadoFinal() {
  const p = estado.perfil;
  const valores = [
    {nome: "Cauteloso e Prudente", valor: p.prudencia},
    {nome: "Ágil e Decisivo", valor: p.agilidade},
    {nome: "Comunicativo e Líder", valor: p.comunicacao},
    {nome: "Conhecimento Técnico", valor: p.conhecimento},
    {nome: "Persistente e Determinado", valor: p.integridade}
  ];
  valores.sort((a,b) => b.valor - a.valor);
  const perfilDominante = valores[0].nome;
  
  let nivel = "🌱 Iniciante";
  if (estado.pontos >= 400) nivel = "🩹 Socorrista Básico";
  if (estado.pontos >= 480) nivel = "🏥 Socorrista Experiente";
  if (estado.pontos >= 540) nivel = "🚑 Especialista em Emergência";
  if (estado.pontos >= 570) nivel = "❤️ Mestre dos Primeiros Socorros";
  
  const mensagem = `🏆 VOLUME CONCLUÍDO!\n\n` +
    `Cenas respondidas: 60 de 60 ✅\n` +
    `Pontuação final: ${estado.pontos} pontos\n` +
    `HP final: ${estado.hp}/10\n\n` +
    `Perfil: ${perfilDominante}\n` +
    `Nível: ${nivel}\n\n` +
    `Obrigado por jogar! 🚑❤️`;
  
  setTimeout(() => {
    alert(mensagem);
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }, 500);
}

// ==============================================
// INICIAR AO CARREGAR
// ==============================================
window.onload = function() {
  // Pode adicionar botão de INICIAR aqui
};
