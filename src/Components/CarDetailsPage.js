// CarDetailsPage.js
import React, {useContext, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import CarContext from "./CarContext";


function CarDetailsPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [entity, setEntity] = useState(null);
    const {setData} = useContext(CarContext);

    useEffect(() => {
        fetch(`http://localhost:8080/car/getCar?id=${id}`)
            .then(response => response.json())
            .then(data => setEntity(data));
    }, [id]);

    if (!entity) return <div>Entity not found</div>;

    function handleRemoveCar() {
        fetch(`http://localhost:8080/user/removeCarFromUser?carId=${id}`, {
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
        fetch(`http://localhost:8080/car/updateCar?id=${id}`, {
            method: 'PUT',
            headers: {
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
