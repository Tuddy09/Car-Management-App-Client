// MasterPage.js
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Chart from "chart.js/auto";
import {CategoryScale} from "chart.js";
import PieChart from "./PieChart";

Chart.register(CategoryScale);

function MasterPage({data, setData}) {
    function calculateCarTypes() {
        const types = data.map(entity => entity.type);
        const uniqueTypes = [...new Set(types)];
        return uniqueTypes.map(type => {
            return {
                type: type,
                count: types.filter(t => t === type).length
            }
        });
    }

    const chartData= {
        labels: data.map(entity => entity.type),
        datasets: [
            {
                label: 'Car types',
                data: calculateCarTypes().map(type => type.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            }]
    };


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

    function sortList() {
        const newData = data.sort((a, b) => a.name.localeCompare(b.name));
        setData([...newData]);
    }

    return (
        <div>
            <div className='masterLayout'>
                <h1>Cars</h1>
                <button onClick={sortList}>Sort cars by name</button>
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
            <div className='chartDiv'>
                <PieChart data={chartData}/>
            </div>
        </div>
    );
}

export default MasterPage;
