import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from 'components/PageTitle';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Loader from 'components/Loader';
import { useSessionStorage } from "context/SessionStorageContext";
import HirexButton from 'components/HirexButton';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const BlogTagForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { username } = useSessionStorage();
    const { slug } = useParams();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({ mode: "all" });
    const [err, setErr] = useState();

    // Get By Slug
    const getBySlug = useCallback(() => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'master-blogtag/' + slug).then((response) => {
            if (response?.data) {
                const data = response.data;
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
        if (slug) {
            getBySlug();
        }
    }, [slug, getBySlug]);

    // Save or update data
    const saveData = (data) => {
        setIsLoading(true);
        let slug_name = data.tagName?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
        data.slug = slug_name.replace(/(^-+|-+$)/g, '');
        if (slug) {
            updateTag(data);
        } else {
            createTag(data);
        }
    }

    // Save data
    const createTag = (data) => {
        data.createdUser = username;
        data.updatedUser = username;
        axios.post(BASE_API_URL + 'master-blogtag', data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/blog-tags');
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored", });
                }, 100);
            } else if (response?.data?.result === false) {
                setErr(response.data.errors);
                setIsLoading(false);
            }
        })
    }

    // Update data
    const updateTag = (data) => {
        data.updatedUser = username;
        axios.put(BASE_API_URL + 'master-blogtag/' + data._id, data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/blog-tags');
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
                    pageTitle={slug ? 'Edit Tag' : 'Add Tag'}
                    pageUrl="/blog-tags"
                    btnName="Back"
                />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <Form autoComplete="off" onSubmit={handleSubmit(saveData)}>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Tag Name</Form.Label>
                                        <Col md={9}>
                                            {slug &&
                                                <Form.Control type="hidden" {...register("_id")}></Form.Control>
                                            }
                                            <Form.Control type="text"
                                                {...register("tagName", {
                                                    required: "Tag name is required"
                                                })}
                                                isInvalid={errors?.tagName}
                                            ></Form.Control>
                                            {errors?.tagName &&
                                                <span className="text-danger">{errors.tagName.message}</span>
                                            }
                                            {err?.tagName && <span className="text-danger">{err?.tagName}</span>}
                                            {err?.slug && <span className="text-danger">{err?.slug}</span>}
                                        </Col>
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Col md={12} className="text-center">
                                            <HirexButton btntype="success" slug={slug} flag="button" />
                                            <HirexButton btntype="cancel" flag="link" linkname="Cancel" redirectTo="/blog-tags" />
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
export default BlogTagForm;