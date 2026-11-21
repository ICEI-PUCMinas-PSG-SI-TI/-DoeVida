const usuario = JSON.parse(
    localStorage.getItem(
        "usuarioLogado"
    )
);

if (
    !usuario ||
    usuario.tipoUsuario !== "hemocentro"
) {

    window.location.href =
        "Login.html";
}