import React from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";


function Companies() {
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
      <div className='flex items-center justify-between my-5'>
        <Input className="w-fit" placeholder="Filter by name" />
      </div>
      <Button onClick={() => navigate("/admin/companies/create")}>New Company</Button>
    </div>
    <CompaniesTable/>
    </div>
  );
}

export default Companies;
