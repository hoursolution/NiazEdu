import React, { useEffect, useState } from "react";
import {
  Tab,
  Tabs,
  TextField,
  Button,
  MenuItem,
  Paper,
  Grid,
  InputLabel,
  Typography,
  Container,
  Box,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
const AddApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const [activeTab, setActiveTab] = useState(0);
  const [applicationId, setApplicationId] = useState(0);
  const [alert, setAlert] = useState(null);

  const handleCloseAlert = () => {
    setAlert(null);
  };

  // Define state for degree form fields' values
  const [degreeForm, setDegreeForm] = useState([
    {
      application: "",
      degree_name: "",
      status: "",
      institute_name: "",
      grade: "",
    },
  ]);

  const addDegree = () => {
    setDegreeForm([
      ...degreeForm,
      {
        application: "",
        degree_name: "",
        status: "",
        institute_name: "",
        grade: "",
      },
    ]);
  };

  const removeDegree = (index) => {
    const updatedDegreeForm = [...degreeForm];
    updatedDegreeForm.splice(index, 1);
    setDegreeForm(updatedDegreeForm);
  };
  const validateDegreeForm = () => {
    for (const [index, degree] of degreeForm.entries()) {
      if (
        degree.degree_name.trim() === "" ||
        degree.status.trim() === "" ||
        degree.institute_name.trim() === "" ||
        degree.grade.trim() === ""
      ) {
        return `Please fill all fields for Previous Education ${index + 1}`; // Return error message if any field is empty
      }
    }
    return ""; // Return empty string if all fields are filled
  };
  const [students, setStudents] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

  useEffect(() => {
    // Fetch students
    fetch(`${BASE_URL}/students/`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  const handleDegreeChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDegreeForm = [...degreeForm];
    updatedDegreeForm[index] = { ...updatedDegreeForm[index], [name]: value };

    // Clear errors for all degree fields when any field is changed
    const updatedFormErrors = { ...formErrors };
    Object.keys(updatedFormErrors).forEach((key) => {
      if (key.startsWith(`degree_${index}_`)) {
        updatedFormErrors[key] = "";
      }
    });

    setFormErrors(updatedFormErrors);
    setDegreeForm(updatedDegreeForm);
  };

  const paperStyle = {
    padding: "20px",
    marginBottom: "20px",
  };

  const formFieldStyle = {
    marginBottom: "8px",
    Width: "200px",
  };
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleBack = () => {
    setActiveTab((prevTab) => Math.max(prevTab - 1, 0));
  };
  const getFieldsForTab = (tabIndex) => {
    switch (tabIndex) {
      case 0:
        return [
          "student",
          "name",
          "father_name",
          "last_name",
          "gender",
          "date_of_birth",
          "age",
        ];
      case 1:
        return [
          "province",
          "city",
          "city_of_origin",
          "mobile_no",
          "cnic_or_b_form",
          "email",
          // "village",
          "address",
        ];
      case 2:
        return [
          "total_members_of_household",
          "members_earning",
          "income_per_month",
          "expense_per_month",
          "description_of_household",
        ];

      case 3:
        return [
          "current_level_of_education",
          "program_interested_in",
          "institution_interested_in",
          "no_of_years",
          "no_of_semesters",
          "program_addmision_date",
          "classes_commencement_date",
        ];

      case 4:
        return [
          "admission_fee_of_the_program",
          "total_fee_of_the_program",
          // "living_expenses",
          // "food_and_necessities_expenses",
          // "transport_amount",
          // "other_amount",
        ];
      case 7:
        return [
          "degree_documents",
          "transcript_documents",
          "income_statement_documents",
          "profile_picture",
        ];
      case 6:
        return ["personal_statement"];

      // case 5:
      //   return ["degree_name", "status", "institute_name", "grade"];

      default:
        return [];
    }
  };

  const handleContinue = () => {
    // Determine the fields for the current tab
    const fieldsForTab = getFieldsForTab(activeTab);

    // Check for errors in the fields for the current tab
    const tabErrors = {};
    fieldsForTab.forEach((fieldName) => {
      const error = formErrors[fieldName];
      if (error) {
        tabErrors[fieldName] = error;
      }
    });
    // Check for required fields that are empty, excluding degree fields
    fieldsForTab
      .filter((fieldName) => !fieldName.startsWith("degree_"))
      .forEach((fieldName) => {
        if (!formData[fieldName]) {
          tabErrors[fieldName] = "This field is required";
        }
      });
    console.log(tabErrors);
    // Custom validation for degree fields in tab 5
    if (activeTab === 5) {
      degreeForm.forEach((degree, index) => {
        if (!degree.degree_name) {
          tabErrors[`degree_${index}_name`] = "Degree name is required";
        }
        if (!degree.status) {
          tabErrors[`degree_${index}_status`] = "Status is required";
        }
        if (!degree.institute_name) {
          tabErrors[`degree_${index}_institute_name`] =
            "Institute name is required";
        }
        if (!degree.grade) {
          tabErrors[`degree_${index}_grade`] = "Grade is required";
        }
      });
    }

    if (Object.keys(tabErrors).length > 0) {
      setFormErrors(tabErrors);
    } else {
      setActiveTab((prevTab) => Math.min(prevTab + 1, 7));
    }
  };
  const validateField = (name, value) => {
    switch (name) {
      case "date_of_birth":
        const today = new Date();
        const selectedDate = new Date(value);
        const ageInMilliseconds = today - selectedDate;
        const ageInYears = Math.floor(
          ageInMilliseconds / (1000 * 60 * 60 * 24 * 365)
        );
        if (ageInYears < 5) {
          return "Date of birth cannot be in the future & at least 5 years";
        }
        break;
      case "email":
        // Email validation logic
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Invalid email address";
        }
        break;
      case "mobile_no":
        // Mobile number validation logic
        const mobileRegex = /^[0-9]{11}$/;
        if (!mobileRegex.test(value)) {
          return "Invalid mobile number";
        }
        break;
      case "cnic_or_b_form":
        // CNIC/B Form validation logic
        const cnicRegex = /^[0-9]{13}$/;
        if (!cnicRegex.test(value)) {
          return "Invalid CNIC/B Form number";
        }
        break;
      case "name":
      case "father_name":
      case "last_name":
      case "village":
      case "address":
      case "current_level_of_education":
      case "institution_interested_in":
      case "no_of_years":
      case "no_of_semesters":
      case "program_addmision_date":
      case "classes_commencement_date":
      case "program_interested_in":
      case "province":
      case "personal_statement":
      case "city":
      case "city_of_origin":
      case "description_of_household":
        // Required field validation
        if (!value.trim()) {
          return "This field is required";
        }
        break;
      case "admission_fee_of_the_program":
      case "total_fee_of_the_program":
      // case "living_expenses":
      // case "food_and_necessities_expenses":
      // case "transport_amount":
      // case "other_amount":
      case "expected_sponsorship_amount":
      case "total_members_of_household":
      case "members_earning":
      case "income_per_month":
      case "expense_per_month":
        if (!value.trim() || isNaN(value)) {
          return "Please enter a valid number";
        }
        break;
      case "degree_documents":
      case "transcript_documents":
      case "income_statement_documents":
      case "profile_picture":
        // File field validation
        if (!value || value === null) {
          return "Please upload a file";
        }
        break;
      // Add validation logic for other fields as needed
      default:
        // For other fields, no specific validation is needed
        break;
    }
    return ""; // Empty string indicates no error
  };
  const initialFormErrors = {
    student: "",
    name: "",
    father_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    age: "",
    province: "",
    city: "",
    city_of_origin: "",
    mobile_no: "",
    cnic_or_b_form: "",
    email: "",
    village: "",
    address: "",
    current_level_of_education: "",
    institution_interested_in: "",
    no_of_years: "",
    no_of_semesters: "",
    program_addmision_date: "",
    classes_commencement_date: "",
    admission_fee_of_the_program: "",
    total_fee_of_the_program: "",
    living_expenses: "",
    food_and_necessities_expenses: "",
    transport_amount: "",
    other_amount: "",
    expected_sponsorship_amount: "",
    total_members_of_household: "",
    members_earning: "",
    income_per_month: "",
    expense_per_month: "",
    description_of_household: "",
    personal_statement: "",
    total_amount: " ",
    total_education_expenses: "",
    program_interested_in: "",
    degree_documents: "", // Handle file upload separately if needed
    transcript_documents: "", // Handle file upload separately if needed
    income_statement_documents: "", // Handle file upload separately if needed
    profile_picture: "", // Handle file upload separately if needed

    // Add other form fields here with initial error messages
  };
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [formData, setFormData] = useState({
    student: "",
    name: "",
    father_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    age: "1",
    province: "",
    city: "",
    city_of_origin: "",
    mobile_no: "",
    cnic_or_b_form: "",
    email: "",
    village: "",
    address: "",
    current_level_of_education: "",
    institution_interested_in: "",
    no_of_years: "",
    no_of_semesters: "",
    program_addmision_date: "",
    classes_commencement_date: "",
    admission_fee_of_the_program: "",
    total_fee_of_the_program: "",
    living_expenses: "",
    food_and_necessities_expenses: "",
    transport_amount: "",
    other_amount: "",
    total_members_of_household: "",
    members_earning: "",
    income_per_month: "",
    expense_per_month: "",
    description_of_household: "",
    personal_statement: "",
    total_amount: "",
    total_education_expenses: "",
    program_interested_in: "",
    degree_documents: [], // Handle file upload separately if needed
    transcript_documents: [], // Handle file upload separately if needed
    income_statement_documents: [], // Handle file upload separately if needed
    profile_picture: "", // Handle file upload separately if needed
  });
  // Update total amount whenever relevant form fields change
  useEffect(() => {
    const calculateTotalAmount = () => {
      const totalAmount = (
        parseFloat(formData.admission_fee_of_the_program || 0) +
        parseFloat(formData.total_fee_of_the_program || 0) +
        parseFloat(formData.living_expenses || 0) +
        parseFloat(formData.food_and_necessities_expenses || 0) +
        parseFloat(formData.transport_amount || 0) +
        parseFloat(formData.other_amount || 0)
      ).toFixed(2); // Round to 2 decimal places
      const totalEducationExpenses = (
        parseFloat(formData.admission_fee_of_the_program || 0) +
        parseFloat(formData.total_fee_of_the_program || 0)
      ).toFixed(2);

      setFormData((prevData) => ({
        ...prevData,
        total_amount: totalAmount,
        total_education_expenses: totalEducationExpenses,
      }));
    };

    calculateTotalAmount();
  }, [formData.admission_fee_of_the_program, formData.total_fee_of_the_program, formData.living_expenses, formData.food_and_necessities_expenses, formData.transport_amount, formData.other_amount][formData]); // Run this effect whenever formData changes
  const handleFileChange = (e, field) => {
    const files = e.target.files;
    // Append new files to the existing array
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], ...Array.from(files)],
    }));
    // Clear the file input value to allow uploading new files easily
    // e.target.value = "";
  };
  const handleRemoveFile = (field, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }));
  };
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Handle file inputs separately
    if (type === "file") {
      // File field validation
      const file = files[0];
      const error = validateField(name, file);
      if (error) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error,
        }));
      } else {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "", // Reset error if file is valid
        }));
        setFormData({
          ...formData,
          [name]: file,
        });
      }
    } else if (name === "student") {
      // Find the selected student from the students array
      const selectedStudent = students.find((student) => student.id === value);
      if (selectedStudent) {
        // Update the form data fields with the student information
        setFormData({
          ...formData,
          student: selectedStudent.id,
          name: selectedStudent.student_name,
          father_name: selectedStudent.father_name,
          last_name: selectedStudent.last_name,
          gender: selectedStudent.gender,
          email: selectedStudent.email,
        });
      }
    } else {
      // Field validation
      let error = validateField(name, value);
      // Update form errors
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));

      // Update form data
      setFormData({
        ...formData,
        [name]: value,
      });

      // If the field is 'date_of_birth', calculate age
      if (name === "date_of_birth" && !error) {
        // Ensure value is not empty
        if (value) {
          // Parse the date and check if it's a valid date
          const selectedDate = new Date(value);
          if (!isNaN(selectedDate.getTime())) {
            // Check if it's a valid date
            const today = new Date();
            const ageInMilliseconds = today - selectedDate;
            const ageInYears = Math.floor(
              ageInMilliseconds / (1000 * 60 * 60 * 24 * 365)
            );

            // Update age field
            setFormData((prevData) => ({
              ...prevData,
              age: ageInYears.toString(),
            }));
          } else {
            // Invalid date format, set error
            error = "Invalid date format";
          }
        } else {
          // Date of birth is empty, set error
          error = "Date of birth is required";
        }

        // Update form errors for date of birth
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          date_of_birth: error,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when form is submitted
    // Get fields for case 7
    const case7Fields = getFieldsForTab(7);

    // Check for errors in case 7 fields
    const case7Errors = {};
    case7Fields.forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        case7Errors[fieldName] = error;
      }
    });

    // If there are errors in case 7 fields, set formErrors and prevent form submission
    if (Object.keys(case7Errors).length > 0) {
      setFormErrors(case7Errors);
      return;
    }
    const degreeFormError = validateDegreeForm();
    if (degreeFormError !== "") {
      // If degree form is not valid, display the error message in an alert
      setLoading(false);
      setAlert({
        severity: "error",
        message: degreeFormError,
      });
      return;
    }
    const formDataObject = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (
        key !== "degree_documents" &&
        key !== "transcript_documents" &&
        key !== "income_statement_documents" &&
        key !== "profile_picture"
      ) {
        formDataObject.append(key, value);
      }
    });

    // Loop through each file in the array and append them individually
    formData.degree_documents.forEach((file) => {
      formDataObject.append("degree_documents", file);
    });

    formData.transcript_documents.forEach((file) => {
      formDataObject.append("transcript_documents", file);
    });

    formData.income_statement_documents.forEach((file) => {
      formDataObject.append("income_statement_documents", file);
    });
    formDataObject.append("profile_picture", formData.profile_picture);

    console.log(formDataObject);
    // Check if there are any form errors
    const hasErrors = Object.values(formErrors).some(
      (error) => error.trim() !== ""
    );
    if (hasErrors) {
      // Set alert message for errors
      setAlert({
        severity: "error",
        message: "Please correct the errors in the form.",
      });
    } else {
      // Proceed with form submission...
      try {
        const response = await fetch(
          `${BASE_URL}/api/create-application-by-admin/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: formDataObject, // Use formDataObject instead of formData
          }
        );

        console.log(response.status); // Log the HTTP status for debugging

        if (response.ok) {
          const data = await response.json();
          console.log("Success:", data);
          setApplicationId(data.application_id);
          setLoading(false); // Set loading state to true when form is submitted
          // navigate("/Admin/allApplications");
          // Update the application field of each degree form entry with the current applicationId
          //Update the application field of each degree form entry with the current applicationId
          const updatedDegreeForm = degreeForm.map((degree) => ({
            ...degree,
            application: data.application_id,
          }));
          setDegreeForm(updatedDegreeForm);

          // Append degreeForm key-value pairs to formDataObject
          updatedDegreeForm.forEach((degree, index) => {
            formDataObject.append(
              `degreeForm[${index}][application]`,
              applicationId
            );
            formDataObject.append(
              `degreeForm[${index}][degree_name]`,
              degree.degree_name
            );
            formDataObject.append(
              `degreeForm[${index}][status]`,
              degree.status
            );
            formDataObject.append(
              `degreeForm[${index}][institute_name]`,
              degree.institute_name
            );
            formDataObject.append(`degreeForm[${index}][grade]`, degree.grade);
          });
          // Now, create degree instances
          const degreeResponse = await fetch(`${BASE_URL}/api/create-degree/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              application_id: data.application_id,
              degrees: updatedDegreeForm,
            }),
          });
          console.log(data.application_id);
          if (degreeResponse.ok) {
            const degreeData = await degreeResponse.json();
            console.log("Degree creation success:", updatedDegreeForm);
            setAlert({
              severity: "success",
              message: "Application Created successfully!",
            });
            setTimeout(() => {
              navigate(-1);
            }, 2000);
            setLoading(false); // Set loading state to true when form is submitted
            // navigate("myprojection");
          } else {
            const degreeErrorData = await degreeResponse.json();
            console.error("Degree creation error:", degreeErrorData);
          }
        } else {
          const errorData = await response.json();
          setLoading(false); // Set loading state to true when form is submitted
          console.error("Error:", errorData);
          console.error("Error:", errorData);
          let errorMessage = "An error occurred while processing your request.";

          // Check if there are multiple errors in the response
          if (errorData && typeof errorData === "object") {
            // Extract error messages from the errorData object
            const errorMessages = Object.entries(errorData).map(
              ([key, value]) => {
                // If the value is an array, join its elements into a single string
                if (Array.isArray(value)) {
                  return value.map((error) => `${key}: ${error}`).join("<br>");
                }
                // Otherwise, use the value as is
                return `${key}: ${value}`;
              }
            );

            // Join the array of error messages into a single string
            errorMessage = errorMessages.join("<br>");
          }

          // Set the alert with the error message
          setAlert({
            severity: "error",
            message: <div dangerouslySetInnerHTML={{ __html: errorMessage }} />,
          });

          if (error.response && error.response.data) {
            // Username already exists error
            const errorMessage = error.response.data;
            setAlert({ severity: "error", message: errorMessage });
          } else {
            // Other errors
            setAlert({
              severity: "error",
              message: "Failed to Created Application",
            });
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setLoading(false); // Set loading state to true when form is submitted
        setAlert({
          severity: "error",
          message:
            error.response.data.error ||
            "An error occurred while processing your request.",
        });
      }
    }
  };
  const handleViewFileDetails = (file) => {
    // Create a URL for the selected file
    const fileURL = URL.createObjectURL(file);

    // Open a new window/tab to display the file
    window.open(fileURL);
  };
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: 2,
        }}
      >
        <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            className=" text-sky-950"
            align="center"
            gutterBottom
          >
            Add Application
          </Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              marginTop: 1,
            }}
          >
            <Tab
              label="Personal Information"
              sx={{
                fontWeight: 700,
                backgroundColor: activeTab === 0 ? "#DCD7D7" : "#12b4bf",
                borderTopLeftRadius: "5px",
                color: "white",
              }}
            />
            <Tab
              label="Contact Information"
              sx={{
                fontWeight: 700,
                backgroundColor: activeTab === 1 ? "#DCD7D7" : "#12b4bf",
                color: "white",
              }}
            />
            <Tab
              label="Household Information"
              sx={{
                fontWeight: 700,
                backgroundColor: activeTab === 2 ? "#DCD7D7" : "#12b4bf",
                color: "white",
              }}
            />
            <Tab
              label="Education Program"
              sx={{
                fontWeight: 700,
                backgroundColor: activeTab === 3 ? "#DCD7D7" : "#12b4bf",
                color: "white",
              }}
            />
            <Tab
              label="Cost Of Program"
              sx={{
                fontWeight: 700,
                backgroundColor: activeTab === 4 ? "#DCD7D7" : "#12b4bf",
                color: "white",
              }}
            />

            <Tab
              label="Education Details"
              sx={{
                fontWeight: 700,
                backgroundColor: activeTab === 5 ? "#DCD7D7" : "#12b4bf",
                color: "white",
              }}
            />
            <Tab
              label="Personal Statement"
              sx={{
                fontWeight: 700,
                backgroundColor: activeTab === 6 ? "#DCD7D7" : "#12b4bf",
                color: "white",
              }}
            />
            <Tab
              label="Documents"
              sx={{
                fontWeight: 700,
                backgroundColor: activeTab === 7 ? "#DCD7D7" : "#12b4bf",
                borderTopRightRadius: "5px",

                color: "white",
              }}
            />
          </Tabs>
          <Box sx={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}>
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="px-8 h-96 "
            >
              {activeTab === 0 && (
                <Paper style={paperStyle}>
                  {/* Personal Information Fields */}
                  {/* ... */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Select Student"
                        variant="outlined"
                        name="student"
                        value={formData.student}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.student} // Check if there's an error for the 'name' field
                        helperText={formErrors.student}
                      >
                        {students.map((student) => (
                          <MenuItem key={student.id} value={student.id}>
                            {student.student_name} {student.last_name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First name"
                        variant="outlined"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        sx={{
                          // fontSize: "3px",
                          padding: "0px 0px",
                        }}
                        fullWidth
                        required
                        InputProps={{
                          readOnly: true,
                        }}
                        error={!!formErrors.name} // Check if there's an error for the 'name' field
                        helperText={formErrors.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name"
                        variant="outlined"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        style={formFieldStyle}
                        fullWidth
                        required
                        InputProps={{
                          readOnly: true,
                        }}
                        error={!!formErrors.last_name} // Check if there's an error for the 'name' field
                        helperText={formErrors.last_name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Father's Name"
                        variant="outlined"
                        name="father_name"
                        value={formData.father_name}
                        onChange={handleChange}
                        fullWidth
                        // sx={{ padding: "8px" }}
                        required
                        // InputProps={{
                        //   readOnly: true,
                        // }}
                        error={!!formErrors.father_name} // Check if there's an error for the 'name' field
                        helperText={formErrors.father_name}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel shrink>Gender</InputLabel>
                      <TextField
                        // label="Gender"
                        variant="outlined"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        style={formFieldStyle}
                        select
                        required
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        error={!!formErrors.gender} // Check if there's an error for the 'name' field
                        helperText={formErrors.gender}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel shrink>
                        Date of Birth <span>*</span>
                      </InputLabel>
                      <TextField
                        variant="outlined"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        style={formFieldStyle}
                        fullWidth
                        required
                        error={!!formErrors.date_of_birth}
                        helperText={formErrors.date_of_birth}
                        // helperText="Age must be in Past"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {/* <InputLabel shrink>Age</InputLabel> */}
                      <TextField
                        label="age"
                        disabled
                        variant="outlined"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        style={formFieldStyle}
                        // defaultValue="0"
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                      />
                    </Grid>

                    {/* Repeat similar Grid items for other fields */}
                  </Grid>
                </Paper>
              )}

              {activeTab === 1 && (
                <Paper style={paperStyle}>
                  {/* Contact Information Fields */}
                  {/* ... */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Country"
                        variant="outlined"
                        name="country"
                        defaultValue="Pakistan"
                        // value={formData.country}
                        onChange={handleChange}
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        // error={!!formErrors.country} // Check if there's an error for the 'name' field
                        // helperText={formErrors.country}
                        // required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Province"
                        variant="outlined"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        select
                        fullWidth
                        required
                        error={!!formErrors.province} // Check if there's an error for the 'name' field
                        helperText={formErrors.province}
                      >
                        <MenuItem value="Punjab">Punjab</MenuItem>
                        <MenuItem value="Sindh">Sindh</MenuItem>
                        <MenuItem value="Khyber Pakhtunkhwa">
                          Khyber Pakhtunkhwa
                        </MenuItem>
                        <MenuItem value="Balochistan">Balochistan</MenuItem>
                        <MenuItem value="Gilgit-Baltistan">
                          Gilgit-Baltistan
                        </MenuItem>
                        <MenuItem value="Islamabad Capital Territory">
                          Islamabad Capital Territory
                        </MenuItem>
                        <MenuItem value="Kashmir">Kashmir</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="City Of Birth"
                        variant="outlined"
                        name="city_of_origin"
                        value={formData.city_of_origin}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.city_of_origin} // Check if there's an error for the 'name' field
                        helperText={formErrors.city_of_origin}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Village"
                        variant="outlined"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!formErrors.village} // Check if there's an error for the 'name' field
                        helperText={formErrors.village}
                        style={{
                          display:
                            formData.province === "Kashmir" ||
                            formData.province === "Islamabad Capital Territory"
                              ? "none"
                              : "block",
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Current City"
                        variant="outlined"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.city} // Check if there's an error for the 'name' field
                        helperText={formErrors.city}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Mobile No"
                        variant="outlined"
                        name="mobile_no"
                        type="number"
                        value={formData.mobile_no}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.mobile_no} // Check if there's an error for the 'name' field
                        helperText={formErrors.mobile_no}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="CNIC or B Form"
                        variant="outlined"
                        type="number"
                        name="cnic_or_b_form"
                        value={formData.cnic_or_b_form}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.cnic_or_b_form} // Check if there's an error for the 'name' field
                        helperText={formErrors.cnic_or_b_form}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        variant="outlined"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        InputProps={{
                          readOnly: true,
                        }}
                        error={!!formErrors.email} // Check if there's an error for the 'name' field
                        helperText={formErrors.email}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Address"
                        variant="outlined"
                        name="address"
                        multiline
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.address} // Check if there's an error for the 'name' field
                        helperText={formErrors.address}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {activeTab === 2 && (
                <Paper style={paperStyle}>
                  {/* Household Information Fields */}
                  {/* ... */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Total Members of Household"
                        variant="outlined"
                        name="total_members_of_household"
                        type="number"
                        value={formData.total_members_of_household}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.total_members_of_household} // Check if there's an error for the 'name' field
                        helperText={formErrors.total_members_of_household}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Total Earning Members in Household"
                        variant="outlined"
                        name="members_earning"
                        type="number"
                        value={formData.members_earning}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.members_earning} // Check if there's an error for the 'name' field
                        helperText={formErrors.members_earning}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Income Per Month"
                        variant="outlined"
                        name="income_per_month"
                        type="number"
                        value={formData.income_per_month}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.income_per_month} // Check if there's an error for the 'name' field
                        helperText={formErrors.income_per_month}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Expense Per Month"
                        variant="outlined"
                        name="expense_per_month"
                        type="number"
                        value={formData.expense_per_month}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.expense_per_month} // Check if there's an error for the 'name' field
                        helperText={formErrors.expense_per_month}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Provide info of Household"
                        variant="outlined"
                        name="description_of_household"
                        multiline
                        rows={3}
                        value={formData.description_of_household}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.description_of_household} // Check if there's an error for the 'name' field
                        helperText={formErrors.description_of_household}
                        placeholder="Tell something about your household or define your status in your family"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {activeTab === 3 && (
                <Paper style={paperStyle}>
                  {/* apply for Fields */}
                  {/* ... */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <InputLabel shrink>
                        Degree/Grade Intrested In <span>*</span>
                      </InputLabel>
                      <TextField
                        // label="Current Level of Education"
                        variant="outlined"
                        name="current_level_of_education"
                        value={formData.current_level_of_education}
                        onChange={handleChange}
                        select
                        fullWidth
                        required
                        error={!!formErrors.current_level_of_education} // Check if there's an error for the 'name' field
                        helperText={formErrors.current_level_of_education}
                      >
                        <MenuItem value="Primary">Primary ( 1 - 5 )</MenuItem>
                        <MenuItem value="Middle">Middle ( 6 - 8 )</MenuItem>
                        <MenuItem value="(SSC)">(SSC) / Matric</MenuItem>
                        <MenuItem value="O Levels">O Levels</MenuItem>
                        <MenuItem value="(HSSC)">
                          (HSSC) / Intermediate
                        </MenuItem>

                        <MenuItem value="A Levels">A Levels</MenuItem>
                        <MenuItem value="Diploma / Certificate">
                          Diploma / Certificate
                        </MenuItem>
                        <MenuItem value="Bachelors Degree">
                          Bachelors Degree
                        </MenuItem>
                        <MenuItem value="Masters">Masters</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <InputLabel shrink>
                        Program/Grade Interested In <span>*</span>
                      </InputLabel>
                      <TextField
                        // label="Select Program"
                        variant="outlined"
                        name="program_interested_in"
                        value={formData.program_interested_in}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.program_interested_in} // Check if there's an error for the 'name' field
                        helperText={formErrors.program_interested_in}
                      ></TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <InputLabel shrink>
                        Institution Interested In <span>*</span>
                      </InputLabel>
                      <TextField
                        // label="Institution Interested In"
                        variant="outlined"
                        name="institution_interested_in"
                        value={formData.institution_interested_in}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.institution_interested_in} // Check if there's an error for the 'name' field
                        helperText={formErrors.institution_interested_in}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <InputLabel shrink>
                        No Of Years<span>*</span>
                      </InputLabel>
                      <TextField
                        // label="Current Level of Education"
                        variant="outlined"
                        name="no_of_years"
                        value={formData.no_of_years}
                        onChange={handleChange}
                        select
                        fullWidth
                        required
                        error={!!formErrors.no_of_years} // Check if there's an error for the 'name' field
                        helperText={formErrors.no_of_years}
                      >
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="4">4</MenuItem>
                        <MenuItem value="5">5</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <InputLabel shrink>
                        No Of Semester/Months<span>*</span>
                      </InputLabel>
                      <TextField
                        // label="Current Level of Education"
                        variant="outlined"
                        name="no_of_semesters"
                        value={formData.no_of_semesters}
                        onChange={handleChange}
                        select
                        fullWidth
                        required
                        error={!!formErrors.no_of_semesters} // Check if there's an error for the 'name' field
                        helperText={formErrors.no_of_semesters}
                      >
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="4">4</MenuItem>
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="6">6</MenuItem>
                        <MenuItem value="7">7</MenuItem>
                        <MenuItem value="8">8</MenuItem>
                        <MenuItem value="9">9</MenuItem>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="11">11</MenuItem>
                        <MenuItem value="12">12</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <InputLabel shrink>
                        Program Addmision Date<span>*</span>
                      </InputLabel>
                      <TextField
                        variant="outlined"
                        name="program_addmision_date"
                        type="date"
                        value={formData.program_addmision_date}
                        onChange={handleChange}
                        style={formFieldStyle}
                        fullWidth
                        required
                        error={!!formErrors.program_addmision_date}
                        helperText={formErrors.program_addmision_date}
                        // helperText="Age must be in Past"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <InputLabel shrink>
                        Classes Comencement Date<span>*</span>
                      </InputLabel>
                      <TextField
                        variant="outlined"
                        name="classes_commencement_date"
                        type="date"
                        value={formData.classes_commencement_date}
                        onChange={handleChange}
                        style={formFieldStyle}
                        fullWidth
                        required
                        error={!!formErrors.classes_commencement_date}
                        helperText={formErrors.classes_commencement_date}
                        // helperText="Age must be in Past"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {activeTab === 4 && (
                <Paper style={paperStyle}>
                  {/* cost of Program Information Fields */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Admission Fee of the Program"
                        variant="outlined"
                        name="admission_fee_of_the_program"
                        required
                        type="number"
                        value={formData.admission_fee_of_the_program}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.admission_fee_of_the_program} // Check if there's an error for the 'name' field
                        helperText={formErrors.admission_fee_of_the_program}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Total Tution Fee of the Program"
                        variant="outlined"
                        name="total_fee_of_the_program"
                        type="number"
                        required
                        value={formData.total_fee_of_the_program}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.total_fee_of_the_program} // Check if there's an error for the 'name' field
                        helperText={formErrors.total_fee_of_the_program}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Total Education Expenses"
                        variant="outlined"
                        name="total_education_expenses"
                        type="number"
                        value={formData.total_education_expenses}
                        onChange={handleChange}
                        fullWidth
                        required
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Expected Sponsorship Amount"
                        variant="outlined"
                        name="expected_sponsorship_amount"
                        type="number"
                        value={formData.expected_sponsorship_amount}
                        onChange={handleChange}
                        fullWidth
                        // error={!!formErrors.expected_sponsorship_amount} // Check if there's an error for the 'name' field
                        // helperText={formErrors.expected_sponsorship_amount}
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                      <TextField
                        label="Account Expenses"
                        variant="outlined"
                        name="account_expenses"
                        type="number"
                        value={formData.account_expenses}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.account_expenses} // Check if there's an error for the 'name' field
                        helperText={formErrors.account_expenses}
                      />
                    </Grid> */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Living Expenses / Per Annum"
                        variant="outlined"
                        name="living_expenses"
                        type="number"
                        value={formData.living_expenses}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.living_expenses} // Check if there's an error for the 'name' field
                        helperText={formErrors.living_expenses}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Food and Necessities Expenses / Per Annum"
                        variant="outlined"
                        name="food_and_necessities_expenses"
                        type="number"
                        value={formData.food_and_necessities_expenses}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.food_and_necessities_expenses} // Check if there's an error for the 'name' field
                        helperText={formErrors.food_and_necessities_expenses}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Transport Amount / Per Annum"
                        variant="outlined"
                        name="transport_amount"
                        type="number"
                        value={formData.transport_amount}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.transport_amount} // Check if there's an error for the 'name' field
                        helperText={formErrors.transport_amount}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Other Amount / Per Annum"
                        variant="outlined"
                        name="other_amount"
                        type="number"
                        value={formData.other_amount}
                        onChange={handleChange}
                        fullWidth
                        error={!!formErrors.other_amount} // Check if there's an error for the 'name' field
                        helperText={formErrors.other_amount}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Total Amount"
                        variant="outlined"
                        name="total_amount"
                        type="number"
                        value={formData.total_amount}
                        onChange={handleChange}
                        fullWidth
                        required
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {activeTab === 5 && (
                <Paper style={paperStyle}>
                  {/* Degree Information Fields */}
                  {degreeForm.map((degree, index) => (
                    <Grid
                      container
                      spacing={2}
                      key={index}
                      sx={{
                        marginBottom: 1,
                      }}
                    >
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Degree Name"
                          variant="outlined"
                          name="degree_name"
                          value={degree.degree_name}
                          onChange={(e) => handleDegreeChange(e, index)}
                          fullWidth
                          required
                          error={!!formErrors[`degree_${index}_name`]} // Check if there's an error for this field
                          helperText={formErrors[`degree_${index}_name`] || ""}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Status"
                          variant="outlined"
                          name="status"
                          value={degree.status}
                          onChange={(e) => handleDegreeChange(e, index)}
                          fullWidth
                          select
                          required
                          error={!!formErrors[`degree_${index}_status`]} // Check if there's an error for this field
                          helperText={
                            formErrors[`degree_${index}_status`] || ""
                          }
                        >
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Institute Name"
                          variant="outlined"
                          name="institute_name"
                          value={degree.institute_name}
                          onChange={(e) => handleDegreeChange(e, index)}
                          fullWidth
                          required
                          error={!!formErrors[`degree_${index}_institute_name`]} // Check if there's an error for this field
                          helperText={
                            formErrors[`degree_${index}_institute_name`] || ""
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Grade"
                          variant="outlined"
                          name="grade"
                          value={degree.grade}
                          onChange={(e) => handleDegreeChange(e, index)}
                          fullWidth
                          required
                          error={!!formErrors[`degree_${index}_grade`]} // Check if there's an error for this field
                          helperText={formErrors[`degree_${index}_grade`] || ""}
                        />
                      </Grid>
                      {index > 0 && (
                        <Button
                          variant="text"
                          onClick={() => removeDegree(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </Grid>
                  ))}
                  <Button variant="outlined" onClick={addDegree}>
                    Add Degree
                  </Button>
                </Paper>
              )}
              {activeTab === 6 && (
                <Paper style={paperStyle}>
                  {/* Personal Statement Fields */}
                  {/* ... */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Personal Statement"
                        variant="outlined"
                        name="personal_statement"
                        multiline
                        rows={9}
                        value={formData.personal_statement}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.personal_statement} // Check if there's an error for the 'personal_statement' field and if the field is empty
                        helperText={
                          "Please share your personal and family background, your past education, your financial situation, why do you believe you deserve the sponsorship and your future plans and ambitions"
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}
              {activeTab === 7 && (
                <Paper style={paperStyle}>
                  {/* Document Uploads Fields */}
                  {/* ... */}

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <InputLabel shrink>
                        Degree Documents <span>*</span>
                      </InputLabel>
                      <input
                        variant="outlined"
                        name="degree_documents"
                        accept=".pdf, .jpeg, .jpg, .png, .docx"
                        type="file"
                        value="" // Clear input value
                        onChange={(event) =>
                          handleFileChange(event, "degree_documents")
                        }
                        fullWidth
                        required={!formData.degree_documents.length}
                        error={!!formErrors.degree_documents}
                        helperText={formErrors.degree_documents}
                        multiple // Allow multiple file selection
                      />

                      {/* Display selected files */}
                      {formData.degree_documents.map((file, index) => (
                        <div key={index}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewFileDetails(file)}
                          >
                            View Degree {index + 1}
                          </Button>

                          <IconButton
                            variant="outlined"
                            sx={{ marginLeft: 1, color: "red" }}
                            size="small"
                            onClick={() =>
                              handleRemoveFile("degree_documents", index)
                            }
                          >
                            X
                          </IconButton>
                        </div>
                      ))}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel shrink>
                        Transcript Documents <span>*</span>
                      </InputLabel>
                      <input
                        variant="outlined"
                        name="transcript_documents"
                        accept=".pdf, .jpeg, .jpg, .png, .docx"
                        type="file"
                        onChange={(event) =>
                          handleFileChange(event, "transcript_documents")
                        }
                        value="" // Clear input value
                        fullWidth
                        required={!formData.transcript_documents.length}
                        error={!!formErrors.transcript_documents}
                        helperText={formErrors.transcript_documents}
                        multiple // Allow multiple file selection
                      />

                      {/* Display selected files */}
                      {formData.transcript_documents.map((file, index) => (
                        <div key={index}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewFileDetails(file)}
                          >
                            View Transcript {index + 1}
                          </Button>

                          <IconButton
                            variant="outlined"
                            sx={{ marginLeft: 1, color: "red" }}
                            size="small"
                            onClick={() =>
                              handleRemoveFile("transcript_documents", index)
                            }
                          >
                            X
                          </IconButton>
                        </div>
                      ))}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel shrink>
                        Income Statement Documents <span>*</span>
                      </InputLabel>
                      <input
                        variant="outlined"
                        name="income_statement_documents"
                        accept=".pdf, .jpeg, .jpg, .png, .docx"
                        type="file"
                        onChange={(event) =>
                          handleFileChange(event, "income_statement_documents")
                        }
                        value="" // Clear input value
                        fullWidth
                        required={!formData.income_statement_documents.length}
                        error={!!formErrors.income_statement_documents}
                        helperText={formErrors.income_statement_documents}
                        multiple // Allow multiple file selection
                      />

                      {/* Display selected files */}
                      {formData.income_statement_documents.map(
                        (file, index) => (
                          <div key={index}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewFileDetails(file)}
                            >
                              View Income Statement {index + 1}
                            </Button>

                            <IconButton
                              variant="outlined"
                              sx={{ marginLeft: 1, color: "red" }}
                              size="small"
                              onClick={() =>
                                handleRemoveFile(
                                  "income_statement_documents",
                                  index
                                )
                              }
                            >
                              X
                            </IconButton>
                          </div>
                        )
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel shrink>
                        Profile Picture <span>*</span>
                      </InputLabel>
                      <input
                        // label="Profile Picture"
                        variant="outlined"
                        name="profile_picture"
                        type="file" // Update to use the file type
                        accept=".jpeg, .jpg, .png"
                        onChange={handleChange}
                        fullWidth
                        required={!formData.profile_picture}
                        error={!!formErrors.profile_picture} // Check if there's an error for the 'name' field
                        helperText={formErrors.profile_picture}
                      />
                      {/* Button to view selected file details */}
                      {formData.profile_picture && (
                        <Button
                          variant="outlined"
                          onClick={() =>
                            handleViewFileDetails(formData.profile_picture)
                          }
                        >
                          View Profile
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              )}

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  // color="primary"
                  disabled={activeTab === 0}
                  sx={{ backgroundColor: "#14475a" }}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  // color="primary"
                  sx={{ backgroundColor: "#14475a" }}
                  disabled={activeTab === 7} // Adjust the upper limit based on the number of tabs
                  onClick={handleContinue}
                  style={{ marginLeft: "10px" }}
                >
                  Continue
                </Button>
                {activeTab === 7 && (
                  <div style={{ position: "relative" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      // color="primary"
                      style={{ marginLeft: "10px" }}
                      sx={{ backgroundColor: "#14475a" }}
                    >
                      Submit
                    </Button>
                    {/* <button type="submit" >
                    Submit
                  </button> */}
                    {loading && (
                      <CircularProgress
                        size={24}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: -12,
                          marginLeft: -12,
                        }}
                      />
                    )}
                  </div>
                )}
                {activeTab === 7 && (
                  <Typography
                    variant="h12"
                    color={"tomato"}
                    sx={{ marginLeft: 50 }}
                  >
                    {" "}
                    Note! All documents are required
                  </Typography>
                )}
              </div>
            </form>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseAlert}
          severity={alert?.severity}
        >
          {alert?.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default AddApplicationForm;
