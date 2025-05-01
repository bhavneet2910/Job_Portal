import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import Footer from './shared/Footer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Jobnotfound from './Jobnotfound'
import { Badge } from './ui/badge'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Jobs = () => {
    const { authUser } = useSelector((store) => store.auth);
    const { allJobs, searchText, jobStats } = useSelector((store) => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const navigate = useNavigate();

    // Call the hook to fetch jobs
    useGetAllJobs();

    useEffect(() => {
        if (searchText) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchText.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchText.toLowerCase()) ||
                    job?.location?.toLowerCase().includes(searchText.toLowerCase())
            })
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchText]);

    // Only redirect if user is authenticated and is a recruiter
    useEffect(() => {
        if (authUser?.role === 'recruiter') {
            navigate("/admin/jobs");
        }
    }, [authUser, navigate]);

    // Show login message if not authenticated
    if (!authUser) {
        return (
            <div className='bg-gray-100 min-h-screen'>
                <Navbar />
                <div className='max-w-7xl mx-auto mt-5 p-8 text-center'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-4'>Please Login</h2>
                    <p className='text-gray-600 mb-4'>You need to be logged in to view available jobs.</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className='bg-[#7209b7] text-white px-6 py-2 rounded-lg hover:bg-[#5f32ad]'
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-gray-100 min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-[20%]'>
                        <FilterCard />
                    </div>
                    <div className='flex-1'>
                        <div className='mb-4 flex items-center gap-2'>
                            <Badge className="bg-green-600 text-white">Active Jobs: {jobStats?.activeJobs || 0}</Badge>
                            <Badge className="bg-blue-600 text-white">Total Jobs: {jobStats?.totalJobs || 0}</Badge>
                            {jobStats?.expiredJobs > 0 && (
                                <Badge className="bg-red-600 text-white">Expired Jobs: {jobStats?.expiredJobs}</Badge>
                            )}
                        </div>
                        {filterJobs?.length <= 0 ? (
                            <div className='bg-white p-8 rounded-lg shadow text-center'>
                                <h3 className='text-xl font-semibold text-gray-800 mb-2'>No Jobs Available</h3>
                                <p className='text-gray-600'>
                                    {searchText 
                                        ? "No jobs match your search criteria. Try different keywords."
                                        : "There are currently no active job listings. Please check back later."}
                                </p>
                            </div>
                        ) : (
                            <div className='grid grid-cols-3 gap-4'>
                                {filterJobs.map((job) => (
                                    <motion.div
                                        key={job._id}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default Jobs