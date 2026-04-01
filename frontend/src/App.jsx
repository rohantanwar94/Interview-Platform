
import './App.css'
import { SignInButton, UserButton, SignOutButton } from '@clerk/react'

function App() {
  return (
    <>
      <h1>Welcome to Coding Platform</h1>
      <SignOutButton>
        <SignInButton mode='modal'>
          <button>Login</button>
        </SignInButton>
      </SignOutButton>
      <UserButton/>
    </>
  )
}

export default App

