// DetailPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import mockData from './constants';


const DetailPage = () => {
    const { id } = useParams();
    const entity = mockData.find(entity => entity.id === parseInt(id));

    if (!entity) return <div>Entity not found</div>;

    function removeCar() {
        alert('Car removed');
    }

    return (
        <div className='masterLayout'>
            <h1>Car Details</h1>
            <p>Name: {entity.name}</p>
            <p>Type: {entity.type}</p>
            <p>Description: {entity.description}</p>
            <button onClick={removeCar}>Remove</button>
        </div>
    );
}

export default DetailPage;
