import { JOB_API_END_POINT } from '../utils/constant'
import axios from 'axios'
import  { useEffect } from 'react'
import {useDispatch} from 'react-redux'
import { setAllJobs } from '../redux/jobSlice'

const useGetAllJobs = () => {
   const dispatch =useDispatch();
   const {searchedQuery} = useSelector(store=>store.job);
 useEffect(()=>{
    const fetchAllJobs = async()=>{
   try{
    const res= await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,{withCredentials:true});
    if(res.data.success){
      dispatch(setAllJobs())
    }
   } catch(error){
console.log(error);
   }
}
fetchAllJobs();
 },[])
}

export default useGetAllJobs
