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

    listaProximosAgendamentos.innerHTML =
        "";

    if (
        agendamentos.length === 0
    ) {

        listaProximosAgendamentos.innerHTML = `
            <p class="mensagem-vazia">
                Nenhum agendamento encontrado.
            </p>
        `;

        return;
    }

    agendamentos.sort(
        function (a, b) {

            return (
                a.data + a.hora
            ).localeCompare(
                b.data + b.hora
            );
        }
    );

    agendamentos.forEach(
    function (agendamento, indice) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "lembrete-item";

            item.innerHTML = `
    <h3>Doação de Sangue</h3>

    <p>
        <strong>Data:</strong>
        ${agendamento.data
            .split("-")
            .reverse()
            .join("/")}
    </p>

    <p>
        <strong>Horário:</strong>
        ${agendamento.hora}
    </p>

    <p>
        <strong>Hemocentro:</strong>
        ${agendamento.hemocentro}
    </p>

    <p>
        <strong>Tipo Sanguíneo:</strong>
        ${agendamento.sangue}
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
            indice
        );

    }
);

item.appendChild(
    botaoExcluir
);


            listaProximosAgendamentos
                .appendChild(item);
        }
    );
}

formulario.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const novoLembrete = {

            titulo:
                campoTitulo.value.trim(),

            data:
                campoData.value,

            hora:
                campoHora.value

        };

        if (
            !novoLembrete.titulo ||
            !novoLembrete.data ||
            !novoLembrete.hora
        ) {

            alert(
                "Preencha todos os campos!"
            );

            return;
        }

        lembretes.push(
            novoLembrete
        );

        salvarLembretes();

        mostrarLembretes();

        formulario.reset();

        alert(
            "Lembrete adicionado com sucesso!"
        );
    }
);

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

function excluirAgendamento(indice) {

    const confirmar = confirm(
        "Deseja realmente cancelar este agendamento?"
    );

    if (confirmar) {

        let agendamentos = JSON.parse(
            localStorage.getItem(
                "agendamentos"
            )
        ) || [];

        agendamentos.splice(
            indice,
            1
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
}

mostrarLembretes();
mostrarAgendamentos();

