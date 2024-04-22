import { useEffect, useState } from 'react'; 
import { Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from '../../components/PageTitle';
import DataTable from "react-data-table-component";
import SearchFilter from '../../components/SearchFilter';
import { ToastContainer } from 'react-toastify';
import BadgeComponent from '../../components/BadgeComponent';
import ActionComponent from '../../components/ActionComponent';
import Loader from '../../components/Loader';
import axios from "axios";
import HirexButton from 'components/HirexButton';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL ;

const columns = [
    {
        name: "S.No",
        selector: (row) => row.serialNumber,
        sortable: true,
    },
    {
        name: "Package",
        selector: (row) => row.packageName,
        sortable: true
    },
    {
        name: "Amount",
        selector: (row) => row.amount,
        sortable: true
    },
    {
        name: "Validity",
        selector: (row) => `${row.validity} Days`,
        sortable: true
    },
    {
        name: "Features",
        selector: (row) => row.features,
        sortable: true
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => <BadgeComponent status={row.status} />
    },
    {
      name: "Package Detail",
      selector: (row) => row.slug,
      sortable: true,
      cell: (row) => <HirexButton btntype="smsuccess" flag="link" linkname="Package Detail" redirectTo={`/packages/package-detail-list/${row.packageId}`} />
    },
    {
        name: "Actions",
        cell: (row) => (
            <ActionComponent 
                slug={row.slug} 
                deleteMessage = "Are you sure want to delete this package?" 
                editUrl = "packages" 
                deleteUrl = ""
                updateData = {updateData}
            />
        ),
    }
];

let packageUpdateData;

const updateData = () => {
    packageUpdateData.getData();
}

const Package = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        getData();
    },[]);

    const getData = () => {
        setIsLoading(true);
        axios.get(BASE_API_URL+'master-package').then((response)=>{
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
    packageUpdateData = { getData };

    return(
        <>
            <Container fluid className='section'>
                {isLoading && <Loader/>}
                <PageTitle pageTitle="Package" pageUrl="/packages/add-package" btnName="Add Package" />
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
export default Package;