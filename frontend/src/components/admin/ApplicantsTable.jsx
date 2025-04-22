import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Download, Eye, FileText, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [selectedResume, setSelectedResume] = useState(null);

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/application/status/${id}/update`, { status }, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleResumeClick = async (applicationId) => {
        try {
            console.log('Fetching resume for application:', applicationId); // Debug log
            const res = await axios.get(`/application/${applicationId}/resume`);
            console.log('Resume response:', res.data); // Debug log
            
            if (res.data.success && res.data.resumeUrl) {
                // Open the signed URL in a new tab
                window.open(res.data.resumeUrl, '_blank');
            } else {
                toast.error(res.data.message || 'Failed to load resume');
            }
        } catch (error) {
            console.error('Error fetching resume:', error);
            toast.error(error.response?.data?.message || 'Failed to load resume');
        }
    };

    const handleDownloadResume = async (applicationId) => {
        try {
            console.log('Downloading resume for application:', applicationId); // Debug log
            const res = await axios.get(`/application/${applicationId}/resume`);
            console.log('Download response:', res.data); // Debug log
            
            if (res.data.success && res.data.resumeUrl) {
                // Create a temporary link to download the file
                const link = document.createElement('a');
                link.href = res.data.resumeUrl;
                link.download = res.data.resumeName || 'resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                toast.error(res.data.message || 'Failed to download resume');
            }
        } catch (error) {
            console.error('Error downloading resume:', error);
            toast.error(error.response?.data?.message || 'Failed to download resume');
        }
    };

    return (
        <Table>
            <TableCaption>A list of your recent applied users</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {applicants && applicants?.applications?.map((item) => (
                    <motion.tr
                        initial={{ x: -100 }}
                        animate={{ x: 0 }}
                        exit={{ x: -100 }}
                        transition={{ duration: 0.5 }}
                        key={item?._id}
                    >
                        <TableCell>{item?.applicant?.fullname}</TableCell>
                        <TableCell>{item?.applicant?.email}</TableCell>
                        <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                        <TableCell>
                            {item?.applicant?.profile?.resume ? (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleResumeClick(item._id)}
                                        className="flex items-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDownloadResume(item._id)}
                                        className="flex items-center gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download
                                    </Button>
                                </div>
                            ) : (
                                <span className="text-gray-500">No resume</span>
                            )}
                        </TableCell>
                        <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                        <TableCell className="float-right cursor-pointer">
                            <Popover>
                                <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                <PopoverContent className="w-32">
                                    {shortlistingStatus.map((sts, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => statusHandler(sts, item?._id)}
                                            className="flex w-fit items-center gap-2 my-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                                        >
                                            <span>{sts}</span>
                                        </div>
                                    ))}
                                </PopoverContent>
                            </Popover>
                        </TableCell>
                    </motion.tr>
                ))}
            </TableBody>
        </Table>
    );
};

export default ApplicantsTable;