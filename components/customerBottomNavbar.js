import Link from "next/link";
import styles from '../styles/customer.module.css';
import Image from "next/image";

const customerBottomNavbar = () => {
    return (
        <nav className={styles.navBar}>
            <div className={styles.navContent}>
                <div className={styles.logoContainer}>
                    <Image src="/log0.jpg" alt="Logo" width={80} height={80} />
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
                            <Link href="https://www.facebook.com">
                                <div className={styles.socialLink}>Facebook</div>
                            </Link>
                            <Link href="https://www.twitter.com">
                                <div className={styles.socialLink}>Twitter</div>
                            </Link>
                            <Link href="https://www.instagram.com">
                                <div className={styles.socialLink}>Instagram</div>
                            </Link>
                        </div>
                    </div>

                    
                </div>
            </div>
        </nav>
    );
};

export default customerBottomNavbar;
