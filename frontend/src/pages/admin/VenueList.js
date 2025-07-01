import React, { useEffect, useState } from "react";
// import venues from '../../jsondata/SportVenue.json';
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const VenueList = () => {
  const [venues, setVenues] = useState([]); // Adding Venus
  const [editingVenue, setEditingVenue] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    city: "",
    address: "",
    sports: "",
    pricing: "",
    image: null,
  });

  const fetchVenues = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/venues");
      if (!response.ok) {
        throw new Error("Failed to fetch venues");
      }
      const data = await response.json();
      setVenues(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleUpdate = (ven) => {
    setEditingVenue(ven);
    setEditForm({
      name: ven.name,
      city: ven.city,
      address: ven.address,
      sports: Array.isArray(ven.sports) ? ven.sports.join(", ") : ven.sports,
      pricing: ven.pricing,
      image: null,
    });
  };

  //Edit/Submit Update Venue List
  // const submitUpdate = async (id) => {
  //   const formData = new FormData();
  //   formData.append("name", editVenues.name);
  //   formData.append("city", editVenues.city);
  //   formData.append("address", editVenues.address);
  //   formData.append("sport", editVenues.sport);
  //   formData.append("pricing", editVenues.pricing);

  //   if (editVenues.image) {
  //     formData.append("image", editVenues.image);
  //   }

  //   try {
  //     const res = await fetch(
  //       `http://localhost:8000/api/venues/${editVenues._id}`,
  //       {
  //         method: "PUT",
  //         body: formData,
  //       }
  //     );

  //     if (res.ok) {
  //       alert("Venues Updated!");
  //       setEditVenues(null);
  //     } else {
  //       alert("Update failed.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Something went wrong");
  //   }
  // };

  const submitUpdate = async () => {
    const fd = new FormData();
    Object.entries(editForm).forEach(([k, v]) => {
      if (v !== null) fd.append(k, v);
    });
    if (editForm.image) fd.append("image", editForm.image);

    const res = await fetch(
      `http://localhost:8000/api/venues/${editingVenue._id}`,
      {
        method: "PUT",
        body: fd,
      }
    );
    if (res.ok) {
      fetchVenues();
      setEditingVenue(null);
    } else alert("Failed To Update Venue");
  };

  // Delete Venue List
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/venues/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Venue Deleted Successfully!");

        // remove deleted venue from UI
        setVenues((prev) => prev.filter((v) => v._id !== id));
        fetchVenues();
      } else {
        alert("Failed to delete venue.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the venue.");
    }
  };

  return (
    <>
      <div className="px-10">
        <h2 className="text-3xl font-bold my-10">All Venues</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {venues.map((venue, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-3xl overflow-hidden"
            >
              <img
                src={`http://localhost:8000/uploads/${venue.image}`}
                alt={venue.name}
                className="w-full h-80 rounded-3xl p-4 "
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{venue.name}</h3>
                <p className="text-sm  mb-2">
                  {venue.city}, {venue.address}
                </p>
                <h4 className="text-lg  mb-1">
                  <span>
                    <strong>Price:- </strong>
                  </span>
                  {venue.pricing}
                </h4>
                <div className="flex flex-wrap gap-2 text-sm  mb-2">
                  {venue.sports.map((sport, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-300 px-4 py-2 rounded-lg"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
                <div className="y-2">
                  <button
                    onClick={() => {
                      handleUpdate(venue);
                    }}
                    className=" font-bold border border-gray-500 p-4 mx-2 rounded-lg text-xl "
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(venue._id);
                    }}
                    className=" font-bold text-xl border border-gray-500 p-4 mx-2 rounded-lg"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>

      {/* To Do for Editing */}
        {editingVenue &&  (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <h1>Update Venue</h1>
            {/* Venue Name */}
            <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
              <label
                htmlFor="name"
                className="sm:w-40 text-nowrap cursor-pointer"
              >
                Venue Name:
              </label>
              <input
                type="text"
                id="name"
                placeholder="Venue Name"
                className="pl-2 h-12 bg-gray-200 w-full rounded-lg"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>

            {/* City */}
            <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
              <label
                htmlFor="city"
                className="sm:w-40 text-nowrap cursor-pointer"
              >
                City:
              </label>
              <input
                type="text"
                id="city"
                placeholder="City"
                className="pl-2 h-12 w-full bg-gray-200 rounded-lg"
                value={editForm.city}
                onChange={(e) =>
                  setEditForm({ ...editForm, city: e.target.value })
                }
              />
            </div>

            {/* Address */}
            <div className=" bg-white  p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
              <label htmlFor="address" className="sm:w-40 text-nowrap">
                Address:
              </label>
              <input
                type="text"
                id="address"
                placeholder="Address"
                className="pl-2 h-12 w-full bg-gray-200  rounded-lg"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
              />
            </div>

            {/* Sports */}
            <div className="bg-white  p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
              <label htmlFor="sport" className="sm:w-40 text-nowrap">
                Sports:
              </label>
              <input
                type="text"
                id="sport"
                placeholder="Sports (comma separated)"
                className="pl-2 h-12 w-full bg-gray-200  rounded-lg"
                value={editForm.sports}
                onChange={(e) =>
                  setEditForm({ ...editForm, sports: e.target.value })
                }
              />
            </div>

            {/* Pricing */}
            <div className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
              <label htmlFor="price" className="sm:w-40 text-nowrap">
                Pricing:
              </label>
              <input
                type="text"
                id="price"
                placeholder="Price"
                className="pl-2 h-12 w-full bg-gray-200  rounded-lg"
                value={editForm.pricing}
                onChange={(e) =>
                  setEditForm({ ...editForm, pricing: e.target.value })
                }
              />
            </div>

            {/* Upload File */}
            <div className="bg-white  p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
              <label htmlFor="imageFile" className="sm:w-40 text-nowrap">
                Upload Image:
              </label>
              <input
                type="file"
                id="imageFile"
                accept="image/png, image/jpeg, image/jpg"
                className="pl-2 h-full w-full bg-gray-200  rounded-lg "
                onChange={(e) =>
                  setEditForm({ ...editForm, image: e.target.files[0] })
                }
              />
            </div>
            <div className="flex justify-end items-center gap-4">
              <button
                onClick={() => {
                  setEditingVenue(null);
                  setEditForm({
                    name: "",
                    city: "",
                    address: "",
                    sports: "",
                    pricing: "",
                    image: null,
                  });
                }}
                className="text-gray-600 cursor-pointer  h-10 w-20  rounded-lg border border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitUpdate}
                className="bg-cyan-700 text-white h-10 w-20 rounded-lg hover:bg-cyan-600 cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        )}
    </>
  );
};

export default VenueList;
