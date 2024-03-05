// MasterPage.js
import React from 'react';
import {Link} from 'react-router-dom';
import mockData from './constants';


const MasterPage = () => {
    function addCar() {
        alert('Car added');

    }
    return (
        <div>
            <div className='masterLayout'>
                <h1>Cars</h1>
                <ul>
                    {mockData.map(entity => (
                        <li key={entity.id}>
                            <Link to={`/detail/${entity.id}`}>
                                {entity.name} - {entity.type}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='addCarDiv'>
                <h1>New car</h1>
                <form>
                    <label>Name:</label>
                    <input type='text'/>
                    <label>Type:</label>
                    <input type='text'/>
                    <label>Description:</label>
                    <input type='text'/>
                    <button type='submit' onClick={addCar}>Add</button>
                </form>
            </div>
        </div>
    );
}

export default MasterPage;
