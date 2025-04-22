import { setCompanies } from "@/redux/companySlice";
import axiosInstance from "@/lib/axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetCompanies = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axiosInstance.get('/company/getcompanies');
                if(res.data.success){
                    dispatch(setCompanies(res.data.companies));
                } else {
                    toast.error(res.data.message || 'Failed to fetch companies');
                }
            } catch (error) {
                console.error("Error occurred while fetching companies:", error);
                toast.error(error.response?.data?.message || 'Failed to fetch companies');
                dispatch(setCompanies([])); // Set empty array on error
            }
        };
        fetchCompanies();
    }, [dispatch]);
};

export default useGetCompanies;