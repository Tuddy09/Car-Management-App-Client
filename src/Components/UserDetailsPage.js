import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

function UserDetailsPage({setShowLogin}) {
    const {userId} = useParams();
    const navigate = useNavigate();
    const [user, setUser] = React.useState({});

    useEffect(() => {
        fetch(`http://localhost:8080/user/getUser?id=${userId}`)
            .then(response => response.json())
            .then(data => setUser(data));
    }, [userId]);

    function handleUpdateUser() {
        const form = document.querySelector('form');
        const formData = new FormData(form);
        const updatedUser = Object.fromEntries(formData);
        fetch(`http://localhost:8080/user/updateUser?id=${userId}`, {
            method: 'PUT', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(updatedUser)
        }).then(() => setUser(updatedUser))
            .then(() => navigate('/'));
    }

    function handleRemoveUser() {
        fetch(`http://localhost:8080/user/deleteUser?id=${userId}`, {
            method: 'DELETE'
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