import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tab,
  Tabs,
  TextField,
  Button,
  MenuItem,
  Paper,
  Grid,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Input,
  Typography,
  Box,
  Container,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";

const EditsApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const { applicationId } = useParams();
  const [degreeData, setDegreeData] = useState([]);
  const [existingDegreeCount, setExistingDegreeCount] = useState("");
  const addDegree = () => {
    setDegreeData([
      ...degreeData,
      {
        application: applicationId,
        degree_name: "",
        status: "",
        institute_name: "",
        grade: "",
        isNew: true, // Mark the degree as news
      },
    ]);
  };

  const removeDegree = (index) => {
    const updatedDegreeData = [...degreeData];
    updatedDegreeData.splice(index, 1);
    setDegreeData(updatedDegreeData);
  };

  const validateDegreeForm = () => {
    for (const [index, degree] of degreeData.entries()) {
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
  const [activeTab, setActiveTab] = useState(0);
  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);
  const [alert, setAlert] = useState(null);
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  // const BASE_URL = "http://127.0.0.1:8000";

  const handleCloseAlert = () => {
    setAlert(null);
  };
  const paperStyle = {
    padding: "20px",
    marginBottom: "20px",
  };

  const formFieldStyle = {
    marginBottom: "8px",
    Width: "200px",
  };
  const handleDeleteExistingDocument = (documentId) => {
    // Remove the document from existingData
    const updatedExistingData = {
      ...existingData,
      degree_documents: existingData.degree_documents.filter(
        (doc) => doc.id !== documentId
      ),
      transcript_documents: existingData.transcript_documents.filter(
        (doc) => doc.id !== documentId
      ),
      income_statement_documents:
        existingData.income_statement_documents.filter(
          (doc) => doc.id !== documentId
        ),
    };
    setExistingData(updatedExistingData);

    // Remove the document from formData
    const updatedFormData = {
      ...formData,
      degree_documents: formData.degree_documents.filter(
        (doc) => doc.id !== documentId
      ),
      transcript_documents: formData.transcript_documents.filter(
        (doc) => doc.id !== documentId
      ),
      income_statement_documents: formData.income_statement_documents.filter(
        (doc) => doc.id !== documentId
      ),
    };
    setFormData(updatedFormData);

    // Check if the document ID already exists in the state
    const index = deletedDocumentIds.indexOf(documentId);
    if (index === -1) {
      // If not found, add the document ID to the list of deleted document IDs
      setDeletedDocumentIds([...deletedDocumentIds, documentId]);
    } else {
      // If found, remove the document ID from the list
      const updatedIds = [...deletedDocumentIds];
      updatedIds.splice(index, 1);
      setDeletedDocumentIds(updatedIds);
    }
  };

  useEffect(() => {
    console.log(deletedDocumentIds);
    console.log(formData), console.log(existingData);
  }, [deletedDocumentIds]);
  // const handleTabChange = (event, newValue) => {
  //   setActiveTab(newValue);
  // };
  // const handleBack = () => {
  //   setActiveTab((prevTab) => Math.max(prevTab - 1, 0));
  // };

  // const handleContinue = () => {
  //   setActiveTab((prevTab) => Math.min(prevTab + 1, 8)); // Adjust the upper limit based on the number of tabs
  // };

  const [students, setStudents] = useState([]);

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

    // Fetch projection data and set the form data
    const fetchApplicationData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/application/${applicationId}/`
        );
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
          console.log(data);
        } else {
          console.error("Failed to fetch application data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchApplicationData();
    const fetchDegrees = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/application/${applicationId}/degrees/`
        );
        setDegreeData(response.data);
        setExistingDegreeCount(degrees.length);
      } catch (error) {
        console.error("Error fetching degrees:", error);
      }
    };
    fetchDegrees();
  }, []);
  const [existingData, setExistingData] = useState(null);
  const handleDegreeChange = (event, index, fieldName) => {
    const { value } = event.target;
    setDegreeData((prevDegrees) => {
      const updatedDegrees = prevDegrees.map((degree, i) => {
        if (i === index) {
          return { ...degree, [fieldName]: value };
        }
        return degree;
      });
      return updatedDegrees;
    });
  };

  // Function to fetch existing data from the API
  const fetchExistingData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/application/${applicationId}/`
      );
      setExistingData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching existing data:", error);
    }
  };

  // Call fetchExistingData when the component mounts to fetch existing data
  useEffect(() => {
    fetchExistingData();
  }, []);
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
  const handleViewFileDetails = (file) => {
    // Create a URL for the selected file
    const fileURL = URL.createObjectURL(file);

    // Open a new window/tab to display the file
    window.open(fileURL);
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
          "degree_document",
          "transcript_document",
          "income_statement_document",
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
      degreeData.forEach((degree, index) => {
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
      // case "program_interested_in":
      case "province":
      case "personal_statement":
      case "city":
      case "city_of_origin":
      case "description_of_household":
      case "program_interested_in":
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
      // case "expected_sponsorship_amount":
      case "total_members_of_household":
      case "members_earning":
      case "income_per_month":
      case "expense_per_month":
        // Numeric field validation
        if (!value.trim() || isNaN(value)) {
          return "Please enter a valid number";
        }
        break;
      case "degree_document":
      case "transcript_document":
      case "income_statement_document":
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
    admission_fee_considered: "",
    education_fee_considered: "",
    other_cost_considered: "",
    admission_fee_persentage_considered: "",
    education_fee_persentage_considered: "",
    other_cost_persentage_considered: "",
    total_members_of_household: "",
    members_earning: "",
    income_per_month: "",
    expense_per_month: "",
    description_of_household: "",
    personal_statement: "",
    total_amount: " ",
    total_education_expenses: "",
    program_interested_in: "",
    degree_document: "", // Handle file upload separately if needed
    transcript_document: "", // Handle file upload separately if needed
    income_statement_document: "", // Handle file upload separately if needed
    profile_picture: "", // Handle file upload separately if needed

    // Add other form fields here with initial error messages
  };
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [formData, setFormData] = useState({
    // Initialize formData with an empty structure matching your form fields
    id: null,
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
    account_expenses: "",
    living_expenses: "",
    food_and_necessities_expenses: "",
    transport_amount: "",
    other_amount: "",
    expected_sponsorship_amount: "",
    admission_fee_considered: "",
    education_fee_considered: "",
    other_cost_considered: "",
    admission_fee_persentage_considered: "",
    education_fee_persentage_considered: "",
    other_cost_persentage_considered: "",
    total_members_of_household: "",
    members_earning: "",
    income_per_month: "",
    expense_per_month: "",
    description_of_household: "",
    personal_statement: "",
    total_amount: "",
    total_education_expenses: "",
    program_interested_in: "",
    degree_documents: [],
    transcript_documents: [],
    income_statement_documents: [],
    profile_picture: "",
    degree: [],
    status: "",
    verification_required: false,
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

  const handleChange = (event, index, type) => {
    const { name, type: fieldType, checked, files } = event.target;
    const value =
      fieldType === "checkbox"
        ? checked
        : fieldType === "file"
        ? files[0]
        : event.target.value;

    // Validate the field and get the error message
    let errorMessage = validateField(name, value);

    // If the field is 'date_of_birth', calculate age
    if (name === "date_of_birth" && !errorMessage) {
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
          errorMessage = "Invalid date format";
        }
      } else {
        // Date of birth is empty, set error
        errorMessage = "Date of birth is required";
      }
    }

    // Update form errors based on the validation result
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    if (type === "degree") {
      const updatedDegree = {
        ...formData.degree[index],
        [name]: value,
      };

      const updatedFormData = {
        ...formData,
        degree: [
          ...formData.degree.slice(0, index),
          updatedDegree,
          ...formData.degree.slice(index + 1),
        ],
      };

      setFormData(updatedFormData);
    } else {
      const updatedFormData = {
        ...formData,
        [name]: value,
      };

      setFormData(updatedFormData);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true when form is submitted
    console.log("Form Errors:", formErrors);
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
      if (
        formData.degree_documents.length === 0 &&
        existingData.degree_documents.length === 0
      ) {
        // Show error because no degree documents are provided
        setAlert({
          severity: "error",
          message: "Please provide at least one degree document.",
        });
        setLoading(false); // Set loading state to false
        return; // Stop further execution
      }
      if (
        formData.transcript_documents.length === 0 &&
        existingData.transcript_documents.length === 0
      ) {
        // Show error because no degree documents are provided
        setAlert({
          severity: "error",
          message: "Please provide at least one degree document.",
        });
        setLoading(false); // Set loading state to false
        return; // Stop further execution
      }
      if (
        formData.income_statement_documents.length === 0 &&
        existingData.income_statement_documents.length === 0
      ) {
        // Show error because no degree documents are provided
        setAlert({
          severity: "error",
          message: "Please provide at least one degree document.",
        });
        setLoading(false); // Set loading state to false
        return; // Stop further execution
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

      try {
        const formDataToSend = new FormData();

        // Append all fields to the FormData object
        for (const key in formData) {
          if (key === "degree") {
            // Handle degree data separately
            formData[key].forEach((degree, index) => {
              for (const degreeKey in degree) {
                formDataToSend.append(
                  `degree[${index}].${degreeKey}`,
                  degree[degreeKey]
                );
              }
            });
          } else if (formData[key] !== undefined) {
            formDataToSend.append(key, formData[key]);
          }
        }
        // Loop through each file in the array and append them individually
        formData.degree_documents.forEach((file) => {
          formDataToSend.append("degree_documents", file);
        });

        formData.transcript_documents.forEach((file) => {
          formDataToSend.append("transcript_documents", file);
        });

        formData.income_statement_documents.forEach((file) => {
          formDataToSend.append("income_statement_documents", file);
        });

        // Check if degree_documents array is empty
        if (formData.degree_documents.length === 0) {
          // Append existing degree documents if no new files are selected
          existingData.degree_documents.forEach((file) => {
            formDataToSend.append("degree_documents", file);
          });
        }

        // Check if transcript_documents array is empty
        if (formData.transcript_documents.length === 0) {
          // Append existing transcript documents if no new files are selected
          existingData.transcript_documents.forEach((file) => {
            formDataToSend.append("transcript_documents", file);
          });
        }

        // Check if income_statement_documents array is empty
        if (formData.income_statement_documents.length === 0) {
          // Append existing income statement documents if no new files are selected
          existingData.income_statement_documents.forEach((file) => {
            formDataToSend.append("income_statement_documents", file);
          });
        }
        if (deletedDocumentIds.length > 0) {
          formDataToSend.append(
            "deletedDocumentIds",
            deletedDocumentIds.join(",")
          );
        }
        console.log("FormData to send:", formDataToSend);

        const response = await axios.put(
          `${BASE_URL}/api/applications/${existingData.id}/`,
          formDataToSend
        );
        setLoading(false); // Set loading state to true when form is submitted
        setAlert({
          severity: "success",
          message: "Application updated successfully!",
        });
        // Navigate after 2 seconds
        // Handle successful response
        console.log("Application updated successfully:", response.data);
      } catch (error) {
        // Handle error
        console.error("Error updating application:", error);
        console.log("Error response data:", error.response.data); // Log the response data from the server
        if (error.response && error.response.data) {
          // Username already exists error
          const errorMessage = error.response.data;
          setLoading(false);
          setAlert({ severity: "error", message: errorMessage });
        } else {
          // Other errors
          setLoading(false);
          setAlert({
            severity: "error",
            message: "Failed to update Application",
          });
        }
      }

      try {
        const updatedDegreePromises = degreeData.map(async (degree) => {
          if (degree.isNew) {
            // If the degree is new, remove the isNew property
            const { isNew, ...newDegree } = degree;
            // Remove isNew from the degree object
            const response = await axios.post(
              `${BASE_URL}/api/application/${applicationId}/degrees/`,
              newDegree // Send the modified degree object without isNew
            );
            return response.data;
          } else {
            // If the degree is existing, update it
            const response = await axios.put(
              `${BASE_URL}/api/application/${applicationId}/degrees/${degree.id}/`,
              degree
            );
            return response.data;
          }
        });

        // Wait for all degree updates (including creations) to complete
        const updatedDegrees = await Promise.all(updatedDegreePromises);
        console.log("Degrees updated successfully:", updatedDegrees);
        setAlert({
          severity: "success",
          message: "Degrees updated successfully!",
        });
        setTimeout(() => {
          navigate("/admin/allApplications");
        }, 2000);
      } catch (error) {
        // Handle error
        console.error("Error updating degrees:", error);
        if (error.response && error.response.data) {
          // Username already exists error
          const errorMessage = error.response.data;
          setAlert({ severity: "error", message: errorMessage });
        } else {
          // Other errors
          setAlert({
            severity: "error",
            message: "Failed to update Degrees",
          });
        }
      }
    }
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
            EDIT APPLICATION
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
          <Box
            sx={{
              maxHeight: "calc(100vh - 200px)",
              overflow: "auto",
            }}
          >
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="px-6 h-96 "
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
                        InputProps={{
                          readOnly: true,
                        }}
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
                    <Grid item xs={12} sm={12}>
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
                        No Of Years <span>*</span>
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
                        No Of Semester/Months <span>*</span>
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
                        Program Addmision Date <span>*</span>
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
                        Classes Comencement Date <span>*</span>
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
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        color="red"
                        sx={{ mb: 2 }}
                      >
                        {formData.admission_fee_considered ||
                        formData.admission_fee_persentage_considered ||
                        formData.education_fee_considered ||
                        formData.education_fee_persentage_considered ||
                        formData.other_cost_considered ||
                        formData.other_cost_persentage_considered
                          ? "These fields have been auto-filled based on the selected donor."
                          : "These fields will be auto-filled when a donor is selected for the student."}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Admission Fee Considered"
                        variant="outlined"
                        name="admission_fee_considered"
                        value={formData.admission_fee_considered}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                formData.education_fee_persentage_considered
                                  ? "green"
                                  : "orange",
                            },
                            "& fieldset": {
                              borderColor:
                                formData.education_fee_persentage_considered
                                  ? "green"
                                  : "#d32f2f",
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Admission Fee (%) Approved"
                        variant="outlined"
                        name="admission_fee_persentage_considered"
                        value={formData.admission_fee_persentage_considered}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                formData.education_fee_persentage_considered
                                  ? "green"
                                  : "orange",
                            },
                            "& fieldset": {
                              borderColor:
                                formData.education_fee_persentage_considered
                                  ? "green"
                                  : "#d32f2f",
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Education Fee Considered"
                        variant="outlined"
                        name="education_fee_considered"
                        value={formData.education_fee_considered}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                formData.education_fee_persentage_considered
                                  ? "green"
                                  : "orange",
                            },
                            "& fieldset": {
                              borderColor:
                                formData.education_fee_persentage_considered
                                  ? "green"
                                  : "#d32f2f",
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Education Fee (%) Approved"
                        variant="outlined"
                        name="education_fee_persentage_considered"
                        value={formData.education_fee_persentage_considered}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                formData.education_fee_persentage_considered
                                  ? "green"
                                  : "orange",
                            },
                            "& fieldset": {
                              borderColor:
                                formData.education_fee_persentage_considered
                                  ? "green"
                                  : "#d32f2f",
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Other Costs Considered"
                        variant="outlined"
                        name="other_cost_considered"
                        value={formData.other_cost_considered}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                formData.education_fee_persentage_considered
                                  ? "green"
                                  : "orange",
                            },
                            "& fieldset": {
                              borderColor:
                                formData.education_fee_persentage_considered
                                  ? "green"
                                  : "#d32f2f",
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Other Costs (%) Approved"
                        variant="outlined"
                        name="other_cost_persentage_considered"
                        value={formData.other_cost_persentage_considered}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor:
                                formData.education_fee_persentage_considered
                                  ? "green"
                                  : "orange",
                            },
                            "& fieldset": {
                              borderColor:
                                formData.education_fee_persentage_considered
                                  ? "green"
                                  : "#d32f2f",
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {/* Degree Information Fields */}
              {activeTab === 5 && (
                <Paper style={paperStyle}>
                  {/* Degree Information Fields */}
                  {degreeData &&
                    degreeData.map((degree, index) => (
                      <Grid container spacing={2} key={index}>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="Degree Name"
                            variant="outlined"
                            name={`degree[${index}].degree_name`}
                            value={degree.degree_name}
                            onChange={(e) =>
                              handleDegreeChange(e, index, "degree_name")
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="Status"
                            variant="outlined"
                            name={`degree[${index}].status`}
                            value={degree.status}
                            select
                            onChange={(e) =>
                              handleDegreeChange(e, index, "status")
                            }
                            fullWidth
                          >
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="Institute Name"
                            variant="outlined"
                            name={`degree[${index}].institute_name`}
                            value={degree.institute_name}
                            onChange={(e) =>
                              handleDegreeChange(e, index, "institute_name")
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="Grade"
                            variant="outlined"
                            name={`degree[${index}].grade`}
                            value={degree.grade}
                            onChange={(e) =>
                              handleDegreeChange(e, index, "grade")
                            }
                            fullWidth
                          />
                        </Grid>
                        {index > existingDegreeCount && ( // Render remove button only for degrees beyond the existing count
                          <Grid item xs={12}>
                            <Button
                              variant="outlined"
                              onClick={() => removeDegree(index)}
                            >
                              Remove
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    ))}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={addDegree}
                    >
                      Add Degree
                    </Button>
                  </Grid>
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
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <InputLabel shrink>
                        Degree Documents <span>*</span>
                      </InputLabel>
                      <input
                        type="file"
                        name="degree_documents"
                        accept=".pdf, .jpeg, .jpg, .png, .docx"
                        value="" // Clear input value
                        onChange={(event) =>
                          handleFileChange(event, "degree_documents")
                        }
                        multiple // Allow multiple file selection
                      />
                      {/* Display selected files */}
                      {formData.degree_documents.map((document, index) => (
                        <div key={index}>
                          {/* Render view button for existing documents */}
                          {!deletedDocumentIds.includes(document.id) &&
                          document.id &&
                          document.file ? (
                            <div>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleViewFileDetails(document)}
                              >
                                <a
                                  href={`https://res.cloudinary.com/ddkoi7tix/${document.file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Existing Deg_Doc {index + 1}
                                </a>
                              </Button>
                              {/* Add delete button for existing documents */}
                              <IconButton
                                variant="outlined"
                                sx={{ marginLeft: 1, color: "red" }}
                                size="small"
                                onClick={() =>
                                  handleDeleteExistingDocument(document.id)
                                }
                              >
                                <DeleteIcon style={{ color: "red" }} />
                              </IconButton>
                            </div>
                          ) : null}
                          {/* Render button for newly added documents */}
                          {!document.id && !document.file ? (
                            <>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleViewFileDetails(document)}
                              >
                                New Deg_Doc {index + 1}
                              </Button>
                              <IconButton
                                variant="outlined"
                                sx={{ marginLeft: 1, color: "red" }}
                                size="small"
                                onClick={() =>
                                  handleRemoveFile("degree_documents", index)
                                }
                              >
                                <DeleteIcon style={{ color: "red" }} />
                              </IconButton>
                            </>
                          ) : null}
                        </div>
                      ))}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel shrink>
                        Transcript Documents <span>*</span>
                      </InputLabel>
                      <input
                        type="file"
                        name="transcript_documents"
                        accept=".pdf, .jpeg, .jpg, .png, .docx"
                        value="" // Clear input value
                        onChange={(event) =>
                          handleFileChange(event, "transcript_documents")
                        }
                        multiple // Allow multiple file selection
                      />
                      {/* Display selected files */}
                      {formData.transcript_documents.map((document, index) => (
                        <div key={index}>
                          {/* Render view button for existing documents */}
                          {!deletedDocumentIds.includes(document.id) &&
                          document.id &&
                          document.file ? (
                            <div>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleViewFileDetails(document)}
                              >
                                <a
                                  href={`https://res.cloudinary.com/ddkoi7tix/${document.file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Existing Tra_Doc {index + 1}
                                </a>
                              </Button>
                              <IconButton
                                variant="outlined"
                                sx={{ marginLeft: 1, color: "red" }}
                                size="small"
                                onClick={() =>
                                  handleDeleteExistingDocument(document.id)
                                }
                              >
                                <DeleteIcon style={{ color: "red" }} />
                              </IconButton>
                            </div>
                          ) : null}

                          {/* Render button for newly added documents */}
                          {!document.id && !document.file ? (
                            <>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleViewFileDetails(document)}
                              >
                                New Tra_Doc {index + 1}
                              </Button>
                              <IconButton
                                variant="outlined"
                                sx={{ marginLeft: 1, color: "red" }}
                                size="small"
                                onClick={() =>
                                  handleRemoveFile(
                                    "transcript_documents",
                                    index
                                  )
                                }
                              >
                                <DeleteIcon style={{ color: "red" }} />
                              </IconButton>
                            </>
                          ) : null}
                        </div>
                      ))}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel shrink>
                        Income Statement Documents <span>*</span>
                      </InputLabel>
                      <input
                        type="file"
                        name="income_statement_documents"
                        accept=".pdf, .jpeg, .jpg, .png, .docx"
                        value="" // Clear input value
                        onChange={(event) =>
                          handleFileChange(event, "income_statement_documents")
                        }
                        multiple // Allow multiple file selection
                      />
                      {formData.income_statement_documents.map(
                        (document, index) => (
                          <div key={index}>
                            {/* Render view button for existing documents */}
                            {!deletedDocumentIds.includes(document.id) &&
                            document.id &&
                            document.file ? (
                              <div>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    handleViewFileDetails(document)
                                  }
                                >
                                  <a
                                    href={`https://res.cloudinary.com/ddkoi7tix/${document.file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Existing Inc_Sta_Doc {index + 1}
                                  </a>
                                </Button>
                                <IconButton
                                  variant="outlined"
                                  sx={{ marginLeft: 1, color: "red" }}
                                  size="small"
                                  onClick={() =>
                                    handleDeleteExistingDocument(document.id)
                                  }
                                >
                                  <DeleteIcon style={{ color: "red" }} />
                                </IconButton>
                              </div>
                            ) : null}

                            {/* Render button for newly added documents */}
                            {!document.id && !document.file ? (
                              <>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    handleViewFileDetails(document)
                                  }
                                >
                                  New Inc_Sta_Doc {index + 1}
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
                                  <DeleteIcon style={{ color: "red" }} />
                                </IconButton>
                              </>
                            ) : null}
                          </div>
                        )
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputLabel shrink>
                        Profile Picture <span>*</span>
                      </InputLabel>
                      <input
                        type="file"
                        name="profile_picture"
                        accept=".jpeg, .jpg, .png"
                        onChange={handleChange}
                      />
                      {/* Display existing picture if available */}
                      {existingData?.profile_picture && (
                        <Button variant="outlined" size="small">
                          <a
                            href={existingData.profile_picture}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Profile Picture
                          </a>
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

export default EditsApplicationForm;
