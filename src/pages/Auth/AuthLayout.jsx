// src/pages/Auth/AuthLayout.jsx
import React, { use } from "react";
import { createUser, loginUser } from "../../_auth/FirebaseAuth";
import { useMutation } from "@tanstack/react-query";

const AuthLayout = ({ type = "login", children }) => {
  const heading =
    type === "login" ? "Login for NGO Services" : "Register for NGO Services";

  const {
    mutate: UserCreationMutate,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: ({ email, password, userdata }) =>
      createUser({ email, password, userdata }),
    onSuccess: () => {
      console.log("User created successfully");
    },
    onError: (error) => {
      console.log("Error creating user:", error);
    },
  });

  const {
    mutate: loginUserMutate,
    isLoading: isLoginLoading,
    isError: isLoginError,
    error: loginError,
    isSuccess: isLoginSuccess,
  } = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await loginUser(email, password);
      console.log(res);
    },
    onSuccess: () => {
      console.log("User logged in successfully");
    },
    onError: (error) => {
      console.log("Error logging in user:", error);
    },
  });

  const handleMethod = () => {
    const form = document.querySelector(".auth-form");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const { email, password, fullname } = data;

    if (type === "login") {
      loginUserMutate({ email, password });
      console.log("Logging in with data:", data);
    } else {
      const userstructure = {
        FullName: fullname,
        Age: 0,
        Email: email,
        isNgo: false,
        password: password,
        Address: {
          Street: "",
          City: "",
          ZipCode: "",
        },
        PhoneNumber: "",
        EmergencyContact: {
          Name: "",
          Relationship: "",
          PhoneNumber: "",
        },
        AppliedPrograms: [],
        WisitedPrograms: [],
      };

      UserCreationMutate({ email, password, userdata: userstructure });
      console.log("Creating account with data:", data);
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
                    Full Name
                    <input type="text" name="fullname" className="input" />
                  </label>
                )}

                {isLoading ? (
                  <div>Creating account...</div>
                ) : isError ? (
                  <div className="error">{error.message}</div>
                ) : isSuccess ? (
                  <div className="success">Account created successfully!</div>
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

export default AuthLayout;
