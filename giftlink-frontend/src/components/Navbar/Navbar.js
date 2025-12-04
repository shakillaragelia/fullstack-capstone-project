import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate = useNavigate();

    // Check session storage on load
    useEffect(() => {
        const authTokenFromSession = sessionStorage.getItem('auth-token');
        const nameFromSession = sessionStorage.getItem('name');

        if (authTokenFromSession) {
            if (isLoggedIn && nameFromSession) {
                setUserName(nameFromSession);
            } else {
                // Invalid login → clear session
                sessionStorage.removeItem('auth-token');
                sessionStorage.removeItem('name');
                sessionStorage.removeItem('email');
                setIsLoggedIn(false);
            }
        }
    }, [isLoggedIn, setIsLoggedIn, setUserName]);

    // Logout
    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
        navigate('/app');
    };

    const profileSection = () => {
        navigate('/app/profile');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/app">GiftLink</Link>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav">

                    {/* Static links */}
                    <li className="nav-item">
                        <Link className="nav-link" to="/home.html">Home</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Gifts</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/app/search">Search</Link>
                    </li>

                    {/* Right-side auth section */}
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <span
                                    className="nav-link"
                                    style={{ color: "black", cursor: "pointer" }}
                                    onClick={profileSection}
                                >
                                    Welcome, {userName}
                                </span>
                            </li>

                            <li className="nav-item">
                                <button className="nav-link login-btn" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link login-btn" to="/app/login">Login</Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link register-btn" to="/app/register">Register</Link>
                            </li>
                        </>
                    )}

                </ul>
            </div>
        </nav>
    );
}
