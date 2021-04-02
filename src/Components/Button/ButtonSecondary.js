import './button.scss';


export default function ButtonSecondary(props) {
    
    const handleClick = (e) => {
        
        let ripple = e.currentTarget.childNodes[1];
        ripple.className="ripple-animate"
        setTimeout(() => { ripple.className="ripple" }, 100)
        props.click();
    }

    return (
        <button 
            onClick={handleClick}
            type={props.type}
            className="button sm secondary">
            <p>{props.name}</p>
            <span className="ripple"></span>
        </button>
    )
}