import React, { use, useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'


const RecruiterLogin = () => {

    const navigate = useNavigate()

    const [state, setState] = useState('login')
    const [email, setEmail] = useState('')
    const [name , setName] = useState('')
    const [password, setPassword] = useState('')

    const [isTextDataSubmited, setIsTextDataSubmited] = useState(false)

    const [image, setImage] = useState(false)

    const {setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData} = useContext(AppContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if(state == 'Sign up' && !isTextDataSubmited){
            setIsTextDataSubmited(true)
        }
        
        try{
            if(state === 'login'){

                const {data} = await axios.post(backendUrl + 'api/company/login', {email, password})
                
                if( data.success){
                    setCompanyData(data.company)
                    setCompanyToken(data.token)
                    localStorage.setItem('companyToken', data.token)
                    setShowRecruiterLogin(false)
                    navigate('/dashboard')
                }else{
                    toast.error(data.message)
                }
            }else{

                const formData = new FormData()
                formData.append
            }
        }catch(err){

        }
        
    }

    useEffect(() =>{
        document.body.style.overflow = 'hidden'
        //1. Effect runs → scrolling is disabled
        //2. The function you return is saved by React.
        //3. When the component unmounts (or page changes), React calls the returned function:
        //it is clean up function we used when we want to set property back after the effect
        return () =>{
            document.body.style.overflow = 'unset'
        }
    }, [])
  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
        <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
            <p className='text-sm'>Welcome back! Please sign in to continue</p>
            { state == 'Sign up' && isTextDataSubmited ? 
            <>
                <div className='flex items-center gap-4 my-10'>
                    <label htmlFor="image">
                        <img className='w-16 rounded-full' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                        <input onChange={e => setImage(e.target.files[0])} type="file" id='image' hidden />
                    </label>
                    <p>Upload Company <br /> logo</p>
                </div>
            </>  
            :
             <>

            { state !== 'login' &&
                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.person_icon} alt="" />
                    <input className='outline-none text-sm' onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Company Name' required />
                </div>
            }
                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.email_icon} alt="" />
                    <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='Email id' required />
                </div>
                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                    <img src={assets.lock_icon} alt="" />
                    <input className='outline-none text-sm' onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required />
                </div>
                
            </ >  
            }
           {state === 'login' &&
            <p className='text-sm text-blue-600 my-4 cursor-pointer'>fogot password?</p>
           }
            <button className='bg-blue-600 w-full text-white py-2 rounded-full mt-4'>
                {state === 'login' ? 'login' : isTextDataSubmited ? 'create account' : 'next'} 
            </button>
            {
                state === 'login' ? 
                <p className='mt-5 text-center'>Don't have an account? 
                    <span className='text-blue-600 cursor-pointer' onClick={() => setState("Sign up")}>Sign Up</span></p>
                :
                <p className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState("login")}>Login</span></p>

            }
            <img onClick={() => setShowRecruiterLogin(false)} className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt="" />

        </form>
    </div>
  )
}

export default RecruiterLogin