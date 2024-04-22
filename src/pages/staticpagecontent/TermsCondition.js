import React, { useEffect, useState } from "react";
import axios from "axios";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Form, Card, Col, Container, Row } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import HirexButton from "components/HirexButton";
import { modules, formats } from '../../utils/ReactQuillData'

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function Termscondition() {
  const [termsandconditions, setTermsandconditions] = useState("");

  useEffect(() => {
    axios.get(BASE_API_URL + "terms-condition").then((response) => {
      if (response?.data?.result === true) {
        setTermsandconditions(response.data.data.termsandconditions)
      }
      else if (response?.data?.result === false) {
        toast.error(response.data.message, { theme: 'colored' });
      }
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(BASE_API_URL + "terms-condition", {termsandconditions: termsandconditions}).then((response) => {
      if (response?.data?.result === true) {
        setTimeout(() => {
          toast.success(response.data.message, { theme: "colored" });
        }, 100);
      }
      else if (response?.data?.result === false) {
        toast.error(response.data.message, { theme: 'colored' });
      }
    })
  };

  const handleProcedureContentChange = (content) => {
    setTermsandconditions(content);
  };

  return (
    <>
      <Container fluid className="section">
        <Row>
            <Col lg={12} className='mb-4'>
                <h4 className='title mb-0'>Terms & Conditions</h4>
            </Col>
        </Row>
        <Row className="justify-content-center mb-3">
          <Col lg={12}>
            <Card className="main-card">
              <Card.Body className="pb-3">
                <Form
                  autoComplete="off"
                  onSubmit={(e) => {
                    handleSubmit(e);
                  }}
                >
                  <ReactQuill
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    placeholder="write your Terms & Conditions...."
                    onChange={handleProcedureContentChange}
                    value={termsandconditions}
                    style={{
                      height: "600px",

                      marginBottom: "70px",
                      background: "white",
                    }}
                  ></ReactQuill>
                  <HirexButton btntype="success" flag="button" />
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
}

export default Termscondition;