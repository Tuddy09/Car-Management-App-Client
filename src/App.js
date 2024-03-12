// App.js
import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MasterPage from './MasterPage';
import DetailPage from './DetailPage';
import mockData from "./constants";

function App() {
    const [cars, setCars] = useState(mockData);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MasterPage data={cars} setData={setCars}/>} />
                <Route path="/detail/:id" element={<DetailPage data={cars} setData={setCars}/>} />
            </Routes>
        </Router>
    );
}

export default App;
