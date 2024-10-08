import Link from "next/link";
import styles from '../styles/admin.module.css';
import Image from "next/image";
import { useState, useEffect } from "react";
import { auth } from '@/lib/firebase'; // Import auth from your Firebase configuration
import { signOut } from 'firebase/auth'; // Import the signOut function from Firebase

const adminNavbar = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [userEmail, setUserEmail] = useState(''); // State to store the user's email
    const [userName, setUserName] = useState('');   // State to store the user's name

    useEffect(() => {
        // Use onAuthStateChanged to wait for the authentication state to be restored
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUserEmail(user.email || ''); // Set the email or an empty string
                setUserName(user.displayName || '');
            } else {
                setUserEmail(''); // Clear the email when the user is signed out
                setUserName('');  // Clear the name when the user is signed out
            }
        });
        return unsubscribe; // Clean up the listener when the component is unmounted
    }, []);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out the user
            window.location.href = '/'; // Redirect to the home page after logout
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav className={styles.navBar}>
            <div className={styles.navContent}>
                <div className={styles.logoContainer}>
                    <Image src="/logo2.jpg" alt="Logo" width={80} height={80} />
                </div>
                <div className={styles.buttonContainer}>
                    <Link href={'/admin/adminHome'}>
                    <div className={styles.button}>
                        HOME
                    </div>
                    </Link>
                    <Link href={'/admin/adminMenu'}>
                    <div className={styles.button}> 
                        MENU 
                    </div>
                    </Link>
                    <Link href={'/admin/bookingList'}>
                    <div className={styles.button}> 
                        BOOKING LIST
                    </div>
                    </Link>
                    <Link href={'/admin/adminGallery'}>
                    <div className={styles.button}> 
                        GALLERY 
                    </div>
                    </Link>
                    <Link href={'/admin/adminActivity'}>
                    <div className={styles.button}> 
                        ACTIVITY
                    </div>
                    </Link>
                    <Link href={'/admin/aboutUs'}>
                    <div className={styles.button}> 
                        ABOUT US 
                    </div>
                    </Link>
                    <div className={styles.role}>
                        Admin: {userName || 'Unknown User'} {/* Display the name or "Unknown User" */} 
                    </div>
                    <div className={styles.userInfo}>
                        <Image src="/adminprofile.jpg" width={80} height={80} className={styles.profileIcon} onClick={toggleDropdown} />
                        <div className={styles.dropdown}>
                            {/* <div className={styles.userText}>{userEmail}</div> */}
                            
                            <div className={styles.logButton} onClick={handleLogout}>Log Out</div> 
                        </div>
                    
                    </div>            
                </div>
            </div>
        </nav>
    );

};

export default adminNavbar;