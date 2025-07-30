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
  Fade,
  Slide,
  Zoom,
  Grow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { styled, keyframes } from "@mui/system";

// Define custom animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(67, 97, 238, 0); }
  100% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0); }
`;

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  animation: `${fadeIn} 0.8s ease`,
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  background: "#ffffff",
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginTop: theme.spacing(2),
  "& .MuiTabs-indicator": {
    height: 4,
    background: "linear-gradient(90deg, #4361ee, #3a0ca3)",
    borderRadius: "2px",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 600,
  color: "#64748b",
  textTransform: "capitalize",
  fontSize: "0.9rem",
  "&.Mui-selected": {
    color: "#4361ee",
    backgroundColor: "rgba(67, 97, 238, 0.08)",
  },
  transition: "all 0.3s ease",
}));

const FormTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    transition: "all 0.3s ease",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4361ee",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: "1px",
      borderColor: "#4361ee",
      boxShadow: "0 0 0 4px rgba(67, 97, 238, 0.15)",
    },
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)",
  color: "white",
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: 500,
  textTransform: "none",
  boxShadow: "0 4px 6px rgba(67, 97, 238, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 8px rgba(67, 97, 238, 0.3)",
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  color: "#4361ee",
  border: "1px solid #4361ee",
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: 500,
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(67, 97, 238, 0.08)",
  },
}));

const CardAnimation = styled(Box)(({ theme }) => ({
  animation: `${fadeIn} 0.5s ease forwards`,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(4),
  fontWeight: 600,
  color: "#1e293b",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "64px",
    height: "4px",
    background: "linear-gradient(90deg, #4361ee, #3a0ca3)",
    borderRadius: "4px",
  },
}));

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [studentData, setStudentData] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleCloseAlert = () => setAlert(null);
  // Degree form state
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
        String(degree.degree_name).trim() === "" ||
        degree.status.trim() === "" ||
        degree.institute_name.trim() === "" ||
        degree.grade.trim() === ""
      ) {
        return `Please fill all fields for Previous Education ${index + 1}`;
      }
    }
    return "";
  };

  const [students, setStudents] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  useEffect(() => {
    // Fetch students
    fetch(`${BASE_URL}/students/`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);

        // Get the student ID from local storage
        const storedStudentId = localStorage.getItem("studentId");

        // Find the student with the stored student ID
        const foundStudent = data.find(
          (student) => student.id === parseInt(storedStudentId)
        );

        // Check if the student is found
        if (foundStudent) {
          setStudentData(foundStudent);
          // Update the form data state with the values of the found student
          setFormData((prevFormData) => ({
            ...prevFormData,
            student: foundStudent.id,
            name: foundStudent.student_name,
            father_name: foundStudent.father_name,
            last_name: foundStudent.last_name,
            gender: foundStudent.gender,
            email: foundStudent.email,
            cnic_or_b_form: foundStudent.cnic,
            // Update other form fields similarly
          }));
        } else {
          // Student not found, handle accordingly
          console.log("Student not found with ID:", storedStudentId);
        }
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });

    // Fetch programs
    fetch(`${BASE_URL}/programs/`)
      .then((response) => response.json())
      .then((data) => {
        setPrograms(data);
      })
      .catch((error) => {
        console.error("Error fetching programs:", error);
      });
  }, []);

  const handleDegreeChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDegreeForm = [...degreeForm];
    updatedDegreeForm[index] = { ...updatedDegreeForm[index], [name]: value };
    setDegreeForm(updatedDegreeForm);
  };

  const paperStyle = {
    padding: "20px",
    marginBottom: "20px",
  };

  const formFieldStyle = {
    marginBottom: "8px",
    width: "100%",
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
        ];
      case 1:
        return [
          "province",
          "city",
          "city_of_origin",
          "mobile_no",
          "cnic_or_b_form",
          "email",
          "village",
          "address",
        ];
      case 2:
        return [
          "father_full_name",
          "father_education",
          "mother_name",
          "mother_education",
          "disabled_parent_name",
          "disabled_parent_cnic",
          "disability_nature",
          "occupation",
          "household_income",
          "number_of_siblings",
          // "has_medical_condition",
          // "medical_condition_details",
        ];
      case 3:
        return [
          "grade_interested_in",
          "school_interested_in",
          "program_addmision_date",
          "classes_commencement_date",
          "career_aspirations",
        ];
      case 4:
        return [
          "admission_fee_of_the_program",
          "total_fee_of_the_program",
          // "living_expenses",
          // "food_and_necessities_expenses",
          // "transport_amount",
          // "other_amount",
          // "birthday_gift",
          // "eid_al_fitr_gift",
          // "eid_al_adha_gift",
          // "health_insurance",
          "expected_sponsorship_amount",
          "total_amount",
          "total_education_expenses",
        ];
      case 6:
        return [
          "disabled_parent_cnic_doc",
          "b_form_doc",
          "disabled_parent_photo",
          "child_photo",
          "school_record",
          "proof_of_address",
        ];
      default:
        return [];
    }
  };

  const handleContinue = () => {
    const fieldsForTab = getFieldsForTab(activeTab);
    const tabErrors = {};

    fieldsForTab.forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        tabErrors[fieldName] = error;
      }
    });

    fieldsForTab
      .filter((fieldName) => !fieldName.startsWith("degree_"))
      .forEach((fieldName) => {
        if (!formData[fieldName]) {
          tabErrors[fieldName] = "This field is required";
        }
      });

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
      const totalTabs = 7;
      setActiveTab((prevTab) => Math.min(prevTab + 1, totalTabs - 1));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "date_of_birth":
        const today = new Date();
        const selectedDate = new Date(value);
        if (isNaN(selectedDate.getTime())) return "Invalid date";
        const ageInMilliseconds = today - selectedDate;
        const ageInYears = Math.floor(
          ageInMilliseconds / (1000 * 60 * 60 * 24 * 365)
        );
        if (ageInYears < 5) {
          return "Date of birth cannot be in the future & at least 5 years";
        }
        break;
      // case "email":
      //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      //   if (value && !emailRegex.test(value)) {
      //     return "Invalid email address";
      //   }
      //   break;
      case "mobile_no":
        const mobileRegex = /^[0-9]{11}$/;
        if (value && !mobileRegex.test(value)) {
          return "Invalid mobile number";
        }
        break;
      case "cnic_or_b_form":
      case "disabled_parent_cnic":
      case "disabled_parent_cnic_doc":
      case "b_form_doc":
        if (!value) return "This field is required";
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
        if (!value || !value.trim()) {
          return "This field is required";
        }
        break;
      case "admission_fee_of_the_program":
      case "total_fee_of_the_program":
      case "expected_sponsorship_amount":
      case "total_members_of_household":
      case "members_earning":
      case "income_per_month":
      case "expense_per_month":
        if (!value || isNaN(value)) {
          return "Please enter a valid number";
        }
        break;
      case "disabled_parent_photo":
      case "child_photo":
      case "school_record":
      case "proof_of_address":
        if (!value) {
          return "Please upload a file";
        }
        break;
      default:
        break;
    }
    return "";
  };

  const initialFormErrors = {
    student: "",
    name: "",
    father_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    age: "1",
    country: "",
    province: "",
    city: "",
    city_of_origin: "",
    mobile_no: "",
    cnic_or_b_form: "",
    email: "",
    village: "",
    address: "",
    father_full_name: "",
    father_education: "",
    mother_name: "",
    mother_education: "",
    disabled_parent_name: "",
    disabled_parent_cnic: "",
    disability_nature: "",
    occupation: "",
    household_income: "",
    number_of_siblings: "",
    has_medical_condition: "",
    medical_condition_details: "",
    grade_interested_in: "",
    school_interested_in: "",
    program_addmision_date: "",
    classes_commencement_date: "",
    career_aspirations: "",
    admission_fee_of_the_program: "",
    total_fee_of_the_program: "",
    living_expenses: "",
    food_and_necessities_expenses: "",
    transport_amount: "",
    other_amount: "",
    birthday_gift: "",
    eid_al_fitr_gift: "",
    eid_al_adha_gift: "",
    health_insurance: "",
    expected_sponsorship_amount: "",
    total_amount: "",
    total_education_expenses: "",
    disabled_parent_cnic_doc: "",
    b_form_doc: "",
    disabled_parent_photo: "",
    child_photo: "",
    school_record: "",
    proof_of_address: "",
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
    country: "",
    province: "",
    city: "",
    city_of_origin: "",
    mobile_no: "",
    cnic_or_b_form: "",
    email: "",
    village: "",
    address: "",
    father_full_name: "",
    father_education: "",
    father_occupation: "",
    mother_name: "",
    mother_education: "",
    mother_occupation: "",
    disabled_parent_name: "",
    disabled_parent_cnic: "",
    disability_nature: "",
    occupation: "",
    household_income: "",
    number_of_siblings: "",
    has_medical_condition: "",
    medical_condition_details: "",
    grade_interested_in: "",
    school_interested_in: "",
    current_school: "",
    current_grade: "",
    school_address: "",
    program_addmision_date: "",
    classes_commencement_date: "",
    career_aspirations: "",
    admission_fee_of_the_program: "",
    total_fee_of_the_program: "",
    living_expenses: "",
    food_and_necessities_expenses: "",
    transport_amount: "",
    other_amount: "",
    birthday_gift: "",
    eid_al_fitr_gift: "",
    eid_al_adha_gift: "",
    health_insurance: "",
    expected_sponsorship_amount: "",
    total_amount: "",
    total_education_expenses: "",
    disabled_parent_cnic_doc: [],
    b_form_doc: [],
    disabled_parent_photo: null,
    child_photo: null,
    school_record: null,
    proof_of_address: null,
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
      ).toFixed(2);

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
  }, [
    formData.admission_fee_of_the_program,
    formData.total_fee_of_the_program,
    formData.living_expenses,
    formData.food_and_necessities_expenses,
    formData.transport_amount,
    formData.other_amount,
  ]);

  const handleFileChange = (e, field) => {
    const files = e.target.files;
    if (field === "disabled_parent_cnic_doc" || field === "b_form_doc") {
      setFormData((prevData) => ({
        ...prevData,
        [field]: [...prevData[field], ...Array.from(files)],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [field]: files[0],
      }));
    }

    // Clear the error for this field
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleRemoveFile = (field, index = null) => {
    if (index !== null) {
      // For multi-file fields
      setFormData((prevData) => ({
        ...prevData,
        [field]: prevData[field].filter((_, i) => i !== index),
      }));
    } else {
      // For single file fields
      setFormData((prevData) => ({
        ...prevData,
        [field]: null,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      if (name === "disabled_parent_cnic_doc" || name === "b_form_doc") {
        handleFileChange(e, name);
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: files[0],
        }));
      }
    } else if (name === "student") {
      const selectedStudent = students.find((student) => student.id === value);
      if (selectedStudent) {
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
      const error = validateField(name, value);
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));

      setFormData({
        ...formData,
        [name]: value,
      });

      if (name === "date_of_birth" && !error && value) {
        const selectedDate = new Date(value);
        if (!isNaN(selectedDate.getTime())) {
          const today = new Date();
          const ageInMilliseconds = today - selectedDate;
          const ageInYears = Math.floor(
            ageInMilliseconds / (1000 * 60 * 60 * 24 * 365)
          );
          setFormData((prevData) => ({
            ...prevData,
            age: ageInYears.toString(),
          }));
        }
      }
    }
  };

  const handleViewFileDetails = (file) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate document fields
    const documentErrors = {};
    const documentFields = getFieldsForTab(6);

    documentFields.forEach((fieldName) => {
      if (
        fieldName === "disabled_parent_cnic_doc" ||
        fieldName === "b_form_doc"
      ) {
        if (formData[fieldName].length === 0) {
          documentErrors[fieldName] = "Please upload at least one file";
        }
      } else {
        if (!formData[fieldName]) {
          documentErrors[fieldName] = "Please upload a file";
        }
      }
    });

    if (Object.keys(documentErrors).length > 0) {
      setFormErrors((prev) => ({ ...prev, ...documentErrors }));
      setLoading(false);
      return;
    }

    const degreeFormError = validateDegreeForm();
    if (degreeFormError !== "") {
      setLoading(false);
      setAlert({
        severity: "error",
        message: degreeFormError,
      });
      return;
    }

    const formDataObject = new FormData();

    // Append non-file fields
    Object.entries(formData).forEach(([key, value]) => {
      if (
        key !== "disabled_parent_cnic_doc" &&
        key !== "b_form_doc" &&
        key !== "disabled_parent_photo" &&
        key !== "child_photo" &&
        key !== "school_record" &&
        key !== "proof_of_address"
      ) {
        formDataObject.append(key, value);
      }
    });

    // Append multi-file fields
    ["disabled_parent_cnic_doc", "b_form_doc"].forEach((field) => {
      formData[field].forEach((file) => {
        formDataObject.append(field, file);
      });
    });

    // Append single file fields
    [
      "disabled_parent_photo",
      "child_photo",
      "school_record",
      "proof_of_address",
    ].forEach((field) => {
      if (formData[field]) {
        formDataObject.append(field, formData[field]);
      }
    });

    try {
      const response = await fetch(
        `${BASE_URL}/api/create-application-by-admin/`,
        {
          method: "POST",
          // headers: {
          //   Authorization: `Token ${localStorage.getItem("token")}`,
          // },
          body: formDataObject,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const updatedDegreeForm = degreeForm.map((degree) => ({
          ...degree,
          application: data.application_id,
        }));

        const degreeResponse = await fetch(`${BASE_URL}/api/create-degree/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //   Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            application_id: data.application_id,
            degrees: updatedDegreeForm,
          }),
        });

        if (degreeResponse.ok) {
          setAlert({
            severity: "success",
            message: "Application Created successfully!",
          });
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        } else {
          const degreeErrorData = await degreeResponse.json();
          console.error("Degree creation error:", degreeErrorData);
          setAlert({
            severity: "error",
            message: "Failed to create education records",
          });
        }
      } else {
        const errorData = await response.json();
        let errorMessage = "An error occurred while processing your request.";

        if (errorData && typeof errorData === "object") {
          errorMessage = Object.entries(errorData)
            .map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
            )
            .join("<br>");
        }

        setAlert({
          severity: "error",
          message: <div dangerouslySetInnerHTML={{ __html: errorMessage }} />,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({
        severity: "error",
        message: "An error occurred while processing your request.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <FormPaper elevation={0}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="#1e293b"
          align="center"
          gutterBottom
        >
          <Grow in={true} timeout={500}>
            <Box sx={{ fontSize: 20 }}>Add Application</Box>
          </Grow>
        </Typography>

        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <StyledTab label="Personal Information" />
          <StyledTab label="Contact Information" />
          <StyledTab label="Household Information" />
          <StyledTab label="Education Program" />
          <StyledTab label="Cost Of Program" />
          <StyledTab
            label="Enrollment Status
"
          />
          <StyledTab label="Documents" />
        </StyledTabs>

        <Box sx={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Fade in={activeTab === 0} timeout={500}>
              <div>
                {/* personal tab */}
                {activeTab === 0 && (
                  <CardAnimation>
                    <Paper sx={{ padding: 3, borderRadius: 3, mb: 3 }}>
                      <SectionTitle variant="h6">
                        Personal Information
                      </SectionTitle>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormTextField
                            select
                            label="Select Student"
                            variant="outlined"
                            name="student"
                            value={formData.student}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!formErrors.student}
                            helperText={formErrors.student}
                          >
                            {students.map((student) => (
                              <MenuItem key={student.id} value={student.id}>
                                {student.student_name} {student.last_name}
                              </MenuItem>
                            ))}
                          </FormTextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormTextField
                            label="First name"
                            variant="outlined"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            sx={{
                              padding: "0px 0px",
                            }}
                            fullWidth
                            required
                            InputProps={{
                              readOnly: true,
                            }}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormTextField
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
                            error={!!formErrors.last_name}
                            helperText={formErrors.last_name}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormTextField
                            label="Father's Name"
                            variant="outlined"
                            name="father_name"
                            value={formData.father_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!formErrors.father_name}
                            helperText={formErrors.father_name}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>Gender</InputLabel>
                          <FormTextField
                            label="Gender"
                            variant="outlined"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            select
                            fullWidth
                            required
                            error={!!formErrors.gender}
                            helperText={formErrors.gender}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </FormTextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>
                            Date of Birth <span>*</span>
                          </InputLabel>
                          <FormTextField
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
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormTextField
                            label="age"
                            disabled
                            variant="outlined"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            style={formFieldStyle}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </CardAnimation>
                )}
              </div>
            </Fade>

            <Slide
              direction="left"
              in={activeTab === 1}
              mountOnEnter
              unmountOnExit
            >
              <div>
                {activeTab === 1 && (
                  <CardAnimation>
                    <Paper sx={{ padding: 3, borderRadius: 3, mb: 3 }}>
                      <SectionTitle variant="h6">
                        Contact Information
                      </SectionTitle>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Country"
                            variant="outlined"
                            name="country"
                            defaultValue="Pakistan"
                            onChange={handleChange}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
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
                            error={!!formErrors.province}
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
                            error={!!formErrors.city_of_origin}
                            helperText={formErrors.city_of_origin}
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
                            error={!!formErrors.city}
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
                            error={!!formErrors.mobile_no}
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
                            error={!!formErrors.cnic_or_b_form}
                            helperText={formErrors.cnic_or_b_form}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Email (optional)"
                            variant="outlined"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            // InputProps={{
                            //   readOnly: true,
                            // }}
                            error={!!formErrors.email}
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
                            error={!!formErrors.village}
                            helperText={formErrors.village}
                            style={{
                              display:
                                formData.province === "Kashmir" ||
                                formData.province ===
                                  "Islamabad Capital Territory"
                                  ? "none"
                                  : "block",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <TextField
                            label="Permanent Address"
                            variant="outlined"
                            name="address"
                            multiline
                            rows={3}
                            value={formData.address}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!formErrors.address}
                            helperText={formErrors.address}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </CardAnimation>
                )}
              </div>
            </Slide>

            <Slide
              direction="left"
              in={activeTab === 2}
              mountOnEnter
              unmountOnExit
            >
              <div>
                {activeTab === 2 && (
                  <CardAnimation>
                    <Paper sx={{ padding: 3, borderRadius: 3, mb: 3 }}>
                      <SectionTitle variant="h6">
                        Household Information
                      </SectionTitle>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Father Full Name"
                            variant="outlined"
                            name="father_full_name"
                            value={formData.father_full_name}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.father_full_name}
                            helperText={formErrors.father_full_name}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Father Education"
                            variant="outlined"
                            name="father_education"
                            value={formData.father_education}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.father_education}
                            helperText={formErrors.father_education}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Father Occupatin"
                            variant="outlined"
                            name="father_occupatoin"
                            value={formData.father_occupatoin}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.father_occupatoin}
                            helperText={formErrors.father_occupatoin}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Mother Name"
                            variant="outlined"
                            name="mother_name"
                            value={formData.mother_name}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.mother_name}
                            helperText={formErrors.mother_name}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Mother Education"
                            variant="outlined"
                            name="mother_education"
                            value={formData.mother_education}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.mother_education}
                            helperText={formErrors.mother_education}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Mother Occupation"
                            variant="outlined"
                            name="mother_occupation"
                            value={formData.mother_occupation}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.mother_occupation}
                            helperText={formErrors.mother_occupation}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Disabled Parent Name"
                            variant="outlined"
                            name="disabled_parent_name"
                            value={formData.disabled_parent_name}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.disabled_parent_name}
                            helperText={formErrors.disabled_parent_name}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Disabled Parent CNIC"
                            variant="outlined"
                            name="disabled_parent_cnic"
                            value={formData.disabled_parent_cnic}
                            onChange={handleChange}
                            fullWidth
                            type="number"
                            error={!!formErrors.disabled_parent_cnic}
                            helperText={formErrors.disabled_parent_cnic}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Disability Nature"
                            variant="outlined"
                            name="disability_nature"
                            value={formData.disability_nature}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.disability_nature}
                            helperText={formErrors.disability_nature}
                          />
                        </Grid>{" "}
                        {/* <Grid item xs={12} sm={6}>
                          <TextField
                            label="Occupation"
                            variant="outlined"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.occupation}
                            helperText={formErrors.occupation}
                          />
                        </Grid>{" "} */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Household Income"
                            variant="outlined"
                            name="household_income"
                            type="number"
                            value={formData.household_income}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.household_income}
                            helperText={formErrors.household_income}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Total Members of Household"
                            variant="outlined"
                            name="number_of_siblings"
                            type="number"
                            value={formData.number_of_siblings}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.number_of_siblings}
                            helperText={formErrors.number_of_siblings}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Has Medical Condition"
                            variant="outlined"
                            name="has_medical_condition"
                            value={formData.has_medical_condition}
                            onChange={handleChange}
                            select
                            fullWidth
                            required
                            error={!!formErrors.has_medical_condition}
                            helperText={formErrors.has_medical_condition}
                          >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <TextField
                            label="Medical Condition Details"
                            variant="outlined"
                            name="medical_condition_details"
                            value={formData.medical_condition_details}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            error={!!formErrors.medical_condition_details}
                            helperText={formErrors.medical_condition_details}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </CardAnimation>
                )}
              </div>
            </Slide>

            <Slide
              direction="left"
              in={activeTab === 3}
              mountOnEnter
              unmountOnExit
            >
              <div>
                {activeTab === 3 && (
                  <CardAnimation>
                    <Paper sx={{ padding: 3, borderRadius: 3, mb: 3 }}>
                      <SectionTitle variant="h6">
                        Education Program
                      </SectionTitle>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>Class Interested In</InputLabel>
                          <TextField
                            variant="outlined"
                            name="grade_interested_in"
                            value={formData.grade_interested_in}
                            onChange={handleChange}
                            select
                            fullWidth
                            error={!!formErrors.grade_interested_in}
                            helperText={formErrors.grade_interested_in}
                          >
                            {[...Array(10)].map((_, index) => (
                              <MenuItem key={index + 1} value={index + 1}>
                                Class {index + 1}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>Current Grade</InputLabel>
                          <TextField
                            variant="outlined"
                            name="current_grade"
                            value={formData.current_grade}
                            onChange={handleChange}
                            select
                            fullWidth
                            error={!!formErrors.current_grade}
                            helperText={formErrors.current_grade}
                          >
                            {[...Array(10)].map((_, index) => (
                              <MenuItem key={index + 1} value={index + 1}>
                                Class {index + 1}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>Current School Name</InputLabel>
                          <TextField
                            variant="outlined"
                            name="current_school"
                            value={formData.current_school}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.current_school}
                            helperText={formErrors.current_school}
                          ></TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>School Interested In</InputLabel>
                          <TextField
                            variant="outlined"
                            name="school_interested_in"
                            value={formData.school_interested_in}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.school_interested_in}
                            helperText={formErrors.school_interested_in}
                          ></TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>School Address</InputLabel>
                          <TextField
                            variant="outlined"
                            name="school_address"
                            value={formData.school_address}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.school_address}
                            helperText={formErrors.school_address}
                          ></TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>
                            Classes Commencement Date<span>*</span>
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
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>
                            Addmission Fee<span>*</span>
                          </InputLabel>
                          <TextField
                            label="Admission Fee"
                            variant="outlined"
                            name="admission_fee_of_the_program"
                            required
                            type="number"
                            value={formData.admission_fee_of_the_program}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.admission_fee_of_the_program}
                            helperText={formErrors.admission_fee_of_the_program}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <InputLabel shrink>
                            Monthly Fee<span>*</span>
                          </InputLabel>
                          <TextField
                            label="Monthly Tution Fee"
                            variant="outlined"
                            name="total_fee_of_the_program"
                            type="number"
                            required
                            value={formData.total_fee_of_the_program}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.total_fee_of_the_program}
                            helperText={formErrors.total_fee_of_the_program}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <InputLabel shrink>Career Aspirations </InputLabel>
                          <TextField
                            variant="outlined"
                            name="career_aspirations"
                            value={formData.career_aspirations}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            error={!!formErrors.career_aspirations}
                            helperText={formErrors.career_aspirations}
                          ></TextField>
                        </Grid>
                      </Grid>
                    </Paper>
                  </CardAnimation>
                )}
              </div>
            </Slide>

            <Slide
              direction="left"
              in={activeTab === 4}
              mountOnEnter
              unmountOnExit
            >
              <div>
                {activeTab === 4 && (
                  <CardAnimation>
                    <Paper sx={{ padding: 3, borderRadius: 3, mb: 3 }}>
                      <SectionTitle variant="h6">Cost Of Program</SectionTitle>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Admission Fee"
                            variant="outlined"
                            name="admission_fee_of_the_program"
                            required
                            type="number"
                            value={formData.admission_fee_of_the_program}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.admission_fee_of_the_program}
                            helperText={formErrors.admission_fee_of_the_program}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Monthly Tution Fee"
                            variant="outlined"
                            name="total_fee_of_the_program"
                            type="number"
                            required
                            value={formData.total_fee_of_the_program}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.total_fee_of_the_program}
                            helperText={formErrors.total_fee_of_the_program}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Uniform Cost"
                            variant="outlined"
                            name="living_expenses"
                            type="number"
                            value={formData.living_expenses}
                            onChange={handleChange}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Books and Supplies"
                            variant="outlined"
                            name="food_and_necessities_expenses"
                            type="number"
                            value={formData.food_and_necessities_expenses}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.food_and_necessities_expenses}
                            helperText={
                              formErrors.food_and_necessities_expenses
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Transport Amount (Per month)"
                            variant="outlined"
                            name="transport_amount"
                            type="number"
                            value={formData.transport_amount}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.transport_amount}
                            helperText={formErrors.transport_amount}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Other Amount"
                            variant="outlined"
                            name="other_amount"
                            type="number"
                            value={formData.other_amount}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.other_amount}
                            helperText={formErrors.other_amount}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Birthday Gift"
                            variant="outlined"
                            name="birthday_gift"
                            type="number"
                            value={formData.birthday_gift}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.birthday_gift}
                            helperText={formErrors.birthday_gift}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Eid_al_Fitr Gift"
                            variant="outlined"
                            name="eid_al_fitr_gift"
                            type="number"
                            value={formData.eid_al_fitr_gift}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.eid_al_fitr_gift}
                            helperText={formErrors.eid_al_fitr_gift}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Eid_al_Adha Gift"
                            variant="outlined"
                            name="eid_al_adha_gift"
                            type="number"
                            value={formData.eid_al_adha_gift}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.eid_al_adha_gift}
                            helperText={formErrors.eid_al_adha_gift}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Health Insurance"
                            variant="outlined"
                            name="health_insurance"
                            type="number"
                            value={formData.health_insurance}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.health_insurance}
                            helperText={formErrors.health_insurance}
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
                            error={!!formErrors.expected_sponsorship_amount}
                            helperText={formErrors.expected_sponsorship_amount}
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
                            error={!!formErrors.total_education_expenses}
                            helperText={formErrors.total_education_expenses}
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
                  </CardAnimation>
                )}
              </div>
            </Slide>

            <Slide
              direction="left"
              in={activeTab === 5}
              mountOnEnter
              unmountOnExit
            >
              <div>
                {activeTab === 5 && (
                  <CardAnimation>
                    <Paper sx={{ padding: 3, borderRadius: 3, mb: 3 }}>
                      <SectionTitle variant="h6">
                        Enrollment Status
                      </SectionTitle>

                      {degreeForm.map((degree, index) => (
                        <Grid
                          container
                          spacing={2}
                          key={index}
                          sx={{
                            marginBottom: 2,
                            padding: 1,
                            border: "1px solid #ccc",
                            borderRadius: 2,
                          }}
                        >
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Class"
                              variant="outlined"
                              name="degree_name"
                              value={degree.degree_name}
                              onChange={(e) => handleDegreeChange(e, index)}
                              fullWidth
                              select
                              required
                              error={!!formErrors[`degree_${index}_name`]}
                              helperText={
                                formErrors[`degree_${index}_name`] || ""
                              }
                            >
                              {[...Array(10)].map((_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                  Class {i + 1}
                                </MenuItem>
                              ))}
                            </TextField>
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
                              error={!!formErrors[`degree_${index}_status`]}
                              helperText={
                                formErrors[`degree_${index}_status`] || ""
                              }
                            >
                              <MenuItem value="In Progress">
                                In Progress
                              </MenuItem>
                              <MenuItem value="Completed">Completed</MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="School Name"
                              variant="outlined"
                              name="institute_name"
                              value={degree.institute_name}
                              onChange={(e) => handleDegreeChange(e, index)}
                              fullWidth
                              required
                              error={
                                !!formErrors[`degree_${index}_institute_name`]
                              }
                              helperText={
                                formErrors[`degree_${index}_institute_name`] ||
                                ""
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              label="Marks"
                              variant="outlined"
                              name="grade"
                              value={degree.grade}
                              onChange={(e) => handleDegreeChange(e, index)}
                              fullWidth
                              required
                              error={!!formErrors[`degree_${index}_grade`]}
                              helperText={
                                formErrors[`degree_${index}_grade`] || ""
                              }
                            />
                          </Grid>
                          {index > 0 && (
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              sx={{ textAlign: "right" }}
                            >
                              <Button
                                variant="text"
                                color="error"
                                onClick={() => removeDegree(index)}
                              >
                                Remove
                              </Button>
                            </Grid>
                          )}
                        </Grid>
                      ))}
                      <Button
                        variant="outlined"
                        onClick={addDegree}
                        sx={{ marginTop: 2 }}
                      >
                        Add Class
                      </Button>
                    </Paper>
                  </CardAnimation>
                )}
              </div>
            </Slide>
            <Slide
              direction="left"
              in={activeTab === 6}
              mountOnEnter
              unmountOnExit
            >
              <div>
                {activeTab === 6 && (
                  <CardAnimation>
                    <Paper sx={{ padding: 3, borderRadius: 3, mb: 3 }}>
                      <SectionTitle variant="h6">Documents</SectionTitle>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>
                            Disabled Parent CNIC Doc <span>*</span>
                          </InputLabel>
                          <input
                            type="file"
                            name="disabled_parent_cnic_doc"
                            accept=".pdf, .jpeg, .jpg, .png, .docx"
                            onChange={(e) =>
                              handleFileChange(e, "disabled_parent_cnic_doc")
                            }
                            multiple
                            style={formFieldStyle}
                          />
                          {formData.disabled_parent_cnic_doc.map(
                            (file, index) => (
                              <div key={index} style={{ marginTop: "8px" }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleViewFileDetails(file)}
                                >
                                  View File {index + 1}
                                </Button>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleRemoveFile(
                                      "disabled_parent_cnic_doc",
                                      index
                                    )
                                  }
                                  sx={{ color: "red", marginLeft: 1 }}
                                >
                                  Remove
                                </IconButton>
                              </div>
                            )
                          )}
                          {formErrors.disabled_parent_cnic_doc && (
                            <Typography color="error" variant="caption">
                              {formErrors.disabled_parent_cnic_doc}
                            </Typography>
                          )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>
                            B-Form Doc <span>*</span>
                          </InputLabel>
                          <input
                            type="file"
                            name="b_form_doc"
                            accept=".pdf, .jpeg, .jpg, .png, .docx"
                            onChange={(e) => handleFileChange(e, "b_form_doc")}
                            multiple
                            style={formFieldStyle}
                          />
                          {formData.b_form_doc.map((file, index) => (
                            <div key={index} style={{ marginTop: "8px" }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleViewFileDetails(file)}
                              >
                                View File {index + 1}
                              </Button>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleRemoveFile("b_form_doc", index)
                                }
                                sx={{ color: "red", marginLeft: 1 }}
                              >
                                Remove
                              </IconButton>
                            </div>
                          ))}
                          {formErrors.b_form_doc && (
                            <Typography color="error" variant="caption">
                              {formErrors.b_form_doc}
                            </Typography>
                          )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>
                            Disabled Parent Photo <span>*</span>
                          </InputLabel>
                          <input
                            type="file"
                            name="disabled_parent_photo"
                            accept=".jpeg, .jpg, .png"
                            onChange={handleChange}
                            style={formFieldStyle}
                          />
                          {formData.disabled_parent_photo && (
                            <div style={{ marginTop: "8px" }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() =>
                                  handleViewFileDetails(
                                    formData.disabled_parent_photo
                                  )
                                }
                              >
                                View File
                              </Button>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleRemoveFile("disabled_parent_photo")
                                }
                                sx={{ color: "red", marginLeft: 1 }}
                              >
                                Remove
                              </IconButton>
                            </div>
                          )}
                          {formErrors.disabled_parent_photo && (
                            <Typography color="error" variant="caption">
                              {formErrors.disabled_parent_photo}
                            </Typography>
                          )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>
                            Child Photo <span>*</span>
                          </InputLabel>
                          <input
                            type="file"
                            name="child_photo"
                            accept=".jpeg, .jpg, .png"
                            onChange={handleChange}
                            style={formFieldStyle}
                          />
                          {formData.child_photo && (
                            <div style={{ marginTop: "8px" }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() =>
                                  handleViewFileDetails(formData.child_photo)
                                }
                              >
                                View File
                              </Button>
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveFile("child_photo")}
                                sx={{ color: "red", marginLeft: 1 }}
                              >
                                Remove
                              </IconButton>
                            </div>
                          )}
                          {formErrors.child_photo && (
                            <Typography color="error" variant="caption">
                              {formErrors.child_photo}
                            </Typography>
                          )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>
                            School Record <span>*</span>
                          </InputLabel>
                          <input
                            type="file"
                            name="school_record"
                            accept=".jpeg, .jpg, .png"
                            onChange={handleChange}
                            style={formFieldStyle}
                          />
                          {formData.school_record && (
                            <div style={{ marginTop: "8px" }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() =>
                                  handleViewFileDetails(formData.school_record)
                                }
                              >
                                View File
                              </Button>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleRemoveFile("school_record")
                                }
                                sx={{ color: "red", marginLeft: 1 }}
                              >
                                Remove
                              </IconButton>
                            </div>
                          )}
                          {formErrors.school_record && (
                            <Typography color="error" variant="caption">
                              {formErrors.school_record}
                            </Typography>
                          )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>
                            Proof Of Address <span>*</span>
                          </InputLabel>
                          <input
                            type="file"
                            name="proof_of_address"
                            accept=".jpeg, .jpg, .png"
                            onChange={handleChange}
                            style={formFieldStyle}
                          />
                          {formData.proof_of_address && (
                            <div style={{ marginTop: "8px" }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() =>
                                  handleViewFileDetails(
                                    formData.proof_of_address
                                  )
                                }
                              >
                                View File
                              </Button>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleRemoveFile("proof_of_address")
                                }
                                sx={{ color: "red", marginLeft: 1 }}
                              >
                                Remove
                              </IconButton>
                            </div>
                          )}
                          {formErrors.proof_of_address && (
                            <Typography color="error" variant="caption">
                              {formErrors.proof_of_address}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Paper>
                  </CardAnimation>
                )}
              </div>
            </Slide>
            <Box
              sx={{
                mt: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <SecondaryButton disabled={activeTab === 0} onClick={handleBack}>
                Back
              </SecondaryButton>
              {activeTab < 6 ? (
                <PrimaryButton onClick={handleContinue}>Continue</PrimaryButton>
              ) : (
                <PrimaryButton
                  type="submit"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : null
                  }
                >
                  Submit Application
                </PrimaryButton>
              )}
            </Box>
          </form>
        </Box>
      </FormPaper>

      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        TransitionComponent={Zoom}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseAlert}
          severity={alert?.severity}
          sx={{ borderRadius: "8px" }}
        >
          {alert?.message}
        </MuiAlert>
      </Snackbar>
    </StyledContainer>
  );
};

export default ApplicationForm;
