import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

function ManageSlots() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [venueSports, setVenueSports] = useState([]);
  const [courtName, setCourtName] = useState("");
  const [selectedSports, setSelectedSports] = useState([]);
  const [slots, setSlots] = useState([{ startTime: "", endTime: "", price: "" }]);
  const [defaultPrice, setDefaultPrice] = useState(""); // 🆕 Default price
  const [courts, setCourts] = useState([]);
  const [editCourtId, setEditCourtId] = useState(null);

  useEffect(() => {
    fetch("https://api.getfitindia.in/api/venues")
      .then((res) => res.json())
      .then((data) => setVenues(data));
  }, []);

  useEffect(() => {
    if (selectedVenue) {
      const venue = venues.find((v) => v._id === selectedVenue);
      if (venue) setVenueSports(venue.sports || []);

      fetch(`https://api.getfitindia.in/api/slots/${selectedVenue}/courts`)
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
    setSlots([...slots, { startTime: "", endTime: "", price: defaultPrice }]); // 🆕 default price
  };

  const resetForm = () => {
    setCourtName("");
    setSelectedSports([]);
    setSlots([{ startTime: "", endTime: "", price: defaultPrice }]);
    setEditCourtId(null);
  };
const formatTime = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

  const generateSlots = (period) => {
  let start, end;
  if (period === "morning") {
    start = "05:00";
    end = "12:30";
  } else if (period === "afternoon") {
    start = "12:30";
    end = "16:30";
  } else if (period === "evening") {
    start = "16:30";
    end = "23:59";
  }

  const generated = [];
  let [hour, minute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  while (hour < endHour || (hour === endHour && minute < endMinute)) {
    const startTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    minute += 30;
    if (minute >= 60) {
      hour += 1;
      minute -= 60;
    }

    const endTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    generated.push({
      startTime,
      endTime,
      price: defaultPrice,
    });
  }

  setSlots(generated); // ✅ Replaces existing slots
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      courtName,
      sports: selectedSports,
      slots,
    };

    const method = editCourtId ? "PUT" : "POST";
    const url = editCourtId
      ? `https://api.getfitindia.in/api/slots/${selectedVenue}/courts/${editCourtId}`
      : `https://api.getfitindia.in/api/slots/${selectedVenue}/courts`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert(`Court ${editCourtId ? "updated" : "added"} successfully`);
      resetForm();
      const updated = await fetch(
        `https://api.getfitindia.in/api/slots/${selectedVenue}/courts`
      ).then((r) => r.json());
      setCourts(updated);
    } else {
      alert("Error saving court");
    }
  };

  const handleEdit = (court) => {
    setCourtName(court.courtName);
    setSelectedSports(court.sports);
    setSlots(court.slots);
    setEditCourtId(court._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this court?")) return;
    const res = await fetch(
      `https://api.getfitindia.in/api/slots/${selectedVenue}/courts/${id}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      alert("Deleted successfully");
      setCourts((prev) => prev.filter((c) => c._id !== id));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">🎾 Manage Slots</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Select Venue</label>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            >
              <option value="">-- Choose --</option>
              {venues.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Court Name</label>
            <input
              type="text"
              value={courtName}
              onChange={(e) => setCourtName(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="Enter court name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Select Sports</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {venueSports.map((sport) => (
              <label key={sport} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSports.includes(sport)}
                  onChange={() => handleSportToggle(sport)}
                />
                <span>{sport}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Default Price for All Slots</label>
          <input
            type="number"
            min="0"
            value={defaultPrice}
            onChange={(e) => setDefaultPrice(e.target.value)}
            className="p-2 border rounded w-full max-w-xs"
            placeholder="e.g. 500"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Slots</label>
          {slots.map((slot, idx) => (
            <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => handleSlotChange(idx, "startTime", e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => handleSlotChange(idx, "endTime", e.target.value)}
                className="p-2 border rounded"
                required
              />
              
             <input
  type="text"
  value={slot.price ? `₹ ${slot.price}` : ""}
  onChange={(e) => {
    const val = e.target.value.replace(/[^\d]/g, ""); // remove ₹ or letters
    handleSlotChange(idx, "price", val);
  }}
  className="p-2 border rounded w-full"
  placeholder="₹ Price"
  required
/>

            </div>
          ))}

          <div className="flex gap-3 flex-wrap mt-3">
            <button
              type="button"
              onClick={addSlot}
              className="text-blue-600 underline"
            >
              + Add Slot
            </button>
            <button
              type="button"
              onClick={() => generateSlots("morning")}
              className="bg-green-100 px-3 py-1 rounded"
            >
              Morning
            </button>
            <button
              type="button"
              onClick={() => generateSlots("afternoon")}
              className="bg-yellow-100 px-3 py-1 rounded"
            >
              Afternoon
            </button>
            <button
              type="button"
              onClick={() => generateSlots("evening")}
              className="bg-indigo-100 px-3 py-1 rounded"
            >
              Evening
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          {editCourtId ? "Update Court" : "Save Court"}
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">🎯 Existing Courts</h3>
        {courts.length === 0 ? (
          <p className="text-gray-500">No courts available.</p>
        ) : (
          <ul className="space-y-4">
            {courts.map((court) => (
              <li
                key={court._id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleEdit(court)}
                    className="p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(court._id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div>
                  <p className="text-lg font-semibold">{court.courtName}</p>
                  <p className="text-sm text-gray-600">
                    Sports: {court.sports.join(", ")}
                  </p>
                  <ul className="mt-2 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                    {court.slots.map((slot, idx) => (
                      <div
                        key={idx}
                        className="border border-cyan-900 text-black p-3 rounded-md mb-2"
                      >
                       <div className="font-medium">
  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
</div>

                        <div className="text-sm text-gray-600">₹ {slot.price}</div>
                      </div>
                    ))}
                  </ul>
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
