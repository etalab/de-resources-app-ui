import React from 'react';
import './App.css';
import SearchPage from './components/searchPage'
import ResourcePage from './components/resourcePage'
import { BrowserRouter, Route, Switch } from "react-router-dom";

const URL_FRONT = process.env.REACT_APP_URL_FRONT;


function App() {
  return (
    <div className="App">
      <div className="app-general">
          <div className="header">
              <div className="logo"><a href={URL_FRONT}><img width="300px" src="http://menil.info/IMG/siteon43.png?1588437695"/></a></div>
              <div className="accroche"><br></br>Plateforme ouverte des données publiques françaises</div>
          </div>
          <div className="main-title">
            <div className="main-title-forme">Moteur de recherche des ressources de <a href="http://data.gouv.fr">data.gouv.fr</a>
            </div>
          </div>
          <BrowserRouter>
            <div>
              <Switch>
                <Route path="/" component={SearchPage} exact />              
                <Route path="/resource/:resource_id" component={ResourcePage} exact />
              </Switch>
            </div>
          </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
