const API_URL = "http://127.0.0.1:5000/produtos";
const tabela = document.querySelector("#tabela tbody");
const form = document.querySelector("#form-produto");

const idCampo = document.querySelector("#produto-id");
const nomeCampo = document.querySelector("#nome");
const precoCampo = document.querySelector("#preco");
const descricaoCampo = document.querySelector("#descricao");
const imagemCampo = document.querySelector("#imagem");

// Carregar produtos
async function carregar() {
    const res = await fetch(API_URL);
    const produtos = await res.json();
    tabela.innerHTML = produtos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nome}</td>
            <td>R$ ${p.preco.toFixed(2)}</td>
            <td>${p.descricao}</td>
            <td>${p.imagem ? `<img src="${p.imagem}" alt="${p.nome}">` : ''}</td>
            <td>
                <button class="action edit" onclick="editar(${p.id}, '${p.nome}', ${p.preco}, '${p.descricao}', '${p.imagem}')">Editar</button>
                <button class="action delete" onclick="excluir(${p.id})">Excluir</button>
            </td>
        </tr>
    `).join("");
}

// Salvar ou atualizar produto
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const produto = {
        nome: nomeCampo.value,
        preco: parseFloat(precoCampo.value),
        descricao: descricaoCampo.value,
        imagem: imagemCampo.value
    };

    if (idCampo.value) {
        await fetch(`${API_URL}/${idCampo.value}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });
    } else {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });
    }

    form.reset();
    idCampo.value = "";
    carregar();
});

// Excluir produto
async function excluir(id) {
    if (confirm("Deseja realmente excluir este produto?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        carregar();
    }
}

// Editar produto
function editar(id, nome, preco, descricao, imagem) {
    idCampo.value = id;
    nomeCampo.value = nome;
    precoCampo.value = preco;
    descricaoCampo.value = descricao;
    imagemCampo.value = imagem;
}

// Carregar produtos ao abrir
carregar();
