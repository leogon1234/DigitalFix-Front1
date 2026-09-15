import Login from './pages/Login'
import './App.css'
import {MsalProvider} from '@azure/msal-react'
import {PublicClientApplication} from '@azure/msal-browser'
import { msalConfig } from '../config/authConfig'

const msalInstance = new PublicClientApplication(msalConfig)

function App() {
  return (
    <>
      <MsalProvider instance={msalInstance}>
        <Login />
      </MsalProvider>
    </>
  )
}

export default App
