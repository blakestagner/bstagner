import { useEffect, useState } from 'react'
import './hero.scss';
import spaceImg from './img/space.jpg';

function Hero() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        stars("starfield", 700);
        stars("galaxy-stars", 500)
        stars("galaxy-2-stars", 500)
        const section = document.querySelector('#sections');
        section.addEventListener('scroll', heroScroll)
        setLoading(false)
    }, [])


    const heroScroll = () => {
        const hero = document.querySelector('#hero');
        const heroHeight = hero.getBoundingClientRect().height;
        const heroPosition = hero.getBoundingClientRect().y;
        const headingOne = document.querySelector('#anim1');
        const headingTwo = document.querySelector('#anim2');
        const headingThree = document.querySelector('#anim3');
        const heroAnimationPercent = Math.round((((heroPosition * -1) / heroHeight) *100) *100 ) / 100;

        headingOne.style.transition = 
            'all linear 0ms';
        headingOne.style.transform = 
            `translate3d(-${heroAnimationPercent *2.5}%, 0px, 0px)`;
        headingTwo.style.transition = 
            'all linear 0ms'
        headingTwo.style.transitionDelay = 
            '0ms'
        headingTwo.style.transform = 
            `translate3d(-${heroAnimationPercent *3 }%, 0px, 0px)`;
        headingThree.style.transition = 
            'all linear 0ms'
        headingThree.style.transitionDelay = 
            '0ms'
        headingThree.style.transform = 
            `translate3d(-${heroAnimationPercent *3 }%, 0px, 0px)`;
    }


    const stars = (objId, count) => {
        let canvas = document.querySelector(`#${objId}`);
        let context = canvas.getContext("2d");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        let stars = count;
        for (var i = 0; i < stars; i++) {
            let x = Math.random() * canvas.getBoundingClientRect().width;
            let y = Math.random() * canvas.getBoundingClientRect().height,
            radius = Math.random() * 1.2;
            context.beginPath();
            context.arc(x, y, radius, 0, 360);
            context.fillStyle = "hsla(200,100%,100%,0.8)";
            context.fill();
        }
    }
    return (
            <div
                id="hero" 
                className="hero">
                <span className="hero-background"></span>
                <canvas id="starfield" width="1920" height="1920"></canvas>
                <div>
                    <div className="blake-stagner">
                        <h1 
                            id="anim1"
                            className={loading ? 'heading-1' : 'heading-animate-1'}>
                            BLAKE
                        </h1>
                        <h1
                            id="anim2"
                            className={loading ? 'heading-2' : 'heading-animate-2'}>
                            STAGNER
                        </h1>
                        <p id="anim3">
                            <span>Welcome to my</span> 
                            <span> UNIVERSE</span></p>
                    </div>
                </div>
                <span id="sun" className={!loading ? 'sun-animate': ''}>
                    <span className="sun" >
                    </span>
                    <div className="earth-orbit">
                        <span id="earth" className="earth"></span>
                    </div>
                    <div className="mars-orbit">
                        <span id="mars" className="mars"></span>
                    </div>
                </span>
                <div className="galaxy-1-container">
                    <canvas id="galaxy-stars" height="750" width="750"></canvas>
                    <div className="galaxy-1 ring">
                        <div className="galaxy-1 ring-2">
                            <div className="galaxy-1 ring-3">
                                <div className="galaxy-1 ring-4">
                                    <span className="g-tails one"></span>
                                    <span className="g-tails two "></span>
                                    <span className="g-tails three"></span>
                                    <span className="g-tails four"></span>
                                    <span className="g-tails five"></span>
                                    <span className="g-tails six"></span>
                                    <span className="g-tails seven"></span>
                                    <span className="g-tails eight"></span>
                                    <div className="galaxy-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="galaxy-2-container">
                <canvas id="galaxy-2-stars" height="550" width="550"></canvas>
                    <div className="galaxy-2 ring">
                        <div className="galaxy-2 ring-2">
                            <div className="galaxy-2 ring-3">
                                <div className="galaxy-2 ring-4">
                                    <div className="galaxy-2 center">
                                    <span className="g-tails-2 one"></span>
                                    <span className="g-tails-2 two "></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="black-hole-orbit"> 
                    <span id="black-hole" className="black-hole"></span>
                    <span className="tails one"></span>
                    <span className="tails two "></span>
                    <span className="tails three"></span>
                    <span className="tails four"></span>
                    <span className="tails five"></span>
                    <span className="tails six"></span>
                </div>
            </div>

    )
}
export default Hero;