import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import store from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const companyArray = [];

const PostJob = () => {
  const { id } = useParams();
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    // legacy single salary and preferred min/max range
    salary: "",
    salaryMin: "",
    salaryMax: "",
    currency: "ETB",
    applicationDeadline: "",
    location: "",
    jobType: "Full-Time",
    experience: "",
    position: 0,
    companyId: "",
  });
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth || {});
  const { companies } = useSelector((store) => store.company);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");

  const selectChangeHandler = (value) => {
    setSelectedCompany(value);
    const selectedCompanyObj = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    if (selectedCompanyObj) setInput({ ...input, companyId: selectedCompanyObj._id });
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${id}`);
        if (res.data.status) {
          const job = res.data.job;
          setInput({
            title: job.title || "",
            description: job.description || "",
            requirements: Array.isArray(job.requirements) ? job.requirements.join(",") : job.requirements || "",
            salary: job.salary || "",
            salaryMin: job.salaryMin || "",
            salaryMax: job.salaryMax || "",
            currency: job.currency || "ETB",
            applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().slice(0,10) : "",
            location: job.location || "",
            jobType: job.jobType || "",
            experience: job.experienceLevel || "",
            position: job.position || 0,
            companyId: job.company?._id || "",
          });
          setSelectedCompany(job.company?.name?.toLowerCase() || "");
        } else {
          toast.error(res.data.message || "Failed to fetch job");
        }
      } catch (err) {
        toast.error("Failed to load job");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    // Prevent banned users from posting
    if (user && user.isBanned) {
      toast.error('Your account is banned. You cannot post jobs.');
      return;
    }
    try {
      setLoading(true);
      if (id) {
        const res = await axios.put(`${JOB_API_ENDPOINT}/update/${id}`, input, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (res.data.status) {
          toast.success(res.data.message || "Job updated");
          navigate("/recruiter/jobs");
        } else {
          toast.error(res.data.message || "Failed to update job");
        }
      } else {
        const res = await axios.post(`${JOB_API_ENDPOINT}/post`, input, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/recruiter/jobs");
        } else {
          toast.error(res.data.message);
          navigate("/recruiter/jobs");
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-500 shadow-sm hover:shadow-xl hover:shadow-red-300 rounded-lg"
        >
          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                placeholder="Enter job title"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <textarea
                name="description"
                value={input.description}
                placeholder="Enter job description"
                className="w-full border rounded-md px-3 py-2 focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
                rows={5}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                placeholder="Enter job location (e.g., Addis Ababa or Remote)"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Salary (min)</Label>
              <Input
                type="number"
                name="salaryMin"
                value={input.salaryMin}
                placeholder="Minimum salary"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Salary (max)</Label>
              <Input
                type="number"
                name="salaryMax"
                value={input.salaryMax}
                placeholder="Maximum salary"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Input
                type="text"
                name="currency"
                value={input.currency}
                placeholder="Currency (e.g., ETB)"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Application Deadline</Label>
              <Input
                type="date"
                name="applicationDeadline"
                value={input.applicationDeadline}
                placeholder="Application deadline"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Vacancy</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                placeholder="Enter number of vacancies"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                placeholder="Enter job requirements (comma-separated)"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Experience</Label>
              <Input
                type="number"
                name="experience"
                value={input.experience}
                placeholder="Enter job experience"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Select value={input.jobType} onValueChange={(val) => setInput(prev => ({...prev, jobType: val}))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              {companies.length > 0 && (
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mt-5">
            {loading ? (
              <Button className="w-full px-4 py-2 text-sm text-white bg-black rounded-md ">
                {" "}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={user?.isBanned}
                className={`w-full px-4 py-2 text-sm text-white rounded-md ${user?.isBanned ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-blue-600'}`}
                title={user?.isBanned ? 'Your account is banned. Posting disabled.' : ''}
              >
                {user?.isBanned ? 'Posting Disabled' : 'Post Job'}
              </Button>
            )}
          </div>
          <p className="text-sm font-medium mt-3 text-center text-yellow-700">
            Note: Job postings require approval by an Administrator before appearing to job seekers.
          </p>
          {companies.length === 0 && (
            <p className="text-sm font-bold my-3 text-center text-red-600">
              *Please register a company to post jobs.*
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;