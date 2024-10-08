import { useRouter } from 'next/router';
import { auth, signInWithGoogle } from '@/lib/firebase'; 
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import style from '@/styles/login.module.css';
import styles from '../styles/guest.module.css';

const CustomerNavbar = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setLoading(true);
        const user = await signInWithGoogle();
        setLoading(false);
        if (user) {
          const email = user.email;
          if (email === 'u6228105@au.edu' || email === 'u6215106@au.edu') {
            router.push('/admin/adminHome'); 
          } else {
            router.push('/customer/customerHome'); 
          }
        }
      };

    useEffect(() => {
        const handleResize = () => {
            // Logic to handle navbar styles if needed
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('visibilitychange', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleResize);
        };
    }, []);

    return (
        <nav className={styles.navBar}>
            <div className={styles.navContent}>
                <div className={styles.logoContainer}>
                    <Image src="/log0.jpg" alt="Logo" width={80} height={80} />
                </div>
                <div className={styles.buttonContainer}>
                    <Link href={'/guest/guestHome'}>
                    <div className={styles.button}>
                        HOME
                    </div>
                    </Link>
                    <Link href={'/guest/guestMenu'}>
                    <div className={styles.button}> 
                        MENU 
                    </div>
                    </Link>
                    <Link href={'/guest/guestGallery'}>
                    <div className={styles.button}> 
                        GALLERY 
                    </div>
                    </Link>
                    <Link href={'/guest/guestActivity'}>
                    <div className={styles.button}> 
                        ACTIVITY
                    </div>
                    </Link>
                    <Link href={'/guest/aboutUs'}>
                    <div className={styles.button}> 
                        ABOUT US 
                    </div>
                    </Link>
                    <div className={styles.role}>
                        Guest 
                    </div>
                    <div className={styles.userInfo}>
                        <Image src="/goldenprofile.jpg" width={60} height={60} className={styles.profileIcon}/>
                        <div className={styles.dropdown}> 
                            <h3 className={styles.userText}>LOGIN</h3>
                            <button 
                                className={style.signInButton} 
                                onClick={handleGoogleSignIn} 
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in with Google'}
                            </button>
                        </div>
                     
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default CustomerNavbar;
