'use client'

import './components.scss';
import { useState, useEffect } from 'react';
import useReveal from '@/lib/useReveal';
import Calendar from '@/components/interactive/Calendar/Calendar';
import Todo from '@/components/interactive/Todo/Todo';
import MeasurementConverter from '@/components/interactive/MeasurementConverter/MeasurementConverter';
import TicTacToe from '@/components/interactive/TicTacToe/TicTacToe';
import SectionTitle from '@/components/shared/SectionTitle';

function Components() {
    const [displayComponent, setDisplayComponent] = useState(0);
    const ref = useReveal();

    return (
        <section id="components" ref={ref}>
            <div className="main-container">
                <div className="heading">
                    <SectionTitle title="Demos" />
                </div>
                <div data-reveal>
                    <ComponentsMenu
                        component={(state) => setDisplayComponent(state)} />
                    {displayComponent === 0 ?
                        <Calendar /> : ''}
                    {displayComponent === 1 ?
                        <Todo /> : ''}
                    {displayComponent === 2 ?
                        <MeasurementConverter /> : ''}
                    {displayComponent === 3 ?
                        <TicTacToe /> : ''}
                </div>
            </div>
        </section>
    )
}
export default Components;

function ComponentsMenu({ component }) {
    const [compState, setCompState] = useState(0);

    const leftRight = (direction) => {
        if (direction === 'right') {
            if (compState === 3) {
                setCompState(0)
            } else {
                setCompState(compState + 1)
            }
        } else {
            if (compState === 0) {
                setCompState(3)
            } else {
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
                if (menu.childNodes[i].className === "selected") {
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
                src='/icons/components/left.svg' />
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
                        value='3'
                        onClick={() => setCompState(3)}>TicTacToe</p>
                </div>
            </div>
            <img
                alt="right arrow"
                onClick={() => leftRight('right')}
                src='/icons/components/right.svg' />
        </div>
    )
}
