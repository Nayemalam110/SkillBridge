import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { listJobs } from '@/store/slices/jobsSlice';

export const JobsListWithRedux = () => {
    const dispatch = useAppDispatch();
    const { items: jobs, loading, error } = useAppSelector((state) => state.jobs);

    useEffect(() => {
        dispatch(listJobs({ page: 1, page_size: 10 }) as any);
    }, [dispatch]);

    if (loading) return <div className="p-4">Loading jobs...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-800">Error: {error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>

            {jobs.length === 0 ? (
                <p className="text-gray-500">No jobs found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{job.stackName}</p>
                            <p className="text-gray-700 mb-3">{job.description?.substring(0, 100)}...</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">{job.status}</span>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">View</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
