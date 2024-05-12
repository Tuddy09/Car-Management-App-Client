// CarDetailsPage.js
import React, {useContext, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import CarContext from "./CarContext";
import {BACKEND_URL} from "../Constants";


function CarDetailsPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [entity, setEntity] = useState(null);
    const {setData} = useContext(CarContext);

    useEffect(() => {
        fetch(`https://${BACKEND_URL}/car/getCar?id=${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'), // Add the token to the headers
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => setEntity(data));
    }, [id]);

    if (!entity) return <div>Entity not found</div>;

    function handleRemoveCar() {
        fetch(`https://${BACKEND_URL}/user/removeCarFromUser?carId=${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'), // Add the token to the headers
            },
            method: 'DELETE'
        })
            .then(() => {
                setData(data => data.filter(car => car.id !== id));
                navigate('/');
            })
            .catch(() => {
                //if the request fails, we do the action locally
                setData(data => data.filter(car => car.id !== id));
                navigate('/');
            })

    }

    function handleUpdateCar() {
        const form = document.querySelector('form');
        const formData = new FormData(form);
        // Create a new object from the form data
        const updatedCar = Object.fromEntries(formData);
        updatedCar.id = id;
        fetch(`https://${BACKEND_URL}/car/updateCar?id=${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'), // Add the token to the headers
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCar)
        }).then(() => {
            // Update the car in the local state
            setData(data => data.map(car => car.id === id ? updatedCar : car));
            navigate('/');
        }).catch(() => {
            //if the request fails, we do the action locally
            setData(data => data.map(car => car.id === id ? updatedCar : car));
            navigate('/');
        });
    }

    return (
        <div className='masterLayout'>
            <h1>Car Details</h1>
            <form>
                <label>Name:</label>
                <input type='text' name='name' defaultValue={entity.name}/>
                <label>Type:</label>
                <input type='text' name='type' defaultValue={entity.type}/>
                <label>Description:</label>
                <input type='text' name='description' defaultValue={entity.description}/>
                <button type='button' onClick={handleUpdateCar}>Update</button>
            </form>
            <button onClick={handleRemoveCar}>Remove</button>
        </div>
    );
}

export default CarDetailsPage;
