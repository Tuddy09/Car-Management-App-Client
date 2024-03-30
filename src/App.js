// App.js
import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MasterPage from './Components/MasterPage';
import DetailPage from './Components/DetailPage';
import CarContext from "./Components/CarContext";


function App() {
    const [data, setData] = React.useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/getCars')
            .then(response => response.json())
            .then(data => setData(data));
    }, []);
    return (
        <CarContext.Provider value={{data, setData}}>
            <Router>
                <Routes>
                    <Route path="/" element={<MasterPage/>}/>
                    <Route path="/detail/:id" element={<DetailPage/>}/>
                </Routes>
            </Router>
        </CarContext.Provider>
    );
}

export default App;
