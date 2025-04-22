import { setAllJobs } from "@/redux/jobSlice";
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
                const res = await axiosInstance.get(`/job/all?keyword=${searchText || ''}`);
               
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
                if (error.response?.status === 401) {
                    // Don't show error toast for 401 as it's handled by the interceptor
                    dispatch(setAllJobs([]));
                } else {
                    toast.error("Failed to fetch jobs. Please try again later.");
                    dispatch(setAllJobs([]));
                }
            }
        }
        
        // Only fetch jobs if user is authenticated
        if (authUser) {
            fetchJobs();
        } else {
            // Clear jobs when user is not authenticated
            dispatch(setAllJobs([]));
        }
    }, [searchText, authUser, dispatch])
}

export default useGetAllJobs;