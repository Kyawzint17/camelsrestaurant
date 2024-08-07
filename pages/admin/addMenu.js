import Style from '@/styles/addmenu.module.css';
import AdminNavbar from "@/components/adminNavbar";
import AdminNavbarBottom from "@/components/adminBottomNavbar";
import Link from "next/link";

export default function Addmenu() {
    return (
        <>
        <AdminNavbar />
            <div className={Style['home-page']}>
                <div className={Style['cover']}>
                    <div className={Style['container']}>NEW MENU</div>
                    <div className={Style['container2']}>
                        <div className={Style['container-pic']}></div>
                        <form className={Style['container-text']}>
                            <label className={Style['text']}> title</label>
                            <input className={Style['input']}></input>
                            <label className={Style['text']}> category</label>
                            <input className={Style['input']}></input>
                            <label className={Style['text']}> price</label>
                            <input className={Style['input']}></input>
                            <label className={Style['text']}> description</label>
                            <input className={Style['input']}></input>
                            <button className={Style['create-button']}>create</button>
                            <Link href={'/admin/adminMenu'}>
                            <button className={Style['create-button']}>Back</button>
                            </Link>
                            
                        </form>
                    </div>
                </div>
            </div>
            <AdminNavbarBottom /> 
         </>
    );
}