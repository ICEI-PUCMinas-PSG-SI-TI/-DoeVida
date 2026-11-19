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

const usuario = verificarLogin();

const formulario =
    document.getElementById(
        "formLembrete"
    );

const campoData =
    document.getElementById(
        "dataLembrete"
    );

const campoTitulo =
    document.getElementById(
        "tituloLembrete"
    );

const campoHora =
    document.getElementById(
        "horaLembrete"
    );

const listaLembretes =
    document.getElementById(
        "listaLembretes"
    );

const listaProximosAgendamentos =
    document.getElementById(
        "listaProximosAgendamentos"
    );

let lembretes = JSON.parse(
    localStorage.getItem(
        "lembretes"
    )
) || [];

function salvarLembretes() {

    localStorage.setItem(
        "lembretes",
        JSON.stringify(
            lembretes
        )
    );
}

function mostrarLembretes() {

    listaLembretes.innerHTML = "";

    if (lembretes.length === 0) {

        listaLembretes.innerHTML = `
            <p class="mensagem-vazia">
                Você ainda não tem lembretes cadastrados.
            </p>
        `;

        return;
    }

    lembretes.forEach(
        function (lembrete, indice) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "lembrete-item";

            item.innerHTML = `
                <h3>${lembrete.titulo}</h3>

                <p>
                    <strong>Data:</strong>
                    ${lembrete.data
                        .split("-")
                        .reverse()
                        .join("/")}
                </p>

                <p>
                    <strong>Horário:</strong>
                    ${lembrete.hora}
                </p>
            `;

            const botaoExcluir =
                document.createElement(
                    "button"
                );

            botaoExcluir.className =
                "btn btn-outline-danger";

            botaoExcluir.textContent =
                "Excluir";

            botaoExcluir.addEventListener(
                "click",
                function () {

                    excluirLembrete(
                        indice
                    );

                }
            );

            item.appendChild(
                botaoExcluir
            );

            listaLembretes.appendChild(
                item
            );
        }
    );
}

function mostrarAgendamentos() {

    const agendamentos = JSON.parse(
        localStorage.getItem(
            "agendamentos"
        )
    ) || [];

    const usuarios = JSON.parse(
        localStorage.getItem(
            "usuarios"
        )
    ) || [];

    listaProximosAgendamentos.innerHTML =
        "";

    const meusAgendamentos =
        agendamentos.filter(
            agendamento =>
                agendamento.usuarioId ===
                usuario.id
        );

    if (
        meusAgendamentos.length === 0
    ) {

        listaProximosAgendamentos.innerHTML = `
            <p class="mensagem-vazia">
                Nenhum agendamento encontrado.
            </p>
        `;

        return;
    }

    meusAgendamentos.sort(
        function (a, b) {

            return (
                a.data +
                a.horario
            ).localeCompare(
                b.data +
                b.horario
            );

        }
    );

    meusAgendamentos.forEach(
        function (
            agendamento
        ) {

            const hemocentro =
                usuarios.find(
                    usuario =>
                        usuario.id ===
                        agendamento.hemocentroId
                );

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "lembrete-item";

            let statusTexto =
                "";

            if (
                agendamento.status ===
                "pendente"
            ) {

                statusTexto =
                    "⏳ Pendente";

            }

            else if (
                agendamento.status ===
                "confirmado"
            ) {

                statusTexto =
                    "✅ Confirmado";

            }

            else if (
                agendamento.status ===
                "recusado"
            ) {

                statusTexto =
                    "❌ Recusado";

            }

            item.innerHTML = `
            
                <h3>
                    Doação de Sangue
                </h3>

                <p>
                    <strong>Data:</strong>
                    ${agendamento.data
                        .split("-")
                        .reverse()
                        .join("/")}
                </p>

                <p>
                    <strong>Horário:</strong>
                    ${agendamento.horario}
                </p>

                <p>
                    <strong>Hemocentro:</strong>
                    ${hemocentro
                        ? hemocentro.nomeInstituicao
                        : "Não encontrado"}
                </p>

                <p>
                    <strong>Tipo Sanguíneo:</strong>
                    ${agendamento.sangue}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${statusTexto}
                </p>

            `;

                     const botaoExcluir =
                document.createElement(
                    "button"
                );

            botaoExcluir.className =
                "btn btn-outline-danger";

            botaoExcluir.textContent =
                "Cancelar Agendamento";

            botaoExcluir.addEventListener(
                "click",
                function () {

                    excluirAgendamento(
                        agendamento.id
                    );

                }
            );

            item.appendChild(
                botaoExcluir
            );

            listaProximosAgendamentos
                .appendChild(
                    item
                );

        }
    );
}

function excluirLembrete(
    indice
) {

    const confirmar = confirm(
        "Deseja realmente excluir este lembrete?"
    );

    if (confirmar) {

        lembretes.splice(
            indice,
            1
        );

        salvarLembretes();

        mostrarLembretes();

        alert(
            "Lembrete excluído!"
        );
    }
}

function excluirAgendamento(
    idAgendamento
) {

    const confirmar = confirm(
        "Deseja realmente cancelar este agendamento?"
    );

    if (!confirmar) {
        return;
    }

    let agendamentos = JSON.parse(
        localStorage.getItem(
            "agendamentos"
        )
    ) || [];

    agendamentos =
        agendamentos.filter(
            agendamento =>
                agendamento.id !==
                idAgendamento
        );

    localStorage.setItem(
        "agendamentos",
        JSON.stringify(
            agendamentos
        )
    );

    mostrarAgendamentos();

    alert(
        "Agendamento cancelado!"
    );
}

mostrarLembretes();
mostrarAgendamentos();

