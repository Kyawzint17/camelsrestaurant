import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import styles from '@/styles/gallery.module.css';


export default function CustomerGallery() {

    return (
        <>
            <CustomerNavbar />
            <div className={styles['background']}>
                <div className={styles['galleryPage']}>
                    <div className={styles.head}> GALLERY </div>
                    <div className={styles.container}>
                        
                        <div className={styles.textBox}>
                                <div className={styles.title} >RESTAURANT</div>
                        </div> 
                        <div className={styles.box2}>
                            <Image src="/front.jpg" width={1000} height={1000} className={styles.galleryImageBig} alt="Gallery Image"/>  
                            <Image src="/above.jpg" width={1000} height={1000} className={styles.galleryImage} alt="Gallery Image" />
                            <Image src="/inside.jpg" width={1000} height={1000} className={styles.galleryImage} alt="Gallery Image" />
                        </div>
                        
                    </div>
                    <div className={styles.container2}>
                        <div className={styles.textBox2}>
                            <div className={styles.title2}>PARKING & CAMELS</div>
                        </div>
                        <div className={styles.box3}>
                            <Image src="/2camels.jpg" width={1000} height={1000} className={styles.galleryImage2} alt="Gallery Image" />
                            <Image src="/3cars.jpg" width={1000} height={1000} className={styles.galleryImage2} alt="Gallery Image" />
                        </div>
                        <div className={styles.box4}>
                            <Image src="/park.jpg" width={1000} height={1000} className={styles.galleryImage2} alt="Gallery Image" />
                            <Image src="/park2.jpg" width={1000} height={1000} className={styles.galleryImage2} alt="Gallery Image" />
                        </div>
                    </div>
                    <div className={styles.container3}>
                        <div className={styles.textBox3}>
                            <div className={styles.title2}>PARK & RESTAURANT</div>
                        </div>
                        <div className={styles.box5}>
                            <Image src="/p4rk.jpg" width={1000} height={1000} className={styles.galleryImage3} alt="Gallery Image"/>
                            <Image src="/p4rk2.jpg" width={1000} height={1000} className={styles.galleryImage3} alt="Gallery Image"/>
                        </div>
                        <div className={styles.box6}>
                            <Image src="/restaurant.jpg" width={1000} height={1000} className={styles.galleryImage3} alt="Gallery Image"/>
                            <Image src="/restaurant2.jpg" width={1000} height={1000} className={styles.galleryImage3} alt="Gallery Image"/>
                        </div>
                        <div className={styles.box7}>
                            <Image src="/room.jpg" width={1000} height={1000} className={styles.galleryImage3} alt="Gallery Image"/>
                            <Image src="/room2.jpg" width={1000} height={1000} className={styles.galleryImage3} alt="Gallery Image"/>
                        </div>
                    </div>
                </div>
            </div>
            
            <CustomerNavbarBottom />
        </>
    )


}