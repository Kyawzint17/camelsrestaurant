import { useState } from 'react';
import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import Image from "next/image";
import styles from '@/styles/gallery.module.css';


export default function CustomerGallery() {
    const [modalImage, setModalImage] = useState(null);
    const [modalSubtitle, setModalSubtitle] = useState('');

    const handleImageClick = (src, subtitle) => {
        setModalImage(src);
        setModalSubtitle(subtitle);
    };
    
    const handleCloseModal = () => {
        setModalImage(null);
        setModalSubtitle('');
    };
    return (
        <>
            <AdminNavbar />
            <div className={styles['background']}>
                <div className={styles['galleryPage']}>
                    <div className={styles.head}> GALLERY </div>
                    
                    <div className={styles.container}>
                        <div className={styles.textBox}>
                            <div className={styles.title}>RESTAURANT</div>
                        </div>
                        <div className={styles.box2}>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/front.jpg', 'Restaurant Front')}>
                                <Image src="/front.jpg" width={1000} height={1000} className={styles.galleryImageBig} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Restaurant Front</div>
                            </div>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/above.jpg', 'Restaurant Above')}>
                                <Image src="/above.jpg" width={1000} height={1000} className={styles.galleryImage} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Restaurant Above</div>
                            </div>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/inside.jpg', 'Restaurant Inside')}>
                                <Image src="/inside.jpg" width={1000} height={1000} className={styles.galleryImage} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Restaurant Inside</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.container2}>
                        <div className={styles.textBox2}>
                            <div className={styles.title2}>PARKING & CAMELS</div>
                        </div>
                        <div className={styles.box3}>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/2camels.jpg', 'Camels')}>
                                <Image src="/2camels.jpg" width={1000} height={1000} className={styles.galleryImage2} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Camels</div>
                            </div>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/3cars.jpg', 'Cars')}>
                                <Image src="/3cars.jpg" width={1000} height={1000} className={styles.galleryImage2} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Cars</div>
                            </div>
                        </div>
                        <div className={styles.box4}>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/park.jpg', 'Parking')}>
                                <Image src="/park.jpg" width={1000} height={1000} className={styles.galleryImage2} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Parking</div>
                            </div>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/park2.jpg', 'Parking 2')}>
                                <Image src="/park2.jpg" width={1000} height={1000} className={styles.galleryImage2} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Parking 2</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.container3}>
                        <div className={styles.textBox3}>
                            <div className={styles.title2}>PARK & RESTAURANT</div>
                        </div>
                        <div className={styles.box5}>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/p4rk.jpg', 'Park')}>
                                <Image src="/p4rk.jpg" width={1000} height={1000} className={styles.galleryImage3} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Park</div>
                            </div>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/p4rk2.jpg', 'Park 2')}>
                                <Image src="/p4rk2.jpg" width={1000} height={1000} className={styles.galleryImage3} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Park 2</div>
                            </div>
                        </div>
                        <div className={styles.box6}>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/restaurant.jpg', 'Restaurant')}>
                                <Image src="/restaurant.jpg" width={1000} height={1000} className={styles.galleryImage3} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Restaurant</div>
                            </div>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/restaurant2.jpg', 'Restaurant 2')}>
                                <Image src="/restaurant2.jpg" width={1000} height={1000} className={styles.galleryImage3} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Restaurant 2</div>
                            </div>
                        </div>
                        <div className={styles.box7}>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/room.jpg', 'Room')}>
                                <Image src="/room.jpg" width={1000} height={1000} className={styles.galleryImage3} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Room</div>
                            </div>
                            <div className={styles.galleryImageContainer} onClick={() => handleImageClick('/room2.jpg', 'Room 2')}>
                                <Image src="/room2.jpg" width={1000} height={1000} className={styles.galleryImage3} alt="Gallery Image"/>
                                <div className={styles.subtitle}>Room 2</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {modalImage && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
                        <Image 
                            src={modalImage} 
                            className={styles.modalImage} 
                            alt="Modal Image" 
                            layout="responsive" 
                            width={1000} // Adjust the width as needed
                            height={1000} // Adjust the height as needed
                        />
                        <div className={styles.subtitle}>{modalSubtitle}</div>
                    </div>
                </div>
            )}
            
            <AdminNavbarBottom /> 
        </>
    )


}