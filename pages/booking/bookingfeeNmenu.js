import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/booking.module.css';
import Link from "next/link";

export default function bookingfeeNmenu() {
    const [menuPreorder, setMenuPreorder] = useState(null);
    const [agreement, setAgreement] = useState(false);
    const router = useRouter();

    const handleMenuPreorderChange = (e) => {
        setMenuPreorder(e.target.value);
    };

    const handleAgreementChange = (e) => {
        setAgreement(e.target.checked);
    };

    const handleNextButtonClick = () => {
        if (agreement && menuPreorder) {
            if (menuPreorder === 'yes') {
                router.push({
                    pathname: '/booking/menuOrder',
                    query: { menuPreorder, agreement }
                });
            } else {
                router.push({
                    pathname: '/booking/paymentForm',
                    query: { menuPreorder, agreement }
                });
            }
        } else {
            alert('You must agree to the terms and conditions and select a menu preorder option to proceed.');
        }
    };

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.bookingPage}>
                    <div className={styles.container}>
                        <div className={styles.head}> Booking Fees & Menu Preorder </div>
                        <div className={styles.calendarContainer}>
                            
                            <div className={styles.squareBox2}>
                                <p className={styles.paragraph}>
                                    Please note that there is a booking fee of $50. If you are more than 15 minutes late after the booking time, your seat will be cancelled by the admin.
                                </p>

                                <div className={styles.formRow}>
                                    <div className={styles.agreementSection}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={agreement}
                                                onChange={handleAgreementChange}
                                            />
                                            I agree to the terms and conditions
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.formRow2}>
                                    <div className={styles.preorderSection}>
                                        <p>Would you like to preorder your menu?</p>
                                    </div>
                                </div>

                                <div className={styles.formRow2}>
                                    <div className={styles.preorderOptions}>
                                        <label>
                                            <input
                                                type="radio"
                                                value="yes"
                                                checked={menuPreorder === 'yes'}
                                                onChange={handleMenuPreorderChange}
                                            />
                                            Yes
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                value="no"
                                                checked={menuPreorder === 'no'}
                                                onChange={handleMenuPreorderChange}
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>

                            </div>
                            
                            <div className={styles.buttonContainer1}>
                                <Link href={'/booking/seatSelection'}>
                                <button className={styles.navButton2}>BACK</button>
                                </Link>
                                
                                <button className={styles.navButton2} onClick={handleNextButtonClick}>NEXT</button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>

            <CustomerNavbarBottom />
        </>
    );
}