// App.js
import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MasterPage from './Components/MasterPage';
import DetailPage from './Components/DetailPage';
import CarContext from "./Components/CarContext";
import {io} from "socket.io-client";

function App() {
    const [data, setData] = React.useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/getCars')
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
        const socket = io('http://localhost:9092');
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
        socket.on('connect_timeout', () => {
            console.error('Connection timeout');
        });
        socket.on('newCar', (newCar) => {
            setData(prevData => [...prevData, newCar]);
            console.log('New car added!', newCar)
        });
        return () => {
            socket.disconnect();
        };
    }, [setData]);

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
