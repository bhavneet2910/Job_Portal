import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar } from "./ui/avatar"
import { AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { LogOut, User2, FileText } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axiosInstance from "@/config/axios"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { setAuthUser } from "@/redux/authSlice"
import { useState } from "react"
import { PDFViewer } from "./PDFViewer"

export function ProfilePopover() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authUser } = useSelector(store => store.auth);
    const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axiosInstance.get("/user/logout");
            if (res.data.success) {
                dispatch(setAuthUser(null));
                localStorage.setItem('justLoggedOut', 'true');
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to logout");
        }
    }

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    }

    const handleResumeClick = (e) => {
        e.preventDefault();
        if (authUser?.profile?.resume) {
            // Use the new endpoint to serve the PDF
            const pdfUrl = `http://localhost:8000/api/v1/user/resume/${authUser._id}`;
            window.open(pdfUrl, '_blank', 'noopener,noreferrer');
        } else {
            toast.error("Resume not found");
        }
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer h-10 w-10">
                        {authUser?.profile?.profilePhoto ? (
                            <AvatarImage 
                                src={authUser.profile.profilePhoto} 
                                alt={authUser.fullname} 
                                className="object-cover"
                            />
                        ) : (
                            <AvatarFallback className="bg-[#6A38C2] text-white">
                                {getInitials(authUser?.fullname)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="flex gap-2 space-y-2">
                            <Avatar className="h-12 w-12">
                                {authUser?.profile?.profilePhoto ? (
                                    <AvatarImage 
                                        src={authUser.profile.profilePhoto} 
                                        alt={authUser.fullname}
                                        className="object-cover"
                                    />
                                ) : (
                                    <AvatarFallback className="bg-[#6A38C2] text-white">
                                        {getInitials(authUser?.fullname)}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <h4 className="font-medium leading-none">{authUser?.fullname}</h4>
                                <p className="text-sm text-muted-foreground">{authUser?.email}</p>
                                {authUser?.role === 'student' && authUser?.profile?.bio && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {authUser.profile.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 text-gray-600">
                            {authUser?.role === 'student' && (
                                <>
                                    <Link to="/profile" className="flex w-fit items-center gap-2 cursor-pointer hover:text-[#6A38C2]">
                                        <User2 className="h-4 w-4" />
                                        <p>View Profile</p>
                                    </Link>
                                    {authUser?.profile?.resume && (
                                        <div 
                                            onClick={handleResumeClick}
                                            className="flex w-fit items-center gap-2 cursor-pointer hover:text-[#6A38C2]"
                                        >
                                            <FileText className="h-4 w-4" />
                                            <p>View Resume</p>
                                        </div>
                                    )}
                                </>
                            )}
                            <div 
                                onClick={logoutHandler} 
                                className="flex w-fit items-center gap-2 cursor-pointer hover:text-[#6A38C2]"
                            >
                                <LogOut className="h-4 w-4" />
                                <p>Logout</p>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            {authUser?.profile?.resume && (
                <PDFViewer 
                    open={pdfViewerOpen} 
                    setOpen={setPdfViewerOpen} 
                    pdfUrl={authUser.profile.resume} 
                />
            )}
        </>
    )
}