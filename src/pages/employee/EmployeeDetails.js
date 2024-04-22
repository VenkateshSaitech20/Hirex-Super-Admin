import { useEffect, useState, useCallback } from 'react'; 
import { Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from 'components/PageTitle';
import DataTable from "react-data-table-component";
import SearchFilter from 'components/SearchFilter';
import { ToastContainer } from 'react-toastify';
import BadgeComponent from 'components/BadgeComponent';
import ActionComponent from 'components/ActionComponent';
import Loader from 'components/Loader';
import axios from "axios";
import { useSessionStorage } from "context/SessionStorageContext";
import { useClearStorage } from 'utils/useClearStorage';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const columns = [
    {
        name: "S.No",
        selector: (row) => row.serialNumber,
        sortable: true,
    },
    {
        name: "Employee Name",
        selector: (row) => row.empName
    },
    {
        name: "Email",
        selector: (row) => row.email,
        width: "200px"
    },
    {
        name: "Mobile Number",
        selector: (row) => row.mobileNo
    },
    {
        name: "Education",
        selector: (row) => row.education,
        sortable: true
    },
    {
        name: "Address",
        selector: (row) => row.address,
        width: "200px"
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
                slug={row.empNo} 
                deleteMessage = "Are you sure want to delete this user?" 
                editUrl = "employee-details" 
                deleteUrl = {BASE_API_URL+"employee-details/"}
                updateData = {updateData}
                jwtToken = "yes"
                flag = "delete"
            />
        ),
    }
];

let employeeDetailsUpdateData;

const updateData = () => {
    employeeDetailsUpdateData.getData();
}

const EmployeeDetails = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useSessionStorage();
    const { clearStorage } = useClearStorage();

    const getData = useCallback(async () => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL + 'employee-details', { headers: { Authorization: `Bearer ${token}`},});
        if (response?.data &&  Array.isArray(response.data)) {
            const apiData = response.data;
            apiData.forEach((item, index) => {
                item.serialNumber = index + 1;
            });
            setData(apiData);
            setOriginalData(apiData);
            setIsLoading(false);
        } else if (response?.data?.result === false) {
            clearStorage();
            sessionStorage.setItem("loginErr",LOGIN_ERR);
        }
    }, [token, clearStorage]);

    useEffect(() => {
        getData();
    },[getData]);

    employeeDetailsUpdateData = { getData };

    return(
        <>
            <Container fluid className='section'>
                {isLoading && <Loader/>}
                <PageTitle pageTitle="Users" pageUrl="/employee-details/add-employee-details" btnName="Add User" />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <DataTable 
                                    columns={columns} 
                                    data={data} 
                                    defaultSortFieldId={1}
                                    subHeader
                                    subHeaderComponent={<SearchFilter setData={setData} originalData={originalData}/>}
                                    pagination
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </>
    )
}
export default EmployeeDetails;