// App.js
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MasterPage from './MasterPage';
import DetailPage from './DetailPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MasterPage/>} />
                <Route path="/detail/:id" element={<DetailPage/>} />
            </Routes>
        </Router>
    );
}

export default App;
