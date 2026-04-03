
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/react'
import { Navigate, Route, Routes } from 'react-router'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import { Toaster } from 'react-hot-toast'

function App() {
  const {isSignedIn} = useUser();
  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/about' element={<AboutPage />} />
        <Route path='/problems' element={isSignedIn ? <ProblemsPage /> : <Navigate to={'/'}/>} />
    </Routes>
    <Toaster  toastOptions={{duration: 3000}}/>
    </>
  )
}

export default App

