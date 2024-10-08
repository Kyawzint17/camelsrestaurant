import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import styles from '@/styles/booking.module.css';
import React, { useState, useEffect } from 'react';
import { db, storage } from "@/lib/firebase"; // Ensure this path is correct
import { collection, getDocs, query, where, getDoc, doc,  updateDoc, deleteDoc  } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useRouter } from 'next/router';
import { onAuthStateChanged } from "firebase/auth";

export default function customerBookList() {

    const [bookingFee, setBookingFee] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [order, setOrder] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true); 
    
    useEffect(() => {
        const auth = getAuth();
    
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email); // Set user email if authenticated
            } else {
                setUserEmail(null); // Reset user email if not authenticated
            }
        });
    
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!userEmail) return; // Only fetch if userEmail is set
            setLoading(true); // Set loading to true while fetching
            try {
                const bookingsRef = collection(db, 'camels', 'camelsrestaurant', 'reservedSeats');
                const q = query(bookingsRef, where("email", "==", userEmail));
                const querySnapshot = await getDocs(q);
    
                const bookings = [];
                querySnapshot.forEach((doc) => {
                    const bookingData = { id: doc.id, ...doc.data() };
                    bookings.push(bookingData); // Collect all bookings
                });
    
                // Sort bookings to get the latest one (assuming there is a timestamp field)
                const latestBooking = bookings.sort((a, b) => b.createdAt - a.createdAt)[0]; // Assuming createdAt is a timestamp
    
                if (latestBooking) {
                    setBookingId(latestBooking.id);
                    setUser({
                        firstName: latestBooking.firstName || 'N/A',
                        lastName: latestBooking.lastName || 'N/A',
                        phone: latestBooking.phone || 'N/A',
                        email: userEmail,
                        date: latestBooking.date || 'N/A',
                        timeSlot: latestBooking.timeSlot || 'N/A',
                        selectedSeats: latestBooking.selectedSeats || [],
                        message: latestBooking.message || 'N/A',
                        menuOrders: latestBooking.menuOrders || [],
                        bookingStatus: latestBooking.bookingStatus || 'N/A',
                        totalbookingFee: latestBooking.totalBookingFee || 0,
                        amount: latestBooking.amount || 0,
                    });
                } else {
                    // Handle case with no bookings
                    setUser({
                        firstName: 'N/A',
                        lastName: 'N/A',
                        phone: 'N/A',
                        email: userEmail,
                        date: 'N/A',
                        timeSlot: 'N/A',
                        selectedSeats: [],
                        menuOrders: [],
                        message: 'N/A',
                        bookingStatus: 'N/A',
                        totalbookingFee: 0,
                        amount: 0,
                    });
                }
    
                setOrder(bookings); // Set the bookings data
            } catch (error) {
                console.error('Error fetching bookings: ', error);
            } finally {
                setLoading(false); // Ensure loading is set to false after fetching
            }
        };
    
        fetchBookings();
    }, [userEmail]);
    
    
    

    const calculateTotal = () => {
        // Check if order is an array and has elements
        return Array.isArray(user.menuOrders) && user.menuOrders.length > 0
            ? user.menuOrders.reduce((total, item) => {
                // Check if item.price and item.quantity are defined and valid
                const price = parseFloat(item.price?.toString().replace('฿', '') || 0);
                const quantity = item.quantity || 0; // Fallback to 0 if quantity is undefined
                return total + (price * quantity);
            }, 0).toFixed(2)
            : '0.00'; // Return '0.00' if order is empty
    };
    

    const handleSubmit = async () => {
        // Ensure the image is uploaded
        if (imageFile) {
            try {
                await handleImageUpload();
                alert("Receipt uploaded successfully!");
                setModalVisible(false); // Close the modal after submission
            } catch (error) {
                console.error("Error submitting receipt: ", error);
                alert("Failed to upload receipt. Please try again.");
            }
        } else {
            alert("Please select a file before submitting.");
        }
    };
    

    const handleImageUpload = async () => {
        if (!imageFile) return; // Ensure file exists
    
        try {
            // Create a reference to Firebase Storage with a unique file name
            const storageRef = ref(storage, `receipt/${userEmail}_${Date.now()}`);
            
            // Upload the image file
            const snapshot = await uploadBytes(storageRef, imageFile);
    
            // Get the image's download URL
            const imageUrl = await getDownloadURL(snapshot.ref);
    
            // Update Firestore with the new image URL
            await updateReceiptImage(imageUrl);
        } catch (error) {
            console.error("Error uploading image: ", error);
            alert("Failed to upload image.");
        }
    };
    

    const updateReceiptImage = async (newImageUrl) => {
        if (!bookingId) {
            console.error("No booking ID found.");
            return;
        }
    
        try {
            // Reference to the specific booking document
            const bookingDocRef = doc(db, 'camels', 'camelsrestaurant', 'reservedSeats', bookingId);
    
            // Update the receiptImage field in the document with the new image URL
            await updateDoc(bookingDocRef, {
                receiptImage: newImageUrl // Replace old image with the new one
            });
    
            console.log("Receipt image updated successfully.");
        } catch (error) {
            console.error("Error updating receipt image: ", error);
        }
    };

    const handleCancel = async () => {
        try {
            if (!userEmail) {
                console.error("User email is missing.");
                return;
            }
    
            const bookingsRef = collection(db, 'camels', 'camelsrestaurant', 'reservedSeats'); // Reference to the bookings collection
    
            // Query to find bookings where the email matches the user's email
            const q = query(bookingsRef, where("email", "==", userEmail));
    
            const querySnapshot = await getDocs(q); // Get all bookings that match the query
    
            if (!querySnapshot.empty) {
                let cancelledCount = 0; // Initialize a counter for cancelled bookings
    
                // Iterate through each matched booking
                for (const docSnapshot of querySnapshot.docs) {
                    const bookingId = docSnapshot.id; // Get the booking document ID
                    const bookingData = docSnapshot.data(); // Get the booking data
    
                    const bookingTime = bookingData.timeSlot; // Extract booking time
                    const bookingDate = bookingData.date; // Extract booking date
    
                    // Update the booking status to "Cancelled"
                    await updateDoc(docSnapshot.ref, {
                        bookingStatus: "Cancelled"
                    });
    
                    console.log(`Booking ${bookingId} has been cancelled successfully.`);
    
                    // Construct the seat ID based on the booking details
                    const seatId = `${bookingDate}_${bookingTime}_${userEmail}`;
    
                    // Reference to the seats collection
                    const seatsRef = collection(db, 'camels', 'camelsrestaurant', 'seats');
    
                    // Create a document reference using seatId
                    const seatDocRef = doc(seatsRef, seatId);
    
                    // Check if the seat document exists
                    const seatDocSnapshot = await getDoc(seatDocRef);
    
                    if (seatDocSnapshot.exists()) {
                        // If the seat exists, delete it
                        await deleteDoc(seatDocRef);
                        console.log(`Seat ${seatId} has been deleted successfully.`);
                    } else {
                        console.error("No seat found matching the provided details.");
                    }
    
                    cancelledCount++; // Increment the counter for each cancelled booking
                }
    
                if (cancelledCount > 0) {
                    alert("Your seat reservations have been successfully cancelled.");
                }
    
                await updateBookingsCollection(userEmail); // Call to update bookings
                setCancelModalVisible(false); // Close the cancel modal after operation
            } else {
                console.error("No bookings found for the provided email.");
            }
        } catch (error) {
            console.error("Error cancelling booking: ", error);
        }
    };
    
    
    
    // Function to update the bookings collection based on email in documents
    const updateBookingsCollection = async (email) => {
        try {
            const bookingsRef = collection(db, 'camels', 'camelsrestaurant', 'bookings'); // Reference to the bookings collection

            const querySnapshot = await getDocs(bookingsRef); // Get all documents in the bookings collection

            if (!querySnapshot.empty) {
                // Iterate through each booking document
                for (const docSnapshot of querySnapshot.docs) {
                    const bookingData = docSnapshot.data(); // Get the booking data

                    // Check if the email field matches
                    if (bookingData.email === email) {
                        // Update the booking status to "Cancelled"
                        await deleteDoc(docSnapshot.ref);
                        console.log(`Booking ${docSnapshot.id} has been updated to cancelled successfully.`);
                    }
                }
            } else {
                console.error("No bookings found in the collection.");
            }
        } catch (error) {
            console.error("Error updating bookings: ", error);
        }
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
                                                    <p>First Name: {user.firstName }</p>
                                                    <p>Last Name: {user.lastName }</p>
                                                </div>
                                                <p>Phone Number: {user.phone }</p>
                                                <p>Email: {user.email }</p>
                                            </div>
                                            <div className={styles.section}>
                                                <h3>Booking Date and Time</h3>
                                                <div className={styles.contactRow}>
                                                    <p>Date: {user.date}</p>
                                                    <p>Time: {user.timeSlot}</p>
                                                </div>
                                            </div>
                                            <div className={styles.section}>
                                                <h3>Table Reservation</h3>
                                                <p>Number of Seats: {user.selectedSeats?.length || 0}</p> {/* Safely access length */}
                                                <p>Seats Booked: {user.selectedSeats && user.selectedSeats.join(', ')}</p>
                                                <p>Message: {user.message}</p>
                                                <p>Status: {user.bookingStatus}
                                                {user.bookingStatus === "Payment Incomplete" && (
                                                    <button className={styles.viewButton} onClick={() => setModalVisible(true)}>View</button>
                                                )}
                                                </p>
                                                <p>Status Message: {user.status}</p>
                                            </div>
                                    </div>
                                    <div className={styles.billSummary}>
                                            <h2>Order Summary</h2>
                                            <ul>
                                                {user.menuOrders && user.menuOrders.length > 0 ? (
                                                    user.menuOrders.map((order, index) => (
                                                        <li key={index}>{order.quantity} x {order.title} = {order.price}</li>
                                                    ))
                                                ) : (
                                                    <li>No menu orders placed.</li>
                                                )}
                                            </ul>
                                            <div className={styles.fee}>
                                                <span>Booking Fee: ฿{user.totalbookingFee}</span>
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
                                            <strong>Reservation Limitations:</strong> Customers can make a new reservation only if their previous booking status is 𝘾𝙤𝙣𝙛𝙞𝙧𝙢𝙚𝙙, 𝘿𝙚𝙘𝙡𝙞𝙣𝙚𝙙, or 𝘾𝙖𝙣𝙘𝙚𝙡𝙡𝙚𝙙. However, status of 𝙍𝙚𝙨𝙚𝙧𝙫𝙚𝙙 or 𝙋𝙖𝙮𝙢𝙚𝙣𝙩 𝙄𝙣𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙚 will prevent new reservations.
                                        </li>
                                        <li>
                                            <strong>24-Hour Payment Reminder:</strong> Customers will have 𝟐𝟒 hours to pay the remaining booking fee if the initial booking payment is insufficient as status will be shown as 𝙋𝙖𝙮𝙢𝙚𝙣𝙩 𝙄𝙣𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙚.
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
                            <label htmlFor="imageUpload">Upload Receipt (Remaining Amount: ฿{user.amount})</label>
                            <input
                                type="file"
                                id="imageUpload"
                                name="imageUpload"
                                accept="image/*"
                                onChange={(event) => setImageFile(event.target.files[0])}   
                            />
                        </div>
                        <div className={styles.modalButtons}>
                            <button className={styles.ccloseButton} onClick={() => setModalVisible(false)}>Close</button>
                            <button className={styles.ssubmitButton} onClick={handleSubmit}>Submit</button> {/* Add Submit Button */}
                        </div>
                    </div>
                </div>
            )}

            {cancelModalVisible && (
                <div className={styles.cancelmodal}>
                    <div className={styles.cancelmodalContent}>
                        <h3>Are you sure you want to cancel your booking?</h3>
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelconfirmButton} onClick={() => handleCancel()}>Yes, Cancel</button>
                            <button className={styles.noButton} onClick={() => setCancelModalVisible(false)}>No, Go Back</button>
                        </div>
                    </div>
                </div>
            )}

            <CustomerNavbarBottom />
        </>
    )


}