import { useCallback, useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from 'components/PageTitle';
import DataTable from "react-data-table-component";
import { ToastContainer } from 'react-toastify';
import ActionComponent from 'components/ActionComponent';
import Loader from 'components/Loader';
import axios from "axios";
import PaginationComponent from 'components/PaginationComponents';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const columns = [
    {
        name: "S.No",
        selector: (row) => row.serialNumber,
        sortable: true,
    },
    {
        name: "Keyskill",
        selector: (row) => row.keySkill,
        sortable: true
    },
    {
        name: "Actions",
        cell: (row) => (
            <ActionComponent
                slug={row.slug}
                deleteMessage="Are you sure want to delete this key skill?"
                editUrl="keyskill"
                deleteUrl={BASE_API_URL + "master-keyskill/"}
                updateData={updateData}
            />
        ),
    }
];

let skillUpdateData;

const updateData = () => {
    skillUpdateData.getData();
}

const KeySkill = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newSearchTerm, setNewSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const getData = useCallback(async (page = 1, limit = 10) => {
        if (!newSearchTerm) {
            setIsLoading(true);
        }
        axios.get(`${BASE_API_URL}master-keyskill/search/pagination?term=${newSearchTerm}&page=${page}&limit=${limit}`).then((response) => {
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
        getData(newPage);

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
        getData();
    };

    useEffect(() => {
        getData();
    }, [getData]);

    skillUpdateData = { getData };

    return (
        <>
            <Container fluid className='section'>
                {isLoading && <Loader />}
                <PageTitle pageTitle="Keyskills" pageUrl="/keyskill/add-keyskill" btnName="Add Keyskill" />
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
        </>
    )
}
export default KeySkill;