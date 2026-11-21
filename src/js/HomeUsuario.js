const usuario = JSON.parse(
    localStorage.getItem(
        "usuarioLogado"
    )
);

if (
    !usuario ||
    usuario.tipoUsuario !== "doador"
) {

    window.location.href =
        "Login.html";
}