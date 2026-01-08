import React, {createContext, use, useEffect, useState} from 'react'
import { jobsData } from '../assets/assets';

export const AppContext =createContext(  )

const AppContextProvider = (props) => {

    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:''
    });

    const [isSearched, setIsSearched] = useState(false);

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [jobs, setJobs] = useState([]);
    //function to fetch job data from jobs

    const fetchJobs = async () =>{
        setJobs(jobsData)
    }

    useEffect(() => {
      fetchJobs();
    }, [])

    const value = {
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin
    }
  return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider