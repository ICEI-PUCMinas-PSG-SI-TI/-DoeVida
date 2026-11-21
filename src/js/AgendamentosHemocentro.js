const MODO_TESTE = true;

const usuarioTeste = {
    id: 2,
    tipoUsuario: "hemocentro",
    nomeInstituicao: "Hemominas Belo Horizonte"
};

const usuariosTeste = [
    { id: 1, nome: "Maria Clara", tipoSanguineo: "A+" },
    { id: 4, nome: "João Pedro", tipoSanguineo: "O-" },
    { id: 5, nome: "Ana Souza", tipoSanguineo: "B+" }
];

const agendamentosTeste = [
    { id: 1, usuarioId: 1, hemocentroId: 2, data: "2026-12-10", horario: "09:00", status: "pendente", dataSolicitacao: "2026-11-20" },
    { id: 2, usuarioId: 4, hemocentroId: 2, data: "2026-11-25", horario: "14:30", status: "confirmado", dataSolicitacao: "2026-11-15" },
    { id: 3, usuarioId: 5, hemocentroId: 2, data: "2026-12-02", horario: "10:00", status: "recusado", dataSolicitacao: "2026-11-18" },
    { id: 4, usuarioId: 1, hemocentroId: 2, data: "2026-10-30", horario: "08:30", status: "confirmado", dataSolicitacao: "2026-10-19" }
];

const usuarioLogado = MODO_TESTE
    ? usuarioTeste
    : JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado || usuarioLogado.tipoUsuario !== "hemocentro") {
    window.location.href = "/src/pages/Login.html";
}

const usuarios = MODO_TESTE
    ? usuariosTeste
    : JSON.parse(localStorage.getItem("usuarios")) || [];

const todosAgendamentos = MODO_TESTE
    ? agendamentosTeste
    : JSON.parse(localStorage.getItem("agendamentos")) || [];

const agendamentos = todosAgendamentos.filter(a => a.hemocentroId === usuarioLogado?.id);

const ultimo = document.getElementById("ultimo");
const lista = document.getElementById("lista");
const secaoLista = document.getElementById("secaoLista");
const btnLista = document.getElementById("btnLista");

const cores = {
    pendente: "warning",
    confirmado: "success",
    recusado: "danger"
};

function formatarData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

function criarCard(agendamento) {
    const doador = usuarios.find(u => u.id === agendamento.usuarioId);
    const cor = cores[agendamento.status] || "secondary";

    const card = document.createElement("div");
    card.className = "card border-0 shadow-sm h-100";

    const corpo = document.createElement("div");
    corpo.className = "card-body";

    const linhas = [
        ["Nome", doador ? doador.nome : "Não encontrado"],
        ["Tipo sanguíneo", doador ? doador.tipoSanguineo : "-"],
        ["Data", formatarData(agendamento.data)],
        ["Horário", agendamento.horario]
    ];

    linhas.forEach(([titulo, valor]) => {
        const p = document.createElement("p");
        p.className = "mb-2";
        p.innerHTML = `<strong>${titulo}:</strong> `;
        p.append(valor);
        corpo.append(p);
    });

    const status = document.createElement("p");
    status.className = "mb-0";
    status.innerHTML = `<strong>Status:</strong> <span class="badge text-bg-${cor}">${agendamento.status}</span>`;
    corpo.append(status);

    card.append(corpo);
    return card;
}

function mostrarUltimo() {
    if (agendamentos.length === 0) {
        ultimo.innerHTML = `<div class="alert alert-secondary">Nenhum agendamento encontrado.</div>`;
        return;
    }

    const maisRecente = [...agendamentos].sort((a, b) =>
        b.dataSolicitacao.localeCompare(a.dataSolicitacao) || b.id - a.id
    )[0];

    const coluna = document.createElement("div");
    coluna.className = "col-12 col-md-6 col-lg-4 px-0";
    coluna.append(criarCard(maisRecente));

    ultimo.innerHTML = "";
    ultimo.append(coluna);
}

function ordenarPorData(itens) {
    const hoje = new Date().toISOString().slice(0, 10);

    const proximos = itens
        .filter(a => a.data >= hoje)
        .sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));

    const passados = itens
        .filter(a => a.data < hoje)
        .sort((a, b) => (b.data + b.horario).localeCompare(a.data + a.horario));

    return [...proximos, ...passados];
}

function mostrarLista() {
    const filtro = document.querySelector('input[name="filtro"]:checked').value;
    const filtrados = agendamentos.filter(a => filtro === "todos" || a.status === filtro);

    lista.innerHTML = "";

    if (filtrados.length === 0) {
        lista.innerHTML = `<div class="alert alert-secondary">Nenhum agendamento para este filtro.</div>`;
        return;
    }

    ordenarPorData(filtrados).forEach(agendamento => {
        const coluna = document.createElement("div");
        coluna.className = "col-10 col-sm-6 col-lg-4 col-xl-3";
        coluna.append(criarCard(agendamento));
        lista.append(coluna);
    });
}

btnLista.addEventListener("click", () => {
    const oculta = secaoLista.classList.toggle("d-none");
    btnLista.textContent = oculta ? "Ver todos os agendamentos" : "Ocultar agendamentos";
    mostrarLista();
});

document.querySelectorAll('input[name="filtro"]').forEach(radio => {
    radio.addEventListener("change", mostrarLista);
});

mostrarUltimo();
