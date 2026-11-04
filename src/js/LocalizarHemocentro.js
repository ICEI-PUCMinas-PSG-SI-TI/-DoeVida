document.addEventListener("DOMContentLoaded", () => {

    const mapa = L.map("mapaHemocentros").setView(
        [-19.9167, -43.9345],
        11
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap Contributors"
        }
    ).addTo(mapa);

    // Hemocentro de Belo Horizonte

    L.marker(
        [-19.9255, -43.9540]
    )
    .addTo(mapa)
    .bindPopup(
        "<strong>Hemocentro de Belo Horizonte</strong>"
    );

    // Shopping Estação BH

    L.marker(
        [-19.8204994, -43.9469909]
    )
    .addTo(mapa)
    .bindPopup(
        "<strong>Unidade de Coleta e Transfusão</strong><br>Shopping Estação BH"
    );

    // Hospital Júlia Kubitschek

    L.marker(
        [-19.991200, -43.999353]
    )
    .addTo(mapa)
    .bindPopup(
        "<strong>Unidade de Coleta</strong><br>Hospital Júlia Kubitschek"
    );

    //Banco de Sangue - Hospital Felício Rocho
    L.marker(
        [-19.9230828, -43.9570999]
    )
    .addTo(mapa)
    .bindPopup(
        "<strong>Unidade de Coleta</strong><br>Hospital Júlia Kubitschek"
    );
    
    setTimeout(() => {
        mapa.invalidateSize();
    }, 100);

});


const hemocentros = [

    {
        nome: "Hemocentro de Belo Horizonte",
        endereco: "Rua Alameda Ezequiel Dias, 321, Santa Efigênia",
        latitude: -19.9255,
        longitude: -43.9540
    },

    {
        nome: "Unidade de Coleta e Transfusão - Shopping Estação BH",
        endereco: "Av. Cristiano Machado, 11833, Venda Nova",
        latitude: -19.8204994,
        longitude: -43.9469909
    },

    {
        nome: "Unidade de Coleta - Hospital Júlia Kubitschek",
        endereco: "Av. Dr. Cristiano Rezende, 2505",
        latitude: -19.991200,
        longitude: -43.999353
    },

    {
        nome: "Banco de Sangue - Hospital Felício Rocho",
        endereco: "Rua Juiz de Fora, 941, Barro Preto",
        latitude: -19.9230828,
        longitude: -43.9570999
    }

 

];


function calcularDistancia(
    lat1,
    lon1,
    lat2,
    lon2
){

    const raioTerra = 6371;

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return raioTerra * c;

}


async function buscarEndereco(){

    const endereco =
        document.getElementById(
            "inputEndereco"
        ).value;

    const url =
        `https://nominatim.openstreetmap.org/search?format=json&q=${endereco}`;

    const resposta =
        await fetch(url);

    const dados =
        await resposta.json();

    if(dados.length === 0){

        alert(
            "Endereço não encontrado."
        );

        return null;

    }

    return {

        latitude:
            Number(dados[0].lat),

        longitude:
            Number(dados[0].lon)

    };

}

function renderizarHemocentros(lista){

    const container =
        document.getElementById(
            "listaHemocentros"
        );

    container.innerHTML = "";

    lista.forEach(hemocentro => {

        container.innerHTML += `

        <div class="card-hemocentro">

            <div>

                <h3>
                    ${hemocentro.nome}
                </h3>

                <p>
                    ${hemocentro.endereco}
                </p>

            </div>

            <div class="acoes-hemocentro">

                <div class="distancia">

                    ${hemocentro.distancia.toFixed(1)} km

                </div>

                <button
                    class="btn btn-danger">

                    Ver no mapa

                </button>

            </div>

        </div>

        `;

    });

}

async function pesquisarHemocentros(){

    const usuario =
        await buscarEndereco();

    if(!usuario){
        return;
    }

    hemocentros.forEach(
        hemocentro => {

            hemocentro.distancia =
                calcularDistancia(

                    usuario.latitude,
                    usuario.longitude,

                    hemocentro.latitude,
                    hemocentro.longitude

                );

        }
    );

    const filtro =
        document.getElementById(
            "filtroHemocentro"
        ).value;

    let resultado =
        [...hemocentros];

    if(filtro === "proximo"){

        resultado.sort(
            (a, b) =>
            a.distancia - b.distancia
        );

        resultado =
            resultado.slice(0, 3);

    }

    else if(
        filtro === "distante"
    ){

        resultado.sort(
            (a, b) =>
            b.distancia - a.distancia
        );

        resultado =
            resultado.slice(0, 3);

    }

    renderizarHemocentros(
        resultado
    );

}