import React, { useState, useEffect, useCallback } from "react";
import { Form, Card, Col, Container, Row } from "react-bootstrap";
import Loader from "../../components/Loader";
import HirexButton from "components/HirexButton";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useSessionStorage } from "context/SessionStorageContext";
import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { username } = useSessionStorage();
  const [err, setErr] = useState();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({ mode: 'all' });

  const getHomeData = useCallback(async () => {
    setIsLoading(true);
    const response = await axios.get(BASE_API_URL + 'home');
    if (response?.data?.result === true) {
      setIsLoading(false);
      const data = response?.data?.homeData;
      if (data) {
        setIsEdit(true);
        for (const key in data) {
          setValue(key, data[key]);
        }
      }
    } else if (response?.data?.result === false) {
      setIsEdit(false);
      setIsLoading(false);
    }
  }, [setValue])

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErr();
    if(isEdit){
      data.updatedUser = username;
    } else {
      data.createdUser = username;
    }
    const response = await axios.post(BASE_API_URL + 'home', data);
    if (response?.data?.result === true) {
      setIsLoading(false);
      const data = response?.data?.homeData;
      if (data) {
        setIsEdit(true);
        for (const key in data) {
          setValue(key, data[key]);
        }
      }
      toast.success(response?.data?.message, { theme: 'colored' });
    } else if (response?.data?.result === false) {
      setIsLoading(false);
      setErr(response?.data?.errors);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getHomeData();
  }, [getHomeData]);

  return (
    <>
      <Container fluid className="section">
        {isLoading && <Loader />}
        <Row>
          <Col lg={12} className='mb-4'>
            <h4 className='title mb-0'>Home</h4>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col lg={12}>
            <Card className="main-card">
              <Card.Body className="pb-3">
                <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                  {isEdit && <Form.Control type="hidden" {...register('_id')}></Form.Control>}
                  {/* Banner */}
                  <h5 className="mb-3">Banner :</h5>
                  <Row className="mb-0">
                    <Col lg={6} className="mb-3">
                      <Form.Label>Main Title - text one</Form.Label>
                      <Form.Control type="text" {...register('mainTitleTextOne', {
                        required: "Main title is required"
                      })}
                        isInvalid={errors?.mainTitleTextOne}
                      ></Form.Control>
                      {errors?.mainTitleTextOne && <span className="text-danger">{errors.mainTitleTextOne.message}</span>}
                      {err?.mainTitleTextOne && <span className="text-danger">{err?.mainTitleTextOne}</span>}
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Label>Main Title - text two</Form.Label>
                      <Form.Control type="text" {...register('mainTitleTextTwo', {
                        required: "Main title text two is required"
                      })}
                        isInvalid={errors?.mainTitleTextTwo}
                      ></Form.Control>
                      {errors?.mainTitleTextTwo && <span className="text-danger">{errors.mainTitleTextTwo.message}</span>}
                      {err?.mainTitleTextTwo && <span className="text-danger">{err?.mainTitleTextTwo}</span>}
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Label>Subtitle</Form.Label>
                      <Form.Control type="text" {...register('subTitle', {
                        required: "Subtitle is required"
                      })}
                        isInvalid={errors?.subTitle}
                      ></Form.Control>
                      {errors?.subTitle && <span className="text-danger">{errors.subTitle.message}</span>}
                      {err?.subTitle && <span className="text-danger">{err?.subTitle}</span>}
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control type="text" {...register('bannerDesc', {
                        required: "Description is required"
                      })}
                        isInvalid={errors?.bannerDesc}
                      ></Form.Control>
                      {errors?.bannerDesc && <span className="text-danger">{errors.bannerDesc.message}</span>}
                      {err?.bannerDesc && <span className="text-danger">{err?.bannerDesc}</span>}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} className="mb-3"><hr/></Col>
                  </Row>
                  {/* Left and right card */}
                  <Row className="mb-0">
                    <Col lg={6}>
                      <h5 className="mb-3">Left Card :</h5>
                      <div className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" {...register('leftCardTitle', {
                          required: "Title is required"
                        })}
                          isInvalid={errors?.leftCardTitle}
                        ></Form.Control>
                        {errors?.leftCardTitle && <span className="text-danger">{errors.leftCardTitle.message}</span>}
                        {err?.leftCardTitle && <span className="text-danger">{err?.leftCardTitle}</span>}
                      </div>
                      <div className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="4" {...register('leftCardDesc', {
                          required: "Description is required"
                        })}
                          isInvalid={errors?.leftCardDesc}
                        ></Form.Control>
                        {errors?.leftCardDesc && <span className="text-danger">{errors.leftCardDesc.message}</span>}
                        {err?.leftCardDesc && <span className="text-danger">{err?.leftCardDesc}</span>}
                      </div>
                    </Col>
                    {/* Right Card */}
                    <Col lg={6}>
                      <h5 className="mb-3">Right Card :</h5>
                      <div className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" {...register('rightCardTitle', {
                          required: "Title is required"
                        })}
                          isInvalid={errors?.rightCardTitle}
                        ></Form.Control>
                        {errors?.rightCardTitle && <span className="text-danger">{errors.rightCardTitle.message}</span>}
                        {err?.rightCardTitle && <span className="text-danger">{err?.rightCardTitle}</span>}
                      </div>
                      <div className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="4" {...register('rightCardDesc', {
                          required: "Description is required"
                        })}
                          isInvalid={errors?.rightCardDesc}
                        ></Form.Control>
                        {errors?.rightCardDesc && <span className="text-danger">{errors.rightCardDesc.message}</span>}
                        {err?.rightCardDesc && <span className="text-danger">{err?.rightCardDesc}</span>}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} className="mb-3"><hr/></Col>
                  </Row>
                  {/* Section two */}
                  <Row className="mb-0">
                    <Col lg={12} className="mb-3">
                      <h5 className="mb-3">Section two :</h5>
                      <Form.Label>Main Title</Form.Label>
                      <Form.Control type="text" {...register('secTwoMainTitle', {
                        required: "Main title is required"
                      })}
                        isInvalid={errors?.secTwoMainTitle}
                      ></Form.Control>
                      {errors?.secTwoMainTitle && <span className="text-danger">{errors.secTwoMainTitle.message}</span>}
                      {err?.secTwoMainTitle && <span className="text-danger">{err?.secTwoMainTitle}</span>}
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label>Title One</Form.Label>
                        <Form.Control type="text" {...register('secTwoTitleOne', {
                          required: "Title is required"
                        })}
                          isInvalid={errors?.secTwoTitleOne}
                        ></Form.Control>
                        {errors?.secTwoTitleOne && <span className="text-danger">{errors.secTwoTitleOne.message}</span>}
                        {err?.secTwoTitleOne && <span className="text-danger">{err?.secTwoTitleOne}</span>}
                      </div>
                      <div className="mb-3">
                        <Form.Label>Description One</Form.Label>
                        <Form.Control as="textarea" rows="4" {...register('secTwoDescOne', {
                          required: "Description is required"
                        })}
                          isInvalid={errors?.secTwoDescOne}
                        ></Form.Control>
                        {errors?.secTwoDescOne && <span className="text-danger">{errors.secTwoDescOne.message}</span>}
                        {err?.secTwoDescOne && <span className="text-danger">{err?.secTwoDescOne}</span>}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label>Title Two</Form.Label>
                        <Form.Control type="text" {...register('secTwoTitleTwo', {
                          required: "Title is required"
                        })}
                          isInvalid={errors?.secTwoTitleTwo}
                        ></Form.Control>
                        {errors?.secTwoTitleTwo && <span className="text-danger">{errors.secTwoTitleTwo.message}</span>}
                        {err?.secTwoTitleTwo && <span className="text-danger">{err?.secTwoTitleTwo}</span>}
                      </div>
                      <div className="mb-3">
                        <Form.Label>Description Two</Form.Label>
                        <Form.Control as="textarea" rows="4" {...register('secTwoDescTwo', {
                          required: "Description is required"
                        })}
                          isInvalid={errors?.secTwoDescTwo}
                        ></Form.Control>
                        {errors?.secTwoDescTwo && <span className="text-danger">{errors.secTwoDescTwo.message}</span>}
                        {err?.secTwoDescTwo && <span className="text-danger">{err?.secTwoDescTwo}</span>}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label>Title Three</Form.Label>
                        <Form.Control type="text" {...register('secTwoTitleThree', {
                          required: "Title is required"
                        })}
                          isInvalid={errors?.secTwoTitleThree}
                        ></Form.Control>
                        {errors?.secTwoTitleThree && <span className="text-danger">{errors.secTwoTitleThree.message}</span>}
                        {err?.secTwoTitleThree && <span className="text-danger">{err?.secTwoTitleThree}</span>}
                      </div>
                      <div className="mb-3">
                        <Form.Label>Description Three</Form.Label>
                        <Form.Control as="textarea" rows="4" {...register('secTwoDescThree', {
                          required: "Description is required"
                        })}
                          isInvalid={errors?.secTwoDescThree}
                        ></Form.Control>
                        {errors?.secTwoDescThree && <span className="text-danger">{errors.secTwoDescThree.message}</span>}
                        {err?.secTwoDescThree && <span className="text-danger">{err?.secTwoDescThree}</span>}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label>Title Four</Form.Label>
                        <Form.Control type="text" {...register('secTwoTitleFour', {
                          required: "Title is required"
                        })}
                          isInvalid={errors?.secTwoTitleFour}
                        ></Form.Control>
                        {errors?.secTwoTitleFour && <span className="text-danger">{errors.secTwoTitleFour.message}</span>}
                        {err?.secTwoTitleFour && <span className="text-danger">{err?.secTwoTitleFour}</span>}
                      </div>
                      <div className="mb-3">
                        <Form.Label>Description Four</Form.Label>
                        <Form.Control as="textarea" rows="4" {...register('secTwoDescFour', {
                          required: "Description is required"
                        })}
                          isInvalid={errors?.secTwoDescFour}
                        ></Form.Control>
                        {errors?.secTwoDescFour && <span className="text-danger">{errors.secTwoDescFour.message}</span>}
                        {err?.secTwoDescFour && <span className="text-danger">{err?.secTwoDescFour}</span>}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} className="mb-3"><hr/></Col>
                  </Row>
                  <Row>
                    <Col lg={12} className="mb-4">
                      <h5 className="mb-3">Footer</h5>
                      <Form.Label>Download App Description</Form.Label>
                      <Form.Control as="textarea" {...register('downloadAppDesc', {
                        required: "Description is required"
                      })}
                        isInvalid={errors?.downloadAppDesc}
                      ></Form.Control>
                      {errors?.downloadAppDesc && <span className="text-danger">{errors.downloadAppDesc.message}</span>}
                      {err?.downloadAppDesc && <span className="text-danger">{err?.downloadAppDesc}</span>}
                    </Col>
                  </Row>
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

export default Home;