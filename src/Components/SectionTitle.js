import {useState, useEffect} from 'react';
import './components.scss';

export default function SectionTitle({inView, title}) {

    const blueThinClass = inView === true 
        ? 'blue-strip blue-animation' : 'blue-animation';
    const headerClass = inView === true
        ? 'animate header-title-text' : 'header-title-text';
    
        return (
        <div>
            <h1 className={headerClass}>{title}</h1>
            <span className={blueThinClass}></span>
        </div>
    )
}