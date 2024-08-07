import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/booking.module.css';
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

export default function menuOrder() {

    const [order, setOrder] = useState([]);

    const addToOrder = (item) => {
        const existingItem = order.find(order => order.name === item.name);
        if (existingItem) {
            setOrder(order.map(order =>
                order.name === item.name ? { ...order, quantity: order.quantity + 1 } : order
            ));
        } else {
            setOrder([...order, { ...item, quantity: 1 }]);
        }
    };

    const removeFromOrder = (item) => {
        setOrder((prevOrder) => {
            const existingItem = prevOrder.find((orderItem) => orderItem.name === item.name);
            if (existingItem && existingItem.quantity > 1) {
                return prevOrder.map((orderItem) =>
                    orderItem.name === item.name ? { ...orderItem, quantity: orderItem.quantity - 1 } : orderItem
                );
            } else {
                return prevOrder.filter((orderItem) => orderItem.name !== item.name);
            }
        });
    };

    const calculateTotal = () => {
        return order.reduce((total, item) => total + (parseFloat(item.price.replace('$', '')) * item.quantity), 0).toFixed(2);
    };

    const groupedMenuItems = menuItems.reduce((acc, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <>
            <CustomerNavbar />
            <div className={styles.background}>
                <div className={styles.bookingPage}>
                    <div className={styles.container}>
                        <div className={styles.head}> Menu Order </div>
                        <div className={styles.calendarContainer}>
                            
                            <div className={styles.squareBox3}>
                                <div className={styles.menuList}>
                                    {Object.keys(groupedMenuItems).map((category) => (
                                        <div key={category}>
                                            <h3 className={styles.categoryheader}>{category}</h3>
                                            {groupedMenuItems[category].map((item) => (
                                                <div className={styles.menuItem} key={item.name}>
                                                    <Image src={item.image} alt={item.name} width={100} height={50} />
                                                    <div className={styles.menuDetails}>
                                                        <h4>{item.name}</h4>
                                                        <p>{item.description}</p>
                                                        <p>{item.price}</p>
                                                        <button className={styles.orderButton} onClick={() => addToOrder(item)}>Order</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.orderSummary}>
                                    <h2>Order Summary</h2>
                                    <ul>
                                        {order.map((item, index) => (
                                            <li key={index}>
                                                <div className={styles.itemInfo}>
                                                    <span>{item.quantity} x {item.name} = {item.price}</span>
                                                </div>
                                                <div className={styles.buttons}>
                                                    <button className={styles.plusButton} onClick={() => addToOrder(item)}>+</button>
                                                    <button className={styles.minusButton} onClick={() => removeFromOrder(item)}>-</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <h3>Total: ${calculateTotal()}</h3>
                                </div>
                            </div>
                            <div className={styles.buttonContainer2}>
                                <Link href={'/booking/bookingfeeNmenu'}>
                                <button className={styles.navButton3}>BACK</button>
                                </Link>
                                <Link href={'/booking/paymentForm'}>
                                <button className={styles.navButton3}>NEXT</button>
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