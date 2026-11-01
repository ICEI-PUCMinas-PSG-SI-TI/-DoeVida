const TESTAR_DOADOR = false;
const TESTAR_HEMOCENTRO = false;

const LIMITE_IMAGEM = 2 * 1024 * 1024;
const LIMITE_DESCRICAO = 160;

const $ = (id) => document.getElementById(id);

if (TESTAR_DOADOR && TESTAR_HEMOCENTRO) {
    throw new Error("Ative apenas um modo de teste por vez.");
}

let usuarioLogado = null;

if (TESTAR_DOADOR) {
    usuarioLogado = {
        id: -1,
        tipoUsuario: "doador",
        nome: "Doador de teste"
    };
} else if (TESTAR_HEMOCENTRO) {
    usuarioLogado = {
        id: -999999,
        tipoUsuario: "hemocentro",
        nomeInstituicao: "Hemocentro de teste"
    };
} else {
    try {
        usuarioLogado = JSON.parse(
            localStorage.getItem("usuarioLogado")
        );
    } catch {
        usuarioLogado = null;
    }
}

let campanhas = [];

try {
    campanhas = JSON.parse(
        localStorage.getItem("campanhas")
    ) || [];
} catch {
    campanhas = [];
}

let campanhaEditando = null;
let imagemSelecionada = "";

const modal = new bootstrap.Modal($("modalCampanha"));

