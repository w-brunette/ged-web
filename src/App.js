import { AppBar, Box, Button, CssBaseline, Drawer, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Outlet } from 'react-router-dom';
import './App.css';
import { LoadingProvider } from './components/Loading';
import Menu from './components/Menu';
import theme from "./theme";
import { People } from '@mui/icons-material';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar >
            <Typography variant="h6" noWrap component="div">
              GED
            </Typography>
            <Button>
              <People />
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: 230,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 230, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <Menu />
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <LoadingProvider>
              <Outlet />
            </LoadingProvider>
          </LocalizationProvider>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App;
