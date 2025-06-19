import React from "react";

const DegreeForm = ({ degree, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...degree, [name]: value });
  };

  return (
    <div>
      <Grid container spacing={2} key={index}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Degree Name"
            variant="outlined"
            name="degree_name"
            value={degree.degree_name}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Status"
            variant="outlined"
            name="status"
            value={degree.status}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Institute Name"
            variant="outlined"
            name="institute_name"
            // name={`degree[${index}].institute_name`}
            value={degree.institute_name}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Grade"
            variant="outlined"
            name="grade"
            // name={`degree[${index}].grade`}
            value={degree.grade}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>
      {/* Add more input fields for other degree properties... */}
    </div>
  );
};

export default DegreeForm;
