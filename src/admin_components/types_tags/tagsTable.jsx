import React, { useEffect, useState } from 'react'
import '../../css/tablesAdmin.css'
import { API_URL, doApiGet, doApiMethod } from '../../services/apiService';
import { PaginationButtons } from '../../components/paginationButtons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function TagsTable() {
    const [tags, setTags] = useState([]);
    const [pages, setPages] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const nav = useNavigate();

    useEffect(() => {
        getTags();
        doApiCount();
    }, [currentPage])

    const getTags = async () => {
        try {
            const url = API_URL + "/tags?page=" + currentPage;
            const data = await doApiGet(url);
            setTags(data);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteTag = async (_id) => {
        if (window.confirm("Are you sure you want to delete tag?")) {
            try {
                const url = API_URL + "/tags/" + _id;
                const data = await doApiMethod(url, "DELETE");
                if (data.deletedCount) {
                    toast.success("deleted");
                    getTags();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const doApiCount = async () => {
        try {
            const url = API_URL + "/tags/count";
            const count = await doApiGet(url);
            setPages(Math.ceil(count / 5))
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="table-container">
            <h2 className='display-4 text-center my-5'>TAGS LIST</h2>
            <table className='table table-hover table-striped'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>TAG NAME</th>
                        <th>DATE CREATED</th>
                        <th>EDIT</th>
                        <th>DELETE</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.map((item, i) => {
                        return (
                            <tr key={item._id}>
                                <td>{(currentPage - 1) * 5 + i + 1}</td>
                                <td title={item._id}>{item._id.substring(0, 5)}</td>
                                <td>{item.tag_name}</td>
                                <td>{Date().toString(item.date_created).substring(3, 15)}</td>
                                <td><button onClick={() => {
                                    nav("tag/" + item._id);
                                }} className='btn btn-outline-dark'>edit</button></td>
                                <td><button onClick={() => {
                                    deleteTag(item._id);
                                }} className='btn btn-danger btn-close'></button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="d-flex justify-content-center my-3">
                <PaginationButtons
                    currentPage={currentPage}
                    pages={pages}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    )
}
