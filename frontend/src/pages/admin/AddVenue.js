import React, { useState, useRef } from "react";

function AddVenue() {
  const fileInputRef = useRef();
  const [venue, setVenue] = useState({
    name: "",
    city: "",
    address: "",
    sports: "",
    pricing: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", venue.name);
    formData.append("city", venue.city);
    formData.append("address", venue.address);
    formData.append("pricing", venue.pricing);
    formData.append("sports", venue.sports);
    formData.append("image", venue.image); // must match field used in multer


    try {
      const res = await fetch("http://localhost:8000/api/venues", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Venue Added Successfully!");
        setVenue({
          name: "",
          city: "",
          address: "",
          pricing: "",
          sports: "",
          image: null,
        });
      } else {
        alert("Failed to add venue");
      }
    } catch (err) {
      alert("Error occurred");
      console.error(err);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6">
      <h2 className="font-bold text-2xl sm:text-3xl my-5 text-center sm:text-left">
        Add New Venue
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
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
              value={venue.name}
              onChange={(e) => setVenue({ ...venue, name: e.target.value })}
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
              value={venue.city}
              onChange={(e) => setVenue({ ...venue, city: e.target.value })}
            />
          </div>

          {/* Address */}
          <div className="bg-white  p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 font-medium text-lg sm:text-xl">
            <label htmlFor="address" className="sm:w-40 text-nowrap">
              Address:
            </label>
            <input
              type="text"
              id="address"
              placeholder="Address"
              className="pl-2 h-12 w-full bg-gray-200  rounded-lg"
              value={venue.address}
              onChange={(e) => setVenue({ ...venue, address: e.target.value })}
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
              value={venue.sports}
              onChange={(e) => setVenue({ ...venue, sports: e.target.value })}
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
              value={venue.pricing}
              onChange={(e) => setVenue({ ...venue, pricing: e.target.value })}
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
              ref={fileInputRef}
              className="pl-2 h-full w-full bg-gray-200  rounded-lg "
              onChange={(e) => setVenue({ ...venue, image: e.target.files[0] })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center sm:justify-start">
          <button className="mt-8 h-12 w-40 sm:h-14 sm:w-64 bg-cyan-700 hover:text-black hover:bg-cyan-300 transition text-white rounded-full font-bold text-lg sm:text-xl">
            Add Venue
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddVenue;
