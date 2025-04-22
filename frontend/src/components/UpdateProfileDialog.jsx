import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setAuthUser, setLoading } from "@/redux/authSlice"
import axios from "@/lib/axios"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

export function UpdateProfileDialog({ open, setOpen }) {
    const { authUser, loading } = useSelector(store => store.auth);
    const [input, setInput] = useState({
        fullname: authUser?.fullname || "",
        email: authUser?.email || "",
        phoneNumber: authUser?.phoneNumber || "",
        bio: authUser?.profile?.bio || "",
        skills: authUser?.profile?.skills?.join(", ") || "",
        file: null,
    });
    const dispatch = useDispatch();

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        
        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('bio', input.bio);
        formData.append('skills', input.skills);
        if (input.file) {
            formData.append('file', input.file);
        }

        try {
            const res = await axios.post('/user/profile/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                // Update the Redux store with the new user data
                dispatch(setAuthUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            } else {
                toast.error(res.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullname" className="text-right">
                                Full Name
                            </Label>
                            <Input
                                id="fullname"
                                value={input.fullname}
                                name="fullname"
                                onChange={changeHandler}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={input.email}
                                name="email"
                                onChange={changeHandler}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="phoneNumber"
                                value={input.phoneNumber}
                                name="phoneNumber"
                                onChange={changeHandler}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">
                                Bio
                            </Label>
                            <Input
                                id="bio"
                                value={input.bio}
                                name="bio"
                                onChange={changeHandler}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="skills" className="text-right">
                                Skills
                            </Label>
                            <Input
                                id="skills"
                                value={input.skills}
                                name="skills"
                                onChange={changeHandler}
                                className="col-span-3"
                                placeholder="Separate skills with commas"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="file" className="text-right">
                                Resume
                            </Label>
                            <Input
                                id="file"
                                type="file"
                                name="file"
                                accept="application/pdf"
                                onChange={fileChangeHandler}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {loading ? "Updating..." : "Update Profile"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}