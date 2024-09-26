import CustomerNavbar from "@/components/customerNavbar";
import CustomerNavbarBottom from "@/components/customerBottomNavbar";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/booking.module.css';
import Link from "next/link";
import { db, storage } from "@/pages/lib/firebase"; // Ensure this path is correct
import { collection, getDocs, deleteDoc, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";


export default function menuOrder() {

    const [order, setOrder] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [bookingDetails, setBookingDetails] = useState(null); // Store date, time, and seats
    const router = useRouter(); // Use router to navigate and get query params
    const [bookingId, setBookingId] = useState(null);

    useEffect(() => {
      const storedBookingId = localStorage.getItem('bookingId');
      if (storedBookingId) {
        setBookingId(storedBookingId);
      }
    }, []);
  
    useEffect(() => {
      if (bookingId) {
        localStorage.setItem('bookingId', bookingId);
      }
    }, [bookingId]);
  
    useEffect(() => {
      const { bookingId: queryBookingId } = router.query; // Get bookingId from URL query
      if (queryBookingId) {
        setBookingId(queryBookingId);
      }
    }, [router.query])

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

    useEffect(() => {
      if (bookingId) {
          // Fetch selected booking details (date, time, seats) from Firestore
          const fetchBookingDetails = async () => {
              try {
                  const reservedSeatsRef = collection(db, 'camels', 'camelsrestaurant', 'reservedSeats');
                  const seatDocRef = doc(reservedSeatsRef, bookingId);
                  const seatDoc = await getDoc(seatDocRef);

                  if (seatDoc.exists()) {
                      setBookingDetails(seatDoc.data()); // Set booking details
                      setOrder(seatDoc.data().menuOrders || []); // Load menu orders
                  }
              } catch (error) {
                  console.error('Error fetching booking details: ', error);
              }
          };

          fetchBookingDetails();
      }
    }, [bookingId]);

    useEffect(() => {
        if (bookingId !== null) {
          const fetchSelectedMenuData = async () => {
            try {
              const reservedSeatsRef = collection(db, 'camels', 'camelsrestaurant', 'reservedSeats');
              const seatDocRef = doc(reservedSeatsRef, bookingId);
              const seatDoc = await getDoc(seatDocRef);
      
              if (seatDoc.exists()) {
                const menuOrders = seatDoc.data().menuOrders;
                if (menuOrders) {
                  setOrder(menuOrders);
                }
              }
            } catch (error) {
              console.error('Error fetching selected menu data: ', error);
            }
          };
      
          fetchSelectedMenuData();
        }
    }, [bookingId]);

    const addToOrder = (item) => {
        const existingItem = order.find(order => order.title === item.title);
        if (existingItem) {
            setOrder(order.map(order =>
                order.title === item.title ? { ...order, quantity: order.quantity + 1 } : order
            ));
        } else {
            setOrder([...order, { ...item, quantity: 1 }]);
        }
    };

    const removeFromOrder = (item) => {
        setOrder((prevOrder) => {
            const existingItem = prevOrder.find((orderItem) => orderItem.title === item.title);
            if (existingItem && existingItem.quantity > 1) {
                return prevOrder.map((orderItem) =>
                    orderItem.title === item.title ? { ...orderItem, quantity: orderItem.quantity - 1 } : orderItem
                );
            } else {
                return prevOrder.filter((orderItem) => orderItem.title !== item.title);
            }
        });
    };

    const handleNext = async () => {
        if (!bookingId) {
          console.error('No bookingId found');
          return;
        }
      
        const orderDetails = {
          items: order.map(item => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
          total: calculateTotal(),
          menuPreorder: true, // Set preorder flag
        };
      
        try {
          const reservedSeatsRef = collection(db, 'camels', 'camelsrestaurant', 'reservedSeats');
          const seatDocRef = doc(reservedSeatsRef, bookingId);
          const seatDoc = await getDoc(seatDocRef);
      
          if (seatDoc.exists()) {
            // Update the existing reserved seats document with the pre-order data
            await updateDoc(seatDocRef, {
              menuOrders: orderDetails.items,
              totalBill: orderDetails.total,
              menuPreorder: true, // Indicate that pre-order was made
            });
          } else {
            // Create a new reserved seats document with the pre-order data
            await setDoc(seatDocRef, {
              menuOrders: orderDetails.items,
              totalBill: orderDetails.total,
              menuPreorder: true, // Indicate that pre-order was made
            });
          }
      
          console.log('Reserved seats updated successfully!');
          // Redirect to the next page
          router.push(`/booking/paymentForm?bookingId=${bookingId}`);
        } catch (error) {
          console.error('Error updating reserved seats: ', error);
        }
    };

    const calculateTotal = () => {
        return order.reduce((total, item) => total + (parseFloat(item.price.toString().replace('$', '')) * item.quantity), 0).toFixed(2);
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
                      <div className={styles.menuContainer}>
                        <div className={styles.head}> Menu PreOrder </div>
                         <div className={styles.calendarContainer}>    
                              <div className={styles.squareBox3}>
                                <div className={styles.menuList}>
                                {Object.keys(groupedMenuItems).map((category) => (
                                    <div key={category}>
                                        <h3 className={styles.categoryheader}>{category}</h3>
                                        {groupedMenuItems[category].map((item, index) => (
                                            <div className={styles.menuItem} key={item.id || `${item.name}-${index}`}>
                                                <Image src={item.imageUrl} alt={item.title} width={150} height={80} />
                                                <div className={styles.menuDetails}>
                                                    <h4>{item.title}</h4>
                                                    <p>{item.description}</p>
                                                    <p>฿{item.price}</p>
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
                                                    <span>{item.quantity} x {item.title} = ฿{item.price}</span>
                                                </div>
                                                <div className={styles.buttons}>
                                                    <button className={styles.plusButton} onClick={() => addToOrder(item)}>+</button>
                                                    <button className={styles.minusButton} onClick={() => removeFromOrder(item)}>-</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <h3>Total (Pay at Restaurant): ฿{calculateTotal()}</h3>
                                </div>
                              </div>
                              <div className={styles.infoBox}>
                                <div className={styles.infoDisplay}>
                                  <h2>Booking Details</h2>
                                    {bookingDetails ? (
                                      <>
                                          <div className={styles.dateTimeContainer}>
                                              <div className={styles.dateBox}>
                                                  <h3>Date: {bookingDetails.date}</h3>
                                              </div>
                                              <div className={styles.timeBox}>
                                                  <h3>Time: {bookingDetails.timeSlot}</h3>
                                              </div>
                                          </div>
                                          <div className={styles.detailsContainer}>
                                            <div className={styles.detailsItem}>
                                                <span className={styles.detailsIcon}>🪑</span>
                                                <div className={styles.cantainer}>
                                                  <h4>Number of seats:</h4>
                                                  <div className={styles.detailsText}>
                                                    <span>{bookingDetails.selectedSeats.length}</span>
                                                  </div>
                                                </div>
                                            </div>
                                            <div className={styles.detailsItem}>
                                                <span className={styles.detailsIcon}>📍</span>
                                                <div className={styles.cantainer}>
                                                  <h4>Selected seats:</h4>
                                                  <div className={styles.detailsText}>
                                                    <span>{bookingDetails.selectedSeats.join(', ')}</span>
                                                  </div>
                                                </div>
                                            </div>
                                            <div className={styles.detailsItem}>
                                                <span className={styles.detailsIcon}>💸</span>
                                                <div className={styles.cantainer}>
                                                  <h4>Booking fees:</h4>
                                                  <div className={styles.detailsText}>
                                                      <span>฿{bookingDetails.totalBookingFee}</span>
                                                  </div>
                                                </div>
                                            </div>
                                            <div className={styles.detailsItem}>
                                                <span className={styles.detailsIcon}>💬</span>
                                                <div className={styles.cantainer}>
                                                  <h4>Message:</h4>
                                                  <div className={styles.detailsText}>
                                                      <span>{bookingDetails.message}</span>
                                                  </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                      </>
                                    ) : (
                                        <p>Loading booking details...</p>
                                    )}
                                    <div className={styles.feeInfo}>
                                      <h3>Booking Fee Information</h3>
                                      <div>The booking fee is 5 Baht per seat.</div>
                                    </div>
                                    
                                </div>
                              </div>
                              <div className={styles.buttonContainer2}>
                                  <Link href={'/booking/seatSelection'}>
                                  <button className={styles.navButton3}>BACK</button>
                                  </Link>
                                  <Link href={'/booking/paymentForm'}>
                                  <button className={styles.navButton3} onClick={handleNext}>NEXT</button>
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