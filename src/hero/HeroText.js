import {useEffect} from 'react'; 
import MobileGalaxy from './MobileGalaxy';
import {
    BrowserView,
    MobileView,
    isDesktop,
    isTablet,
    isMobile
  } from "react-device-detect";

export default function HeroText({loading}) {

    useEffect(() => {
        const section = document.querySelector('#sections');
        section.addEventListener('scroll', heroScroll)
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

    const headingBlakeStagner = isDesktop
        ? 'blake-stagner'
            : isTablet
                ? 'blake-stagner' : 'blake-stagner blake-stagner-mobile'

    const headingBlake =  isDesktop 
        ? 'heading-animate-1 heading-transition'
            : isTablet 
                ? 'heading-animate-1 heading-transition' : 'heading-animate-1';
    const headingStagner = isDesktop 
        ? 'heading-animate-2 heading-transition'
            : isTablet 
                ? 'heading-animate-2 heading-transition' : 'heading-animate-2';


    const headingWelcome = isDesktop 
        ? "welcome-text heading-sub-text" 
            : isTablet 
                ? "welcome-text heading-sub-text" : 'welcome-text-mobile';


    const headingUniverse = isDesktop 
        ? 'universe-text-glow heading-sub-text-2'
            : isTablet 
                ? 'universe-text-glow heading-sub-text-2' : "universe-text-glow heading-sub-text-mobile";

    const mobileGalaxyView = isDesktop 
        ? '' : isTablet ? '' : <MobileGalaxy />

    return (
        <div>
            <div className={headingBlakeStagner}>
                <h1
                    id="anim1"
                    className={loading ? 'heading-1' : headingBlake}>
                    BLAKE
                </h1>
                <h1
                    id="anim2"
                    className={loading ? 'heading-2' : headingStagner}>
                    STAGNER
                </h1>
                <p id="anim3">
                    <span className={headingWelcome}>Welcome to my</span> 
                    <span className={headingUniverse}> UNIVERSE</span>
                </p>
            </div>
            {mobileGalaxyView}
        </div>
    )
}