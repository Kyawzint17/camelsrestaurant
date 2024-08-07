import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import React, { useState } from 'react';
import styles from '@/styles/booking.module.css';
import Link from "next/link";
import Image from "next/image";

export default function SeatSelection() {
    const [numSeats, setNumSeats] = useState(1);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [message, setMessage] = useState('');

    const handleSeatClick = (seatName) => {
        if (selectedSeats.includes(seatName)) {
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatName));
        } else if (selectedSeats.length < numSeats) {
            setSelectedSeats([...selectedSeats, seatName]);
        } else {
            alert('You can only select up to ' + numSeats + ' seats.');
        }
    };

    const handleNumSeatsChange = (e) => {
        const value = Math.max(1, e.target.value); // Ensure at least 1 seat
        setNumSeats(value);
        setSelectedSeats(selectedSeats.slice(0, value)); // Adjust selectedSeats to match new numSeats
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
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
                                    <Image
                                        src="/seat.jpg"
                                        alt="Seat Layout"
                                        layout="responsive"  // Ensures the image scales properly with its container
                                        width={100}         // Actual width of the image
                                        height={500}         // Actual height of the image
                                        quality={100}        // Adjust quality for better clarity
                                    />
                                </div>
                                <div className={styles.seatLayout}>
                                    <div className={styles.numSeatsContainer}>
                                        <label htmlFor="numSeats">Number of Seats:</label>
                                        <input
                                            id="numSeats"
                                            type="number"
                                            value={numSeats}
                                            onChange={handleNumSeatsChange}
                                            min="1"
                                            max="15"
                                            className={styles.numSeatsInput}
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
                                        {['Seat 1', 'Seat 2', 'Seat 3', 'Seat 4', 'Seat 5'].map(seat => (
                                            <button
                                                key={seat}
                                                className={`${styles.seat} ${selectedSeats.includes(seat) ? styles.selected : ''}`}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={numSeats <= 0}
                                            >
                                                {seat}
                                            </button>
                                        ))}
                                    </div>
                                    <div className={styles.row}>
                                        {['Seat 6', 'Seat 7', 'Seat 8'].map(seat => (
                                            <button
                                                key={seat}
                                                className={`${styles.seat} ${selectedSeats.includes(seat) ? styles.selected : ''}`}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={numSeats <= 0}
                                            >
                                                {seat}
                                            </button>
                                        ))}
                                    </div>
                                    <div className={styles.row}>
                                        {['Seat 9', 'Seat 10', 'Seat 11'].map(seat => (
                                            <button
                                                key={seat}
                                                className={`${styles.seat} ${selectedSeats.includes(seat) ? styles.selected : ''}`}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={numSeats <= 0}
                                            >
                                                {seat}
                                            </button>
                                        ))}
                                    </div>
                                    <div className={styles.row}>
                                        {['Seat 12', 'Seat 13', 'Seat 14', 'Seat 15'].map(seat => (
                                            <button
                                                key={seat}
                                                className={`${styles.seat} ${selectedSeats.includes(seat) ? styles.selected : ''}`}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={numSeats <= 0}
                                            >
                                                {seat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.selectedSeatsContainer}>
                                <div className={styles.selectedSeatsHeader}>Selected Seats</div>
                                <div className={styles.selectedSeatsList}>
                                    {selectedSeats.length > 0 ? (
                                        selectedSeats.map(seat => (
                                            <span key={seat} className={styles.selectedSeat}>{seat}</span>
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
                                <Link href={'/booking/bookingfeeNmenu'}>
                                <button className={styles.navButtonSeat}>BACK</button>
                                </Link>
                                <Link href={'/booking/bookingfeeNmenu'}>
                                <button className={styles.navButtonSeat}>NEXT</button>
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
