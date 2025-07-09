// Updated ManageSlots component for full CRUD (Create, Read, Update, Delete)
// Functionality: Select Venue -> Select Sports (from venue) -> Add Court -> Add Slots -> View/Edit/Delete Courts & Slots

import React, { useEffect, useState } from 'react';

function ManageSlots() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [venueSports, setVenueSports] = useState([]);
  const [courtName, setCourtName] = useState('');
  const [selectedSports, setSelectedSports] = useState([]);
  const [slots, setSlots] = useState([{ date: '', startTime: '', endTime: '' }]);
  const [courts, setCourts] = useState([]); // for view/edit/delete
  const [editCourtId, setEditCourtId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/venues')
      .then((res) => res.json())
      .then((data) => setVenues(data));
  }, []);

  useEffect(() => {
    if (selectedVenue) {
      const venue = venues.find((v) => v._id === selectedVenue);
      if (venue) setVenueSports(venue.sports || []);

      // fetch existing courts for selected venue
      fetch(`http://localhost:8000/api/slots/${selectedVenue}/courts`)
        .then((res) => res.json())
        .then(setCourts);
    }
  }, [selectedVenue, venues]);

  const handleSportToggle = (sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleSlotChange = (idx, field, value) => {
    const updated = [...slots];
    updated[idx][field] = value;
    setSlots(updated);
  };

  const addSlot = () => {
    setSlots([...slots, { date: '', startTime: '', endTime: '' }]);
  };

  const resetForm = () => {
    setCourtName('');
    setSelectedSports([]);
    setSlots([{ date: '', startTime: '', endTime: '' }]);
    setEditCourtId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      courtName,
      sports: selectedSports,
      slots,
    };

    const method = editCourtId ? 'PUT' : 'POST';
    const url = editCourtId
      ? `http://localhost:8000/api/slots/${selectedVenue}/courts/${editCourtId}`
      : `http://localhost:8000/api/slots/${selectedVenue}/courts`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert(`Court ${editCourtId ? 'updated' : 'added'} successfully`);
      resetForm();
      const updated = await fetch(`http://localhost:8000/api/slots/${selectedVenue}/courts`).then((r) => r.json());
      setCourts(updated);
    } else {
      alert('Error saving court');
    }
  };

  const handleEdit = (court) => {
    setCourtName(court.courtName);
    setSelectedSports(court.sports);
    setSlots(court.slots);
    setEditCourtId(court._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this court?')) return;
    const res = await fetch(`http://localhost:8000/api/slots/${selectedVenue}/courts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Deleted successfully');
      setCourts((prev) => prev.filter((c) => c._id !== id));
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label>
          Venue:
          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="block w-full p-2 border rounded"
            required
          >
            <option value="">Select Venue</option>
            {venues.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Court Name:
          <input
            type="text"
            value={courtName}
            onChange={(e) => setCourtName(e.target.value)}
            className="block w-full p-2 border rounded"
            required
          />
        </label>

        <div>
          <span>Sports:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {venueSports.map((sport) => (
              <label key={sport} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSports.includes(sport)}
                  onChange={() => handleSportToggle(sport)}
                  className="form-checkbox"
                />
                <span>{sport}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <span>Slots:</span>
          {slots.map((slot, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4 mt-2">
              <input
                type="date"
                value={slot.date}
                onChange={(e) => handleSlotChange(idx, 'date', e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => handleSlotChange(idx, 'startTime', e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => handleSlotChange(idx, 'endTime', e.target.value)}
                className="p-2 border rounded"
                required
              />
            </div>
          ))}
          <button type="button" onClick={addSlot} className="mt-2 text-blue-500">
            + Add Slot
          </button>
        </div>

        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded">
          {editCourtId ? 'Update Court' : 'Save Court'}
        </button>
      </form>

      {/* Existing Courts */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Courts for this Venue</h2>
        {courts.length === 0 ? (
          <p className="text-gray-500">No courts added yet.</p>
        ) : (
          <ul className="space-y-4">
            {courts.map((court) => (
              <li key={court._id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{court.courtName}</p>
                    <p className="text-sm">Sports: {court.sports.join(', ')}</p>
                    <ul className="text-sm mt-2">
                      {court.slots.map((slot, i) => (
                        <li key={i}>
                          {slot.date}: {slot.startTime} - {slot.endTime}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(court)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(court._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ManageSlots;
