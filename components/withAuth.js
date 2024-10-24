// components/withAuth.js
import { useEffect } from 'react';
import { auth } from '@/lib/firebase'; // Import the initialized auth instance
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (!user) {
                    // User is not authenticated, redirect to login page
                    router.replace('/guest/guestHome'); // Change to your login route
                }
            });

            return () => unsubscribe(); // Cleanup subscription on unmount
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
