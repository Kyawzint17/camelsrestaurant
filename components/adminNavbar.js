import Link from "next/link";
import styles from '../styles/admin.module.css';
import Image from "next/image";

const adminNavbar = () => {

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
                                       
                </div>
            </div>
        </nav>
    );

};

export default adminNavbar;