import Image from 'next/image';
import { useState } from "react";
import { db, storage } from "@/lib/firebase"; // Make sure to update the import path accordingly
import { collection, doc, addDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Style from '@/styles/addmenu.module.css';
import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs

export default function Addmenu() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('All');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [fileupload, setFileupload] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    let categories = ["All", "Main", "Fried Food", "Salad", "Dessert", "Drinks"];

    const handleImageChange = (e) => {
        //if (e.target.files[0]) {
            //setImage(e.target.files[0]);
        //}
        const file = e.target.files[0];
        if (file) {
            setImage(file); // Now updating image correctly
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
            setImage(null);  // Reset image state
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            setErrorMessage('Please select an image to upload.');
            setUploading(false);
            return;
          }

        try {
            // Upload image to Firebase Storage
            const imageRef = ref(storage, `menu/${image.name}`);
            await uploadBytes(imageRef, image);
            const url = await getDownloadURL(imageRef);
            setImageUrl(url);

            // Generate a unique document ID
            const menuId = uuidv4();

            // Add menu item to Firestore
            // Correct path assuming 'menu' is a collection within 'camelsrestaurant'
            // Path: 'camelsrestaurant/{restaurantId}/menu/{menuId}'
            await setDoc(doc(db, 'camels', 'camelsrestaurant', 'menu', menuId), {
                title,
                category,
                price: parseFloat(price),
                description,
                imageUrl: url,
            });

            // Show success message
            alert("Menu item created successfully!");

            // Reset form
            setTitle('');
            setCategory('All');
            setPrice('');
            setDescription('');
            setImage(null);
            setImageUrl('');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error adding document: " + error.message);
        }
    };

    return (
        <>
            <AdminNavbar />
            <div className={Style['home-page']}>
                <div className={Style['cover']}>
                    <div className={Style['container2']}>
                        <div className={Style['container']}>NEW MENU</div>

                        <div className={Style['container-pic']}>
                            {imagePreview && (
                                <div>
                                <Image
                                    src={imagePreview}
                                    alt="Image preview"
                                    width={300}
                                    height={300}
                                    style={{ width: "100%", height: "auto" }}
                                />
                                </div>
                            )}
                            <input type="file" className={Style['btext2']} onChange={handleImageChange} />
                        </div>

                        <form className={Style['container-text']} onSubmit={handleSubmit}>
                            <label className={Style['text']}>Title</label>
                            <input className={Style['input']} value={title} onChange={(e) => setTitle(e.target.value)} />

                            <label className={Style['text']}>Category</label>
                            <select className={Style['input']} value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <label className={Style['text']}>Price</label>
                            <input className={Style['input']} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

                            <label className={Style['text']}>Description</label>
                            <textarea className={Style['input']} rows="3" cols="30" value={description} onChange={(e) => setDescription(e.target.value)} />

                            <div className={Style['button-container']}>
                                <button type="submit" className={Style['create-button']}>Create</button>
                                <Link href={'/admin/adminMenu'}>
                                    <button type="button" className={Style['create-button']}>Back</button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <AdminNavbarBottom />
        </>
    );
}
