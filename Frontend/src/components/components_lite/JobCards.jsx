import React from "react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const JobCards = ({job}) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
 
  const handleClick = () => {
    if (!user) {
      const goToLogin = window.confirm(
        "Please login to view job details. Click OK to go to the login page."
      );
      if (goToLogin) navigate("/login");
      return;
    }
    navigate(`/description/${job._id}`);
  };

  return (
    <div onClick={handleClick} className="p-5 rounded-md shadow-xl bg-white  border border-gray-200 cursor-pointer hover:shadow-2xl hover:shadow-blue-200 hover:p-3 ">
      <div>

        <h1 className="text-lg font-medium"> {job.name} </h1>
       
        <p className="text-sm text-gray-600">Ethiopia</p>
      </div>
      <div>
        <h2 className="font-bold text-lg my-2">{job.title}</h2>
        <p className="text-sm text-gray-600">
          {
            job.description
          }
        </p>
      </div>
      <div className=" flex gap-2 items-center mt-4 ">
        <Badge className={" text-blue-600 font-bold"} variant={"ghost"}>
          {job.position} Vacancy
        </Badge>
        <Badge className={" text-[#FA4F09] font-bold"} variant={"ghost"}>
          {job.salary}ETB/month
        </Badge>
        <Badge className={" text-[#6B3AC2]  font-bold"} variant={"ghost"}>
          {job.location}
        </Badge>
        <Badge className={" text-black font-bold"} variant={"ghost"}>
          {job.jobType}
        </Badge>
      </div>
    </div>
  );
};

export default JobCards;