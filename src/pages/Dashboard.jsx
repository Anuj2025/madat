import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { useAuth } from "../providers/AuthProvider";
import CreateServiceModal from "../components/ui/CreateNewService";
import {
  AddServiceToNgo,
  ApplyToService,
  approveApplicant,
  getServies,
  rejectApplicant,
} from "../_auth/FirebaseAuth";

const Dashboard = () => {
  const { AuthState, scheme, setScheme } = useAuth();
  const [userType, setUserType] = useState("user");
  const [createService, setCreateService] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const allServices = await getServies(); // ✅ waits for Promise to resolve
        setServices(allServices);
        console.log(allServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  // ✅ Determine user type
  useEffect(() => {
    if (AuthState?.user) {
      setUserType(AuthState.user?.isNgo ? "ngo" : "user");
    }
  }, [AuthState]);

  // --- USER DATA ---
  const userData = AuthState?.user || {
    FullName: "Guest User",
    Email: "guest@example.com",
    AppliedPrograms: [],
    VisitedPrograms: [],
    isNgo: false,
  };

  // --- NGO DATA ---
  const ngoData = AuthState?.user?.isNgo
    ? {
        OrganizationName:
          AuthState?.user?.OrganizationName || "NGO Organization",
        RegistrationNumber: AuthState?.user?.RegistrationNumber || "",
        Address: AuthState?.user?.Address || {},
        ContactPerson: AuthState?.user?.ContactPerson || {},
        ServicesOffered: AuthState?.user?.ServicesOffered || [],
        BeneficiaryCount: AuthState?.user?.BeneficiaryCount || 0,
        ActiveProjects: AuthState?.user?.ActiveProjects || [],
        Email: AuthState?.user?.Email || "",
        Applications: AuthState?.user?.Applications || [],
      }
    : null;

  // --- CREATE SERVICE ---
  const createServiceFunc = async () => {
    if (!AuthState?.uid || !scheme) return;
    try {
      await AddServiceToNgo(AuthState?.uid, scheme);
      alert("Service added successfully!");
      setCreateService(false);
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  // --- HANDLERS ---
  const handleApprove = async (serviceId, email) => {
    await approveApplicant(serviceId, email);
    alert(`✅ Approved ${email}`);
  };

  const handleReject = async (serviceId, email) => {
    await rejectApplicant(serviceId, email);
    alert(`❌ Rejected ${email}`);
  };

  const handleApplyService = (serviceId) => {
    console.log(`Applying for service ID: ${serviceId}`);
    ApplyToService(
      serviceId,
      {
        applicantName: userData.FullName,
        email: userData.Email,
        currentApplication: userData.CurrentApplication || 0,
      },

      AuthState?.uid
    );
  };

  const handleApproveFunction = async (serviceId, email) => {
    await approveApplicant(serviceId, email);
    alert(`✅ Approved ${email}`);
  };

  const handleRejectFunction = async (serviceId, email) => {
    await rejectApplicant(serviceId, email);
    alert(`❌ Rejected ${email}`);
  };

  useEffect(() => {
    if (!services.length || !userData?.AppliedServices) return;

    let count = 0;

    services.forEach((service) => {
      if (!userData.AppliedServices.includes(service.id)) return;

      const applicant = service.applicants?.find(
        (app) => app.email === userData?.Email
      );

      if (applicant && applicant.status === "Approved") count++;
    });

    setApproved(count);
  }, [services, userData]);

  // --- NGO DASHBOARD VIEW ---
  const NgoDashboard = () => (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="ngo-info">
          <h2>{ngoData?.OrganizationName}</h2>
          <p>Registration: {ngoData?.RegistrationNumber}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Beneficiaries</h3>
          <p className="stat-number">{ngoData?.BeneficiaryCount || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Services</h3>
          <p className="stat-number">{ngoData?.ServicesOffered?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Projects</h3>
          <p className="stat-number">{ngoData?.ActiveProjects?.length || 0}</p>
        </div>
      </div>

      {/* Services Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Our Services</h2>
          <button
            onClick={() => setCreateService(true)}
            className="btn-primary"
          >
            + Create New Service
          </button>
        </div>

        <div className="services-grid">
          {ngoData?.ServicesOffered?.length > 0 ? (
            ngoData?.ServicesOffered?.map((service, index) => (
              <div
                key={service?._id || service?.id || index}
                className="service-card"
              >
                <div className="service-header">
                  <h3>{service?.SchemeName || "Unnamed Service"}</h3>
                  <span
                    className={`status-badge ${(
                      service?.status || "Active"
                    ).toLowerCase()}`}
                  >
                    {service?.status || "Active"}
                  </span>
                </div>
                <p className="service-description">
                  {service?.Description || "No description available."}
                </p>
              </div>
            ))
          ) : (
            <p>No services offered yet.</p>
          )}
        </div>
      </div>

      {/* Applications Section */}
      <div className="dashboard-section">
        <h2>Applications</h2>

        <div className="dashboard-section">
          <h2>Service Applications</h2>

          {services && services.length > 0 ? (
            services.map((service) => (
              <div key={service.id} className="service-section">
                <h3 className="service-title">{service.SchemeName}</h3>

                {service.applicants && service.applicants.length > 0 ? (
                  <div className="applications-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Applicant Name</th>
                          <th>Service</th>
                          <th>Applied Date</th>
                          <th>Contact</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {service.applicants.map((app, index) => (
                          <tr key={app?.id || index}>
                            <td>{app?.applicantName || "Unknown"}</td>
                            <td>{service?.SchemeName || "N/A"}</td>
                            <td>{app?.appliedDate || "N/A"}</td>
                            <td>
                              <div className="contact-info">
                                <small>{app?.email || "N/A"}</small>
                                <small>{app?.phone || "N/A"}</small>
                              </div>
                            </td>
                            <td>
                              <span
                                className={`status-badge ${
                                  app?.status?.toLowerCase() || "pending"
                                }`}
                              >
                                {app?.status || "Pending"}
                              </span>
                            </td>
                            <td>
                              {app?.status === "Pending" && (
                                <div className="action-buttons">
                                  <button
                                    className="btn-approve"
                                    onClick={() =>
                                      handleApprove(service.id, app.email)
                                    }
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="btn-reject"
                                    onClick={() =>
                                      handleReject(service.id, app.email)
                                    }
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="no-applicants">
                    No applicants for this service.
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>No services found.</p>
          )}
        </div>
      </div>
    </div>
  );

  // --- USER DASHBOARD VIEW ---
  const UserDashboard = () => (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          <h2>Welcome, {userData?.FullName || "User"}!</h2>
          <p>{userData?.Email || "No email available"}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Applied Programs</h3>
          <p className="stat-number">
            {userData?.AppliedServices?.length || 0}
          </p>
        </div>
        <div className="stat-card">
          <h3>Approved Programs</h3>
          <p className="stat-number">{approved}</p>
        </div>
        <div className="stat-card">
          <h3>Visited Programs</h3>
          <p className="stat-number">
            {userData?.VisitedPrograms?.length || 0}
          </p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>My Applications</h2>

        {services && services.length > 0 ? (
          <div>
            {services.map((service) => {
              const ids = userData?.AppliedServices || [];
              if (!ids.includes(service.id)) return null;
              const applicant = service.applicants.find(
                (app) => app.email === userData?.Email
              );

              return (
                <div key={service.id} className="application-card">
                  <h3>{service.SchemeName}</h3>
                  <p>Status: {applicant ? applicant.status : "Not Applied"}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No applications found.</p>
        )}

        <div className="mt-5">
          <h1 className="font-bold p-2">Available Services</h1>
          {services.map((service) => {
            return (
              <div key={service._id} className="service-card">
                <h3>{service.SchemeName}</h3>
                <p>{service.Description}</p>
                {!userData?.AppliedServices?.includes(service.id) ? (
                  <button
                    className="btn-primary"
                    onClick={() => handleApplyService(service.id)}
                  >
                    Apply for this Service
                  </button>
                ) : (<button className="applied-badge  bg-[#667a87] p-3 rounded-lg  text-white ">Already Applied</button>)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      {/* Switch Views (NGO only) */}
      {AuthState?.user && userType === "ngo" && (
        <div className="dev-toggle">
          <div className="toggle-buttons">
            <button
              onClick={() => setUserType("ngo")}
              className={userType === "ngo" ? "active" : ""}
            >
              NGO View
            </button>
            <button
              onClick={() => setUserType("user")}
              className={userType === "user" ? "active" : ""}
            >
              User View
            </button>
          </div>
        </div>
      )}

      {userType === "ngo" && AuthState?.user?.isNgo ? (
        <NgoDashboard />
      ) : (
        <UserDashboard />
      )}

      {createService && (
        <CreateServiceModal
          onSave={createServiceFunc}
          onClose={() => setCreateService(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
