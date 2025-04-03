import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableHeader,
  TableCaption,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  const navigate=useNavigate();
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent registered companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableCell>
            <Avatar>
              <AvatarImage src="https://th.bing.com/th/id/OIP.eNxfRQCY5rTUUVj7uhLBvAHaEv?rs=1&pid=ImgDetMain" />
            </Avatar>
          </TableCell>
          <TableCell>Company Name</TableCell>
          <TableCell>03-04-2025</TableCell>
          <TableCell className="text-right cursor-pointer">
            <Popover>
              <PopoverTrigger>
                <MoreHorizontal />
              </PopoverTrigger>
              <PopoverContent className="w-32">
                <div
                  onClick={() => navigate(`/admin/companies/${company._id}`)}
                  className="flex items-center gap-2 w-fit cursor-pointer"
                >
                  <Edit2 className="w-4" />
                  <span>Edit</span>
                </div>
              </PopoverContent>
            </Popover>
          </TableCell>
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
