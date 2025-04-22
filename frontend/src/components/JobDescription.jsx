import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setSingleJobById } from '@/redux/jobSlice';
import { useParams } from 'react-router-dom';

const JobDescription = () => {
  const { singleJobById } = useSelector(store => store.job);
  const { authUser } = useSelector(store => store.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const params = useParams();

  const applyJobHandler = async () => {
    if (!authUser) {
      toast.error('Please login to apply for this job');
      return;
    }

    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;
      const res = await axios.get(`http://localhost:8000/api/v1/application/apply/${params.id}`);
      if (res.data.success) {
        // Fetch the updated job data
        const updatedJobRes = await axios.get(`http://localhost:8000/api/v1/job/${params.id}`);
        if (updatedJobRes.data.success) {
          dispatch(setSingleJobById(updatedJobRes.data.job));
          setIsApplied(updatedJobRes.data.job.hasApplied);
        }
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to apply for job');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setIsLoading(true);
        axios.defaults.withCredentials = true;
        const res = await axios.get(`http://localhost:8000/api/v1/job/${params.id}`);
        if (res.data.success) {
          dispatch(setSingleJobById(res.data.job));
          setIsApplied(res.data.job.hasApplied);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to fetch job details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSingleJob();
  }, [params.id, dispatch, authUser?._id]);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto my-10 animate-pulse">Loading...</div>;
  }

  const buttonStyle = isApplied
    ? "bg-gray-600 cursor-not-allowed hover:bg-gray-600"
    : "bg-[#7209b7] hover:bg-[#5f32ad]";

  return (
    <div className='max-w-7xl mx-auto my-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-bold text-xl '>{singleJobById?.title}</h1>
          <div className='flex items-center gap-2 my-2'>
            <Badge className={'text-blue-700 font-bold'} variant={'ghost'}>{singleJobById?.position} Positions</Badge>
            <Badge className={'text-[#F83002] font-bold'} variant={'ghost'}>{singleJobById?.jobType}</Badge>
            <Badge className={'text-[#7209b7] font-bold'} variant={'ghost'}>{singleJobById?.salary} LPA</Badge>
          </div>
        </div>
        <Button
          onClick={isApplied ? undefined : applyJobHandler}
          disabled={isApplied || isLoading}
          className={`rounded-lg ${buttonStyle}`}
        >
          {isLoading ? "Loading..." : isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>
      <div className='my-4'>
        <h1 className='border-b-2 pb-1 border-b-gray-300 font-medium'>Job Description</h1>
      </div>
      <div>
        <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJobById?.title}</span></h1>
        <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJobById?.location}</span></h1>
        <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJobById?.description}</span></h1>
        <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJobById?.experienceLevel}</span></h1>
        <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJobById?.salary} LPA</span></h1>
        <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJobById?.applications?.length}</span></h1>
        <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJobById?.createdAt?.split("T")[0]}</span></h1>
      </div>
    </div>
  );
};

export default JobDescription;