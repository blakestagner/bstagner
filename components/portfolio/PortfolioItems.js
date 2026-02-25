'use client'

import './portfolio.scss';
import { useState, useEffect } from 'react';
import PortfolioImg from './PortfolioImg';

const portfolioDetails = [
    {
        name: 'The Charmed Creative',
        site_home: '/images/portfolio/thecharmedcreative.webp',
        site_landing: null,
    },
    {
        name: 'My Wedding',
        site_home: '/images/portfolio/wedding.webp',
        site_landing: null,
    },
    {
        name: 'Sound Medical',
        site_home: '/images/portfolio/soundMedical.webp',
        site_landing: null,
    },
    {
        name: 'Dean Johnson',
        site_home: '/images/portfolio/electdeanjohnson.webp',
        site_landing: null,
    },
    {
        name: 'Baz the Roadie',
        site_home: '/images/portfolio/baztheroadie.webp',
        site_landing: null,
    },
    {
        name: 'Mark Lindquist',
        site_home: '/images/portfolio/mlhome.webp',
        site_landing: null,
    },
    {
        name: 'Deanna Keller',
        site_home: '/images/portfolio/deannakeller.webp',
        site_landing: null,
    },
];

export default function PortfolioItems() {
    const [item, setItem] = useState(0);
    const [animate, setAnimate] = useState('');
    const [enlarged, setEnlarged] = useState(null);

    const handleClick = (i) => {
        setAnimate('animate');
        setTimeout(() => {
            setItem(i);
            setAnimate('');
        }, 500);
    };

    const enlargeImage = (img) => {
        setEnlarged(img);
    };

    const togglePortfolio = (direction) => {
        const section = document.querySelector('#portfolio-items');
        const sectionChildrenWidth = section.getBoundingClientRect().width;

        let carouselPositions = [];
        document.querySelectorAll('#portfolio-items > div').forEach(function (div) {
            let child = div.getBoundingClientRect();
            carouselPositions.push([child.left]);
        });

        for (let i in carouselPositions) {
            if (carouselPositions[i] > -100 && carouselPositions[i] < 100) {
            }
        }

        const nextBefore = (num) => {
            const section = document.querySelector('#portfolio-items');
            section.scrollTo({
                left: num * sectionChildrenWidth,
                behavior: 'smooth',
            });
        };

        const nextItem = () => {
            if (item > 5) {
                setItem(0);
                nextBefore(0);
            } else {
                nextBefore(item + 1);
                setItem(item + 1);
            }
        };

        const beforeItem = () => {
            if (item === 0) {
                nextBefore(6);
                setItem(6);
            } else {
                nextBefore(item - 1);
                setItem(item - 1);
            }
        };

        direction === '+' ? nextItem() : beforeItem();
    };

    const swipePortfolio = () => {
        let carouselPositions = [];
        document.querySelectorAll('#portfolio-items > div').forEach(function (div) {
            let child = div.getBoundingClientRect();
            carouselPositions.push([child.left]);
        });
        for (let i in carouselPositions) {
            if (carouselPositions[i] > -100 && carouselPositions[i] < 100) {
                setItem(parseInt(i));
            }
        }
    };

    useEffect(() => {
        const portfolioSwipe = document.querySelector('#portfolio-items');
        if (portfolioSwipe) {
            portfolioSwipe.addEventListener('scroll', swipePortfolio, false);
            return () => {
                portfolioSwipe.removeEventListener('scroll', swipePortfolio, false);
            };
        }
    }, []);

    return (
        <div className='portfolio'>
            {enlarged !== null && (
                <div className='overlay'>
                    <img
                        src='/icons/toolbar/close-black.svg'
                        alt='close'
                        onClick={() => setEnlarged(null)}
                    />
                    <img src={enlarged} alt='enlarge' />
                </div>
            )}
            <div className='portfolio-sidenav'>
                <ul>
                    {portfolioDetails.map((obj, i) => (
                        <li key={i} onClick={() => handleClick(i)}>
                            <p className={item === i ? 'active' : ''}>{obj.name}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div id='arrow' style={{ position: 'relative' }}>
                <div onClick={() => togglePortfolio('+')} className='arrow right'></div>
                <div onClick={() => togglePortfolio('-')} className='arrow left'></div>
            </div>
            <div className='portfolio-details'>
                {portfolioDetails
                    .filter((obj, i) => i === item)
                    .map((obj) => (
                        <div key={obj.name}>
                            <div className={`portfolio-card ${animate}`}>
                                <p className='portfolio-proj-title'>{obj.name}</p>
                            </div>
                            <div className={`portfolio-site-img ${animate}`}>
                                <PortfolioImg
                                    imgIndex={0}
                                    click={() => enlargeImage(obj.site_home)}
                                    image={obj.site_home}
                                />
                            </div>
                        </div>
                    ))}
            </div>
            <div id='portfolio-items'>
                {portfolioDetails.map((obj, i) => (
                    <div key={obj.name}>
                        <div className={`portfolio-card`}>
                            <p className='portfolio-proj-title'>{obj.name}</p>
                        </div>
                        <div className={`portfolio-site-img`}>
                            <PortfolioImg
                                imgIndex={i}
                                click={() => enlargeImage(obj.site_home)}
                                image={obj.site_home}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
