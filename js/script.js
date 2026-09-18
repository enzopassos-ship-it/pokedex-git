// Seleciona os elementos do HTML onde as informações do Pokémon serão exibidas
const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');

// Seleciona o formulário, o campo de busca e os botões de navegação
const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

// Variável que guarda o ID do Pokémon atual (começa no 1, que é o Bulbasaur)
let searchPokemon = 1;

// Função assíncrona para buscar os dados do Pokémon na PokéAPI
const fetchPokemon = async (pokemon) => {
  // Faz uma requisição para a API usando o nome ou ID passado
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  // Se a resposta for bem-sucedida (status 200), converte para JSON e retorna
  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}

// Função para renderizar (mostrar) as informações do Pokémon na tela
const renderPokemon = async (pokemon) => {
  // Mostra um aviso de "Carregando..." enquanto os dados não chegam
  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';

  // Aguarda a resposta da função fetchPokemon
  const data = await fetchPokemon(pokemon);

  // Se encontrou o Pokémon, atualiza a tela com os dados dele
  if (data) {
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = data.id;
    // Pega o sprite animado da 5ª geração
    pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    input.value = ''; // Limpa o campo de busca
    searchPokemon = data.id; // Atualiza o ID atual
  } else {
    // Se o Pokémon não existir ou der erro, mostra mensagem de erro
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
  }
}

// Evento de envio (submit) do formulário (quando o usuário aperta Enter ou busca)
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Evita que a página recarregue
  renderPokemon(input.value.toLowerCase()); // Busca o que foi digitado em letras minúsculas
});

// Evento de clique no botão "Prev" (Anterior)
buttonPrev.addEventListener('click', () => {
  // Só diminui se o ID for maior que 1 (para evitar números negativos ou zero)
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

// Evento de clique no botão "Next" (Próximo)
buttonNext.addEventListener('click', () => {
  searchPokemon += 1; // Incrementa o ID
  renderPokemon(searchPokemon); // Renderiza o próximo Pokémon
});

// Executa a função pela primeira vez ao carregar a página (mostrando o Pokémon 1)
renderPokemon(searchPokemon);