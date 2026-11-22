function verificarLogin() {
    const usuario = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    return usuario;
}
const usuario = verificarLogin();

const agendamentos = JSON.parse(
    localStorage.getItem("agendamentos")
) || [];

let doacoes = 0;

if (usuario) {
    const historico = agendamentos.filter(
        agendamento =>
            agendamento.usuarioId === usuario.id &&
            agendamento.status === "confirmado"
    );

    doacoes = historico.length;
}

let nivel = "";
let porcentagem = 0;


if (doacoes >= 10) {
    nivel = "Ouro";
    porcentagem = 100;
}
else if (doacoes >= 5) {
    nivel = "Prata";
    porcentagem = (doacoes / 10) * 100;
}
else if (doacoes >= 1) {
    nivel = "Bronze";
    porcentagem = (doacoes / 5) * 100;
}
else {
    nivel = "Sem nível";
    porcentagem = 0;
}


document.getElementById("nivelAtual").innerText = nivel;

document.getElementById("quantidadeDoacoes").innerText =
    doacoes + " doações";

document.getElementById("barraProgresso").style.width =
    porcentagem + "%";

if (doacoes >= 10) {
    document.getElementById("textoProgresso").innerText =
        "Nível máximo alcançado!";
}
else if (doacoes >= 5) {
    document.getElementById("textoProgresso").innerText =
        doacoes + " / 10 doações para Ouro";
}

else if (doacoes >= 1) {
    document.getElementById("textoProgresso").innerText =
        doacoes + " / 5 doações para Prata";
}
else {
    document.getElementById("textoProgresso").innerText =
        "Faça sua primeira doação para alcançar o nível Bronze!";
}


let cardAtual = document.getElementById("card" + nivel);

if (cardAtual != null) {
    cardAtual.style.border = "2px solid #A61B1B";

    cardAtual.innerHTML +=
        '<span class="badge rounded-pill mt-3" style="background-color: #A61B1B;">Seu nível</span>';
}

