import React,{useEffect} from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch,useSelector } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
import useGetAllJobs from "../hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();
  const {allJobs} = useSelector(store=>store.job);
  const dispatch = useDispatch();
  useEffect(()=>{
      return ()=>{
          dispatch(setSearchedQuery(""));
      }
  },[])
  //const randomJobs = allJobs?.slice(0, 4);
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">Search Result ({allJobs?.length || 0})</h1>
        <div className="grid grid-cols-3 gap-4 mt-5">
          {allJobs?.map((job) => {
            return ( <Job  key={job._id} job={job}/>);
          })}
        </div>
      </div>
    </div>
  );
};

export default Browse;
