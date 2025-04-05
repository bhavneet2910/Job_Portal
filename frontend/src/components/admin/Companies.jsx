import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";


function Companies() {
  useGetAllCompanies();
  const [input,setInput]=useState("")
  const navigate=useNavigate();
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setSearchCompanyByText(input));
  },[input]);
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
      <div className='flex items-center justify-between my-5'>
        <Input className="w-fit" placeholder="Filter by name"
        onChange={(e)=>setInput(e.target.value)}
        />
      </div>
      <Button onClick={() => navigate("/admin/companies/create")}>New Company</Button>
    </div>
    <CompaniesTable/>
    </div>
  );
}

export default Companies;
