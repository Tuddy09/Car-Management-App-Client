import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {BACKEND_URL} from "../Constants";

function UserDetailsPage() {
    const {userId} = useParams();
    const navigate = useNavigate();
    const [user, setUser] = React.useState({});

    useEffect(() => {
        fetch(`https://${BACKEND_URL}/user/getUser?id=${userId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'), // Add the token to the headers
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => setUser(data));
    }, [userId]);

    function handleUpdateUser() {
        const form = document.querySelector('form');
        const formData = new FormData(form);
        const updatedUser = Object.fromEntries(formData);
        fetch(`https://${BACKEND_URL}/user/updateUser?id=${userId}`, {
            method: 'PUT', headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'), // Add the token to the headers
                'Content-Type': 'application/json'
            }, body: JSON.stringify(updatedUser)
        }).then(() => setUser(updatedUser))
            .then(() => navigate('/'));
    }

    function handleRemoveUser() {
        fetch(`https://${BACKEND_URL}/user/deleteUser?id=${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'), // Add the token to the headers
                'Content-Type': 'application/json'
            }
        })
            .then(() => navigate('/'));
    }

    return (<div className='masterLayout'>
        <h1>User Details</h1>
        <form>
            <label>Name:</label>
            <input type='text' name='username' defaultValue={user.username}/>
            <label>Password:</label>
            <input type='password' name='password' defaultValue={user.password}/>
            <button type='button' onClick={handleUpdateUser}>Update</button>
        </form>
        <button onClick={handleRemoveUser}>Remove</button>
    </div>);
}

export default UserDetailsPage;