let atletas = [];
let temaAtual = 'claro';

document.getElementById('adicionar').addEventListener('click', adicionarAtleta);
document.getElementById('sortear').addEventListener('click', sortearTimes);
document.getElementById('toggle-tema').addEventListener('click', toggleTema);

function adicionarAtleta() {
    const nome = document.getElementById('nome').value;
    const estrelas = parseFloat(document.getElementById('estrelas').value);

    if (nome && estrelas >= 0 && estrelas <= 5) {
        atletas.push({ nome, estrelas });
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
        item.textContent = `${index + 1}. ${atleta.nome} - ${atleta.estrelas} estrelas`;
        lista.appendChild(item);
    });
}

function sortearTimes() {
    if (atletas.length === 0) {
        alert('Nenhum atleta cadastrado!');
        return;
    }

    const numTimes = parseInt(document.getElementById('numTimes').value);
    const numJogadoresPorTime = parseInt(document.getElementById('numJogadoresPorTime').value);

    if (isNaN(numTimes) || isNaN(numJogadoresPorTime)) {
        alert('Preencha todos os campos de configuração!');
        return;
    }

    if (numTimes * numJogadoresPorTime > atletas.length) {
        alert('Não há atletas suficientes para essa configuração!');
        return;
    }

    // Embaralhar a lista de atletas
    atletas = atletas.sort(() => Math.random() - 0.5);

    // Dividir os atletas em times
    const times = [];
    for (let i = 0; i < numTimes; i++) {
        times.push([]);
    }

    let indiceTime = 0;
    for (let i = 0; i < numTimes * numJogadoresPorTime; i++) {
        times[indiceTime].push(atletas[i]);
        indiceTime = (indiceTime + 1) % numTimes;
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
                item.textContent = `${atleta.nome} - ${atleta.estrelas} estrelas`;
                listaAtletas.appendChild(item);
            });
            divTime.appendChild(listaAtletas);

            resultado.appendChild(divTime);
        }
    });
}

function toggleTema() {
    if (temaAtual === 'claro') {
        document.body.classList.remove('tema-claro');
        document.body.classList.add('tema-escuro');
        document.querySelectorAll('section, #cadastro input, #configuracao input, #cadastro button#adicionar, .time, #atletas-cadastrados div, .btn-toggle-tema').forEach(element => {
            element.classList.add('tema-escuro');
        });
        document.getElementById('toggle-tema').textContent = 'Tema Claro';
        document.getElementById('toggle-tema').classList.add('tema-escuro');
        temaAtual = 'escuro';
    } else {
        document.body.classList.remove('tema-escuro');
        document.body.classList.add('tema-claro');
        document.querySelectorAll('section, #cadastro input, #configuracao input, #cadastro button#adicionar, .time, #atletas-cadastrados div, .btn-toggle-tema').forEach(element => {
            element.classList.remove('tema-escuro');
        });
        document.getElementById('toggle-tema').textContent = 'Tema Escuro';
        document.getElementById('toggle-tema').classList.remove('tema-escuro');
        temaAtual = 'claro';
    }
}
