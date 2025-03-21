let atletas = [];
let temaAtual = localStorage.getItem('tema') || 'claro';

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  document.body.className = `tema-${temaAtual}`;
  atualizarTextoBotaoTema();
  carregarAtletas();
});

// Event Listeners
document.getElementById('adicionar').addEventListener('click', adicionarAtleta);
document.getElementById('sortear').addEventListener('click', sortearTimes);
document.getElementById('toggle-tema').addEventListener('click', toggleTema);

// Funções do Tema
function toggleTema() {
    temaAtual = temaAtual === 'escuro' ? 'claro' : 'escuro';
    document.body.className = `tema-${temaAtual}`;
    localStorage.setItem('tema', temaAtual);
    atualizarTextoBotaoTema();
}

function atualizarTextoBotaoTema() {
  const botao = document.getElementById('toggle-tema');
  botao.textContent = temaAtual === 'claro' ? '🌙 Tema Escuro' : '☀️ Tema Claro';
}

function adicionarAtleta() {
    const nome = document.getElementById('nome').value;
    const valorEstrelas = document.getElementById('estrelas').value.replace(',', '.');
    const estrelas = parseFloat(valorEstrelas);

    if (nome && !isNaN(estrelas) && estrelas >= 0 && estrelas <= 5) {
        atletas.push({ nome, estrelas });
        salvarAtletas();
        atualizarListaAtletas();
        document.getElementById('nome').value = '';
        document.getElementById('estrelas').value = '';
    } else {
        alert('Preencha todos os campos corretamente!');
    }
}

function atualizarListaAtletas() {
    const lista = document.getElementById('atletas-cadastrados');
    lista.innerHTML = '';
    atletas.forEach((atleta, index) => {
        const item = document.createElement('div');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `atleta-${index}`;
        checkbox.value = index;

        const label = document.createElement('label');
        label.textContent = `${atleta.nome} - ${atleta.estrelas} ⭐`;
        label.htmlFor = checkbox.id;

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => editarAtleta(index);
        
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.onclick = () => removerAtleta(index);
        
        item.appendChild(checkbox);
        item.appendChild(label);
        item.appendChild(btnEditar);
        item.appendChild(btnRemover);
        lista.appendChild(item);
    });
}

function sortearTimes() {
    const selecionados = document.querySelectorAll('#atletas-cadastrados input[type="checkbox"]:checked');
    
    if (selecionados.length === 0) {
        alert('Nenhum atleta selecionado!');
        return;
    }

    const atletasSelecionados = Array.from(selecionados).map(checkbox => atletas[parseInt(checkbox.value)]);
    
    const numTimes = parseInt(document.getElementById('numTimes').value);
    const numJogadoresPorTime = parseInt(document.getElementById('numJogadoresPorTime').value);

    if (isNaN(numTimes) || isNaN(numJogadoresPorTime)) {
        alert('Preencha todos os campos de configuração!');
        return;
    }

    // Ordenar atletas por nível
    const atletasOrdenados = atletasSelecionados.sort((a, b) => b.estrelas - a.estrelas);

    // Distribuir atletas alternadamente entre os times
    const times = [];
    for (let i = 0; i < numTimes; i++) {
        times.push([]);
    }

    let indiceTime = 0;
    for (let i = 0; i < atletasOrdenados.length; i++) {
        times[indiceTime].push(atletasOrdenados[i]);
        indiceTime = (indiceTime + 1) % numTimes;
    }

    // Ajustar para que os primeiros times tenham o número máximo de atletas
    let atletasRestantes = atletasOrdenados.length;
    for (let i = 0; i < numTimes - 1; i++) {
        if (times[i].length < numJogadoresPorTime) {
            let falta = numJogadoresPorTime - times[i].length;
            while (falta > 0 && atletasRestantes > numJogadoresPorTime * (numTimes - 1)) {
                times[i].push(times[numTimes - 1].shift());
                falta--;
                atletasRestantes--;
            }
        }
    }

    // Exibir os times
    const resultado = document.getElementById('times');
    resultado.innerHTML = '';
    
    times.forEach((time, index) => {
        if (time.length > 0) {
            const divTime = document.createElement('div');
            divTime.className = 'time';
            const h2 = document.createElement('h2');
            h2.textContent = `Time ${index + 1}`;
            divTime.appendChild(h2);

            const listaAtletas = document.createElement('ul');
            time.forEach(atleta => {
                const item = document.createElement('li');
                item.textContent = `${atleta.nome} - ${atleta.estrelas} ⭐`;
                listaAtletas.appendChild(item);
            });
            divTime.appendChild(listaAtletas);

            resultado.appendChild(divTime);
        }
    });
}

function editarAtleta(index) {
    const nomeAtualizado = prompt('Digite o novo nome:', atletas[index].nome);
    const valorEstrelas = prompt('Digite o novo nível de estrelas:', atletas[index].estrelas).replace(',', '.');
    const estrelasAtualizadas = parseFloat(valorEstrelas);

    if (nomeAtualizado && !isNaN(estrelasAtualizadas) && estrelasAtualizadas >= 0 && estrelasAtualizadas <= 5) {
        atletas[index].nome = nomeAtualizado;
        atletas[index].estrelas = estrelasAtualizadas;
        
        salvarAtletas();
        atualizarListaAtletas();
    } else {
        alert('Preencha todos os campos corretamente!');
    }
}

function removerAtleta(index) {
    atletas.splice(index, 1);
    salvarAtletas();
    atualizarListaAtletas();
}

function salvarAtletas() {
    localStorage.setItem('atletas', JSON.stringify(atletas));
}

function carregarAtletas() {
    const dados = localStorage.getItem('atletas');
    if (dados) {
        atletas = JSON.parse(dados);
        atualizarListaAtletas();
    }
}
