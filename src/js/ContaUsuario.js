
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

        localStorage.removeItem(
            "usuarioLogado"
        );

    }

    return usuario;

}

const usuario = verificarLogin();


function obterUsuarioAtualizado() {

    const usuarioLogado = JSON.parse(
        localStorage.getItem(
            "usuarioLogado"
        )
    );

    const usuarios = JSON.parse(
        localStorage.getItem(
            "usuarios"
        )
    ) || [];

    return usuarios.find(
        usuario =>
            usuario.id === usuarioLogado.id
    ) || usuarioLogado;
}

function carregarDadosUsuario() {

    const usuarioAtual =
        obterUsuarioAtualizado();

    const nomeExibicao =
        usuarioAtual.tipoUsuario === "hemocentro"
            ? usuarioAtual.nomeInstituicao
            : usuarioAtual.nome;

    document.getElementById(
        "bem-vindo-usuario"
    ).textContent =
        "Olá, " + nomeExibicao + "!";

    document.getElementById(
        "nomeUsuario"
    ).textContent =
        nomeExibicao;

    document.getElementById(
        "emailUsuario"
    ).textContent =
        usuarioAtual.email;

    document.getElementById(
        "telefoneUsuario"
    ).textContent =
        usuarioAtual.telefone;

    if (
        usuarioAtual.tipoUsuario !==
        "hemocentro"
    ) {

        document.getElementById(
            "cpfUsuario"
        ).textContent =
            usuarioAtual.cpf;

        document.getElementById(
            "dataNascimentoUsuario"
        ).textContent =
            usuarioAtual.dataNascimento;

        document.getElementById(
            "tipoSanguineoUsuario"
        ).textContent =
            "🩸 " +
            usuarioAtual.tipoSanguineo;

        document.getElementById(
            "tipoSanguineoDoacao"
        ).textContent =
            usuarioAtual.tipoSanguineo;
    }

    if (
        usuarioAtual.fotoPerfil
    ) {

        document.getElementById(
            "fotoPerfilUsuario"
        ).src =
            usuarioAtual.fotoPerfil;
    }

    if (
        usuarioAtual.tipoUsuario ===
        "hemocentro"
    ) {

        configurarTelaHemocentro(
            usuarioAtual
        );
    }
}

function configurarTelaHemocentro(usuarioAtual) {

    document.getElementById(
        "badgeTipoUsuario"
    ).textContent =
        "Hemocentro";

    document.getElementById(
        "badgeTipoUsuario"
    ).className =
        "badge bg-primary";

    document.getElementById(
        "tipoSanguineoUsuario"
    ).style.display =
        "none";

    document.getElementById(
        "tituloCardInfo"
    ).textContent =
        "Informações do Hemocentro";

    document.getElementById(
        "cpfUsuario"
    ).textContent =
        usuarioAtual.cnpj;

    document.querySelector(
        "#cpfUsuario"
    ).previousElementSibling.textContent =
        "CNPJ";

    document.getElementById(
        "dataNascimentoUsuario"
    ).textContent =
        usuarioAtual.dataCadastro;

    document.querySelector(
        "#dataNascimentoUsuario"
    ).previousElementSibling.textContent =
        "Data de cadastro";

    document.getElementById(
        "conteudoCardInfo"
    ).innerHTML = `
    
        <div class="info-item">
            <i class="fa-solid fa-building"></i>

            <div>
                <p class="titulo-info">
                    Instituição
                </p>

                <p class="valor-info">
                    ${usuarioAtual.nomeInstituicao}
                </p>
            </div>
        </div>

        <hr>

        <div class="info-item">
            <i class="fa-solid fa-location-dot"></i>

            <div>
                <p class="titulo-info">
                    Endereço
                </p>

                <p class="valor-info">
                    ${usuarioAtual.rua},
                    ${usuarioAtual.numero}
                    -
                    ${usuarioAtual.bairro}
                </p>

                <p class="valor-info">
                    ${usuarioAtual.cidade} -
                    ${usuarioAtual.estado}
                </p>
            </div>
        </div>

        <hr>

        <div class="info-item">
            <i class="fa-solid fa-map-pin"></i>

            <div>
                <p class="titulo-info">
                    CEP
                </p>

                <p class="valor-info">
                    ${usuarioAtual.cep}
                </p>
            </div>
        </div>

        <hr>

        <div class="info-item">
            <i class="fa-solid fa-phone"></i>

            <div>
                <p class="titulo-info">
                    Telefone
                </p>

                <p class="valor-info">
                    ${usuarioAtual.telefone}
                </p>
            </div>
        </div>
    `;
}

