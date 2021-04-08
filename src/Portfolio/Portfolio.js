import './portfolio.scss';
import {useState, useEffect} from 'react';
import PortfolioItems from './PortfolioItems';
import SectionTitle from '../Components/SectionTitle';

function Portfolio({section}) {
    const [inView, setInView] = useState(false)

    useEffect(()=> {
        if(section === 'Portfolio') {
            setInView(true)
        };
    }, [section])

    return (
        <div id="portfolio">
            <div className="main-container">
                <div className="heading">
                    <SectionTitle 
                        inView={inView}
                        title="Portfolio"/>
                </div>
                <PortfolioItems />
            </div>
        </div>
    )
}
export default Portfolio;