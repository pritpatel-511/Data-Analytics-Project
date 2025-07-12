import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Add this
import "./Styles/UserManagement.css";
import useFetchWithLoader from "../../hooks/useFetchWithLoader";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // 👈 Initialize
  const fetchWithLoader = useFetchWithLoader();


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchWithLoader("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    fetchUsers();
  }, [token]);

  const handleBlockToggle = async (id, isActive) => {
    const endpoint = isActive ? "block" : "unblock";
    await fetchWithLoader(`http://localhost:5000/api/admin/${endpoint}/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.map(user =>
      user._id === id ? { ...user, isActive: !isActive } : user
    ));
  };

  const handleDelete = async (id) => {
    await fetchWithLoader(`http://localhost:5000/api/admin/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.filter(user => user._id !== id));
  };

  const handleShowActivity = (userId) => {
    navigate(`/AdminPanel/activity/${userId}`); // 👈 Navigate with userId in URL
  };

  return (
    <div className="user-management">
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className={!user.isActive ? "blocked" : ""}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? "Active" : "Blocked"}</td>
              <td>
                <button onClick={() => handleBlockToggle(user._id, user.isActive)}>
                  {user.isActive ? "Block" : "Unblock"}
                </button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
                <button onClick={() => handleShowActivity(user._id)}>Show Activity</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
