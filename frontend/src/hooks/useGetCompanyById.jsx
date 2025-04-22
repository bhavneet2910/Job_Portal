import { setSingleCompany } from "@/redux/companySlice";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetCompanyById = (id) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchCompanyDetails = async () => {
            try {
                const res = await axios.get(`/company/getcompany/${id}`);
                if(res.data.success){
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {
                console.log("Error occurred while fetching company details",error);
            }
        };
        fetchCompanyDetails();
    },[id,dispatch])
};

export default useGetCompanyById;