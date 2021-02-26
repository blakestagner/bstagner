import './components.scss';
import {useState, useEffect} from 'react';
import rightIcon from './img/right.svg';
import leftIcon from './img/left.svg';
import Calendar from './Calendar';
import Todo from './Todo';

function Components() {
    const [displayComponent, setDisplayComponent] = useState(0);


    return (
        <div id="components">
            <div className="main-container">
                <h1>Components</h1>
                <ComponentsMenu 
                    component={(state) => setDisplayComponent(state)}/>
                { displayComponent === 0 ? 
                    <Calendar /> : '' }
                { displayComponent === 1 ? 
                    <Todo /> : '' }
            </div>
        </div>
    )
}
export default Components;

function ComponentsMenu(props) {
    const [compState, setCompState] = useState(0);
    

    const leftRight = (direction) => {

        
        if(direction === 'right') {
            if (compState === 4) {
                setCompState(0)
            } else {
                setCompState(compState + 1)
            }

        } else {
            if (compState === 0) {
                setCompState(1)
            } 
            else { 
                setCompState(compState - 1)
            } 
        }
    }

    useEffect(() => {
        props.component(compState)
    }, [compState])

    return (
        <div id="components-menu">
            <img
                alt="left arrow"
                onClick={() => leftRight('left')}
                src={leftIcon}/>
            <div className="components-menu-inner" id="components-menu-inner">
                <div className={compState === 0 ? 'selected' : ''}>
                    <p 
                        value='0'
                        onClick={() => setCompState(0)}>calendar</p>
                </div>
                <div className={compState === 1 ? 'selected' : ''}>
                    <p 
                        value='2'
                        onClick={() => setCompState(1)}>Todo</p>
                </div>
            </div>
            <img
                alt="right arrow"
                onClick={() => leftRight('right')}
                    src={rightIcon}/>
        </div>
    )
}