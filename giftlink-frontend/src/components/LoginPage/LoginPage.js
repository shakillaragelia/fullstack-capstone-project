import React, { useState, useEffect } from 'react';
import './LoginPage.css';

import { urlConfig } from '../../config';             // Step 1
import { useAppContext } from '../../context/AuthContext'; // Step 1
import { useNavigate } from 'react-router-dom';       // Step 1

function LoginPage() {

    // States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Step 1 – Task 4
    const [incorrect, setIncorrect] = useState('');

    // Step 1 – Task 5
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('auth-token');
    const { setIsLoggedIn } = useAppContext();

    // Step 1 – Task 6: redirect jika sudah login
    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);

    // =====================================
    //             HANDLE LOGIN
    // =====================================
    const handleLogin = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            // Step 2 – Task 1: Ambil JSON response
            const json = await response.json();
            console.log("Login Response:", json);

            // Step 2 – Task 2: Jika login sukses
            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);

                // Step 2 – Task 3
                setIsLoggedIn(true);

                // Step 2 – Task 4
                navigate('/app');
                return;
            }

            // Step 2 – Task 5: Jika password salah
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            setIncorrect("Wrong password. Try again.");

            // Optional: reset error setelah 2 detik
            setTimeout(() => {
                setIncorrect("");
            }, 2000);

        } catch (e) {
            console.log("Error fetching details: " + e.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        {/* Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* ERROR MESSAGE (Task 6) */}
                        <span style={{
                            color: 'red',
                            height: '.5cm',
                            display: 'block',
                            fontStyle: 'italic',
                            fontSize: '12px'
                        }}>
                            {incorrect}
                        </span>

                        {/* Password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Login button */}
                        <button
                            className="btn btn-primary w-100 mb-3"
                            onClick={handleLogin}
                        >
                            Login
                        </button>

                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
