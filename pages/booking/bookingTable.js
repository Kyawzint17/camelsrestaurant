import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/booking.module.css';
import Link from "next/link";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, getDoc, deleteDoc } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; 
import { useRouter } from 'next/router';

export default function bookingTable() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchBookingData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (!user) {
                console.error("No user is currently logged in.");
                return;
            }
    
            const email = user.email;
            const existingBookingId = sessionStorage.getItem('bookingId');
    
            if (existingBookingId) {
                const bookingRef = doc(db, 'camels', 'camelsrestaurant', 'bookings', existingBookingId);
                try {
                    const bookingDoc = await getDoc(bookingRef);
    
                    if (bookingDoc.exists()) {
                        const bookingData = bookingDoc.data();
    
                        // Check if the booking belongs to the current user
                        if (bookingData.email === email) {
                            // Check the booking status and reset if needed
                            if (bookingData.bookingStatus === 'Cancelled' || bookingData.bookingStatus === 'Completed' || bookingData.bookingStatus === 'Incompleted') {
                                // Reset the booking data
                                sessionStorage.removeItem('bookingId');
                                setSelectedDate(null);
                                setSelectedTime(null);
                            } else {
                                // Set existing data
                                setSelectedDate(new Date(bookingData.date));
                                setSelectedTime(bookingData.timeSlot);
                            }
                        } else {
                            console.error("Booking does not belong to the current user.");
                            sessionStorage.removeItem('bookingId'); // Remove invalid bookingId from sessionStorage
                        }
                    } else {
                        console.error("No document found for the provided bookingId.");
                        sessionStorage.removeItem('bookingId'); // Remove invalid bookingId from sessionStorage
                    }
                } catch (error) {
                    console.error("Error fetching booking:", error);
                }
            }
        };
    
        fetchBookingData();
    }, []);
    
    
    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleNextClick = async () => {
        if (selectedDate && selectedTime) {
            try {
                const auth = getAuth(); 
                const user = auth.currentUser; 
        
                if (!user) {
                    console.error("No user is currently logged in.");
                    return;
                }
        
                const email = user.email; 
                const existingBookingId = sessionStorage.getItem('bookingId');
        
                // Convert date to local timezone format
                const localDate = new Date(selectedDate);
                const localDateString = localDate.toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD format
        
                if (existingBookingId) {
                    const bookingRef = doc(db, 'camels', 'camelsrestaurant', 'bookings', existingBookingId);
                    const bookingDoc = await getDoc(bookingRef);
    
                    if (bookingDoc.exists()) {
                        await updateDoc(bookingRef, {
                            date: localDateString, 
                            timeSlot: selectedTime,
                        });
                        console.log("Booking date and time updated successfully.");
                    } else {
                        console.error("No document found for the provided bookingId.");
                        sessionStorage.removeItem('bookingId'); // Remove invalid bookingId from sessionStorage
                    }
                } else {
                    // Create a new booking document with an auto-generated ID
                    const bookingRef = doc(db, 'camels', 'camelsrestaurant', 'bookings', Date.now().toString());
                    await setDoc(bookingRef, {
                        date: localDateString, 
                        timeSlot: selectedTime,
                        bookingStatus: 'Pending', 
                        email: email,
                    });
                    sessionStorage.setItem('bookingId', bookingRef.id);
                    console.log("Booking date and time uploaded successfully.");
                }
    
                router.push('/booking/seatSelection');
            } catch (error) {
                console.error("Error creating or updating booking:", error);
            }
        } else {
            alert("Please select both date and time before proceeding.");
        }
    };
    
    const handleCancelClick = async () => {
        const existingBookingId = sessionStorage.getItem('bookingId');
    
        if (existingBookingId) {
            try {
                const bookingRef = doc(db, 'camels', 'camelsrestaurant', 'bookings', existingBookingId);
                await deleteDoc(bookingRef); // Delete the document from Firestore
                console.log("Booking deleted successfully.");
    
                // Clear sessionStorage and reset state
                sessionStorage.removeItem('bookingId');
                setSelectedDate(null);
                setSelectedTime(null);
    
                // Optionally, navigate back to the customer home page
                console.log("Booking date and time deleted successfully.");
                router.push('/customer/customerHome');
            } catch (error) {
                console.error("Error deleting booking:", error);
            }
        } else {
            console.error("No booking found to delete.");
        }
    };
    

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.bookingPage}>
                    <div className={styles.container}>
                        <div className={styles.head}> BOOKING A TABLE </div>
                        <div className={styles.calendarContainer}>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="MMMM d, yyyy"
                                className={styles.datePicker}
                                inline
                                filterDate={(date) => {
                                    const day = date.getDay();
                                    // Disable Saturdays (6) and Sundays (0)
                                    return day !== 0 && day !== 6;
                                }}
                                minDate={new Date()} 
                            />
                            <div className={styles.squareBox}>
                                {selectedDate ? (
                                    <>
                                      <div>
                                            <div className={styles.displaySection}>
                                                <div className={styles.selectedDate}>
                                                        Selected Date: {selectedDate.toLocaleDateString()}
                                                </div>
                                                    {selectedTime && (
                                                        <div className={styles.selectedTime}>
                                                            | Selected Time: {selectedTime}
                                                        </div>
                                                    )}
                                            </div>
                                            <div className={styles.timeSections}>
                                                <div className={styles.timeSection}>
                                                    <div className={styles.sectionTitle}>Morning</div>
                                                    <button className={styles.timeButton} onClick={() => handleTimeSelect('08:00 - 10:00')}>08:00 - 10:00</button>
                                                    <button className={styles.timeButton} onClick={() => handleTimeSelect('10:00 - 12:00')}>10:00 - 12:00</button>
                                                    <button className={styles.timeButton} onClick={() => handleTimeSelect('12:00 - 14:00')}>12:00 - 14:00</button>
                                                </div>
                                                <div className={styles.timeSection}>
                                                    <div className={styles.sectionTitle}>Afternoon</div>
                                                    <button className={styles.timeButton} onClick={() => handleTimeSelect('14:00 - 16:00')}>14:00 - 16:00</button>
                                                    <button className={styles.timeButton} onClick={() => handleTimeSelect('16:00 - 18:00')}>16:00 - 18:00</button>
                                                    <button className={styles.timeButton} onClick={() => handleTimeSelect('18:00 - 20:00')}>18:00 - 20:00</button>
                                                </div>
                                                <div className={styles.timeSection}>
                                                    <div className={styles.sectionTitle}>Evening</div>
                                                    <button className={styles.timeButton} onClick={() => handleTimeSelect('20:00 - 22:00')}>20:00 - 22:00</button>
                                                    <button className={styles.timeButton} onClick={() => handleTimeSelect('22:00 - 00:00')}>22:00 - 00:00</button>
                                                    <button className={styles.timeButton} onClick={() => handleTimeSelect('00:00 - 02:00')}>00:00 - 02:00</button>
                                                </div>
                                            </div>
                                      </div>
                                        
                                    </>
                                    ) : (
                                        <div className={styles.promptText}>
                                            Select the date for booking
                                        </div>
                                )}
                            </div>
                            <div className={styles.buttonContainer}>
                                <Link href={'/customer/customerHome'}>
                                    <button className={styles.navButton} onClick={handleCancelClick}>CANCEL</button>
                                </Link>
                                <button className={styles.navButton} onClick={handleNextClick}>NEXT</button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>

            <CustomerNavbarBottom />
        </>
    );
}