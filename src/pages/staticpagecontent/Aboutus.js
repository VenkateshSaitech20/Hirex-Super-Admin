import axios from "axios";
import React, { useState, useEffect } from "react";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Form, Card, Col, Container, Row } from "react-bootstrap";
import Loader from "../../components/Loader";
import HirexButton from "components/HirexButton";
import { ToastContainer, toast } from "react-toastify";
import { modules, formats } from "../../utils/ReactQuillData";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function Aboutus() {
  const [aboutus, setAboutus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(BASE_API_URL + "about-us").then((response) => {
      if (response?.data?.result === true) {
        setIsLoading(false);
        setAboutus(response.data.data.aboutus);
      }
      else if (response?.data?.result === false) {
        setIsLoading(false);
        toast.error(response.data.message, { theme: 'colored' });
      }
    })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(BASE_API_URL + "about-us", { aboutus: aboutus }).then((response) => {
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
    setAboutus(content);
  };

  return (
    <>
      <Container fluid className="section">
        {isLoading && <Loader />}
        <Row>
            <Col lg={12} className='mb-4'>
                <h4 className='title mb-0'>About us</h4>
            </Col>
        </Row>
        <Row className="mb-3">
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
                    placeholder="Tell about About you ...."
                    onChange={handleProcedureContentChange}
                    value={aboutus}
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

export default Aboutus;