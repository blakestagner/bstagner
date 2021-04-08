import {useState} from 'react';

import ButtonSm from './Button/ButtonSm'

export default function MeasurmentConvert() {
    const [input, setInput] = useState('');
    const [placeholderMsg, setPlaceholderMsg] = useState('Enter a Number')
    const [error, setError] = useState('');
    const [from, setFrom] = useState('');
    const [too, setToo] = useState('');
    const [conversion, setConversion] = useState('');

    const handleInput = (e) => {
        setInput(e.target.value)
    }

    const convert = () => {
        const resetError = () => {
            setTimeout(() => {
                setError('')
            }, 1000)
        }
        var reg = new RegExp('^[0-9]+$');
        let inputNumber = reg.test(input)

        if( input.length === 0 ) {
            setError('Input is Empty...')
            resetError()
        } else if (input.length > 1 && inputNumber === false) {
            setError('Input is not a number...')
            resetError()
        } else if (too.length === 0 || from.length === 0) {
            setError('Unit is Empty...')
            resetError()
        } else {
            inputNumber = parseInt(input)

            if(from === too) {
                setError('Units are the same...')
                resetError()
            } else if(from === 'ft') {
                if(too === "m") {
                    var ans = Math.round((inputNumber / 3.281) * 1000) / 1000
                    setConversion(`${inputNumber} feet is equal to ${ans} meters`)
                } else if(too === "mi") {
                    var ans = Math.round((inputNumber / 5280) * 100000) / 100000
                    setConversion(`${inputNumber} feet is equal to ${ans} mile`)
                } else {
                    var ans = Math.round((inputNumber / 3281) * 100000) / 100000
                    setConversion(`${inputNumber} feet is equal to ${ans} kilometer`)
                }
            } else if (from === "m") {
                if (too === "ft") {
                    var ans = Math.round((inputNumber * 3.281) * 1000) / 1000
                    setConversion(`${inputNumber} meter is equal to ${ans} foot`)
                } else if(too === "mi") {
                    var ans = Math.round((inputNumber / 1609) * 10000) / 10000
                    setConversion(`${inputNumber} meter is equal to ${ans} mile`)
                } else {
                    var ans = Math.round((inputNumber / 1000) * 10000) / 10000
                    setConversion(`${inputNumber} meter is equal to ${ans} kilometer`)
                }
            } else if(from === "mi"){
                if (too === "ft") {
                    var ans = Math.round((inputNumber * 5280) * 100000) / 100000
                    setConversion(`${inputNumber} mile is equal to ${ans} foot`)
                } else if(too === "m") {
                    var ans = Math.round((inputNumber * 1609) * 100) / 100
                    setConversion(`${inputNumber} mile is equal to ${ans} meter`)
                } else {
                    var ans = Math.round((inputNumber * 1.609) * 1000) / 1000
                    setConversion(`${inputNumber} mile is equal to ${ans} kilometer`)
                }
            } else {
                if (too === "ft") {
                    var ans = Math.round((inputNumber * 3281) * 1000) / 1000
                    setConversion(`${inputNumber} kilometer is equal to ${ans} foot`)
                } else if(too === "m") {
                    var ans = Math.round((inputNumber * 1000) * 1000) / 1000
                    setConversion(`${inputNumber} kilometer is equal to ${ans} meter`)
                } else if(too === "mi") {
                    var ans = Math.round((inputNumber / 1.609) * 1000) / 1000
                    setConversion(`${inputNumber} kilometer is equal to ${ans} mile`)
                }
            }
        }
    }

    const reset = () => {
        setPlaceholderMsg('Enter a Number')
        setFrom('Select')
        setToo('Select')
        setConversion('')
        setError('')
        setFrom('')
        setInput('')
        var fromSelect = document.querySelector('#from-unit')
        var tooSelect = document.querySelector('#too-unit')
        fromSelect.value = 'select';
        tooSelect.value = 'select'

    }

    return (
        <div>
            <input
                type="text"
                placeholder={placeholderMsg}
                value={input} 
                onChange={handleInput}></input>
            <div className="submit-row">    
                <label className="units" htmlFor="from-unit">From:</label>
                <select 
                    name="from-unit" 
                    id="from-unit" 

                    onChange={(e) => { setFrom(e.target.value)}}>
                    <option value="select" default>Select</option>
                    <option value="ft">foot</option>
                    <option value="m">meter</option>
                    <option value="mi">mile</option>
                    <option value="km">kilometer</option>
                </select>
                <label className="units" htmlFor="too-unit">Too:</label>
                <select 
                    name="too-unit" 
                    id="too-unit"
                    onChange={(e) => { setToo(e.target.value)}}>
                    <option value="select" default>Select</option>
                    <option value="ft">foot</option>
                    <option value="m">meter</option>
                    <option value="mi">mile</option>
                    <option value="km">kilometer</option>
                </select>
            </div>
            <div className="submit-row"> 
            <ButtonSm 
                    type="submit" 
                    name="convert" 
                    click={() => convert() }
                    />
            </div>
            <p className="error">{error}</p>
            <div className="submit-row"> 
                <p className="conversion-result">{conversion}</p>
                {conversion.length === 0 ? '' :
                    <ButtonSm 
                        type="submit" 
                        name="reset" 
                        click={() => reset() }
                        />
                }
            </div>
        </div>
    )
}