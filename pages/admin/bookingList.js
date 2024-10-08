import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import styles from '@/styles/booking.module.css';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, startOfDay, isSameDay, parseISO } from 'date-fns';
import { db, storage} from "@/lib/firebase"; // Ensure this path is correct
import { collection, getDocs, query, where, getDoc, doc, updateDoc  } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

const Modal = ({ isOpen, onClose, onConfirm, booking }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Confirm Booking</h3>
                <p>Are you sure you want to accept the booking for {booking.firstName} {booking.lastName}?</p>
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
                <h3>Decline Booking</h3>
                <p>Are you sure you want to decline the booking for {booking.firstName} {booking.lastName}?</p>
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
    const [bookings, setBookings] = useState([]); // State to store fetched bookings
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deletemodalOpen, setDeleteModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(''); // New state for status filter
    const [bookingCounts, setBookingCounts] = useState({}); 

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

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingsRef = collection(db, 'camels', 'camelsrestaurant', 'reservedSeats');
                const bookingSnapshot = await getDocs(bookingsRef);
                const bookingList = bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const currentDate = new Date();
                const filteredBookings = bookingList.filter(booking => 
                    isSameDay(startOfDay(parseISO(booking.date)), startOfDay(currentDate))
                );
                setBookings(bookingList);
                setFilteredBookings(filteredBookings); // Initialize filtered bookings with bookings for the current date
                calculateBookingCounts(bookingList);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
    
        fetchBookings();
    }, []); // Empty dependency array means this runs once on mount
    

    // Calculate the total number of bookings for each date
    const calculateBookingCounts = (bookingList) => {
        const counts = {};
        bookingList.forEach(booking => {
            const bookingDate = format(parseISO(booking.date), 'yyyy-MM-dd');
            if (counts[bookingDate]) {
                counts[bookingDate] += 1;
            } else {
                counts[bookingDate] = 1;
            }
        });
        setBookingCounts(counts);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const filtered = bookings.filter(booking => 
            isSameDay(startOfDay(parseISO(booking.date)), startOfDay(date))
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

    // Function to display booking count on each date in the calendar
    const tileContent = ({ date, view }) => {
        const dateString = format(date, 'yyyy-MM-dd');
        if (view === 'month' && bookingCounts[dateString]) {
            return (
                <div style={{ position: 'relative' }}>
                    <span className={styles.bookingCount}>
                        {bookingCounts[dateString]}
                    </span>
                </div>
            );
        }
        return null;
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

    const handleModalConfirm = async () => {
        try {
            // Reference to the specific booking document in Firestore
            const bookingRef = doc(db, 'camels', 'camelsrestaurant', 'reservedSeats', selectedBooking.id);
    
            // Retrieve the current booking document
            const bookingSnapshot = await getDoc(bookingRef);
    
            // Check if the document exists and retrieve the current booking status
            if (bookingSnapshot.exists()) {
                const currentBookingStatus = bookingSnapshot.data().bookingStatus;
    
                // Add condition to prevent confirmation if bookingStatus is "Declined" or "Cancelled"
                if (currentBookingStatus === "Declined" || currentBookingStatus === "Cancelled") {
                    alert(`Booking cannot be confirmed because it has been ${currentBookingStatus}.`);
                    return; // Exit the function
                }
    
                // Proceed with confirmation if the bookingStatus is eligible
                await updateDoc(bookingRef, {
                    bookingStatus: "Confirmed"
                });
    
                alert("Booking confirmed successfully!");
                console.log(`Booking confirmed for: ${selectedBooking.firstName} ${selectedBooking.lastName}`);
    
                // Close the modal after the update
                setModalOpen(false);
    
                // Optionally, refresh the booking list after confirming
                // fetchBookings(); // Call this function to refresh the data
            } else {
                console.error("Booking not found.");
            }
        } catch (error) {
            console.error("Error confirming booking:", error);
        }
    };

    const handleModalDelete = async () => {
        try {
            // Reference to the specific booking document in Firestore
            const bookingRef = doc(db, 'camels', 'camelsrestaurant', 'reservedSeats', selectedBooking.id);
    
            // Update the bookingStatus field to "Declined"
            await updateDoc(bookingRef, {
                bookingStatus: "Declined"
            });
    
            alert("Booking declined successfully!");
            console.log(`Booking declined for: ${selectedBooking.firstName} ${selectedBooking.lastName}`);
    
            // Close the delete modal after the update
            setDeleteModalOpen(false);
    
            // Optionally, refresh the booking list after declining
            // fetchBookings(); // Call this function to refresh the data
        } catch (error) {
            console.error("Error declining booking:", error);
        }
    };

    const handlePaymentConfirm = async (amount) => {
        try {
            // Reference to the specific booking document in Firestore
            const bookingRef = doc(db, 'camels', 'camelsrestaurant', 'reservedSeats', selectedBooking.id);
    
            // Update the paymentStatus to "Payment Incomplete" and add the amount field
            await updateDoc(bookingRef, {
                bookingStatus: "Payment Incomplete",
                amount: amount // Adding the amount of money the customer needs to pay
            });
    
            alert(`Payment incomplete! Customer needs to pay an additional ${amount}`);
            console.log(`Additional payment of ${amount} needed for: ${selectedBooking.firstName} ${selectedBooking.lastName}`);
    
            // Optionally, refresh the booking list after updating the payment
            // fetchBookings(); // Call this function to refresh the data
    
        } catch (error) {
            console.error("Error updating payment information:", error);
        }
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
                                    tileContent={tileContent}
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
                                    <option value="Declined">Declined</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Payment Incomplete">Payment Incomplete</option>
                                    {/* Add other statuses as needed */}
                                </select>
                            </div>
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <div key={booking.id} className={styles.bookingItem}>
                                        <div className={styles.section}>
                                            <h3 className={styles.header}>Booking ID: {booking.id}</h3>
                                            <div className={styles.details}>
                                                <div>
                                                    <p><strong>Name:</strong> {booking.firstName} {booking.lastName}</p>
                                                    <p><strong>No of People:</strong> {booking.numberOfPeople}</p>
                                                </div>
                                                <div>
                                                    <p><strong>Email:</strong> {booking.email}</p>
                                                    <p><strong>Phone Number:</strong> {booking.phone}</p>
                                                </div>
                                                <div>
                                                    <p><strong>Status:</strong> {booking.bookingStatus}</p>    
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.section}>
                                            <div className={styles.header}>Details</div>
                                            <div className={styles.details}>
                                                <div>
                                                    <p><strong>Date:</strong> {booking.date}</p>
                                                    <p><strong>Time:</strong> {booking.timeSlot}</p>
                                                </div>
                                                <div>
                                                    <p><strong>No of Seats:</strong> {booking.selectedSeats?.length || 0}</p>
                                                    <p><strong>Table No.:</strong> {booking.selectedSeats && booking.selectedSeats.join(', ')}</p>
                                                </div>
                                                <div>
                                                    <p><strong>Booking Fee:</strong> ฿{booking.totalBookingFee}</p>
                                                    <div>
                                                        <p><strong>Receipt:</strong>
                                                            <span
                                                                className={styles.imageLink}
                                                                onClick={() => handleImageClick(booking.receiptImage)}
                                                            >
                                                                Receipt
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p>
                                                        <strong>Preorder Menu:</strong> 
                                                        {booking.menuOrders && booking.menuOrders.length > 0 ? (
                                                            booking.menuOrders.map((order, index) => (
                                                                `${order.quantity} x ${order.title}` + (index < booking.menuOrders.length - 1 ? ', ' : '')
                                                            )).join('')
                                                        ) : (
                                                            'No menu orders placed.'
                                                        )}
                                                    </p>
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