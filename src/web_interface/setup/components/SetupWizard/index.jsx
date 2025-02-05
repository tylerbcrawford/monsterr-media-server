import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
} from '@mui/material';
import SystemRequirements from './steps/SystemRequirements';
import ServiceSelection from './steps/ServiceSelection';
import StorageConfig from './steps/StorageConfig';
import NetworkConfig from './steps/NetworkConfig';
import SecurityConfig from './steps/SecurityConfig';
import FinalReview from './steps/FinalReview';

const steps = [
  {
    label: 'System Requirements',
    path: '',
    component: SystemRequirements,
  },
  {
    label: 'Service Selection',
    path: 'services',
    component: ServiceSelection,
  },
  {
    label: 'Storage Configuration',
    path: 'storage',
    component: StorageConfig,
  },
  {
    label: 'Network Setup',
    path: 'network',
    component: NetworkConfig,
  },
  {
    label: 'Security Configuration',
    path: 'security',
    component: SecurityConfig,
  },
  {
    label: 'Review & Deploy',
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

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

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