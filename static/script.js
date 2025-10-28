const API_URL = "http://127.0.0.1:5000/produtos";
const tabela = document.querySelector("#tabela tbody");
const form = document.querySelector("#form-produto");
const pesquisaInput = document.querySelector("#pesquisa");

const idCampo = document.querySelector("#produto-id");
const nomeCampo = document.querySelector("#nome");
const precoCampo = document.querySelector("#preco");
const descricaoCampo = document.querySelector("#descricao");
const imagemCampo = document.querySelector("#imagem");

// --- Carregar produtos (com filtro opcional) ---
async function carregar(filtro = "") {
    try {
        const res = await fetch(`${API_URL}?q=${encodeURIComponent(filtro)}`);
        const produtos = await res.json();

        tabela.innerHTML = produtos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>R$ ${p.preco.toFixed(2)}</td>
                <td>${p.descricao}</td>
                <td>
                    ${p.imagem 
                        ? `<img src="${p.imagem.startsWith('http') ? p.imagem : '/static' + p.imagem}" alt="${p.nome}" style="max-width:60px; border-radius:5px;">`
                        : ''}
                </td>
                <td>
                    <button class="action edit" 
                        onclick="editar(${p.id}, '${p.nome}', ${p.preco}, '${p.descricao}', '${encodeURIComponent(p.imagem || '')}')">
                        Editar
                    </button>
                    <button class="action delete" onclick="excluir(${p.id})">Excluir</button>
                </td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

// --- Atualiza a lista enquanto digita na pesquisa ---
pesquisaInput.addEventListener("input", () => {
    carregar(pesquisaInput.value);
});

// --- Salvar ou atualizar produto ---
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const produto = {
        nome: nomeCampo.value,
        preco: parseFloat(precoCampo.value),
        descricao: descricaoCampo.value,
        imagem: imagemCampo.value
    };

    try {
        if (idCampo.value) {
            // Atualizar produto existente
            await fetch(`${API_URL}/${idCampo.value}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(produto)
            });
        } else {
            // Adicionar novo produto
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(produto)
            });
        }

        form.reset();
        idCampo.value = "";
        carregar(pesquisaInput.value); // mantém filtro após salvar

    } catch (error) {
        console.error("Erro ao salvar produto:", error);
    }
});

// --- Excluir produto ---
async function excluir(id) {
    if (confirm("Deseja realmente excluir este produto?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            carregar(pesquisaInput.value);
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
        }
    }
}

// --- Editar produto ---
function editar(id, nome, preco, descricao, imagem) {
    idCampo.value = id;
    nomeCampo.value = nome;
    precoCampo.value = preco;
    descricaoCampo.value = descricao;
    imagemCampo.value = decodeURIComponent(imagem);
}

// --- Carregar produtos ao abrir ---
carregar();
