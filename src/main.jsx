import { StrictMode } from 'react';
import ReactDOM from 'react-dom'; // Use ReactDOM instead of react-dom/client
import './index.css';
import App from './App.jsx';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root') // This is the root DOM element
);
