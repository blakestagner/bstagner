'use client'

import { useState, useEffect } from 'react';
import ButtonSm from '@/components/ui/ButtonSm'

export default function Todo({ persistData = false }) {
    const [currentItem, setCurrentItem] = useState('')
    const [list, setList] = useState(['Type some notes!'])
    const [placeholderMsg, setPlaceholderMsg] = useState('Enter a Task!')
    const [error, setError] = useState('')

    // Load from localStorage if persistData is enabled
    useEffect(() => {
        if (persistData && typeof window !== 'undefined') {
            const saved = localStorage.getItem('todos')
            if (saved) {
                setList(JSON.parse(saved))
            }
        }
    }, [persistData])

    // Save to localStorage when list changes
    useEffect(() => {
        if (persistData && typeof window !== 'undefined') {
            localStorage.setItem('todos', JSON.stringify(list))
        }
    }, [list, persistData])

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

    const deleteIcon = '/icons/components/delete.svg';

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
                        onClick={() => handleDelete(i)}
                        alt="Delete" />
                </li>
            ))}
            </ul>
        </div>
    )
}
