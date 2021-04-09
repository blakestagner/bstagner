import {useState, useEffect} from 'react';
import Loading from '../Components/Loading';

export default function PortfolioImg(props) {
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        if(props.image) {
            setLoading(true);
        }
        console.log(props.imgIndex)
    }, [props.image])

    const imageLoading = props.imgIndex !== 0 ? 'lazy' : ''; 

    return (
        <div>
            {
                loading ?
                    <div className="portfolio-placeholder"> 
                        <Loading />
                        <img
                            loading={imageLoading}
                            style={{visibility: "hidden"}}
                            onLoad={() => setLoading(false)}
                            onClick={props.click}
                            alt="site home"
                            src={props.image} /> 
                    </div> 
                    :
                    <img
                        loading={imageLoading}
                        onLoad={() => setLoading(false)}
                        onClick={props.click}
                        alt="site home"
                        src={props.image} /> 
            }
        </div>
    )

}