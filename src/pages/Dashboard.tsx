import React, { useState } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardComponent from "../components/dashboard/dashboard";
import Statistics from "../components/dashboard/statistics"; // Ajoutez cette importation

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="bg-black min-h-screen">
      {/* Sidebar doit être dans la page Dashboard comme demandé */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Passer les props nécessaires au composant dashboard */}
      <DashboardComponent
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <Routes>
        {/* Routes existantes */}
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
