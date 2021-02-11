import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Home from "./Home";
import Lobby from "./Lobby";
import CreateLobby from "./CreateLobby";
import ErrorBoundary from "./ErrorBoundary";
import { BrowserRouter as Router, Route } from "react-router-dom";

const Header = styled.img`
    position: relative;
    width: 200px;
    margin: 8px;
    margin-left: 40px;
    float: left;
`;

function App() {
  return (
    <Router>
      <div className="App">
        <div className="books-container">
          <ErrorBoundary>
            <div className="books-container-header">
              <Header src="/images/logo.png"></Header>
            </div>
            <div className="books-container-body">
              <Route exact={true} path={'/'}>
                <Home />
              </Route>
              <Route exact={true} path={'/home'}>
                <Home />
              </Route>
              <Route exact={true} path={'/shortlisted'}>
                <Home filter={true} filterBy={'shortlisted'}/>
              </Route>
              <Route exact={true} path={'/rejected'}>
                <Home filter={true} filterBy={'rejected'}/>
              </Route>
              <Route exact={true} path={'/lobby/open/:id'} render={({ match }) => ( <Lobby id={match.params.id} />)}>
              </Route>
              <Route exact={true} path={'/lobby/create/new'}>
                <div className='form-container row justify-content-md-center'>
                    <CreateLobby />
                </div>
              </Route>

              <Route exact={true} path={'/lottery/dashboard'}>
                    <Dashboard />
              </Route>
              
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </Router>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
