import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Navigate, useNavigate } from "react-router-dom";
import { RadioGroup } from "../ui/radio-group";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const ChangeFilehandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true)); // Start loading
      
      const fullApiUrl = `${USER_API_ENDPOINT}/login`; 

      const res = await axios.post(fullApiUrl, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        // Store token (if returned) so we can use Authorization header for subsequent API calls
        if (res.data.token) {
          try {
            localStorage.setItem('token', res.data.token);
          } catch (e) {
            console.warn('Unable to store token in localStorage', e);
          }
        }
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      // Log the error for better debugging if the 404 is fixed and a new error occurs
      console.error("Login API Error:", error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || "Login failed. Check console for details.");
    } finally {
      dispatch(setLoading(false)); // End loading
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]); // Added dependencies for useEffect

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Welcome Back Section - Outside Form Box */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
        </div>
        
        <form
          onSubmit={submitHandler}
          className="w-full border border-gray-500 rounded-md p-4 sm:p-6 md:p-8 bg-white shadow-lg"
        >
          <h1 className="font-bold text-xl sm:text-2xl mb-5 text-center text-blue-600">
            Login
          </h1>
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
            <Label className="text-sm font-semibold text-gray-700">Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="********"
              className="w-full text-sm px-3 py-2"
            ></Input>
          </div>
          <div className="text-right mt-1">
            <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
            

          {loading ? (
            <div className="flex items-center justify-center my-6">
              <div className="text-blue-600 font-medium">Loading...</div>
            </div>
          ) : (
            <div className="my-4">
              <button
                type="submit"
                className="w-full py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
              >
                Login
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;