import React, { useContext, useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import '../../css/places.css'
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../context/myContext'
import { toast } from 'react-toastify';


export default function PlaceItem({ item }) {
    const nav = useNavigate();
    const [loggedUser, setLoggesUser] = useState(false);
    const { userInfo, onDeleteOrAddToFavorite } = useContext(MyContext);
    const [isLiked, setIsLiked] = useState(true);

    useEffect(() => {
        if (userInfo.full_name) {
            setLoggesUser(true);
        }
    }, []);

    useEffect(() => {
        if (userInfo.favorites && userInfo.favorites.includes(item._id)) {
            setIsLiked(false);
        }
    }, [userInfo.favorites]);

    return (
        <div className="mt-3">
            <div className='place_info p-3'>
                <div className="row">
                    {/* <div onClick={() => {
                        nav(item._id);
                    }} className="col-md-4">
                        <img src={item.img_url || "images/defualtImg.jpg"} alt="placePic" className='image' />
                    </div>
                    <div className="info col-md-7">
                        <div onClick={() => {
                            nav(item._id);
                        }}>
                            <h4 className='display-6'>{item.name}</h4>
                            <p className='lead'>{item.description}</p>
                        </div>
                        <div className="row align-items-end">
                            {item.tags_name.map(tag => {
                                return (
                                    <button key={tag} onClick={() => nav("?tags=" + tag)} className='tags col'>{tag}</button>
                                )
                            })}
                        </div>
                    </div> */}
                    <div className='p-3'>
                        <img src={item.img_url || "images/defualtImg.jpg"} alt="placePic" className='image float-start' />
                        <h4 className='display-6'>{item.name}</h4>
                        <p className='lead'>{item.description}</p>
                    </div>
                </div>
                <div className="row flex-wrap">
                    <div onClick={() => {
                        if (loggedUser) {
                            setIsLiked((isLiked) => !isLiked);
                            onDeleteOrAddToFavorite(item._id);
                        } else {
                            toast.warning("you must login to add this place to you favorite");
                        }
                    }} className="buttons d-flex justify-content-end col-1 w-100 pe-4">
                        {!isLiked ? <AiFillHeart className=' h1 text-danger' /> : <AiOutlineHeart className='h1 ' />}
                    </div>
                    <div className="row align-items-end col-11 ms-3">
                        {item.tags_name.map(tag => {
                            return (
                                <button key={tag} onClick={() => nav("?tags=" + tag)} className='tags col'>{tag}</button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
