import React from 'react';

const CoachList = () => {
  const coaches = [
    { id: 1, name: 'John Doe', sport: 'Football' },
    { id: 2, name: 'Jane Smith', sport: 'Tennis' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Coach Requests</h2>
      <div className="space-y-4">
        {coaches.map(coach => (
          <div key={coach.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{coach.name}</p>
              <p className="text-gray-600">Sport: {coach.sport}</p>
            </div>
            <div className="space-x-2">
              <button className="bg-green-800 px-6 text-white font-semibold py-2 rounded-full">Approve</button>
              <button className="bg-red-700  px-6 text-white font-semibold py-2 rounded-full">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoachList;
