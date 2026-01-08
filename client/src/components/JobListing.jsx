import React, { use, useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations} from '../assets/assets'
import JobCard from './JobCard'

const JobListing = () => {
    const {isSearched, searchFilter, setSearchFilter, jobs} = useContext(AppContext)
    const [showFilter, setShowFilter] = useState(true)

    //state variable to manage the pagination
    const [currentPage, setCurrentPage] = useState(1);

    //statevariables to filter jobs
    const [filterCategories, setFilterCategories] = useState([])
    const [filterLocations, setFilterLocations] = useState([])

    const [filterJobs, setFilterJobs] = useState(jobs);

    //when any category checkbox is ticked then that is added into setFiltercategories array
    const handleCategory = (category) => (
        setFilterCategories( (prev) =>(
                //arr.filter return the array of all element of given condition
                prev.includes(category)? prev.filter(c => c !== category) : [...prev, category]
        ))
    )

    const handleLocation = (location) =>{
        setFilterLocations((prev) =>(
            prev.includes(location)? prev.filter(c => c !== location)  : [...prev, location]
        ))
    } 

    useEffect(() =>{
        //it return true or false, if filterCategories length is 0 then no categories are slected
        // so returns true no need to check second condition and if lenght != 0 then check  if job is present in filtercategories
        const matchesCategory = (job) =>(
            filterCategories.length == 0|| filterCategories.includes(job.category)
        )
        const matchesLocation = (job) =>(
            filterLocations.length == 0 || filterLocations.includes(job.location)
        )

        // if search title is empty then returns true, it means nothing  is searched
        const matchestitle = (job) =>(
            searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())
        )
        
        const matchesL = (job) =>(
            searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())
        )

        //stores array
        const newFilterJobs = jobs
        .slice() // copy original arraya i.e. jobs
        .reverse() // revserse it 
        .filter(job => // filter the jobs so that job should allow all condition to be true
            matchesCategory(job) && matchesLocation(job) 
            && matchestitle(job) && matchesL(job)
        )

        setFilterJobs(newFilterJobs)
        setCurrentPage(1)

        //when any of below array changes then useEffect will execute
    }, [jobs, filterCategories, filterLocations, searchFilter])

  return (
    <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>
        {/*sidebar */}
        <div className='w-full lg:w-1/4 bg-white px-4'>
            {/* search filter for Hero Component*/}
            {
                isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                <>
                <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                <div className='mb-4 text-gray-600'>
                    {searchFilter.title && (
                        <span className='inline-flex items-center gap-2.5 bg-blue-50 border-blue-200 px-4 py-1.5 rounded'>
                            {searchFilter.title}
                            <img onClick={e => setSearchFilter(prev => ({...prev, title:""}))} className='cursor-pointer' src={assets.cross_icon} alt="" />
                        </span>
                    )}
                    {
                        searchFilter.location && (
                            <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border-red-200 px-4 py-1.5 rounded'>
                                {searchFilter.location}
                                {/** when cross img is clicked then location value is sets to zero */}
                                 <img onClick={e => setSearchFilter(prev => ({...prev, location:""}))} className='cursor-pointer' src={assets.cross_icon} alt="" />

                            </span>
                        )
                    }
                </div>
                </>
                )
            }
            {/** this button only appears in mobile view */}
            <button onClick={e=> setShowFilter(prev => !prev)} className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'>
                {
                    showFilter? "close" : "Filters"
                }
            </button>

            {/** category filter */}
            {/** if showfilters is true then filters is shown, if showfilters is false then property hidden is applied */}
            <div className={showFilter? "" :'max-lg:hidden'}>
                <h4 className='font-medium text-lg py-4'>Search by categories</h4>
                <ul className='space-y-4 text-gray-600'>
                    
                    {
                        JobCategories.map((category, index) => (
                            <li className='flex gap-3 items-center' key={index}>
                                <input className='scale-125' 
                                type="checkbox" 
                                onChange={() => handleCategory(category)}
                                checked = {filterCategories.includes(category)}/>
                                {category}
                            </li>
                        ))
                    }
                </ul>
            </div>
            {/** location filter */}
            <div className={showFilter? "" :'max-lg:hidden'}>
                <h4 className='font-medium text-lg py-4 pt-14'>Search by location</h4>
                <ul className='space-y-4 text-gray-600'>
                    
                    {
                        JobLocations.map((location, index) => (
                            <li className='flex gap-3 items-center' key={index}>
                                <input className='scale-125' 
                                type="checkbox" 
                                onChange={() => handleLocation(location)}
                                checked = {filterLocations.includes(location)}/>
                                {location}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>

        {/** job listing */}
        <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
            <h3 className='font-medium text-3xl py-2' id='job-list'>Latest jobs</h3>
            <p className='mb-8'>Get your desired job from top comines</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                {/** only 6 jobcards in one page */}
                    {filterJobs.slice((currentPage-1)*6, currentPage*6).map ((job, index) =>(
                        <JobCard key={index} job={job}/>
                    ))}
            </div>

            {/** pagination */}
            {jobs.length > 0 && (
                <div className='flex items-center justify-center space-x-2 mt-10'>
                    {currentPage > 1 && (
                        <a href="#job-list">
                        <img onClick={() => setCurrentPage(Math.max(currentPage-1, 1))} src={assets.left_arrow_icon} alt="" />
                    </a>
                    )}
                    
                    {Array.from({length:Math.ceil(filterJobs.length/6)}).map((_, index) =>(
                        <a key={index} href='#job-list'>
                            <button onClick={() => setCurrentPage(index+1)} className={ ` w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage == index + 1 ? 'bg-blue-100 text-blue-500 ' : 'text-gray-500' }` }>{index+1}</button>
                        </a>
                    ))}
                    { currentPage*6 < filterJobs.length && (
                        <a onClick={() => setCurrentPage(Math.min(currentPage+1, Math.ceil(jobs.length /6)))} href="#job-list">
                        <img src={assets.right_arrow_icon} alt="" />
                    </a>
                    )

                    }
                    
                </div>
            )}

        </section>

    </div>
  )
}

export default JobListing