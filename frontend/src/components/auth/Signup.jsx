import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { RadioGroup } from '../ui/radio-group'
import axiosInstance from '@/lib/axios'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const { loading } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    } 
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.post("/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.data.success) {
        toast.success(res.data.message);
        // The ProtectedRoute will handle navigation
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
        <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
          <h1 className='font-bold text-xl mb-4'>Sign Up</h1>
          <div className='my-2'>
            <Label>Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="patel"
              required
            />
          </div>
          <div className='my-2'>
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="patel@gmail.com"
              required
            />
          </div>
          <div className='my-2'>
            <Label>Phone Number</Label>
            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="1234567890"
              required
            />
          </div>
          <div className='my-2'>
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="password"
              required
            />
          </div>
          <RadioGroup
            defaultValue="comfortable"
            className="flex items-center gap-4 my-5"
          >
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="student"
                checked={input.role === "student"}
                onChange={changeEventHandler}
                required
              />
              <Label htmlFor="r1">Students</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="recruiter"
                checked={input.role === "recruiter"}
                onChange={changeEventHandler}
                required
              />
              <Label htmlFor="r2">Recruiter</Label>
            </div>
          </RadioGroup>
          <div className='my-2'>
            <Label>Profile Photo</Label>
            <Input
              type="file"
              name="file"
              onChange={changeFileHandler}
              accept="image/*"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
          </Button>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Signup;