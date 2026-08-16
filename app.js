// SISTEMA RAIZ — LÊ QUALQUER VOLUME SEM PRECISAR MEXER AQUI
let volumeAtual = 1;
let desafioAtual = 0;
let pontos = 0;
let dados = null;

// Carrega o volume automaticamente
async function carregarVolume(numero) {
    const caminho = `volumes/volume-0${numero}/dados.json`;
    try {
        const resposta = await fetch(caminho);
        dados = await resposta.json();
        volumeAtual = numero;
        desafioAtual = 0;
        pontos = 0;
        atualizarTela();
    } catch (erro) {
        console.error("Erro ao carregar volume:", erro);
        alert("Volume não encontrado!");
    }
}

function atualizarTela() {
    const desafio = dados.desafios[desafioAtual];
    document.getElementById('categoria').textContent = desafio.categoria;
    document.getElementById('titulo-desafio').textContent = desafio.titulo;
    document.getElementById('cenario').textContent = desafio.cenario;
    document.getElementById('risco').textContent = desafio.riscoImediato;
    document.getElementById('numero-desafio').textContent = `${String(desafioAtual+1).padStart(3,'0')}/${String(dados.desafios.length).padStart(3,'0')}`;
    document.getElementById('pontos').textContent = pontos;
    
    // Barra de progresso
    const progresso = ((desafioAtual + 1) / dados.desafios.length) * 100;
    document.getElementById('barra').style.width = `${progresso}%`;
    
    // Carrega alternativas
    const container = document.getElementById('alternativas');
    container.innerHTML = '';
    desafio.alternativas.forEach((alt, idx) => {
        const letra = String.fromCharCode(65 + idx); // A, B, C, D, E
        container.innerHTML += `
            <div class="alternativa" onclick="responder('${letra}')">
                <span class="letra">${letra})</span> ${alt.texto}
            </div>
        `;
    });
}

function responder(letraEscolhida) {
    const desafio = dados.desafios[desafioAtual];
    const correta = desafio.respostaCorreta;
    
    if (letraEscolhida === correta) {
        pontos += 10;
        alert("✅ Correto! +10 pontos\n\n" + desafio.consequencias.sucesso);
    } else {
        alert("❌ Atenção!\n\n" + desafio.consequencias.erro + 
              "\n\n✅ O procedimento correto:\n" + desafio.procedimentoCorreto);
    }
    
    // Avança ou termina
    if (desafioAtual < dados.desafios.length - 1) {
        desafioAtual++;
        atualizarTela();
    } else {
        alert(`🏆 VOLUME CONCLUÍDO!\n\nPontuação final: ${pontos} pontos\n\nParabéns! Você completou o Volume 1 de Primeiros Socorros!`);
        window.location.href = "menu-volumes.html";
    }
}

function voltarMenu() {
    window.location.href = "menu-volumes.html";
}
