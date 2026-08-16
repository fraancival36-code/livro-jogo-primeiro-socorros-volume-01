// app.js — CORRIGIDO com caminhos certos
let volumeAtual = 1;
let desafioAtual = 0;
let dados = null;
let pontos = 0;

// Caminho CERTO para o conteúdo
const caminhoDados = "volumes/volume-01/dados.json";
const caminhoCapa = "volumes/volume-01/capa.jpg";

async function carregarVolume(numeroVolume) {
    try {
        const resposta = await fetch(caminhoDados);
        if (!resposta.ok) throw new Error("Não encontrou o arquivo");
        dados = await resposta.json();
        volumeAtual = numeroVolume;
        desafioAtual = 0;
        pontos = 0;
        mostrarDesafio();
        atualizarProgresso();
    } catch (erro) {
        console.error("Erro ao carregar:", erro);
        alert("Não foi possível carregar o conteúdo. Verifique se os arquivos estão no lugar certo!");
    }
}

function mostrarDesafio() {
    if (!dados || !dados.desafios[desafioAtual]) {
        alert("Parabéns! Você completou este volume!");
        return;
    }

    const desafio = dados.desafios[desafioAtual];
    
    // Atualiza os elementos na tela
    const elCategoria = document.getElementById("categoria");
    const elCenario = document.getElementById("cenario");
    const elRisco = document.getElementById("riscoImediato");
    const elAlternativas = document.getElementById("alternativas");
    const elContador = document.getElementById("contadorDesafio");
    const elPontos = document.getElementById("pontos");
    const elTitulo = document.getElementById("titulo-volume");
    const elBarra = document.getElementById("barraProgresso");

    if (elTitulo) elTitulo.textContent = dados.titulo;
    if (elCategoria) elCategoria.textContent = desafio.categoria;
    if (elCenario) elCenario.textContent = desafio.cenario;
    if (elRisco) elRisco.textContent = desafio.riscoImediato;
    if (elContador) elContador.textContent = `${desafioAtual + 1} / ${dados.totalDesafios}`;
    if (elPontos) elPontos.textContent = pontos;
    
    // Barra de progresso
    if (elBarra) elBarra.style.width = `${((desafioAtual + 1) / dados.totalDesafios) * 100}%`;

    // Monta as alternativas
    if (elAlternativas) {
        elAlternativas.innerHTML = "";
        desafio.alternativas.forEach((alt, indice) => {
            const botao = document.createElement("button");
            botao.className = "btn";
            botao.style.width = "100%";
            botao.style.margin = "8px 0";
            botao.style.textAlign = "left";
            botao.style.padding = "14px 18px";
            botao.innerHTML = `<strong>${alt.letra}.</strong> ${alt.texto}`;
            botao.onclick = () => responder(alt.letra, desafio.respostaCorreta);
            elAlternativas.appendChild(botao);
        });
    }
}

function responder(letraEscolhida, letraCorreta) {
    const desafio = dados.desafios[desafioAtual];
    let mensagem = "";
    let acertou = false;

    if (letraEscolhida === letraCorreta) {
        mensagem = desafio.consequencias.sucesso;
        pontos += 10;
        acertou = true;
    } else {
        mensagem = desafio.consequencias.erro;
    }

    // Mostra o resultado
    setTimeout(() => {
        if (confirm(`${mensagem}\n\n📖 O que fazer:\n${desafio.procedimentoCorreto}\n\nQuer continuar?`)) {
            proximoDesafio();
        }
    }, 300);
}

function proximoDesafio() {
    desafioAtual++;
    mostrarDesafio();
}

function atualizarProgresso() {
    // Atualiza barra de progresso se existir
}

function voltarMenu() {
    window.location.href = "menu-volumes.html";
}

// Inicia automaticamente
document.addEventListener("DOMContentLoaded", () => {
    const url = new URLSearchParams(window.location.search);
    const volume = url.get("volume") || 1;
    carregarVolume(parseInt(volume));
});
