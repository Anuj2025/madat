// src/pages/Auth/NgoAuth.Layout.jsx
import React from "react";
import { NgoCreateUser, NgoLoginUser } from "../../_auth/FirebaseAuth";
import { useMutation } from "@tanstack/react-query";

const NgoAuthLayout = ({ type = "login", children }) => {
  const heading =
    type === "login"
      ? "Login to NGO Services Account"
      : "Create NGO Services Account";

  const {
    mutate: NgoCreationMutate,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: ({ email, password, userdata }) =>
      NgoCreateUser({ email, password, userdata }),
    onSuccess: () => {
      console.log("NGO created successfully");
    },
    onError: (error) => {
      console.log("Error creating NGO:", error);
    },
  });

  const {
    mutate: loginNgoMutate,
    isLoading: isLoginLoading,
    isError: isLoginError,
    error: loginError,
    isSuccess: isLoginSuccess,
  } = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await NgoLoginUser(email, password);
      console.log(res);
    },
    onSuccess: () => {
      console.log("NGO logged in successfully");
    },
    onError: (error) => {
      console.log("Error logging in NGO:", error);
    },
  });

  const handleMethod = () => {
    const form = document.querySelector(".auth-form");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const { email, password, org } = data;

    if (type === "login") {
      loginNgoMutate({ email, password });
      console.log("Logging in with data:", data);
    } else {
      const ngostructure = {
        OrganizationName: org,
        RegistrationNumber: "",
        Email: email,
        password: password,
        isNgo: true,
        Address: {
          Street: "",
          City: "",
          ZipCode: "",
        },
        ContactPerson: {
          Name: "",
          Position: "",
          PhoneNumber: "",
          Email: email,
        },
        ServicesOffered: [],
        BeneficiaryCount: 0,
        ActiveProjects: [],
      };

      NgoCreationMutate({ email, password, userdata: ngostructure });
      console.log("Creating NGO account with data:", data);
    }
  };

  return (
    <div className="gov-wrapper" role="main" aria-labelledby="gov-heading">
      <div className="gov-body">
        <aside className="gov-aside" aria-label="About the program">
          <h2 className="aside-title">About the Program</h2>
          <p className="aside-text">
            A government-backed initiative connecting citizens with registered
            NGOs and service providers. Secure, accountable, and transparent
            assistance.
          </p>

          <h3 className="aside-small">Services</h3>
          <ul className="services-list">
            <li>Community Welfare Grants</li>
            <li>Volunteer Matching</li>
            <li>Relief & Rehabilitation</li>
            <li>Training & Capacity Building</li>
          </ul>

          <div className="gov-seal">Gov\ Approved</div>
        </aside>

        <section className="gov-card" aria-labelledby="card-heading">
          <h1 id="card-heading" className="card-heading">
            {heading}
          </h1>

          <div className="card-content">
            {children ? (
              children
            ) : (
              <form
                className="auth-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleMethod();
                }}
              >
                <label className="label">
                  Email
                  <input type="email" name="email" className="input" required />
                </label>

                <label className="label">
                  Password
                  <input
                    type="password"
                    name="password"
                    className="input"
                    required
                  />
                </label>

                {type === "register" && (
                  <label className="label">
                    Organization / NGO Name
                    <input type="text" name="org" className="input" required />
                  </label>
                )}

                {isLoading ? (
                  <div>Creating NGO account...</div>
                ) : isError ? (
                  <div className="error">{error.message}</div>
                ) : isSuccess ? (
                  <div className="success">
                    NGO account created successfully!
                  </div>
                ) : null}

                <button type="submit" className="btn-primary">
                  {type === "login" ? "Sign In" : "Create Account"}
                </button>

                <div className="note">
                  By continuing you agree to terms and a secure verification
                  process.
                </div>
              </form>
            )}
          </div>
        </section>
      </div>

      <footer className="gov-footer">
        <div>© {new Date().getFullYear()} National Civic Aid & Services</div>
        <div>Transparency | Accountability | Impact</div>
      </footer>
    </div>
  );
};
export default NgoAuthLayout;
