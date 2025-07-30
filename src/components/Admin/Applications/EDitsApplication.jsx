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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { styled, keyframes } from "@mui/system";

// Define custom animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

const EditApplicationForm = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [alert, setAlert] = useState(null);
  const [students, setStudents] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

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

    // Fetch application data
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
  }, [applicationId]);

  const handleCloseAlert = () => setAlert(null);

  const initialFormErrors = {
    student: "",
    name: "",
    father_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    age: "",
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
    mother_occupation: "",
    disabled_parent_name: "",
    disabled_parent_cnic: "",
    disability_nature: "",
    father_occupation: "",
    household_income: "",
    number_of_siblings: "",
    has_medical_condition: "",
    medical_condition_details: "",
    grade_interested_in: "",
    current_school: "",
    current_grade: "",
    school_interested_in: "",
    school_address: "",
    program_addmision_date: "",
    classes_commencement_date: "",
    career_aspirations: "",
    admission_fee_of_the_program: "",
    total_fee_of_the_program: "",
    disabled_parent_cnic_doc: "",
    b_form_doc: "",
    disabled_parent_photo: "",
    child_photo: "",
    // school_record: "",
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
    age: "",
    country: "Pakistan",
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
    mother_occupation: "",
    disabled_parent_name: "",
    disabled_parent_cnic: "",
    disability_nature: "",
    father_occupation: "",
    mother_occupation: "",
    household_income: "",
    number_of_siblings: "",
    has_medical_condition: "",
    medical_condition_details: "",
    grade_interested_in: "",
    current_school: "",
    current_grade: "",
    school_interested_in: "",
    school_address: "",
    program_addmision_date: "",
    classes_commencement_date: "",
    career_aspirations: "",
    admission_fee_of_the_program: "",
    total_fee_of_the_program: "",
    disabled_parent_cnic_doc: [],
    b_form_doc: [],
    disabled_parent_photo: null,
    child_photo: null,
    school_record: null,
    proof_of_address: null,
  });

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
          // "email",
          "village",
          "address",
        ];
      case 2:
        return [
          "father_full_name",
          "father_education",
          "mother_name",
          "mother_education",
          "mother_occupation",
          "disabled_parent_name",
          "disabled_parent_cnic",
          "disability_nature",
          "father_occupation",
          "household_income",
          "number_of_siblings",
          "has_medical_condition",
          "medical_condition_details",
        ];
      case 3:
        return [
          "grade_interested_in",
          "current_school",
          "current_grade",
          "school_interested_in",
          "school_address",
          "program_addmision_date",
          "classes_commencement_date",
          "career_aspirations",
          "admission_fee_of_the_program",
          "total_fee_of_the_program",
        ];
      case 4:
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
        return "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return "Invalid email address";
        }
        return "";
      case "mobile_no":
        const mobileRegex = /^[0-9]{11}$/;
        if (value && !mobileRegex.test(value)) {
          return "Invalid mobile number";
        }
        return "";
      case "cnic_or_b_form":
      case "disabled_parent_cnic":
        if (value && !/^[0-9]{13}$/.test(value)) {
          return "CNIC must be 13 digits";
        }
        return "";
      case "student":
      case "name":
      case "father_name":
      case "last_name":
      case "gender":
      case "province":
      case "city":
      case "city_of_origin":
      case "address":
      case "grade_interested_in":
      case "school_interested_in":
      case "program_addmision_date":
      case "classes_commencement_date":
        // Ensure value is a string before calling trim
        if (!value || (typeof value === "string" && !value.trim())) {
          return "This field is required";
        }
        return "";
      case "village":
        if (
          formData.province !== "Kashmir" &&
          formData.province !== "Islamabad Capital Territory" &&
          (!value || (typeof value === "string" && !value.trim()))
        ) {
          return "This field is required";
        }
        return "";
      case "admission_fee_of_the_program":
      case "total_fee_of_the_program":
      case "household_income":
      case "number_of_siblings":
        if (!value || isNaN(value) || parseFloat(value) < 0) {
          return "Please enter a valid non-negative number";
        }
        return "";
      case "disabled_parent_cnic_doc":
      case "b_form_doc":
        if (value.length === 0) {
          return "Please upload at least one file";
        }
        return "";
      case "disabled_parent_photo":
      case "child_photo":
      // case "school_record":
      case "proof_of_address":
        if (!value) {
          return "Please upload a file";
        }
        return "";
      case "has_medical_condition":
        if (value === "") {
          return "This field is required";
        }
        return "";
      default:
        return "";
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

    if (Object.keys(tabErrors).length > 0) {
      setFormErrors((prev) => ({ ...prev, ...tabErrors }));
    } else {
      setFormErrors(initialFormErrors);
      const totalTabs = 5;
      setActiveTab((prevTab) => Math.min(prevTab + 1, totalTabs - 1));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      if (name === "disabled_parent_cnic_doc" || name === "b_form_doc") {
        setFormData((prevData) => ({
          ...prevData,
          [name]: [...prevData[name], ...Array.from(files)],
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: files[0],
        }));
      }
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    } else if (name === "student") {
      const selectedStudent = students.find((student) => student.id === value);
      if (selectedStudent) {
        setFormData((prevData) => ({
          ...prevData,
          student: selectedStudent.id,
          name: selectedStudent?.student_name,
          father_name: selectedStudent.father_name,
          last_name: selectedStudent.last_name,
          gender: selectedStudent.gender,
          email: selectedStudent.email,
          cnic_or_b_form: selectedStudent.cnic,
        }));
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          student: "",
          name: "",
          father_name: "",
          last_name: "",
          gender: "",
          email: "",
          cnic_or_b_form: "",
        }));
      }
    } else {
      const error = validateField(name, value);
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

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
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            age: "",
          }));
        }
      }
    }
  };

  const handleFileChange = (e, field) => {
    const files = e.target.files;
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], ...Array.from(files)],
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleRemoveFile = (field, index = null) => {
    if (index !== null) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: prevData[field].filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [field]: null,
      }));
    }
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: validateField(field, index !== null ? formData[field] : null),
    }));
  };

  const handleViewFileDetails = (file) => {
    console.log(file);
    let url = "";

    if (file instanceof File) {
      // Local uploaded file
      url = URL.createObjectURL(file?.file);
    }

    if (url) {
      window.open(url, "_blank");
    } else {
      console.error("Invalid file format", file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const errors = {};
    getFieldsForTab(activeTab).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors((prev) => ({ ...prev, ...errors }));
      setLoading(false);
      return;
    }

    const formDataObject = new FormData();
    const skipIfEmpty = [
      "email",
      "health_insurance",
      "eid_al_adha_gift",
      "eid_al_fitr_gift",
      "birthday_gift",
    ];
    Object.entries(formData).forEach(([key, value]) => {
      if (
        key !== "disabled_parent_cnic_doc" &&
        key !== "b_form_doc" &&
        key !== "disabled_parent_photo" &&
        key !== "child_photo" &&
        key !== "school_record" &&
        key !== "proof_of_address"
      ) {
        if (skipIfEmpty.includes(key)) {
          if (value !== "" && value !== null && value !== undefined) {
            formDataObject.append(key, value);
          }
        } else {
          formDataObject.append(key, value);
        }
      }
    });

    ["disabled_parent_cnic_doc", "b_form_doc"].forEach((field) => {
      formData[field].forEach((file) => {
        formDataObject.append(field, file);
      });
    });

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
        `${BASE_URL}/api/applications/${applicationId}/`,
        {
          method: "PUT",
          body: formDataObject,
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setAlert({
          severity: "success",
          message: "Application updated successfully!",
        });
        setTimeout(() => {
          navigate(-1);
        }, 2000);
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
          <Box sx={{ fontSize: 20 }}>Edit Application</Box>
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
          <StyledTab label="Documents" />
        </StyledTabs>

        <Box sx={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Fade in={activeTab === 0} timeout={500}>
              <div>
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
                            InputProps={{
                              readOnly: true,
                            }}
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
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>Gender</InputLabel>
                          <FormTextField
                            variant="outlined"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            select
                            fullWidth
                            required
                            error={!!formErrors.gender}
                            helperText={formErrors.gender}
                            InputProps={{
                              readOnly: true,
                            }}
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
                            fullWidth
                            required
                            error={!!formErrors.date_of_birth}
                            helperText={formErrors.date_of_birth}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormTextField
                            label="Age"
                            variant="outlined"
                            name="age"
                            type="number"
                            value={formData.age}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                            error={!!formErrors.age}
                            helperText={formErrors.age}
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
                            label="Country"
                            variant="outlined"
                            name="country"
                            value="Pakistan"
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
                            label="Email (optional)"
                            variant="outlined"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
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
                            required={
                              formData.province !== "Kashmir" &&
                              formData.province !==
                                "Islamabad Capital Territory"
                            }
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
                            label="Father Occupation"
                            variant="outlined"
                            name="father_occupation"
                            value={formData.father_occupation}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.father_occupation}
                            helperText={formErrors.father_occupation}
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
                        </Grid>
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
                          <InputLabel shrink>
                            Grade / Class Applying for
                          </InputLabel>
                          <TextField
                            variant="outlined"
                            name="grade_interested_in"
                            value={formData.grade_interested_in}
                            onChange={handleChange}
                            select
                            fullWidth
                            required
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
                          <InputLabel shrink>Current School Name</InputLabel>
                          <TextField
                            variant="outlined"
                            name="current_school"
                            value={formData.current_school}
                            onChange={handleChange}
                            fullWidth
                            error={!!formErrors.current_school}
                            helperText={formErrors.current_school}
                          />
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
                          <InputLabel shrink>School Applying For</InputLabel>
                          <TextField
                            variant="outlined"
                            name="school_interested_in"
                            value={formData.school_interested_in}
                            onChange={handleChange}
                            fullWidth
                            required
                            error={!!formErrors.school_interested_in}
                            helperText={formErrors.school_interested_in}
                          />
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
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>
                            Program Admission Date<span>*</span>
                          </InputLabel>
                          <TextField
                            variant="outlined"
                            name="program_addmision_date"
                            type="date"
                            value={formData.program_addmision_date}
                            onChange={handleChange}
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
                            fullWidth
                            required
                            error={!!formErrors.classes_commencement_date}
                            helperText={formErrors.classes_commencement_date}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>
                            Admission Fee<span>*</span>
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
                        <Grid item xs={12} sm={6}>
                          <InputLabel shrink>
                            Monthly Fee<span>*</span>
                          </InputLabel>
                          <TextField
                            label="Monthly Tuition Fee"
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
                          <InputLabel shrink>Career Aspirations</InputLabel>
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
              in={activeTab === 4}
              mountOnEnter
              unmountOnExit
            >
              <div>
                {activeTab === 4 && (
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
                          <InputLabel shrink>School Record</InputLabel>
                          <input
                            type="file"
                            name="school_record"
                            accept=".jpeg, .jpg, .png"
                            onChange={handleChange}
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

              {activeTab < 4 && (
                <PrimaryButton onClick={handleContinue}>Continue</PrimaryButton>
              )}

              {activeTab === 4 && (
                <PrimaryButton
                  type="submit"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : null
                  }
                >
                  Update Application
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

export default EditApplicationForm;
