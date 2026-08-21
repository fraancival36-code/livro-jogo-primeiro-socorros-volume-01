/**
 * APP.JS — PONTE DE CONEXÃO: MOTOR ↔ ESTANTE
 * ==========================================
 * ⚠️ ESTE ARQUIVO NÃO ALTERA O MOTOR.
 * Apenas conecta a lógica já existente aos elementos visuais.
 * 
 * Regra de Ouro: Motor = intocável. Esta camada = apenas tradução visual.
 */

// ==============================================
// MAPEAMENTO DAS CAMADAS — NÃO MEXER NO MOTOR!
// ==============================================
const UI = {
  // 04_STATUS
  cena: document.getElementById('status-cena'),
  hp: document.getElementById('status-hp'),
  tempo: document.getElementById('status-tempo'),
  
  // 05_IMAGEM_CENA
  imagemCena: document.getElementById('imagem-cena'),
  
  // 06_PERGUNTA
  pergunta: document.querySelector('.texto-pergunta'),
  
  // 07 a 11 — BOTÕES A-E
  botoes: {
    A: document.getElementById('camada-07'),
    B: document.getElementById('camada-08'),
    C: document.getElementById('camada-09'),
    D: document.getElementById('camada-10'),
    E: document.getElementById('camada-11')
  },
  
  // 13_CONTROLES
  pontos: document.querySelector('.controle-item'),
  btnSair: document.querySelector('.controle-btn:nth-child(2)'),
  btnPausa: document.querySelector('.controle-btn:nth-child(3)'),
  
  // 12_PRODUTOS — pode ser ligado/desligado
  cardProdutos: document.getElementById('camada-12'),
  btnPlataforma: document.querySelector('.btn-plataforma'),
  
  // 15_NAVEGAÇÃO
  navegacao: {
    estante: document.querySelector('.nav-item:nth-child(1)'),
    desempenho: document.querySelector('.nav-item:nth-child(2)'),
    jogar: document.querySelector('.btn-jogar'),
    ranking: document.querySelector('.nav-item:nth-child(4)'),
    ajustes: document.querySelector('.nav-item:nth-child(5)')
  }
};

// ==============================================
// INICIALIZAÇÃO — CONECTA E PREPARA
// ==============================================
function inicializarEstante() {
  console.log('✅ Estante PRIME carregada — Camadas independentes ativas');
  console.log('📦 Motor conectado — Intocável, funcionando');
  
  // Conectar eventos dos botões ao motor existente
  registrarEventosBotoes();
  
  // Conectar navegação inferior
  registrarNavegacao();
  
  // Carregar estado inicial do motor
  sincronizarComMotor();
}

// ==============================================
// CONECTAR BOTÕES AO MOTOR — SEM ALTERAR LÓGICA
// ==============================================
function registrarEventosBotoes() {
  Object.entries(UI.botoes).forEach(([letra, elemento]) => {
    if (elemento) {
      elemento.addEventListener('click', () => {
        // ✅ Chama a função do motor que JÁ EXISTE
        if (window.MotorPrime && window.MotorPrime.escolherOpcao) {
          window.MotorPrime.escolherOpcao(letra);
        }
        
        // Efeito visual — sem afetar o motor
        aplicarFeedbackVisual(elemento, letra);
      });
    }
  });
}

// ==============================================
// FEEDBACK VISUAL INDEPENDENTE — NÃO TOCAR NO MOTOR
// ==============================================
function aplicarFeedbackVisual(elemento, letra) {
  // Efeito de clique — só visual, não muda pontuação nem lógica
  elemento.style.opacity = '0.8';
  elemento.style.transform = 'scale(0.97)';
  
  setTimeout(() => {
    elemento.style.opacity = '1';
    elemento.style.transform = 'scale(1)';
  }, 150);
  
  // O motor é que decide a cor final — aqui só escutamos
  // Motor → verde = acertou, vermelho = errou
}

// ==============================================
// SINCRONIZAR DADOS DO MOTOR → TELA
// ==============================================
function sincronizarComMotor() {
  // Atualiza a tela com os dados que o motor já tem
  // Exemplo — adaptar conforme o motor que já funciona:
  
  if (window.MotorPrime) {
    const estado = window.MotorPrime.estadoAtual || {};
    
    // Atualizar Status (Camada 04)
    if (UI.cena && estado.cenaAtual) {
      UI.cena.textContent = `Cena ${estado.cenaAtual} de 60`;
    }
    if (UI.hp && estado.hp !== undefined) {
      UI.hp.textContent = `❤️ HP ${estado.hp}/10`;
    }
    if (UI.tempo && estado.tempo !== undefined) {
      UI.tempo.textContent = `⏱️ ${estado.tempo}s`;
    }
    
    // Atualizar Pontos (Camada 13)
    if (UI.pontos && estado.pontos !== undefined) {
      UI.pontos.textContent = `💾 Pontos: ${estado.pontos}`;
    }
  }
  
  // Repetir a cada segundo — mantém a tela sincronizada
  setTimeout(sincronizarComMotor, 1000);
}

// ==============================================
// NAVEGAÇÃO INFERIOR — CAMADA 15 INDEPENDENTE
// ==============================================
function registrarNavegacao() {
  // Botão Jogar — central e vermelho
  if (UI.navegacao.jogar) {
    UI.navegacao.jogar.addEventListener('click', () => {
      if (window.MotorPrime && window.MotorPrime.iniciarJogo) {
        window.MotorPrime.iniciarJogo();
      }
    });
  }
  
  // Botão Sair
  if (UI.btnSair) {
    UI.btnSair.addEventListener('click', () => {
      if (window.MotorPrime && window.MotorPrime.sair) {
        window.MotorPrime.sair();
      }
    });
  }
  
  // Botão Pausa
  if (UI.btnPausa) {
    UI.btnPausa.addEventListener('click', () => {
      if (window.MotorPrime && window.MotorPrime.pausar) {
        window.MotorPrime.pausar();
      }
    });
  }
  
  // Botão Ver Plataforma — Card Produtos
  if (UI.btnPlataforma) {
    UI.btnPlataforma.addEventListener('click', () => {
      // Aqui abre a página de produtos — não afeta o jogo
      alert('Plataforma PRIME — Em breve!');
    });
  }
}

// ==============================================
// LIGAR QUANDO A PÁGINA CARREGAR
// ==============================================
document.addEventListener('DOMContentLoaded', inicializarEstante);

// ==============================================
// FUNÇÕES PARA AJUSTE FUTURO — CAMADAS INDEPENDENTES
// ==============================================
window.EstanteControle = {
  // Ligar/desligar anúncio superior — sem tocar no jogo
  toggleAnuncioSuperior: (ativo) => {
    const el = document.getElementById('camada-02');
    if (el) el.style.display = ativo ? 'block' : 'none';
  },
  
  // Ligar/desligar card de produtos — sem tocar no jogo
  toggleCardProdutos: (ativo) => {
    if (UI.cardProdutos) UI.cardProdutos.style.display = ativo ? 'block' : 'none';
  },
  
  // Ligar/desligar anúncio inferior — sem tocar no jogo
  toggleAnuncioInferior: (ativo) => {
    const el = document.getElementById('camada-14');
    if (el) el.style.display = ativo ? 'block' : 'none';
  },
  
  // Trocar imagem da cena — sem tocar no resto
  trocarImagem: (caminho) => {
    if (UI.imagemCena) UI.imagemCena.src = caminho;
  }
};

console.log('📚 EstanteControle carregado — ajustes visuais sem risco ao motor!');
