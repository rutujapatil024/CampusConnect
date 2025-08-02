import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Grid, Button, Divider, Paper, TextField, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "./InchargeDashboard.css";

const InchargeDashboard = () => {
  const [students, setStudents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [incharge, setIncharge] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("inchargeInfo");
    if (stored) {
      setIncharge(JSON.parse(stored));
    } else {
      navigate("/login/incharge");
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, recruitersRes, jobsRes, applicationsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/students"),
        axios.get("http://localhost:5000/api/recruiters"),
        axios.get("http://localhost:5000/api/jobs"),
        axios.get("http://localhost:5000/api/applications"),
      ]);
      setStudents(studentsRes.data.students || []);
      setRecruiters(recruitersRes.data.recruiters || []);
      setJobs(jobsRes.data.jobs || []);
      setApplications(applicationsRes.data.applications || []);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("inchargeInfo");
    navigate("/login/incharge");
  };

  const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const filterData = (data = []) =>
    data.filter((d) =>
      Object.values(d).some((val) =>
        typeof val === "object"
          ? JSON.stringify(val).toLowerCase().includes(search.toLowerCase())
          : val?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );

  const formatApplicationsForExport = () =>
    applications.map((app) => ({
      studentName: app?.student?.name || "N/A",
      studentEmail: app?.student?.email || "N/A",
      jobTitle: app?.job?.title || "N/A",
      companyName: app?.job?.companyName || "N/A",
      status: app?.status || "N/A",
    }));

  return (
    <div className="incharge-dashboard-container">
      <Typography variant="h4" className="welcome-message">
        Welcome Incharge, {incharge?.name || "Placement Incharge"}!
      </Typography>

      <Paper elevation={2} className="incharge-profile">
        <Typography variant="h6" sx={{ mb: 1 }}>My Profile</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Name:</strong> {incharge?.name}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {incharge?.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Phone:</strong> {incharge?.phone}</Typography>
            <Typography variant="body1"><strong>Department:</strong> {incharge?.department}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid item xs={12}>
          <Button variant="outlined" color="error" onClick={logout} className="logout-button">
            Logout
          </Button>
        </Grid>
      </Paper>

      <TextField
        label="Search in all columns"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ margin: "10px auto", display: "block", width: "300px" }}
      />

      <div className="incharge-columns">
        <Column
          title="Registered Students"
          data={filterData(students)}
          fields={["name", "email"]}
          onExport={() => exportToExcel(students, "Registered_Students")}
        />

        <Column
          title="Registered Recruiters"
          data={filterData(recruiters)}
          fields={["companyName", "email"]}
          onExport={() => exportToExcel(recruiters, "Registered_Recruiters")}
        />

        <Column
          title="All Job Postings"
          data={filterData(jobs)}
          fields={["title", "companyName", "location", "salary"]}
          onExport={() => exportToExcel(jobs, "All_Jobs")}
        />

        <Column
          title="All Applications"
          data={filterData(applications)}
          fields={["student.name", "student.email", "job.title", "job.companyName", "status"]}
          onExport={() => exportToExcel(formatApplicationsForExport(), "All_Applications")}
        />
      </div>
    </div>
  );
};

const Column = ({ title, data = [], fields = [], onExport }) => {
  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

  return (
    <div className="incharge-column">
      <h3>{title}</h3>
      <button className="export-button" onClick={onExport}>Export</button>
      <div className="scrollable">
        {data.map((item, idx) => (
          <div className="entry-card" key={`${title}-${idx}`}>
            {fields.map((f, i) => {
              const value = getNestedValue(item, f);
              return (
                <p key={`${f}-${i}`}><strong>{f}:</strong> {value ?? "N/A"}</p>
              );
            })}
            {item.status && (
              <Chip
                label={item.status}
                size="small"
                color={
                  item.status === "applied"
                    ? "default"
                    : item.status === "shortlisted"
                    ? "success"
                    : "error"
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InchargeDashboard;
