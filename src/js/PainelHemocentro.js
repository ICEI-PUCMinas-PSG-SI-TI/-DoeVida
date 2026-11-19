function verificarLogin() {

    const usuario = JSON.parse(
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

const usuario =
    verificarLogin();

function carregarPainel() {

    const agendamentos =
        JSON.parse(
            localStorage.getItem(
                "agendamentos"
            )
        ) || [];

    const usuarios =
        JSON.parse(
            localStorage.getItem(
                "usuarios"
            )
        ) || [];

    const hoje =
        new Date()
            .toISOString()
            .split("T")[0];

    const pendentes =
        agendamentos.filter(
            agendamento =>

                agendamento.hemocentroId === usuario.id &&

                agendamento.status ===
                "pendente"
        );

    const confirmados =
        agendamentos.filter(
            agendamento =>

                agendamento.hemocentroId === usuario.id &&

                agendamento.status ===
                "confirmado"
        );

    const hojeConfirmados =
        confirmados.filter(
            agendamento =>
                agendamento.data ===
                hoje
        );

    const CAPACIDADE_DIARIA = 20;

    const vagasDisponiveis =
        CAPACIDADE_DIARIA -
        hojeConfirmados.length;

    document.getElementById(
        "totalPendentes"
    ).textContent =
        pendentes.length;

    document.getElementById(
        "totalConfirmados"
    ).textContent =
        confirmados.length;

    document.getElementById(
        "totalHoje"
    ).textContent =
        hojeConfirmados.length;

    document.getElementById(
        "totalVagas"
    ).textContent =
        vagasDisponiveis;

    carregarSolicitacoes(
        pendentes,
        usuarios
    );
}

function carregarSolicitacoes(
    pendentes,
    usuarios
) {

    const lista =
        document.getElementById(
            "listaSolicitacoes"
        );

    lista.innerHTML = "";

    pendentes.forEach(
        agendamento => {

            const doador =
                usuarios.find(
                    usuario =>
                        usuario.id ===
                        agendamento.usuarioId
                );

            const card =
                document.createElement(
                    "div"
                );

            card.classList.add(
                "solicitacao"
            );

            card.innerHTML = `
            
                <div class="usuario">

                    <i class="fa-solid fa-user"></i>

                    <div>

                        <h5>
                            ${doador?.nome || "Doador"}
                        </h5>

                        <span>
                            ${doador?.tipoSanguineo || ""}
                        </span>

                    </div>

                </div>

                <div class="agendamento">

                    <span>
                        ${agendamento.data}
                    </span>

                    <span>
                        ${agendamento.horario}
                    </span>

                </div>

                <div class="acoes">

                    <button
                        class="btn-aprovar"
                        onclick="aprovarAgendamento(${agendamento.id})"
                    >
                        Aprovar
                    </button>

                    <button
                        class="btn-recusar"
                        onclick="recusarAgendamento(${agendamento.id})"
                    >
                        Recusar
                    </button>

                </div>

            `;

            lista.appendChild(
                card
            );

        }
    );
}

document.addEventListener(
    "DOMContentLoaded",
    carregarPainel
);

function aprovarAgendamento(idAgendamento) {

    let agendamentos = JSON.parse(
        localStorage.getItem(
            "agendamentos"
        )
    ) || [];

    agendamentos = agendamentos.map(
        agendamento => {

            if (
                agendamento.id ===
                idAgendamento
            ) {

                agendamento.status =
                    "confirmado";
            }

            return agendamento;
        }
    );

    localStorage.setItem(
        "agendamentos",
        JSON.stringify(
            agendamentos
        )
    );

    carregarPainel();
}

function recusarAgendamento(idAgendamento) {

    let agendamentos = JSON.parse(
        localStorage.getItem(
            "agendamentos"
        )
    ) || [];

    agendamentos = agendamentos.map(
        agendamento => {

            if (
                agendamento.id ===
                idAgendamento
            ) {

                agendamento.status =
                    "recusado";
            }

            return agendamento;
        }
    );

    localStorage.setItem(
        "agendamentos",
        JSON.stringify(
            agendamentos
        )
    );

    carregarPainel();
}