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
const toggleBlock = async (userId) => {
  try {
    const res = await fetch(`http://localhost:8000/api/users/${userId}/block`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    alert(data.message);
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, blocked: !u.blocked } : u))
    );
  } catch (err) {
    alert("Failed to block/unblock user.");
    console.error(err);
  }
};

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
              <th className="px-4 py-3 border-b">block</th>
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
                <td className="px-4 py-3 border-b">
  <button
    className={`px-3 py-1 rounded ${
      user.blocked ? "bg-red-600 text-white" : "bg-green-600 text-white"
    }`}
    onClick={() => toggleBlock(user._id)}
  >
    {user.blocked ? "Unblock" : "Block"}
  </button>
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
