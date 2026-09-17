import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from '../config/authConfig'
import { BrowserRouter as Router } from 'react-router-dom'

const msalInstance = new PublicClientApplication(msalConfig)

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <AuthenticatedTemplate>
          <Dashboard />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Login />
        </UnauthenticatedTemplate>
      </Router>
    </MsalProvider>
  )
}

export default App
