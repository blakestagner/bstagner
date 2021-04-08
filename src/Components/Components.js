import './components.scss';
import {useState, useEffect} from 'react';
import rightIcon from './img/right.svg';
import leftIcon from './img/left.svg';
import Calendar from './Calendar';
import Todo from './Todo';
import MeasurmentConvert from './MeasurmentConvert';
import TicTacToe from './TicTacToe';
import SectionTitle from '../Components/SectionTitle';

function Components({section}) {
    const [displayComponent, setDisplayComponent] = useState(0);
    const [inView, setInView] = useState(false)

    useEffect(()=> {
        if(section === 'Components') {
            setInView(true)
        };
    }, [section])

    return (
        <div id="components">
            <div className="main-container">
                <div className="heading">
                    <SectionTitle 
                        inView={inView}
                        title="Components"/>
                </div>
                <ComponentsMenu 
                    component={(state) => setDisplayComponent(state)}/>
                { displayComponent === 0 ? 
                    <Calendar /> : '' }
                { displayComponent === 1 ? 
                    <Todo /> : '' }
                { displayComponent === 2 ?
                    <MeasurmentConvert /> : '' }
                { displayComponent === 3 ?
                    <TicTacToe/> : ''}
            </div>
        </div>
    )
}
export default Components;

function ComponentsMenu({component}) {
    const [compState, setCompState] = useState(0);
    

    const leftRight = (direction) => {
        const menu = document.querySelector('#components-menu-inner');

        if(direction === 'right') {
            if (compState === 3) {
                setCompState(0)
            } else {
                setCompState(compState + 1)
            }

        } else {
            if (compState === 0) {
                setCompState(3)
            } 
            else { 
                setCompState(compState - 1)
            } 
        }
    }

    useEffect(() => {
        component(compState)
        const menu = document.querySelector('#components-menu-inner')
        const menuWidth = menu.scrollWidth

        const selected = () => {
            var selectedChild;
            for (let i in menu.childNodes) {
                if(menu.childNodes[i].className === "selected" ) {
                    selectedChild = menu.childNodes[i];
                    break;
                }
            }
            return selectedChild.getBoundingClientRect();
        }
        const scrollAmount = selected().x - 56
        menu.scrollTo(scrollAmount, 0)
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
                        value='1'
                        onClick={() => setCompState(1)}>Todo</p>
                </div>
                <div className={compState === 2 ? 'selected' : ''}>
                    <p 
                        value='2'
                        onClick={() => setCompState(2)}>Measurement</p>
                </div>
                <div className={compState === 3 ? 'selected' : ''}>
                    <p 
                        value='2'
                        onClick={() => setCompState(3)}>TicTacToe</p>
                </div>
            </div>
            <img
                alt="right arrow"
                onClick={() => leftRight('right')}
                    src={rightIcon}/>
        </div>
    )
}