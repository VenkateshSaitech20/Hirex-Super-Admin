import { useCallback, useEffect, useState } from 'react'; 
import { Card, Col, Container, Row, Modal } from 'react-bootstrap';
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';
import Loader from '../../components/Loader';
import axios from "axios";
import { Link } from 'react-router-dom';
import PaginationComponent from 'components/PaginationComponents';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL ;

const columns = [
    {
        name: "S.No",
        selector: (row) => row.serialNumber,
        sortable: true,
        width : "100px",
    },
    {
        name: "User Name",
        selector: (row) => row.createdBy,
        sortable: true,
        width : "200px",
    },
    {
        name: "Company Name",
        selector: (row) => row.companyName,
        sortable: true,
        width : "200px",
    },
    {
        name: "Feedback",
        selector: (row) => row.feedback,
        sortable: true,
        width : "200px",
    },
    {
        name: "Added On",
        selector: (row) => formatDate(row.createdAt),
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
                    className = "form-control"
                >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
        )
    },
    {
        name: "Feedback",
        sortable: true,
        width: "120px",
        cell: (row) => <Link className="btn btn-sm btn-main" onClick={() => openFeedbackModal(row,true)}>Read</Link>
    },
];

let customerFeedbackUpd;
let customerFeedbackModal;

const handleStatusChange = (value, data) => {
    customerFeedbackUpd.updateFeedback(value, data);
}

const openFeedbackModal = (feedback, openModal) => {
    customerFeedbackModal.openFeedbackModal(feedback, openModal);
}  

const CustomerFeedbacks = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [newSearchTerm, setNewSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Update data
    const openFeedbackModal = async(feedback, openModal) => {
        setSelectedFeedback(feedback);
        setShowModal(openModal);
    }

    // Review Modal
    const renderModal = () => {
        if (!selectedFeedback) {
            return null;
        }
        
        return (
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg" centered scrollable>
                <Modal.Header  className="bg-gray" closeButton>
                    <h5 className="mb-0">{selectedFeedback.createdBy}</h5>
                </Modal.Header>
                <Modal.Body>
                    { 
                        selectedFeedback.feedback && (
                            <>
                                <p className="mb-2">{selectedFeedback.feedback}</p>
                                <small className="mb-2 text-muted">{formatDate(selectedFeedback.createdAt)}</small>
                            </>
                        )
                    }
                </Modal.Body>
            </Modal>
        );
    };

    const getFeedbacks = useCallback(async (page = 1, limit = 10) => {
        if (!newSearchTerm) {
            setIsLoading(true);
        }
        axios.get(`${BASE_API_URL}employer-feedback/search/pagination?term=${newSearchTerm}&page=${page}&limit=${limit}`).then((response) => {
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
        getFeedbacks(newPage);

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
        getFeedbacks();
    };

    // Update data
    const updateFeedback = async(value,data) => {
        let updData = { status : value }
        const response = await axios.put(`${BASE_API_URL}employer-feedback/${data._id}`,updData);
        if(response?.data?.result === true){
            toast.success(response?.data?.message,{theme:'colored'});
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
        getFeedbacks();
    },[getFeedbacks]);

    customerFeedbackUpd = { updateFeedback: (value, data) => updateFeedback(value, data) };
    customerFeedbackModal = { openFeedbackModal: (feedback, openModal) => openFeedbackModal(feedback, openModal) };

    return(
        <>
            <Container fluid className='section'>
                {isLoading && <Loader/>}
                <Row>
                    <Col lg={12} className='mb-4 d-flex justify-content-between align-items-center'>
                        <h4 className='title mb-0'>Customer Feedbacks</h4>
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
export default CustomerFeedbacks;