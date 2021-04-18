const express = require('express');
const knex = require('../database/connection');


class TransactionsController {
    async index(request, response) {
        const transfers = await knex('transfer').select('*')

        return response.status(200).json(transfers);
    }

    async create(request, response) {
        const { origin, destination, value } = request.body;

        const users = await knex('users').select('*').whereIn('id', [origin, destination]);

        const userOrigin = users.findIndex(user => user.id == origin);
        const userDestination = users.findIndex(user => user.id == destination);

        if (users[userOrigin].balance < value) {
            return response.status(400).json({
                message: "Saldo Insuficiente para realizar essa operação"
            });

        }

        users[userOrigin].balance = users[userOrigin].balance - Number(value);
        users[userDestination].balance = users[userDestination].balance + Number(value);


        const trx = await knex.transaction();

        const userOriginUpdated = await trx('users').where('id', origin).update({ balance: users[userOrigin].balance });
        const userDestinationUpdated = await trx('users').where('id', destination).update({ balance: users[userDestination].balance });

        if (!userDestinationUpdated && !userOriginUpdated) {
            return response.status(500).json({
                message: "Erro ao realizar essa operação"
            });
        }

        const transferCreated = await trx('transfer').insert({ origin_id: origin, destination_id: destination, value: value });

        if (!transferCreated) {
            return response.status(500).json({
                message: "Erro ao realizar essa operação"
            });
        }

        await trx.commit();

        return response.status(200).json({ ...users, type: "success" });
    }

    async delete(request, response) {
        const { id } = request.params;

        const transfer = await knex('transfer')
            .select('*')
            .where('id', id)
            .first();

        if (!transfer) {
            return response.status(404).json({
                message: "Transferencia não encontrada"
            });
        }

        const users = await knex('users')
            .select('*')
            .whereIn('id', [transfer.origin_id, transfer.destination_id]);

        const userOrigin = users.findIndex(user => user.id == transfer.origin_id);
        const userDestination = users.findIndex(user => user.id == transfer.destination_id);

        users[userOrigin].balance = users[userOrigin].balance + transfer.value;
        users[userDestination].balance = users[userDestination].balance - transfer.value;

        const trx = await knex.transaction();

        const userOriginUpdated = await trx('users').where('id', transfer.origin_id).update({ balance: users[userOrigin].balance });
        const userDestinationUpdated = await trx('users').where('id', transfer.destination_id).update({ balance: users[userDestination].balance });

        if (!userDestinationUpdated && !userOriginUpdated) {
            return response.status(500).json({
                message: "Erro ao realizar essa operação"
            });
        }

        const transferDeleted = await trx('transfer').where('id', id).del();

        if (!transferDeleted) {
            return response.status(500).json({
                message: "Erro ao deletar essa transferencia"
            });
        }

        await trx.commit();

        return response.status(200).json({ ...users, type: 'success' });

    }

}

module.exports = TransactionsController;
