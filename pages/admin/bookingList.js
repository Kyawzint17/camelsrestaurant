import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import styles from '@/styles/booking.module.css';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, startOfDay, isSameDay, parseISO } from 'date-fns';

// Sample data
const bookings = [
    {
        id: 1,
        firstName: 'John Doe',
        numberOfPeople: 2, 
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        totalNumberOfSeats: 2,
        tableNumber: ['12', '1'],
        date: '2024-09-24',
        timeSlot: '19:00 - 20:00',
        totalBookingFee: 200, // Assuming each seat costs 100
        imageUrl: '/receipt.png', // Updated path
        preorderMenu: ['Chicken Alfredo', 'Caesar Salad'],
        bookingStatus: 'Payment Incomplete',
        message: 'I have a gluten allergy.'
    },
    {
        id: 2,
        firstName: 'Jane Smith',
        numberOfPeople: 1,
        email: 'jane.smith@example.com',
        phoneNumber: '987-654-3210',
        totalNumberOfSeats: 1,
        tableNumber: ['12'],
        date: '2024-09-25',
        timeSlot: '19:00 - 20:00',
        totalBookingFee: 100, // Cost for one seat
        imageUrl: '/receipt.png', // Updated path
        preorderMenu: [],
        bookingStatus: 'Pending',
        message: 'It\'s a birthday celebration.'
    },
    {
        id: 3,
        firstName: 'Bob Johnson',
        numberOfPeople: 2, 
        email: 'bob.johnson@example.com',
        phoneNumber: '456-789-0123',
        totalNumberOfSeats: 2,
        tableNumber: ['12', '1'],
        date: '2024-09-25',
        timeSlot: '19:00 - 20:00',
        totalBookingFee: 200, // Cost for two seats
        imageUrl: '/receipt.png', // Updated path
        preorderMenu: [],
        bookingStatus: 'Pending',
        message: 'Please prepare a vegetarian meal.'
    },
    {
        id: 4,
        firstName: 'Alice Brown',
        numberOfPeople: 3,
        email: 'alice.brown@example.com',
        phoneNumber: '321-654-0987',
        totalNumberOfSeats: 3,
        tableNumber: ['12', '1', '3'],
        date: '2024-09-26',
        timeSlot: '19:00 - 20:00',
        totalBookingFee: 300, // Cost for three seats
        imageUrl: '/receipt.png', // Updated path
        preorderMenu: ['Veggie Pizza', 'Garlic Bread'],
        bookingStatus: 'Confirmed',
        message: 'Allergic to nuts.'
    },
    {
        id: 5,
        firstName: 'Alice Brown',
        numberOfPeople: 3,
        email: 'alice.brown@example.com',
        phoneNumber: '321-654-0987',
        totalNumberOfSeats: 3,
        tableNumber: ['12', '1', '3'],
        date: '2024-09-26',
        timeSlot: '19:00 - 20:00',
        totalBookingFee: 300, // Cost for three seats
        imageUrl: '/receipt.png', // Updated path
        preorderMenu: ['Veggie Pizza', 'Garlic Bread'],
        bookingStatus: 'Cancelled',
        message: 'Allergic to nuts.'
    },
    {
        id: 6,
        firstName: 'Alice Brown',
        numberOfPeople: 3,
        email: 'alice.brown@example.com',
        phoneNumber: '321-654-0987',
        totalNumberOfSeats: 3,
        tableNumber: ['12', '1', '3'],
        date: '2024-09-26',
        timeSlot: '19:00 - 20:00',
        totalBookingFee: 300, // Cost for three seats
        imageUrl: '/receipt.png', // Updated path
        preorderMenu: ['Veggie Pizza', 'Garlic Bread'],
        bookingStatus: 'Pending',
        message: 'Allergic to nuts.'
    }
];


const Modal = ({ isOpen, onClose, onConfirm, booking }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Confirm Booking</h3>
                <p>Are you sure you want to accept the booking for {booking.firstName}{booking.lastName}?</p>
                <div className={styles.modalButtons}>
                    <button onClick={onConfirm} className={styles.confirmButton}>Yes</button>
                    <button onClick={onClose} className={styles.declineButton}>No</button>
                </div>
            </div>
        </div>
    );
};

const DeleteModal = ({ isOpen, onClose, onConfirm, booking }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Delete Booking</h3>
                <p>Are you sure you want to decline the booking for {booking.firstName}{booking.lastName}?</p>
                <div className={styles.modalButtons}>
                    <button onClick={onConfirm} className={styles.confirmButton}>Yes</button>
                    <button onClick={onClose} className={styles.declineButton}>No</button>
                </div>
            </div>
        </div>
    );
};

