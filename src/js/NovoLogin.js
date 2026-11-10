const tipoUsuario = document.getElementById("tipoUsuario");
const campoCPF = document.getElementById("exampleMenuFormCPF");
const campoCNPJ = document.getElementById("exampleMenuFormCNPJ");
const campoSenha = document.getElementById("exampleMenuFormPassword1");
const formulario = document.getElementById("formLogin");

if (!tipoUsuario || !campoCPF || !campoCNPJ || !campoSenha || !formulario) {
    console.error("Erro: algum elemento do Login não foi encontrado no HTML.");
} else {

    campoCPF.style.display = "none";
    campoCNPJ.style.display = "none";

    tipoUsuario.addEventListener("change", function() {

        campoCPF.style.display = "none";
        campoCNPJ.style.display = "none";

        if (tipoUsuario.value === "doador") {
            campoCPF.style.display = "block";
        }

        else if (tipoUsuario.value === "hemocentro") {
            campoCNPJ.style.display = "block";
        }

    });

    formulario.addEventListener("submit", function(event) {

        event.preventDefault();

        if (tipoUsuario.value === "") {
            alert("Selecione o tipo de usuário!");
        }

        else if (tipoUsuario.value === "doador" && campoCPF.value.trim() === "") {
            alert("Digite seu CPF!");
        }

        else if (tipoUsuario.value === "hemocentro" && campoCNPJ.value.trim() === "") {
            alert("Digite seu CNPJ!");
        }

        else if (campoSenha.value.trim() === "") {
            alert("Digite sua senha!");
        }

        else {
            alert("Dados preenchidos! Login pronto para ser conectado ao sistema.");
        }

    });
}

const usuarios = JSON.parse(
    localStorage.getItem("usuarios")
) || [];

localStorage.setItem(
    "usuarioLogado",
    JSON.stringify(usuarioEncontrado)
);

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