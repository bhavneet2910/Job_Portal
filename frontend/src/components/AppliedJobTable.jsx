import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AppliedJobTable = () => {
  return (
    <div>
     <Table>
  <TableCaption>A list of your recently applied jobs</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Date</TableHead>
      <TableHead>Job Role</TableHead>
      <TableHead>Company</TableHead>
      <TableHead className="text-right">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {[1, 2, 3, 4].map((item, index) => (
      <TableRow key={index}>
        <TableCell>12-03-2025</TableCell>
        <TableCell>FrontEnd Developer</TableCell>
        <TableCell>Google</TableCell>
        <TableCell className="text-right"><Badge>Selected</Badge></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

    </div>
  );
};

export default AppliedJobTable;
