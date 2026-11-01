const TESTAR_DOADOR = true;
const TESTAR_HEMOCENTRO = false;

const LIMITE_IMAGEM = 2 * 1024 * 1024;

const $ = (id) => document.getElementById(id);

let usuarioLogado = null;

if (TESTAR_DOADOR && TESTAR_HEMOCENTRO) {
    throw new Error("Ative apenas um modo de teste por vez.");
}

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
    usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );
}

let campanhas = JSON.parse(
    localStorage.getItem("campanhas")
) || [];

let campanhaEditando = null;
let imagemSelecionada = "";

const modal = new bootstrap.Modal($("modalCampanha"));

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
    if (!data) return "";

    return new Date(data + "T00:00:00")
        .toLocaleDateString("pt-BR");
}

function campanhaEncerrada(campanha) {
    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    const encerramento = new Date(
        campanha.dataEvento + "T00:00:00"
    );

    return encerramento < hoje;
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

    campanhas.forEach(campanha => {

        const encerrada = campanhaEncerrada(campanha);

        const responsavel = escaparHTML(
            campanha.nomeInstituicao || "Hemocentro"
        );

        const imagem = campanha.imagem
            ? `<img src="${escaparHTML(campanha.imagem)}"
                    class="card-img-top"
                    alt="Imagem da campanha"
                    style="height: 200px; object-fit: cover;">`
            : "";

        // Verifica se o usuário é o hemocentro responsável
        const podeEditar =
            usuarioLogado?.tipoUsuario === "hemocentro" &&
            campanha.hemocentroId === usuarioLogado.id;

        const botoes = podeEditar
            ? `
                <div class="d-flex gap-2 mt-3">

                    <button class="btn btn-outline-primary btn-sm"
                            onclick="editarCampanha('${campanha.id}')">
                        Editar
                    </button>

                    <button class="btn btn-outline-danger btn-sm"
                            onclick="excluirCampanha('${campanha.id}')">
                        Excluir
                    </button>

                </div>
            `
            : "";

        lista.innerHTML += `
            <div class="col-md-6 col-lg-4">

                <div class="card h-100 shadow-sm">

                    ${imagem}

                    <div class="card-body d-flex flex-column">

                        <h5 class="card-title">
                            ${escaparHTML(campanha.titulo)}
                        </h5>

                        <p class="card-text">
                            ${escaparHTML(campanha.descricao)}
                        </p>

                        <p class="mb-1">
                            <strong>Data do evento:</strong>
                            ${formatarData(campanha.dataEvento)}
                        </p>

                        <p class="mb-1">
                            <strong>Local:</strong>
                            ${escaparHTML(campanha.local || "Não informado")}
                        </p>

                        <p class="mb-1">
                            <strong>Tipo sanguíneo necessário:</strong>
                            ${escaparHTML(campanha.tipoSanguineo || "Não informado")}
                        </p>

                        ${encerrada
                            ? '<span class="text-secondary small">Campanha encerrada</span>'
                            : ''
                        }

                        <button class="btn btn-link p-0 text-start mt-2"
                                data-bs-toggle="collapse"
                                data-bs-target="#detalhes${escaparHTML(campanha.id)}">
                            Ver detalhes
                        </button>

                        <div class="collapse mt-2"
                             id="detalhes${escaparHTML(campanha.id)}">

                            <p class="small mb-1">
                                <strong>Publicada em:</strong>
                                ${formatarData(campanha.dataPublicacao)}
                            </p>

                            <p class="small mb-0">
                                <strong>Responsável:</strong>
                                ${responsavel}
                            </p>

                        </div>

                        ${botoes}

                    </div>

                </div>

            </div>
        `;
    });
}

function configurarPermissoes() {

    if (!usuarioLogado) {
        $("areaCriarCampanha").style.display = "none";
        return;
    }

    if (usuarioLogado.tipoUsuario === "hemocentro") {
        $("areaCriarCampanha").style.display = "block";
    } else {
        $("areaCriarCampanha").style.display = "none";
    }
}

