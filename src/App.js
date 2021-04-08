import {useEffect, useState} from 'react';
import './App.scss';
import Toolbar from './toolbar/Toolbar';
import Hero from './hero/Hero';
import Footer from './footer/Footer';
import Portfolio from './Portfolio/Portfolio';
import About from './About/About.js';
import Components from './Components/Components';

export default function App() {
  const [section, setSection] = useState('hero');


  const scrollView = () => {
    var parentSection = document.querySelector('#sections')
    var windowHeight = window.innerHeight * 0.75;
    var hero = document.querySelector('#hero').getBoundingClientRect();
    var about = document.querySelector('#about').getBoundingClientRect();
    var components = document.querySelector('#components').getBoundingClientRect();
    var portfolio = document.querySelector('#portfolio').getBoundingClientRect();

    if(about.y - 70 <=  windowHeight && about.y >= windowHeight) {
        setSection('About')
    } else if (portfolio.y - 70 <= windowHeight && portfolio.y >= windowHeight) {
        setSection('Portfolio')
    } else if(components.y - 70 <= windowHeight && components.y >= windowHeight) {
        setSection('Components')
        parentSection.removeEventListener('scroll', scrollView)
    } else {
        setSection('Hero')
    }
  }

  useEffect(()=> {
    var parentSection = document.querySelector('#sections')
    parentSection.addEventListener('scroll', scrollView)
  }, [])

  return (
    <div className="App">

        <Toolbar 
          section={section}/>
        <div id="sections">
          <Hero />
          <About section={section}/>
          <Portfolio section={section}/>
          <Components section={section}/>
          <Footer />
        </div>
    </div>
  );
}
