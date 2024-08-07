import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import styles from '@/styles/booking.module.css';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, startOfDay, isSameDay, parseISO } from 'date-fns';

// Sample data
const bookings = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phoneNumber: '123-456-7890', date: '2024-07-15', time: '19:00 - 19:00', tableNumber: ['12','1'], message: 'I have a gluten allergy.', status: 'Pending',  bookingFee: 'Paid', preorderMenu: 'Chicken Alfredo, Caesar Salad'},
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phoneNumber: '987-654-3210', date: '2024-07-18', time: '19:00 - 19:00', tableNumber: ['12','1'], message: 'It\'s a birthday celebration.', status: 'Pending' },
    { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', phoneNumber: '456-789-0123', date: '2024-07-18', time: '19:00 - 19:00', tableNumber: ['12','1'], message: 'Please prepare a vegetarian meal.', status: 'Pending' },
    { id: 4, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', phoneNumber: '456-789-0123', date: '2024-07-18', time: '19:00 - 19:00', tableNumber: ['12','1'], message: 'Please prepare a vegetarian meal.', status: 'Pending' },
    { id: 5, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', phoneNumber: '456-789-0123', date: '2024-07-19', time: '19:00 - 19:00', tableNumber: ['12','1','3'], message: 'Please prepare a vegetarian meal.', status: 'Pending' },
    { id: 6, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', phoneNumber: '456-789-0123', date: '2024-07-19', time: '19:00 - 19:00', tableNumber: ['12','1'], message: 'Please prepare a vegetarian meal.', status: 'Pending' },
    { id: 7, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', phoneNumber: '456-789-0123', date: '2024-07-19', time: '19:00 - 19:00', tableNumber: ['12','1'], message: 'Please prepare a vegetarian meal.', status: 'Pending' },
    { id: 8, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', phoneNumber: '456-789-0123', date: '2024-07-19', time: '19:00 - 19:00', tableNumber: ['12','1'], message: 'Please prepare a vegetarian meal.', status: 'Pending' },
    { id: 9, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', phoneNumber: '456-789-0123', date: '2024-07-19', time: '19:00 - 19:00', tableNumber: ['8'], message: 'Please prepare a vegetarian meal.', status: 'Pending' },

];

export default function BookingList() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filteredBookings, setFilteredBookings] = useState([]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const startOfSelectedDate = startOfDay(date); // Normalize the selected date
        const filtered = bookings.filter(booking => 
            isSameDay(startOfDay(parseISO(booking.date)), startOfSelectedDate)
        );
        setFilteredBookings(filtered);
    };

    // Function to determine if a date should be highlighted
    const tileClassName = ({ date }) => {
        const startOfDate = startOfDay(date); // Normalize the tile date
        const hasBooking = bookings.some(booking => 
          isSameDay(startOfDay(parseISO(booking.date)), startOfDate)
        );
        return hasBooking ? styles.highlightedDate : null;
      };
    
    return (
        <>
            <AdminNavbar />
            <div className={styles.backgroundbl}>
                <div className={styles.bookingPage}>
                    <div className={styles.containerbl}>
                        <div className={styles.head}>BOOKING LIST</div>
                        <div className={styles.calendarContainer}>
                            <div className={styles.squareBox6}>
                                <h3>Select a Date</h3>
                                <Calendar
                                    onChange={handleDateChange}
                                    value={selectedDate}
                                    className={styles.calendar}
                                    tileClassName={tileClassName}
                                />
                            </div>
                        </div>
                        <div className={styles.bookingListSection}>
                            <h3 className={styles.text}>Booking List</h3>
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <div key={booking.id} className={styles.bookingItem}>
                                        <div className={styles.section}>
                                            <h3 className={styles.header}>Booking Seat {booking.id}</h3>
                                            <div className={styles.details}>
                                                <div>
                                                    <p><strong>Booking ID:</strong> {booking.id}</p>
                                                    <p><strong>Name:</strong> {booking.firstName} {booking.lastName}</p>
                                                </div>
                                                <div>
                                                    <p><strong>Email:</strong> {booking.email}</p>
                                                    <p><strong>Phone Number:</strong> {booking.phoneNumber}</p>
                                                </div>
                                                <div>
                                                    <p><strong>No of Seats:</strong> {booking.tableNumber.length}</p>
                                                    <p><strong>Table No.:</strong> {booking.tableNumber.join(', ')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.section}>
                                            <div className={styles.header}>Details</div>
                                            <div className={styles.details}>
                                                <div>
                                                    <p><strong>Date:</strong> {booking.date}</p>
                                                    <p><strong>Time:</strong> {booking.time}</p>
                                                </div>
                                                <div>
                                                    <p><strong>Table No.:</strong> {booking.tableNumber}</p>
                                                    <p><strong>Booking Fee:</strong> 500 baht {booking.bookingFee || 'Not Paid'}</p>
                                                </div>
                                                <div>
                                                    <p><strong>Preorder Menu:</strong> {booking.preorderMenu || 'None'}</p>
                                                    <p><strong>Status:</strong> {booking.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.section}>
                                            <div className={styles.header}>Message</div>
                                            <div className={styles.message}>
                                                <p>{booking.message}</p>
                                            </div>
                                        </div>
                                        <div className={styles.buttonGroup}>
                                            <button className={styles.confirmButton}>Confirm</button>
                                            <button className={styles.declineButton}>Decline</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.text}>No bookings for the selected date.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <AdminNavbarBottom /> 
        </>
    );
}