import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import axios from '@/lib/axios'
import { useDispatch, useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'

const EditJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: "",
        expirationDate: ""
    });
    const [loading, setLoading] = useState(false);
    const { companies } = useSelector(store => store.company);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/job/${id}`);
                if (res.data.success && res.data.job) {
                    const job = res.data.job;
                    // Safely handle the expiration date
                    let expirationDate = '';
                    try {
                        if (job.expirationDate) {
                            const date = new Date(job.expirationDate);
                            if (!isNaN(date.getTime())) {
                                expirationDate = date.toISOString().split('T')[0];
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing expiration date:', error);
                        // Set a default date 30 days from now if parsing fails
                        const defaultDate = new Date();
                        defaultDate.setDate(defaultDate.getDate() + 30);
                        expirationDate = defaultDate.toISOString().split('T')[0];
                    }

                    setInput({
                        title: job.title || '',
                        description: job.description || '',
                        requirements: job.requirements?.join(', ') || '',
                        salary: job.salary?.toString() || '',
                        location: job.location || '',
                        jobType: job.jobType || '',
                        experience: job.experienceLevel || '',
                        position: job.position || 1,
                        companyId: job.company?._id || '',
                        expirationDate
                    });
                } else {
                    toast.error('Job not found');
                    navigate('/admin/jobs');
                }
            } catch (error) {
                console.error('Error fetching job:', error);
                toast.error(error.response?.data?.message || 'Failed to fetch job details');
                navigate('/admin/jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, navigate]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const handleSelectChange = (value) => {
        const selectedCompany = companies.find(company => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany._id });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!input.title.trim() || !input.description.trim() || !input.requirements.trim() || 
            !input.salary.trim() || !input.location.trim() || !input.jobType.trim() || 
            !input.experience.trim() || !input.position || !input.companyId || !input.expirationDate) {
            toast.error('All fields are required');
            return;
        }

        // Validate salary is a number
        if (isNaN(Number(input.salary))) {
            toast.error('Salary must be a number');
            return;
        }

        // Validate position is a positive number
        if (input.position <= 0) {
            toast.error('Number of positions must be greater than 0');
            return;
        }

        // Validate expiration date is not in the past
        const selectedDate = new Date(input.expirationDate);
        const currentDate = new Date();
        if (selectedDate < currentDate) {
            toast.error('Expiration date cannot be in the past');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.put(`/job/${id}`, input);
            if (res.data.success) {
                toast.success('Job updated successfully');
                navigate("/admin/jobs");
            } else {
                toast.error(res.data.message || 'Failed to update job');
            }
        } catch (error) {
            console.error('Job update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update job');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <div className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    <h2 className="text-2xl font-bold mb-6">Edit Job</h2>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>Title *</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div>
                            <Label>Description *</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div>
                            <Label>Requirements *</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                disabled={loading}
                                required
                                placeholder="Separate requirements with commas"
                            />
                        </div>
                        <div>
                            <Label>Salary (LPA) *</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div>
                            <Label>Location *</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div>
                            <Label>Job Type *</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div>
                            <Label>Experience Level (years) *</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div>
                            <Label>Number of Positions *</Label>
                            <Input
                                type='number'
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                disabled={loading}
                                required
                                min="1"
                            />
                        </div>
                        <div>
                            <Label>Expiration Date *</Label>
                            <Input
                                type="date"
                                name="expirationDate"
                                value={input.expirationDate}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                                disabled={loading}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        {companies?.length !== 0 && (
                            <div>
                                <Label>Company *</Label>
                                <Select 
                                    onValueChange={handleSelectChange} 
                                    disabled={loading}
                                    value={companies.find(c => c._id === input.companyId)?.name.toLowerCase()}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem
                                                    key={company?._id}
                                                    value={company?.name.toLowerCase()}
                                                >
                                                    {company?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 mt-6">
                        <Button 
                            onClick={() => navigate('/admin/jobs')} 
                            variant="outline"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={submitHandler} 
                            disabled={companies?.length === 0 || loading}
                        >
                            {loading ? 'Updating...' : 'Update Job'}
                        </Button>
                    </div>
                    {companies?.length === 0 && (
                        <p className='text-red-600 text-xs font-bold text-center my-3'>
                            *Please register a company first, before editing jobs
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EditJob 