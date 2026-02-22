"use client";

import { useEffect, useState } from "react";
import { getProjectsByEmployee, createProject } from "@/services/projectService";
import { getEmployeeById } from "@/services/employee";

export default function EmployeeProjects({ employeeid }) {
  const [projects, setProjects] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [newProject, setNewProject] = useState({
    project_name: "",
    description: "",
    client_name: "",
    status: "Ongoing",
    budget: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // ✅ 1. Get Employee Details
        const employee = await getEmployeeById(employeeid, token);
        setRole(employee.role);  // 🔥 get role from backend

        // ✅ 2. Get Projects
        const projectData = await getProjectsByEmployee(employeeid, token);
        setProjects(projectData);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (employeeid) {
      fetchData();
    }
  }, [employeeid]);

  const handleAddProject = async () => {
    try {
      const token = localStorage.getItem("token");

      const created = await createProject(newProject, token);
      setProjects([...projects, created]);
      setShowForm(false);
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>

        {/* ✅ Role Based Button */}
        {role === "Manager" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Project
          </button>
        )}
      </div>

      {/* Add Project Form */}
      {showForm && role === "Manager" && (
        <div className="border p-4 mb-6 rounded shadow">
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.project_name}
            onChange={(e) =>
              setNewProject({ ...newProject, project_name: e.target.value })
            }
            className="border p-2 w-full mb-2"
          />

          <button
            onClick={handleAddProject}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Project
          </button>
        </div>
      )}

      {/* Project List */}
      {projects.length === 0 ? (
        <p>No projects assigned</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="border p-4 mb-3 rounded shadow">
            <h2 className="font-semibold">{project.project_name}</h2>
            <p>Status: {project.status}</p>
          </div>
        ))
      )}
    </div>
  );
}