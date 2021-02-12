import './button.scss';


function ButtonMd(props) {
    
    const handleClick = (e) => {
        
        let ripple = e.currentTarget.childNodes[1];
        ripple.className="ripple-animate"
        setTimeout(() => { ripple.className="ripple" }, 100)
        props.click();
    }

    return (
        <button 
            onClick={handleClick}
            className="button md">
            <p>{props.name}</p>
            <span className="ripple"></span>
        </button>
    )
}
export default ButtonMd;