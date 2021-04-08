import {useEffect} from 'react';
import {stars} from './Stars';
export default function MobileGalaxy({loading}) {
    

    useEffect(()=> {
        stars("galaxy-stars", 500)
    }, [])
    return (
        <div className="mobile-galaxy-container">
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
    )
}

