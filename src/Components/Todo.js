import {useState} from 'react';
import deleteIcon from './img/delete.svg';
import ButtonSm from './Button/ButtonSm'

export default function Todo() {
    const [currentItem, setCurrentItem] = useState('')
    const [list, setList] = useState(['Type some notes!'])
    const [placeholderMsg, setPlaceholderMsg] = useState('Enter a Task!')
    const [error, setError] = useState('')

    const handleInput = (e) => {
        setCurrentItem(e.target.value)
    }

    const handleSubmit = (e) => {
        if(currentItem.length === 0) {
            setError('error')
            setPlaceholderMsg('No task Given')
            setTimeout(() => {
                setError('')
                setPlaceholderMsg('Enter a Task!')
            }, 1000)
        } else {
            setList([...list, currentItem])
            setCurrentItem('')
        }
    }

    const handleDelete = (index) => {
        setList(list.filter((item, i) => i !== index))
    }

    return (
        <div>
            <div className="submit-row">
                <input
                    className={error}
                    type="text"
                    placeholder={placeholderMsg}
                    value={currentItem} 
                    onChange={handleInput}></input>
                <ButtonSm 
                    type="submit" 
                    name="add" 
                    click={error.length !== 0 ? () => {} : () => handleSubmit()}/>
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