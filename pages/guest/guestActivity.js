import Navbar from "@/components/navbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import styles from '@/styles/activity.module.css';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function customerActivity() {
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

                // Sort posts by startDate in ascending order
                activityPosts.sort((a, b) => {
                    const startDateComparison = new Date(a.startDate) - new Date(b.startDate);
                    if (startDateComparison !== 0) {
                        return startDateComparison; // If start dates are different, use this result.
                    } else {
                        return new Date(a.endDate) - new Date(b.endDate); // If start dates are the same, compare end dates.
                    }
                });
                
               setPosts(activityPosts);
           } catch (error) {
               console.error("Error fetching activities: ", error);
           }
       };

       fetchPosts();
    }, []);

    return (
        <>
            <Navbar />
            <div className={styles.background}>
                <div className={styles.mainSection}>
                    <div className={styles.imageContainer}>
                        <Image src="/activitybackground.jpg" alt="Logo" layout="fill" objectFit="cover" className={styles.image} />
                        <div className={styles.header}>Special Events & Offers</div>
                        <div className={styles.subText}>Discover our latest events, discounts, and promotions. Don't miss out!</div>
                    </div>
                    <div className={styles.postContainer}>
                        {posts.map((post) => (
                            <div key={post.id} className={styles.postBox}>
                                <div className={styles.detailContainer}>
                                    <div className={styles.postTitle}>
                                        {post.title}
                                    </div>
                                    <div className={styles.line} />
                                    <div className={styles.postDescription}>
                                        {post.description}
                                    </div>
                                    <div className={styles.dateRange}>
                                        {post.startDate} - {post.endDate}
                                    </div>
                                    <div className={styles.line2} />
                                    <Image src={post.imageUrl} width={300} height={200} className={styles.iconImage} alt="Post Image" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <CustomerNavbarBottom />
        </>
    )


}