import { useCallback, useEffect, useState } from 'react';
import { Card, Col, Container, Row, Modal } from 'react-bootstrap';
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';
import Loader from '../../components/Loader';
import axios from "axios";
import { Link } from 'react-router-dom';
import PaginationComponent from 'components/PaginationComponents';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const columns = [
    {
        name: "S.No",
        selector: (row) => row.serialNumber,
        sortable: true,
        width: "100px",
    },
    {
        name: "Title",
        selector: (row) => row.title,
        sortable: true,
        width: "300px",
    },
    {
        name: "Blog Short Content",
        selector: (row) => row.shortBlogContent,
        sortable: true,
        width: "300px",
    },
    {
        name: "Posted Date",
        selector: (row) => formatDate(row.updatedAt),
        sortable: true
    },
    {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        cell: (row) => (
            <div>
                <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(e.target.value, row)}
                    className="form-control"
                >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                </select>
            </div>
        )
    },
    {
        name: "Blog",
        sortable: true,
        width: "120px",
        cell: (row) => <Link className="btn btn-sm btn-main" onClick={() => openBlogModal(row, true)}>Read</Link>
    },
];

let customerBlogUpd;
let customerBlogModal;

const handleStatusChange = (value, data) => {
    customerBlogUpd.updateBlog(value, data);
}

const openBlogModal = (blog, openModal) => {
    customerBlogModal.openBlogModal(blog, openModal);
}

const Blogs = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [newSearchTerm, setNewSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Update data
    const openBlogModal = async (blog, openModal) => {
        setSelectedBlog(blog);
        setShowModal(openModal);
    }

    // Review Modal
    const renderModal = () => {
        if (!selectedBlog) {
            return null;
        }

        return (
            <Modal show={showModal} fullscreen onHide={() => setShowModal(false)} backdrop="static" size="lg" centered scrollable>
                <Modal.Header className="bg-gray" closeButton>
                    <div>
                        <h5 className="mb-0">{selectedBlog?.title}</h5>
                        <small className="mb-2 text-muted">{selectedBlog?.userDetail?.name} - {formatDate(selectedBlog?.createdAt)}</small>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {
                        selectedBlog && (
                            <>
                                <img className="img-fluid mb-2 rounded-4 img-h-100" src={selectedBlog?.image} alt="Blog" />
                                <h6>Short Content</h6>
                                <p className="mb-2">{selectedBlog?.shortBlogContent}</p>
                                <h6>Full Content</h6>
                                <div dangerouslySetInnerHTML={{ __html: selectedBlog?.blogContent }} />
                            </>
                        )
                    }
                </Modal.Body>
            </Modal>
        );
    };

    const getBlogs = useCallback(async (page = 1, limit = 10) => {
        if (!newSearchTerm) {
            setIsLoading(true);
        }
        axios.get(`${BASE_API_URL}blogs/pending?term=${newSearchTerm}&page=${page}&limit=${limit}`).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                const data = response.data.data;
                const startingSerialNumber = (page - 1) * limit + 1;
                data.forEach((item, index) => {
                    item.serialNumber = startingSerialNumber + index;
                });
                setData(data)
                setTotalPages(response.data.totalPages);
            } else if (response?.data?.result === false) {
                setIsLoading(false);
            }
        })
    }, [newSearchTerm])

    // Pagination page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        getBlogs(newPage);

    };

    const handleKeyPress = (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        const isAlphanumeric = /^[a-zA-Z0-9\s]*$/.test(e.key);
        const isAllowedKey = allowedKeys.includes(e.key);
        const isModifierKey = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;
        if (!(isAlphanumeric || isAllowedKey) || isModifierKey) {
            e.preventDefault();
        }
    };

    const handleSearch = async (e) => {
        const inputValue = e.target.value;
        const newSearchTerm = inputValue.toLowerCase();
        setNewSearchTerm(newSearchTerm);
        setCurrentPage(1);
        getBlogs();
    };

    // Update data
    const updateBlog = async (value, data) => {
        let updData = { status: value }
        const response = await axios.put(`${BASE_API_URL}blogs/status/${data._id}`, updData);
        if (response?.data?.result === true) {
            toast.success(response?.data?.message, { theme: 'colored' });
            setData((prevData) => {
                const updatedData = prevData.map((item) =>
                    item._id === data._id ? { ...item, status: value } : item
                );
                setData(updatedData);
                return updatedData;
            });
        }
    }

    useEffect(() => {
        getBlogs();
    }, [getBlogs]);

    customerBlogUpd = { updateBlog: (value, data) => updateBlog(value, data) };
    customerBlogModal = { openBlogModal: (blog, openModal) => openBlogModal(blog, openModal) };

    return (
        <>
            <Container fluid className='section'>
                {isLoading && <Loader />}
                <Row>
                    <Col lg={12} className='mb-4 d-flex justify-content-between align-items-center'>
                        <h4 className='title mb-0'>Blogs</h4>
                    </Col>
                </Row>
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    defaultSortFieldId={1}
                                    subHeader
                                    subHeaderComponent={
                                        <input
                                            className="form-control w-25"
                                            type="text"
                                            placeholder="Search..."
                                            onChange={handleSearch}
                                            onKeyDown={(e) => handleKeyPress(e)}
                                        />
                                    }
                                />
                                <div className="table-border-top">
                                    <div className="my-4">
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            handlePageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
            {renderModal()}
        </>
    )
}
export default Blogs;