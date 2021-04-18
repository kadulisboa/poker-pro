import React from 'react';
import { Switch } from 'react-router-dom';
import Main from '../pages/Main';
import Transfer from '../pages/Transfer';
import Route from './Route';



const Routes = () => {
    return (
        <Switch>
            <Route component={Main} path="/" exact />
            <Route component={Transfer} path="/transfers" exact />
        </Switch>
    )
}

export default Routes;
