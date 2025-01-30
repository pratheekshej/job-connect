import React, { Fragment, useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axiosPrivate from '@/hooks/useAxiosPrivate'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import useGetUserLocation from '@/hooks/useGetUserLocation'
import useGetJobById from '@/hooks/useGetJobById'
import { setSingleJob } from '@/redux/jobSlice'

const companyArray = [];

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { ROUTE_PATH } = useGetUserLocation();
    const params = useParams();
    if (params && params.id) {
        useGetJobById(params.id);
    }

    const { companies } = useSelector(store => store.company);
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const companyData = companies?.find((company) => company?._id === user.company);
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let inputData = { ...input, companyId: user.company };
            if (user?.role === 'recruiter') {
                inputData = { ...inputData, companyId: user.company };
            }
            setInput(inputData);
            let res = null;
            if (params && params.id) {
                res = await axiosPrivate.put(`${JOB_API_END_POINT}/update/${params.id}`, inputData, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            } else {
                res = await axiosPrivate.post(`${JOB_API_END_POINT}/post`, inputData, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            }
            if (res.data.success) {
                toast.success(res.data.message);
                navigate(`${ROUTE_PATH}/jobs`);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (singleJob) {
            setInput({
                title: singleJob.title,
                description: singleJob.description,
                requirements: singleJob.requirements.join(','),
                salary: singleJob.salary,
                location: singleJob.location,
                jobType: singleJob.jobType,
                experience: singleJob.experienceLevel,
                position: singleJob.position,
                companyId: singleJob.company,
            })
        }

        return () => {
            dispatch(setSingleJob(null));
        }
    }, [singleJob])

    return (
        <Fragment>
            <div className='flex items-center gap-5 mb-5 pl-0'>
                <Button type="button" onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2 font-semibold text-gray-500">
                    <ArrowLeft />
                    <span>Back</span>
                </Button>
                <h1 className='font-bold text-xl'>{(params && params.id) ? 'Edit' : 'Post'} Job {`- ${companyData?.name} | ${companyData?.location}`}</h1>
            </div>
            <form onSubmit={submitHandler} className='flex flex-col border-gray-200 shadow-lg p-8 border rounded-md'>
                <div className='gap-2 grid grid-cols-2'>
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="title"
                            value={input.title}
                            onChange={changeEventHandler}
                            className="my-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div>
                        <Label>Requirements</Label>
                        <Input
                            type="text"
                            name="requirements"
                            value={input.requirements}
                            onChange={changeEventHandler}
                            className="my-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div>
                        <Label>Yearly Salary</Label>
                        <Input
                            type="text"
                            name="salary"
                            value={input.salary}
                            onChange={changeEventHandler}
                            className="my-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div>
                        <Label>Location</Label>
                        <Input
                            type="text"
                            name="location"
                            value={input.location}
                            onChange={changeEventHandler}
                            className="my-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div>
                        <Label>Job Type</Label>
                        <Input
                            type="text"
                            name="jobType"
                            value={input.jobType}
                            onChange={changeEventHandler}
                            className="my-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div>
                        <Label>Experience Level in Years</Label>
                        <Input
                            type="text"
                            name="experience"
                            value={input.experience}
                            onChange={changeEventHandler}
                            className="my-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Input
                            fieldType="textArea"
                            type="text"
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler}
                            className="my-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div>
                        <Label>No of Postions</Label>
                        <Input
                            type="number"
                            name="position"
                            value={input.position}
                            onChange={changeEventHandler}
                            className="my-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    {/* {
                    companies.length > 0 && (
                        <Select onValueChange={selectChangeHandler}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Company" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        companies.map((company) => {
                                            return (
                                                <SelectItem value={company?.name?.toLowerCase()}>{company.name}</SelectItem>
                                            )
                                        })
                                    }

                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )
                } */}
                </div>
                {
                    loading ?
                        <Button className="my-4 mt-10 w-1/2 self-center">
                            <Loader2 className='mr-2 w-4 h-4 animate-spin' /> Please wait
                        </Button> :
                        <Button type="submit" className="my-4 mt-10 w-1/2 self-center">
                            {(params && params.id) ? 'Update Job' : 'Post Job'}
                        </Button>
                }
                {
                    companies.length === 0 && <p className='my-3 font-bold text-center text-red-600 text-xs'>*Please register a company first, before posting a jobs</p>
                }
            </form>
        </Fragment>
    )
}

export default PostJob