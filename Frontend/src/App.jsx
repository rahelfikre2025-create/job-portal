import React from "react";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/components_lite/Home";
import PrivacyPolicy from "./components/components_lite/PrivacyPolicy.jsx";
import TermsofService from "./components/components_lite/TermsofService.jsx";
import CookiePolicy from "./components/components_lite/CookiePolicy.jsx";
import Disclaimer from "./components/components_lite/Disclaimer.jsx";
import Jobs from "./components/components_lite/Jobs.jsx";
import Browse from "./components/components_lite/Browse.jsx";
import Profile from "./components/components_lite/Profile.jsx";
import Description from "./components/components_lite/Description.jsx";
import Companies from "./components/admincomponent/Companies";
import CompanyCreate from "./components/admincomponent/CompanyCreate";
import CompanySetup from "./components/admincomponent/CompanySetup";
import AdminJobs from "./components/admincomponent/AdminJobs.jsx";
import PostJob from "./components/admincomponent/PostJob";
import Applicants from "./components/admincomponent/Applicants";
import Chat from "./components/components_lite/Chat";
import Conversations from "./components/components_lite/Conversations";
import AcceptedApplicants from "./components/components_lite/AcceptedApplicants";
import ProtectedRoute from "./components/admincomponent/ProtectedRoute";
import Creator from "./components/creator/Creator.jsx";
import AdminDashboard from "./components/admincomponent/AdminDashboard"; 
import UserManagementPage from "./components/admincomponent/UserManagementPage";
import ReportGeneratorPage from "./components/admincomponent/ReportGeneratorPage";
import RootLayout from "./components/components_lite/RootLayout";
import ErrorPage from "./components/components_lite/ErrorPage";
import NotFoundPage from "./components/components_lite/NotFoundPage";
import ForgotPassword from "./components/authentication/ForgotPassword";
import ResetPassword from "./components/authentication/ResetPassword";
import ResetWithCode from "./components/authentication/ResetWithCode";
import { Navigate } from "react-router-dom";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "reset-with-code", element: <ResetWithCode /> },
      { path: "register", element: <Register /> },
      { path: "description/:id", element: <Description /> },
      { path: "Profile", element: <Profile /> },
      { path: "PrivacyPolicy", element: <PrivacyPolicy /> },
      { path: "TermsofService", element: <TermsofService /> },
      { path: "CookiePolicy", element: <CookiePolicy /> },
      { path: "Disclaimer", element: <Disclaimer /> },
      { path: "Jobs", element: <Jobs /> },
      { path: "Home", element: <Home /> },
      { path: "Browse", element: <Browse /> },
      { path: "admin/login", element: <Login /> },
      { path: "admin", element: <Navigate to="/super-admin/dashboard" /> },
      { path: "Creator", element: <Creator /> },

      // admin routes
      {
        path: "admin/companies",
        element: (
          <ProtectedRoute>
            <Companies />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/companies/create",
        element: (
          <ProtectedRoute>
            <CompanyCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/companies/:id",
        element: (
          <ProtectedRoute>
            <CompanySetup />
          </ProtectedRoute>
        ),
      },
      // Recruiter company management
      {
        path: "recruiter/companies",
        element: (
          <ProtectedRoute>
            <Companies />
          </ProtectedRoute>
        ),
      },
      {
        path: "recruiter/companies/create",
        element: (
          <ProtectedRoute>
            <CompanyCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "recruiter/companies/:id",
        element: (
          <ProtectedRoute>
            <CompanySetup />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/jobs",
        element: (
          <ProtectedRoute>
            <AdminJobs />
          </ProtectedRoute>
        ),
      },
      // Recruiters manage job postings and applicants under the /recruiter namespace
      {
        path: "recruiter/jobs",
        element: (
          <ProtectedRoute>
            <AdminJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "recruiter/jobs/create",
        element: (
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "recruiter/jobs/:id/edit",
        element: (
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "recruiter/jobs/:id/applicants",
        element: (
          <ProtectedRoute>
            <Applicants />
          </ProtectedRoute>
        ),
      },      {
        path: "recruiter/accepted-applicants",
        element: (
          <ProtectedRoute>
            <AcceptedApplicants />
          </ProtectedRoute>
        ),
      },
      {
        path: "super-admin/dashboard",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "super-admin/users",
        element: (
          <ProtectedRoute>
            <UserManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "super-admin/reports",
        element: (
          <ProtectedRoute>
            <ReportGeneratorPage />
          </ProtectedRoute>
        ),
      },
      { path: "chat/:id", element: <Chat /> },
      { path: "conversations", element: <Conversations /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  );
}

export default App;