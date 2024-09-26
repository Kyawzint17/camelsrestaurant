import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/booking.module.css';
import { db, storage } from "@/pages/lib/firebase"; // Ensure this path is correct
import { collection, getDocs, deleteDoc, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function paymentForm() {

    const router = useRouter();
    const { bookingId } = router.query;
    const [bookingFee, setBookingFee] = useState(0);
    const [bookingDetails, setBookingDetails] = useState(null); // Store date, time, and seats
    const [order, setOrder] = useState([]);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const calculateTotal = () => {
        return order.reduce((total, item) => total + (parseFloat(item.price.toString().replace('$', '')) * item.quantity), 0).toFixed(2);
      };

  
    
      useEffect(() => {
        const fetchBookingData = async () => {
            if (bookingId) {
                try {
                    const reservedSeatsRef = collection(db, 'camels', 'camelsrestaurant', 'reservedSeats');
                    const seatDocRef = doc(reservedSeatsRef, bookingId);
                    const seatDoc = await getDoc(seatDocRef);
  
                    if (seatDoc.exists()) {
                        setBookingDetails(seatDoc.data()); // Set booking details
                        setOrder(seatDoc.data().menuOrders || []); // Load menu orders
                        setBookingFee(seatDoc.data().totalBookingFee || 0); // Fetch totalBookingFee
                    } else {
                        console.error('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching booking details: ', error);
                }
            }
        };
        

        fetchBookingData();
    }, [bookingId]); // Run effect when bookingId changes

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.bookingPage}>
                    <div className={styles.paymentContainer}>
                        <div className={styles.head}> Payment Form </div>
                        <div className={styles.calendarContainer}>
                            <div className={styles.squareBox4}>
                                <div className={styles.paymentDetails}>
                                    <div className={styles.contact}>
                                            <h3>Contact Information</h3>
                                            <form>
                                                <div className={styles.pformGroup}>
                                                    <label htmlFor="firstName">First Name</label>
                                                    <input type="text" id="firstName" name="firstName" />
                                                </div>
                                                <div className={styles.pformGroup}>
                                                    <label htmlFor="lastName">Last Name</label>
                                                    <input type="text" id="lastName" name="lastName" />
                                                </div>
                                                <div className={styles.pformGroup}>
                                                    <label htmlFor="phone">Phone Number</label>
                                                    <input type="tel" id="phone" name="phone" />
                                                </div>
                                            </form>
                                        </div>
                                        <div className={styles.payment}>
                                            <h3>QR Code Payment</h3>
                                            <form>  
                                                <div className={styles.pformGroup}>
                                                    <div className={styles.qrCodeWrapper}>
                                                        {/* Display your PromptPay QR code here */}
                                                        <label>Scan the QR code to make the payment.</label>
                                                        <Image 
                                                            src="/qrc0de.png" 
                                                            alt="PromptPay QR Code" 
                                                            width={300} 
                                                            height={300}
                                                        />
                                                    </div>
                                                </div>
                                                <div className={styles.pformGroup}>
                                                    <label htmlFor="transactionId">Receipt Picture Upload</label>
                                                    <input type="file" className={styles['btext2']} onChange={handleImageChange} />
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
                                                        <span>{item.quantity} x {item.title} = {item.price}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <h6 className={styles.fee}>
                                            <span>Total (Pay at Restaurant): ฿{calculateTotal()}</span>
                                        </h6>
                                        <div className={styles.seatDisplay}>
                                            <h3>Booking Fee: ฿{bookingFee.toFixed(2)}</h3>
                                                {bookingDetails ? (
                                                <>
                                                    <div className={styles.dateTimeContainer}>
                                                        <div className={styles.dateBox}>
                                                            <h3>Date: {bookingDetails.date}</h3>
                                                        </div>
                                                        <div className={styles.timeBox}>
                                                            <h3>Time: {bookingDetails.timeSlot}</h3>
                                                        </div>
                                                    </div>
                                                    <div className={styles.detailsContainer}>
                                                        <div className={styles.detailsItem}>
                                                            <span className={styles.detailsIcon}>🪑</span>
                                                            <div className={styles.cantainer}>
                                                                <h4>Number of seats:</h4>
                                                                <div className={styles.detailsText}>
                                                                    <span>{bookingDetails.selectedSeats.length}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={styles.detailsItem}>
                                                            <span className={styles.detailsIcon}>📍</span>
                                                            <div className={styles.cantainer}>
                                                            <h4>Selected seats:</h4>
                                                            <div className={styles.detailsText}>
                                                                <span>{bookingDetails.selectedSeats.join(', ')}</span>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        <div className={styles.detailsItem}>
                                                            <span className={styles.detailsIcon}>💸</span>
                                                            <div className={styles.cantainer}>
                                                            <h4>Booking fees:</h4>
                                                            <div className={styles.detailsText}>
                                                                <span>฿{bookingDetails.totalBookingFee}</span>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        <div className={styles.detailsItem}>
                                                            <span className={styles.detailsIcon}>💬</span>
                                                            <div className={styles.cantainer}>
                                                            <h4>Message:</h4>
                                                            <div className={styles.detailsText}>
                                                                <span>{bookingDetails.message}</span>
                                                            </div>
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                </>
                                                ) : (
                                                    <p>Loading booking details...</p>
                                                )}

                                        </div>
                                        
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