import React from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Paper,
  DialogTitle,
  DialogContent,
} from "@mui/material";

const MentorForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitHandler = (data) => {
    onSubmit(data);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 2 }}>
      <Paper sx={{ padding: 2 }}>
        <Typography
          sx={{ fontWeight: 700, color: "#0a2547" }}
          variant="h5"
          align="center"
          gutterBottom
        >
          Create Mentor
        </Typography>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("mentor_name", { required: true })}
                  label="Name"
                  fullWidth
                  error={errors.mentor_name ? true : false}
                  helperText={errors.mentor_name ? "Name is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("mentor_cnic", {
                    required: true,
                    minLength: 13,
                    maxLength: 13,
                    pattern: /^[0-9]+$/,
                  })}
                  label="CNIC"
                  fullWidth
                  error={errors.mentor_cnic ? true : false}
                  helperText={
                    errors.mentor_cnic
                      ? "Invalid CNIC (Should be exactly 13 digits)"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  {...register("mentor_contact", {
                    required: true,
                    minLength: 11,
                    pattern: /^[0-9\b]+$/,
                  })}
                  label="Contact"
                  fullWidth
                  error={errors.mentor_contact ? true : false}
                  helperText={
                    errors.mentor_contact
                      ? "Invalid contact number (At least 11 digits)"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("mentor_email", {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                  label="Email"
                  fullWidth
                  error={errors.mentor_email ? true : false}
                  helperText={
                    errors.mentor_email
                      ? "Invalid email address"
                      : "Will be considered as Mentor username"
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("mentor_Expertise", { required: true })}
                  label="Expertise"
                  fullWidth
                  error={errors.mentor_Expertise ? true : false}
                  helperText={
                    errors.mentor_Expertise ? "Expertise is required" : ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("mentor_country", { required: true })}
                  label="Country"
                  fullWidth
                  error={errors.mentor_country ? true : false}
                  helperText={
                    errors.mentor_country ? "Country is required" : ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Paper>
    </Container>
  );
};

export default MentorForm;
