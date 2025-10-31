import React, { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

const CreateServiceModal = ({ onClose, onSave }) => {
  // Default empty structure for a new scheme
  const initialScheme = {
    SchemeName: "",
    Description: "",
    EligibilityCriteria: "",
    ApplicationProcess: "",
    Benefits: "",
    ContactInfo: {
      PhoneNumber: "",
      Email: "",
    },
    ApplicationDeadline: "",
    currentApplication: "",
  };

  const { scheme, setScheme } = useAuth();

  useEffect(() => {
    setScheme(initialScheme);
  }, []);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheme((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle nested ContactInfo fields
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setScheme((prev) => ({
      ...prev,
      ContactInfo: {
        ...prev.ContactInfo,
        [name]: value,
      },
    }));
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!scheme.SchemeName.trim()) {
      alert("Please provide a Scheme Name");
      return;
    }

    // Pass data back to parent (Dashboard or NGO page)
    onSave(scheme);

    // Reset and close modal
    setScheme(initialScheme);
    onClose();
  };

  return (
    <div className="fixed flex items-center justify-center top-0 left-0 h-screen w-full bg-black/30 backdrop-blur-md z-50">
      <div className="flex flex-col p-6 w-[90%] max-w-2xl rounded-lg bg-white shadow-lg overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Service / Scheme</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Scheme Name */}
          <div>
            <label className="block font-medium">Scheme Name</label>
            <input
              type="text"
              name="SchemeName"
              value={scheme?.SchemeName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="Description"
              value={scheme?.Description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows="3"
            />
          </div>

          {/* Eligibility Criteria */}
          <div>
            <label className="block font-medium">Eligibility Criteria</label>
            <input
              type="text"
              name="EligibilityCriteria"
              value={scheme?.EligibilityCriteria}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Application Process */}
          <div>
            <label className="block font-medium">Application Process</label>
            <input
              type="text"
              name="ApplicationProcess"
              value={scheme?.ApplicationProcess}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block font-medium">Benefits</label>
            <input
              type="text"
              name="Benefits"
              value={scheme?.Benefits}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Contact Phone</label>
              <input
                type="text"
                name="PhoneNumber"
                value={scheme?.ContactInfo.PhoneNumber}
                onChange={handleContactChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Contact Email</label>
              <input
                type="email"
                name="Email"
                value={scheme?.ContactInfo.Email}
                onChange={handleContactChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Application Deadline */}
          <div>
            <label className="block font-medium">Application Deadline</label>
            <input
              type="date"
              name="ApplicationDeadline"
              value={scheme?.ApplicationDeadline}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Current Application Info */}
          <div>
            <label className="block font-medium">Current Application</label>
            <input
              type="text"
              name="currentApplication"
              value={scheme?.currentApplication}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServiceModal;
