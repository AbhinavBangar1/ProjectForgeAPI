import { useEffect, useState } from "react";
import API, { setAuthToken } from "../Api.js";
import "../styles/Dashboard.css";

function Dashboard({ setToken }) {
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  
  // Project form
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  
  // Issue form
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [issueStatus, setIssueStatus] = useState("open");

  const token = localStorage.getItem("token");
  setAuthToken(token);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const fetchIssues = async (projectId) => {
    try {
      const res = await API.get(`/issues?project_id=${projectId}`);
      setIssues(res.data);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
    }
  };

  const createProject = async () => {
    if (!projectTitle) {
      alert("Project title is required");
      return;
    }
    try {
      await API.post("/projects", { 
        title: projectTitle, 
        description: projectDescription 
      });
      setProjectTitle("");
      setProjectDescription("");
      fetchProjects();
    } catch (err) {
      alert("Failed to create project");
    }
  };

  const updateProject = async () => {
    if (!editingProject) return;
    try {
      await API.put(`/projects/${editingProject.id}`, {
        title: projectTitle,
        description: projectDescription
      });
      setEditingProject(null);
      setProjectTitle("");
      setProjectDescription("");
      fetchProjects();
    } catch (err) {
      alert("Failed to update project");
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
      if (selectedProject?.id === id) {
        setSelectedProject(null);
        setIssues([]);
      }
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  const startEditProject = (project) => {
    setEditingProject(project);
    setProjectTitle(project.title);
    setProjectDescription(project.description || "");
  };

  const cancelEditProject = () => {
    setEditingProject(null);
    setProjectTitle("");
    setProjectDescription("");
  };

  const createIssue = async () => {
    if (!issueTitle || !selectedProject) {
      alert("Issue title and project selection are required");
      return;
    }
    try {
      await API.post("/issues", {
        title: issueTitle,
        description: issueDescription,
        status: issueStatus,
        project_id: selectedProject.id
      });
      setIssueTitle("");
      setIssueDescription("");
      setIssueStatus("open");
      fetchIssues(selectedProject.id);
    } catch (err) {
      alert("Failed to create issue");
    }
  };

  const deleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await API.delete(`/issues/${id}`);
      fetchIssues(selectedProject.id);
    } catch (err) {
      alert("Failed to delete issue");
    }
  };

  const selectProject = (project) => {
    setSelectedProject(project);
    setActiveTab("issues");
    fetchIssues(project.id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setToken(null);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🔨 ProjectForge</h1>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="tabs">
        <button 
          className={activeTab === "projects" ? "tab active" : "tab"}
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </button>
        <button 
          className={activeTab === "issues" ? "tab active" : "tab"}
          onClick={() => setActiveTab("issues")}
          disabled={!selectedProject}
        >
          Issues {selectedProject ? `(${selectedProject.title})` : ""}
        </button>
      </div>

      {activeTab === "projects" && (
        <div className="tab-content">
          <div className="create-section">
            <h2>{editingProject ? "Edit Project" : "Create New Project"}</h2>
            <input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Project title *"
            />
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Project description (optional)"
              rows="3"
            />
            <div className="button-group">
              {editingProject ? (
                <>
                  <button onClick={updateProject}>Update Project</button>
                  <button className="secondary" onClick={cancelEditProject}>Cancel</button>
                </>
              ) : (
                <button onClick={createProject}>Create Project</button>
              )}
            </div>
          </div>

          <div className="project-grid">
            {projects.length === 0 ? (
              <div className="empty-state">
                <p>No projects yet. Create your first project!</p>
              </div>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="project-card">
                  <h3>{p.title}</h3>
                  <p>{p.description || "No description provided."}</p>
                  <div className="card-actions">
                    <button className="btn-small" onClick={() => selectProject(p)}>
                      View Issues
                    </button>
                    <button className="btn-small" onClick={() => startEditProject(p)}>
                      Edit
                    </button>
                    <button className="btn-small delete" onClick={() => deleteProject(p.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "issues" && selectedProject && (
        <div className="tab-content">
          <div className="create-section">
            <h2>Create New Issue for "{selectedProject.title}"</h2>
            <input
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="Issue title *"
            />
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Issue description"
              rows="3"
            />
            <select 
              value={issueStatus} 
              onChange={(e) => setIssueStatus(e.target.value)}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <button onClick={createIssue}>Create Issue</button>
          </div>

          <div className="issue-list">
            {issues.length === 0 ? (
              <div className="empty-state">
                <p>No issues yet. Create your first issue!</p>
              </div>
            ) : (
              issues.map((issue) => (
                <div key={issue.id} className="issue-card">
                  <div className="issue-header">
                    <h3>{issue.title}</h3>
                    <span className={`status-badge ${issue.status}`}>
                      {issue.status.replace("_", " ")}
                    </span>
                  </div>
                  <p>{issue.description || "No description provided."}</p>
                  <div className="card-actions">
                    <button className="btn-small delete" onClick={() => deleteIssue(issue.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
