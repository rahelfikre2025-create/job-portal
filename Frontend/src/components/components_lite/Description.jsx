import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { toast } from "sonner";
import { MdLocationOn, MdLaptop } from "react-icons/md";

const Description = () => {
  const params = useParams();
  const jobId = params.id;

  const { singleJob = null } = useSelector((store) => store.job || {});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);
  // whether the job application deadline has passed
  const [isExpired, setIsExpired] = useState(
    singleJob?.applicationDeadline ? new Date(singleJob.applicationDeadline).getTime() < Date.now() : false
  );
  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
        { withCredentials: true }
      );
        if (res.data.success) {
          setIsApplied(true);
          const updateSingleJob = {
            ...singleJob,
            applications: [...singleJob.applications, { applicant: user?._id }],
          };
          dispatch(setSingleJob(updateSingleJob));
          toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message || "Application failed");
    }
  };

  useEffect(() => {
    const fetchSingleJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });
        // accept either a job property or the data itself
        const jobData = res.data?.job || res.data;
        if (jobData) {
          dispatch(setSingleJob(jobData));
          setIsApplied(
            jobData.applications?.some(
              (application) => application.applicant === user?._id
            ) || false
          );
          // update expired state whenever job is fetched
          setIsExpired(jobData.applicationDeadline ? new Date(jobData.applicationDeadline).getTime() < Date.now() : false);
        } else {
          setError(res.data?.message || "Failed to fetch job.");
        }
      } catch (error) {
        console.error("Fetch Error:", error, error.response?.data);
        const serverMessage = error.response?.data?.message || error.response?.data?.error;
        setError(serverMessage || error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleJobs();
  }, [jobId, dispatch, user?._id]);
  
  // singleJob available in Redux state; debug logs removed

  // Safe data formatting functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return dateString.split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const formatRelativeDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString).getTime();
      const diff = Date.now() - d;
      const seconds = Math.floor(diff / 1000);
      if (seconds < 60) return `${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days} days ago`;
      const weeks = Math.floor(days / 7);
      if (weeks < 4) return `${weeks} weeks ago`;
      const months = Math.floor(days / 30);
      if (months < 12) return `${months} months ago`;
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting relative date:", error);
      return "Invalid Date";
    }
  };

  const formatDeadline = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString).getTime();
      const diff = d - Date.now();
      if (diff < 0) return "Expired";
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (days === 0) return "Today";
      if (days === 1) return "In 1 day";
      return `In ${days} days`;
    } catch (error) {
      console.error("Error formatting deadline:", error);
      return "Invalid Date";
    }
  };

  const formatRequirements = (requirementsString) => {
    if (!requirementsString) return [];
    // requirements may already be an array from API or a comma-separated string
    if (Array.isArray(requirementsString)) return requirementsString.filter(r => !!r);
    if (typeof requirementsString === 'string') {
      try {
        return requirementsString.split(',').map(req => req.trim()).filter(req => req.length > 0);
      } catch (error) {
        console.error("Error formatting requirements:", error);
        return [];
      }
    }
    return [];
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || amount === "") return null;
    try {
      return new Intl.NumberFormat('en-US').format(Number(amount));
    } catch (error) {
      return amount;
    }
  };

  const renderSalary = () => {
    const cur = singleJob?.currency || 'ETB';
    if (singleJob?.salaryMin != null && singleJob?.salaryMax != null) {
      return `${cur} ${formatCurrency(singleJob.salaryMin)} - ${formatCurrency(singleJob.salaryMax)} / month`;
    }
    if (singleJob?.salary != null) {
      return `${cur} ${formatCurrency(singleJob.salary)} / month`;
    }
    return 'N/A';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>;
  }

  if (!singleJob) {
    return <div className="flex justify-center items-center h-64">Job not found</div>;
  }

  const requirementsList = formatRequirements(singleJob?.requirements);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="font-bold text-lg sm:text-xl md:text-2xl mb-1">{singleJob?.title || "No Title"}</h1>
              <div className="text-sm text-gray-600 mb-2">Company: <strong className="text-gray-800">{singleJob?.company?.name || 'N/A'}</strong></div>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-2xl md:text-3xl font-extrabold text-[#FA4F09]">{renderSalary()}</div>
                <div className="flex gap-2 items-center flex-wrap">
                  <Badge className="text-blue-600 font-bold text-xs sm:text-sm" variant="ghost">
                    {singleJob?.position || "N/A"} Vacancy
                  </Badge>
                  <Badge className="text-[#6B3AC2] font-bold text-xs sm:text-sm" variant="ghost">
                    {/* location with icon */}
                    {singleJob?.location && singleJob.location.toLowerCase().includes('remote') ? (
                      <span className="flex items-center gap-1"><MdLaptop className="h-4 w-4" /> Remote</span>
                    ) : (
                      <span className="flex items-center gap-1"><MdLocationOn className="h-4 w-4" /> {singleJob?.location || 'N/A'}</span>
                    )}
                  </Badge>
                  <Badge className="text-black font-bold text-xs sm:text-sm" variant="ghost">
                    {singleJob?.jobType || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={() => {
                  if (isApplied) return;
                  if (isExpired) {
                    toast.error('Application deadline has passed');
                    return;
                  }
                  if (!user) {
                    const goToLogin = window.confirm(
                      "Please login to apply for this job. Click OK to go to the login page."
                    );
                    if (goToLogin) navigate("/login");
                    return;
                  }
                  if (user?.isBanned) {
                    toast.error('Your account is banned. You cannot apply for jobs.');
                    return;
                  }
                  applyJobHandler();
                }}
                disabled={isApplied || isExpired || user?.isBanned}
                className={`w-full sm:w-auto rounded-lg text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 ${
                  isApplied || isExpired || user?.isBanned
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#6B3AC2] hover:bg-[#552d9b]"
                }`}
                title={user?.isBanned ? 'Account banned. Contact administrator.' : ''}
              >
                {isApplied ? "Already Applied" : isExpired ? "Expired" : user?.isBanned ? 'Banned' : "Apply"}
              </Button>
            </div>
          </div>
          
          <div className="border-b-2 border-b-gray-400 py-4 mb-6">
            <p className="font-medium text-sm sm:text-base whitespace-pre-wrap">{singleJob?.description || "No description available"}</p>
          </div>
          
          <div className="my-4 space-y-3">

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <h1 className="font-bold text-sm sm:text-base min-w-[120px]">Location:</h1>
              <span className="font-normal text-gray-800 text-sm sm:text-base sm:pl-4">{singleJob?.location || "N/A"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <h1 className="font-bold text-sm sm:text-base min-w-[120px]">Salary:</h1>
              <span className="font-normal text-gray-800 text-sm sm:text-base sm:pl-4">{renderSalary()}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <h1 className="font-bold text-sm sm:text-base min-w-[120px]">Experience:</h1>
              <span className="font-normal text-gray-800 text-sm sm:text-base sm:pl-4">{singleJob?.experienceLevel || "N/A"} Year</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <h1 className="font-bold text-sm sm:text-base min-w-[120px]">Job Type:</h1>
              <span className="font-normal text-gray-800 text-sm sm:text-base sm:pl-4">{singleJob?.jobType || "N/A"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <h1 className="font-bold text-sm sm:text-base min-w-[120px]">Post Date:</h1>
              <span className="font-normal text-gray-800 text-sm sm:text-base sm:pl-4">{formatRelativeDate(singleJob?.createdAt)}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <h1 className="font-bold text-sm sm:text-base min-w-[120px]">Application Deadline:</h1>
              <span className="font-normal text-gray-800 text-sm sm:text-base sm:pl-4">{singleJob?.applicationDeadline ? `${formatDate(singleJob.applicationDeadline)} (${formatDeadline(singleJob.applicationDeadline)})` : 'N/A'}</span>
            </div>

            {/* Poster details */}
            { (user?.role === 'Administrator' || user?.role === 'Recruiter') && (
            <div className="mt-6 border-t pt-4">
              <h1 className="font-bold text-sm sm:text-base mb-2">Posted by</h1>
              <div className="flex items-center gap-4">
                {singleJob?.created_by?.profile?.profilePhoto ? (
                  <img src={singleJob.created_by.profile.profilePhoto} alt="poster" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">N/A</div>
                )}
                <div>
                  <div className="font-semibold">{singleJob?.created_by?.fullname || 'N/A'}</div>
                  <div className="text-sm text-gray-600">{singleJob?.created_by?.role || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{singleJob?.created_by?.email}</div>
                  <div className="text-sm text-gray-500">{singleJob?.created_by?.phoneNumber}</div>
                </div>
              </div>
            </div>
          )}

            {/* Company background */}
            <div className="mt-6 border-t pt-4">
              <h1 className="font-bold text-sm sm:text-base mb-2">Company background</h1>
              <div className="flex gap-4 items-start">
                {singleJob?.company?.logo ? (
                  <img src={singleJob.company.logo} alt="company logo" className="w-24 h-24 object-cover rounded" />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-gray-500">No Logo</div>
                )}
                <div>
                  <div className="font-semibold">{singleJob?.company?.name || 'N/A'}</div>
                  <div className="text-sm text-gray-600 mb-2">{singleJob?.company?.description || 'No company description available'}</div>
                  {singleJob?.company?.website && (
                    <div className="text-sm text-blue-600"><a href={singleJob.company.website} target="_blank" rel="noopener noreferrer">{singleJob.company.website}</a></div>
                  )}
                  {singleJob?.company?.location && (
                    <div className="text-sm text-gray-500">Location: {singleJob.company.location}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Requirements/Skills Section - Completely Safe */}
            <div className="mt-6">
              <h1 className="font-bold text-sm sm:text-base mb-3">Requirements/Skills:</h1>
              <div className="flex gap-2 items-center flex-wrap">
                {requirementsList.length > 0 ? (
                  requirementsList.map((req, index) => (
                    <Badge key={index} className="bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm" variant="outline">
                      {req}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 font-normal text-sm sm:text-base">No requirements specified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;