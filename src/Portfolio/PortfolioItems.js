import './portfolio.scss'
import bazLogo from './img/portfolio/baztheroadielogo.png';
import bazSite from './img/portfolio/baztheroadie.webp';
import deanLogo from './img/portfolio/djv3.png';
import deanHome from './img/portfolio/electdeanjohnson.webp'
import markLogo from './img/portfolio/mllogo4.png';
import markHome from './img/portfolio/mlhome.webp';
import deannaLogo from './img/portfolio/deannakellerlogo.png';
import deannaHome from './img/portfolio/deannakeller.webp';
import maeBlake from './img/portfolio/wedding.webp'

import closeBlack from '../toolbar/img/close-black.svg'

import {useState} from 'react';

export default function PortfolioItems() {
    const [item, setItem] = useState(0);
    const [animate, setAnimate] = useState('')
    const [enlarged, setEnlarged] = useState(null)
    const [portfolio, setPortfolio] = useState(0)
    const portfolioDetails = [
        {
            'name': 'Mae Blake Wedding',
            'icon': deanLogo,
            'site_home': maeBlake,
            'site_landing': null
        },
        {
            'name': 'Dean Johsnon',
            'icon': deanLogo,
            'site_home': deanHome,
            'site_landing': null
        },
        { 
            'name': 'Baz the Roadie',
            'icon': bazLogo,
            'site_home': bazSite,
            'site_landing': null 
        },
        {
            'name': 'Mark Lindquist',
            'icon': markLogo,
            'site_home': markHome,
            'site_landing': null
        },
        {
            'name': 'Deanna Keller',
            'icon': deannaLogo,
            'site_home': deannaHome,
            'site_landing': null
        }
    ];
    
    const handleClick = (item) => {
        setAnimate('animate')
        setTimeout(() => {
            setItem(item)
            setPortfolio(item)
            setAnimate('')
        }, 500)
    }

    const enlargeImage = (img) => {
        setEnlarged(img)
    }

    const togglePortfolio = (direction) => {
        const section = document.querySelector('#portfolio-items');
        const sectionChildrenWidth = section.getBoundingClientRect().width


        let carouselPositions = [];
        document.querySelectorAll('#portfolio-items > div').forEach(function(div) {
        let child = div.getBoundingClientRect()
        carouselPositions.push([child.left ]);
        })

        for(let i in carouselPositions) {
            if(carouselPositions[i] > -100 && carouselPositions[i] < 100) {
            }
        }
        const nextBefore = (num) => {
            section.scrollTo({
                left: num * sectionChildrenWidth,
                behavior: 'smooth'
            });
        }

        const nextItem = () => {
            let portfolioCopy = portfolio;
            portfolioCopy++
            if(portfolio === 3 ) {
                setItem(0)
                setPortfolio(0)
                nextBefore(0)
                
            } else {
                setItem(item + 1)
                setPortfolio(portfolioCopy)
                nextBefore(portfolioCopy)
            }
        }
        const beforeItem = () => {
            let portfolioCopy = portfolio;
            portfolioCopy--
            if(portfolio === 0 ) {
                    setPortfolio(3)
                    nextBefore(3)
                    setItem(3)
            } else {
                    setPortfolio(portfolioCopy)
                    nextBefore(portfolioCopy)
                    setItem(item - 1)
            }
        }

        direction === '+' ? nextItem() : beforeItem()
    }

    const swipePortfolio = () => {
        let carouselPositions = [];
        document.querySelectorAll('#portfolio-items > div').forEach(function(div) {
        let child = div.getBoundingClientRect()
        carouselPositions.push([child.left ]);
        })
        for(let i in carouselPositions) {
            if(carouselPositions[i] > -100 && carouselPositions[i] < 100) {
                setItem(parseInt(i))
                setPortfolio(parseInt(i))
            }
        }
    }
    
    window.addEventListener('load', () => {
        const portfolioSwipe = document.querySelector('#portfolio-items')
        portfolioSwipe.addEventListener('scroll', swipePortfolio, false);
    })

    return (
        <div className="portfolio">
            <div className="portfolio-sidenav">
                <ul>
                    {portfolioDetails.map((obj, i) => (
                        <li
                            key={i} 
                            onClick={() => handleClick(i)}>
                            <p className={item === i ? 'active' : ''} >{obj.name}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div
                id="arrow" 
                style={{position: 'relative'}}>
                    <i 
                        onClick={() => togglePortfolio('+')}
                        className="arrow right"></i>
                    <i 
                        onClick={() => togglePortfolio('-')}
                        className="arrow left"></i>
            </div>
            <div className="portfolio-details">
                {portfolioDetails.filter((obj, i) => i === item)
                    .map((obj, i) => (
                    <div key={i}>
                        <div
                            className={`portfolio-card ${animate}` } 
                            key={i}>
                            <p className="portfolio-proj-title">{obj.name}</p>
                            {/*<img
                                alt="list details"
                                className="portfolio-icons" 
                            src={obj.icon}/> */}
                        </div>
                        <div className={`portfolio-site-img ${animate}` } >
                            {obj.site_landing === null ? '' : 
                            <img
                                onClick={() => enlargeImage(obj.site_landing)} 
                                src={obj.site_landing} alt ="site landing"/>}
                            <img 
                                onClick={() => enlargeImage(obj.site_home)}
                                alt="site home"
                                src={obj.site_home} />
                        </div>
                        {enlarged === null ? '' :
                            <div className="overlay">
                                <img 
                                    src={closeBlack}
                                    onClick={() => setEnlarged(null)} />
                                <img src={enlarged}/>
                            </div>}
                    </div>
                ))}
            </div>
            <div id="portfolio-items">
            {portfolioDetails.map((obj, i) => (
                <div key={i}>
                    <div
                        className={`portfolio-card` }
                        key={i}>
                        <p className="portfolio-proj-title">{obj.name}</p>
                        {/*<img
                            alt="list details"
                            className="portfolio-icons" 
                        src={obj.icon}/> */}
                    </div>
                    <div className={`portfolio-site-img` } >
                        {obj.site_landing === null ? '' : 
                        <img
                            onClick={() => enlargeImage(obj.site_landing)} 
                            src={obj.site_landing} alt ="site landing"/>}
                        <img 
                            onClick={() => enlargeImage(obj.site_home)}
                            alt="site home"
                            src={obj.site_home} />
                    </div>
                    {enlarged === null ? '' :
                        <div className="overlay">
                            <img 
                                width="auto" 
                                height="auto"
                                src={closeBlack}
                                onClick={() => setEnlarged(null)} />
                            <img src={enlarged}/>
                        </div>}
                </div>
                ))}
            </div>
        </div>
    )
}
