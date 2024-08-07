import CustomerNavbar from "@/components/customerNavbar";
import Image from "next/image";
import styles from '@/styles/aboutus.module.css';


export default function Aboutus() {

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.aboutPage}>
                    <div className={styles.head}> ABOUT US </div>
                </div>
            </div>
            

        </>
    )


}