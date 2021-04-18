const express = require('express');
const knex = require('../database/connection');


class UsersController {
    async index(request, response) {
        const { page } = request.query;
        const limit = 6;

        const users = !page ?
            await knex('users').select('*') :
            await knex('users').select('*').limit(limit).offset((limit * page));

        const serializedUsers = users.map(user => {
            return {
                id: user.id,
                name: user.name,
                balance: user.balance,
            }
        })

        return response.status(200).json(serializedUsers);
    }

    async show(request, response) {
        const { id } = request.params;

        const user = await knex('users').where('id', id).first();

        if (!user) {
            return response.status(404).json({
                message: "User not found.",
            });
        }

        return response.json(user);
    }

    async search(request, response) {
        const { search } = request.query;

        const users = await knex('users').where('name', 'like', `%${search}%`).select();

        if (!users) {
            return response.status(404).json({
                message: "User not found.",
            });
        }

        return response.json(users);
    }

    async create(request, response) {
        const {
            name,
        } = request.body;

        const trx = await knex.transaction();

        const newUser = {
            name: name
        }

        const userCreated = await trx('users').insert(newUser);
        await trx.commit();

        return response.json({
            type: "success",
            id: userCreated[0],
            name: newUser.name,
            balance: 10.00
        });
    }

    async delete(request, response) {
        const { id } = request.params;

        const trx = await knex.transaction();

        const userDeleted = await trx('users').where('id', id).del();


        await trx.commit();

        if (!userDeleted) {
            return response.status(400).json({
                message: "Algo de errado ao deletar o usuário!"
            });
        }

        return response.status(200).json({
            type: "success",
            message: "Usuário Deletado com sucesso!"
        });
    }

    async update(request, response) {
        const { id } = request.params;
        const { name } = request.body;

        const trx = await knex.transaction();

        const userUpdated = await trx('users').where('id', id).update({ name: name });

        await trx.commit();

        if (!userUpdated) {
            return response.status(400).json({
                message: "Algo de errado ao editar o usuário!"
            });
        }

        return response.status(200).json({
            type: "success",
            name: name
        });
    }
}

module.exports = UsersController;
