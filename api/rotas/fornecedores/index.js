// Rotas
const roteador = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const Fornecedor = require('./Fornecedor');
const NaoEncontrado = require('../../erros/NaoEncontrado');
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor;

// Quais operações são permitidas pela API nas req dos navegadores (diz respeito ao CORS)
roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204);
    res.end();
});

// Listar fornecedores
roteador.get('/', async (req, res, proximo) => {
    const resultados = await TabelaFornecedor.listar();
    res.status(200);
    const serializador = new SerializadorFornecedor(
        res.getHeader('Content-Type'), ['empresa']
    );
    res.send(serializador.serializar(resultados));
});

// Cadastrar fornecedor
roteador.post('/', async (req, res, proximo) => {
    try {
        const dadosRecebidos = req.body;
        const fornecedor = new Fornecedor(dadosRecebidos);
        await fornecedor.criar();
        res.status(201);
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'), ['empresa']
        );
        res.send(serializador.serializar(fornecedor));
    } catch (erro) {
        proximo(erro);
    }
})

roteador.options('/:idFornecedor', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204);
    res.end();
});

// Detalhes de um fornecedor
roteador.get('/:idFornecedor', async (req, res, proximo) =>{
    try{
        // Recebendo o id por parâmtro do user
        const id = req.params.idFornecedor;

        // Encontrando o fornecedor desejado pelo id
        const fornecedor = new Fornecedor({id: id});
        await fornecedor.carregar();
        res.status(200);
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            ['empresa', 'email', 'dataCriacao', 'dataAtualizacao', 'versao']
        );
        // Respondendo ao usuário o fornecedor encontrado
        res.send(serializador.serializar(fornecedor));
    }catch(erro) {
        proximo(erro);
    }
})

// Atualizando um fornecedor
roteador.put('/:idFornecedor', async (req, res, proximo) => {
    try {
        // Recebendo o id por parâmetro do user
        const id = req.params.idFornecedor;

        // Recebendo os dados a serem atualizados do fornecedor desejado
        const dadosRecebidos = req.body;

        // Unindo as variáveis
        const dados = Object.assign({}, dadosRecebidos, {id: id});

        // Encontrando o fornecedor desejado
        const fornecedor = new Fornecedor(dados);

        await fornecedor.atualizar();
        res.status(204);
        res.end();

    } catch (erro) {
        proximo(erro);
    }
})

// Removendo um fornecedor
roteador.delete('/:idFornecedor', async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor;
        const fornecedor = new Fornecedor({id: id});
        await fornecedor.carregar();
        await fornecedor.remover();
        res.status(204);
        res.end();
    } catch (erro) {
        proximo(erro);
    }

})

// Listando produtos de um fornecedor
const roteadorProdutos = require('./produtos');

const verificarFornecedor = async (req, res, proximo) =>{
    try {
        const id = req.params.idFornecedor;
        const fornecedor = new Fornecedor({ id: id});
        await fornecedor.carregar();
        
        // Disponibilizando este recurso a todas as rotas que vierem após este middleware
        req.fornecedor = fornecedor;
        proximo()
    } catch (erro) {
        proximo(erro);
    }
}

roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos);

module.exports = roteador;