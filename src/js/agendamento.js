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

    let data =
        document.getElementById("data").value;

    let hemocentro =
        document.getElementById("hemocentro").value;

    let horarioSelecionado =
        document.querySelector(
            'input[name="horario"]:checked'
        );

    let horario = "";

    if (horarioSelecionado != null) {
        horario = horarioSelecionado.value;
    }

    let sangue =
        document.getElementById("sangue").value;

    let hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let dataEscolhida =
        new Date(data + "T00:00:00");

    if (
        data === "" ||
        hemocentro === "" ||
        horario === "" ||
        sangue === ""
    ) {

        alert("Preencha todos os campos!");
        return;
    }

    if (dataEscolhida < hoje) {

        alert(
            "Não é possível agendar uma data que já passou!"
        );

        return;
    }

    let agendamentos = JSON.parse(
        localStorage.getItem(
            "agendamentos"
        )
    ) || [];

    const novoAgendamento = {

        data: data,
        hora: horario,
        hemocentro: hemocentro,
        sangue: sangue

    };

    const jaExiste = agendamentos.some(
        function (agendamento) {

            return (
                agendamento.data === data &&
                agendamento.hora === horario
            );

        }
    );

    if (jaExiste) {

        alert(
            "Já existe um agendamento para esta data e horário."
        );

        return;
    }

    agendamentos.push(
        novoAgendamento
    );

    localStorage.setItem(
        "agendamentos",
        JSON.stringify(
            agendamentos
        )
    );

    alert(
        "Agendamento salvo com sucesso!"
    );

    window.location.href =
        "Agenda.html";
}

function selecionarHorario(campo) {

    let horarios =
        document.querySelectorAll(
            'input[name="horario"]'
        );

    for (
        let i = 0;
        i < horarios.length;
        i++
    ) {

        if (horarios[i] !== campo) {
            horarios[i].checked = false;
        }
    }
}

let hoje =
    new Date().toLocaleDateString(
        "sv-SE"
    );

document.getElementById("data").min =
    hoje;