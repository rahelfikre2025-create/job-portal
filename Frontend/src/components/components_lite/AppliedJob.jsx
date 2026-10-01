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
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

const AppliedJob = () => {
  const { allAppliedJobs = [] } = useSelector((store) => store.job || {});
  return (
    <div className="overflow-x-auto">
      {allAppliedJobs.length <= 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
          You have not applied any job yet.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <Table>
              <TableCaption>Recent Applied Jobs</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm">Job Title</TableHead>
                  <TableHead className="text-xs sm:text-sm">Company</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAppliedJobs.map((appliedJob) => (
                  <TableRow key={appliedJob._id}>
                    <TableCell className="text-xs sm:text-sm">{appliedJob?.createdAt?.split("T")[0] || "N/A"}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{appliedJob.job?.title || "N/A"}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{appliedJob.job?.company?.name || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={`text-xs sm:text-sm ${
                          appliedJob?.status === "rejected"
                            ? "bg-red-500"
                            : appliedJob?.status === "accepted"
                            ? "bg-green-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {appliedJob?.status || "pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {allAppliedJobs.map((appliedJob) => (
              <div key={appliedJob._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-medium">{appliedJob?.createdAt?.split("T")[0] || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Job Title</p>
                    <p className="text-sm font-medium">{appliedJob.job?.title || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Company</p>
                    <p className="text-sm font-medium">{appliedJob.job?.company?.name || "N/A"}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Status</p>
                    <Badge
                      className={`text-xs ${
                        appliedJob?.status === "rejected"
                          ? "bg-red-500"
                          : appliedJob?.status === "accepted"
                          ? "bg-green-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {appliedJob?.status || "pending"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AppliedJob;