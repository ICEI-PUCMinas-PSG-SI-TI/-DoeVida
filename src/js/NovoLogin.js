const tipoUsuario = document.getElementById("tipoUsuario");
const campoCPF = document.getElementById("exampleMenuFormCPF");
const campoCNPJ = document.getElementById("exampleMenuFormCNPJ");
const campoSenha = document.getElementById("exampleMenuFormPassword1");
const formulario = document.getElementById("formLogin");

if (!tipoUsuario || !campoCPF || !campoCNPJ || !campoSenha || !formulario) {

    console.error(
        "Erro: algum elemento do Login não foi encontrado no HTML."
    );

} else {

    campoCPF.style.display = "none";
    campoCNPJ.style.display = "none";

    tipoUsuario.addEventListener("change", function () {

        campoCPF.style.display = "none";
        campoCNPJ.style.display = "none";

        if (tipoUsuario.value === "doador") {

            campoCPF.style.display = "block";

        } else if (tipoUsuario.value === "hemocentro") {

            campoCNPJ.style.display = "block";
        }
    });

    formulario.addEventListener("submit", function (event) {

        event.preventDefault();

        if (tipoUsuario.value === "") {

            alert("Selecione o tipo de usuário!");
            return;
        }

        if (
            tipoUsuario.value === "doador" &&
            campoCPF.value.trim() === ""
        ) {

            alert("Digite seu CPF!");
            return;
        }

        if (
            tipoUsuario.value === "hemocentro" &&
            campoCNPJ.value.trim() === ""
        ) {

            alert("Digite seu CNPJ!");
            return;
        }

        if (campoSenha.value.trim() === "") {

            alert("Digite sua senha!");
            return;
        }

        const usuarios = JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];

        let usuarioEncontrado = null;

       if (tipoUsuario.value === "doador") {

    usuarioEncontrado = usuarios.find(
        usuario =>
            usuario.cpf ===
            campoCPF.value.replace(/\D/g, "") &&
            usuario.senha === campoSenha.value.trim()
    );

}
else if (tipoUsuario.value === "hemocentro") {

    usuarioEncontrado = usuarios.find(
        usuario =>
            usuario.cnpj ===
            campoCNPJ.value.replace(/\D/g, "") &&
            usuario.senha === campoSenha.value.trim()
    );

}
console.log("Tipo:", tipoUsuario.value);

console.log("CPF digitado:",
    campoCPF.value.replace(/\D/g, "")
);

console.log("Senha digitada:",
    campoSenha.value.trim()
);

console.log("Usuarios:");
console.log(usuarios);

        if (usuarioEncontrado) {

            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(usuarioEncontrado)
            );

            alert("Login realizado com sucesso!");

            if (
                usuarioEncontrado.tipoUsuario ===
                "hemocentro"
                ) {

            window.location.href =
            "HomeHemocentro.html";

        } 
        
    else {

    window.location.href =
        "HomeUsuario.html";
    }


        }
        else {

            alert("CPF/CNPJ ou senha inválidos!");
        }
    });
}