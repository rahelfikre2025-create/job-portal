import { setAllAdminJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminJobs = (pending = false) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const url = `${JOB_API_ENDPOINT}/getadminjobs${pending ? '?pending=true' : ''}`;
        const res = await axios.get(url, {
          withCredentials: true,
          headers,
        });
        if (res.data.status) {
          // Updated success check
          dispatch(setAllAdminJobs(res.data.jobs));
        } else {
          setError("Failed to fetch jobs.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllAdminJobs();

    const handler = () => fetchAllAdminJobs();
    window.addEventListener('jobStatusUpdated', handler);
    return () => window.removeEventListener('jobStatusUpdated', handler);
  }, [dispatch, pending]);

  return { loading, error };
};

export default useGetAllAdminJobs;