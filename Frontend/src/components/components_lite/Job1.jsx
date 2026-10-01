import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Bookmark } from "lucide-react";

const Job1 = ({ job }) => {
  const navigate = useNavigate(); 

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  return (
    <div className="p-4 sm:p-5 rounded-md shadow-xl bg-white border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs sm:text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <Button variant="outline" className="rounded-full h-8 w-8 sm:h-10 sm:w-10" size="icon">
          <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 my-2">
        <Button className="p-4 sm:p-6 h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0" variant="outline" size="icon">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage
              src={job?.company?.logo}
              onError={(e) => {
                e.currentTarget.src = "";
              }}
            />
            <AvatarFallback name={job?.company?.name} />
          </Avatar>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="font-medium text-base sm:text-lg truncate">{job?.company?.name}</h1>
          <p className="text-xs sm:text-sm text-gray-500">Ethiopia</p>
        </div>
      </div>

      <div className="flex-1">
        <h1 className="font-bold text-base sm:text-lg my-2 line-clamp-2">{job?.title}</h1>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">{job?.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge className={"text-blue-700 font-bold text-xs"} variant="ghost">
          {job?.position} open
        </Badge>
        <Badge className={"text-[#F83002] font-bold text-xs"} variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className={"text-[#7209b7] font-bold text-xs"} variant="ghost">
          {job?.salary}ETB/month
        </Badge>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="w-full sm:w-auto text-sm"
        >
          Details
        </Button>
      </div>
    </div>
  );
};

export default Job1;

