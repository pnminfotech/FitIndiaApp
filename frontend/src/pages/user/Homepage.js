import React from 'react';
import logo from '../../assets/logo.png';


function Homepage() {
  return (
    <>
      <nav className="flex justify-between items-center bg-gray-50 h-[100px] px-8">
        <div className="flex item-center gap-4">
          <img src={logo} alt="Fit India Logo" className="h-[60px] w-[60px] rounded-full" />
          <h1 className="text-[44px] font-bold text-blue-500 cursor-pointer">Fit India</h1>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex gap-6 items-center">
            <a href="/user/sportsvenue" target="_blank" rel="noopener noreferrer">
              <p className="text-[24px] font-medium cursor-pointer hover:underline underline-offset-4 decoration-blue-500">
                SPORTS VENUES
              </p>
            </a>
            <a href="/user/coaching" target="_blank" rel="noopener noreferrer">
              <p className="text-[24px] font-medium cursor-pointer hover:underline underline-offset-4 decoration-blue-500">
                COACHING
              </p>
            </a>
            <a href="/user/events" target="_blank" rel="noopener noreferrer">
              <p className="text-[24px] font-medium cursor-pointer hover:underline underline-offset-4 decoration-blue-500">
                EVENTS
              </p>
            </a>
          </div>

          {/* <button className="text-[24px] font-bold h-10 w-[150px] bg-blue-500 text-white rounded-full border-none hover:text-red-500">
            Log In
          </button> */}
        </div>
      </nav>

      <section className="p-8">
        {/* Content goes here */}
      </section>
    </>
  );
}

export default Homepage;
