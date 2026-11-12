

const usuario = verificarLogin();

const formulario = document.getElementById("formLembrete");
const campoData = document.getElementById("dataLembrete");
const campoTitulo = document.getElementById("tituloLembrete");
const campoHora = document.getElementById("horaLembrete");
const listaLembretes = document.getElementById("listaLembretes");


if (!formulario || !campoData || !campoTitulo ||
    !campoHora || !listaLembretes) {

    console.error("Erro: algum elemento da agenda não foi encontrado.");

} else {

    let lembretes = JSON.parse(
        localStorage.getItem("lembretes")
    ) || [];


    function mostrarLembretes() {

        listaLembretes.innerHTML = "";

        if (lembretes.length === 0) {

            listaLembretes.innerHTML = `
                <p class="mensagem-vazia">
                    Você ainda não tem lembretes cadastrados.
                </p>
            `;

            return;
        }


        lembretes.sort(function(a, b) {

            return (a.data + a.hora).localeCompare(
                b.data + b.hora
            );

        });

        lembretes.forEach(function(lembrete, indice) {

            const item = document.createElement("div");

            item.className = "lembrete-item";

            const titulo = document.createElement("h3");
            titulo.textContent = lembrete.titulo;

            const data = document.createElement("p");
            data.innerHTML = "<strong>Data:</strong> " +
                lembrete.data.split("-").reverse().join("/");

            const hora = document.createElement("p");
            hora.innerHTML = "<strong>Horário:</strong> " +
                lembrete.hora;

            const botaoExcluir = document.createElement("button");

            botaoExcluir.className = "btn btn-outline-danger";
            botaoExcluir.textContent = "Excluir";

            botaoExcluir.addEventListener("click", function() {
                excluirLembrete(indice);
            });

            item.appendChild(titulo);
            item.appendChild(data);
            item.appendChild(hora);
            item.appendChild(botaoExcluir);

            listaLembretes.appendChild(item);

        });

    }

    
    function salvarLembretes() {

        localStorage.setItem(
            "lembretes",
            JSON.stringify(lembretes)
        );

    }

   
    formulario.addEventListener("submit", function(event) {

        event.preventDefault();

        const novoLembrete = {

            titulo: campoTitulo.value.trim(),
            data: campoData.value,
            hora: campoHora.value

        };

        if (!novoLembrete.titulo ||
            !novoLembrete.data ||
            !novoLembrete.hora) {

            alert("Preencha todos os campos!");
            return;

        }

        lembretes.push(novoLembrete);

        salvarLembretes();

        mostrarLembretes();

        formulario.reset();

        alert("Lembrete adicionado com sucesso!");

    });

   
    function excluirLembrete(indice) {

        const confirmar = confirm(
            "Deseja realmente excluir este lembrete?"
        );

        if (confirmar) {

            lembretes.splice(indice, 1);

            salvarLembretes();

            mostrarLembretes();

            alert("Lembrete excluído!");

        }

    }

    mostrarLembretes();

}