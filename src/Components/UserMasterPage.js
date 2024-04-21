// UserMasterPage.js
import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import UserContext from "./UserContext";


function Page({pageNumber, data}) {
    return (
        <ul>
            {data.slice((pageNumber - 1) * 5, pageNumber * 5).map(entity => (
                <li key={entity.id}>
                    <Link to={`/user/${entity.id}`}
                          style={{color: 'inherit', textDecoration: 'none'}}>{entity.username}</Link>
                </li>
            ))}
        </ul>
    )
}

function UserMasterPage() {
    const {data, setData} = useContext(UserContext);
    const [pageNumber, setPageNumber] = useState(1);
    const maxPages = Math.ceil(data.length / 5);


    useEffect(() => {
        fetch('http://localhost:8080/user/getUsers')
            .then(response => response.json())
            .then(data => {
                setData(data);
            });
    }, [setData]);


    function handleAddUser() {
        const form = document.querySelector('form');
        const newUser = {
            username: form.username.value,
            password: form.password.value
        }
        fetch(`http://localhost:8080/user/addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        }).then(response => {
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
            return response.json();
        }).then(responseData => {
            newUser.id = responseData.id;
            setData([...data, newUser]);
            console.log('New user added!', newUser);
            form.reset();
        }).catch(() => {
            // If the request fails, we store the action in the IndexedDB
            navigator.serviceWorker.ready.then(function (registration) {
                registration.sync.register('syncPendingActions');
            });
        });
    }


    function previousPage() {
        if (pageNumber > 1) {
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
                <Page data={data} pageNumber={pageNumber}/>
                <div className='paginationButtons'>
                    <button onClick={previousPage}>Previous</button>
                    <p style={{padding: '10px'}}>Page {pageNumber} out of {maxPages}</p>
                    <button onClick={nextPage}>Next</button>
                </div>
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
