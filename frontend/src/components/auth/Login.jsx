import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup } from "../ui/radio-group";
import axiosInstance from "@/lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateInput = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!input.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(input.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!input.password) {
      newErrors.password = "Password is required";
    } else if (input.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!input.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!validateInput()) {
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.post("/user/login", input);
      
      if (res.data.success) {
        // Set the token in cookie
        document.cookie = `token=${res.data.token}; path=/;`;
        
        // Update auth state
        dispatch(setAuthUser(res.data.user));
        
        // Show welcome message
        toast.success(`Welcome back ${res.data.user.fullname}`);
        
        // Get the redirect URL from localStorage
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        localStorage.removeItem('redirectAfterLogin');
        
        // Navigate based on role and redirect path
        if (redirectPath) {
          navigate(redirectPath);
        } else if (res.data.user.role === 'recruiter') {
          navigate('/admin/companies');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      
      // Set specific field errors if available
      if (error.response?.data?.field) {
        setErrors(prev => ({
          ...prev,
          [error.response.data.field]: errorMessage
        }));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              className="w-full"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={input.password}
              onChange={changeEventHandler}
              className="w-full"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <div>
            <Label>Role</Label>
            <RadioGroup
              name="role"
              value={input.role}
              onChange={changeEventHandler}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="student"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                />
                <Label htmlFor="student">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="recruiter"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                />
                <Label htmlFor="recruiter">Recruiter</Label>
              </div>
            </RadioGroup>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#6A38C2] hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
