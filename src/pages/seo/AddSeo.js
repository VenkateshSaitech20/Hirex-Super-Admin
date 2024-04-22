import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from 'components/PageTitle';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Loader from 'components/Loader';
import FindDuplicate from 'components/FindDuplicate';
import { useSessionStorage } from "context/SessionStorageContext";
import HirexButton from 'components/HirexButton';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const AddSeo = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [findDuplicateName, setFindDuplicateName] = useState();
    const [duplicateFound, setDuplicateFound] = useState(false);
    const { token } = useSessionStorage();
    const { slug } = useParams();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({ mode: "all" });
    const [slugs, setSlugs] = useState();
    const [err, setErr] = useState();

    // Get By Slug
    const getBySlug = useCallback(() => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'seo/' + slug).then((response) => {
            if (response?.data) {
                const data = response.data.data;
                for (const key in data) {
                    setValue(key, data[key]);
                }
                setIsLoading(false);
            }
        })
            .catch((error) => {
                setIsLoading(false);
            });
    }, [slug, setValue]);

    // Use Effect
    useEffect(() => {
        getSlug();
        if (slug) {
            getBySlug();
        }
    }, [slug, getBySlug]);

    // Get slug
    const getSlug = () => {
        axios.get(BASE_API_URL + 'seo/all/slugs').then((response) => {
            if (response?.data) {
                setSlugs(response.data);
            }
        })
            .catch((error) => {
                console.log("error : ", error);
            })
    }

    // Save or update data
    const saveData = (data) => {
        if (!duplicateFound) {
            setIsLoading(true);
            let slug_name = data.pageName?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
            data.slug = slug_name.replace(/(^-+|-+$)/g, '');
            if (slug) {
                updateMetaData(data);
            } else {
                createMetaData(data);
            }
        }
    }

    // Create Package
    const createMetaData = (data) => {
        axios.post(BASE_API_URL + 'seo', data, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/seo');
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored", });
                }, 100);
            } else if (response?.data?.result === false) {
                setErr(response.data.errors);
                setIsLoading(false);
            }
        })
    }

    // Update Package
    const updateMetaData = (data) => {
        axios.put(BASE_API_URL + 'seo/' + data._id, data, {headers : {Authorization : `Bearer ${token}`}}).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/seo');
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored", });
                }, 100);
            } else if (response?.data?.result === false) {
                setErr(response.data.errors);
                setIsLoading(false);
            }
        })
    }
    return (
        <>
            <Container fluid className='section'>
                {isLoading && <Loader />}
                <PageTitle
                    pageTitle={slug ? 'Edit Meta Data' : 'Meta Data'}
                    pageUrl="/seo"
                    btnName="Back"
                />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <Form autoComplete="off" onSubmit={handleSubmit(saveData)}>
                                    {slug && <Form.Control type="hidden" {...register("_id")}></Form.Control>}
                                    
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Page Name</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("pageName", {
                                                    required: "Page name is required",
                                                    onChange: (e) => { setFindDuplicateName(e.target.value) }
                                                })}
                                                isInvalid={errors?.pageName}
                                            ></Form.Control>
                                            {errors?.pageName &&
                                                <span className="text-danger">{errors?.pageName && errors.pageName.message}</span>
                                            } 
                                            {err?.pageName && <span className="text-danger">{err?.pageName}</span>}
                                            {findDuplicateName &&
                                                <FindDuplicate
                                                    searchName={findDuplicateName}
                                                    slugs={slugs}
                                                    message="Meta already exists"
                                                    setDuplicateFound={setDuplicateFound}
                                                    flag="slug"
                                                />
                                            }
                                        </Col>
                                    </Form.Group>
                                    {slug && (
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column="true" md={3}>Slug</Form.Label>
                                            <Col md={9}>
                                                <Form.Control type="text"
                                                    disabled
                                                    {...register("slug")}
                                                ></Form.Control>
                                            </Col>
                                        </Form.Group>
                                    )}

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Title</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("metaTitle", {
                                                    required: "Meta title is required"
                                                })}
                                                isInvalid={errors?.metaTitle}
                                            ></Form.Control>
                                            {errors?.metaTitle &&
                                                <span className="text-danger">{errors?.metaTitle && errors.metaTitle.message}</span>
                                            }
                                            {err?.metaTitle && <span className="text-danger">{err?.metaTitle}</span>}
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Description</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("metaDescription", {
                                                    required: "Meta description is required"
                                                })}
                                                isInvalid={errors?.metaDescription}
                                            ></Form.Control>
                                            {errors?.metaDescription &&
                                                <span className="text-danger">{errors?.metaDescription && errors.metaDescription.message}</span>
                                            }
                                            {err?.metaDescription && <span className="text-danger">{err?.metaDescription}</span>}
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Keywords</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("metaKeywords", {
                                                    required: "Keywords is required"
                                                })}
                                                isInvalid={errors?.metaKeywords}
                                            ></Form.Control>
                                            {errors?.metaKeywords &&
                                                <span className="text-danger">{errors?.metaKeywords && errors.metaKeywords.message}</span>
                                            }
                                            {err?.metaKeywords && <span className="text-danger">{err?.metaKeywords}</span>}
                                        </Col>
                                    </Form.Group>

                                    <Row className="mb-3">
                                        <Col md={12} className="text-center">
                                            <HirexButton btntype="success" slug={slug} flag="button" />
                                            <HirexButton btntype="cancel" flag="link" linkname="Cancel" redirectTo="/seo" />
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </>
    )
}
export default AddSeo;