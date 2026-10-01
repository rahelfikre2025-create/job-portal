import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";
import { setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const EditProfileModal = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    // keep skills as a comma-separated string for the form (backend expects comma-separated string)
    skills: user?.profile?.skills ? user.profile.skills.join(", ") : "",
    grade: user?.profile?.grade ?? "",
    // Company name for Recruiters
    companyName: user?.profile?.company?.name || "",
    // file should be a File object when user selects one; default to null
    file: null,
  });
  const dispatch = useDispatch();
  const displayResumeName = input.file ? input.file.name : "No file chosen";

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);

    // Ensure skills is sent as a comma-separated string (backend expects a string)
    const skillsString = typeof input.skills === "string" ? input.skills : (Array.isArray(input.skills) ? input.skills.join(",") : "");
    formData.append("skills", skillsString);
    formData.append("grade", input.grade);
    // include companyName for recruiters (empty clears association)
    if (typeof input.companyName !== 'undefined') formData.append('companyName', input.companyName);

    if (input.file) {
      formData.append("file", input.file);
    }

    // Client-side validation for Job Seekers: grade and resume are required
    if (user?.role === 'Job Seeker') {
      const hasGrade = (typeof input.grade !== 'undefined' && input.grade !== '' ) || (user?.profile && typeof user.profile.grade !== 'undefined' && user.profile.grade !== null);
      const hasResume = !!input.file || !!(user?.profile && user.profile.resume);
      if (!hasGrade) {
        toast.error('Grade is required for Job Seekers');
        return;
      }
      if (!hasResume) {
        toast.error('Resume is required for Job Seekers');
        return;
      }
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        // Update the redux user with the returned user object from the server
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
    setOpen(false);

  };

  const FileChangehandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  return (
    <div>
      <Dialog open={open}>
          <DialogContent
          className="sm:max-w-[500px]"
          onInteractOutside={() => setOpen(false)}
          aria-describedby="edit-profile-desc"
        >
          <DialogDescription id="edit-profile-desc" className="sr-only">
            Edit your profile information
          </DialogDescription>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          {/* Form for editing profile */}
          <form onSubmit={handleFileChange}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="sm:text-right">
                  Name
                </Label>
                <input
                  type="text"
                  id="name"
                  value={input.fullname}
                  name="fullname"
                  onChange={changeEventHandler}
                  className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="sm:text-right">
                  Email
                </Label>
                <input
                  type="email"
                  id="email"
                  value={input.email}
                  name="email"
                  onChange={changeEventHandler}
                  className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="sm:text-right">
                  Phone
                </Label>
                <input
                  type="tel"
                  id="phone"
                  value={input.phoneNumber} // Ensure this is correctly set
                  name="phoneNumber" // Ensure this matches the expected key
                  onChange={changeEventHandler}
                  className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="sm:text-right">
                  Bio
                </Label>
                <input
                  type="bio"
                  id="bio"
                  value={input.bio}
                  name="bio"
                  onChange={changeEventHandler}
                  className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              {/* Company name (only for recruiters) */}
              {user?.role === 'Recruiter' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="companyName" className="sm:text-right">Company Name</Label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={input.companyName}
                    onChange={changeEventHandler}
                    placeholder="Company name (e.g., Acme Ltd.)"
                    className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full"
                  />
                </div>
              )}
              {/* skills */}
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="sm:text-right">
                  Skills
                </Label>
                <input
                  id="skills"
                  name="skills"
                  value={input.skills}
                  onChange={changeEventHandler}
                  className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              {/* grade */}
              {user?.role !== 'Recruiter' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="grade" className="sm:text-right">
                    Grade {user?.role === 'Job Seeker' && <span className="text-red-500">*</span>}
                  </Label>
                  <input
                    id="grade"
                    name="grade"
                    value={input.grade}
                    onChange={changeEventHandler}
                    placeholder="e.g., 3.8 or 85"
                    className="sm:col-span-3 border border-gray-300 rounded-md p-2 w-full"
                    required={user?.role === 'Job Seeker'}
                  />
                </div>
              )}

              {/* Resume file upload */}
              {user?.role !== 'Recruiter' && (
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="sm:text-right">
                  Resume {user?.role === 'Job Seeker' && <span className="text-red-500">*</span>}
                </Label>
                <div className="sm:col-span-3 w-full">
                  <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="file"
                        className="inline-flex cursor-pointer items-center justify-center rounded-md bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
                      >
                        Choose file
                      </label>
                      <span className="text-sm text-gray-700 truncate max-w-[220px] sm:max-w-[240px]">
                        {displayResumeName}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 sm:text-right">
                      PDF only, up to 5MB.
                    </p>
                  </div>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept="application/pdf"
                    onChange={FileChangehandler}
                    className="hidden"
                    required={user?.role === 'Job Seeker'}
                  />
                </div>
              </div>
              )}
            </div>

            <DialogFooter>
              {loading ? (
                <Button className="w-full my-4">
                  {" "}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
                </Button>
              ) : (
                <Button type="submit" className="w-full my-4">
                  Save
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfileModal;