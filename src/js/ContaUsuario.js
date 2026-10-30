
let usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuario) {

    usuario = {
        id: 1,
        tipoUsuario: "doador",
        nome: "Maria Clara",
        email: "xxxxx@email.com",
        senha: "123456",
        cpf: "00000000000",
        telefone: "31999999999",
        dataNascimento: "2000-05-15",
        tipoSanguineo: "A+",
        dataCadastro: "2026-10-01",
        fotoPerfil: "../imgs/Foto-Perfil.png"
    };

    localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuario)
    );
}



function carregarDadosUsuario() {

    document.getElementById("bem-vindo-usuario").textContent = 
        "Olá, " + usuario.nome + "!";

    document.getElementById("nomeUsuario").textContent =
        usuario.nome;

    document.getElementById("emailUsuario").textContent =
        usuario.email;

    document.getElementById("telefoneUsuario").textContent =
        usuario.telefone;

    document.getElementById("cpfUsuario").textContent =
        usuario.cpf;

    document.getElementById("dataNascimentoUsuario").textContent =
        usuario.dataNascimento;

  

}

function preencherFormulario() {

    document.getElementById("inputNome").value =
        usuario.nome;

    document.getElementById("inputEmail").value =
        usuario.email;

    document.getElementById("inputTelefone").value =
        usuario.telefone;

    document.getElementById("inputNascimento").value =
        usuario.dataNascimento;

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

function validarSenha (){

    let senhaDigitada = document.getElementById("inputSenhaAtual").value;

    
    if (senhaDigitada === usuario.senha){
        return true;
    }
      
    else{
        return false;
    }
        
}

function confirmarSenha (){
    let novaSenha = document.getElementById("inputNovaSenha").value;
    let senhaConfirmada = document.getElementById("inputConfirmarSenha").value;

    if (novaSenha === senhaConfirmada){
        return true;
    }

    else{
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

function validarSenhaExclusao (){
      let senhaDigitada = document.getElementById("inputSenha").value;

    
    if (senhaDigitada === usuario.senha){
        return true;
    }
      
    else{
        return false;
    }
        
}

function excluirConta(){

    if (!validarSenhaExclusao()){
        alert("Senha incorreta.");
        return;
    }

        localStorage.removeItem("usuarioLogado")
        usuario = null;

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