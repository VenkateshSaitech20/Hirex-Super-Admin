import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PageTitle = ({pageTitle, pageUrl, btnName}) => {
    return(
        <Row>
            <Col lg={12} className='mb-4 d-flex justify-content-between align-items-center'>
                <h4 className='title mb-0'>{pageTitle}</h4>
                <Link className='btn btn-main' to={pageUrl}>{btnName}</Link>
            </Col>
        </Row>
    )
}

PageTitle.propTypes = {
    pageTitle : PropTypes.string,
    pageUrl : PropTypes.any,
    btnName : PropTypes.string,
}

export default PageTitle;