$("btnCriarCampanha").addEventListener("click", () => {

    if (usuarioLogado?.tipoUsuario !== "hemocentro") {
        return;
    }

    campanhaEditando = null;
    imagemSelecionada = "";

    $("formCampanha").reset();

    $("tituloModalCampanha").textContent = "Criar campanha";

    $("mensagemModal").textContent = "";
    $("mensagemModal").classList.add("d-none");

    $("areaPreviaImagem").style.display = "none";

    modal.show();
});

function mostrarPrevia(imagem) {

    imagemSelecionada = imagem;

    $("previaImagem").src = imagem;

    $("areaPreviaImagem").style.display = "block";
}

$("caminhoImagem").addEventListener("input", () => {

    const caminho = $("caminhoImagem").value.trim();

    $("arquivoImagem").value = "";

    imagemSelecionada = "";

    if (caminho) {
        mostrarPrevia(caminho);
    } else {
        $("areaPreviaImagem").style.display = "none";
    }
});

$("arquivoImagem").addEventListener("change", evento => {

    const arquivo = evento.target.files[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {

        $("mensagemModal").textContent =
            "Selecione um arquivo de imagem.";

        $("mensagemModal").classList.remove("d-none");

        evento.target.value = "";

        return;
    }

    if (arquivo.size > LIMITE_IMAGEM) {

        $("mensagemModal").textContent =
            "A imagem deve ter no máximo 2 MB.";

        $("mensagemModal").classList.remove("d-none");

        evento.target.value = "";

        return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {

        mostrarPrevia(leitor.result);

        $("caminhoImagem").value = "";

        $("mensagemModal").textContent = "";

        $("mensagemModal").classList.add("d-none");
    };

    leitor.readAsDataURL(arquivo);
});

$("formCampanha").addEventListener("submit", evento => {

    evento.preventDefault();

    if (usuarioLogado?.tipoUsuario !== "hemocentro") {
        return;
    }

    const titulo = $("tituloCampanha").value.trim();

    const descricao = $("descricaoCampanha").value.trim();

    const dataEvento = $("dataEvento").value;

    const local = $("localCampanha").value.trim();

    const tipoSanguineo = $("tipoSanguineo").value;

    if (!titulo || !descricao || !dataEvento || !local || !tipoSanguineo) {

        $("mensagemModal").textContent =
            "Preencha todos os campos obrigatórios.";

        $("mensagemModal").classList.remove("d-none");

        return;
    }

    if (!usuarioLogado) {

        $("mensagemModal").textContent =
            "Não foi possível identificar o usuário logado.";

        $("mensagemModal").classList.remove("d-none");

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
            : new Date().toISOString().split("T")[0],

        dataEvento,

        local,

        tipoSanguineo,

        imagem: imagemSelecionada,

        hemocentroId: usuarioLogado.id,

        nomeInstituicao: usuarioLogado.nomeInstituicao
    };

    if (campanhaEditando) {

        campanhas = campanhas.map(c =>
            c.id === campanhaEditando ? campanha : c
        );

        $("mensagemPagina").textContent =
            "Campanha atualizada com sucesso.";

    } else {

        campanhas.push(campanha);

        $("mensagemPagina").textContent = "";
    }

    salvarCampanhas();

    mostrarCampanhas();

    modal.hide();
});

function editarCampanha(id) {

    if (usuarioLogado?.tipoUsuario !== "hemocentro") {
        return;
    }

    const campanha = campanhas.find(c => c.id === id);

    if (!campanha || campanha.hemocentroId !== usuarioLogado.id) {
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

    $("mensagemModal").textContent = "";

    $("mensagemModal").classList.add("d-none");

    if (imagemSelecionada) {
        mostrarPrevia(imagemSelecionada);
    } else {
        $("areaPreviaImagem").style.display = "none";
    }

    modal.show();
}

function excluirCampanha(id) {

    if (usuarioLogado?.tipoUsuario !== "hemocentro") {
        return;
    }

    const campanha = campanhas.find(c => c.id === id);

    if (!campanha || campanha.hemocentroId !== usuarioLogado.id) {
        return;
    }

    if (!confirm("Tem certeza de que deseja excluir esta campanha?")) {
        return;
    }

    campanhas = campanhas.filter(c => c.id !== id);

    salvarCampanhas();

    mostrarCampanhas();
}

configurarPermissoes();

mostrarCampanhas();
