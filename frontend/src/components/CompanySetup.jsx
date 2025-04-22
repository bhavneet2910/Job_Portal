import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import useGetCompanyById from '@/hooks/useGetCompanyById';
import axios from '@/lib/axios';

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id); // Fetching company by ID
    const { singleCompany } = useSelector(store => store.company);
    const [input, setInput] = useState({
        name: '',
        description: '',
        website: '',
        location: '',
        file: null
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('File size should be less than 5MB');
            return;
        }
        setInput({ ...input, file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.name.trim()) {
            toast.error('Company name is required');
            return;
        }
        
        setLoading(true);
        const formData = new FormData();
        formData.append('name', input.name.trim());
        formData.append('description', input.description.trim());
        formData.append('website', input.website.trim());
        formData.append('location', input.location.trim());
        if (input.file) {
            formData.append('file', input.file);
        }

        try {
            const res = await axios.put(`/company/update/${params.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            } else {
                toast.error(res.data.message || 'Failed to update company');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update company');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: null
            });
        }
    }, [singleCompany]);

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler} className='shadow-lg p-8'>
                    <div className='flex items-center gap-5 mb-10'>
                        <Button 
                            variant="ghost" 
                            onClick={() => navigate("/admin/companies")} 
                            className='flex items-center gap-2 text-gray-500 font-semibold'
                            disabled={loading}
                        >
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl'>Company Setup</h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Company Name *</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label>Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label>Logo (max 5MB)</Label>
                            <Input 
                                accept="image/*" 
                                type="file"
                                onChange={changeFileHandler}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <Button 
                        type="submit" 
                        className="w-full mt-8"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CompanySetup;