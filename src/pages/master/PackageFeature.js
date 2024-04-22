import { useEffect, useState } from 'react'; 
import { Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from '../../components/PageTitle';
import DataTable from "react-data-table-component";
import SearchFilter from '../../components/SearchFilter';
import { ToastContainer } from 'react-toastify';
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
        name: "Features",
        selector: (row) => row.featureName,
        sortable: true
    },
    {
        name: "Field",
        selector: (row) => row.fieldType,
        sortable: true,
        cell: (row) => {
            if (row.fieldType === "text") {
                return <span>Text Box</span>;
            } else {
                return <span>Select Box</span>;
            }
        },
    }
];

const PackageFeature = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        getData();
    },[]);

    const getData = () => {
        setIsLoading(true);
        axios.get(BASE_API_URL+'master-package-feature').then((response)=>{
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

    return(
        <>
            <Container fluid className='section'>
                {isLoading && <Loader/>}
                <PageTitle pageTitle="PackageFeature" pageUrl="/package-features/add-package-feature" btnName="Add Package Feature" />
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
export default PackageFeature;