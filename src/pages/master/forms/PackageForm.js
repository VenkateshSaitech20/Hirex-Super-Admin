import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Card, Col, Container, Row, Alert } from 'react-bootstrap';
import PageTitle from 'components/PageTitle';
import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Loader from 'components/Loader';
import FindDuplicate from 'components/FindDuplicate';
import { useSessionStorage } from "context/SessionStorageContext";
import HirexButton from 'components/HirexButton';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const PackageForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [findDuplicateName, setFindDuplicateName] = useState();
    const [duplicateFound, setDuplicateFound] = useState(false);
    const { username } = useSessionStorage();
    const { slug } = useParams();
    const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm({ mode: "all" });
    const [slugs, setSlugs] = useState();
    const [err, setErr] = useState();

    // Get By Slug
    const getBySlug = useCallback(() => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'master-package/' + slug).then((response) => {
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
        getSlug();
        if (slug) {
            getBySlug();
        }
    }, [slug, getBySlug]);

    // Get slug
    const getSlug = () => {
        axios.get(BASE_API_URL + 'master-package/slugs').then((response) => {
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
            let slug_name = data.packageName?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
            data.slug = slug_name.replace(/(^-+|-+$)/g, '');
            if (slug) {
                if (slug === "free-trial") {
                    delete data.packageName;
                    delete data.amount;
                    delete data.slug;
                }
                updatePackage(data);
            } else {
                createPackage(data);
            }
        }
    }

    // Create Package
    const createPackage = (data) => {
        data.createdUser = username;
        data.updatedUser = username;
        axios.post(BASE_API_URL + 'master-package', data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/packages');
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
    const updatePackage = (data) => {
        data.updatedUser = username;
        axios.put(BASE_API_URL + 'master-package/' + data._id, data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/packages');
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
                    pageTitle={slug ? 'Edit Package' : 'Add Package'}
                    pageUrl="/packages"
                    btnName="Back"
                />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                {
                                    slug === "free-trial" ? (
                                        <Alert variant="warning">
                                            Don't edit or update the package name and amount. This package will apply by default when registering an employer.
                                        </Alert>
                                    ) : ''
                                }
                                <Form autoComplete="off" onSubmit={handleSubmit(saveData)}>
                                    {slug && <Form.Control type="hidden" {...register("_id")}></Form.Control>}
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Package</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("packageName", {
                                                    required: "Package is required",
                                                    onChange: (e) => { setFindDuplicateName(e.target.value) }
                                                })}
                                                isInvalid={errors?.packageName}
                                                disabled={slug === "free-trial"}
                                            ></Form.Control>
                                            {errors?.packageName &&
                                                <span className="text-danger">{errors?.packageName?.message}</span>
                                            }
                                            {err?.packageName && <span className="text-danger">{err?.packageName}</span>}
                                            {findDuplicateName &&
                                                <FindDuplicate
                                                    searchName={findDuplicateName}
                                                    slugs={slugs}
                                                    message="Package already exists"
                                                    setDuplicateFound={setDuplicateFound}
                                                    flag="slug"
                                                />
                                            }
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Amount</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("amount", {
                                                    required: "Amount is required",
                                                    pattern: {
                                                        value: /^\d+$/,
                                                        message: "Enter digits only"
                                                    },
                                                })}
                                                isInvalid={errors?.amount}
                                                disabled={slug === "free-trial"}
                                            ></Form.Control>
                                            {errors?.amount &&
                                                <span className="text-danger">{errors?.amount?.message}</span>
                                            }
                                            {err?.amount && <span className="text-danger">{err?.amount}</span>}
                                        </Col>
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Form.Label column="true" md={3}>Validity</Form.Label>
                                        <Col md={9}>
                                            <Controller
                                                name="validity"
                                                control={control}
                                                defaultValue="6"
                                                render={({ field }) => (
                                                    <Form.Select {...field}>
                                                        <option value="28" defaultChecked>28 Days</option>
                                                        <option value="56">56 Days</option>
                                                        <option value="84">84 Days</option>
                                                        <option value="112">112 Days</option>
                                                    </Form.Select>
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Features</Form.Label>
                                        <Col md={9}>
                                            <Form.Control as="textarea" rows={3}
                                                {...register("features", {
                                                    required: "Features is required"
                                                })}
                                                isInvalid={errors?.features}
                                            ></Form.Control>
                                            {errors?.features &&
                                                <span className="text-danger">{errors?.features?.message}</span>
                                            }
                                            {err?.features && <span className="text-danger">{err?.features}</span>}
                                        </Col>
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Form.Label column="true" md={3}>Status</Form.Label>
                                        <Col md={9}>
                                            <Controller
                                                name="status"
                                                control={control}
                                                defaultValue="Y"
                                                render={({ field }) => (
                                                    <Form.Select {...field}>
                                                        <option value="Y" defaultChecked>Active</option>
                                                        <option value="N">Inactive</option>
                                                    </Form.Select>
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={12} className="text-center">
                                            <HirexButton btntype="success" slug={slug} flag="button" />
                                            <HirexButton btntype="cancel" flag="link" linkname="Cancel" redirectTo="/packages" />
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
export default PackageForm;