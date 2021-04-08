export default function Sun({loading}) {

    return (
        <span id="sun" className={!loading ? 'sun-animate': ''}>
            <span className="sun" >
            </span>
            <div className="earth-orbit">
                <span id="earth" className="earth"></span>
            </div>
            <div className="mars-orbit">
                <span id="mars" className="mars"></span>
            </div>
        </span>
    )
}