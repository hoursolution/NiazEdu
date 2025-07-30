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
  FormControlLabel,
  Checkbox,
  Input,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const EditApplicationForm = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL =
    "https://niazeducationscholarshipsbackend-production.up.railway.app";
  // const [formData, setFormData] = useState({});
  // Inside your component function
  const [newDegreeDocument, setNewDegreeDocument] = useState(null);
  const [newTranscriptDocument, setNewTranscriptDocument] = useState(null);
  const [newIncomeStatementDocument, setNewIncomeStatementDocument] =
    useState(null);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    verification_required: false,
    student: "", // Set default value to empty string if applicationData is null
    name: "",
    father_name: "",
    last_name: "",
    gender: "",
    age: "",
    date_of_birth: "",
    province: "",
    city: "",
    mobile_no: "",
    cnic_or_b_form: "",
    email: "",
    village: "",
    address: "",
    current_level_of_education: "",
    institution_interested_in: "",
    admission_fee_of_the_program: "",
    total_fee_of_the_program: "",
    account_expenses: "",
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
    program_interested_in: "",
    degree_document: null,
    transcript_document: null,
    income_statement_document: null,
    profile_picture: null,
    degree: [],
  });

  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);

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

    // Fetch programs
    fetch(`${BASE_URL}/programs/`)
      .then((response) => response.json())
      .then((data) => {
        setPrograms(data);
      })
      .catch((error) => {
        console.error("Error fetching programs:", error);
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
        } else {
          console.error("Failed to fetch application data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchApplicationData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Handle file inputs separately
    if (type === "file") {
      // Check if it's an existing file input or a new file input
      if (formData.hasOwnProperty(name)) {
        // If it's an existing file input, update formData directly
        setFormData({
          ...formData,
          [name]: files[0], // Assuming you are allowing only one file per input
        });
      } else {
        // If it's a new file input, store the file in a separate state variable
        switch (name) {
          case "new_degree_document":
            setNewDegreeDocument(files[0]);
            break;
          case "new_transcript_document":
            setNewTranscriptDocument(files[0]);
            break;
          case "new_income_statement_document":
            setNewIncomeStatementDocument(files[0]);
            break;
          case "new_profile_picture":
            setNewProfilePicture(files[0]);
            break;
          default:
            break;
        }
      }
    } else if (name === "program_interested_in") {
      setFormData({
        ...formData,
        [name]: value, // value here should be an array of selected program IDs
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const updatedFormData = new FormData(formData); // Create a copy of the existing FormData

    if (files.length > 0) {
      updatedFormData.set(name, files[0]); // Set the new file in the FormData
    } else {
      updatedFormData.delete(name); // Remove the file if no new file is selected
    }

    // Update the state with the new FormData object
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObject = new FormData();

    // Append non-file data to formDataObject
    Object.entries(formData).forEach(([key, value]) => {
      if (
        key !== "degree_document" &&
        key !== "transcript_document" &&
        key !== "income_statement_document" &&
        key !== "profile_picture"
      ) {
        formDataObject.append(key, value);
      }
    });

    // Append existing file data if available
    if (formData.degree_document) {
      formDataObject.append("degree_document", formData.degree_document);
    }
    if (formData.transcript_document) {
      formDataObject.append(
        "transcript_document",
        formData.transcript_document
      );
    }
    if (formData.income_statement_document) {
      formDataObject.append(
        "income_statement_document",
        formData.income_statement_document
      );
    }
    if (formData.profile_picture) {
      formDataObject.append("profile_picture", formData.profile_picture);
    }

    // Append new file data if available
    if (newDegreeDocument) {
      formDataObject.append("new_degree_document", newDegreeDocument);
    }
    if (newTranscriptDocument) {
      formDataObject.append("new_transcript_document", newTranscriptDocument);
    }
    if (newIncomeStatementDocument) {
      formDataObject.append(
        "new_income_statement_document",
        newIncomeStatementDocument
      );
    }
    if (newProfilePicture) {
      formDataObject.append("new_profile_picture", newProfilePicture);
    }

    console.log(formDataObject);

    try {
      const response = await fetch(
        `${BASE_URL}/api/application/${applicationId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: formDataObject,
        }
      );

      console.log(response.status); // Log the HTTP status for debugging

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        // Perform any actions upon successful submission
      } else {
        console.log(formDataObject);
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [degreeForm, setDegreeForm] = useState([
    {
      application: applicationId,
      degree_name: "",
      status: "",
      institute_name: "",
      grade: "",
    },
  ]);
  const handleDegreeChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDegreeForm = [...degreeForm];
    updatedDegreeForm[index] = {
      ...updatedDegreeForm[index],
      [name]: value,
      application: applicationId, // Set the application id for the degree
    };
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

  const handleContinue = () => {
    setActiveTab((prevTab) => Math.min(prevTab + 1, 8)); // Adjust the upper limit based on the number of tabs
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="mr-1 h-screen"
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            marginTop: 1,
          }}
        >
          // Inside the return statement where Tabs are rendered
          <Tab
            label="Status & Verification"
            sx={{
              backgroundColor: "#12b4bf",
              // color: "black",
              borderTopRightRadius: "5px",
            }}
          />
          <Tab
            label="Personal Information"
            sx={{
              backgroundColor: "#12b4bf",
              borderTopLeftRadius: "5px",
              // color: "white",
            }}
          />
          <Tab
            label="Contact Information"
            sx={{
              backgroundColor: "#12b4bf",
              // color: "white",
            }}
          />
          <Tab
            label="Education Information"
            sx={{
              backgroundColor: "#12b4bf",
              // color: "white",
            }}
          />
          <Tab
            label="Financial Information"
            sx={{
              backgroundColor: "#12b4bf",
              // color: "white",
            }}
          />
          <Tab
            label="Household Information"
            sx={{
              backgroundColor: "#12b4bf",
              // color: "white",
            }}
          />
          <Tab
            label="Personal Statement"
            sx={{
              backgroundColor: "#12b4bf",
              // color: "white",
            }}
          />
          <Tab
            label="Document Uploads"
            sx={{
              backgroundColor: "#12b4bf",
              // color: "black",
              borderTopRightRadius: "5px",
            }}
          />
          <Tab
            label="Degrees"
            sx={{
              backgroundColor: "#12b4bf",
              // color: "black",
              borderTopRightRadius: "5px",
            }}
          />
        </Tabs>
        {activeTab === 0 && (
          <Paper style={paperStyle}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Status"
                  variant="outlined"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Accepted">Accepted</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.verification_required}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          verification_required: e.target.checked,
                        })
                      }
                      name="verification_required"
                    />
                  }
                  label="Verification Required"
                />
              </Grid>
            </Grid>
          </Paper>
        )}
        {activeTab === 1 && (
          <Paper style={paperStyle}>
            {/* Personal Information Fields */}
            {/* ... */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Student</InputLabel>
                <TextField
                  select
                  label="Select Student"
                  variant="outlined"
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  fullWidth
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.student_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                {<InputLabel shrink>Name</InputLabel>}
                <TextField
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  sx={{
                    // fontSize: "3px",
                    padding: "0px 0px",
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Father Name"
                  variant="outlined"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  fullWidth
                  sx={{ padding: "8px" }}
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {<InputLabel shrink>Gender</InputLabel>}
                <TextField
                  // label="Gender"
                  variant="outlined"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={formFieldStyle}
                  select
                  // required
                  fullWidth
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Date of Birth</InputLabel>
                <TextField
                  variant="outlined"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  style={formFieldStyle}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Age</InputLabel>
                <TextField
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
        {activeTab === 2 && (
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
                >
                  <MenuItem value="Punjab">Punjab</MenuItem>
                  <MenuItem value="Sindh">Sindh</MenuItem>
                  <MenuItem value="Khyber Pakhtunkhwa">
                    Khyber Pakhtunkhwa
                  </MenuItem>
                  <MenuItem value="Balochistan">Balochistan</MenuItem>
                  <MenuItem value="Gilgit-Baltistan">Gilgit-Baltistan</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  variant="outlined"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
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
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Village"
                  variant="outlined"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  fullWidth
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
                />
              </Grid>
            </Grid>
          </Paper>
        )}
        {activeTab === 3 && (
          <Paper style={paperStyle}>
            {/* Education Information Fields */}
            {/* ... */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Current Level of Education"
                  variant="outlined"
                  name="current_level_of_education"
                  value={formData.current_level_of_education}
                  onChange={handleChange}
                  select
                  fullWidth
                >
                  <MenuItem value="Primary School">Primary School</MenuItem>
                  <MenuItem value="Secondary School">Secondary School</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="O levels">O levels</MenuItem>
                  <MenuItem value="A levels">A levels</MenuItem>
                  <MenuItem value="Metrics">Metrics</MenuItem>
                  <MenuItem value="FSC">FSC</MenuItem>
                  <MenuItem value="Bachelors Degree">Bachelors Degree</MenuItem>
                  <MenuItem value="Masters">Masters</MenuItem>
                  <MenuItem value="Diploma / Certificate">
                    {" "}
                    Diploma / Certificate
                  </MenuItem>
                  <MenuItem value="Other ">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Program Interested In</InputLabel>
                <TextField
                  select
                  label="Select Program"
                  variant="outlined"
                  name="program_interested_in"
                  value={formData.program_interested_in.id}
                  onChange={handleChange}
                  fullWidth
                >
                  {programs.map((program) => (
                    <MenuItem key={program.id} value={program.id}>
                      {program.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Institution Interested In"
                  variant="outlined"
                  name="institution_interested_in"
                  value={formData.institution_interested_in}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>
        )}
        {activeTab === 4 && (
          <Paper style={paperStyle}>
            {/* Financial Information Fields */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Admission Fee of the Program"
                  variant="outlined"
                  name="admission_fee_of_the_program"
                  type="number"
                  value={formData.admission_fee_of_the_program}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total Fee of the Program"
                  variant="outlined"
                  name="total_fee_of_the_program"
                  type="number"
                  value={formData.total_fee_of_the_program}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Account Expenses"
                  variant="outlined"
                  name="account_expenses"
                  type="number"
                  value={formData.account_expenses}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Living Expenses"
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
                  label="Food and Necessities Expenses"
                  variant="outlined"
                  name="food_and_necessities_expenses"
                  type="number"
                  value={formData.food_and_necessities_expenses}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Transport Amount"
                  variant="outlined"
                  name="transport_amount"
                  type="number"
                  value={formData.transport_amount}
                  onChange={handleChange}
                  fullWidth
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
                />
              </Grid>
            </Grid>
          </Paper>
        )}
        {activeTab === 5 && (
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Members Earning"
                  variant="outlined"
                  name="members_earning"
                  type="number"
                  value={formData.members_earning}
                  onChange={handleChange}
                  fullWidth
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Description of Household"
                  variant="outlined"
                  name="description_of_household"
                  multiline
                  rows={3}
                  value={formData.description_of_household}
                  onChange={handleChange}
                  fullWidth
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
                />
              </Grid>
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
                  helperText="Please share your personal and family background, your past education, your financial situation, why do you believe you deserve the sponsorship and your future plans and ambitions"
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
                <InputLabel shrink>Degree Document</InputLabel>
                <input
                  type="file"
                  name="degree_document"
                  onChange={handleFileChange}
                />
                {/* Display existing document if available */}
                {formData?.degree_document && (
                  <Typography>
                    <a
                      href={formData.degree_document}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Degree Document
                    </a>
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Transcript Document</InputLabel>
                <input
                  type="file"
                  name="transcript_document"
                  onChange={handleFileChange}
                />
                {/* <Input
                  type="file"
                  onChange={handleChange}
                  name="transcript_document"
                  multiple={false}
                  fullWidth
                /> */}
                {/* Display existing document if available */}
                {formData?.transcript_document && (
                  <Typography>
                    <a
                      href={formData.transcript_document}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Transcript Document
                    </a>
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Income Statement Document</InputLabel>
                <input
                  type="file"
                  name="income_statement_document"
                  onChange={handleFileChange}
                />
                {/* <Input
                  type="file"
                  onChange={handleChange}
                  name="income_statement_document"
                  multiple={false}
                  fullWidth
                /> */}
                {/* Display existing document if available */}
                {formData?.income_statement_document && (
                  <Typography>
                    <a
                      href={formData.income_statement_document}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Income Statement Document
                    </a>
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel shrink>Profile Picture</InputLabel>
                <input
                  type="file"
                  name="profile_picture"
                  onChange={handleFileChange}
                />
                {/* <Input
                  type="file"
                  onChange={handleChange}
                  multiple={false}
                  name="profile_picture"
                  fullWidth
                /> */}
                {/* Display existing picture if available */}
                <Typography>
                  <a
                    href={formData.profile_picture}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Income Statement Document
                  </a>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
        {activeTab === 8 && (
          <Paper style={paperStyle}>
            {/* Degree Information Fields */}
            {formData.degree &&
              formData.degree.map((degree, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Degree Name"
                      variant="outlined"
                      name={`degree[${index}].degree_name`}
                      value={degree.degree_name}
                      onChange={(e) => handleChange(e, index, "degree")}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Status"
                      variant="outlined"
                      name={`degree[${index}].status`}
                      value={degree.status}
                      onChange={(e) => handleChange(e, index, "degree")}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Institute Name"
                      variant="outlined"
                      name={`degree[${index}].institute_name`}
                      value={degree.institute_name}
                      onChange={(e) => handleChange(e, index, "degree")}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Grade"
                      variant="outlined"
                      name={`degree[${index}].grade`}
                      value={degree.grade}
                      onChange={(e) => handleChange(e, index, "degree")}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}
          </Paper>
        )}

        <div
          style={{ marginTop: "20px", display: "flex", alignContent: "end" }}
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
            disabled={activeTab === 8} // Adjust the upper limit based on the number of tabs
            onClick={handleContinue}
            style={{ marginLeft: "10px" }}
          >
            Continue
          </Button>
          {activeTab === 8 && (
            <Button
              type="submit"
              variant="contained"
              // color="primary"
              style={{ marginLeft: "10px" }}
              sx={{ backgroundColor: "#14475a" }}
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default EditApplicationForm;
