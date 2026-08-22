// ======================================================
// CAPA — FUNCIONALIDADE
// ======================================================

// 🌍 BOTÃO DE IDIOMA — ABRIR/FECHAR CAIXA
const btnIdioma = document.getElementById('btn-idioma');
const caixaIdioma = document.getElementById('caixa-idioma');
const opcoesIdioma = document.querySelectorAll('.idioma-opcao');

btnIdioma.addEventListener('click', (e) => {
    e.stopPropagation();
    caixaIdioma.classList.toggle('aberta');
});

// Fechar se clicar fora
document.addEventListener('click', () => {
    caixaIdioma.classList.remove('aberta');
});

caixaIdioma.addEventListener('click', (e) => e.stopPropagation());

// Selecionar idioma
opcoesIdioma.forEach(opcao => {
    opcao.addEventListener('click', () => {
        const idioma = opcao.dataset.idioma;
        localStorage.setItem('idioma_selecionado', idioma);
        btnIdioma.innerHTML = `${opcao.textContent.split(' ')[0]} ${opcao.textContent.split(' ').slice(1).join(' ')}`;
        caixaIdioma.classList.remove('aberta');
        
        // Aqui depois vai carregar a tradução correspondente
        console.log('Idioma selecionado:', idioma);
    });
});

// ▶️ BOTÃO COMEÇAR — ENTRAR NO JOGO
const btnComecar = document.getElementById('btn-comecar');

btnComecar.addEventListener('click', () => {
    // Animação de saída da capa
    document.querySelector('.capa').style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    document.querySelector('.capa').style.opacity = '0';
    document.querySelector('.capa').style.transform = 'scale(1.05)';
    
    // Aguardar animação e ir para a tela de seleção de país ou jogo
    setTimeout(() => {
        // Aqui você coloca o link para a próxima tela
        // window.location.href = 'selecao-pais.html';
        alert('Entrando no jogo... 🚑\n\nPróximo passo: tela de seleção de país.');
    }, 400);
});

// ✅ Carregar idioma salvo ao abrir
window.addEventListener('load', () => {
    const idiomaSalvo = localStorage.getItem('idioma_selecionado');
    if (idiomaSalvo) {
        const opcao = document.querySelector(`.idioma-opcao[data-idioma="${idiomaSalvo}"]`);
        if (opcao) btnIdioma.innerHTML = `${opcao.textContent.split(' ')[0]} Idioma`;
    }
});
