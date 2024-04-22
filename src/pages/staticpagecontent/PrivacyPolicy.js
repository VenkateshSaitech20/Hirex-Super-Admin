import axios from "axios";
import React, { useState, useEffect } from "react";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Form, Card, Col, Container, Row } from "react-bootstrap";
import Loader from "../../components/Loader";
import HirexButton from "components/HirexButton";
import { ToastContainer, toast } from 'react-toastify';
import { modules, formats } from '../../utils/ReactQuillData'

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function Privacypolicy() {
  const [privacypolicy, setPrivacypolicy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState();

  const getPrivacyPolicy = async () => {
    setIsLoading(true);
    await axios.get(BASE_API_URL + "privacy-policy").then((response) => {
      if (response?.data?.result === true) {
        setIsLoading(false);
        setPrivacypolicy(response?.data?.data?.privacypolicy);
      } else if (response?.data?.result === false) {
        setIsLoading(false);
        toast.error(response?.data?.message, { theme: 'colored' });
      }
    })
  }

  useEffect(() => {
    getPrivacyPolicy();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios.put(BASE_API_URL + "privacy-policy", {privacypolicy: privacypolicy}).then((response) => {
      if (response?.data?.result === true) {
        setIsLoading(false);
        setTimeout(() => {
          toast.success(response.data.message, { theme: "colored" });
        }, 100);
      }
      else if (response?.data?.result === false) {
        setIsLoading(false);
        setErr(response?.data?.errors);
      }
    })
  };

  const handleProcedureContentChange = (content) => {
    setPrivacypolicy(content);
  };

  return (
    <>
      <Container fluid className="section">
        {isLoading && <Loader />}
        <Row>
            <Col lg={12} className='mb-4'>
                <h4 className='title mb-0'>Privacy Policy</h4>
            </Col>
        </Row>
        <Row className="justify-content-center mb-3">
          <Col lg={12}>
            <Card className="main-card">
              <Card.Body className="pb-3">
                <Form autoComplete="off" onSubmit={(e) => {handleSubmit(e);}}>
                  <div className="mb-3">
                    <ReactQuill
                      theme="snow"
                      modules={modules}
                      formats={formats}
                      placeholder="write your Privacy Policy ...."
                      onChange={handleProcedureContentChange}
                      value={privacypolicy}
                      style={{
                        height: "500px",
                        marginBottom: "60px",
                        background: "white",
                      }}
                    ></ReactQuill>
                    {
                      err?.privacypolicy && <span className="text-danger">{err?.privacypolicy}</span>
                    }
                  </div>
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

export default Privacypolicy;