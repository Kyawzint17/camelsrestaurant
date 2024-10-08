import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import styles from '@/styles/booking.module.css';
import React, { useState, useEffect } from 'react';
import { db } from "@/pages/lib/firebase"; // Ensure this path is correct
import { collection, getDocs, query, where, getDoc, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function CustomerBookList() {
    const [userEmail, setUserEmail] = useState("");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserEmail(user.email); // Set user email if authenticated
            console.log("User email:", user.email); // Add this line
          } else {
            setUserEmail(null); // Reset user email if not authenticated
          }
        });
        return () => unsubscribe(); // Cleanup subscription on unmount
      }, []);

      useEffect(() => {
        const fetchBookings = async () => {
          if (!userEmail) return; // Only fetch if userEmail is set
          try {
            const bookingsRef = collection(db, 'camels', 'camelsrestaurant', 'reservedSeats');
            const q = query(bookingsRef, where("email", "==", userEmail));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const fetchedBookings = [];
              querySnapshot.forEach((doc) => {
                const bookingData = { id: doc.id, ...doc.data() };
                fetchedBookings.push(bookingData); // Collect all bookings
              });
              console.log("Fetched bookings:", fetchedBookings); // Add this line
              setBookings(fetchedBookings); // Set the bookings data
              setLoading(false); // Set loading to false after fetching
            });
            return unsubscribe; // Cleanup subscription on unmount
          } catch (error) {
            console.error('Error fetching bookings: ', error);
            setLoading(false);
          }
        };
        fetchBookings();
      }, [userEmail]);

      useEffect(() => {
        console.log("Bookings state updated:", bookings);
        }, [bookings]);

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.bookingPage}>
                    <div className={styles.bookingInfoContainer}>
                        <div className={styles.head}> BOOKING </div>
                        <div className={styles.listBox}>
                            
                            <h3>Booking List</h3>
                            {bookings.length > 0 ? (
                                <div key="bookings-list">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} >
                                            <div className={styles.listDetails}>
                                                <div className={styles.section}>
                                                    <div className={styles.contactRow}>
                                                        <p>Date: {booking.date}</p>
                                                        <p>Time: {booking.timeSlot}</p>
                                                        <p>Status: {booking.bookingStatus}</p>
                                                        <p>Seats: {booking.selectedSeats.join(", ")}</p>
                                                        <Link href={`/customer/bookDetails?bookingId=${booking.id}`}>
                                                            <a className={styles.bookingIdLink}>View Details</a> {/* Add a link for booking details */}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No bookings found.</p> // Message when no bookings are available
                            )}

                            </div>
                            
                        <div className={styles.policySquare}>
                            <div className={styles.policyHeader}>Booking Policy</div>
                            <ul className={styles.policyList}>
                                <li>
                                    <strong>Cancellation Policy:</strong> Customers are allowed to cancel their booking; however, the booking fees will not be refunded.
                                </li>
                                <li>
                                    <strong>Late Arrival:</strong> Reserved seats will be cancelled if customers arrive 30 minutes after the appointed time.
                                </li>
                                <li>
                                    <strong>Reservation Limitations:</strong> Customers can make a new reservation only if their previous booking status is 𝘾𝙤𝙢𝙥𝙡𝙚𝙩𝙚𝙙, 𝙈𝙞𝙨𝙨𝙚𝙙, or 𝘾𝙖𝙣𝙘𝙚𝙡𝙡𝙚𝙙. However, status of 𝙍𝙚𝙨𝙚𝙧𝙫𝙚𝙙 will prevent new reservations.
                                </li>
                                <li>
                                    <strong>24-Hour Payment Reminder:</strong> Customers will have 𝟐𝟒 hours to pay the remaining booking fee if the initial booking payment is insufficient as status will be shown as 𝙋𝙖𝙮𝙢𝙚𝙣𝙩 𝙄𝙣𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙚.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <CustomerNavbarBottom />
        </>
    );
}
