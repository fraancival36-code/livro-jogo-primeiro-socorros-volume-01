/**
 * APP.JS — LÓGICA COMPLETA: CAPA · SISTEMA · FEEDBACK
 * ================================================
 * Não mexe no motor. Só controla telas e preferências.
 */

const App = {
  sistemaEscolhido: 'gratuito',

  init() {
    this.bindCapa();
    this.bindSistema();
    this.bindBotoesJogo();
    this.bindFeedback();
    this.aplicarSistema();
    console.log('✅ App carregado — Capa, Sistema e Feedback ativos');
  },

  // ===== CAPA → ENTRAR NO JOGO =====
  bindCapa() {
    const btn = document.getElementById('btn-iniciar');
    if (btn) btn.addEventListener('click', () => {
      document.getElementById('tela-inicial').style.display = 'none';
      document.getElementById('tela-jogo').style.display = 'block';
      if (window.MotorPrime && window.MotorPrime.iniciar) {
        window.MotorPrime.iniciar();
      }
    });
  },

  // ===== ESCOLHA DO SISTEMA =====
  bindSistema() {
    const radios = document.querySelectorAll('input[name="sistema"]');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.sistemaEscolhido = e.target.value;
        this.aplicarSistema();
        localStorage.setItem('prime-sistema', this.sistemaEscolhido);
      });
    });
    // Carregar escolha salva
    const salvo = localStorage.getItem('prime-sistema');
    if (salvo) {
      this.sistemaEscolhido = salvo;
      document.querySelector(`input[value="${salvo}"]`).checked = true;
      this.aplicarSistema();
    }
  },

  aplicarSistema() {
    const adTopo = document.getElementById('camada-01');
    const adRodape = document.getElementById('camada-15');
    
    if (this.sistemaEscolhido === 'prime') {
      // SEM anúncios do Google — só os nossos ficam
      if (adTopo) adTopo.style.display = 'none';
      if (adRodape) adRodape.style.display = 'none';
      console.log('✨ Sistema PRIME ativo — anúncios Google removidos');
    } else {
      // Versão gratuita — anúncios aparecem
      if (adTopo) adTopo.style.display = 'flex';
      if (adRodape) adRodape.style.display = 'flex';
      console.log('🆓 Versão Gratuita ativa');
    }
  },

  // ===== FEEDBACK FINAL =====
  mostrarTelaFinal(resultados) {
    const tela = document.getElementById('tela-final');
    if (!tela) return;
    
    // Preencher resultados
    document.getElementById('res-acertos').textContent = resultados.acertos || '--';
    document.getElementById('res-erros').textContent = resultados.erros || '--';
    document.getElementById('res-pontos').textContent = resultados.pontos || '--';
    document.getElementById('res-tempo').textContent = resultados.tempoMedio || '--';
    
    // Mostrar tela
    tela.style.display = 'flex';
  },

  bindFeedback() {
    const botoes = document.querySelectorAll('.btn-feedback');
    botoes.forEach(btn => {
      btn.addEventListener('click', () => {
        // Desmarcar todos
        botoes.forEach(b => b.classList.remove('selecionado'));
        // Marcar selecionado
        btn.classList.add('selecionado');
        
        // Salvar avaliação
        const nota = btn.getAttribute('nota');
        const texto = btn.textContent;
        console.log('⭐ Avaliação do jogador:', nota, '-', texto);
        localStorage.setItem('ultima-avaliacao', JSON.stringify({ nota, texto, data: new Date().toISOString() }));
      });
    });

    // Jogar Novamente
    const btnNovamente = document.getElementById('btn-jogar-novamente');
    if (btnNovamente) btnNovamente.addEventListener('click', () => {
      document.getElementById('tela-final').style.display = 'none';
      // Reiniciar motor
      if (window.MotorPrime && window.MotorPrime.reiniciar) {
        window.MotorPrime.reiniciar();
      }
    });
  },

  // ===== BOTÕES DO JOGO =====
  bindBotoesJogo() {
    // Botão voltar → volta para capa
    const btnVoltar = document.getElementById('btn-voltar');
    if (btnVoltar) btnVoltar.addEventListener('click', () => {
      document.getElementById('tela-jogo').style.display = 'none';
      document.getElementById('tela-inicial').style.display = 'flex';
    });

    // Botões A-E → mandar escolha pro motor
    document.querySelectorAll('.botao-opcao').forEach(botao => {
      botao.addEventListener('click', () => {
        const letra = botao.dataset.letra;
        if (window.MotorPrime && window.MotorPrime.escolherOpcao) {
          window.MotorPrime.escolherOpcao(letra);
        }
        // Feedback visual temporário
        botao.style.transform = 'scale(0.95)';
        setTimeout(() => botao.style.transform = 'scale(1)', 150);
      });
    });
  }
};

// Inicializar quando carregar
document.addEventListener('DOMContentLoaded', () => App.init());

// Disponibilizar para o motor
window.App = App;
