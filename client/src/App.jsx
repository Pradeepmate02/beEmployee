import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import ApplyJob from './pages/ApplyJob'
import Home from './pages/Home'
import Application from './pages/Application'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import DashBoard from './pages/RecruiterPages/DashBoard'
import Addjob from './pages/RecruiterPages/Addjob'
import ManageJobs from './pages/RecruiterPages/ManageJobs'
import ViewApplication from './pages/RecruiterPages/ViewApplication'
import 'quill/dist/quill.snow.css'
 import { ToastContainer, toast } from 'react-toastify';


function App() {

  const {showRecruiterLogin} = useContext(AppContext)
  return (
    <div>
      { showRecruiterLogin && 
      <RecruiterLogin/>
       }
       <ToastContainer/>
       {/* routes help in routing the pages*/}
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/apply-job/:id' element={<ApplyJob/>}/>
        <Route path='/applications' element={<Application/>}/>
        <Route path='/dashboard' element ={<DashBoard/>}>
          <Route path='add-job' element = {<Addjob />} />
          <Route path='manage-jobs' element= {<ManageJobs/>} />
          <Route path='view-applications' element ={<ViewApplication/>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App