import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import { formatTimestamp } from '../hooks/useMetrics';

interface HeaderProps {
  lastUpdate?: string;
  onRefresh?: () => void;
  onSettings?: () => void;
}

export function Header({ lastUpdate, onRefresh, onSettings }: HeaderProps) {
  return (
    <AppBar position="static" sx={{ marginBottom: 3, borderRadius: 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          System Monitor
        </Typography>
        
        {lastUpdate && (
          <Box sx={{ mr: 2 }}>
            <Typography variant="body2" color="inherit">
              Last Update: {formatTimestamp(lastUpdate)}
            </Typography>
          </Box>
        )}

        <IconButton
          size="large"
          color="inherit"
          onClick={onRefresh}
          sx={{ mr: 1 }}
        >
          <RefreshIcon />
        </IconButton>

        <IconButton
          size="large"
          color="inherit"
          onClick={onSettings}
        >
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}