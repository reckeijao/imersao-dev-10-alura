let cardContainer = document.querySelector("main")
let dados = [];
let campoBusca = document.querySelector("header input");


async function iniciarBusca() {
    //se os dados ainda não foram carregados, busca do JSON
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            return;
        }
    }

    const termoBusca = campoBusca.value.toLowerCase();
    const dadosFiltrados = dados.filter(dado =>
        dado.nome.toLowerCase().includes(termoBusca) ||
        dado.descricao.toLowerCase().includes(termoBusca) ||
        dado.tags.some(tag => tag.toLowerCase().includes(termoBusca))
    );

    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = "";
    for (let dado of dados) {
        let article = document.createElement("article");
        article.innerHTML = `
            <h2>${dado.nome}</h2>
            <p><strong>Criação:</strong> ${dado.data_criacao}</p>
            <p>${dado.descricao}</p>
            <a href="${dado.link}" target="_blank">Acessar Recurso</a>
        `;

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'tags-container';

        dado.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag-button';
            tagElement.textContent = tag;
            tagElement.addEventListener('click', (event) => {
                event.stopPropagation(); // Impede que o clique se propague para o card
                campoBusca.value = tag;
                iniciarBusca();
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola a página para o topo
            });
            tagsContainer.appendChild(tagElement);
        });

        article.appendChild(tagsContainer);
        cardContainer.appendChild(article);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Função para aplicar o tema
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.checked = false;
        }
    };

    // Verifica se há um tema salvo no localStorage
    if (currentTheme) {
        applyTheme(currentTheme);
    } else {
        // Se não houver, verifica a preferência do sistema operacional
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Adiciona o evento de clique no botão
    themeToggle.addEventListener('change', () => {
        let theme;
        if (themeToggle.checked) {
            document.body.classList.add('dark-mode');
            theme = 'dark';
        } else {
            document.body.classList.remove('dark-mode');
            theme = 'light';
        }
        // Salva a preferência do usuário no localStorage
        localStorage.setItem('theme', theme);
    });
});