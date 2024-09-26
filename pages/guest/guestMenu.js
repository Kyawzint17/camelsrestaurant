import Navbar from "@/components/navbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/menu.module.css';
import { db, storage } from "@/pages/lib/firebase"; // Ensure this path is correct
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function customerMenu() {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

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

    return (
        <>
            <Navbar />
            <div className={styles.background}>
                <div className={styles.imageContainer}>
                    <Image src="/Food.png" alt="Logo" layout="fill" objectFit="cover" className={styles.image} />
                    <div className={styles.header}>MENU</div>
                    <div className={styles.subText}>Explore Our Delicious Traditional Dishes</div>
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
                            <div key={item.name} className={styles.menuItem}>
                                <Image src={item.imageUrl} alt={item.name} width={150} height={100} />
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
            <CustomerNavbarBottom />
        </>
    );
}
