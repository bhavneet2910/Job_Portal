import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import axios from '@/lib/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const CreateJobs = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const { companies } = useSelector(store => store.company);
    const navigate = useNavigate();

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
            !input.experience.trim() || !input.position || !input.companyId) {
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

        setLoading(true);
        try {
            const res = await axios.post('/job/postjob', input);
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            } else {
                toast.error(res.data.message || 'Failed to create job');
            }
        } catch (error) {
            console.error('Job creation error:', error);
            toast.error(error.response?.data?.message || 'Failed to create job');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <div className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
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
                        {
                            companies.length !== 0 && (
                                <div>
                                    <Label>Company *</Label>
                                    <Select onValueChange={handleSelectChange} disabled={loading}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    companies && companies.map((company) => {
                                                        return (
                                                            <SelectItem
                                                                key={company?._id}
                                                                value={company?.name.toLowerCase()}
                                                            >
                                                                {company?.name}
                                                            </SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }
                    </div>
                    <Button 
                        onClick={submitHandler} 
                        disabled={companies?.length === 0 || loading} 
                        className='w-full mt-4'
                    >
                        {loading ? 'Creating...' : 'Post New Job'}
                    </Button>
                    {
                        companies.length === 0 && <p className='text-red-600 text-xs font-bold text-center my-3'>*Please register a company first, before posting jobs</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateJobs