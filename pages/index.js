import Navbar from "@/components/navbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import styles from '@/styles/customer.module.css';
import Link from "next/link";
import { db } from "@/pages/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function restaurantHome() {
    
        const [currentEventIndex, setCurrentEventIndex] = useState(0);
        const [posts, setPosts] = useState([]); // State for posts

         // Fetching activity posts from Firestore
        useEffect(() => {
            const fetchPosts = async () => {
                try {
                    const activitiesCollection = collection(db, 'camels', 'camelsrestaurant', 'activities');
                    const activitySnapshot = await getDocs(activitiesCollection);
                    const activityPosts = activitySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    
                    setPosts(activityPosts);
                } catch (error) {
                    console.error("Error fetching activities: ", error);
                }
            };

            fetchPosts();
        }, []);

        // Navigate to the previous event
        const handlePrevEvent = () => {
            setCurrentEventIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
        };
    
        // Navigate to the next event
        const handleNextEvent = () => {
            setCurrentEventIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1));
        };
    
        const currentPost = posts[currentEventIndex];
        
    return (
        <> 
            <Navbar />
            <div className={styles.mainSection}>
                <div className={styles.imageContainer}>
                    <Image src="/homebackgr0und.jpg" alt="Logo" layout="fill" objectFit="cover" className={styles.image} />
                    <div className={styles.header}>Welcome To Camels</div>
                    <div className={styles.header1}>Cafe & Restaurant</div>
                </div>

                <div className={styles.head}>ANNOUNCEMENT</div>
                <div className={styles.mainEventContainer}>
                    {posts.length > 0 ? (
                            <>
                                <button className={styles.arrowButtonLeft} onClick={handlePrevEvent}>
                                    &#8592; {/* Left arrow */}
                                </button>
                                <Image src={currentPost.imageUrl} alt="Event Image" width={2000} height={2000} className={styles.eventImage} />
                                <div className={styles.eventDetails}>
                                    <div className={styles.eventTitle}>{currentPost.title}</div>
                                    <div className={styles.line2} />
                                    <div className={styles.eventDescription}>
                                        {currentPost.description}
                                    </div>
                                    <div className={styles.eventDate}>{currentPost.startDate} - {currentPost.endDate}</div>
                                </div>
                                <button className={styles.arrowButtonRight} onClick={handleNextEvent}>
                                    &#8594; {/* Right arrow */}
                                </button>
                            </>
                        ) : (
                            <div>No announcements available.</div>
                        )}
                </div>

                <div className={styles.line} />

                <div className={styles.head2}>Booking Process and Policies: Your Guide to a Smooth Reservation Experience</div>
                <div className={styles.videoContainer}>
                    <div className={styles.videoPlaceholder}>
                        <div>Easy Booking Process</div>
                        <div>
                            Follow these simple steps to reserve your table:
                            <ul>
                                <li>Choose Your Date and Time: Pick when you’d like to visit.</li>
                                <li>Select Your Seats: Choose your favorite spot for a cozy dining experience.</li>
                                <li>Preorder Your Meal: Browse our menu and order in advance for a hassle-free meal.</li>
                                <li>Complete Your Payment: Fill out the payment form, scan the QR code, and upload your receipt for quick check-in!</li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.videoPlaceholder}>
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

                <div className={styles.line} />

                <div className={styles.head2}>HIGHLIGHTS PHOTOS</div>
                <div className={styles.highlightImageContainer}>
                    <Image src="/highlight.png" width={1000} height={1000} className={styles.highlightImage} />
                </div>
                

                <div className={styles.line3} />

            </div>

            <CustomerNavbarBottom />
            
        </>
    );
}
