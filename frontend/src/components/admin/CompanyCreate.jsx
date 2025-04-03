import React from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { useNavigate } from "react-router-dom";

const CompanyCreate = () => {
    const navigate=useNavigate();
  return (
    <div>
      <Navbar>
        <div>
          <div className="max-w-4xl mx-auto">
            <div className="my-10">
              <h1 className="font-bold text-2xl">Your Company Name</h1>
              <p className="text-gray-500">
                What would you like to give your company name? you can change
                this later.
              </p>
              <Label>Company Name</Label>
              <Input
                type="text"
                className="my-2"
                placeholder="JobHunt, Microsoft etc."
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <div className="flex items-center gap-2 my-10">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/companies")}
                >
                  Cancel
                </Button>
                <Button onClick={registerNewCompany}>Continue</Button>
              </div>
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default CompanyCreate;
