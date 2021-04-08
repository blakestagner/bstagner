import {useEffect} from 'react';
import {stars} from './Stars';

export default function GreenGalaxy() {
    
    useEffect(()=> {
        stars("galaxy-2-stars", 500)
    }, [])

    return (
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
    )
}

