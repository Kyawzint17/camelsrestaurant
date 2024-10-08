// pages/BookingDetail.js
import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from "@/pages/lib/firebase"; // Ensure this path is correct
import { doc, getDoc } from "firebase/firestore";
import styles from '@/styles/booking.module.css'; // Create your CSS module

export default function BookingDetails() {
    const router = useRouter();
    const { bookingId } = router.query; // Get the booking ID from the URL
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookingDetail = async () => {
            if (!bookingId) return; // Ensure bookingId is available
            const bookingRef = doc(db, 'camels', 'camelsrestaurant', 'reservedSeats', bookingId);
            const bookingSnapshot = await getDoc(bookingRef);
            if (bookingSnapshot.exists()) {
                setBooking({ id: bookingSnapshot.id, ...bookingSnapshot.data() });
            } else {
                console.error("No such booking!");
            }
            setLoading(false);
        };

        fetchBookingDetail();
    }, [bookingId]);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.bookingPage}>
                    <div className={styles.bookingInfoContainer}>
                        <div className={styles.head}> BOOKING DETAIL </div>
                        <div className={styles.listBox}>
                            {booking ? (
                                <div key={booking.id}>
                                    <div className={styles.listDetails}>
                                        <div className={styles.section}>
                                            <div className={styles.contactRow}>
                                                <p>Date: {booking.date}</p>
                                                <p>Time: {booking.timeSlot}</p>
                                                <p>Status: {booking.bookingStatus}</p>
                                                <p>Seats: {booking.selectedSeats.join(", ")}</p>
                                                <p>Booking ID: {booking.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>No booking found.</p> // Message when no booking is available
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
