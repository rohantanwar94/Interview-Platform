
import './App.css'
import {Show, SignInButton, SignUpButton, UserButton} from '@clerk/react'

function App() {
  return (
    <>
      <h1>Welcome to Coding Platform</h1>
         <Show when="signed-out">
          <SignInButton mode='modal' />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>

    </>
  )
}

export default App

