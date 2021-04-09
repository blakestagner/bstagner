import {useState, useEffect} from 'react';
import Loading from '../Components/Loading';

export default function PortfolioImg(props) {
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        if(props.image) {
            setLoading(true);
        }
    }, [props.image])

    return (
        <div>
            {
                loading ?
                    <div className="portfolio-placeholder"> 
                        <Loading />
                        <img
                            style={{visibility: "hidden"}}
                            onLoad={() => setLoading(false)}
                            loading={props.imgIndex !== 0 ? 'Lazy' : ''}
                            onClick={props.click}
                            alt="site home"
                            src={props.image} /> 
                    </div> 
                    :
                    <img
                        onLoad={() => setLoading(false)}
                        onClick={props.click}
                        alt="site home"
                        src={props.image} /> 
            }
        </div>
    )

}