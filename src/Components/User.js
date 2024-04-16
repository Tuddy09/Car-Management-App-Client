import React, {useContext} from "react";
import UserContext from "./UserContext";
import {useNavigate} from "react-router-dom";

function User({setShowLogin}) {
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();

    function handleUpdateUser() {
        const form = document.querySelector('form');
        const formData = new FormData(form);
        const updatedUser = Object.fromEntries(formData);
        fetch(`http://localhost:8080/user/updateUser?id=${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        }).then(() => setUser({id: user.id, username: updatedUser.username, password: updatedUser.password}))
            .then(() => console.log(user))
            .then(() => navigate('/'));
    }

    function handleRemoveUser() {
        fetch(`http://localhost:8080/user/deleteUser?id=${user.id}`, {
            method: 'DELETE'
        }).then(() => setShowLogin(true))
            .then(() => navigate('/'));
    }

    return (
        <div className='masterLayout'>
            <h1>User Details</h1>
            <form>
                <label>Name:</label>
                <input type='text' name='username' defaultValue={user.username}/>
                <label>Password:</label>
                <input type='password' name='password' defaultValue={user.password}/>
                <button type='button' onClick={handleUpdateUser}>Update</button>
            </form>
            <button onClick={handleRemoveUser}>Remove</button>
        </div>
    );
}

export default User;