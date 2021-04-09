import './button.scss';


export default function ButtonIcon(props) {
    
    const handleClick = (e) => {
        let ripple = e.currentTarget.childNodes[1];
        ripple.className="ripple-animate"
        setTimeout(() => { ripple.className="ripple" }, 100)
        props.click();
    }

    return (
        <button 
            onClick={handleClick}
            className="button color icon-only"
            title={props.name}>
            <img src={props.icon} alt={props.name}/>
            <span className="ripple"></span>
        </button>
    )
}