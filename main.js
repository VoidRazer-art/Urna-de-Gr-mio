// CONFIGURAÇÕES DO SISTEMA
// coloque aqui a URL do Apps Script (sem ?resultados=1)
const API = "https://script.google.com/macros/s/AKfycbxaAe98MtHRg1Tki4rL_jdjwwXEXTPMe57_boZDex0p-gtKvIHq24Zv4HUFUGm8jILO/exec";
const SENHA = "GRÊMIOELEIÇÃOJH2026"; // troque para a senha real

// Elementos
const telaSenha = document.getElementById("telaSenha");
const urna = document.getElementById("urna");
const confirmacao = document.getElementById("confirmacao");
const btnEntrar = document.getElementById("btnEntrar");
const btnVotar = document.getElementById("btnVotar");

// Lógica da senha
btnEntrar.onclick = () => {
    const digitada = document.getElementById("senhaInformada").value;
    if (digitada === SENHA) {
        telaSenha.classList.add("hidden");
        urna.classList.remove("hidden");
    } else {
        alert("Senha incorreta!");
    }
};

// Lógica do voto
btnVotar.onclick = () => {
    const item = document.querySelector('input[name="voto"]:checked');
    if (!item) {
        alert("Escolha uma chapa!");
        return;
    }

     const audio = document.getElementById("Somurna");
    audio.currentTime = 0;
    
    audio.play().catch(err => {
        console.warn("Áudio bloqueado, mas o voto continuará normalmente.");
    });
    
    const chapa = item.value;
    // Função que tenta enviar e faz retry em caso de falha
    enviarComRetry(chapa, 3);
};

function enviarComRetry(chapa, tentativas) {
    fetch(`${API}?chapa=${chapa}`)
        .then(r => r.text())
        .then(() => {
            mostrarConfirmacao();
            setTimeout(() => location.reload(), 2000);
        })
        .catch((err) => {
            if (tentativas > 0) {
                console.warn("Erro ao enviar voto. Tentando novamente...", err);
                setTimeout(() => enviarComRetry(chapa, tentativas - 1), 1000);
            } else {
                alert("Não foi possível registrar o voto. Verifique a conexão e peça ajuda ao mesário.");
            }
        });
}

function mostrarConfirmacao() {
    urna.classList.add("hidden");
    confirmacao.classList.remove("hidden");
    confirmacao.style.opacity = 0;
    confirmacao.style.transform = "scale(0.5)";
    setTimeout(() => {
        confirmacao.style.transition = "0.6s";
        confirmacao.style.opacity = 1;
        confirmacao.style.transform = "scale(1)";
    }, 50);
}