const PaymentModal = ({ isOpen, onClose, booking, onConfirm }) => {
    const [amount, setAmount] = useState('');

    const handleConfirm = () => {
        if (amount) {
            onConfirm(amount);
            onClose();
            setAmount(''); // Reset the amount input
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Resolve Payment</h3>
                <p>Enter the additional amount needed for {booking.firstName} {booking.lastName}:</p>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className={styles.amountInput}
                />
                <div className={styles.modalButtons}>
                    <button onClick={handleConfirm} className={styles.confirmButton}>Confirm</button>
                    <button onClick={onClose} className={styles.declineButton}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.imageModalContent}>
                <h3>Receipt Image</h3>
                <img src={imageUrl} alt="Receipt" className={styles.receiptImage} />
                <button onClick={onClose} className={styles.declineButton}>Close</button>
            </div>
        </div>
    );
};


export default function BookingList() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deletemodalOpen, setDeleteModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(''); // New state for status filter

    // Effect to filter bookings based on the selected date
    useEffect(() => {
        const startOfSelectedDate = startOfDay(selectedDate); // Normalize the selected date
        const filtered = bookings.filter(booking => 
            isSameDay(startOfDay(parseISO(booking.date)), startOfSelectedDate)
        );
        setFilteredBookings(filtered);
    }, [selectedDate]);
    
    useEffect(() => {
        filterBookings(selectedDate, selectedStatus);
    }, [selectedDate, selectedStatus]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const startOfSelectedDate = startOfDay(date); // Normalize the selected date
        const filtered = bookings.filter(booking => 
            isSameDay(startOfDay(parseISO(booking.date)), startOfSelectedDate)
        );
        setFilteredBookings(filtered);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value); // Update the status filter
    };
    
    const filterBookings = (date, status) => {
        const startOfSelectedDate = startOfDay(date);
        const filtered = bookings.filter(booking => 
            isSameDay(startOfDay(parseISO(booking.date)), startOfSelectedDate) &&
            (status === '' || booking.bookingStatus === status) // Filter by status
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

    const handleConfirmClick = (booking) => {
        setSelectedBooking(booking);
        setModalOpen(true);
    };

    const handleDeclineClick = (booking) => {
        setSelectedBooking(booking);
        setDeleteModalOpen(true);
    };

    const handleResolvePaymentClick = (booking) => {
        setSelectedBooking(booking);
        setPaymentModalOpen(true);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setImageModalOpen(true);
    };

    const handleModalConfirm = () => {
        // Here you would update the booking status in your data/store
        console.log(`Booking confirmed for: ${selectedBooking.name}`);
        setModalOpen(false);
    };

    const handleModalDelete= () => {
        // Here you would update the booking status in your data/store
        console.log(`Booking confirmed for: ${selectedBooking.name}`);
        setDeleteModalOpen(false);
    };

    const handlePaymentConfirm = (amount) => {
        console.log(`Additional payment of ${amount} needed for: ${selectedBooking.firstName} ${selectedBooking.lastName}`);
        // Here you would update the payment status in your data/store
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
                            <div className={styles.filterSection}>
                                <label htmlFor="statusFilter">Filter by Status: </label>
                                <select
                                    id="statusFilter"
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                    className={styles.statusFilter}
                                >
                                    <option value="">All</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Payment Incomplete">Payment Incomplete</option>
                                    {/* Add other statuses as needed */}
                                </select>
                            </div>
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <div key={booking.id} className={styles.bookingItem}>
                                        <div className={styles.section}>
                                            <h3 className={styles.header}>Booking Seat {booking.id}</h3>
                                            <div className={styles.details}>
                                                <div>
                                                    <p><strong>Name:</strong> {booking.firstName} {booking.lastName}</p>
                                                    <p><strong>No of People:</strong> {booking.id}</p>
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
                                                    <p><strong>Booking Fee:</strong> {booking.totalBookingFee}</p>
                                                    <div>
                                                        <p><strong>Approval Image:</strong>
                                                            <span
                                                                className={styles.imageLink}
                                                                onClick={() => handleImageClick(booking.imageUrl)}
                                                            >
                                                                {booking.imageUrl}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p><strong>Preorder Menu:</strong> {booking.preorderMenu.length > 0 ? booking.preorderMenu.join(', ') : 'None'}</p>
                                                    <p><strong>Status:</strong> {booking.bookingStatus}</p>
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
                                            <button onClick={() => handleConfirmClick(booking)} className={styles.confirmButton}>Confirm</button>
                                            <button onClick={() => handleDeclineClick(booking)} className={styles.declineButton}>Decline</button> 
                                            <button onClick={() => handleResolvePaymentClick(booking)} className={styles.declineButton}>Resolve Payment</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.text}>No bookings display.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <AdminNavbarBottom /> 
            <Modal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                onConfirm={handleModalConfirm} 
                booking={selectedBooking}
            />
            <DeleteModal 
                isOpen={deletemodalOpen} 
                onClose={() => setDeleteModalOpen(false)} 
                onConfirm={handleModalDelete} 
                booking={selectedBooking}
            />
            <PaymentModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                booking={selectedBooking}
                onConfirm={handlePaymentConfirm}
            />
            <ImageModal 
                isOpen={imageModalOpen} 
                onClose={() => setImageModalOpen(false)} 
                imageUrl={selectedImageUrl}
            />
        </>
    );
}