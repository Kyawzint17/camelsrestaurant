import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import styles from '@/styles/booking.module.css';
import React, { useState } from 'react';

const user = {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '123-456-7890',
    email: 'john.doe@example.com',
    bookingDate: '2024-07-20',
    bookingTime: '19:00',
    tableNumber: ['12','1'],
    externalMessage: 'History, formerly and commonly known as the History Channel, is an American pay television network and flagship channel owned by A&E Networks, a joint venture between Hearst Communications and The Walt Disney Company General Entertainment Content Division.',
    status: 'Pending',
    order: [
        { name: 'Grilled Chicken', quantity: 2, price: '$12.99' },
        { name: 'Lemonade', quantity: 3, price: '$3.99' }
    ]
};

export default function customerBookList() {

    const [bookingFee, setBookingFee] = useState(5.00);
    const calculateTotal = () => {
        const orderTotal = user.order.reduce((total, item) => total + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
        return (orderTotal + bookingFee).toFixed(2);
    };

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.bookingPage}>
                    <div className={styles.container}>
                        <div className={styles.head}> BOOKING INFO </div>
                            <div className={styles.calendarContainer}>
                                <div className={styles.squareBox5}>
                                    <div className={styles.bookingDetails}>
                                            <div className={styles.section}>
                                                <h3>Contact Information</h3>
                                                <div className={styles.contactRow}>
                                                    <p>First Name: {user.firstName}</p>
                                                    <p>Last Name: {user.lastName}</p>
                                                </div>
                                                <p>Phone Number: {user.phoneNumber}</p>
                                                <p>Email: {user.email}</p>
                                            </div>
                                            <div className={styles.section}>
                                                <h3>Booking Date and Time</h3>
                                                <div className={styles.contactRow}>
                                                    <p>Date: {user.bookingDate}</p>
                                                    <p>Time: {user.bookingTime}</p>
                                                </div>
                                            </div>
                                            <div className={styles.section}>
                                                <h3>Table Reservation</h3>
                                                <p>Number of Seats: {user.tableNumber.length}</p>
                                                <p>Seats Booked: {user.tableNumber.join(', ')}</p>
                                                <p>Message: {user.externalMessage}</p>
                                                <p>Status: {user.status}</p>
                                                <p>Status Message: {user.status}</p>
                                            </div>
                                    </div>
                                    <div className={styles.billSummary}>
                                            <h2>Order Summary</h2>
                                            <ul>
                                                {user.order.map((item, index) => (
                                                    <li key={index}>
                                                        <div className={styles.itemInfo}>
                                                            <span>{item.quantity} x {item.name} = {item.price}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className={styles.fee}>
                                                <span>Booking Fee: ${bookingFee.toFixed(2)}</span>
                                            </div>
                                            <h3>Total: ${calculateTotal()}</h3>
                                            <button className={styles.cancelButton}>CANCEL</button>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            <CustomerNavbarBottom />
        </>
    )


}