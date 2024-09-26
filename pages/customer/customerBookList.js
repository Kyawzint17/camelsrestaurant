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
    bookingTime: '19:00 - 20:00 ',
    tableNumber: ['12','1'],
    externalMessage: 'History, formerly and commonly known as the History Channel, is an American pay television network and flagship channel owned by A&E Networks, a joint venture between Hearst Communications and The Walt Disney Company General Entertainment Content Division.',
    status: 'Payment Incomplete',
    bookingFees: '100',
    order: [
        { name: 'Grilled Chicken', quantity: 2, price: '฿12.99' },
        { name: 'Lemonade', quantity: 3, price: '฿3.99' }
    ],
    remainingbills: '100'
};

export default function customerBookList() {

    const [bookingFee, setBookingFee] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);

    const calculateTotal = () => {
        const orderTotal = user.order.reduce((total, item) => total + (parseFloat(item.price.replace('฿', '')) * item.quantity), 0);
        return (orderTotal).toFixed(2);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(URL.createObjectURL(file)); // Preview the uploaded image
        }
    };

    const handleCancel = () => {
        // Logic to cancel the booking goes here
        console.log("Booking has been canceled.");
        setCancelModalVisible(false); // Close the cancel modal
    };

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.bookingPage}>
                    <div className={styles.bookingInfoContainer}>
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
                                                <p>Status: {user.status}
                                                {user.status === 'Payment Incomplete' && (
                                                    <button className={styles.viewButton} onClick={() => setModalVisible(true)}>View</button>
                                                )}
                                                </p>
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
                                                <span>Booking Fee: ฿{user.bookingFees}</span>
                                            </div>
                                            <h3>Total(Pay at Restaurant): ฿{calculateTotal()}</h3>
                                            <button className={styles.cancelButton} onClick={() => setCancelModalVisible(true)}>CANCEL</button>
                                    </div>
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
                                            <strong>Reservation Limitations:</strong> Customers can make a new reservation only if their previous booking status is 𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙚𝙙, 𝙢𝙞𝙨𝙨𝙚𝙙, or 𝙘𝙖𝙣𝙘𝙚𝙡𝙡𝙚𝙙. However, statuses of 𝙥𝙚𝙣𝙙𝙞𝙣𝙜 or 𝙥𝙖𝙮𝙢𝙚𝙣𝙩 𝙞𝙣𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙚 will prevent new reservations.
                                        </li>
                                        <li>
                                            <strong>24-Hour Payment Reminder:</strong> Customers will have 𝟐𝟒 hours to pay the remaining booking fee if the initial booking payment is insufficient.
                                        </li>
                                    </ul>
                                </div>
                        </div>
                    </div>
                </div>
            </div>

            {modalVisible && (
                <div className={styles.cmodal}>
                    <div className={styles.cmodalContent}>
                        <div className={styles.qrCodeWrapper}>
                            <label>PromptPay QR Code</label>
                            <Image
                                src="/qrc0de.png"
                                alt="PromptPay QR Code"
                                width={300}
                                height={300}
                            />
                            <p>Please scan the QR code to make the payment.</p>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="imageUpload">Upload Receipt (Remaining Amount: ฿{user.remainingbills})</label>
                            <input
                                type="file"
                                id="imageUpload"
                                name="imageUpload"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            {imageFile && (
                                <div className={styles.imagePreview}>
                                    <h4>Uploaded Image:</h4>
                                    <Image
                                        src={imageFile}
                                        alt="Uploaded Receipt"
                                        width={300}
                                        height={300}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            )}
                        </div>
                        <button className={styles.ccloseButton} onClick={() => setModalVisible(false)}>Close</button>
                    </div>
                </div>
            )}

            {cancelModalVisible && (
                <div className={styles.cancelmodal}>
                    <div className={styles.cancelmodalContent}>
                        <h3>Are you sure you want to cancel your booking?</h3>
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelconfirmButton} onClick={handleCancel}>Yes, Cancel</button>
                            <button className={styles.noButton} onClick={() => setCancelModalVisible(false)}>No, Go Back</button>
                        </div>
                    </div>
                </div>
            )}

            <CustomerNavbarBottom />
        </>
    )


}