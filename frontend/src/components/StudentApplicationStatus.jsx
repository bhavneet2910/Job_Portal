import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const StudentApplicationStatus = ({ applicationId }) => {
  const { data: application, isLoading, error } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: async () => {
      const response = await axios.get(`/api/applications/${applicationId}`);
      return response.data.data;
    }
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading status...</div>;
  }

  if (error) {
    toast.error('Failed to load application status');
    return <div className="text-red-500">Error loading status</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">Your Application Status:</span>
      <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status)}`}>
        {getStatusText(application.status)}
      </div>
    </div>
  );
};

export default StudentApplicationStatus; 