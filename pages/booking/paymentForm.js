import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/booking.module.css';
import Link from "next/link";

export default function paymentForm() {

    const order = [
        { name: 'Grilled Chicken', quantity: 2, price: '$12.99' },
        { name: 'Lemonade', quantity: 3, price: '$3.99' }
    ];
    
    const [bookingFee, setBookingFee] = useState(5.00);

    const calculateTotal = () => {
        const orderTotal = order.reduce((total, item) => total + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
        return (orderTotal + bookingFee).toFixed(2);
    };

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.bookingPage}>
                    <div className={styles.container}>
                        <div className={styles.head}> Payment Form </div>
                        <div className={styles.calendarContainer}>
                            
                            <div className={styles.squareBox4}>
                                <div className={styles.paymentDetails}>
                                    <div className={styles.contact}>
                                            <h3>Contact Information</h3>
                                            <form>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="firstName">First Name</label>
                                                    <input type="text" id="firstName" name="firstName" />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="lastName">Last Name</label>
                                                    <input type="text" id="lastName" name="lastName" />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="email">Email</label>
                                                    <input type="email" id="email" name="email" />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="phone">Phone Number</label>
                                                    <input type="tel" id="phone" name="phone" />
                                                </div>
                                            </form>
                                        </div>
                                        <div className={styles.payment}>
                                            <h3>Payment Information</h3>
                                            <form>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="cardNumber">Card Number</label>
                                                    <input type="text" id="cardNumber" name="cardNumber" />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="cardName">Name on Card</label>
                                                    <input type="text" id="cardName" name="cardName" />
                                                </div>
                                                <div className={styles.formRow}>
                                                    <div className={styles.formGroup}>
                                                        <label htmlFor="expiryDate">Expiration Date</label>
                                                        <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" />
                                                    </div>
                                                    <div className={styles.formGroup}>
                                                        <label htmlFor="cvv">CVV</label>
                                                        <input type="text" id="cvv" name="cvv" />
                                                    </div>
                                                </div>
                                                
                                            </form>
                                        </div>
                                    </div>
                                    <div className={styles.totalBill}>
                                        <h2>Order Summary</h2>
                                        <ul>
                                            {order.map((item, index) => (
                                                <li key={index}>
                                                    <div className={styles.itemInfo}>
                                                        <span>{item.quantity} x {item.name} = {item.price}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <h6 className={styles.fee}>
                                            <span>Booking Fee: ${bookingFee.toFixed(2)}</span>
                                        </h6>
                                        <h3>Total: ${calculateTotal()}</h3>
                                    </div>
                                </div>
                                <div className={styles.buttonContainer3}>
                                    <Link href={'/booking/menuOrder'}>
                                    <button className={styles.navButton4}>BACK</button>
                                    </Link>
                                    
                                    <button className={styles.navButton4}>CONFIRM</button>
                                
                                </div>
                            </div>
                        
                    </div>
                </div>
            </div>

            <CustomerNavbarBottom />
        </>
    );
}