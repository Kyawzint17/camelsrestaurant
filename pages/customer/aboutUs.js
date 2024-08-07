import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import styles from '@/styles/aboutus.module.css';


export default function Aboutus() {

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.aboutPage}>
                    <div className={styles.textContainer}>
                        <div className={styles.title}> CAMELS </div>
                        <div className={styles.title}>  Café And Restaurant </div>
                        <div className={styles.iconContainer}>
                            <div className={styles.iconItem}>
                                <Image src="/icon1.png" width={1000} height={1000} className={styles.iconImage} alt="Icon Image" />
                                <div className={styles.iconText}>Beverages</div>
                            </div>
                            <div className={styles.iconItem}>
                                <Image src="/icon2.png" width={1000} height={1000} className={styles.iconImage} alt="Icon Image" />
                                <div className={styles.iconText}>Arabic Dishes</div>
                            </div>
                            <div className={styles.iconItem}>
                                <Image src="/icon3.png" width={1000} height={1000} className={styles.iconImage} alt="Icon Image" />
                                <div className={styles.iconText}>Booking Seat</div>
                            </div>
                        </div>
                        <div className={styles.paragraph}>
                            Experience an authentic Arabic restaurant offering traditional meals and aromatic Arabic tea. Enjoy the convenience of advance seat booking for a seamless dining experience.
                        </div>  
                    </div>
                    
                </div>
            </div>

            <CustomerNavbarBottom />
        </>
    )


}