import React, {useContext} from "react";
import UserContext from "./UserContext";

function User() {
    const {user} = useContext(UserContext);
    function handleUpdateUser() {
        console.log(user)
    }

    function handleRemoveUser() {

    }

    return (
        <div className='masterLayout'>
            <h1>User Details</h1>
            <form>
                <label>Name:</label>
                <input type='text' name='name' defaultValue={user.name}/>
                <label>Password:</label>
                <input type='password' name='type' defaultValue={user.password}/>
                <button type='button' onClick={handleUpdateUser}>Update</button>
            </form>
            <button onClick={handleRemoveUser}>Remove</button>
        </div>
    );
}

export default User;