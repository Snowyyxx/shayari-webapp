import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className='main-nav'>
            <ul>
                <li>
                    <Link to="/add-shayari">Add Shayari</Link>
                </li>
                <li>
                    <Link to="/">Home</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
