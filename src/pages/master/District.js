import { useCallback, useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from '../../components/PageTitle';
import DataTable from "react-data-table-component";
import { ToastContainer } from 'react-toastify';
import BadgeComponent from '../../components/BadgeComponent';
import ActionComponent from '../../components/ActionComponent';
import Loader from '../../components/Loader';
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
        name: "Country",
        selector: (row) => row.countryName,
        sortable: true
    },
    {
        name: "State",
        selector: (row) => row.stateName,
        sortable: true
    },
    {
        name: "District",
        selector: (row) => row.districtName,
        sortable: true
    },
    {
        name: "Top List",
        selector: (row) => row.topList,
        sortable: true,
        cell: (row) => <BadgeComponent status={row.topList} />
    },
    {
        name: "Filter State",
        selector: (row) => row.filtered,
        sortable: true,
        cell: (row) => <BadgeComponent status={row.filtered} />
    },
    {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        cell: (row) => <BadgeComponent status={row.status} />
    },
    {
        name: "Actions",
        cell: (row) => (
            <ActionComponent
                slug={row.slug}
                deleteMessage="Are you sure want to delete this district?"
                editUrl="district"
                deleteUrl={BASE_API_URL + "master-district/"}
                updateData={updateData}
            />
        ),
    }
];

let districtUpdateData;

const updateData = () => {
    districtUpdateData.getData();
}

const District = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newSearchTerm, setNewSearchTerm] = useState('');

    const getData = useCallback(async (page = 1, limit = 10) => {
        if (!newSearchTerm) {
            setIsLoading(true);
        }
        axios.get(`${BASE_API_URL}master-district/districts/search/pagination?term=${newSearchTerm}&page=${page}&limit=${limit}`).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                const data = response.data.districts;
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

    districtUpdateData = { getData };

    return (
        <>
            <Container fluid className='section'>
                {isLoading && <Loader />}
                <PageTitle pageTitle="District" pageUrl="/district/add-district" btnName="Add District" />
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
export default District;