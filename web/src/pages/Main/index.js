import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Transfer from '../Transfer/index';
import './styles.css';
import { FiTrash2, FiEdit, FiUserPlus, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';

const Main = ({ history }) => {

    const [users, setUsers] = useState([]);
    const [input, setInput] = useState('');

    const [nameEdit, setNameEdit] = useState('');
    const [idEdit, setIdEdit] = useState('');
    const [showEdit, setShowEdit] = useState('');
    const closeModal = (() => setShowEdit(''));

    const [showCreate, setShowCreate] = useState('');
    const [newInput, setNewInput] = useState('');
    const closeModalCreate = (() => setShowCreate(''));

    const [showTransfer, setShowTransfer] = useState('');
    const [valueTransfer, setValueTransfer] = useState('');
    const [idOrigin, setIdOrigin] = useState('');
    const [idDestination, setIdDestination] = useState('');
    const closeModalTransfer = (() => setShowTransfer(''));


    useEffect(() => {
        api.get('users/').then(response => setUsers(response.data));
    }, []);

    const changeInput = (event) => {
        const { value } = event.target;

        setInput(value);

    }

    const createdTransfer = (event) => {
        event.preventDefault();
        const confirm = window.confirm("Deseja transferir " + valueTransfer + "?");

        if (confirm) {
            api.post('transfers/', {
                "origin": idOrigin,
                "destination": Number(idDestination),
                "value": valueTransfer
            }).then(response => {
                if (response.data.type === 'success') {
                    alert("Transferencia de " + valueTransfer + " realizada!");
                    delete response.data.type;
                    const OriginIndex = users.findIndex(user => idOrigin == user.id);
                    const deletedUsers = [...users];
                    deletedUsers.splice(OriginIndex, 1);
                    const DestinationIndex = deletedUsers.findIndex(user => idDestination == user.id);
                    deletedUsers.splice(DestinationIndex, 1);
                    const newUsers = [response.data[0], response.data[1], ...deletedUsers]
                    setUsers(newUsers);
                }
            });
        }

    }

    const handleShowTransfer = (id) => {

        setShowTransfer('_show');
        setIdOrigin(id)

    }

    const createInput = (event) => {
        const { value } = event.target;

        setNewInput(value);

    }

    const changeName = (event) => {
        event.preventDefault();
        const confirm = window.confirm("Deseja mesmo editar o " + nameEdit + "?");

        if (confirm) {
            api.put('users/' + idEdit, { name: input }).then(response => {
                if (response.data.type === 'success') {
                    alert("Nome editado para " + response.data.name);
                    const userEditIndex = users.findIndex(user => idEdit === user.id);
                    users[userEditIndex].name = response.data.name;
                    const newUsers = users;
                    setUsers(newUsers);
                }
            });
        }
    }

    const createUser = (event) => {
        event.preventDefault();
        const confirm = window.confirm("Deseja criar o " + newInput + "?");

        if (confirm) {
            api.post('users/', { name: newInput }).then(response => {
                if (response.data.type === 'success') {
                    alert("Usuário com nome " + response.data.name + " criado!");
                    delete response.data.type;
                    const newUsers = [...users, response.data];
                    setUsers(newUsers);
                }
            });
        }
    }

    const handleDeleteUser = (id, name) => {
        const confirm = window.confirm("Deseja mesmo excluir o " + name + "?");

        if (confirm) {
            api.delete('users/' + id).then(response => {
                if (response.data.type === 'success') {

                    alert(response.data.message);
                    const userRemoveIndex = users.findIndex(client => id === client.id);
                    const newUsers = [...users];
                    newUsers.splice(userRemoveIndex, 1);
                    setUsers(newUsers);
                }
            });
        }

    }

    const handleShowEdit = (id, name) => {

        setShowEdit('_show');
        setNameEdit(name)
        setIdEdit(id)

    }

    const handleShowCreate = () => {

        setShowCreate('_show');

    }

    return (
        <div id="page-main">
            <header>
                <h1>Poker Pró</h1>
            </header>
            <main>
                <div>
                    <Link onClick={handleShowCreate} className="button">
                        <b>Cadastrar Usuário</b>
                        <FiUserPlus />
                    </Link>
                    <Link to={"transfers"} className="button">
                        <b>Transferencias</b>
                        <FiDollarSign />
                    </Link>
                    <ul>
                        {
                            users.map(user => (
                                <li key={user.id}>
                                    <div className="texts">
                                        Nome: <b>{user.name}</b>
                                        <br />
                                        Carteira: <b>{user.balance}</b>
                                    </div>
                                    <div className="buttons">
                                        <button onClick={() => { handleDeleteUser(user.id, user.name) }} title={"Excluir Usuário " + user.name}>
                                            <FiTrash2 />
                                        </button>
                                        <button onClick={() => { handleShowEdit(user.id, user.name) }} title={"Editar Usuário " + user.name}>
                                            <FiEdit />
                                        </button>
                                        <button onClick={() => { handleShowTransfer(user.id) }} title={"Transferir"}>
                                            <b>Transferir</b>
                                            <FiArrowRight />
                                            <FiDollarSign />
                                        </button>
                                    </div>
                                </li>
                            ))
                        }

                    </ul>
                </div>
            </main>
            <div className={"modal " + showEdit}>
                <button onClick={() => { closeModal() }}>Fechar</button>
                <h3>Editar Usuário {nameEdit}</h3>
                <form onSubmit={changeName}>
                    <input value={input} name="name" onChange={changeInput} />
                    <button>Editar</button>
                </form>
            </div>

            <div className={"modal " + showCreate}>
                <button onClick={() => { closeModalCreate() }}>Fechar</button>
                <h3>Criar Usuário</h3>

                <form onSubmit={createUser}>
                    <input value={newInput} name="name" onChange={createInput} />
                    <button>Criar</button>
                </form>

            </div>

            <div className={"modal " + showTransfer}>
                <button onClick={() => { closeModalTransfer() }}>Fechar</button>
                <h3>Criar Usuário</h3>

                <form onSubmit={createdTransfer}>
                    <select onChange={(event) => setIdDestination(event.target.value)}>
                        <option>Escolha um usuário</option>
                        {
                            users.map((user) => {
                                if (user.id !== idOrigin) {
                                    return (<option key={user.id} value={user.id}>{user.name}</option>)
                                }
                            })
                        }
                    </select>
                    <input value={valueTransfer} name="value" placeholder="Valor da transferencia" onChange={(event) => setValueTransfer(event.target.value)} />
                    <button>Transferir</button>
                </form>

            </div>
        </div>
    )
}

export default Main;
