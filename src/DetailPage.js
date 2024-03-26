// DetailPage.js
import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';


function DetailPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [entity, setEntity] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/getCar?id=${id}`)
            .then(response => response.json())
            .then(data => setEntity(data));
    }, [id]);

    if (!entity) return <div>Entity not found</div>;

    function removeCar() {
        fetch(`http://localhost:8080/deleteCar?id=${id}`, {method: 'DELETE'})
            .then(() => navigate('/'));
    }

    function updateCar() {
        const form = document.querySelector('form');
        const formData = new FormData(form);
        // Create a new object from the form data
        const updatedCar = Object.fromEntries(formData);
        fetch(`http://localhost:8080/updateCar?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCar)
        })
            .then(() => navigate('/'));
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
                <button type='button' onClick={updateCar}>Update</button>
            </form>
            <button onClick={removeCar}>Remove</button>
        </div>
    );
}

export default DetailPage;
