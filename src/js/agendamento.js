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

function carregarHemocentros() {

    const selectHemocentro =
        document.getElementById(
            "hemocentro"
        );

    const usuarios = JSON.parse(
        localStorage.getItem(
            "usuarios"
        )
    ) || [];

    const hemocentros =
        usuarios.filter(
            usuario =>
                usuario.tipoUsuario ===
                "hemocentro"
        );

    hemocentros.forEach(
        hemocentro => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                hemocentro.id;

            option.textContent =
                hemocentro.nomeInstituicao;

            selectHemocentro.appendChild(
                option
            );

        }
    );
}

function agendar() {

    let data =
        document.getElementById("data").value;

    let hemocentroId =
        Number(
            document.getElementById(
                "hemocentro"
            ).value
        );

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
        !hemocentroId ||
        horario === "" ||
        sangue === ""
    ) {

        alert(
            "Preencha todos os campos!"
        );

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

    const usuarios = JSON.parse(
        localStorage.getItem(
            "usuarios"
        )
    ) || [];

    const hemocentroEncontrado =
        usuarios.find(
            usuario =>
                usuario.id ===
                hemocentroId
        );

    if (!hemocentroEncontrado) {

        alert(
            "Hemocentro não encontrado."
        );

        return;
    }

    const jaExiste = agendamentos.some(
        function (agendamento) {

            return (

                agendamento.data === data &&

                agendamento.horario === horario &&

                agendamento.hemocentroId ===
                hemocentroId

            );

        }
    );

    if (jaExiste) {

        alert(
            "Já existe um agendamento para esta data e horário."
        );

        return;
    }

    const novoAgendamento = {

        id: Date.now(),

        usuarioId:
            usuario.id,

        hemocentroId:
            hemocentroId,

        data: data,

        horario: horario,

        sangue: sangue,

        status: "pendente",

        dataSolicitacao:
            new Date()
                .toISOString()
                .split("T")[0]

    };

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
    

    document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarHemocentros();

    }
);