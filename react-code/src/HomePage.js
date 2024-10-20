// HomePage.js

import React, { useContext, useState } from 'react';
import ShayariList from './ShayariList';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';

function HomePage() {
    const { user, logoutUser } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <nav className="main-nav">
                <ul className="nav-items">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {user && (
                        <li>
                            <Link to="/add-shayari">Add Shayari</Link>
                        </li>
                    )}
                </ul>

                <div className="auth-actions">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search Shayari..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    {user ? (
                        <>
                            <span>Welcome, {user.username}</span>
                            <button onClick={logoutUser} className="logout-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </nav>
            <ShayariList searchTerm={searchTerm} />
        </div>
    );
}

export default HomePage;
