import { useEffect, useState } from 'react'; 
import { Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from '../../components/PageTitle';
import DataTable from "react-data-table-component";
import SearchFilter from '../../components/SearchFilter';
import { ToastContainer } from 'react-toastify';
import ActionComponent from '../../components/ActionComponent';
import Loader from '../../components/Loader';
import axios from "axios";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL ;

const columns = [
    {
        name: "S.No",
        selector: (row) => row.serialNumber,
        sortable: true,
    },
    {
        name: "Zone Name",
        selector: (row) => row.zoneName,
        sortable: true
    },
    {
        name: "Business Unit",
        selector: (row) => row.unitName,
        sortable: true
    },
    {
        name: "Actions",
        cell: (row) => (
            <ActionComponent 
                slug={row.slug} 
                deleteMessage = "Are you sure want to delete this unit?" 
                editUrl = "business-unit" 
                deleteUrl = {BASE_API_URL+"business-unit/"}
                updateData = {updateData}
            />
        ),
    }
];

let businessUnitUpdateData;

const updateData = () => {
    businessUnitUpdateData.getData();
}

const BuisinessUnit = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        getData();
    },[]);

    const getData = () => {
        setIsLoading(true);
        axios.get(BASE_API_URL+'business-unit').then((response)=>{
            if(response?.data){
                const apiData = response.data;
                apiData.forEach((item, index) => {
                    item.serialNumber = index + 1;
                });
                setData(apiData);
                setOriginalData(apiData);
                setIsLoading(false);
            }
        })
    }

    businessUnitUpdateData = { getData };

    return(
        <>
            <Container fluid className='section'>
                {isLoading && <Loader/>}
                <PageTitle pageTitle="Business Unit" pageUrl="/business-unit/add-business-unit" btnName="Add Business Unit" />
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
export default BuisinessUnit;