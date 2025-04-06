import React from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch } from "react-redux";

const Browse = () => {
  useGetAllJobs();
  const {allJobs} = useSelector(store=>store.job);
  const dispatch = useDispatch();
  useEffect(()=>{
      return ()=>{
          dispatch(setSearchedQuery(""));
      }
  },[])
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">Search Result ({randomJobs.length})</h1>
        <div className="grid grid-cols-3 gap-4 mt-5">
          {randomJobs.map((job) => {
            return ( <Job  key={job._id} job={job}/>);
          })}
        </div>
      </div>
    </div>
  );
};

export default Browse;
