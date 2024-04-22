import { useEffect, useState } from 'react'; 
import { Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from 'components/PageTitle';
import DataTable from "react-data-table-component";
import SearchFilter from 'components/SearchFilter';
import { ToastContainer } from 'react-toastify';
import ActionComponent from 'components/ActionComponent';
import Loader from 'components/Loader';
import axios from "axios";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL ;

const columns = [
    {
        name: "S.No",
        selector: (row) => row.serialNumber,
        sortable: true,
    },
    {
        name: "Zones",
        selector: (row) => row.zoneName,
        sortable: true
    },
    {
        name: "Actions",
        cell: (row) => (
            <ActionComponent 
                slug={row.slug} 
                deleteMessage = "Are you sure want to delete this zone?" 
                editUrl = "zone" 
                deleteUrl = {BASE_API_URL+"zone/"}
                updateData = {updateData}
            />
        ),
    }
];

let zoneUpdateData;

const updateData = () => {
    zoneUpdateData.getData();
}

const Zone = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        getData();
    },[]);

    const getData = () => {
        setIsLoading(true);
        axios.get(BASE_API_URL+'zone').then((response)=>{
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

    zoneUpdateData = { getData };

    return(
        <>
            <Container fluid className='section'>
                {isLoading && <Loader/>}
                <PageTitle pageTitle="Zone" pageUrl="/zone/add-zone" btnName="Add Zone" />
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
export default Zone;