function dataAtualLocal() {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function escaparHTML(texto = "") {
    return String(texto).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

function salvarCampanhas() {
    localStorage.setItem(
        "campanhas",
        JSON.stringify(campanhas)
    );
}

function formatarData(data) {
    if (!data) return "Não informada";

    const partes = data.split("-");

    if (partes.length !== 3) return "Não informada";

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function campanhaEncerrada(campanha) {
    if (!campanha.dataEvento) return false;

    return campanha.dataEvento < dataAtualLocal();
}

function obterTipoUsuario() {
    return String(
        usuarioLogado?.tipoUsuario || ""
    ).trim().toLowerCase();
}

function ehHemocentro() {
    return obterTipoUsuario() === "hemocentro";
}

function criarCampanhasExemplo() {
    const dataPublicacao = dataAtualLocal();

    return [
        {
            id: "exemplo-1",
            titulo: "Doe sangue, compartilhe vida",
            descricao: "Campanha de conscientização e incentivo à doação de sangue. O objetivo é reforçar os estoques e receber novos doadores de todos os tipos sanguíneos.",
            dataPublicacao,
            dataEvento: "2026-11-15",
            local: "Unidade demonstrativa - Centro, Belo Horizonte",
            tipoSanguineo: "Todos os tipos",
            imagem: "",
            hemocentroId: -2001,
            nomeInstituicao: "Hemocentro Demonstrativo Central",
            demonstrativa: true
        },
        {
            id: "exemplo-2",
            titulo: "Precisamos de doadores O-",
            descricao: "Campanha voltada à captação de doadores com sangue O negativo. Esse tipo sanguíneo possui grande importância em situações de emergência e precisa de atenção constante nos estoques.",
            dataPublicacao,
            dataEvento: "2026-11-20",
            local: "Unidade demonstrativa - Barreiro, Belo Horizonte",
            tipoSanguineo: "O-",
            imagem: "",
            hemocentroId: -2002,
            nomeInstituicao: "Hemocentro Demonstrativo Barreiro",
            demonstrativa: true
        },
        {
            id: "exemplo-3",
            titulo: "Uma atitude que salva vidas",
            descricao: "Participe de uma mobilização especial para incentivar a doação voluntária. A campanha busca ampliar os estoques de sangue e conscientizar a população sobre a importância da doação regular.",
            dataPublicacao,
            dataEvento: "2026-12-05",
            local: "Unidade demonstrativa - Pampulha, Belo Horizonte",
            tipoSanguineo: "A+",
            imagem: "",
            hemocentroId: -2003,
            nomeInstituicao: "Hemocentro Demonstrativo Pampulha",
            demonstrativa: true
        },
        {
            id: "exemplo-4",
            titulo: "Campanha pela vida: sangue AB",
            descricao: "Estamos mobilizando doadores dos tipos AB positivo e AB negativo para contribuir com a manutenção dos estoques. A participação dos doadores é importante para pacientes que precisam de transfusões.",
            dataPublicacao,
            dataEvento: "2026-12-12",
            local: "Unidade demonstrativa - Venda Nova, Belo Horizonte",
            tipoSanguineo: "AB+ e AB-",
            imagem: "",
            hemocentroId: -2004,
            nomeInstituicao: "Hemocentro Demonstrativo Venda Nova",
            demonstrativa: true
        },
        {
            id: "exemplo-5",
            titulo: "Dezembro solidário",
            descricao: "Neste período, muitas pessoas deixam de doar sangue por causa das viagens e festividades. Ajude a manter os estoques abastecidos e incentive amigos e familiares a participar.",
            dataPublicacao,
            dataEvento: "2026-12-20",
            local: "Unidade demonstrativa - Contagem, MG",
            tipoSanguineo: "Todos os tipos",
            imagem: "",
            hemocentroId: -2005,
            nomeInstituicao: "Hemocentro Demonstrativo Contagem",
            demonstrativa: true
        },
        {
            id: "exemplo-6",
            titulo: "Novo ano, novas oportunidades de salvar vidas",
            descricao: "Comece o ano com uma atitude solidária. A campanha busca novos doadores e pessoas que desejam manter a doação de sangue como um compromisso de cuidado com a vida.",
            dataPublicacao,
            dataEvento: "2027-01-15",
            local: "Unidade demonstrativa - Centro, Belo Horizonte",
            tipoSanguineo: "Todos os tipos",
            imagem: "",
            hemocentroId: -2006,
            nomeInstituicao: "Hemocentro Demonstrativo Regional",
            demonstrativa: true
        }
    ];
}

function inicializarCampanhas() {
    if (campanhas.length === 0) {
        campanhas = criarCampanhasExemplo();
        salvarCampanhas();
    }
}

function mostrarCampanhas() {
    const lista = $("listaCampanhas");

    lista.innerHTML = "";

    campanhas.sort((a, b) => {
        const encerradaA = campanhaEncerrada(a);
        const encerradaB = campanhaEncerrada(b);

        if (encerradaA !== encerradaB) {
            return encerradaA ? 1 : -1;
        }

        return encerradaA
            ? b.dataEvento.localeCompare(a.dataEvento)
            : a.dataEvento.localeCompare(b.dataEvento);
    });

    if (campanhas.length === 0) {
        lista.innerHTML = `
            <div class="col-12">
                <div class="alert alert-light border text-center p-4">
                    <h5 class="fw-bold">Nenhuma campanha cadastrada</h5>
                    <p class="text-secondary mb-0">
                        Ainda não existem campanhas disponíveis.
                    </p>
                </div>
            </div>
        `;

        return;
    }

    campanhas.forEach(campanha => {
        const encerrada = campanhaEncerrada(campanha);

        const responsavel = escaparHTML(
            campanha.nomeInstituicao || "Hemocentro não informado"
        );

        const descricao = escaparHTML(campanha.descricao || "");
        const titulo = escaparHTML(campanha.titulo || "");

        const local = escaparHTML(
            campanha.local || "Não informado"
        );

        const tipoSanguineo = escaparHTML(
            campanha.tipoSanguineo || "Não informado"
        );

        const id = escaparHTML(campanha.id);

        const imagem = campanha.imagem
            ? `
                <img
                    src="${escaparHTML(campanha.imagem)}"
                    class="card-img-top"
                    alt="Imagem da campanha"
                    style="height: 130px; object-fit: cover;">
            `
            : `
                <div
                    class="bg-danger text-white text-center d-flex flex-column justify-content-center align-items-center"
                    style="height: 130px;">

                    <span class="h4 fw-bold mb-1">DoeVida</span>

                    <p class="small mb-0">
                        Campanha de doação de sangue
                    </p>

                </div>
            `;

        const podeEditar =
            ehHemocentro() &&
            campanha.hemocentroId === usuarioLogado.id &&
            campanha.demonstrativa !== true;

        const botoes = podeEditar
            ? `
                <div class="d-flex gap-2 mt-3">

                    <button
                        class="btn btn-outline-primary btn-sm"
                        data-acao="editar"
                        data-id="${id}">
                        Editar
                    </button>

                    <button
                        class="btn btn-outline-danger btn-sm"
                        data-acao="excluir"
                        data-id="${id}">
                        Excluir
                    </button>

                </div>
            `
            : "";

        const status = encerrada
            ? `<span class="badge bg-secondary">Campanha encerrada</span>`
            : `<span class="badge bg-success">Campanha ativa</span>`;

        const exemplo = campanha.demonstrativa
            ? `<span class="badge bg-info text-dark">Exemplo demonstrativo</span>`
            : "";

        const descricaoLonga = descricao.length > LIMITE_DESCRICAO;

        const descricaoExibida = descricaoLonga
            ? descricao.substring(0, LIMITE_DESCRICAO)
            : descricao;

        const botaoExpandir = descricaoLonga
            ? `
                <button
                    type="button"
                    class="btn btn-link btn-sm p-0 text-decoration-none"
                    data-acao="expandir"
                    data-id="${id}"
                    data-expandida="false">
                    Ver mais
                </button>
            `
            : "";

        lista.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4 d-flex">

                <div class="card w-100 h-100 shadow-sm border-0" style="border-radius: 12px; overflow: hidden;">

                    ${imagem}

                    <div class="card-body d-flex flex-column p-3">

                        <div class="d-flex flex-wrap gap-2 mb-2">
                            ${status}
                            ${exemplo}
                        </div>

                        <h5
                            class="card-title fw-bold"
                            style="height: 3em; overflow: hidden;">
                            ${titulo}
                        </h5>

                        <div class="mb-2">

                            <p
                                class="card-text text-secondary mb-1"
                                id="descricao-${id}"
                                data-completa="${descricao}"
                                data-resumida="${descricaoExibida}"
                                style="height: 4.5em; overflow: hidden;">

                                ${descricaoLonga ? descricaoExibida + "..." : descricao}

                            </p>

                            ${botaoExpandir}

                        </div>

                        <hr class="my-2">

                        <div class="mb-2">

                            <span class="small text-secondary d-block mb-1">
                                Tipo sanguíneo necessário
                            </span>

                            <span class="badge bg-danger fs-6">
                                ${tipoSanguineo}
                            </span>

                        </div>

                        <div class="mb-2">

                            <span class="small text-secondary d-block mb-1">
                                Data de encerramento
                            </span>

                            <span class="fw-semibold">
                                ${formatarData(campanha.dataEvento)}
                            </span>

                        </div>

                        <div class="mb-2">

                            <span class="small text-secondary d-block mb-1">
                                Local da campanha
                            </span>

                            <span class="fw-semibold d-block" style="min-height: 2.5em;">
                                ${local}
                            </span>

                        </div>

                        <div class="mt-auto pt-2 border-top">

                            <span class="small text-secondary d-block mb-1">
                                Instituição responsável
                            </span>

                            <span class="fw-semibold d-block" style="min-height: 2.5em;">
                                ${responsavel}
                            </span>

                            ${botoes}

                        </div>

                    </div>

                </div>

            </div>
        `;
    });
}

function configurarPermissoes() {
    const areaCriarCampanha = $("areaCriarCampanha");

    areaCriarCampanha.classList.toggle(
        "d-none",
        !ehHemocentro()
    );
}

function mostrarMensagemModal(mensagem, tipo = "danger") {
    const elemento = $("mensagemModal");

    elemento.textContent = mensagem;
    elemento.className = `alert alert-${tipo}`;
}

function limparMensagemModal() {
    const elemento = $("mensagemModal");

    elemento.textContent = "";
    elemento.className = "alert d-none";
}

$("btnCriarCampanha").addEventListener("click", () => {
    if (!ehHemocentro()) return;

    campanhaEditando = null;
    imagemSelecionada = "";

    $("formCampanha").reset();

    $("tituloModalCampanha").textContent = "Criar campanha";

    $("areaPreviaImagem").classList.add("d-none");

    limparMensagemModal();

    modal.show();
});

function mostrarPrevia(imagem) {
    imagemSelecionada = imagem;

    $("previaImagem").src = imagem;

    $("areaPreviaImagem").classList.remove("d-none");
}

$("caminhoImagem").addEventListener("input", () => {
    const caminho = $("caminhoImagem").value.trim();

    $("arquivoImagem").value = "";
    imagemSelecionada = "";

    if (caminho) {
        mostrarPrevia(caminho);
    } else {
        $("areaPreviaImagem").classList.add("d-none");
    }
});

$("arquivoImagem").addEventListener("change", evento => {
    const arquivo = evento.target.files[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
        mostrarMensagemModal("Selecione um arquivo de imagem.");
        evento.target.value = "";
        return;
    }

    if (arquivo.size > LIMITE_IMAGEM) {
        mostrarMensagemModal("A imagem deve ter no máximo 2 MB.");
        evento.target.value = "";
        return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
        mostrarPrevia(leitor.result);
        $("caminhoImagem").value = "";
        limparMensagemModal();
    };

    leitor.onerror = () => {
        mostrarMensagemModal("Não foi possível carregar a imagem.");
        evento.target.value = "";
    };

    leitor.readAsDataURL(arquivo);
});

$("formCampanha").addEventListener("submit", evento => {
    evento.preventDefault();

    if (!ehHemocentro()) return;

    const titulo = $("tituloCampanha").value.trim();
    const descricao = $("descricaoCampanha").value.trim();
    const dataEvento = $("dataEvento").value;
    const local = $("localCampanha").value.trim();
    const tipoSanguineo = $("tipoSanguineo").value;

    if (!titulo || !descricao || !dataEvento || !local || !tipoSanguineo) {
        mostrarMensagemModal("Preencha todos os campos obrigatórios.");
        return;
    }

    const campanhaAnterior = campanhas.find(
        c => c.id === campanhaEditando
    );

    const campanha = {
        id: campanhaEditando || Date.now().toString(),
        titulo,
        descricao,
        dataPublicacao: campanhaAnterior
            ? campanhaAnterior.dataPublicacao
            : dataAtualLocal(),
        dataEvento,
        local,
        tipoSanguineo,
        imagem: imagemSelecionada,
        hemocentroId: usuarioLogado.id,
        nomeInstituicao: usuarioLogado.nomeInstituicao,
        demonstrativa: false
    };

    if (campanhaEditando) {
        campanhas = campanhas.map(c =>
            c.id === campanhaEditando ? campanha : c
        );
    } else {
        campanhas.push(campanha);
    }

    salvarCampanhas();
    mostrarCampanhas();

    modal.hide();
});

function editarCampanha(id) {
    if (!ehHemocentro()) return;

    const campanha = campanhas.find(c => c.id === id);

    if (
        !campanha ||
        campanha.hemocentroId !== usuarioLogado.id ||
        campanha.demonstrativa === true
    ) {
        return;
    }

    campanhaEditando = id;
    imagemSelecionada = campanha.imagem || "";

    $("tituloModalCampanha").textContent = "Editar campanha";

    $("tituloCampanha").value = campanha.titulo;
    $("descricaoCampanha").value = campanha.descricao;
    $("dataEvento").value = campanha.dataEvento;
    $("localCampanha").value = campanha.local || "";
    $("tipoSanguineo").value = campanha.tipoSanguineo || "";

    $("caminhoImagem").value =
        campanha.imagem && !campanha.imagem.startsWith("data:")
            ? campanha.imagem
            : "";

    $("arquivoImagem").value = "";

    limparMensagemModal();

    if (imagemSelecionada) {
        mostrarPrevia(imagemSelecionada);
    } else {
        $("areaPreviaImagem").classList.add("d-none");
    }

    modal.show();
}

function excluirCampanha(id) {
    if (!ehHemocentro()) return;

    const campanha = campanhas.find(c => c.id === id);

    if (
        !campanha ||
        campanha.hemocentroId !== usuarioLogado.id ||
        campanha.demonstrativa === true
    ) {
        return;
    }

    if (!confirm("Tem certeza de que deseja excluir esta campanha?")) {
        return;
    }

    campanhas = campanhas.filter(c => c.id !== id);

    salvarCampanhas();
    mostrarCampanhas();
}

$("listaCampanhas").addEventListener("click", evento => {
    const botao = evento.target.closest("button[data-acao]");

    if (!botao) return;

    const id = botao.dataset.id;

    if (botao.dataset.acao === "editar") {
        editarCampanha(id);
    }

    if (botao.dataset.acao === "excluir") {
        excluirCampanha(id);
    }

    if (botao.dataset.acao === "expandir") {
        const descricao = $(`descricao-${id}`);

        if (!descricao) return;

        const expandida = botao.dataset.expandida === "true";

        if (expandida) {
            descricao.textContent = descricao.dataset.resumida + "...";
            descricao.style.height = "4.5em";
            descricao.style.overflow = "hidden";

            botao.textContent = "Ver mais";
            botao.dataset.expandida = "false";
        } else {
            descricao.textContent = descricao.dataset.completa;
            descricao.style.height = "auto";
            descricao.style.overflow = "visible";

            botao.textContent = "Ver menos";
            botao.dataset.expandida = "true";
        }
    }
});

inicializarCampanhas();
configurarPermissoes();
mostrarCampanhas();
