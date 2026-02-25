'use client'

import { useEffect, useState } from 'react'
import './hero.scss'
import Sun from './Sun'
import { stars } from './Stars'
import PurpleGalaxy from './PurpleGalaxy'
import GreenGalaxy from './GreenGalaxy'
import HeroText from './HeroText'
import {
    isDesktop,
    isTablet,
} from "react-device-detect"

export default function Hero() {
    const [loading, setLoading] = useState(true)
    const [windowHeight, setWindowHeight] = useState(0)
    const [windowWidth, setWindowWidth] = useState(0)

    useEffect(() => {
        setWindowHeight(window.innerHeight + (window.innerHeight / 4))
        setWindowWidth(window.innerWidth)
        setLoading(false)
    }, [])

    useEffect(() => {
        if (windowWidth > 0 && windowHeight > 0) {
            stars("starfield", 500)
        }
    }, [windowWidth, windowHeight])

    const sunView = isDesktop
        ? <Sun loading={loading} />
            : isTablet
                ? <Sun loading={loading} /> : ''
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
            <HeroText loading={loading} />
            {sunView}
            {purpleGalaxyView}
            {greenGalaxyView}
        </div>
    )
}
