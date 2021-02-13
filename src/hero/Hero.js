import { useEffect, useState } from 'react'
import './hero.scss';
import ButtonMd from '../Components/Button/ButtonMd'

function Hero() {
    const [loading, setLoading] = useState(true);
    const [intro, setIntro] = useState('');
    const [introCount, setIntroCount] = useState();
    const [introDetails, setIntroDetails] = useState('') 

    const handleClick = () => {
        const footer = document.querySelector('#footer')
         footer.scrollIntoView(true);
    }

    const introText = "Who's Blake?";

    useEffect(() => {
        setLoading(false)
        setTimeout(() => { setIntroCount(0) }, 1000)
    }, [])

    useEffect(() => {
        if(intro.length === introText.length) {
            setIntroCount(introText.length -1)
        }
        else if( introCount < introText.length) {
            setIntro(intro =>  [...intro, introText.charAt(introCount) ])
        }
    }, [introCount])

    useEffect(() => {
        
        if(intro.length !== introText.length) {
            setTimeout(() => {setIntroCount(introCount + 1)}, 50)
        }
        if(introCount === introText.length - 1) {
            setIntroDetails(['Front End Developer', 'Web Designer', 'Web Wizard'])
        }
    }, [intro])

    return (
        <div id="hero">
            <span className="circle-1"></span>
            <span className="circle-2"></span>
            <div className="hero">
                <div>
                    <div className="blake-stagner">
                        <h1 
                            className={loading ? 'heading-1' : 'heading-animate-1'}>
                            Blake
                        </h1>
                        <h1
                            className={loading ? 'heading-2' : 'heading-animate-2'}>
                            Stagner
                        </h1>
                    </div>
                </div>
                <div>
                    <div className={loading ? 'glass-box glass-box-transform' : 'glass-box'}>
                        <div>
                            <p>{intro}</p>
                            <span 
                                className={introDetails.length > 0 ? 
                                    'details-text'
                                    : 'details-animate'}>
                                <p>{introDetails[0]}</p>
                                <p>{introDetails[1]}</p>
                                <p>{introDetails[2]}</p>
                            </span>
                        </div>
                        <div>
                            <ButtonMd
                                click={() => handleClick()}
                                name="contact"
                                />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Hero;