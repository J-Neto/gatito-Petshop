// Rotas

const roteador = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const Fornecedor = require('./Fornecedor');

// Listar fornecedores
roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar();
    res.send(JSON.stringify(resultados));
});

// Cadastrar fornecedor
roteador.post('/', async (req, res) => {
    try {
        const dadosRecebidos = req.body;
        const fornecedor = new Fornecedor(dadosRecebidos);
        await fornecedor.criar();
        res.send(JSON.stringify(fornecedor))
    } catch (erro) {
        res.send(JSON.stringify({
            mensagem: erro.message
        }))
    }
})

// Detalhes de um fornecedor
roteador.get('/:idFornecedor', async (req, res) =>{
    try{
        // Recebendo o id por parâmtro do user
        const id = req.params.idFornecedor;

        // Encontrando o fornecedor desejado pelo id
        const fornecedor = new Fornecedor({id: id});
        await fornecedor.carregar();

        // Respondendo ao usuário o fornecedor encontrado
        res.send(JSON.stringify(fornecedor));
    }catch(erro) {
        res.send(JSON.stringify({
            mensagem: erro.message
        }))
    }
})

// Atualizando um fornecedor
roteador.put('/:idFornecedor', async (req, res) => {
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

        res.end();

    } catch (erro) {
        res.send(JSON.stringify(
            {message: erro.message}
        ))
    }
})

// Removendo um fornecedor
roteador.delete('/:idFornecedor', async (req, res) => {
    try {
        const id = req.params.idFornecedor;
        const fornecedor = new Fornecedor({id: id});
        await fornecedor.carregar();
        await fornecedor.remover();
        res.end();
    } catch (erro) {
        res.send(
            JSON.stringify({
                mensagem: erro.message
            })
        )
    }

})

module.exports = roteador;