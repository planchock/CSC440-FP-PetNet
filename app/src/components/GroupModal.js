import React, { useState } from 'react';

const GroupModal = ({ showModal, onClose, onSubmit }) => {
  const [newGroupData, setNewGroupData] = useState({
    group_name: '',
    group_desc: '',
    group_pic: '',
    admin_id: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newGroupData);
    onClose();
  };

  return (
    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${showModal ? 'block' : 'hidden'}`}>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <span className="absolute top-0 right-0 p-4 cursor-pointer" onClick={onClose}>&times;</span>
        <h2 className="text-2xl font-bold mb-4">Create a New Group</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="groupName">Group Name:</label>
            <input
              type="text"
              id="groupName"
              name="groupName"
              value={newGroupData.group_name}
              onChange={handleInputChange}
              className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="groupDesc">Group Description:</label>
            <textarea
              id="groupDesc"
              name="groupDesc"
              value={newGroupData.group_desc}
              onChange={handleInputChange}
              className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-300"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="groupDesc">Group Admin:</label>
            <textarea
              id="groupAdmi "
              name="groupAdmin"
              value={newGroupData.group_admin}
              onChange={handleInputChange}
              className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-300"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="groupPic">Group Picture URL:</label>
            <input
              type="text"
              id="groupPic"
              name="groupPic"
              value={newGroupData.group_pic}
              onChange={handleInputChange}
              className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
