import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import SetupWizard from './components/SetupWizard';

const App = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/setup/*" element={<SetupWizard />} />
          <Route path="*" element={<Navigate to="/setup" replace />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;