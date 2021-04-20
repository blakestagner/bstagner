import './button.scss';


export default function ButtonFooter(props) {
    
    const handleClick = (e) => {
        let ripple = e.currentTarget.childNodes[1];
        ripple.className="ripple-animate"
        setTimeout(() => { ripple.className="ripple" }, 100)
        props.click();
    }

    return (
        <button 
            onClick={handleClick}
            className="button white icon-only fixed"
            title={props.name}>
            <img src={props.icon} alt={props.name}/>
            <span className="ripple"></span>
        </button>
    )
}