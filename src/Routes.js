import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Redirect } from 'react-router';
import { BinItems, Sidebar, Dashboard } from "./components";
import { ToastProvider } from 'react-toast-notifications';


function Routes() {

    if (localStorage.getItem('loggedin')) {
        return (
            <Router>
                <div>
                    <ToastProvider>

                        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
                        <Route exact path="/dashboard" render={() => <Dashboard />} />
                        <Route exact path="/" render={() => <Dashboard />} />
                        <Route exact path='/binitems' render={() => <BinItems />} />

                    </ToastProvider>
                </div>
            </Router>
        )
    }
    else {
        return (
            <Redirect to="/" />

        )
    }
}

export default Routes;