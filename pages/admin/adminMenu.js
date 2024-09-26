import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/menu.module.css';
import Link from "next/link";
import { db, storage } from "@/pages/lib/firebase"; // Ensure this path is correct
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

export default function AdminMenu() {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    let categories = ["All", "Main", "Fried Food", "Salad", "Dessert", "Drinks"];

    useEffect(() => {
        // Fetch menu items from Firestore
        const fetchMenuItems = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'camels', 'camelsrestaurant', 'menu'));
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMenuItems(items);
            } catch (error) {
                console.error("Error fetching menu items: ", error);
            }
        };

        fetchMenuItems();
    }, []);

    const filteredItems = selectedCategory === 'All' 
        ? menuItems 
        : menuItems.filter(item => item.category === selectedCategory);

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                // Delete item from Firestore
                await deleteDoc(doc(db, 'camels', 'camelsrestaurant', 'menu', itemToDelete.id));

                // Update local state
                setMenuItems(menuItems.filter(item => item.id !== itemToDelete.id));

                // Delete image from Storage
                const storage = getStorage();
                const imageRef = ref(storage, itemToDelete.imageUrl); // Ensure this is the correct path
                await deleteObject(imageRef)

                // Hide modal
                setShowModal(false);
                setItemToDelete(null);

                // Optionally: Show a success message
                alert("Menu item deleted successfully!");

            } catch (error) {
                console.error("Error deleting document: ", error);
                alert("Error deleting document: " + error.message);
            }
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
        setItemToDelete(null);
    };

    return (
        <>
            <AdminNavbar />
            <div className={styles.background}>
                <div className={styles.imageContainer}>
                    <Image src="/Food.png" alt="Logo" layout="fill" objectFit="cover" className={styles.image} />
                    <div className={styles.header}>MENU</div>
                    <Link href={'/admin/addMenu'}>
                        <button className={styles.createMenuButton}>Create New Menu</button>
                    </Link>
                </div>
                <div className={styles.menuBox}>
                    <div className={styles.categoriesBox}>
                        {categories.map((category) => (
                            <button 
                                key={category} 
                                className={styles.categoryButton} 
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className={styles.foodContainer}>
                        {filteredItems.map((item) => (
                            <div key={item.id} className={styles.menuItem}>
                                <button className={styles.deleteButton} onClick={() => handleDeleteClick(item)}>X</button>
                                <Image 
                                    src={item.imageUrl} 
                                    alt={item.title} 
                                    width={150} 
                                    height={100}  
                                    loading="lazy" // Ensures lazy loading layout="responsive"
                                    quality={75}
                                    style={{ objectFit: 'cover' }}
                                />
                                <div className={styles.menuItemDetails}>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <p>฿{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <p>Are you sure you want to delete {itemToDelete?.title}?</p>
                        <button className={styles.confirmButton} onClick={confirmDelete}>Yes</button>
                        <button className={styles.cancelButton} onClick={cancelDelete}>No</button>
                    </div>
                </div>
            )}
            <AdminNavbarBottom />
        </>
    );
}
