import { useEffect, useState } from 'react'
import './hero.scss';
import Sun from './Sun';
import {stars} from './Stars';
import PurpleGalaxy from './PurpleGalaxy';
import GreenGalaxy from './GreenGalaxy';
import HeroText from './HeroText';
import {
    isDesktop,
    isTablet,
  } from "react-device-detect";


export default function Hero() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        stars("starfield", 500);
        setLoading(false)
    }, [])

    var windowHeight = window.innerHeight + (window.innerHeight / 4);
    var windowWidth = window.innerWidth

    const sunView = isDesktop 
        ? <Sun loading={loading}/> 
            : isTablet 
                ? <Sun loading={loading}/> : '';
    const purpleGalaxyView = isDesktop
        ? <PurpleGalaxy /> 
            : isTablet
                ? <PurpleGalaxy /> : ''
    const greenGalaxyView = isDesktop
        ? <GreenGalaxy /> 
            : isTablet
                ? <GreenGalaxy /> : ''
    return (
            <div
                id="hero" 
                className="hero">
                <span className="hero-background"></span>
                <canvas id="starfield" width={windowWidth} height={windowHeight}></canvas>
                <HeroText
                    loading={loading}/>
                {sunView}
                {purpleGalaxyView}
                {greenGalaxyView}
            </div>

    )
}