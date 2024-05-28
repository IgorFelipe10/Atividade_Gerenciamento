const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const usuarios = [];
const jogadores = [];
  
app.get('/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.js'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    if (!usuario) {
        return res.redirect('/login.html?error=1');
    }

    res.redirect('/operacoes.html');
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;
    if (usuarios.some(u => u.email === email)) {
        return res.status(400).send('Email já cadastrado');
    }
    const novoUsuario = { id: usuarios.length + 1, nome, email, senha };
    usuarios.push(novoUsuario);
    res.redirect('/login.html');
});

app.get('/operacoes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'operacoes.html'));
});

app.get('/adicionar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adicionar.html'));
});

app.post('/adicionar', (req, res) => {
    const { nome, idade, nacionalidade, posicao, partidas, gols, imagem } = req.body;
    const novoJogador = { 
        id: jogadores.length + 1, 
        nome, 
        idade: parseInt(idade), 
        nacionalidade, 
        posicao, 
        partidas: parseInt(partidas), 
        gols: parseInt(gols),
        imagem
    };
    jogadores.push(novoJogador);
    res.redirect('/ver'); 
});

app.post('/remover/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    const index = jogadores.findIndex(jogador => jogador.id === id);
    if (index !== -1) {
        jogadores.splice(index, 1);
        res.sendStatus(200); 
    } else {
        res.sendStatus(404); 
    }
});


app.get('/ver', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ver.html'));
});

app.get('/api/jogadores', (req, res) => {
    res.json(jogadores);
});

app.get('/api/jogadores/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const jogador = jogadores.find(jogador => jogador.id === id);
    if (jogador) {
        res.json(jogador);
    } else {
        res.status(404).send('Jogador não encontrado');
    }
});

app.post('/editar/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, idade, nacionalidade, posicao, partidas, gols, imagem } = req.body;
    const jogadorIndex = jogadores.findIndex(jogador => jogador.id === id);
    if (jogadorIndex !== -1) {
        jogadores[jogadorIndex] = {
            ...jogadores[jogadorIndex],
            nome,
            idade: parseInt(idade),
            nacionalidade,
            posicao,
            partidas: parseInt(partidas),
            gols: parseInt(gols),
            imagem
        };
        res.status(200).send('Jogador atualizado com sucesso');
    } else {
        res.status(404).send('Jogador não encontrado');
    }
});
app.get('/editarJogador/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'editarJogador.html'));
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
