// App.js
import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MasterPage from './Components/MasterPage';
import DetailPage from './Components/DetailPage';
import CarContext from "./Components/CarContext";
import LoginDialog from "./Components/SignInPage";
import User from "./Components/User";
import UserContext from "./Components/UserContext";

function App() {
    const [data, setData] = React.useState([]);
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(true);

    const handleLogin = (username, password) => {
        // check if username and password are not empty
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        fetch('http://localhost:8080/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.success) {
                alert('Login successful');
            } else {
                alert('New user created successfully!');
            }
            setUser({id: data.id, name: username, password: password})
            setShowLogin(false);
            // Fetch user cars after successful login
            fetch(`http://localhost:8080/user/getCarsByUserId?userId=${data.id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("HTTP status " + response.status);
                    }
                    return response.json();
                })
                .then(data => setData(data))
                .catch(error => {
                    console.error('There was an error!', error);
                    alert('Failed to fetch cars. Please check your internet connection or try again later.');
                });
        }).catch(error => {
            console.error('There was an error!', error);
            alert('Invalid username or password');
        });
    };

    return (
        <UserContext.Provider value={{user, setUser}}>
            <CarContext.Provider value={{data, setData}}>
                <Router>
                    {showLogin ? (
                        <LoginDialog onLogin={handleLogin}/>
                    ) : (
                        <Routes>
                            <Route path="/" element={<MasterPage/>}/>
                            <Route path="/detail/:id" element={<DetailPage/>}/>
                            <Route path="/user" element={<User/>}/>
                        </Routes>
                    )}
                </Router>
            </CarContext.Provider>
        </UserContext.Provider>
    );
}

export default App;
