// ==========================================
// 1. SELEÇÃO DE ELEMENTOS DO HTML (DOM)
// ==========================================
// Pegamos as tags do HTML pela classe CSS (ponto .) para podermos alterar os textos e imagens depois
const pokemonName = document.querySelector('.pokemon__name');     // Onde vai aparecer o nome
const pokemonNumber = document.querySelector('.pokemon__number'); // Onde vai aparecer o número/ID
const pokemonImage = document.querySelector('.pokemon__image');   // Onde vai aparecer a imagem/GIF

// Pegamos o formulário, o campo de digitação e os dois botões
const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

// ==========================================
// 2. VARIÁVEIS DE CONTROLE
// ==========================================
// Guarda o ID do Pokémon que está na tela (começa em 1 = Bulbasaur)
let searchPokemon = 1;

// ==========================================
// 3. FUNÇÃO QUE BUSCA DADOS NA API
// ==========================================
// 'async' avisa o JS que essa função faz requisições que demoram um tempo para responder
const fetchPokemon = async (pokemon) => {
  // 'await' faz o código esperar a API devolver os dados antes de continuar
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  // Se a busca deu certo (status 200 = sucesso)
  if (APIResponse.status === 200) {
    // Converte a resposta bruta em dados de texto/objeto (JSON)
    const data = await APIResponse.json();
    return data; // Retorna os dados prontos do Pokémon
  }
  // Se não encontrar o Pokémon, a função encerra e não retorna nada
}

// ==========================================
// 4. FUNÇÃO QUE DESENHA/ATUALIZA A TELA
// ==========================================
const renderPokemon = async (pokemon) => {
  // Mostra um aviso provisório enquanto baixa as informações
  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';

  // Busca as informações do Pokémon na API e aguarda o resultado
  const data = await fetchPokemon(pokemon);

  // Se a API encontrou o Pokémon com sucesso
  if (data) {
    pokemonImage.style.display = 'block'; // Exibe a tag de imagem na tela
    pokemonName.innerHTML = data.name;    // Coloca o nome do Pokémon
    pokemonNumber.innerHTML = data.id;    // Coloca o número do Pokémon
    
    // Tenta pegar o GIF animado da 5ª geração
    const animatedSprite = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    
    // SE houver GIF (Pokémon #1 ao #649), usa ele. SE NÃO (Pokémon #650+), usa a imagem padrão estática
    pokemonImage.src = animatedSprite || data['sprites']['front_default'];

    input.value = '';        // Limpa o que o usuário digitou no campo de pesquisa
    searchPokemon = data.id; // Atualiza a variável com o ID do Pokémon encontrado
  } else {
    // Se a busca falhar (ex: nome digitado não existe)
    pokemonImage.style.display = 'none';    // Esconde o ícone de imagem quebrada
    pokemonName.innerHTML = 'Not found :c'; // Mostra mensagem de erro
    pokemonNumber.innerHTML = '';           // Apaga o número
  }
}

// ==========================================
// 5. EVENTOS (AÇÕES DO USUÁRIO)
// ==========================================

// Quando o usuário envia a pesquisa (aperta Enter no formulário)
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Impede o navegador de recarregar a página toda
  
  // Converte a pesquisa para letras minúsculas (a API só entende letras minúsculas)
  renderPokemon(input.value.toLowerCase());
});

// Quando o usuário clica no botão "Prev" (Anterior)
buttonPrev.addEventListener('click', () => {
  // Só diminui se for maior que 1 (evita IDs 0 ou números negativos)
  if (searchPokemon > 1) {
    searchPokemon -= 1;           // Subtrai 1 do ID atual
    renderPokemon(searchPokemon); // Recarrega a tela com o novo ID
  }
});

// Quando o usuário clica no botão "Next" (Próximo)
buttonNext.addEventListener('click', () => {
  searchPokemon += 1;           // Soma 1 ao ID atual
  renderPokemon(searchPokemon); // Recarrega a tela com o novo ID
});

// ==========================================
// 6. INICIALIZAÇÃO DA PÁGINA
// ==========================================
// Executa a função assim que a página carrega para já exibir o Pokémon nº 1 (Bulbasaur)
renderPokemon(searchPokemon);