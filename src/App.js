// App.js
import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import CarMasterPage from './Components/CarMasterPage';
import CarDetailsPage from './Components/CarDetailsPage';
import CarContext from "./Components/CarContext";
import UserDetailsPage from "./Components/UserDetailsPage";
import UserContext from "./Components/UserContext";
import UserMasterPage from "./Components/UserMasterPage";

function App() {
    const [cars, setCars] = React.useState([]);
    const [users, setUsers] = useState([]);



    return (
        <UserContext.Provider value={{data: users, setData: setUsers}}>
            <CarContext.Provider value={{data: cars, setData: setCars}}>
                <Router>
                        <Routes>
                            <Route path='/' element={<UserMasterPage/>}/>
                            <Route path='/user/:userId' element={<CarMasterPage/>}/>
                            <Route path='/user/detail/:userId' element={<UserDetailsPage/>}/>
                            <Route path='/detail/:id' element={<CarDetailsPage/>}/>
                        </Routes>
                </Router>
            </CarContext.Provider>
        </UserContext.Provider>
    );
}

export default App;
