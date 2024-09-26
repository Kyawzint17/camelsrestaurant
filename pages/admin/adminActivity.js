import AdminNavbar from "@/components/adminNavbar";
import Image from "next/image";
import styles from '@/styles/activity.module.css';
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { db } from "@/pages/lib/firebase"; // Make sure to update the import path accordingly
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

export default function Activity() {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

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
                activityPosts.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                
                setPosts(activityPosts);
            } catch (error) {
                console.error("Error fetching activities: ", error);
            }
        };

        fetchPosts();
    }, []);

    const handleDeleteClick = (post) => {
        setPostToDelete(post);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (postToDelete) {
            try {
                // Delete from Firestore
                const postRef = doc(db, 'camels', 'camelsrestaurant', 'activities', postToDelete.id);
                await deleteDoc(postRef);

                // Delete image from Storage
                const storage = getStorage();
                const imageRef = ref(storage, postToDelete.imageUrl); // Ensure this is the correct path
                await deleteObject(imageRef);

                // Update local state
                setPosts(posts.filter(post => post.id !== postToDelete.id));
                setShowModal(false);
                setPostToDelete(null);

                alert("Post deleted successfully.");
            } catch (error) {
                console.error("Error deleting post: ", error);
            }
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
        setPostToDelete(null);
    };

    return (
        <>
            <AdminNavbar />
            <div className={styles.background}>
                <div className={styles.mainSection}>
                    <div className={styles.imageContainer}>
                        <Image src="/activitybackground.jpg" alt="Logo" layout="fill" objectFit="cover" className={styles.image} />
                        <div className={styles.header}>Special Events & Offers</div>
                        <Link href={'/admin/postActivity'}>
                            <button className={styles.postButton}>Post</button>
                        </Link>
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
                                <button className={styles.deleteButton} onClick={() => handleDeleteClick(post)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <p>Are you sure you want to delete this post?</p>
                        <button className={styles.confirmButton} onClick={confirmDelete}>Yes</button>
                        <button className={styles.cancelButton} onClick={cancelDelete}>No</button>
                    </div>
                </div>
            )}
            <AdminNavbarBottom />
        </>
    )
}
