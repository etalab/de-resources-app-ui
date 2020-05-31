import React from 'react';
import './App.css';
import SearchPage from './components/searchPage'
import ResourcePage from './components/resourcePage'
import { BrowserRouter, Route, Switch } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <div className="app-general">
          <div className="header">
              <div className="logo"><a href="http://recherche.dataeng.etalab.studio"><img width="300px" src="https://lh3.googleusercontent.com/proxy/5pbDvExNTy_EZ7d_L9l7LZLQM2f_diO__mbbKoDM9RY4LHYIXaD1GGOT9VL3KXeFV8G3moTD4OUV2bccBa0jd_8k0GYe"/></a></div>
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
