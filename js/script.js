const baseUrl = "https://rickandmortyapi.com/api/character";
const container = document.getElementById("cards-container");
const formBusca = document.getElementById("form-busca");
const inputBusca = document.getElementById("input-busca");
const filtroStatus = document.getElementById("filtro-status");
const filtroGenero = document.getElementById("filtro-genero");
const btnLimpar = document.getElementById("btn-limpar");

function getStatusClass(status) {
  if (status === "Alive") return "status-alive";
  if (status === "Dead") return "status-dead";
  return "status-unknown";
}

function criarCard(personagem) {
  const card = document.createElement("div");
  card.classList.add("card");

  const imagem = document.createElement("img");
  imagem.src = personagem.image;
  imagem.alt = personagem.name;

  const conteudo = document.createElement("div");
  conteudo.classList.add("card-conteudo");

  const nome = document.createElement("h3");
  nome.textContent = personagem.name;

  const status = document.createElement("p");
  status.innerHTML = `Status: <span class="${getStatusClass(personagem.status)}">${personagem.status}</span>`;

  const especie = document.createElement("p");
  especie.textContent = `Espécie: ${personagem.species}`;

  const genero = document.createElement("p");
  genero.textContent = `Gênero: ${personagem.gender}`;

  const origem = document.createElement("p");
  origem.textContent = `Origem: ${personagem.origin.name}`;

  conteudo.appendChild(nome);
  conteudo.appendChild(status);
  conteudo.appendChild(especie);
  conteudo.appendChild(genero);
  conteudo.appendChild(origem);

  card.appendChild(imagem);
  card.appendChild(conteudo);

  return card;
}

function carregarPersonagens(nome = "", status = "", genero = "") {
  container.innerHTML = '<p class="mensagem">Carregando personagens...</p>';

  const params = new URLSearchParams();

  if (nome) params.append("name", nome);
  if (status) params.append("status", status);
  if (genero) params.append("gender", genero);

  const url = params.toString() ? `${baseUrl}/?${params.toString()}` : baseUrl;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Nenhum personagem encontrado com esses filtros.");
      }
      return response.json();
    })
    .then(data => {
      container.innerHTML = "";

      data.results.forEach(personagem => {
        const card = criarCard(personagem);
        container.appendChild(card);
      });
    })
    .catch(error => {
      container.innerHTML = `<p class="mensagem">${error.message}</p>`;
      console.error("Erro:", error);
    });
}

formBusca.addEventListener("submit", function (event) {
  event.preventDefault();

  const nomeDigitado = inputBusca.value.trim();
  const statusSelecionado = filtroStatus.value;
  const generoSelecionado = filtroGenero.value;

  carregarPersonagens(nomeDigitado, statusSelecionado, generoSelecionado);
});

btnLimpar.addEventListener("click", function () {
  inputBusca.value = "";
  filtroStatus.value = "";
  filtroGenero.value = "";

  carregarPersonagens();
});

carregarPersonagens();