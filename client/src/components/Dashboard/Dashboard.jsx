import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../../utils/api";
import ErrorMessage from "../Common/ErrorMessage";
import Loading from "../Common/Loading";

const Dashboard = () => {
  const [stats, setStats] = useState({
    companies: 0,
    resumes: 0,
    emailsSent: 0,
    templates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all data in parallel
      const [companiesRes, resumesRes, templatesRes, historyRes] =
        await Promise.all([
          apiAxios.get("/api/companies", { params: { limit: 1 } }),
          apiAxios.get("/api/resumes"),
          apiAxios.get("/api/templates"),
          apiAxios.get("/api/emails/history", { params: { limit: 1000 } }),
        ]);

      // Extract safe counts
      const companiesCount =
        companiesRes?.data?.data?.pagination?.totalCompanies ??
        companiesRes?.data?.pagination?.totalCompanies ??
        0;

      // const resumesCount =
      //   resumesRes?.data?.data?.length ?? resumesRes?.data?.length ?? 0;

      // const templatesCount =
      //   templatesRes?.data?.data?.length ?? templatesRes?.data?.length ?? 0;

      // const historyItems =
      //   historyRes?.data?.data?.history ?? historyRes?.data?.history ?? [];
        
      const resumesCount =
        resumesRes?.data?.results ?? 0;
      const templatesCount =
        templatesRes?.data?.results ??  0;
      const historyItems =
        historyRes?.data?.data?.history ?? historyRes?.data?.history ?? [];

      const sentEmails = historyItems.filter((h) => h.status === "sent").length;

      setStats({
        companies: companiesCount,
        resumes: resumesCount,
        templates: templatesCount,
        emailsSent: sentEmails,
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Add Companies",
      description: "Add new companies to your database",
      icon: "fas fa-building",
      path: "/companies",
      color: "#6366f1",
    },
    {
      title: "Upload Resume",
      description: "Upload your latest resume",
      icon: "fas fa-file-upload",
      path: "/resumes",
      color: "#10b981",
    },
    {
      title: "Send Emails",
      description: "Send resumes to multiple companies",
      icon: "fas fa-paper-plane",
      path: "/send-emails",
      color: "#f59e0b",
    },
    {
      title: "Create Template",
      description: "Create email templates",
      icon: "fas fa-pencil-alt",
      path: "/templates",
      color: "#ef4444",
    },
  ];

  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="main-content">
      <h1>Dashboard</h1>
      <p className="text-muted mb-3">
        Welcome to your Mailbox Mailer dashboard
      </p>

      <div className="dashboard">
        <div className="stat-card">
          <h3>{stats.companies}</h3>
          <p>Total Companies</p>
          <i
            className="fas fa-building"
            style={{
              fontSize: "2rem",
              color: "#6366f1",
              marginTop: "1rem",
            }}
          ></i>
        </div>

        <div className="stat-card">
          <h3>{stats.resumes}</h3>
          <p>Resumes</p>
          <i
            className="fas fa-file-alt"
            style={{
              fontSize: "2rem",
              color: "#10b981",
              marginTop: "1rem",
            }}
          ></i>
        </div>

        <div className="stat-card">
          <h3>{stats.emailsSent}</h3>
          <p>Emails Sent</p>
          <i
            className="fas fa-paper-plane"
            style={{
              fontSize: "2rem",
              color: "#f59e0b",
              marginTop: "1rem",
            }}
          ></i>
        </div>

        <div className="stat-card">
          <h3>{stats.templates}</h3>
          <p>Email Templates</p>
          <i
            className="fas fa-pencil-alt"
            style={{
              fontSize: "2rem",
              color: "#ef4444",
              marginTop: "1rem",
            }}
          ></i>
        </div>
      </div>

      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="stat-card"
            style={{
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onClick={() => navigate(action.path)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <i
                className={action.icon}
                style={{ fontSize: "2rem", color: action.color }}
              ></i>
              <div>
                <h4 style={{ margin: 0, color: "#333" }}>{action.title}</h4>
                <p style={{ margin: 0, color: "#666" }}>{action.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-activity mt-3">
        <div className="stat-card">
          <h4>Recent Activity</h4>
          <p>Your email sending history and statistics will appear here.</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/history")}
          >
            View Full History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
