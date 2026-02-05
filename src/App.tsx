import { ThemeProvider, CssBaseline} from '@mui/material';
import { BrowserRouter as Router, } from 'react-router-dom';
import { theme } from './theme';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        
        
      </Router>
    </ThemeProvider>
  );
}

export default App;
