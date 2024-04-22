import { Card, Col, Container, Row } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

const Dashboard = () => {
    return(
        <>
            <Container fluid className='section'>
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="py-5 text-center">
                                <h4 className="mb-0">Welcome to Hirex Admin Dashboard</h4>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer/>
        </>
    )
}
export default Dashboard;