import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, register, logout, getMe, getProfile } from '@/store/slices/authSlice';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, profile, tokens, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // Check if user is already authenticated on mount
        if (tokens?.access && !user) {
            dispatch(getMe() as any);
            dispatch(getProfile() as any);
        }
    }, [dispatch, tokens, user]);

    return {
        user,
        profile,
        tokens,
        loading,
        error,
        isAuthenticated,
        login: (email: string, password: string) => dispatch(login({ email, password }) as any),
        register: (data: any) => dispatch(register(data) as any),
        logout: () => dispatch(logout() as any),
    };
};

export const useStacks = () => {
    const dispatch = useAppDispatch();
    const { items, currentStack, loading, error, pagination } = useAppSelector((state) => state.stacks);

    return {
        stacks: items,
        currentStack,
        loading,
        error,
        pagination,
        dispatch,
    };
};

export const useJobs = () => {
    const dispatch = useAppDispatch();
    const { items, currentJob, loading, error, pagination } = useAppSelector((state) => state.jobs);

    return {
        jobs: items,
        currentJob,
        loading,
        error,
        pagination,
        dispatch,
    };
};
