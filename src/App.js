import {useState} from 'react';
import './App.scss';
import { BrowserRouter as  Router, Switch, Route } from 'react-router-dom';
import Toolbar from './toolbar/Toolbar';
import Hero from './hero/Hero';
import Footer from './footer/Footer';
import Portfolio from './Portfolio/Portfolio';
import About from './About/About.js';
import Components from './Components/Components';
import './styles/grid.css'

function App() {
  const [section, setSection] = useState('hero')



  return (
    <div className="App">
      <Router >
        <Toolbar 
          section={section}/>
        <div id="sections">
          <Hero />
          <About />
          {/*<Portfolio />
          <Components />*/}
        </div>
      </Router>
      <Footer /> 
    </div>
  );
}

export default App;
