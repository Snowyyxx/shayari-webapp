// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import HomePage from './HomePage';
import Login from './Login';
import Register from './Register';
import ShayariDetail from './ShayariDetail'; // Import the new component
import AddShayari from './AddShayari'; // Import AddShayari separately
import './styles.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/add-shayari" element={<AddShayari />} />
                    <Route path="/shayari/:id" element={<ShayariDetail />} />
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
