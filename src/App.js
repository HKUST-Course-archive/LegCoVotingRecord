import React, {useState} from 'react';
import './App.css';
import {Switch, Route, Redirect} from 'react-router-dom';

import Navigation from './components/Navigation'
import Page404 from './components/Page404'
import Bills from './components/Bills';
import Footer from './components/Footer';
import GridSelect from './components/GridSelect';
import About from './components/About';

function App() {
  
  const [Select, setSelect] = useState(null);
  return (
    <div className="container">
      <Navigation setSelect={setSelect}/>
      <Switch>
        <Route path="/home">
          <GridSelect Select={[Select, setSelect]}/>
        </Route>
        <Route path="/bills">
          <Bills />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route path="*">
          <Page404 />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
