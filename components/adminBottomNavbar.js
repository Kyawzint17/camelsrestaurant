import Link from "next/link";
import styles from '../styles/admin.module.css';
import Image from "next/image";

const customerBottomNavbar = () => {
    return (
        <nav className={styles.navBar}>
            <div className={styles.navContent}>
                <div className={styles.logoContainer}>
                    <Image src="/logo2.jpg" alt="Logo" width={80} height={80} />
                </div>
                <div className={styles.textContainer}>
                    <div className={styles.address}>
                        Khuklongsib Rd., Khu Fang Nuea, Nong Chok, Bangkok
                    </div>
                    
                    <div className={styles.socialMedia}>
                        <div className={styles.contactInfo}>
                            <div className={styles.gmail}>
                                camelscafeandrestaurant@gmail.com
                            </div>
                            <div className={styles.ph}>
                                tel: 063-xxx-xxxx
                            </div>
                        </div>
                        <div className={styles.socialLinksContainer}>
                            <Link href="https://www.facebook.com/profile.php?id=61556568038363">
                                <Image src="/fbb.png" width={40} height={40} className={styles.profileIcon}/>
                            </Link>
                            <Link href= "https://www.instagram.com">
                                <Image src="/igb.png" width={40} height={40} className={styles.profileIcon}/>
                            </Link>
                            <Link href= "https://www.twitter.com">
                                <Image src="/am.png" width={36.5} height={36.5} className={styles.lineIcon}/>
                            </Link>
                        </div>
                    </div>

                    
                </div>
            </div>
        </nav>
    );
};

export default customerBottomNavbar;
