// DAO = Data Access Object

const Modelo = require('./ModeloTabelaProduto');
const instancia = require('../../../banco-de-dados');

module.exports = {
    // Pegando objetos a partir do id do fornecedor
    listar (idFornecedor) {
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor
            },
            raw: true
        });
    },

    inserir (dados) {
        return Modelo.create(dados);
    },

    remover (idProduto, idFornecedor) {
        return Modelo.destroy({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            }
        })
    },

    async pegarPorId(idProduto, idFornecedor) {
        const encontrado = await Modelo.findOne({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            },
            raw: true
        })

        if (!encontrado) {
            throw new Error('produto não foi encontrado');
        }

        return encontrado;
    },

    atualizar (dadosDoProduto, dadosParaAtualizar) {
        return Modelo.update(
            dadosParaAtualizar,
            {
                where: dadosDoProduto
            }
        )
    },

    subtrair (idProduto, idFornecedor, campo, quantidade) {
        // Usamos este método para evitar conflito em diversas operações de venda e redução do estoque
        return instancia.transaction(async transacao => {
            const produto = await Modelo.findOne({
                where: {
                    id: idProduto,
                    fornecedor: idFornecedor
                }
            })

            produto[campo] = quantidade

            await produto.save()

            return produto
        })
    }
}