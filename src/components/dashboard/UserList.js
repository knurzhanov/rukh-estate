import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://rukh-estate-api-5571379c698a.herokuapp.com/api/auth/users');
        console.log(response.data); // Проверьте, что данные возвращаются корректно
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching users: ' + error.message);
      }
    };
  
    fetchUsers();
  }, []);
  

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://rukh-estate-api-5571379c698a.herokuapp.com/api/auth/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setSuccess('User deleted successfully');
    } catch (error) {
      setError('Error deleting user: ' + error.message);
    }
  };

  const handleChangePassword = async (userId) => {
    try {
      await axios.put(`https://rukh-estate-api-5571379c698a.herokuapp.com/api/auth/users/${userId}/password`, { password: newPassword });
      setSuccess('Password updated successfully');
      setNewPassword(''); // Clear the password input after successful update
    } catch (error) {
      setError('Error updating password: ' + error.message);
    }
  };

  return (
    <div>
      <h2>User List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChangePassword(user._id);
                  }}
                >
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button type="submit">Change Password</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
