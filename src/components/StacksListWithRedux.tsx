import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { listStacks } from '@/store/slices/stacksSlice';
import type { PayloadAction } from '@reduxjs/toolkit';

export const StacksListWithRedux = () => {
    const dispatch = useAppDispatch();
    const { items: stacks, loading, error } = useAppSelector((state) => state.stacks);

    useEffect(() => {
        dispatch(listStacks({ params: { page: 1, page_size: 20 } }));
    }, [dispatch]);

    if (loading) return <div className="p-4">Loading tech stacks...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-800">Error: {error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Tech Stacks</h2>

            {stacks.length === 0 ? (
                <p className="text-gray-500">No tech stacks found</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {stacks.map((stack) => (
                        <div
                            key={String(stack.id)}
                            className="p-4 rounded-lg text-white text-center hover:shadow-lg transition"
                            style={{ backgroundColor: stack.color || '#3b82f6' }}
                            title={stack.description || stack.name}
                        >
                            <div className="text-sm font-semibold">{stack.name}</div>
                            <div className="text-xs opacity-75 mt-1">{(stack.description || '').length > 0 ? `${(stack.description || '').substring(0, 60)}${(stack.description || '').length > 60 ? '...' : ''}` : 'No description'}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
