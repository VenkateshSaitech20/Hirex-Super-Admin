import { useEffect, useState } from 'react'; 
import { Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from '../../components/PageTitle';
import { ToastContainer } from 'react-toastify';
import Loader from '../../components/Loader';
import axios from "axios";
import { useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import HirexButton from 'components/HirexButton';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL ;

const PackageDetail = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ btnName, setBtnName] = useState();
    const { slug } = useParams();
    const pageUrl = `/packages/package-detail/${slug}`;

    useEffect(() => {
        const getData = () => {
            setIsLoading(true);
            axios.get(BASE_API_URL + 'master-package-detail/' + slug).then((response) => {
                if (response?.data) {
                    const apiData = response.data.packagedetails;
                    setData(apiData);
                    setIsLoading(false);
                    setBtnName("Edit Package Detail");
                } else {
                    setIsLoading(false);
                    setBtnName("Add Package Detail")
                }
            });
        };
        getData();
    }, [slug]);

    const getDisplayValue = (value) => {
        if (value === "Y") {
          return 'Yes';
        } else if (value === "N") {
          return 'No';
        } else {
          return value;
        }
    };

    return(
        <>
            <Container fluid className='section'>
                {isLoading && <Loader/>}
                <PageTitle pageTitle="Package detail" pageUrl={pageUrl} btnName={btnName} />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <div className="text-end mb-3">
                                    <HirexButton flag="link" btntype="success" linkname="Back" redirectTo="/packages" />
                                </div>
                                <Table bordered hover responsive>
                                    <thead className="table-light">
                                        <tr>
                                            <th>S.No</th>
                                            <th>Features</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length > 0 ? (
                                            data.map((item, index) => (
                                                <tr key={item.slug}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.featureName}</td>
                                                    <td>{getDisplayValue(item.value)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="text-center">No Records found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </>
    )
}
export default PackageDetail;