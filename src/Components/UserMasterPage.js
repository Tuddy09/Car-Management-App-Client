// UserMasterPage.js
import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import UserContext from "./UserContext";


function Page({data}) {
    return (
        <ul>
            {data.map(entity => (
                <li key={entity.id}>
                    <Link to={`/user/${entity.id}`}
                          style={{color: 'inherit', textDecoration: 'none'}}>{entity.username} {entity.carCount}</Link>
                </li>
            ))}
        </ul>
    )
}

function UserMasterPage() {
    const {data, setData} = useContext(UserContext);
    const [pageNumber, setPageNumber] = useState(0);
    const [maxPages, setMaxPages] = useState(1);


    useEffect(() => {
        fetch('https://mpp-backend-422621.lm.r.appspot.com/user/getPagesCount',
            {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            })
            .then(response => response.json())
            .then(data => {
                setMaxPages(data);
            })
        fetch(`https://mpp-backend-422621.lm.r.appspot.com/user/getPages?page=${pageNumber}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setData(data);
            }).then(() => {
        })
    }, [pageNumber, setData]);


    function handleAddUser() {
        const form = document.querySelector('form');
        const newUser = {
            username: form.username.value,
            password: form.password.value
        }
        fetch(`https://mpp-backend-422621.lm.r.appspot.com/user/addUser`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        }).then(response => {
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
            // check if response does not contain message field
            return response.json();
        }).then(() => {
            console.log('New user added!', newUser);
            setData([...data, newUser]);
            form.reset();
        }).catch(() => {
            // If the request fails, we store the action in the IndexedDB
        });
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
            <div className='masterLayout'>
                <h1>Users</h1>
                <div className='paginationButtons'>
                    <button onClick={previousPage}>Previous</button>
                    <p style={{padding: '10px'}}>Page {pageNumber} out of {maxPages}</p>
                    <button onClick={nextPage}>Next</button>
                </div>
                <Page data={data}/>
            </div>
            <div className='addCarDiv'>
                <h1>New user</h1>
                <form>
                    <label>Username</label>
                    <input type='text' name='username'/>
                    <label>Password</label>
                    <input type='password' name='password'/>
                    <button type='button' onClick={handleAddUser}>Add</button>
                </form>
            </div>
        </div>
    );
}

export default UserMasterPage;
