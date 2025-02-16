import React, { FC, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import type { DomainValidationResult, DnsValidationResult } from '../../../../../types/system/domain';

interface ValidationStatus {
  step: number;
  results: {
    dns?: DnsValidationResult;
    ssl?: { valid: boolean; error?: string };
  };
  error?: string;
}

interface DomainValidationProps {
  domain: string;
  onValidationComplete: (isValid: boolean) => void;
}

const DomainValidation: FC<DomainValidationProps> = ({
  domain,
  onValidationComplete,
}) => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({
    step: 0,
    results: {},
  });

  const [isValidating, setIsValidating] = useState<boolean>(false);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}/api/domain-validation`);

    ws.onmessage = (event: MessageEvent) => {
      const update = JSON.parse(event.data) as ValidationStatus;
      setValidationStatus((prev: ValidationStatus) => ({
        ...prev,
        ...update,
      }));

      if (update.step === 3 && !update.error) {
        onValidationComplete(true);
      }
    };

    return () => {
      ws.close();
    };
  }, [domain, onValidationComplete]);

  // Start validation process
  useEffect(() => {
    const validateDomain = async (): Promise<void> => {
      setIsValidating(true);
      try {
        const response = await fetch('/api/setup/validate-domain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ domain }),
        });

        const result: DomainValidationResult = await response.json();

        if (!result.valid) {
          setValidationStatus((prev: ValidationStatus) => ({
            ...prev,
            error: result.error,
          }));
          onValidationComplete(false);
        }
      } catch (error) {
        setValidationStatus((prev: ValidationStatus) => ({
          ...prev,
          error: 'Validation failed. Please try again.',
        }));
        onValidationComplete(false);
      } finally {
        setIsValidating(false);
      }
    };

    if (domain) {
      validateDomain();
    }
  }, [domain, onValidationComplete]);

  const steps: string[] = [
    'DNS Record Verification',
    'Propagation Check',
    'SSL Certificate Validation',
  ];

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Stepper activeStep={validationStatus.step} alternativeLabel>
        {steps.map((label: string) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mt: 3 }}>
        {isValidating ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>Validating domain configuration...</Typography>
          </Box>
        ) : validationStatus.error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {validationStatus.error}
          </Alert>
        ) : (
          <Box>
            {validationStatus.results.dns && (
              <Alert
                severity={validationStatus.results.dns.valid ? 'success' : 'error'}
                sx={{ mb: 2 }}
              >
                {validationStatus.results.dns.valid
                  ? 'DNS records verified successfully'
                  : validationStatus.results.dns.error}
              </Alert>
            )}

            {validationStatus.results.ssl && (
              <Alert
                severity={validationStatus.results.ssl.valid ? 'success' : 'error'}
                sx={{ mb: 2 }}
              >
                {validationStatus.results.ssl.valid
                  ? 'SSL certificate validated successfully'
                  : validationStatus.results.ssl.error}
              </Alert>
            )}

            {validationStatus.step === 3 && !validationStatus.error && (
              <Alert severity="success">
                Domain validation completed successfully!
              </Alert>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DomainValidation;