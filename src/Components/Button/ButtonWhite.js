import './button.scss';


function ButtonWhite(props) {
    
    const handleClick = (e) => {
        
        let ripple = e.currentTarget.childNodes[2];
        ripple.className="ripple-animate"
        setTimeout(() => { ripple.className="ripple" }, 100)
        props.click();
    }

    return (
        <button 
            onClick={handleClick}
            className="button md icon white center">
            <img src={props.icon} alt={props.name}/>
            <p>{props.name}</p>
            <span className="ripple"></span>
        </button>
    )
}
export default ButtonWhite;