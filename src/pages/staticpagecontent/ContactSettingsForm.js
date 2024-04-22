import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Loader from 'components/Loader';
import HirexButton from 'components/HirexButton';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const ContactSettingsForm = () => {
  const { slug } = useParams();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({ mode: 'all' });
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [err, setErr] = useState();

  // Get Contact Detail
  const getContactDetail = useCallback(async () => {
    setIsLoading(true);
    const response = await axios.get(`${BASE_API_URL}contact-details/`);
    if (response?.data) {
      const data = response?.data;
      setIsEdit(true);
      if (data) {
        for (const key in data) {
          setValue(key, data[key]);
        }
      }
      setIsLoading(false);
    }
    setIsLoading(false);
  }, [setValue])

  // Save Data
  const postContactDetail = async (data) => {
    setIsLoading(true);
    const response = await axios.post(`${BASE_API_URL}contact-details/`, data);
    if (response?.data?.result === true) {
      setIsLoading(false);
      toast.success(response?.data?.message, { theme: "colored", });
    } else if (response?.data?.result === false) {
      setIsLoading(false);
      setErr(response?.data?.errors);
    }
    setIsLoading(false);
  }

  // Update Data
  const updateContactDetail = async (data) => {
    setIsLoading(true);
    const response = await axios.put(`${BASE_API_URL}contact-details/` + data._id, data);
    if (response?.data?.result === true) {
      setIsLoading(false);
      toast.success(response?.data?.message, { theme: "colored", });
    } else if (response?.data?.result === false) {
      setIsLoading(false);
      setErr(response?.data?.errors);
    }
    setIsLoading(false);
  }

  // Submit
  const onSubmit = (data) => {
    setErr();
    if (isEdit) {
      updateContactDetail(data);
    } else {
      postContactDetail(data);
    }
  };

  useEffect(() => {
    getContactDetail();
  }, [getContactDetail])

  return (
    <>
      <Container className='mt-5'>
        {isLoading && <Loader />}
        <Row>
          <Col lg={12} className='mb-4 d-flex justify-content-between align-items-center'>
            <h4 className='title mb-0'>Contact Details</h4>
          </Col>
        </Row>
        <Row className='justify-content-center mb-3'>
          <Col lg={12}>
            <Card className='main-card'>
              <Card.Body>
                <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                  {isEdit && <Form.Control type="hidden" {...register("_id")} />}
                  <Row className="mb-3">
                    <Col lg={6}>
                      <Form.Label column="true">Email</Form.Label>
                      <Form.Control
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/,
                            message: "Invalid email address"
                          }
                        })}
                        isInvalid={errors?.email}
                      ></Form.Control>
                      {errors?.email && <div className="text-danger">{errors.email.message}</div>}
                      {err?.email &&
                        <span className="text-danger">{err?.email}</span>
                      }
                    </Col>
                    <Col lg={6}>
                      <Form.Label column="true">Address</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('address', {
                          required: 'Address is required',
                        })}
                        isInvalid={errors?.address}
                      />
                      {errors?.address && <div className="text-danger">{errors.address.message}</div>}
                      {err?.address &&
                        <span className="text-danger">{err?.address}</span>
                      }
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <Form.Label column="true">LinkedIn</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('linkedin')}
                      ></Form.Control>
                      {err?.linkedin &&
                        <span className="text-danger">{err?.linkedin}</span>
                      }
                    </Col>
                    <Col lg={6}>
                      <Form.Label column="true">FaceBook</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('facebook')}
                      ></Form.Control>
                      {err?.facebook &&
                        <span className="text-danger">{err?.facebook}</span>
                      }
                    </Col>
                  </Row>
                  <Row className="mb-3 row">
                    <Col>
                      <Form.Label column="true">Instagram</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('instagram')}
                      />
                      {err?.instagram &&
                        <span className="text-danger">{err?.instagram}</span>
                      }
                    </Col>
                    <Col lg={6}>
                      <Form.Label column="true">Twitter</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('twitter')}
                      />
                      {err?.twitter &&
                        <span className="text-danger">{err?.twitter}</span>
                      }
                    </Col>
                    <Col lg={12}>
                      <Form.Label column="true">Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="3"
                        {...register('description',{
                          required:"Description is required"
                        })}
                        isInvalid = {errors?.description}
                      />
                      {errors?.description && <div className="text-danger">{errors.description.message}</div>}
                      {err?.description &&
                        <span className="text-danger">{err?.description}</span>
                      }
                    </Col>
                  </Row>
                  <div className="text-center">
                    <HirexButton btntype="success" slug={slug} flag="button" />
                  </div>
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

export default ContactSettingsForm;