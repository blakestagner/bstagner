'use client'

import { useState, useEffect, useRef } from 'react';
import Loading from '@/components/shared/Loading';

export default function PortfolioImg(props) {
    const [loading, setLoading] = useState(true)
    const imgRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        if (imgRef.current?.complete) {
            setLoading(false);
        }
    }, [props.image])

    const imageLoading = props.imgIndex !== 0 ? 'lazy' : '';

    return (
        <div>
            {loading && <Loading />}
            <img
                ref={imgRef}
                loading={imageLoading}
                style={{ visibility: loading ? 'hidden' : 'visible' }}
                onLoad={() => setLoading(false)}
                onClick={props.click}
                alt="site home"
                src={props.image} />
        </div>
    )
}
