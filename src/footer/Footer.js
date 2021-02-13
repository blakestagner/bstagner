import React from 'react';
import './footer.scss';

import fbookIcon from './social/facebook_white.png';
import inIcon from './social/In-White.png';

function Footer() {
    return (
        <div className='footer' id="footer">
            <div className='footer-1'>
                <div>
                    <div>
                        <h2>Location</h2>
                        <h3>Tacoma, WA</h3>
                    </div>
                    <div>
                        <h2>Around the Web</h2>
                        <a 
                            href="https://www.linkedin.com/in/blakestagner/"
                            target="_blank"
                            aria-label="Linkedin Link">

                            <img
                                className="social-icon" 
                                src={inIcon} 
                                alt="linkedin" />
                        </a>
                        <a 
                            href="https://www.facebook.com/StagnerBlake"
                            target="_blank"
                            aria-label="fbook in Link">
                            <img
                                className="social-icon" 
                                src={fbookIcon} 
                                alt="facebook Link" />
                        </a>
                    </div>
                </div>
            </div>
            <div className='footer-2'>
                <p>Copyright© BlakeStagner@gmail.com</p>
            </div>
        </div>
    )
}
export default Footer;