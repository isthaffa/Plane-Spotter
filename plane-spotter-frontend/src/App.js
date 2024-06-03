import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from './components/NavigationBar';
import ProtectedRoute from './components/ProtectdRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PlaneDetails from './pages/PlaneDetails';
import Register from './pages/Register';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("userId");
        if (user) {
            setIsLoggedIn(true);
        }
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <div className="App">
            <NavigationBar isLoggedIn={isLoggedIn} handleSignOut={handleSignOut} />
            <Routes>
                <Route path="/" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Dashboard /></ProtectedRoute>} />
                <Route path="/plane/:id" element={<ProtectedRoute isLoggedIn={isLoggedIn}><PlaneDetails /></ProtectedRoute>} />
                <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
            </Routes>
            <ToastContainer />
        </div>
    );
}

export default App;