function preencherFormulario() {

    const usuarioAtual =
        obterUsuarioAtualizado();

    document.getElementById(
        "inputNome"
    ).value =
        usuarioAtual.nome;

    document.getElementById(
        "inputEmail"
    ).value =
        usuarioAtual.email;

    document.getElementById(
        "inputTelefone"
    ).value =
        usuarioAtual.telefone;

    document.getElementById(
        "inputNascimento"
    ).value =
        usuarioAtual.dataNascimento;
}

function salvarPerfil() {

    usuario.nome =
        document.getElementById("inputNome").value;

    usuario.email =
        document.getElementById("inputEmail").value;

    usuario.telefone =
        document.getElementById("inputTelefone").value;

    usuario.dataNascimento =
        document.getElementById("inputNascimento").value;


    localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuario)
    );

    carregarDadosUsuario();

    const modalElement =
        document.getElementById("modalEditarPerfil");

    const modal =
        bootstrap.Modal.getInstance(modalElement);

    modal.hide();

    let usuarios = JSON.parse(
        localStorage.getItem(
            "usuarios"
        )
    ) || [];

    usuarios = usuarios.map(
        usuarioLista => {

            if (
                usuarioLista.id ===
                usuario.id
            ) {

                return usuario;
            }

            return usuarioLista;
        }
    );

    localStorage.setItem(
        "usuarios",
        JSON.stringify(
            usuarios
        )
    );

}

document.addEventListener("DOMContentLoaded", () => {

    carregarDadosUsuario();

    const modalEditarPerfil =
        document.getElementById("modalEditarPerfil");

    modalEditarPerfil.addEventListener(
        "show.bs.modal",
        preencherFormulario
    );

    document
        .getElementById("btnSalvarPerfil")
        .addEventListener(
            "click",
            salvarPerfil
        );

});

function validarSenha() {

    let senhaDigitada = document.getElementById("inputSenhaAtual").value;


    if (senhaDigitada === usuario.senha) {
        return true;
    }

    else {
        return false;
    }

}

function confirmarSenha() {
    let novaSenha = document.getElementById("inputNovaSenha").value;
    let senhaConfirmada = document.getElementById("inputConfirmarSenha").value;

    if (novaSenha === senhaConfirmada) {
        return true;
    }

    else {
        return false;
    }

}

function limparCamposSenha() {

    document.getElementById("inputSenhaAtual").value = "";
    document.getElementById("inputNovaSenha").value = "";
    document.getElementById("inputConfirmarSenha").value = "";

}

function salvarSenha() {

    if (!validarSenha()) {

        alert("Senha atual incorreta.");
        return;

    }

    if (!confirmarSenha()) {

        alert("As senhas não coincidem.");
        return;

    }

    usuario.senha =
        document.getElementById("inputNovaSenha").value;

    localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuario)
    );

    let usuarios = JSON.parse(
        localStorage.getItem(
            "usuarios"
        )
    ) || [];

    usuarios = usuarios.map(
        usuarioLista => {

            if (
                usuarioLista.id ===
                usuario.id
            ) {

                return usuario;
            }

            return usuarioLista;
        }
    );

    localStorage.setItem(
        "usuarios",
        JSON.stringify(
            usuarios
        )
    );

    limparCamposSenha();
    const modalElement =
        document.getElementById("modalAlterarSenha");

    const modal =
        bootstrap.Modal.getInstance(modalElement);

    modal.hide();

    alert("Senha alterada com sucesso!");

}


document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("btnSalvarSenha")
        .addEventListener(
            "click",
            salvarSenha
        );

});

function validarSenhaExclusao() {
    let senhaDigitada = document.getElementById("inputSenha").value;


    if (senhaDigitada === usuario.senha) {
        return true;
    }

    else {
        return false;
    }

}

function excluirConta() {

    if (!validarSenhaExclusao()) {
        alert("Senha incorreta.");
        return;
    }

  localStorage.removeItem(
    "usuarioLogado");

    const modalElement =
        document.getElementById("modalExcluirConta");

    const modal =
        bootstrap.Modal.getInstance(modalElement);

    modal.hide();

    alert("Conta excluída com sucesso.");

    window.location.href = "index.html";

}

document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("btnExcluirConta")
        .addEventListener(
            "click",
            excluirConta
        );

});