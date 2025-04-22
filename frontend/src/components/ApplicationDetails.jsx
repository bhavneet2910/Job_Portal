import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import ApplicationStatus from './ApplicationStatus';
import StudentApplicationStatus from './StudentApplicationStatus';
import { useAuth } from '../context/AuthContext';

const ApplicationDetails = () => {
  const { id } = useParams();
  const { authUser } = useAuth();

  const { data: application, isLoading } = useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const response = await axios.get(`/api/applications/${id}`);
      return response.data.data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!application) {
    return <div>Application not found</div>;
  }

  // Check if the current user is the applicant (student) or the job poster (recruiter)
  const isStudent = authUser?.id === application.applicant?._id;
  const isRecruiter = authUser?.id === application.job?.postedBy?._id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Application Details</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Job Details</h2>
            <p className="text-gray-600">{application.job.title}</p>
            <p className="text-gray-600">{application.job.company}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Applicant Details</h2>
            <p className="text-gray-600">{application.applicant.fullname}</p>
            <p className="text-gray-600">{application.applicant.email}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Cover Letter</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{application.coverLetter}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Resume</h2>
            {application.applicant.resume ? (
              <a
                href={application.applicant.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Resume
              </a>
            ) : (
              <p className="text-gray-600">No resume uploaded</p>
            )}
          </div>

          {/* Show different status components based on user role */}
          {isRecruiter && <ApplicationStatus application={application} />}
          {isStudent && <StudentApplicationStatus applicationId={id} />}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails; 