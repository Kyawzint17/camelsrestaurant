import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import Image from "next/image";
import React, { useState } from 'react';
import styles from '@/styles/menu.module.css';
import Link from "next/link";

// Example menu items
const menuItems = [
    {
        name: 'Grilled Chicken',
        description: 'Juicy grilled chicken served with steamed vegetables.',
        price: '$12.99',
        category: 'Main',
        image: '/bukhari.png',
    },
    {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing.',
        price: '$8.99',
        category: 'Salad',
        image: '/bukhari.png',
    },
    {
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with a gooey center.',
        price: '$6.99',
        category: 'Dessert',
        image: '/bukhari.png',
    },
    {
        name: 'Fried1',
        description: 'Refreshing lemonade made with fresh lemons.',
        price: '$3.99',
        category: 'Fried Food',
        image: '/bukhari.png',
    },
    {
        name: 'Lemonade2',
        description: 'Refreshing lemonade made with fresh lemons.',
        price: '$3.99',
        category: 'Drinks',
        image: '/bukhari.png',
    },
    {
        name: 'Lemonade3',
        description: 'Refreshing lemonade made with fresh lemons.',
        price: '$3.99',
        category: 'Drinks',
        image: '/bukhari.png',
    },
    {
        name: 'Lemonade4',
        description: 'Refreshing lemonade made with fresh lemons.',
        price: '$3.99',
        category: 'Drinks',
        image: '/bukhari.png',
    },
    {
        name: 'Lemonade5',
        description: 'Refreshing lemonade made with fresh lemons.',
        price: '$3.99',
        category: 'Drinks',
        image: '/bukhari.png',
    },
    {
        name: 'Lemonade6',
        description: 'Refreshing lemonade made with fresh lemons.',
        price: '$3.99',
        category: 'Drinks',
        image: '/bukhari.png',
    },
    
    // Add more items as needed
];

export default function adminMenu() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    let categories = ["All", "Main", "Fried Food", "Salad", "Dessert", "Drinks"];

    const filteredItems = selectedCategory === 'All' 
        ? menuItems 
        : menuItems.filter(item => item.category === selectedCategory);

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
                            <div key={item.name} className={styles.menuItem}>
                                <Image src={item.image} alt={item.name} width={150} height={100} />
                                <div className={styles.menuItemDetails}>
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <p>{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <AdminNavbarBottom />
        </>
    );
}
