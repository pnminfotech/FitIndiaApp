import React from "react";

function BookingList() {
  const booking = [
    {
      user: "Pooja",
      venue: "Turf One",
      date: "2025-06-26",
    },
    {
      user: "Kirti",
      venue: "Play Zone",
      date: "2025-06-26",
    },
  ];

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6">
      <h2 className="font-bold text-2xl sm:text-3xl mb-6 text-center sm:text-left">
        All Bookings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {booking.map((val, idx) => (
          <div
            key={idx}
            className="bg-white h-44 w-full rounded-3xl flex flex-col items-center justify-center shadow-md p-4 text-center"
          >
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-1">
              <strong>User:</strong> {val.user}
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-1">
              <strong>Venue:</strong> {val.venue}
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
              <strong>Date:</strong> {val.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingList;
