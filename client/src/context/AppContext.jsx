import React, {createContext, useEffect, useState} from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import { useAuth, useUser } from '@clerk/clerk-react'

export const AppContext =createContext( )

const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    //clerk provider will give you the users data
    const {user} = useUser()
    const {getToken} = useAuth()
    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:''
    });

    const [isSearched, setIsSearched] = useState(false);

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)

    const [companyData, setCompanyData] = useState(null)

    const [userData, setUserData] = useState(null)

    const [userApplications, setUserApplications] = useState([])
    const [jobs, setJobs] = useState([]);
    //function to fetch job data from jobs

    const fetchJobs = async () =>{
      try{

        const {data} = await axios.get(backendUrl+'/api/jobs')
        if(data.success){

          setJobs(data.jobs)
        }else{
          toast.error(data.message)
        }
      }catch(err){
        toast.error(err.message)
      }
    }

    //Function to fetch company data
    const fetchCompanyData = async () =>{
      try{

        const {data} = await axios.get(backendUrl + '/api/company/get-company', {headers:{token : companyToken}})

        if(data.success){
          setCompanyData(data.company)
        }else{
          toast.error(data.message)
        }
      }catch(err){
          toast.error(err.message)
      }
    }

    //Function is fect user data
    const fetchUserData = async() => {
      try{
          const token = await getToken()

          const {data} = await axios.get(backendUrl + '/api/users/user',
            {headers: {Authorization: `Bearer ${token}`}}
          )

          if(data.success){
            setUserData(data.user)
          }else{
            toast.error(data.message)
          }
      }catch(err){
          toast.error(err.message)
      }
    }

    //function to fetch users's applied applications

    const fetchUserApplications = async () =>{
      try{
        const token = await getToken()

        const {data} = await axios.get(backendUrl + '/api/users/applications',
          {headers: {Authorization: `Bearer ${token}`}}
        )
        if(data.success){
          setUserApplications(data.applications)
        }
      }catch(err){
        toast.error(err.message)
      }
    }

    useEffect(() => {
      fetchJobs();
      //when page reload company token will still stored
      const storedCompanyToken = localStorage.getItem('companyToken')
      if(storedCompanyToken){
        setCompanyToken(storedCompanyToken)
      }
    }, [])
    
    //when company token changes it will call function that fetch the company data from backend
    useEffect(() =>{
      if(companyToken){
        fetchCompanyData()
      }
    }, [companyToken])

    useEffect(() =>{
      if(user){
        fetchUserData(),
        fetchUserApplications()
      }
    }, [user])



    const value = {
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        userData, setUserData,
        userApplications, setUserApplications,
        backendUrl,
        fetchUserData,
        fetchUserApplications
    }
  return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider