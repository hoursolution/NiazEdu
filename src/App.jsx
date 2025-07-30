import { useState, useEffect } from "react";
import * as React from "react";
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import StudentPortal from "./pages/Student_portal";
import Donor_portal from "./pages/Donor_portal";
import StudentProfile from "./components/StudentPortal/StudentProfile";
import StudentList from "./components/DonorPortal/StudentList";
import AddStudentForm from "./components/StudentPortal/AddStudentForm";
import { ThemeProvider } from "@mui/material/styles";
import createTheme from "@mui/material/styles/createTheme";
import CssBaseline from "@mui/material/CssBaseline";
import { orange, blueGrey, deepPurple, red } from "@mui/material/colors";
import LoginForm from "./components/Authantications/Login";
import ApplicationForm from "./components/StudentPortal/ApplicationForm";
import Dashboard from "./components/DonorPortal/Dashboard";
import ProjectionSheet from "./components/DonorPortal/ProjectionSheet";
import SingleProjectionSheet from "./components/DonorPortal/SingleProjectionSheet";
import Invoice from "./components/DonorPortal/Invoice";
import StudentProjectionSheet from "./components/StudentPortal/StudentProjectionSheet";
import StudentApplicationDetails from "./components/StudentPortal/StudentApplicationDetails";
import BankDetails from "./components/StudentPortal/BankDetails";
import StudentApplicationDetailsForDonor from "./components/DonorPortal/StudentApplicationDetailsForDonor";
import BankDetailsOfStudent from "./components/DonorPortal/BankDetailsOfStudent";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AllApplications from "./components/Admin/Applications/AllApplications";
import AddApplicationForm from "./components/Admin/Applications/AddApplication";
import EditApplicationForm from "./components/Admin/Applications/EditApplication";
import Admin_portal from "./pages/Admin_portal";
import AllVarification from "./components/Admin/varifications/AllVarification";
import CreateVerificationForm from "./components/Admin/varifications/AddVerification";
import EditVerificationForm from "./components/Admin/varifications/EditVarification";
import AllInterviews from "./components/Admin/Interviews/AllInterviews";
import CreateInterviewForm from "./components/Admin/Interviews/AddInterview";
import EditInterviewForm from "./components/Admin/Interviews/EditInterview";
import AllSelectDonorList from "./components/Admin/SelectDonor/AllSelectDonorList";
import EditSelectDonorForm from "./components/Admin/SelectDonor/EditSelectDonor";
import CreateSelectDonorForm from "./components/Admin/SelectDonor/AddSelectDonor";
import AllSelectMentorList from "./components/Admin/SelectMentor/AllSelectMentor";
import CreateSelectMentorForm from "./components/Admin/SelectMentor/AddSelectDonor";
import EditSelectMentorForm from "./components/Admin/SelectMentor/EditSelectMentor";
import AllProgramList from "./components/Admin/Programs/AllPrograms";
import CreateProgramForm from "./components/Admin/Programs/AddProgram";
import EditProgramForm from "./components/Admin/Programs/EditProgram";
import ProjectionDashboard from "./components/Admin/ProjectionSheet/ProjectionDashboard";
import AllProjectionsOfStudent from "./components/Admin/ProjectionSheet/AllProjectionsOfStudent";
import UpdateProjectionForm from "./components/Admin/ProjectionSheet/EditProjectionShe2t";
import AllStudents from "./components/Admin/Students/AllStudents";
import EditStudentForm from "./components/Admin/Students/EditStudent";
import CreateStudentForm from "./components/Admin/Students/AddStudent";
import EditsApplicationForm from "./components/Admin/Applications/EDitsApplication";
import MentorCreation from "./components/Admin/Profiles/MentorCreation";
import DonorCreation from "./components/Admin/Profiles/DonorCreation";
import UpdateStatusOfApplicationForm from "./components/Admin/Applications/UpdateStatusOfApplication";
import StudentRegistrationForm from "./components/StudentPortal/StudentRegistrationForm";
import LandingPage from "./components/Home/LandingPage";
import PasswordResetRequest from "./components/Authantications/PasswordResetRequest";
import "./App.css";
import PasswordReset from "./components/Authantications/ResetPasswordForm";
import getLPTheme from "./components/Home/GetLPTheme";
import { useNavigate } from "react-router-dom";
import BankAccountDetails from "./components/Admin/ProjectionSheet/BankDetailsByAdmin";
import Reports from "./components/Admin/Applications/Reports";
import ProjectionDataGrid from "./components/Admin/ProjectionSheet/ProjectionDataGrid";
import ProjectionDashboard1 from "./components/Admin/ProjectionSheet/ProjectionDashBoard1";
import StudentProjections from "./components/Admin/ProjectionSheet/StudentProjections";
import StudentallProjections from "./components/DonorPortal/StudentallProjections";
import DonorListPage from "./components/Admin/DonorPaymentRecord/DonorListPage";
import SubscriptionPage from "./components/Admin/DonorPaymentRecord/SubscriptionPage";
import AddDonor from "./components/Admin/DonorPaymentRecord/AddDonor";
import DonorsBySourceTable from "./components/Admin/DonorPaymentRecord/DonorsBySourceTable";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token ? true : false;
};

// Protected route component
const ProtectedRoute = ({ element, ...rest }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Redirect to login page if not authenticated
      navigate("/login");
    }
  }, [navigate]);

  // Render the element if authenticated
  return element;
};

