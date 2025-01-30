import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText, setSingleJob } from '@/redux/jobSlice'
import { Fragment } from 'react'
import useGetUserLocation from '@/hooks/useGetUserLocation'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const { allAdminJobs } = useSelector(state => state.job);
  const { companies } = useSelector(state => state.company);
  const { user } = useSelector(state => state.auth);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ROUTE_PATH } = useGetUserLocation();
  const currentCompany = companies?.find(company => (company?.userData?._id === user?._id));

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  const getJobHeading = () => {
    return user?.role === 'admin' ? 'Admin' : user?.role === 'recruiter' ? currentCompany?.name : ''
  }

  return (
    <Fragment>
      {
        getJobHeading() &&
        <h1 className='my-5 font-bold text-xl'>
          {getJobHeading()} | Job List - ({allAdminJobs?.length})
        </h1>
      }
      <div className='flex justify-between items-center my-5'>
        {
          user?.role === 'recruiter' &&
          currentCompany &&
          (user.approvalStatus === 'pending' || currentCompany?.userData?.approvalStatus !== 'approved') &&
          'You can add jobs after your registered company gets approved!'
        }
        {
          user?.role === 'recruiter' &&
          !currentCompany &&
          'Please Register your company to add new Jobs!'
        }
        {user?.role === 'admin' &&
          <Input
            className="w-fit"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)}
          />
        }
        {
          user?.role === 'recruiter' &&
          currentCompany?.userData?.approvalStatus === 'approved' &&
          <Button
            disabled={user?.role === 'recruiter' && user.approvalStatus === 'pending'}
            onClick={() => {
              dispatch(setSingleJob(null));
              navigate(`${ROUTE_PATH}/jobs/create`);
            }}>
            New Jobs
          </Button>
        }
      </div>
      <AdminJobsTable />
    </Fragment>
  )
}

export default AdminJobs