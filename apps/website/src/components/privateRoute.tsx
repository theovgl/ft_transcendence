import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/hooks/useAuth';
import LoadingPage from './LoadingPage';

interface PrivateRouteProps {
	protectedRoutes: string[];
	children: React.ReactNode;
  }

export default function PrivateRoute({ protectedRoutes, children }: PrivateRouteProps) {
    const router = useRouter();
    const { isAuthenticated, isLoading, setIsLoading } = useAuth();
    const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;

    useEffect(() => {
        if (!isLoading && !isAuthenticated && pathIsProtected) {
            router.push('/login');
        }
		setIsLoading(false);
    }, [isAuthenticated, pathIsProtected, router]);

    if ((isLoading || !isAuthenticated) && pathIsProtected) {
        return <LoadingPage />;
    }

    return <>{children}</>;
}