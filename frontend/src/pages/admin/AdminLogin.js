import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const { login } = useAuth();
  // const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch('http://localhost:5000/api/admin/login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, password })
  //     });
  //     const data = await res.json();
  //     if (res.ok && data.token) {
  //       login(data.token);
  //       navigate('/admin/dashboard');
  //     } else {
  //       alert('Invalid credentials');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '100px' }}>
      <h2>Admin Login</h2>
      {/* onSubmit={handleSubmit} */}
      <form > 
        {/* value={email} onChange={e => setEmail(e.target.value)} */}
        <input type="email"  placeholder="Email" required /> 
        {/* value={password} onChange={e => setPassword(e.target.value)} */}
        <input type="password"  placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
