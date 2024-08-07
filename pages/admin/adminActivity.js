import AdminNavbar from "@/components/adminNavbar";
import Image from "next/image";
import styles from '@/styles/activity.module.css';
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import Link from "next/link";


export default function Activity() {

    return (
        <>
            <AdminNavbar />
            <div className={styles.background}>
                <div className={styles.mainSection}>
                    <div className={styles.imageContainer}>
                        <Image src="/activitybackground.jpg" alt="Logo" layout="fill" objectFit="cover" className={styles.image} />
                        <div className={styles.header}>ACTIVITY</div>
                        <Link href={'/admin/postActivity'}>
                            <button className={styles.postButton}>Post</button>
                        </Link>
                    </div>
                    <div className={styles.postContainer}>
                        <div className={styles.postBox}>
                            <div className={styles.detailContainer}>
                                    <div className={styles.postTitle}>
                                        Special discount for Eid Al Adha
                                    </div>
                                    <div className={styles.line} />
                                    <div className={styles.postDescription}>
                                        Enjoy a special discount this Eid al-Adha with up to 50% off on all our products, making your celebrations even more joyous
                                    </div>
                                    <div className= {styles.dateRange}>
                                        20/6/2024 - 30/6/2024
                                    </div>
                                    <div className={styles.line2} />
                           </div>
                           <Image src="/event.png" width={300} height={200} className={styles.iconImage} alt="Post Image" />
                        </div>
                        <div className={styles.postBox}>
                            <div className={styles.detailContainer}>
                                    <div className={styles.postTitle}>
                                        Special discount for Eid Al Adha
                                    </div>
                                    <div className={styles.line} />
                                    <div className={styles.postDescription}>
                                        Enjoy a special discount this Eid al-Adha with up to 50% off on all our products, making your celebrations even more joyous
                                    </div>
                                    <div className= {styles.dateRange}>
                                        Date: June 20, 2024 - June 30, 2024
                                    </div>
                           </div>
                           <Image src="/event.png" width={300} height={200} className={styles.iconImage} alt="Post Image" />
                        </div>
                        <div className={styles.postBox}>
                            <div className={styles.detailContainer}>
                                    <div className={styles.postTitle}>
                                        Special discount for Eid Al Adha
                                    </div>
                                    <div className={styles.line} />
                                    <div className={styles.postDescription}>
                                        Enjoy a special discount this Eid al-Adha with up to 50% off on all our products, making your celebrations even more joyous
                                        Enjoy a special discount this Eid al-Adha with up to 50% off on all our products, making your celebrations even more joyous
                                        Enjoy a special discount this Eid al-Adha with up to 50% off on all our products, making your celebrations even more joyous
                                        Enjoy a special discount this Eid al-Adha with up to 50% off on all our products, making your celebrations even more joyous
                                    </div>
                                    <div className= {styles.dateRange}>
                                        Date: June 20, 2024 - June 30, 2024
                                    </div>
                           </div>
                           <Image src="/event.png" width={300} height={200} className={styles.iconImage} alt="Post Image" />
                        </div>
                    </div>
                </div>
            </div>
                
            
            <AdminNavbarBottom />
        </>
    )


}