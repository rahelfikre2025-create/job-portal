import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

const Register = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    phoneNumber: "",
    pancard: "",
    adharcard: "",
    file: "",
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading } = useSelector((store) => store.auth);
  const displayPhotoName = input.file
    ? typeof input.file === "string"
      ? input.file
      : input.file.name
    : "No file selected";
  
  // Check if passwords match
  const passwordsMatch = input.password && input.confirmPassword && input.password === input.confirmPassword;
  const passwordsDoNotMatch = input.password && input.confirmPassword && input.password !== input.confirmPassword;
  
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const ChangeFilehandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Client-side validation to reduce server errors
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPassword = (p) => typeof p === 'string' && p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);
    if (!input.fullname || input.fullname.trim().length < 2) {
      toast.error('Full name must be at least 2 characters');
      return;
    }
    if (!input.email || !emailRegex.test(input.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!input.phoneNumber || input.phoneNumber.trim().length < 7) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (!input.password || !input.confirmPassword) {
      toast.error('Please fill in both password fields!');
      return;
    }
    if (input.password !== input.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (!strongPassword(input.password)) {
      toast.error('Password must be at least 8 characters and include upper, lower, number and symbol');
      return;
    }
    if (!input.role) {
      toast.error('Please select a role');
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("phoneNumber", input.phoneNumber);
    if (input.file) {
      formData.append("profilePhoto", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data && res.data.success) {
        navigate('/login');
        toast.success(res.data.message || 'Registered successfully');
      } else {
        const msg = (res.data && res.data.message) || 'Registration failed';
        toast.error(msg);
      }
    } catch (err) {
      // Better error handling & messages
      if (err.response) {
        // Server responded with a status other than 2xx
        const status = err.response.status;
        const data = err.response.data || {};
        const msg = data?.message || (Array.isArray(data?.errors) ? data.errors.join('; ') : (typeof data === 'string' ? data : 'Registration failed'));
        console.error(`Register failed: ${status} - ${msg}`);
        toast.error(msg);
      } else if (err.request) {
        // Request made but no response received
        console.error('No response from server:', err.message);
        toast.error('Unable to reach server. Is the backend running?');
      } else {
        // Something else happened
        console.error('Register error:', err.message);
        toast.error('An unexpected error occurred');
      }

      // Reset file input if upload failed
      setInput(prevInput => ({ ...prevInput, file: "" }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-xl">
        {/* Welcome Section - Outside Form Box */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Start Your Journey
          </h2>
        </div>
        
        <form
          onSubmit={submitHandler}
          className="w-full border border-gray-200 rounded-md p-4 sm:p-6 md:p-8 shadow-sm bg-white"
        >
          <h1 className="font-bold text-xl sm:text-2xl mb-5 text-center text-blue-600">
            Register
          </h1>
          <div className="my-2">
            <Label className="text-sm font-semibold text-gray-700">Fullname</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Fullname"
              className="w-full text-sm px-3 py-2"
            ></Input>
          </div>
          <div className="my-2">
            <Label className="text-sm font-semibold text-gray-700">Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter email address"
              className="w-full text-sm px-3 py-2"
            ></Input>
          </div>
          <div className="my-2">
            <Label className="text-sm font-semibold text-gray-700">Create Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Create password"
              className={`w-full text-sm px-3 py-2 ${
                passwordsDoNotMatch ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            ></Input>
          </div>
          <div className="my-2">
            <Label className="text-sm font-semibold text-gray-700">Confirm Password</Label>
            <Input
              type="password"
              value={input.confirmPassword}
              name="confirmPassword"
              onChange={changeEventHandler}
              placeholder="Confirm password"
              className={`w-full text-sm px-3 py-2 ${
                passwordsDoNotMatch ? "border-red-500 focus:border-red-500 focus:ring-red-500" : 
                passwordsMatch ? "border-green-500 focus:border-green-500 focus:ring-green-500" : ""
              }`}
            ></Input>
            {passwordsDoNotMatch && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match!</p>
            )}
            {passwordsMatch && (
              <p className="text-green-600 text-xs mt-1">Passwords match!</p>
            )}
          </div>
          <div className="my-2">
            <Label className="text-sm font-semibold text-gray-700">Phone Number</Label>
            <Input
              type="tel"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="Phone number"
              className="w-full text-sm px-3 py-2"
            ></Input>
          </div>
          <div className="my-4">
            <Label className="block mb-2 text-sm font-semibold text-gray-700">Select Your Role</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                htmlFor="register-role-jobseeker"
                className={`relative flex items-center justify-center p-1.5 border-2 rounded-md cursor-pointer transition-all h-8 ${
                  input.role === "Job Seeker"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  id="register-role-jobseeker"
                  name="role"
                  value="Job Seeker"
                  checked={input.role === "Job Seeker"}
                  onChange={changeEventHandler}
                  className="sr-only"
                />
                <span className="text-xs font-medium text-center">Job Seeker</span>
                {input.role === "Job Seeker" && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                )}
              </label>
              
              <label
                htmlFor="register-role-recruiter"
                className={`relative flex items-center justify-center p-1.5 border-2 rounded-md cursor-pointer transition-all h-8 ${
                  input.role === "Recruiter"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  id="register-role-recruiter"
                  name="role"
                  value="Recruiter"
                  checked={input.role === "Recruiter"}
                  onChange={changeEventHandler}
                  className="sr-only"
                />
                <span className="text-xs font-medium text-center">Recruiter</span>
                {input.role === "Recruiter" && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                )}
              </label>
            </div>
          </div>

          <div className="my-4">
            <Label className="block mb-2 text-sm font-semibold text-gray-700">Profile photo</Label>
            <div className="rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-2 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                <label
                  htmlFor="profile-photo-upload"
                  className="inline-flex cursor-pointer items-center justify-center rounded-md bg-blue-50 px-2 sm:px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition whitespace-nowrap"
                >
                  Choose file
                </label>
                <span className="text-xs text-gray-700 truncate max-w-full sm:max-w-[150px]">
                  {displayPhotoName}
                </span>
              </div>
              <p className="text-xs text-gray-500 sm:text-right">
                JPG or PNG, up to 5MB.
              </p>
            </div>
            <input
              type="file"
              id="profile-photo-upload"
              name="profilePhoto"
              onChange={ChangeFilehandler}
              className="hidden"
              accept="image/jpeg,image/png,image/jpg"
            />
          </div>

          <button
            type="submit"
            disabled={passwordsDoNotMatch || !input.password || !input.confirmPassword || loading}
            className={`block w-full py-3 my-3 text-white rounded-md transition text-sm sm:text-base font-semibold ${
              passwordsDoNotMatch || !input.password || !input.confirmPassword
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="text-gray-500 text-sm sm:text-base text-center my-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;