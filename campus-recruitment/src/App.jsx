import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterLogin from "./pages/RecruiterLogin";
import RecruiterDashboard from "./pages/RecruiterDashboard"; 
import Vacancies from "./pages/Vacancies";
import MyBookmarks from "./pages/MyBookmarks";
import MyApplications from "./pages/MyApplications"; 
import JobDetails from "./pages/JobDetails";
import Applicants from "./pages/Applicants";
import InchargeLogin from "./pages/Inchargelogin";
import InchargeDashboard from "./pages/InchargeDashboard";
import Helpdesk from "./components/Helpdesk";
import Resources from "./components/Resources";
import Layout from "./components/Layout";
import ChatModal from "./components/ChatModal"; // Import ChatModal component
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-layout">
        <Layout />
        
        {/* Define routes */}
        <Routes>
         
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/login/recruiter" element={<RecruiterLogin />} />
          <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/bookmarks" element={<MyBookmarks />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/applicants/:jobId" element={<Applicants />} />
          <Route path="/login/placementhead" element={<InchargeLogin />} />
          <Route path="/dashboard/incharge" element={<InchargeDashboard />} />
          <Route path="/helpdesk" element={<Helpdesk />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/chat" element={<ChatModal />} /> {/* Add ChatModal route */}
          
          {/* Fallback route */}
          
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
