import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const ApplicationStatus = ({ application }) => {
  const [status, setStatus] = useState(application.status);
  const { id } = useParams();

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axios.patch(`/api/applications/${id}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        setStatus(newStatus);
        toast.success('Application status updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">Status:</span>
      <div className="flex gap-2">
        <button
          onClick={() => handleStatusUpdate('accepted')}
          className={`px-3 py-1 rounded-full text-sm ${
            status === 'accepted'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800 hover:bg-green-100 hover:text-green-800'
          }`}
        >
          Accept
        </button>
        <button
          onClick={() => handleStatusUpdate('rejected')}
          className={`px-3 py-1 rounded-full text-sm ${
            status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800 hover:bg-red-100 hover:text-red-800'
          }`}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default ApplicationStatus; 