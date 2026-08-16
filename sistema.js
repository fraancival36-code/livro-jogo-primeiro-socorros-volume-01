// ==============================================
// LIVRO-JOGO PRIMEIROS SOCORROS — VERSÃO FINAL
// ✅ 60 cenas embaralhadas UMA VEZ no início
// ✅ índice 0 → 1 → 2 → ... → 59 — só avança, NUNCA volta
// ✅ Cada cena = 1x só — eliminação LÓGICA (sem splice)
// ✅ A-B-C-D-E FIXAS → pontuação sempre correta
// ✅ HP nunca zera o jogo → SEMPRE chega nas 60 cenas
// ✅ Nova partida = NOVA sequência aleatória
// Autor: FRANCIVAL ALVES FARIAS
// ==============================================

let estado = {
  hp: 10,
  hpMax: 10,
  cenaAtual: 0,        // índice da lista embaralhada — SÓ AVANÇA
  totalCenas: 60,
  pontos: 0,
  acertos: 0,
  erros: 0,
  escolhas: [],
  listaEmbaralhada: null, // ordem fixa por partida — criada 1x só
  perfil: { conhecimento:0, prudencia:0, agilidade:0, comunicacao:0, integridade:0 }
};

let dados = null;
const caminhoDados = "volumes/volume-01/dados.json";

// ==============================================
// EMBARALHA AS CENAS — UMA VEZ POR PARTIDA
// ==============================================
function embaralharCenas(cenas) {
  const embaralhadas = [...cenas]; // cópia das 60
  
  // Fisher-Yates — embaralhamento justo e completo
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
  const listaSalva = estado.listaEmbaralhada; // PRESERVA!
  estado = {
    hp: 10,
    hpMax: 10,
    cenaAtual: 0,
    totalCenas: 60,
    pontos: 0,
    acertos: 0,
    erros: 0,
    escolhas: [],
    listaEmbaralhada: listaSalva, // ✅ NÃO APAGA O EMBARALHAMENTO!
    perfil: { conhecimento:0, prudencia:0, agilidade:0, comunicacao:0, integridade:0 }
  };
}

// ==============================================
// INICIAR JOGO — CRIA A LISTA EMBARALHADA 1X SÓ
// ==============================================
async function iniciarJogo() {
  try {
    const res = await fetch(caminhoDados);
    dados = await res.json();
    
    // 🌀 CRIA A ORDEM ALEATÓRIA — UMA VEZ POR PARTIDA
    estado.listaEmbaralhada = embaralharCenas(dados.cenas);
    estado.totalCenas = estado.listaEmbaralhada.length; // = 60
    
    // ✅ REINICIA DEPOIS — PRESERVA A LISTA EMBARALHADA
    reiniciarEstado();
    
    mostrarCena(); // primeira cena da lista nova
    
  } catch (erro) {
    alert("❌ Erro ao carregar. Verifique o arquivo dados.json");
    console.error(erro);
  }
}

// ==============================================
// MOSTRAR CENA — SÓ AVANÇA, NUNCA VOLTA
// ==============================================
function mostrarCena() {
  // ✅ CHEGOU NO FIM DAS 60 → RESULTADO FINAL
  if (estado.cenaAtual >= estado.listaEmbaralhada.length) {
    mostrarResultadoFinal();
    return;
  }

  // 📖 PEGA A CENA PELO ÍNDICE — SÓ CRESCE
  const cena = estado.listaEmbaralhada[estado.cenaAtual];
  
  // Atualiza tela
  document.getElementById("tituloCena").textContent = cena.titulo;
  document.getElementById("cenario").textContent = cena.cenario;
  document.getElementById("categoria").textContent = cena.categoria;
  
  // ✅ ALTERNATIVAS A-B-C-D-E NA ORDEM FIXA
  const container = document.getElementById("alternativas");
  container.innerHTML = "";
  
  cena.alternativas.forEach((alt, indice) => {
    const letra = ['A', 'B', 'C', 'D', 'E'][indice];
    const botao = document.createElement("button");
    botao.className = "alternativa";
    botao.innerHTML = `<span class="letra-alt">${letra}</span> ${alt.texto}`;
    botao.onclick = () => escolherAlternativa(alt, cena, letra);
    container.appendChild(botao);
  });
  
  atualizarInterface();
}

// ==============================================
// ESCOLHEU → AVANÇA → NÃO VOLTA MAIS!
// ==============================================
function escolherAlternativa(alternativa, cena, letraEscolhida) {
  // Atualiza HP — NUNCA trava o jogo, continua até o fim!
  estado.hp = Math.max(0, Math.min(estado.hp + alternativa.hp, 10));
  
  // Pontuação
  estado.pontos += alternativa.hp >= 0 ? 10 : 2;
  if (alternativa.hp >= 0) estado.acertos++;
  else estado.erros++;
  
  // Atualiza perfil
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
  
  // ➡️ AVANÇA — ÍNDICE SÓ CRESCE, A CENA FICA PRA TRÁS
  estado.cenaAtual++; // ELIMINAÇÃO LÓGICA — nunca volta!
  
  // Mostra consequência e depois próxima cena
  mostrarConsequencia(alternativa, cena);
  
  setTimeout(() => {
    mostrarCena(); // próxima da lista embaralhada
  }, 2000);
}

// ==============================================
// RESULTADO FINAL — SÓ DEPOIS DAS 60 CENAS
// ==============================================
function mostrarResultadoFinal() {
  // Calcula perfil dominante
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
  
  // Nível
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
  // HP
  document.getElementById("hpTexto").textContent = `${estado.hp}/${estado.hpMax}`;
  const porcentagemHP = (estado.hp / estado.hpMax) * 100;
  document.getElementById("hpBarra").style.width = porcentagemHP + "%";
  
  // Progresso
  document.getElementById("cenaAtual").textContent = estado.cenaAtual + 1;
  document.getElementById("totalCenas").textContent = estado.totalCenas;
  const progresso = ((estado.cenaAtual + 1) / estado.totalCenas) * 100;
  document.getElementById("barraProgresso").style.width = progresso + "%";
  
  // Pontos
  document.getElementById("pontos").textContent = `${estado.pontos} pts`;
}
