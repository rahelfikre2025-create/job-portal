import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { APPLICATION_API_ENDPOINT, CHAT_API_ENDPOINT } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import { setAllApplicants } from "@/redux/applicationSlice";
import { useState } from "react";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggleSelectAll = () => {
    if (!applicants || !applicants.applications) return;
    if (selected.length === applicants.applications.length) {
      setSelected([]);
    } else {
      setSelected(applicants.applications.map((a) => a._id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selected.includes(id)) setSelected(selected.filter((s) => s !== id));
    else setSelected([...selected, id]);
  };

  const bulkUpdate = async (status) => {
    if (selected.length === 0) return;
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_API_ENDPOINT}/status/bulk`, { applicationIds: selected, status });
      if (res.data.success) {
        toast.success('Bulk update successful');
        // update local redux state
        if (applicants) {
          const updated = {
            ...applicants,
            applications: applicants.applications.map((a) => selected.includes(a._id) ? { ...a, status: status.toLowerCase() } : a),
          };
          dispatch(setAllApplicants(updated));
        }
        // If any of the bulk updates created a conversation for accepted applicants, offer quick navigation to the first conversation
        if (res.data.results && Array.isArray(res.data.results)) {
          const firstWithConvo = res.data.results.find(r => r.conversationId);
          if (firstWithConvo && firstWithConvo.conversationId) {
            const goToChat = window.confirm('Some applicants were accepted. Open chat with the first accepted applicant now?');
            if (goToChat) {
              navigate(`/chat/${firstWithConvo.conversationId}`);
            }
          }
        }
        setSelected([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk update failed');
    }
  };

  const statusHandler = async (status, id) => {
    // removed debug log
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status }
      );
      // removed debug log
      if (res.data.success) {
        toast.success(res.data.message);
        // update local redux state so recruiter sees the new status immediately
        if (applicants) {
          const updated = {
            ...applicants,
            applications: applicants.applications.map((a) =>
              a._id === id ? { ...a, status: status.toLowerCase() } : a
            ),
          };
          dispatch(setAllApplicants(updated));
        }
        // If backend returned a conversationId for accepted status, offer quick navigation
        if (res.data.conversationId) {
          const goToChat = window.confirm("Send interview schedule now? Click OK to open chat with the applicant.");
          if (goToChat) {
            navigate(`/chat/${res.data.conversationId}`);
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };


  return (
    <div>
      <Table>
        <TableCaption>A list of your recent applied user</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input type="checkbox" checked={applicants && applicants.applications && selected.length === applicants.applications.length} onChange={toggleSelectAll} />
            </TableHead>
            <TableHead>FullName</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Skills Matched</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Skill %</TableHead>
            <TableHead>Match</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* bulk action toolbar */}
          {selected.length > 0 && (
            <tr>
              <td colSpan={8} className="py-2">
                <div className="flex gap-2">
                  <button onClick={() => bulkUpdate('accepted')} className="px-3 py-1 bg-green-600 text-white rounded">Accept Selected ({selected.length})</button>
                  <button onClick={() => bulkUpdate('rejected')} className="px-3 py-1 bg-red-600 text-white rounded">Reject Selected ({selected.length})</button>
                </div>
              </td>
            </tr>
          )}
          {applicants &&
            applicants?.applications?.map((item) => (
              <tr key={item._id}>
                <TableCell>
                  <input type="checkbox" checked={selected.includes(item._id)} onChange={() => toggleSelectOne(item._id)} />
                </TableCell>
                <TableCell>{item?.applicant?.fullname}</TableCell>
                <TableCell>{item?.applicant?.profile?.grade ?? 'N/A'}</TableCell>
                <TableCell>{item?.applicant?.email}</TableCell>
                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                <TableCell>{item?.skillsMatched ?? (item?.resumeSnapshot?.skills?.length || 0)}</TableCell>
                <TableCell>{item?.resumeSnapshot?.yearsExperience ?? item?.applicant?.profile?.resumeParsed?.yearsExperience ?? 'N/A'}</TableCell>
                <TableCell>
                  {
                    (() => {
                      const skillPercent = typeof item?.skillScore !== 'undefined' && item?.skillScore !== null ? item.skillScore : (typeof item?.matchScore !== 'undefined' && item?.matchScore !== null ? item.matchScore : null);
                      if (skillPercent === null) return 'N/A';
                      const percent = Math.max(0, Math.min(100, Number(skillPercent) || 0));
                      const matchedSkills = (item?.matchedSkills && Array.isArray(item.matchedSkills) && item.matchedSkills.length) ? item.matchedSkills : (item?.resumeSnapshot?.skills || []);
                      const details = (item?.skillMatchDetails || []).map(d => `${d.requirement} -> ${d.matchedSkill || '—'}`).join('; ');
                      const title = `Matched: ${matchedSkills.length ? matchedSkills.join(', ') : 'None'}${details ? '\nDetails: ' + details : ''}`;
                      return (
                        <div className="w-36" title={title}>
                          <div className="h-3 bg-gray-200 rounded overflow-hidden">
                            <div className="h-3 bg-green-500" style={{ width: `${percent}%` }} />
                          </div>
                          <div className="text-xs text-right mt-1">{percent}%</div>
                        </div>
                      );
                    })()
                  }
                </TableCell>
                <TableCell>{item?.matchScore ?? 'N/A'}</TableCell>
                <TableCell>
                  {item.applicant?.profile?.resume ? (
                    <a
                      className="text-blue-600 cursor-pointer"
                      href={item?.applicant?.profile?.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  ) : (
                    <span>NA</span>
                  )}
                </TableCell>
                <TableCell>
                  {item?.createdAt ? (
                    item.createdAt.split("T")[0]
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{item?.status ? item.status : "pending"}</TableCell>
                <TableCell className="float-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      {shortlistingStatus.map((status, index) => {
                        const lower = status.toLowerCase();
                        return (
                          <div
                            key={index}
                            className="flex w-fit items-center my-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              // unique name per application
                              name={`shortlistingStatus-${item?._id}`}
                              value={status}
                              checked={item?.status === lower}
                              onChange={() => statusHandler(status, item?._id)}
                            />
                            {" "}
                            {status}
                          </div>
                        );
                      })}
                      {/* Quick open chat for accepted applicants */}
                      {item?.status === 'accepted' && (
                        <div className="mt-2">
                          <button
                            className="w-full inline-flex items-center justify-center px-3 py-1 rounded bg-blue-600 text-white text-sm"
                            onClick={async () => {
                              try {
                                const res = await axios.post(`${APPLICATION_API_ENDPOINT}/${item._id}/open-chat`, {}, { withCredentials: true });
                                if (res?.data?.conversationId) {
                                  navigate(`/chat/${res.data.conversationId}`);
                                }
                              } catch (err) {
                                toast.error('Failed to open chat');
                              }
                            }}
                          >
                            Open Chat
                          </button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </tr>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;