import './portfolio.scss'
import bazLogo from './img/portfolio/baztheroadielogo.png';
import bazSite from './img/portfolio/baztheroadie.png';
import deanLogo from './img/portfolio/djv3.png';
import deanHome from './img/portfolio/electdeanjohnson.png'
import markLogo from './img/portfolio/mllogo4.png';
import markHome from './img/portfolio/mlhome.png';
import markLanding from './img/portfolio/ml_index.png';
import deannaLogo from './img/portfolio/deannakellerlogo.png';
import deannaHome from './img/portfolio/deannakeller.png';

import closeBlack from '../toolbar/img/close-black.svg'

import {useEffect, useState} from 'react';

export default function PortfolioItems(props) {
    const [item, setItem] = useState(0);
    const [animate, setAnimate] = useState('')
    const [enlarged, setEnlarged] = useState(null)
    const [portfolio, setPortfolio] = useState(0)

    const portfolioDetails = [
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
        console.log(img)
        setEnlarged(img)
    }
    const togglePortfolio = (direction) => {
        
        const section = document.querySelector('#portfolio-items');
        const sectionChildren = section.childNodes.length;
        const sectionChildrenWidth = section.getBoundingClientRect().width
        const sectionWidth = sectionChildrenWidth * sectionChildren;


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
            setAnimate('animate')
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
            setAnimate('animate')
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


    useEffect(() => {
        console.log(portfolio)
    }, [portfolio])

    return (
        <div className="portfolio">
            <div className="portfolio-sidenav">
                <ul>
                    {portfolioDetails.map((obj, i) => (
                        <li key={i} onClick={() => handleClick(i)}><p>{obj.name}</p></li>
                    ))}
                </ul>
            </div>
            {/*<div
                id="arrow-dekstop" 
                style={{position: 'relative'}}>
                    <i 
                        onClick={() => togglePortfolioMobile('+')}
                        className="arrow right"></i>
                    <i 
                        onClick={() => togglePortfolio('-')}
                        className="arrow left"></i>
            </div>*/}
            <div
                id="arrow-mobile" 
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