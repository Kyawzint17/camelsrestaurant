import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import React, { useState } from 'react';
import styles from '@/styles/booking.module.css';
import Link from "next/link";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function bookingTable() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
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
                                <button className={styles.navButton}>CANCEL</button>
                                </Link>
                                <Link href={'/booking/seatSelection'}>
                                <button className={styles.navButton}>NEXT</button>
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
