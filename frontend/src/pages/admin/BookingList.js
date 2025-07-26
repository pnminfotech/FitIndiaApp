import React, { useEffect, useState } from "react";

const BookingList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="px-4 py-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">👥 All Registered Users</h2>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-red-500">No users found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3 border-b">#</th>
              <th className="px-4 py-3 border-b">Name</th>
              <th className="px-4 py-3 border-b">Mobile</th>
              <th className="px-4 py-3 border-b">Gender</th>
              <th className="px-4 py-3 border-b">City</th>
              <th className="px-4 py-3 border-b">Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b">{idx + 1}</td>
                <td className="px-4 py-3 border-b">{user.name || "N/A"}</td>
                <td className="px-4 py-3 border-b">{user.mobile || "N/A"}</td>
                <td className="px-4 py-3 border-b">{user.gender || "N/A"}</td>
                <td className="px-4 py-3 border-b">{user.city || "N/A"}</td>
                <td className="px-4 py-3 border-b">
                  {user.createdAt?.split("T")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingList;