const router = createBrowserRouter([
  {
    path: "/",
    // element: <StudentRegistrationForm />,
    element: <LandingPage />, // Render the StudentRegistrationForm component
  },
  {
    path: "/password-reset-request",
    element: <PasswordResetRequest />,
  },
  { path: "/reset-password/:resetToken", element: <PasswordReset /> },
  {
    path: "/student",
    element: <ProtectedRoute element={<StudentPortal />} />,
    children: [
      // { index: true, element: <StudentDashBoard /> },
      {
        index: true,
        path: "myprojection",
        element: <StudentProjectionSheet />,
      },
      { path: "studentProfile", element: <StudentProfile /> },
      { path: "addapplication", element: <ApplicationForm /> },
      {
        index: true,
        // path: "applicationdetail",
        element: <StudentApplicationDetails />,
      },
      // {
      //   index: true,
      //   // path: "applicationdetail",
      //   element: <StudentRegistrationForm />,
      // },
      { path: "bankDetails", element: <BankDetails /> },

      // { path: "addStudent", element: <AddStudentForm /> },
    ],
  },
  {
    path: "/donor",
    element: <ProtectedRoute element={<Donor_portal />} />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "projectionsheet", element: <ProjectionSheet /> },
      { path: "singleprojectionsheet", element: <SingleProjectionSheet /> },
      {
        path: "studentallprojections/:studentId",
        element: <StudentallProjections />,
      },
      { path: "studentDetail", element: <StudentApplicationDetailsForDonor /> },
      { path: "invoice", element: <Invoice /> },
      { path: "bankDetails/:studentId", element: <BankDetailsOfStudent /> },
    ],
  },
  { path: "login", element: <LoginForm /> },
  { path: "registration", element: <StudentRegistrationForm /> },
  {
    path: "/Admin",
    element: <ProtectedRoute element={<Admin_portal />} />,
    children: [
      // admin paths
      { index: true, element: <AdminDashboard /> },
      { path: "source-donors/:source", element: <DonorsBySourceTable /> },
      { path: "allApplications", element: <AllApplications /> },
      { path: "addApplicationss", element: <AddApplicationForm /> },
      { path: "allVarification", element: <AllVarification /> },
      { path: "allInterviews", element: <AllInterviews /> },
      { path: "addVarification", element: <CreateVerificationForm /> },
      { path: "addInterview", element: <CreateInterviewForm /> },
      { path: "Reports", element: <Reports /> },
      { path: "donors", element: <DonorListPage /> },
      { path: "addDonor", element: <AddDonor /> },
      { path: "donors/:id/plan", element: <SubscriptionPage /> },

      {
        path: "editApplications/:applicationId",
        element: <EditApplicationForm />,
      },
      {
        path: "editApplicationsStatus/:applicationId",
        element: <UpdateStatusOfApplicationForm />,
      },
      {
        path: "updateApplication/:applicationId",
        element: <EditsApplicationForm />,
      },
      {
        path: "editVerification/:verificationId",
        element: <EditVerificationForm />,
      },
      {
        path: "editInterview/:InterviewId",
        element: <EditInterviewForm />,
      },
      { path: "selectDonor", element: <AllSelectDonorList /> },
      { path: "addselectDonor", element: <CreateSelectDonorForm /> },
      {
        path: "editSelectDonor/:SelectDonorId",
        element: <EditSelectDonorForm />,
      },
      { path: "selectMentor", element: <AllSelectMentorList /> },
      { path: "addselectMentor", element: <CreateSelectMentorForm /> },
      {
        path: "editSelectMentor/:SelectMentorId",
        element: <EditSelectMentorForm />,
      },
      { path: "programs", element: <AllProgramList /> },
      { path: "addProgram", element: <CreateProgramForm /> },
      {
        path: "editProgram/:ProgramId",
        element: <EditProgramForm />,
      },
      //old
      { path: "ProjectionDashBoard", element: <ProjectionDashboard /> },

      {
        path: "ProjectionsOfStudent/:studentId",
        element: <AllProjectionsOfStudent />,
      },
      // { path: "appProjections/:studentId", element: <AddProjectionForm /> },
      {
        path: "editProjections/:ProjectionsId",
        element: <UpdateProjectionForm />,
      },
      //new
      { path: "ProjectionDashBoard1", element: <ProjectionDashboard1 /> },
      { path: "students/:id/projectionss", element: <StudentProjections /> },
      { path: "students/:id/projections", element: <ProjectionDataGrid /> },
      { path: "Students", element: <AllStudents /> },
      {
        path: "editStudent/:studentId",
        element: <EditStudentForm />,
      },
      { path: "addStudents", element: <CreateStudentForm /> },
      { path: "createMentor", element: <MentorCreation /> },
      { path: "createDonor", element: <DonorCreation /> },
      {
        path: "BankDetailsByAdmin/:studentId",
        element: <BankAccountDetails />,
      },
    ],
  },
]);

function App() {
  const [mode, setMode] = React.useState("dark");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };
  const darkTheme = createTheme({
    palette: {
      mode: "light",

      primary: {
        main: "#304c49",
      },
      error: {
        main: red[900],
      },
    },
    typography: {
      fontFamily: [
        "Open Sans",
        "Montserrat",
        "'Helvetica Neue'",
        "sans-serif",
      ].join(","),
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
