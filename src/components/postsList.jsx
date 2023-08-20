import React, { useEffect, useRef, useState } from 'react'
import '../css/posts.css'
import PostItem from './posts/postItem'
import { API_URL, TOKEN_KEY, doApiGet } from '../services/apiService';
import { IoSearchOutline, IoArrowForwardSharp, IoSwapVerticalSharp } from "react-icons/io5"
import { BsPostcardHeart } from "react-icons/bs"
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PostsLoading from './posts/postsLoading';
import { toast } from 'react-toastify';
import SearchUserPosts from './posts/searchUserPosts';
import SearchPlacePosts from './posts/searchPlacePosts';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import InfiniteScroll from 'react-infinite-scroll-component';


export default function PostsList() {
    const [postsAr, setPostsAr] = useState([]);
    const [reverse, setReverse] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [select, setSelected] = useState("place");
    const [noMorePosts, setNoMorePosts] = useState(false);
    const [page, setPage] = useState(1);
    const [query] = useSearchParams();
    const nav = useNavigate();
    const inputRf = useRef();

    useEffect(() => {
        // const searchQ = query.get("s") || "";
        getPosts();
    }, [query, reverse])
    // for finding posts by the places id
    const getPlaceId = async (_name) => {
        try {
            const url = API_URL + "/places/placeId/" + _name;
            const data = await doApiGet(url);
            console.log(data);
            return data;
        } catch (error) {
        }
    }

    const getPosts = async () => {
        try {
            setIsLoading(true);
            let url = API_URL + "/posts?page=" + page;
            if (query.get("s")) {
                url += "?s=" + query.get("s")
            }
            else if (query.get("place")) {
                const id = await getPlaceId(query.get("place"));
                url += "?place=" + id;
            }
            else if (query.get("user")) {
                url += "?user=" + query.get("user")
            }
            if (reverse) {
                const mark = url.includes("?");
                mark ? url += `&` : url += `?`;
                url += "reverse=yes"
            }
            const data = await doApiGet(url);
            if (data.length === 0) {
                setNoMorePosts(true);
            } else {
                setPage(page => page + 1);
                setPostsAr((postsAr) => page == 1 ? data : [...postsAr, ...data]);
            }
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("there is a problem, try again later")
            setIsLoading(false)
        }
    }

    const onSortClick = () => {
        setReverse(!reverse);
    }

    const handleOnSearch = (item) => {
        nav("?s=" + item)
    }

    return (
        <div className='container-fluid pb-5'>
            <div className='container'>
                <div className="px-3">
                    {localStorage[TOKEN_KEY] && <Link to={"add"} className='addBtn-posts'>
                        <div className="d-flex align-items-center justify-content-center">
                            <BsPostcardHeart className='iconAdd' />
                            <p className='m-0 ps-2'>Add new post</p>
                        </div>
                    </Link>}
                    <div className='row justify-content-between p-0 align-items-center pt-4  '>
                        <div className='col-auto  d-flex align-items-center'>
                            {reverse == false ?
                                <button className='postInputs' onClick={onSortClick}  >old <IoArrowForwardSharp />  new  <IoSwapVerticalSharp className='h4 mx-2 my-0' /></button>
                                :
                                <button className='postInputs' onClick={onSortClick}  >new <IoArrowForwardSharp />  old  <IoSwapVerticalSharp className='h4 mx-2 my-0' /></button>
                            }
                        </div>
                        <div className='row px-0 py-2 justify-content-between align-items-center m-0 col-lg-8 '>
                            <div className=' p-0 col-3'>
                                <select
                                    className="form-select py-2"
                                    aria-label="Default select example"
                                    onChange={(e) => setSelected(e.target.value)}
                                    value={select}
                                >
                                    <option disabled>Search by..</option>
                                    <option value="place">Place</option>
                                    <option value="user">User</option>
                                    <option value="title">Title</option>
                                </select>
                            </div>
                            {select == "place" && <div className='col-9 '><SearchPlacePosts /></div>}
                            {select == "user" && <div className='col-9'><SearchUserPosts /></div>}
                            {select == "title" && <div className='col-9'>

                                <ReactSearchAutocomplete
                                    autoFocus
                                    placeholder="Search by Title.."
                                    resultStringKeyName="name"
                                    onSearch={handleOnSearch}
                                    onClear={() => nav("/posts")}
                                // onClick={handleInputClick} // Add this line

                                />
                            </div>}


                            {select == "titleeqw" && <div className='d-flex justify-content-end col-9 '>
                                {/* <input onKeyDown={(e) => {
                                    if (e.key == "Enter") {
                                        nav("?s=" + inputRf.current.value);
                                    }
                                }} ref={inputRf} placeholder='Search by title...' className='postInputs input-group' />
                                {/* <button onClick={() => {
                                nav("?s=" + inputRf.current.value);
                            }} className='searchBtn'><IoSearchOutline className='search_icon' /></button> */}

                            </div>

                            }
                        </div>
                    </div>
                </div>
                <div>
                    {isLoading ? (
                        <>
                            <PostsLoading />
                            <PostsLoading />
                        </>
                    ) : (
                        <InfiniteScroll
                            dataLength={postsAr.length}
                            next={getPosts}
                            hasMore={!noMorePosts && !isLoading} // Prevent loading more while a request is in progress
                            loader={<PostsLoading />} // You can replace this with your loading component
                        >
                            {postsAr.length === 0 ? (
                                <h2 className='row justify-content-center align-items-center display-5' style={{ height: 300 }}>No results found.</h2>
                            ) : (
                                postsAr.map(item => (
                                    <PostItem key={item._id} item={item} />
                                ))
                            )}
                        </InfiniteScroll>
                    )}
                </div>

            </div>
        </div>


    )
}
