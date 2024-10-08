import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/booking.module.css';
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, query, where, getDocs, updateDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; 
import { useRouter } from 'next/router';

export default function SeatSelection() {
    const initialSeatData = [
        { seatName: 'Tent 1', people: 10, reserved: false },
        { seatName: 'Tent 2', people: 10, reserved: false },
        { seatName: 'Tent 3', people: 10, reserved: false },
        { seatName: 'Tent 4', people: 10, reserved: false },
        { seatName: 'Tent 5', people: 10, reserved: false },
        { seatName: 'Tent 6', people: 10, reserved: false },
        { seatName: 'Tent 7', people: 10, reserved: false },
        { seatName: 'Tent 8', people: 10, reserved: false },
        { seatName: 'Tent 9', people: 10, reserved: false },
        { seatName: 'Tent 10', people: 10, reserved: false },
        { seatName: 'Tent 11', people: 10, reserved: false },
        { seatName: 'Tent 12', people: 10, reserved: false },
        { seatName: 'Tent 13', people: 10, reserved: false },
        { seatName: 'Tent 14', people: 10, reserved: false },
        { seatName: 'Tent 15', people: 10, reserved: false }
    ];

    const [bookingDate, setBookingDate] = useState('');
    const [bookingTimeSlot, setBookingTimeSlot] = useState('');
    
    const [seatData, setSeatData] = useState(initialSeatData);
    const [numPeople, setNumPeople] = useState(0);
    const [maxPeople, setMaxPeople] = useState(1); // State for maximum number of people
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [message, setMessage] = useState('');
    const [totalBookingFee, setTotalBookingFee] = useState(0);
    const [totalFee, setTotalFee] = useState(0);
    
    const router = useRouter(); 
 
    useEffect(() => {
        const auth = getAuth();
        let unsubscribe;
        unsubscribe = auth.onAuthStateChanged(user => {
          if (user) {
            const userEmail = user.email;
            const fetchBookingData = async () => {
              const existingBookingId = sessionStorage.getItem('bookingId');
              const bookingRef = doc(db, 'camels', 'camelsrestaurant', 'bookings', existingBookingId);
              const bookingDoc = await getDoc(bookingRef);
              if (bookingDoc.exists()) {
                const bookingData = bookingDoc.data();
                const reservedSeatsRef = collection(db, 'camels', 'camelsrestaurant', 'reservedSeats');
                const reservedSeatQuery = query(reservedSeatsRef, where('date', '==', bookingData.date), where('timeSlot', '==', bookingData.timeSlot), where('email', '==', userEmail));
                const reservedSeatDocs = await getDocs(reservedSeatQuery);
                if (reservedSeatDocs.docs.length > 0) {
                  const reservedSeatData = reservedSeatDocs.docs[0].data();
                  
                  // Check if the booking status is "Cancelled"
                  if (reservedSeatData.bookingStatus === "Cancelled") {
                    console.log("Booking is cancelled. No selected seats to display.");
                    setSelectedSeats([]); // Clear selected seats
                    setMessage(''); // Clear message
                    setTotalBookingFee(0); // Reset total booking fee
                    setNumPeople(0); // Reset number of people
                    return; // Exit if the booking is cancelled
                    }

                  const selectedSeats = reservedSeatData.selectedSeats.map(seatName => {
                    return seatData.find(seat => seat.seatName === seatName);
                  });
                  setSelectedSeats(selectedSeats);
                  setMessage(reservedSeatData.message);
                  setTotalBookingFee(reservedSeatData.totalBookingFee);
                  setNumPeople(reservedSeatData.numberOfPeople);
                }
              }
            };
            fetchBookingData();
          } else {
            console.error('No user is logged in.');
          }
        });
        return unsubscribe;
      }, []);

    useEffect(() => {
        const existingBookingId = sessionStorage.getItem('bookingId');
        const bookingRef = doc(db, 'camels', 'camelsrestaurant', 'bookings', existingBookingId);
      
        async function fetchSeatData() {
          try {
            const bookingDoc = await getDoc(bookingRef);
            if (bookingDoc.exists()) {
              const bookingData = bookingDoc.data();
              setBookingDate(bookingData.date);         // Store date
              setBookingTimeSlot(bookingData.timeSlot); // Store timeSlot

              const userEmail = getAuth().currentUser?.email;
      
              if (!userEmail) {
                console.error('No user is logged in.');
                return;
              }
      
              const seatsRef = collection(db, 'camels', 'camelsrestaurant', 'seats');
              const seatQuery = query(
                seatsRef,
                where('date', '==', bookingData.date), // Match date
                where('timeSlot', '==', bookingData.timeSlot) // Match timeSlot
              );
      
              const seatDocs = await getDocs(seatQuery);
      
              let updatedSeatData = [...seatData]; // Clone seatData
      
              seatDocs.forEach((doc) => {
                const seatDataFromDb = doc.data();
      
                // Update reserved status in seatData for the seats in Firestore
                updatedSeatData = updatedSeatData.map(seat => {
                  if (seatDataFromDb.seats.includes(seat.seatName)) {
                    return {...seat, reserved: true };
                  }
                  return seat;
                });
              });
      
              setSeatData(updatedSeatData); // Update seatData with new reserved status
            }
          } catch (error) {
            console.error('Error fetching seat data: ', error);
          }
        }
      
        fetchSeatData();
      }, []);

    useEffect(() => {
        const bookingFeePerSeat = 5;
        const totalFee = selectedSeats.length * bookingFeePerSeat;
        setTotalBookingFee(totalFee);
      }, [selectedSeats]);
      
    const getMaxSeatsAllowed = (people) => {
        return Math.ceil(people / 10);
    };

    const handleSeatClick = (seat) => {
        //disabled={seat.reserved}
        if (seat.reserved) {
            alert('This seat is reserved and cannot be selected.');
            return;
        }
        const bookingFeePerSeat = 5;
        const totalFee = selectedSeats.length * bookingFeePerSeat;
        setTotalFee(totalFee);
        setTotalBookingFee(totalFee);

        const maxSeatsAllowed = getMaxSeatsAllowed(maxPeople);

        if (selectedSeats.includes(seat)) {
            //Deselect the seat
            setSelectedSeats(selectedSeats.filter(s => s !== seat));
            setNumPeople(maxPeople);
        } else {
            if (selectedSeats.length < maxSeatsAllowed) {
                // Select the seat
                setSelectedSeats([...selectedSeats, seat]);
                setNumPeople(maxPeople);
            } else {
                alert(`You can only select up to ${maxSeatsAllowed} seat(s) for ${maxPeople} people.`);
            }
        }
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleMaxPeopleChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0) {
            setMaxPeople(value);
            setNumPeople(value);
        } else {
            setMaxPeople(0);
            setNumPeople(0);
        }
    };

    const handleUpdateBooking = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            alert('User not authenticated');
            return;
        }
    
        const email = user.email;
        const existingBookingId = sessionStorage.getItem('bookingId'); 
        const bookingRef = doc(db, 'camels', 'camelsrestaurant', 'bookings', existingBookingId);
    
        try {
            // Fetch the timeSlot from the booking document
            const bookingDoc = await getDoc(bookingRef);
            if (bookingDoc.exists()) {
                const bookingData = bookingDoc.data();
                const timeSlot = bookingData.timeSlot; // Fetch the timeSlot here
                const date = bookingData.date;         
    
                // Collection references
                const seatsRef = collection(db, 'camels', 'camelsrestaurant', 'seats');
                const reservedSeatsRef = collection(db, 'camels', 'camelsrestaurant', 'reservedSeats');
                let reservedId;

                await Promise.all(selectedSeats.map(async (seat) => {
                    const seatId = `${date}_${timeSlot}_${email}`; // Unique seat ID
                    reservedId =`${date}_${timeSlot}_${email}`; 

                    // Upload to the seats collection
                    const seatRef = doc(seatsRef, seatId);
                    try {
                        await setDoc(seatRef, {
                            seats: selectedSeats.map(seat => seat.seatName),
                            reserved: true,
                            timeSlot: timeSlot, // Add timeSlot to the seat document
                            date: date,
                            reservedBy: email
                        });
                        console.log('Seat data updated successfully in seats collection');
                    } catch (error) {
                        console.error('Error updating seat data in seats collection: ', error);
                    }
    
                    // Upload to the reservedSeats collection
                    const reservedSeatRef = doc(reservedSeatsRef, reservedId);
                    try {
                        await setDoc(reservedSeatRef, {
                            selectedSeats: selectedSeats.map(seat => seat.seatName),
                            message: message,
                            numberOfPeople: numPeople,
                            totalBookingFee: totalBookingFee,
                            timeSlot: timeSlot,
                            date: date,
                            bookingStatus: "Pending", // Example status
                            email: email,
                            createdAt: serverTimestamp()
                        });
                        console.log('Seat data updated successfully in reservedSeats collection');
                    } catch (error) {
                        console.error('Error updating seat data in reservedSeats collection: ', error);
                    }
                }));
    
                console.log('Seats reserved and data uploaded to both collections');
                router.push(`/booking/menuOrder?bookingId=${reservedId}`);
            } else {
                console.error('No booking document found for the provided bookingId.');
            }
        } catch (error) {
            console.error('Error fetching booking or updating data: ', error);
        }
    };

    const handleBack = async () => {
        const auth = getAuth();
        const userEmail = auth.currentUser.email; // extract the email address
        const existingBookingId = sessionStorage.getItem('bookingId');
        const bookingRef = doc(db, 'camels', 'camelsrestaurant', 'bookings', existingBookingId);
      
        try {
          const bookingDoc = await getDoc(bookingRef);
          if (bookingDoc.exists()) {
            const bookingData = bookingDoc.data();
            const timeSlot = bookingData.timeSlot;
            const date = bookingData.date;
      
            // Delete documents from seats collection
            const seatsRef = collection(db, 'camels', 'camelsrestaurant', 'seats');
            const seatQuery = query(seatsRef, where('date', '==', date), where('timeSlot', '==', timeSlot));
            const seatDocs = await getDocs(seatQuery);
            await Promise.all(seatDocs.docs.filter(doc => doc.data().reservedBy === userEmail).map(async (doc) => {
              await deleteDoc(doc.ref);
            }));
      
            // Delete documents from reservedSeats collection
            const reservedSeatsRef = collection(db, 'camels', 'camelsrestaurant', 'reservedSeats');
            const reservedSeatQuery = query(reservedSeatsRef, where('date', '==', date), where('timeSlot', '==', timeSlot));
            const reservedSeatDocs = await getDocs(reservedSeatQuery);
            await Promise.all(reservedSeatDocs.docs.filter(doc => doc.data().email === userEmail).map(async (doc) => {
              await deleteDoc(doc.ref);
            }));
      
            console.log('Existing documents deleted from seats and reservedSeats collections');
            router.push('/booking/bookingTable');
          } else {
            console.error('No booking document found for the provided bookingId.');
          }
        } catch (error) {
          console.error('Error deleting documents: ', error);
        }
      };
    
 

   
    

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.bookingPage}>
                    <div className={styles.container1}>
                        <div className={styles.head}>Seat Selection</div>
                        <div className={styles.seatSelectionContainer}>
                            <div className={styles.seatLayoutContainer}>
                                <div className={styles.imageContainer}>
                                    <div className={styles.timeAndDate}>
                                        <div>Selected Date and Time:</div>
                                        <span>{bookingDate} ({bookingTimeSlot})</span>
                                    </div>
                                    <Image
                                        src="/seat.jpg"
                                        alt="Seat Layout"
                                        layout="responsive"
                                        width={100}
                                        height={100}
                                        quality={100}
                                    />
                                </div>
                                <div className={styles.seatLayout}>
                                    <div className={styles.peopleInputContainer}>
                                        <label htmlFor="numPeople">Number of People:</label>
                                        <input
                                            id="numPeople"
                                            type="number"
                                            min="1"
                                            max="75"
                                            value={maxPeople}
                                            onChange={handleMaxPeopleChange}
                                            className={styles.peopleInput}
                                        />
                                    </div>

                                    <div className={styles.seatStatusContainer}>
                                        <div className={styles.statusItem}>
                                            <div className={styles.statusColorReserved}></div>
                                            <span>Reserved</span>
                                        </div>
                                        <div className={styles.statusItem}>
                                            <div className={styles.statusColorAvailable}></div>
                                            <span>Available</span>
                                        </div>
                                        <div className={styles.statusItem}>
                                            <div className={styles.statusColorSelected}></div>
                                            <span>Selected</span>
                                        </div>
                                    </div>
                                    <div className={styles.row}>
                                        {seatData.slice(0, 5).map(seat => (
                                            <button
                                            key={seat.seatName}
                                            className={`${styles.seat} ${seat.reserved ? styles.reserved : ''} ${selectedSeats.includes(seat) ? styles.selected : ''}`}
                                            onClick={() => handleSeatClick(seat)}
                                            disabled={seat.reserved}
                                        >
                                            {seat.seatName}
                                            <br />
                                            <span className={styles.peopleCount}>({seat.people} people)</span>
                                        </button>
                                        
                                        ))}
                                    </div>
                                    <div className={styles.row}>
                                        {seatData.slice(5, 8).map(seat => (
                                            <button
                                                key={seat.seatName}
                                                className={`${styles.seat} ${seat.reserved ? styles.reserved : ''} ${selectedSeats.includes(seat) ? styles.selected : ''}`}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={seat.reserved}
                                            >
                                                {seat.seatName}
                                                <br />
                                                <span className={styles.peopleCount}>({seat.people} people)</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className={styles.row}>
                                        {seatData.slice(8, 11).map(seat => (
                                            <button
                                                key={seat.seatName}
                                                className={`${styles.seat} ${seat.reserved ? styles.reserved : ''} ${selectedSeats.includes(seat) ? styles.selected : ''}`}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={seat.reserved}
                                            >
                                                {seat.seatName}
                                                <br />
                                                <span className={styles.peopleCount}>({seat.people} people)</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className={styles.row}>
                                        {seatData.slice(11).map(seat => (
                                            <button
                                                key={seat.seatName}
                                                className={`${styles.seat} ${seat.reserved ? styles.reserved : ''} ${selectedSeats.includes(seat) ? styles.selected : ''}`}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={seat.reserved}
                                            >
                                                {seat.seatName}
                                                <br />
                                                <span className={styles.peopleCount}>({seat.people} people)</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.selectedSeatsContainer}>
                                <div className={styles.selectedSeatsHeader}>Each Selected Seat costs ฿5 for booking</div>
                            
                                <div className={styles.bookingInfo}>
                                        <div>Seats Booked: {selectedSeats.length}, Total Booking Fees: ฿{totalBookingFee}, number of people: {numPeople}</div>
                                </div>
                                <div className={styles.selectedSeatsList}>
                                    {selectedSeats.length > 0 ? (
                                        selectedSeats.map(seat => (
                                            <span key={seat.seatName} className={styles.selectedSeat}>{seat.seatName} ({seat.people} people)</span>
                                        ))
                                    ) : (
                                        <span className={styles.noSeats}>No seats selected</span>
                                    )}
                                </div>
                            </div>
                            <div className={styles.messageBox}>
                                <label htmlFor="message">Additional Information:</label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={handleMessageChange}
                                    placeholder="Enter any additional information here..."
                                    className={styles.messageInput}
                                />
                            </div>
                            <div className={styles.buttonContainerSeat}>
                                <Link href={'/booking/bookingTable'}>
                                <button className={styles.navButtonSeat} onClick={handleBack}>BACK</button>
                                </Link>
                                <Link href={'/booking/menuOrder'}>
                                <button className={styles.navButtonSeat} onClick={handleUpdateBooking}>NEXT</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CustomerNavbarBottom />
        </>
    );
}