import { useEffect, useState } from 'react'
import './hero.scss';
import ButtonMd from '../Components/Button/ButtonMd'

function Hero() {
    const [loading, setLoading] = useState(true);
    const [intro, setIntro] = useState('');
    const [introCount, setIntroCount] = useState();
    const [introDetails, setIntroDetails] = useState('');


    const handleClick = () => {
        const footer = document.querySelector('#footer')
         footer.scrollIntoView(true);
    }

    const introText = "Who's Blake?";


    const circleAnimation = () => {
        const one = document.querySelector('#circle-1');
        const two = document.querySelector('#circle-2');
        const x = () => { return Math.floor(Math.random() * Math.floor(70)) };
        const y = () => { return Math.floor(Math.random() * Math.floor(60))};
        const size = () => {return Math.round(( (Math.random() * (1500 - 500) + 500) * .001) * 100) / 100}


        const getRandomInt = () => {
            one.style.transform = `translate(${x().toString()}vw, ${y().toString()}vh) scale(${size()})`;
            two.style.transform = `translate(${y().toString()}vw, ${x().toString()}vh) scale(${size()})`;
            
        }

        setInterval(() => {
            getRandomInt()
        }, 5000)
        getRandomInt()
    }



    useEffect(() => {
        setLoading(false)
        setTimeout(() => { setIntroCount(0) }, 1000)
        circleAnimation()
    }, [])

    useEffect(() => {
        if(intro.length === introText.length) {
            setIntroCount(introText.length -1)
        }
        else if( introCount < introText.length) {
            setIntro(intro =>  [...intro, introText.charAt(introCount) ])
        }
    }, [introCount])

    useEffect(() => {
        
        if(intro.length !== introText.length) {
            setTimeout(() => {setIntroCount(introCount + 1)}, 25)
        }
        if(introCount === introText.length - 1) {
            setIntroDetails(['Front End Developer', 'Web Designer', 'Web Wizard'])
        }
    }, [intro])


    const heroScroll = () => {
        const hero = document.querySelector('#hero');
        const heroHeight = hero.offsetHeight;
        const heroPosition = hero.getBoundingClientRect().y;
        const headingOne = document.querySelector('#anim1');
        const headingTwo = document.querySelector('#anim2');
        const headingThree = document.querySelector('#anim3');
        const blueStrip = document.querySelector('#blue-animation');
        const heroAnimationPercent = Math.round((((heroPosition * -1) / heroHeight) *100) *100 ) / 100;


        headingOne.style.transition = 'all linear 0ms'
        headingOne.style.transform = 
            `translate3d(-${heroAnimationPercent *2.5}%, 0px, 0px)`;
        //headingOne.style.fontSize = `calc(${((100 - heroAnimationPercent)) / 10}em)`

        headingTwo.style.transition = 'all linear 0ms'
        headingTwo.style.transitionDelay = '0ms'
        headingTwo.style.transform = 
            `translate3d(-${heroAnimationPercent *3 }%, 0px, 0px)`;

        headingThree.style.transition = 'all linear 0ms'
        headingThree.style.transitionDelay = '0ms'
        headingThree.style.transform = 
            `translate3d(${heroAnimationPercent * 3}%, 0px, 0px)`;
        

        blueStrip.style.transition = 'all linear 0ms'
        blueStrip.style.transitionDelay = '0ms'
        blueStrip.style.transform = 
            `translate3d(-${heroAnimationPercent * 1}%, 0px, 0px)`;
    }

    window.addEventListener('load', () => {
        const section = document.querySelector('#sections');
        section.addEventListener('scroll', heroScroll)
    })


    
    return (
            <div
                id="hero" 
                className="hero">
                <span className="hero-background"></span>
                <div>
                    <div className="blake-stagner">
                        <h1 
                            id="anim1"
                            className={loading ? 'heading-1' : 'heading-animate-1'}>
                            Blake
                        </h1>
                        <h1
                            id="anim2"
                            className={loading ? 'heading-2' : 'heading-animate-2'}>
                            Stagner
                        </h1>
                        <span
                            className={loading ? 'blue-strip' : ''} 
                            id="blue-animation"></span>
                    </div>
                </div>
                <div>
                    <div
                        id="anim3" 
                        className={loading ? 'glass-box glass-box-transform' : 'glass-box'}>
                        <div>
                            <p>{intro}</p>
                            <span 
                                className={introDetails.length > 0 ? 
                                    'details-text'
                                    : 'details-animate'}>
                                <p>{introDetails[0]}</p>
                                <p>{introDetails[1]}</p>
                                <p>{introDetails[2]}</p>
                            </span>
                            
                        </div>
                        <div className="ring"></div>
                    </div>
                </div>
                <span id="circle-1" className="circle-1"></span>
                <span id="circle-2" className="circle-2"></span>
                <span id="circle-3" className="circle-3"></span>
            </div>

    )
}
export default Hero;