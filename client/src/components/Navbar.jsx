import React, { useContext } from 'react'
import { assets } from '../assets/assets'
//to use which popup will open
import { useUser, UserButton, useClerk} from '@clerk/clerk-react'
import Application from '../pages/Application'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const Navbar = () => {

    const {openSignIn} = useClerk();
    const {user} = useUser();

    const navigate = useNavigate()

    const {setShowRecruiterLogin} = useContext(AppContext);
  return (
    <div className='shadow py-4'>
        <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
            <img onClick={()=> navigate('/')} src={assets.logo} alt="" />
            {
                user?
                <div className='flex items-center gap-3'>
                    <Link to={'/applications'}>Applied jobs</Link>
                    <p>|</p>
                    <p className='max-sm:hidden'>Hi, {user.firstName+ " " +user.lastName}</p>
                    <UserButton/>
                </div>
                :
                <div className='flex gap-4 max-sm:text-xs'>
                <button onClick={() => setShowRecruiterLogin(true)} className='text-gray-600'>Recruiter login</button>
                <button onClick = {e => openSignIn() } className='bg-purple-600 text-white px-6 sm:px-9 py-2 rounded-full'>login</button>
                </div>

            }
            
        </div>

    </div>
  )
}

export default Navbar