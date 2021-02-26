import {useEffect, useState} from 'react';
import deleteIcon from './img/delete.svg';
import ButtonSm from './Button/ButtonSm'

export default function Todo() {
    const [currentItem, setCurrentItem] = useState('')
    const [list, setList] = useState(['Type some notes!'])
    const [completed, setCompleted] = useState([])

    const handleInput = (e) => {
        console.log(e.target.value)
        setCurrentItem(e.target.value)
    }

    const handleSubmit = (e) => {
        
        setList([...list, currentItem])
        setCurrentItem('')
    }

    const handleDelete = (index) => {
        console.log(index)
        setList(list.filter((item, i) => i !== index))
    }

    useEffect(() => {
        console.log(list.length)
    }, [list])

    return (
        <div>
            <div className="submit-row">
                <input 
                    type="text" 
                    placeholder="Enter task"
                    value={currentItem} 
                    onChange={handleInput}></input>
                <ButtonSm 
                    type="submit" 
                    name="add" 
                    click={() => handleSubmit()}/>
            </div>
            <ul id="notes">
            {list.map((items, i) => (
                <li 
                    className="note"
                    key={i}>
                    <span>
                        <span>{i+1}</span><span>{items}</span></span>
                    <img
                        src={deleteIcon} 
                        onClick={() => handleDelete(i)} />
                </li>
            ))}
            </ul>
        </div>
    )
}