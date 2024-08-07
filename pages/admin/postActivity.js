import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import styles from '@/styles/postactivity.module.css';
import Link from "next/link";





export default function PostActivity() {
    return (

    <>
        <AdminNavbar />
        <div className={styles['home-page']}>
            <div className={styles['cover']}>
                <div className={styles['container']}>CREATE POST</div>
                <div className={styles['container2']}>
                    <div className={styles['container-pic']}></div>
                    <form className={styles['container-text']}>
                        <label className={styles['text']}> Title</label>
                        <input className={styles['input']}></input>
                        <label className={styles['text']}> Date and Time</label>
                        <input className={styles['input']}></input>
                        <label className={styles['text']}> description</label>
                        <input className={styles['input']}></input>
                        <button className={styles['create-button']}>create</button>
                        <Link href={'/admin/adminActivity'}>
                        <button className={styles['create-button']}>back</button>
                        </Link>
                        
                    </form>
                </div>
            </div>
        </div>
        <AdminNavbarBottom /> 
    </>
    
    );
}