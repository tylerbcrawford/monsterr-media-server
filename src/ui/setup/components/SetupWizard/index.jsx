import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Step,
  Typography,
  Button,
  styled,
} from '@mui/material';
import SystemRequirements from './steps/SystemRequirements';
import ServiceSelection from './steps/ServiceSelection';
import StorageConfig from './steps/StorageConfig';
import NetworkConfig from './steps/NetworkConfig';
import SecurityConfig from './steps/SecurityConfig';
import FinalReview from './steps/FinalReview';

// Custom styled components for the stepper
const StepperContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '2rem 0',
  padding: '0 1rem',
  gap: '1rem',
}));

const StepBubble = styled(Box)(({ theme, completed, active }) => ({
  background: completed ? '#4caf50' : active ? '#1976d2' : '#e0e0e0',
  color: (completed || active) ? 'white' : '#666',
  padding: '0.5rem 0',
  borderRadius: '100px',
  fontSize: '0.875rem',
  fontWeight: 500,
  width: '120px',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const steps = [
  {
    label: 'System',
    path: '',
    component: SystemRequirements,
  },
  {
    label: 'Services',
    path: 'services',
    component: ServiceSelection,
  },
  {
    label: 'Storage',
    path: 'storage',
    component: StorageConfig,
  },
  {
    label: 'Network',
    path: 'network',
    component: NetworkConfig,
  },
  {
    label: 'Security',
    path: 'security',
    component: SecurityConfig,
  },
  {
    label: 'Deploy',
    path: 'review',
    component: FinalReview,
  },
];

const SetupWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);

  // Get current step from path
  const getCurrentStep = () => {
    const currentPath = location.pathname.split('/').pop();
    const stepIndex = steps.findIndex((step) => step.path === currentPath);
    return stepIndex === -1 ? 0 : stepIndex;
  };

  // Navigation handlers
  const handleNext = () => {
    const nextStep = activeStep + 1;
    if (nextStep < steps.length) {
      navigate(`/setup/${steps[nextStep].path}`);
      setActiveStep(nextStep);
    }
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    if (prevStep >= 0) {
      navigate(`/setup/${steps[prevStep].path}`);
      setActiveStep(prevStep);
    }
  };

  // Update active step when path changes
  React.useEffect(() => {
    const currentStep = getCurrentStep();
    setActiveStep(currentStep);
  }, [location]);

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Monsterr Media Server Setup
        </Typography>

        <StepperContainer>
          {steps.map((step, index) => (
            <StepBubble
              key={step.label}
              completed={index < activeStep}
              active={index === activeStep}
            >
              {step.label}
            </StepBubble>
          ))}
        </StepperContainer>

        <Box sx={{ mt: 2, minHeight: '400px' }}>
          <Routes>
            {steps.map((step) => (
              <Route
                key={step.path}
                path={step.path}
                element={
                  <step.component
                    onNext={handleNext}
                    onBack={handleBack}
                    isFirstStep={activeStep === 0}
                    isLastStep={activeStep === steps.length - 1}
                  />
                }
              />
            ))}
          </Routes>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
            variant="contained"
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SetupWizard;