import './portfolio.scss';
import PortfolioItems from './PortfolioItems';

function Portfolio() {

    return (
        <div id="portfolio">
            <div className="main-container">
                <div className="heading">
                    <h1>Portfolio</h1>
                    <span
                        className={''} 
                        id="blue-animation2"></span>
                </div>
                <PortfolioItems />
            </div>
        </div>
    )
}
export default Portfolio;