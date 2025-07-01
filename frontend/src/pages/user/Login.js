import React from 'react'; 

function Login() {

  return (
     <div className='h-64 w-80 p-10 bg-blue-100 flex items-center justify-center'>
      <h2>User Login</h2>
      <form >
        <input  type="email"  placeholder="Email" required  /><br/>
        <input type="password"  placeholder="Password" required  /><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login