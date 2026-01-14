import React, {useState, useContext, useEffect} from 'react'
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar'
import { assets, jobsApplied } from '../assets/assets';
import moment from 'moment';
import Footer from '../components/footer';
import {useAuth, useUser} from '@clerk/clerk-react'
import { toast } from 'react-toastify';
import axios from 'axios'
import Loading from '../components/Loading';

const Application = () => {

  const {user} = useUser()
  const {getToken} = useAuth()
  //when click on edit button, isEdit will true and upload option will enble
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null)

  const {backendUrl, userData, userApplications, fetchUserData, fetchUserApplications} = useContext(AppContext)

  

  const updateResume = async () =>{

    try{

      const formData = new FormData()
      formData.append('resume', resume)

      const token = await getToken()

      const {data} = await axios.post(backendUrl + '/api/users/update-resume',
        formData,
        {headers: {Authorization: `Bearer ${token}`}}
      )
      
      if(data.success){
        toast.success(data.message)
        await fetchUserData()
      }else{
        toast.error(data.message)
      }
    }catch(err){

      toast.error(err.message)
    }

    setIsEdit(false)
    setResume(null)
  }

  useEffect(() => {
    if(user){
      fetchUserData()
      fetchUserApplications()
    }
  }, [user])
  return userData? (
    <>
     <Navbar/>

     <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
      <h2 className='text-xl font-semibold'>Your resume</h2>
      <div className='flex gap-2 mb-6 mt-3'>
        {
          isEdit || userData && userData.resume == ""?
          <>
            <label className='flex items-center' htmlFor="resumeUpload">
              <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>{resume ? resume.name : "Select resume"}</p>
              <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} accept='application/pdf' type="file" hidden/>
              <img src={assets.profile_upload_icon} alt="" />
            </label>
            <button onClick={updateResume} className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'>Save</button>
          </> : <div className='flex gap-2'>
            <a target='_blank' href={userData.resume} className='bg-blue-100 text-blue-600 px-4 py-2 rounded' >
              Resume
            </a>
            <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>
              Edit
            </button>
          </div>
        
        }
      </div>
      <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 border border-gray-200 text-left">Company</th>
            <th className="py-3 px-4 border border-gray-200 text-left">Job Title</th>
            <th className="py-3 px-4 border border-gray-200 text-left max-sm:hidden">Location</th>
            <th className="py-3 px-4 border border-gray-200 text-left max-sm:hidden">Date</th>
            <th className="py-3 px-4 border border-gray-200 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          
          {userApplications && userApplications.map((job, index) => (
            <tr key={index}>
              <td className="py-3 px-4 border border-gray-200">
                <div className="flex items-center gap-2">
                  <img src={job.companyId.image} className="w-8 h-8" />
                  {job.companyId.name}
                </div>
              </td>

              <td className="py-3 px-4 border border-gray-200">{job.jobId.title}</td>
              <td className="py-3 px-4 border border-gray-200 max-sm:hidden">{job.jobId.location}</td>
              <td className="py-3 px-4 border border-gray-200 max-sm:hidden">
                {moment(job.date).format("ll")}
              </td>

              <td className="py-3 px-4 border border-gray-200">
                <span
                  className={`${
                    job.status === "Accepted"
                      ? "bg-green-100"
                      : job.status === "Rejected"
                      ? "bg-red-100"
                      : "bg-blue-100"
                  } px-4 py-1.5 rounded`}
                >
                  {job.status}
                </span>
              </td>
            </tr>
          ))}
          {userApplications.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-5">
                No applications found
              </td>
            </tr>
          )}
        </tbody>
      </table>
     </div>
     <Footer/>
    </>
  ) : <Loading/>

}
export default Application