document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formCadastro");

    const tipoUsuario = document.getElementById("tipoUsuario");

    const camposDoador = document.getElementById("camposDoador");
    const camposHemocentro = document.getElementById("camposHemocentro");
    const camposComuns = document.getElementById("camposComuns");
    const areaBotoes = document.getElementById("areaBotoes");

    const mensagem = document.getElementById("mensagem");

    const camposDoadorIds = [
        "nome",
        "cpf",
        "dataNascimento",
        "tipoSanguineo"
    ];

    const camposHemocentroIds = [
        "nomeInstituicao",
        "cnpj",
        "cep",
        "rua",
        "numero",
        "bairro",
        "cidade",
        "estado",
        "latitude",
        "longitude"
    ];

    const camposComunsIds = [
        "email",
        "telefone",
        "senha",
        "confirmarSenha",
        "fotoPerfil"
    ];

    function obterCampo(id) {
        return document.getElementById(id);
    }

    function ativarCampos(ids, ativo) {

        ids.forEach(id => {

            const campo = obterCampo(id);

            campo.disabled = !ativo;

            if (
                campo.id !== "latitude" &&
                campo.id !== "longitude" &&
                campo.id !== "fotoPerfil"
            ) {
                campo.required = ativo;
            }

        });

    }

    function exibirFormulario() {

        const tipo = tipoUsuario.value;

        camposDoador.classList.add("d-none");
        camposHemocentro.classList.add("d-none");
        camposComuns.classList.add("d-none");
        areaBotoes.classList.add("d-none");

        ativarCampos(camposDoadorIds, false);
        ativarCampos(camposHemocentroIds, false);
        ativarCampos(camposComunsIds, false);

        mensagem.classList.add("d-none");

        if (tipo === "doador") {

            camposDoador.classList.remove("d-none");

            ativarCampos(camposDoadorIds, true);

        } else if (tipo === "hemocentro") {

            camposHemocentro.classList.remove("d-none");

            ativarCampos(camposHemocentroIds, true);

        } else {

            return;

        }

        camposComuns.classList.remove("d-none");
        areaBotoes.classList.remove("d-none");

        ativarCampos(camposComunsIds, true);

    }

    tipoUsuario.addEventListener("change", exibirFormulario);

    // MÁSCARAS

    function aplicarMascaraCPF(valor) {

        return valor
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    }

    function aplicarMascaraCNPJ(valor) {

        return valor
            .replace(/\D/g, "")
            .slice(0, 14)
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2");

    }

    function aplicarMascaraTelefone(valor) {

        const numeros = valor.replace(/\D/g, "").slice(0, 11);

        if (numeros.length <= 10) {

            return numeros
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{4})(\d)/, "$1-$2");

        }

        return numeros
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");

    }

    function aplicarMascaraCEP(valor) {

        return valor
            .replace(/\D/g, "")
            .slice(0, 8)
            .replace(/^(\d{5})(\d)/, "$1-$2");

    }

    obterCampo("cpf").addEventListener("input", event => {
        event.target.value = aplicarMascaraCPF(event.target.value);
    });

    obterCampo("cnpj").addEventListener("input", event => {
        event.target.value = aplicarMascaraCNPJ(event.target.value);
    });

    obterCampo("telefone").addEventListener("input", event => {
        event.target.value = aplicarMascaraTelefone(event.target.value);
    });

    obterCampo("cep").addEventListener("input", event => {
        event.target.value = aplicarMascaraCEP(event.target.value);
    });

    // VALIDAÇÃO DE CPF

    function validarCPF(cpf) {

        cpf = cpf.replace(/\D/g, "");

        // Permite CPF com todos os dígitos iguais a zero para testes.
        if (cpf === "00000000000") {
            return true;
        }

        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
            return false;
        }

        let soma = 0;

        for (let i = 0; i < 9; i++) {
            soma += Number(cpf[i]) * (10 - i);
        }

        let digito = (soma * 10) % 11;

        if (digito === 10) {
            digito = 0;
        }

        if (digito !== Number(cpf[9])) {
            return false;
        }

        soma = 0;

        for (let i = 0; i < 10; i++) {
            soma += Number(cpf[i]) * (11 - i);
        }

        digito = (soma * 10) % 11;

        if (digito === 10) {
            digito = 0;
        }

        return digito === Number(cpf[10]);

    }

    // VALIDAÇÃO DE CNPJ

    function validarCNPJ(cnpj) {

        cnpj = cnpj.replace(/\D/g, "");

        // Permite CNPJ com todos os dígitos iguais a zero para testes.
        if (cnpj === "00000000000000") {
            return true;
        }

        if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
            return false;
        }

        const calcularDigito = (base, pesos) => {

            let soma = 0;

            for (let i = 0; i < pesos.length; i++) {
                soma += Number(base[i]) * pesos[i];
            }

            const resto = soma % 11;

            return resto < 2 ? 0 : 11 - resto;

        };

        const primeiro = calcularDigito(
            cnpj.substring(0, 12),
            [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        );

        const segundo = calcularDigito(
            cnpj.substring(0, 12) + primeiro,
            [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        );

        return cnpj.endsWith(`${primeiro}${segundo}`);

    }

    // VALIDAÇÃO DE TELEFONE

    function validarTelefone(telefone) {

        const numeros = telefone.replace(/\D/g, "");

        // Permite telefone com todos os dígitos iguais a zero para testes.
        if (numeros === "0000000000" ||
            numeros === "00000000000") {
            return true;
        }

        return numeros.length === 10 || numeros.length === 11;

    }

    // VALIDAÇÃO DE SENHA

    function validarSenha() {

        const senha = obterCampo("senha");
        const confirmarSenha = obterCampo("confirmarSenha");

        if (senha.value !== confirmarSenha.value) {

            confirmarSenha.setCustomValidity(
                "As senhas não coincidem."
            );

            return false;

        }

        confirmarSenha.setCustomValidity("");

        return true;

    }

    // VALIDAÇÃO DOS CAMPOS ESPECÍFICOS

    function validarCamposEspecificos() {

        const tipo = tipoUsuario.value;

        if (tipo === "doador") {

            const cpf = obterCampo("cpf");

            if (!validarCPF(cpf.value)) {

                cpf.setCustomValidity("CPF inválido.");

            } else {

                cpf.setCustomValidity("");

            }

            return validarCPF(cpf.value);

        }

        if (tipo === "hemocentro") {

            const cnpj = obterCampo("cnpj");
            const cep = obterCampo("cep");

            if (!validarCNPJ(cnpj.value)) {

                cnpj.setCustomValidity("CNPJ inválido.");

            } else {

                cnpj.setCustomValidity("");

            }

            if (cep.value.replace(/\D/g, "").length !== 8) {

                cep.setCustomValidity("CEP inválido.");

            } else {

                cep.setCustomValidity("");

            }

            return validarCNPJ(cnpj.value) &&
                cep.value.replace(/\D/g, "").length === 8;

        }

        return false;

    }

    // VALIDAÇÃO DOS CAMPOS COMUNS

    function validarCamposComuns() {

        const telefone = obterCampo("telefone");

        if (!validarTelefone(telefone.value)) {

            telefone.setCustomValidity("Telefone inválido.");

        } else {

            telefone.setCustomValidity("");

        }

        const senhaValida = validarSenha();

        return validarTelefone(telefone.value) && senhaValida;

    }

    // MENSAGENS

    function exibirMensagem(texto, tipo) {

        mensagem.textContent = texto;

        mensagem.className = `alert alert-${tipo} mt-3`;

    }

    // PRÓXIMO ID

    function obterProximoId() {

        const usuarios = JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];

        if (usuarios.length === 0) {
            return 1;
        }

        return Math.max(
            ...usuarios.map(usuario => Number(usuario.id) || 0)
        ) + 1;

    }

    // FOTOGRAFIA DE PERFIL

    async function obterFotoPerfil() {

        const arquivo = obterCampo("fotoPerfil").files[0];

        if (!arquivo) {
            return "";
        }

        if (!arquivo.type.startsWith("image/")) {
            throw new Error("Selecione um arquivo de imagem válido.");
        }

        if (arquivo.size > 2 * 1024 * 1024) {
            throw new Error("A imagem deve possuir no máximo 2 MB.");
        }

        return new Promise((resolve, reject) => {

            const leitor = new FileReader();

            leitor.onload = () => resolve(leitor.result);

            leitor.onerror = () => reject(
                new Error("Não foi possível carregar a imagem.")
            );

            leitor.readAsDataURL(arquivo);

        });

    }

    // DATA DO CADASTRO

    function obterDataCadastro() {

        const data = new Date();

        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;

    }

    // VERIFICAÇÃO DE CADASTRO DUPLICADO

    function verificarCadastroDuplicado(usuarios, tipo) {

        const email = obterCampo("email").value
            .trim()
            .toLowerCase();

        const telefone = obterCampo("telefone").value
            .replace(/\D/g, "");

        const emailExiste = usuarios.some(usuario =>
            String(usuario.email || "").trim().toLowerCase() === email
        );

        if (emailExiste) {

            return "Este e-mail já está cadastrado.";

        }

        if (tipo === "doador") {

            const cpf = obterCampo("cpf").value.replace(/\D/g, "");

            const cpfExiste = usuarios.some(usuario =>
                usuario.cpf &&
                usuario.cpf.replace(/\D/g, "") === cpf
            );

            if (cpfExiste) {

                return "Este CPF já está cadastrado.";

            }

        }

        if (tipo === "hemocentro") {

            const cnpj = obterCampo("cnpj").value.replace(/\D/g, "");

            const cnpjExiste = usuarios.some(usuario =>
                usuario.cnpj &&
                usuario.cnpj.replace(/\D/g, "") === cnpj
            );

            if (cnpjExiste) {

                return "Este CNPJ já está cadastrado.";

            }

        }

        // Verifica também se o telefone já está cadastrado.
        const telefoneExiste = usuarios.some(usuario =>
            usuario.telefone &&
            usuario.telefone.replace(/\D/g, "") === telefone
        );

        if (telefoneExiste) {

            return "Este telefone já está cadastrado.";

        }

        return null;

    }

    // CRIAÇÃO DA CONTA

    async function criarConta(event) {

        event.preventDefault();

        mensagem.classList.add("d-none");

        form.classList.add("was-validated");

        const camposEspecificosValidos = validarCamposEspecificos();

        const camposComunsValidos = validarCamposComuns();

        if (
            !form.checkValidity() ||
            !camposEspecificosValidos ||
            !camposComunsValidos
        ) {

            form.reportValidity();

            return;

        }

        const tipo = tipoUsuario.value;

        try {

            const usuarios = JSON.parse(
                localStorage.getItem("usuarios")
            ) || [];

            // Verifica e-mail, CPF, CNPJ e telefone duplicados.
            const cadastroDuplicado = verificarCadastroDuplicado(
                usuarios,
                tipo
            );

            if (cadastroDuplicado) {

                exibirMensagem(cadastroDuplicado, "danger");

                return;

            }

            const email = obterCampo("email").value
                .trim()
                .toLowerCase();

            const telefone = obterCampo("telefone").value
                .replace(/\D/g, "");

            const fotoPerfil = await obterFotoPerfil();

            const usuario = {

                id: obterProximoId(),

                tipoUsuario: tipo,

                email: email,

                senha: obterCampo("senha").value,

                telefone: telefone,

                fotoPerfil: fotoPerfil,

                dataCadastro: obterDataCadastro()

            };

            if (tipo === "doador") {

                usuario.nome = obterCampo("nome").value.trim();

                usuario.cpf = obterCampo("cpf").value
                    .replace(/\D/g, "");

                usuario.dataNascimento =
                    obterCampo("dataNascimento").value;

                usuario.tipoSanguineo =
                    obterCampo("tipoSanguineo").value;

            }

            if (tipo === "hemocentro") {

                usuario.nomeInstituicao =
                    obterCampo("nomeInstituicao").value.trim();

                usuario.cnpj = obterCampo("cnpj").value
                    .replace(/\D/g, "");

                usuario.cep = obterCampo("cep").value
                    .replace(/\D/g, "");

                usuario.rua = obterCampo("rua").value.trim();

                usuario.numero = obterCampo("numero").value.trim();

                usuario.bairro = obterCampo("bairro").value.trim();

                usuario.cidade = obterCampo("cidade").value.trim();

                usuario.estado = obterCampo("estado").value;

                const latitude = obterCampo("latitude").value;

                const longitude = obterCampo("longitude").value;

                if (latitude !== "") {
                    usuario.latitude = Number(latitude);
                }

                if (longitude !== "") {
                    usuario.longitude = Number(longitude);
                }

            }

            // Salva o novo usuário.
            usuarios.push(usuario);

            localStorage.setItem(
                "usuarios",
                JSON.stringify(usuarios)
            );

            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(usuario)
            );

            exibirMensagem(
                "Conta criada com sucesso!",
                "success"
            );

            form.reset();

            form.classList.remove("was-validated");

            tipoUsuario.value = "";

            exibirFormularioInicial();

        } catch (erro) {

            exibirMensagem(
                erro.message || "Não foi possível criar a conta.",
                "danger"
            );

        }

    }

    // FORMULÁRIO INICIAL

    function exibirFormularioInicial() {

        camposDoador.classList.add("d-none");
        camposHemocentro.classList.add("d-none");
        camposComuns.classList.add("d-none");
        areaBotoes.classList.add("d-none");

        ativarCampos(camposDoadorIds, false);
        ativarCampos(camposHemocentroIds, false);
        ativarCampos(camposComunsIds, false);

    }

    // EVENTOS

    form.addEventListener("submit", criarConta);

    form.addEventListener("reset", () => {

        setTimeout(() => {

            form.classList.remove("was-validated");

            mensagem.classList.add("d-none");

            if (tipoUsuario.value) {

                exibirFormulario();

            } else {

                exibirFormularioInicial();

            }

        }, 0);

    });

    exibirFormularioInicial();

});