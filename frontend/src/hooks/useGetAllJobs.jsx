import { setAllJobs, setJobStats } from "@/redux/jobSlice";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchText } = useSelector(store => store.job);
    const { authUser } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                console.log('Fetching jobs, auth status:', !!authUser);
                const res = await axiosInstance.get(`/job/all?keyword=${searchText || ''}`);
               
                if (res.data.success) {
                    console.log('API Response:', res.data);
                    dispatch(setAllJobs(res.data.jobs));
                    
                    // Dispatch job statistics
                    if (res.data.stats) {
                        dispatch(setJobStats(res.data.stats));
                    }
                } else {
                    console.log('API response not successful:', res.data);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
                if (error.response?.status === 401) {
                    console.log('User not authenticated');
                    dispatch(setAllJobs([]));
                } else {
                    toast.error("Failed to fetch jobs. Please try again later.");
                    dispatch(setAllJobs([]));
                }
            }
        }
        
        if (authUser) {
            fetchJobs();
        } else {
            console.log('No authenticated user, clearing jobs');
            dispatch(setAllJobs([]));
            toast.error("Please login to view jobs");
        }
    }, [searchText, authUser, dispatch])
}

export default useGetAllJobs;