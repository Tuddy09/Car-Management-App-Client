// MasterPage.js
import React from 'react';
import {Link} from 'react-router-dom';


function MasterPage({data, setData}) {
    function addCar() {
        const form = document.querySelector('form');
        const newCar = {
            id: data.length + 1,
            name: form.name.value,
            type: form.type.value,
            description: form.description.value
        };
        setData([...data, newCar]);
        form.reset();

    }
    return (
        <div>
            <div className='masterLayout'>
                <h1>Cars</h1>
                <ul>
                    {data.map(entity => (
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
                    <input type='text' name='name'/>
                    <label>Type:</label>
                    <input type='text' name='type'/>
                    <label>Description:</label>
                    <input type='text' name='description'/>
                    <button type='button' onClick={addCar}>Add</button>
                </form>
            </div>
        </div>
    );
}

export default MasterPage;
