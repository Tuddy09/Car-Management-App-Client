// DetailPage.js
import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';


function DetailPage({data, setData}) {
    const navigate = useNavigate();
    const {id} = useParams();
    const entity = data.find(entity => entity.id === parseInt(id));

    if (!entity) return <div>Entity not found</div>;

    function removeCar() {
        const newData = data.filter(entity => entity.id !== parseInt(id));
        setData(newData);
        navigate('/');
    }

    function updateCar() {
        const form = document.querySelector('form');
        const updatedCar = {
            id: entity.id,
            name: form.name.value,
            type: form.type.value,
            description: form.description.value
        };
        const newData = data.map(entity => entity.id === parseInt(id) ? updatedCar : entity);
        setData(newData);
        navigate('/');
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
