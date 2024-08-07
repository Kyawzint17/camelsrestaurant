import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import styles from '@/styles/customer.module.css';
import Link from "next/link";

export default function customerHome() {
    return (
        <> 
            <CustomerNavbar />
            <div className={styles.mainSection}>
                <div className={styles.imageContainer}>
                    <Image src="/homebackgr0und.jpg" alt="Logo" layout="fill" objectFit="cover" className={styles.image} />
                    <div className={styles.header}>CAMELS</div>
                    <div className={styles.header1}>Cafe & Restaurant</div>
                    <Link href={'/customer/customerMenu'}>
                        <button className={styles.menuButton}>Menu</button>
                    </Link>
                    <Link href={'/booking/bookingTable'}>
                        <button className={styles.bookTableButton}>Book a Table</button>
                    </Link>
                </div>

                <div className={styles.head}>Home</div>
                <div className={styles.mainEventContainer}>
                    <Image src="/event.png" alt="Event Image" width={2000} height={2000} className={styles.eventImage} />
                    <div className={styles.eventDetails}>
                        <div className={styles.eventTitle}>Special discount for Eid Al Adha</div>
                        <div className={styles.line2} />
                        <div className={styles.eventDescription}>
                            Enjoy a special discount this Eid al-Adha with up to 50% off on all our products, making your celebrations even more joyous
                        </div>
                        <div className={styles.eventDate}>Date: June 20, 2024 - June 30, 2024</div>
                    </div>
                </div>

                <div className={styles.line} />
                <div className={styles.head2}>HIGHLIGHTS PHOTOS</div>
                <div className={styles.highlightImageContainer}>
                    <Image src="/highlight.png" width={1000} height={1000} className={styles.highlightImage} />
                </div>

                <div className={styles.line} />
                <div className={styles.head2}>VIDEOS</div>
                <div className={styles.videoContainer}>
                    <div className={styles.videoPlaceholder}>
                        <Image src="/placeholder1.png" width={500} height={300} className={styles.videoPlaceholderImage} />
                    </div>
                    <div className={styles.videoPlaceholder}>
                        <Image src="/placeholder2.png" width={500} height={300} className={styles.videoPlaceholderImage} />
                    </div>
                </div>

                <div className={styles.line3} />

            </div>

            <CustomerNavbarBottom />
            
        </>
    );
}
