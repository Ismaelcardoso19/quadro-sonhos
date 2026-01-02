// Lógica de programacao

// Saber quem são os elementos da tela
//Quando o botão for clicado, executar uma ação


// ===========================================
// 1. SELECIONANDO ELEMENTOS DO HTML
// ===========================================

const formulario = document.getElementById('dream-form');
const inputImagem = document.getElementById('image-url');
const inputTitulo = document.getElementById('dream-title');
const gridSonhos = document.getElementById('dreams-grid');
const estadoVazio = document.getElementById('empty-state');

// ===========================================
// 2. CRIAR O CARD DO SONHO (HTML)
// ===========================================

function criarCardSonho(sonho) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
    <div class="card-imagem">
      <img src="${sonho.urlImagem}" alt="${sonho.titulo}">
      <button class="btn-remover" onclick="removerSonho('${sonho.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="card-conteudo">
      <h3>${sonho.titulo}</h3>
      <button class="btn-status ${sonho.status}" onclick="alternarStatus('${sonho.id}')">
        ${sonho.status}
      </button>
    </div>
  `;

    return card;
}

// ===========================================
// 3. RENDERIZAR SONHOS NA TELA
// ===========================================

function renderizarSonhos() {
    const sonhos = carregarSonhos();

    gridSonhos.innerHTML = '';

    if (sonhos.length === 0) {
        estadoVazio.classList.remove('hidden');
        gridSonhos.classList.add('hidden');
    } else {
        estadoVazio.classList.add('hidden');
        gridSonhos.classList.remove('hidden');

        sonhos.forEach(sonho => {
            const card = criarCardSonho(sonho);
            gridSonhos.appendChild(card);
        });
    }
}

// ===========================================
// 4. EVENTO DO FORMULÁRIO (ADICIONAR)
// ===========================================

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const urlImagem = inputImagem.value.trim();
    const titulo = inputTitulo.value.trim();

    if (urlImagem && titulo) {
        adicionarSonho(urlImagem, titulo);
        inputImagem.value = '';
        inputTitulo.value = '';
        inputImagem.focus();
    }
});

// ===========================================
// 5. ADICIONAR NOVO SONHO
// ===========================================

function adicionarSonho(urlImagem, titulo) {
    const sonhos = carregarSonhos();

    const novoSonho = {
        id: crypto.randomUUID(),
        titulo: titulo,
        urlImagem: urlImagem,
        status: 'sonho',
    };

    sonhos.push(novoSonho);
    salvarSonhos(sonhos);
    renderizarSonhos();
}

// ===========================================
// 6. REMOVER SONHO
// ===========================================

function removerSonho(id) {
    if (!confirm('Voçê deseja remover este sonho?')) return;

    let sonhos = carregarSonhos();
    sonhos = sonhos.filter(sonho => sonho.id !== id);
    salvarSonhos(sonhos);
    renderizarSonhos();
}

// ===========================================
// 7. ALTERNAR STATUS DO SONHO
// ===========================================

function alternarStatus(id) {
    const sonhos = carregarSonhos();
    const sonho = sonhos.find(s => s.id === id);

    if (sonho) {
        if (sonho.status === 'sonho') {
            sonho.status = 'progresso';
        } else if (sonho.status === 'progresso') {
            sonho.status = 'conquistado';
        } else {
            sonho.status = 'sonho';
        }

        salvarSonhos(sonhos);
        renderizarSonhos();
    }
}

// ===========================================
// 8. SALVAR NO LOCALSTORAGE
// ===========================================

const CHAVE_STORAGE = 'meus-sonhos';

function salvarSonhos(sonhos) {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(sonhos));
}

function carregarSonhos() {
    const dados = localStorage.getItem(CHAVE_STORAGE);
    if (!dados) return [];
    return JSON.parse(dados);
}

// ===========================================
// 9. INICIALIZAÇÃO
// ===========================================

// Função para atualizar sugestões de URL baseadas no título
function atualizarSugestoesURL() {
    const query = inputTitulo.value.trim();
    const datalist = document.getElementById('url-options');

    if (query) {
        datalist.innerHTML = '';
        for (let i = 1; i <= 1; i++) {
            const option = document.createElement('option');
        }
    } else {
        // Sugestões padrão quando vazio
        datalist.innerHTML = `
            <option value="https://s2-autoesporte.glbimg.com/X2kZHqx22gc2utSxaDKqMRcTN6w=/0x0:1920x1280/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2025/w/O/6GCYKkT52pQVpyq3Su4Q/volkswagen-jetta-gli-.jpg">Carro dos Sonhos</option>
            <option value="https://tse2.mm.bing.net/th/id/OIP.od3GEzE1JE8wyd7WuLnyKgHaE8?pid=Api&P=0&h=180">Viagem para Paris</option>
            <option value="https://tse3.mm.bing.net/th/id/OIP.RN7qmb-DSCUDM9GLk228eAHaFj?pid=Api&P=0&h=180">Trem de Passageiros</option>
        `;
    }
}

// Adicionar ouvinte ao campo de título
inputTitulo.addEventListener('input', atualizarSugestoesURL);

// Inicializar sugestões padrão
atualizarSugestoesURL();

renderizarSonhos();

