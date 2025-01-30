import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axiosPrivate from '@/hooks/useAxiosPrivate'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import useGetUserLocation from '@/hooks/useGetUserLocation'
import { truncateDesc } from '@/lib/utils'

const CompanySetup = () => {
    const params = useParams();
    const { ROUTE_PATH } = useGetUserLocation();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null,
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axiosPrivate.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate(`${ROUTE_PATH}/companies`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log('>> singleCompany ', singleCompany);
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            file: singleCompany.file || null
        })
    }, [singleCompany]);

    return (
        <form onSubmit={submitHandler} className='flex flex-col'>
            <div className='flex items-center gap-5 p-8 pl-0'>
                <Button onClick={() => navigate(`${ROUTE_PATH}/companies`)} variant="outline" className="flex items-center gap-2 font-semibold text-gray-500">
                    <ArrowLeft />
                    <span>Back</span>
                </Button>
                <h1 className='font-bold text-xl'>Company Setup</h1>
            </div>
            <div className='gap-4 grid grid-cols-2'>
                <div>
                    <Label>Company Name</Label>
                    <Input
                        type="text"
                        name="name"
                        value={input.name}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Website</Label>
                    <Input
                        type="text"
                        name="website"
                        value={input.website}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Location</Label>
                    <Input
                        type="text"
                        name="location"
                        value={input.location}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Logo</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={changeFileHandler}
                    />
                    {
                        (singleCompany.logo && !input.file) ?
                            truncateDesc(`${singleCompany.logo}`, 50) :
                            ''
                    }
                </div>
                <div>
                    <Label>Description</Label>
                    <Input
                        fieldType="textArea"
                        type="text"
                        name="description"
                        value={input.description}
                        onChange={changeEventHandler}
                    />
                </div>
            </div>
            {
                loading ?
                    <Button className="my-4 mt-10 w-1/2 self-center">
                        <Loader2 className='mr-2 w-4 h-4 animate-spin' /> Please wait
                    </Button> :
                    <Button type="submit" className="my-4 mt-10 w-1/2 self-center">Update</Button>
            }
        </form>
    )
}

export default CompanySetup