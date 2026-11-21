const MODO_TESTE = true;

const usuarioTeste = {
    id: 1,
    tipoUsuario: "doador",
    nome: "Maria Clara"
};

const usuarioLogado = MODO_TESTE
    ? usuarioTeste
    : JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado || usuarioLogado.tipoUsuario !== "doador") {
    window.location.href = "/src/pages/Login.html";
}

const formulario = document.getElementById("formAptidao");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", event => {
    event.preventDefault();

    const idade = Number(document.getElementById("idade").value);
    const peso = Number(document.getElementById("peso").value);
    const motivos = [];

    if (idade < 16) {
        motivos.push("A idade mínima para doar é 16 anos.");
    }

    if (peso < 50) {
        motivos.push("O peso mínimo para doar é 50 kg.");
    }

    document.querySelectorAll(".impedimento:checked").forEach(item => {
        const texto = document.querySelector(`label[for="${item.id}"]`).textContent;
        motivos.push(`Marcado: ${texto.toLowerCase()}.`);
    });

    if (motivos.length === 0) {
        resultado.innerHTML = `
            <div class="alert alert-success mb-0">
                Você aparenta estar apto a doar! A confirmação final é feita na triagem.
            </div>`;
        return;
    }

    resultado.innerHTML = `
        <div class="alert alert-danger mb-0">
            Você não está apto a doar no momento:
            <ul class="mb-0">${motivos.map(m => `<li>${m}</li>`).join("")}</ul>
        </div>`;
});
