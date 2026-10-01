import React, { useEffect } from "react";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  const [skillFilter, setSkillFilter] = React.useState('');
  const [minExpFilter, setMinExpFilter] = React.useState('');
  const [minSkillFilter, setMinSkillFilter] = React.useState('');
  const [orderBy, setOrderBy] = React.useState('grade');

  const fetchAllApplicants = React.useCallback(async () => {
    try {
      const paramsObj = {};
      if (skillFilter) paramsObj.skills = skillFilter;
      if (minExpFilter) paramsObj.minExperience = minExpFilter;
      if (minSkillFilter) paramsObj.minSkill = minSkillFilter;
      if (orderBy) paramsObj.orderBy = orderBy;
      const res = await axios.get(
        `${APPLICATION_API_ENDPOINT}/${params.id}/applicants`,
        { withCredentials: true, params: paramsObj }
      );
      dispatch(setAllApplicants(res.data.job));
    } catch (error) {
      console.log(error);
    }
  }, [skillFilter, minExpFilter, orderBy]);

  useEffect(() => {
    fetchAllApplicants();
  }, [fetchAllApplicants]);
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h1 className="font-bold text-xl my-5">
          Applicants {applicants?.applications?.length}
        </h1>
        <div className="mb-4 flex gap-3 items-center">
          <input className="border rounded px-2 py-1" placeholder="Filter skills (comma separated)" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} />
          <input className="border rounded px-2 py-1 w-40" placeholder="Min experience (years)" type="number" value={minExpFilter} onChange={(e) => setMinExpFilter(e.target.value)} />
          <input className="border rounded px-2 py-1 w-40" placeholder="Min skill %" type="number" min="0" max="100" value={minSkillFilter} onChange={(e) => setMinSkillFilter(e.target.value)} />
          <select className="border rounded px-2 py-1" value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            <option value="grade">Sort: Grade</option>
            <option value="match">Sort: Match Score</option>
            <option value="skill">Sort: Skill Match %</option>
            <option value="experience">Sort: Experience</option>
            <option value="skills">Sort: Skills Matched</option>
            <option value="date">Sort: Date</option>
          </select>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={fetchAllApplicants}>Apply</button>
        </div>
        <ApplicantsTable />
      </div>
    </div>
  );
};

export default Applicants;