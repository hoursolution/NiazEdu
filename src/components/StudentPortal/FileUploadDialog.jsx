import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  LinearProgress,
} from "@mui/material";

const FileUploadDialog = ({ open, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload File</DialogTitle>
      <DialogContent>
        <input
          accept=".pdf, .jpeg, .jpg, .png"
          type="file"
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => onUpload(file, setUploading)}
          disabled={uploading || !file}
        >
          Upload
        </Button>
        {uploading && <LinearProgress />}
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
