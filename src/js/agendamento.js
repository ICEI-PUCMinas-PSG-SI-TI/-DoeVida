function verificarLogin() {

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuarioLogado"
            )
        );

    if (!usuario) {

        window.location.href =
            "Login.html";

        return null;

    }

    return usuario;

}

const usuario = verificarLogin();

function agendar() {
    let data = document.getElementById("data").value;
    let hemocentro = document.getElementById("hemocentro").value;

    let horarioSelecionado = document.querySelector('input[name="horario"]:checked');

    let horario = "";

    if (horarioSelecionado != null) {
        horario = horarioSelecionado.value;
    }

    let sangue = document.getElementById("sangue").value;

    let hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let dataEscolhida = new Date(data + "T00:00:00");

    if (data == "" || hemocentro == "" || horario == "" || sangue == "") {
        alert("Preencha todos os campos!");
    }
    else if (dataEscolhida < hoje) {
        alert("Não é possível agendar uma data que já passou!");
    }
    else {
        localStorage.setItem("data", data);
        localStorage.setItem("hemocentro", hemocentro);
        localStorage.setItem("horario", horario);
        localStorage.setItem("sangue", sangue);

        alert("Agendamento salvo com sucesso.");
    }
}

function selecionarHorario(campo) {

    let horarios = document.querySelectorAll('input[name="horario"]');

    for (let i = 0; i < horarios.length; i++) {

        if (horarios[i] != campo) {
            horarios[i].checked = false;
        }

    }

}

let hoje = new Date().toLocaleDateString("sv-SE");
document.getElementById("data").min = hoje;
