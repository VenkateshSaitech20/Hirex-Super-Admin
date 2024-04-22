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
        name: "Tags",
        selector: (row) => row.tagName,
        sortable: true
    },
    {
        name: "Actions",
        cell: (row) => (
            <ActionComponent 
                slug={row.slug} 
                deleteMessage = "Are you sure want to delete this tag?" 
                editUrl = "blog-tags" 
                deleteUrl = {BASE_API_URL+"master-blogtag/"}
                updateData = {updateData}
            />
        ),
    }
];

let skillUpdateData;

const updateData = () => {
    skillUpdateData.getData();
}

const BlogTag = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        getData();
    },[]);

    const getData = () => {
        setIsLoading(true);
        axios.get(BASE_API_URL+'master-blogtag').then((response)=>{
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

    skillUpdateData = { getData };

    return(
        <>
            <Container fluid className='section'>
                {isLoading && <Loader/>}
                <PageTitle pageTitle="Blog Tags" pageUrl="/blog-tags/add-blog-tag" btnName="Add Tag" />
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
export default BlogTag;