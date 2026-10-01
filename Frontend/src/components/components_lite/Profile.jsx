import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "../ui/badge";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import useGetAppliedJobs from "@/hooks/useGetAllAppliedJobs";
import AppliedJob from "./AppliedJob";

 
const isResume = true;
const Profile = () => {

  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { singleCompany } = useSelector((store) => store.company || {});

  // Determine company id if stored as an ObjectId or object without name
  let companyId = null;
  const companyRef = user?.profile?.company;
  if (companyRef) {
    if (typeof companyRef === 'string') companyId = companyRef;
    else if (companyRef._id && !companyRef.name) companyId = companyRef._id;
  }

  // Fetch company details if needed
  useGetCompanyById(companyId);

  // Fetch applied jobs only for Job Seekers
  useGetAppliedJobs(user?.role === 'Job Seeker');

  const companyName = user?.profile?.company?.name || singleCompany?.name || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="bg-white border border-gray-200 rounded-2xl shadow shadow-gray-400 hover:shadow-yellow-400 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
              <Avatar className="cursor-pointer h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0">
                <AvatarImage
                  src={user?.profile?.profilePhoto}
                  alt="@shadcn"
                  onError={(e) => {
                    e.currentTarget.src = "";
                  }}
                />
                <AvatarFallback name={user?.fullname} />
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="font-medium text-lg sm:text-xl">{user?.fullname}</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">{user?.profile?.bio || "No bio available"}</p>
              </div>
            </div>
            <Button
              onClick={() => setOpen(true)}
              className="self-center sm:self-start"
              variant="outline"
              size="icon"
            >
              <Pen className="h-4 w-4" />
            </Button>
          </div>
          <div className="my-5 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base break-all">
                <a href={`mailto:${user?.email}`} className="text-blue-600 hover:underline">{user?.email}</a>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Contact className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base">
                <a href={`tel:${user?.phoneNumber}`} className="text-blue-600 hover:underline">{user?.phoneNumber}</a>
              </span>
            </div>
          </div>

          <div className="my-5">
            <h1 className="text-base sm:text-lg font-semibold mb-3">Skills</h1>
            <div className="flex flex-wrap items-center gap-2">
              {user?.profile?.skills && user.profile.skills.length !== 0 ? (
                user.profile.skills.map((item, index) => (
                  <Badge key={index} className="text-xs sm:text-sm">{item}</Badge>
                ))
              ) : (
                <span className="text-gray-500 text-sm sm:text-base">No skills added</span>
              )}
            </div>
          </div>

          {/* Grade (for non-recruiters) */}
          {user?.role !== 'Recruiter' && (user?.profile?.grade != null) && (
            <div className="my-5">
              <h1 className="text-base sm:text-lg font-semibold mb-3">Grade</h1>
              <div className="text-sm sm:text-base text-gray-800">{user.profile.grade}</div>
            </div>
          )}

          {/* Company (only show for Recruiters) */}
          {companyName && user?.role === 'Recruiter' && (
            <div className="my-5">
              <div className="w-full">
                <label className="text-sm sm:text-base font-bold block mb-2">Company</label>
                <div>
                  <span className="text-sm sm:text-base text-gray-800">{companyName}</span>
                </div>
              </div>
            </div>
          )}

          {/* Resume (only for non-recruiters) */}
          {user?.role !== 'Recruiter' && (
            <div className="my-5">
              <div className="w-full">
                <label className="text-sm sm:text-base font-bold block mb-2">Resume</label>
                <div>
                  {isResume && user?.profile?.resume ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={user?.profile?.resume}
                      className="text-blue-600 hover:underline cursor-pointer text-sm sm:text-base break-all"
                    >
                      Download {user?.profile?.resumeOriginalName || "Resume"}
                    </a>
                  ) : (
                    <span className="text-gray-500 text-sm sm:text-base">No Resume Found</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Applied Jobs (only for Job Seekers) */}
          {user?.role === 'Job Seeker' && (
            <div className="my-8">
              <h1 className="text-lg font-semibold mb-3">Applied Jobs</h1>
              <AppliedJob />
            </div>
          )}
        </div>
        

      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;