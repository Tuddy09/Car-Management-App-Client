// CarMasterPage.js
import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import Chart from "chart.js/auto";
import {CategoryScale} from "chart.js";
import PieChart from "./PieChart";
import CarContext from "./CarContext";
import {AppBar, Toolbar} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";


Chart.register(CategoryScale);

function Page({data}) {
    return (
        <ul>
            {data.map(entity => (
                <li key={entity.id}>
                    <Link to={`/detail/${entity.id}`} style={{color: 'inherit', textDecoration: 'none'}}>
                        {entity.name} - {entity.type}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

function CarMasterPage() {
    const {userId} = useParams();
    const {data, setData} = useContext(CarContext);
    const [pageNumber, setPageNumber] = useState(0);
    const [maxPages, setMaxPages] = useState(1);


    useEffect(() => {
        fetch('http://localhost:8080/car/getPagesCount')
            .then(response => response.json())
            .then(data => {
                setMaxPages(data);
            })
        fetch(`http://localhost:8080/car/getPages?page=${pageNumber}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP status " + response.status);
                }
                return response.json();
            })
            .then(data => setData(data))
            .then(() => {
                navigator.serviceWorker.ready.then(function (registration) {
                    registration.sync.register('syncPendingActions');
                })
            })
            .catch(() => {
                alert("The server is not responding. Sync will be attempted later.");
            });
    }, [pageNumber, setData, userId]);

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

    const chartData = {
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


    function handleAddCar() {
        const form = document.querySelector('form');
        const newCar = {
            id: data.length + 1,
            name: form.name.value,
            type: form.type.value,
            description: form.description.value
        };

        fetch(`http://localhost:8080/user/addCarToUser?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCar)
        }).then(response => {
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
            return response.json();
        }).then(responseData => {
            newCar.id = responseData.id;
            setData([...data, newCar]);
            console.log('New car added!', newCar);
            form.reset();
        }).catch(() => {
            // If the request fails, we store the action in the IndexedDB
        });
    }

    function sortList() {
        const newData = data.sort((a, b) => a.name.localeCompare(b.name));
        setData([...newData]);
    }

    function previousPage() {
        if (pageNumber > 0) {
            setPageNumber(pageNumber - 1);
        }
    }

    function nextPage() {
        if (pageNumber < maxPages) {
            setPageNumber(pageNumber + 1);
        }
    }

    return (
        <div>
            <AppBar position="fixed" color="transparent" sx={{boxShadow: 0}}>
                <Toolbar>
                    <Link to={`/user/detail/${userId}`} style={{color: 'inherit'}}>
                        <AccountCircleIcon color="black"/>
                    </Link>
                </Toolbar>
            </AppBar>
            <div className='masterLayout'>
                <h1>Cars</h1>
                <button onClick={sortList}>Sort cars by name</button>
                <div className='paginationButtons'>
                    <button onClick={previousPage}>Previous</button>
                    <p style={{padding: '10px'}}>Page {pageNumber} out of {maxPages}</p>
                    <button onClick={nextPage}>Next</button>
                </div>
                <Page data={data}/>

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
                    <button type='button' onClick={handleAddCar}>Add</button>
                </form>
            </div>
            <div className='chartDiv'>
                <PieChart data={chartData}/>
            </div>
        </div>
    );
}

export default CarMasterPage;
