import { useEffect, useState } from 'react'; 
import { Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from '../../components/PageTitle';
import DataTable from "react-data-table-component";
import { ToastContainer } from 'react-toastify';
import BadgeComponent from '../../components/BadgeComponent';
import ActionComponent from '../../components/ActionComponent';
import Loader from '../../components/Loader';
import axios from "axios";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const columns = [
    {
        name: "S.No",
        selector: (row) => row.serialNumber,
        sortable: true,
    },
    {
        name: "Companies",
        selector: (row) => <img src={row.image} alt="Company Logo" style={{ maxWidth: '50px', maxHeight: '50px' }} />,
        sortable: true
    },
    {
        name: "Sequence Order",
        selector: (row) => row.sequenceOrder,
        sortable: true
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
                slug={row._id} 
                deleteMessage = "Are you sure want to delete this company?" 
                editUrl = "feature-companies" 
                deleteUrl = {BASE_API_URL+"feature-companies/delete-feature-company/"}
                updateData = {updateData}
            />
        ),
    }
];

let FeatureCompaniesUpdateData;

const updateData = () => {
    FeatureCompaniesUpdateData.getData();
}

const FeatureCompanies = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        getData();
    },[]);

    const getData = () => {
        setIsLoading(true);
        axios.get(BASE_API_URL+'feature-companies/all').then((response)=>{
            if (response?.data?.result === true) {
                const apiData = response?.data?.featureCompanies;
                apiData.forEach((item, index) => {
                    item.serialNumber = index + 1;
                });
                setData(apiData);
                setIsLoading(false);
            }
        })
    }

    FeatureCompaniesUpdateData = { getData };

    return(
        <>
            <Container fluid className='section'>
                {isLoading && <Loader/>}
                <PageTitle pageTitle="Feature Companies" pageUrl="/feature-companies/add-feature-company" btnName="Add Company" />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <DataTable 
                                    columns={columns} 
                                    data={data} 
                                    defaultSortFieldId={1}
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
export default FeatureCompanies;