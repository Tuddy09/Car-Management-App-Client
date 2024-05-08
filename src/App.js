// App.js
import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import CarMasterPage from './Components/CarMasterPage';
import CarDetailsPage from './Components/CarDetailsPage';
import CarContext from "./Components/CarContext";
import UserDetailsPage from "./Components/UserDetailsPage";
import UserContext from "./Components/UserContext";
import UserMasterPage from "./Components/UserMasterPage";
import LoginDialog from "./Components/Login";

function App() {
    const [cars, setCars] = React.useState([]);
    const [users, setUsers] = useState([]);
    const [showLoginDialog, setShowLoginDialog] = useState(true);

    function handleLogin(username, password) {
        // Add your login logic here
        console.log(`Logging in with ${username} and ${password}`);
        fetch(`https://mpp-backend-422621.lm.r.appspot.com/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password})
        }).then(response => {
            // store the token in the local storage
            if (response.status !== 200) {
                throw new Error("HTTP status " + response.status);
            }
            return response.json();
        }).then(data => {
            localStorage.setItem('token', data.token);
        })
            // wait for the token to be stored
            .then(() => {
                // close the dialog
                setShowLoginDialog(false);
            }).catch(() => {
            alert('Invalid username or password')
        });
    }

    function handleRegister(username, password) {
        // Add your register logic here
        console.log(`Registering with ${username} and ${password}`);
        fetch(`https://mpp-backend-422621.lm.r.appspot.com/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password})
        }).then(response => {
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
            return response.json();
        }).then(data => {
            console.log(data);
        }).catch(() => {

        });
    }

    return (
        <UserContext.Provider value={{data: users, setData: setUsers}}>
            <CarContext.Provider value={{data: cars, setData: setCars}}>
                <Router>
                    {showLoginDialog ? (
                        <LoginDialog onLogin={handleLogin} onRegister={handleRegister}/>
                    ) : (
                        <Routes>
                            <Route path='/' element={<UserMasterPage/>}/>
                            <Route path='/user/:userId' element={<CarMasterPage/>}/>
                            <Route path='/user/detail/:userId' element={<UserDetailsPage/>}/>
                            <Route path='/detail/:id' element={<CarDetailsPage/>}/>
                        </Routes>
                    )}
                </Router>
            </CarContext.Provider>
        </UserContext.Provider>
    )
}

export default App;