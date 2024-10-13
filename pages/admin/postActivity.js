import Image from 'next/image';
import { useState } from "react";
import { db, storage } from "@/lib/firebase"; // Make sure to update the import path accordingly
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import styles from '@/styles/postactivity.module.css';
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs

export default function PostActivity() {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [fileupload, setFileupload] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

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
            const imageRef = ref(storage, `activity/${image.name}`);
            await uploadBytes(imageRef, image);
            const url = await getDownloadURL(imageRef);
            setImageUrl(url);

            // Generate a unique document ID
            const activityId = uuidv4();

            // Add activity post to Firestore
            await setDoc(doc(db, 'camels', 'camelsrestaurant', 'activities', activityId), {
                title,
                startDate,
                endDate,
                description,
                imageUrl: url,
            });

            // Reset form
            setTitle('');
            setStartDate('');
            setEndDate('');
            setDescription('');
            setImage(null);
            setImageUrl('');

            alert("Post created successfully!");
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error creating post: " + error.message);
        }
    };

    return (
        <>
            <AdminNavbar />
            <div className={styles['home-page']}>
                <div className={styles['cover']}> 
                    <div className={styles['container2']}>
                        <div className={styles['container']}>CREATE POST</div>
                        <div className={styles['container-pic']}>
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
                            <input type="file" className={styles['btext2']} onChange={handleImageChange} />
                        </div>
                        <form className={styles['container-text']} onSubmit={handleSubmit}>
                            <label className={styles['text']}>Title</label>
                            <input 
                                className={styles['input']} 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                            <label className={styles['text']}>Start Date</label>
                            <input 
                                type="date" 
                                className={styles['input']} 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)} 
                            />
                            <label className={styles['text']}>End Date</label>
                            <input 
                                type="date" 
                                className={styles['input']} 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)} 
                            />
                            <label className={styles['text']}>Description</label>
                            <textarea 
                                className={styles['input']} 
                                rows="4" 
                                cols="30" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                            ></textarea>
                            <div className={styles['button-container']}>
                                <button type="submit" className={styles['create-button']}>Create</button>
                                <Link href={'/admin/adminActivity'}>
                                    <button type="button" className={styles['create-button']}>Back</button>
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
