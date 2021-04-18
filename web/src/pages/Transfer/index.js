import React, { useEffect, useState, } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { FiTrash2, FiEdit, FiUserPlus, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';

const Transfer = ({ history }) => {

    const [transfers, setTransfers] = useState([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        api.get('transfers/').then(response => setTransfers(response.data));
    }, []);

    const handleDeleteTransfers = (id) => {
        const confirm = window.confirm("Deseja mesmo excluir essa transferencia ?");

        if (confirm) {
            api.delete('transfers/' + id).then(response => {
                if (response.data.type === 'success') {
                    const transfersRemoveIndex = transfers.findIndex(transfer => id === transfer.id);
                    const newTransfers = [...transfers];
                    newTransfers.splice(transfersRemoveIndex, 1);
                    setTransfers(newTransfers);
                }
            });
        }
    }

    const getUserOrigin = (id) => {
        api.get('users/' + id).then(result => {
            const newTransfers = transfers;
            newTransfers.map((transfer) => {
                if (transfer.origin_id == id) {
                    transfer.origin = result.data.name;
                }
            })
            setTransfers(newTransfers);
        });


    }

    const getUserDestination = (id) => {
        api.get('users/' + id).then(result => {
            const newTransfers = transfers;
            newTransfers.map((transfer) => {
                if (transfer.destination_id == id) {
                    transfer.destination = result.data.name;
                }
            })
            setTransfers(newTransfers);
        });


    }


    return (
        <div id="page-main">
            <header>
                <h1>Poker Pró</h1>
            </header>
            <main>
                <div>
                    <Link to={'/'} className="button">
                        <b>Usuários</b>
                        <FiDollarSign />
                    </Link>
                    <ul>
                        {
                            transfers.map(transfer => (
                                <li key={transfer.id}>
                                    <div className="texts">
                                        Valor da Transferencia: <b>{transfer.value}</b>
                                        <br />
                                        Origem: {transfer.origin}
                                        <br />
                                        Destino: {transfer.destination}
                                    </div>
                                    <div className="buttons">
                                        <button onClick={() => { handleDeleteTransfers(transfer.id) }} title={"Excluir Transferencia"}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </li>
                            ))
                        }

                    </ul>
                </div>
            </main>
        </div>
    )
}

export default Transfer;
