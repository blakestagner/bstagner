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

  window.addEventListener('scroll', () => {
    let scrollPosition = window.pageYOffset;

    let hero = document.querySelector('#hero').getBoundingClientRect();
    let about = document.querySelector('#about').getBoundingClientRect();
    let components = document.querySelector('#components').getBoundingClientRect();
    let portfolio = document.querySelector('#portfolio').getBoundingClientRect();
    let parent = document.querySelector('#sections')

    if(about.y - 70 <=  0 && about.y >= -1) {
      setSection('about')
    } else if (components.y - 70 <= 0 && components.y >= -1) {
      setSection('components')
    } else if(portfolio.y - 70 <= 0 && portfolio.y >= -1) {
      setSection('portfolio')
    } else if(hero.y - 70 <= 0 && hero.y >= -1){
      setSection('hero')
    }
  })

  return (
    <div className="App">
      <Router >
        <Toolbar 
          section={section}/>
        <div id="sections">
          <Hero />
          <About />
          <Portfolio />
          {/*<Components /> */}
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
