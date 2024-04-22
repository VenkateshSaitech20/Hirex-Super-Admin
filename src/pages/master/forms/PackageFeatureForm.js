import React, { useState, useEffect, useCallback  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from 'components/PageTitle';
import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Loader from 'components/Loader';
import FindDuplicate from 'components/FindDuplicate';
import { useSessionStorage } from "context/SessionStorageContext";
import HirexButton from 'components/HirexButton';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL ;

const PackageFeatureForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [findDuplicateName, setFindDuplicateName] = useState();
    const [duplicateFound, setDuplicateFound] = useState(false);
    const { username } = useSessionStorage();
    const { slug } = useParams();
    const { register, handleSubmit, control, formState: {errors}, reset, setValue } = useForm({ mode : "all" });
    const [slugs, setSlugs] = useState();
    const [err, setErr] = useState();

    // Get By Slug
    const getBySlug = useCallback(() => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'master-package-feature/' + slug).then((response) => {
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
        axios.get(BASE_API_URL+'master-package-feature/slugs').then((response)=>{
            if(response?.data){
                setSlugs(response.data);
            }
        })
        .catch((error) => {
            console.log("error : ",error);
        })
    }

    // Save or update data
    const saveData = (data) => {
        let slug_name = data.featureName?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
        data.slug = slug_name.replace(/(^-+|-+$)/g, '');
        if(!duplicateFound){
            setIsLoading(true);
            if(slug) {
                updatePackageFeature(data);
            } else {
                // Column Name
                let col_name = data.featureName?.replace(/[^a-zA-Z0-9 ]+/g, "-");
                data.colName = col_name.replace(/(^-+|-+$)/g, '').replace(/\s+/g, '');
                createPackageFeature(data);
            }
        }
    }

    // Create Package Feature
    const createPackageFeature = (data) => {
        data.createdUser = username;
        data.updatedUser = username;
        axios.post(BASE_API_URL+'master-package-feature', data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/package-features');
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored",});
                }, 100);   
            } else if (response?.data?.result === false) {
                setErr(response.data.errors);
                setIsLoading(false);
            }
        })
    }

    // Update Package Feature
    const updatePackageFeature = (data) => {
        data.updatedUser = username;
        axios.put(BASE_API_URL+'master-package-feature/'+data._id,data).then((response)=>{
            if(response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/package-features');
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored",});
                }, 100); 
            } else if (response?.data?.result === false) {
                setErr(response.data.errors);
                setIsLoading(false);
            }
        })
    }

    return(
        <>
            <Container fluid className='section'>
                {isLoading && <Loader />}
                <PageTitle 
                    pageTitle={slug ? 'Edit Package' : 'Add Package'} 
                    pageUrl="/package-features" 
                    btnName="Back" 
                />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <Form autoComplete="off" onSubmit={handleSubmit(saveData)}>
                                    {slug && <Form.Control type="hidden" {...register("_id")}></Form.Control>}
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Feature</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("featureName",{
                                                    required: "Feature is required",
                                                    onChange : (e) => { setFindDuplicateName(e.target.value) }
                                                })}
                                                isInvalid = {errors?.featureName}
                                            ></Form.Control>
                                            { errors?.featureName && 
                                                <span className="text-danger">{errors?.featureName && errors.featureName.message}</span>
                                            }
                                            { err?.featureName && <span className="text-danger">{err?.featureName}</span> }
                                            { findDuplicateName && 
                                                <FindDuplicate 
                                                    searchName = {findDuplicateName} 
                                                    slugs = {slugs} 
                                                    message = "Feature already exists" 
                                                    setDuplicateFound={setDuplicateFound}
                                                    flag = "slug"
                                                /> 
                                            }
                                        </Col>
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Form.Label column="true" md={3}>Field type</Form.Label>
                                        <Col md={9}>
                                            <Controller
                                                name="fieldType"
                                                control={control}
                                                defaultValue="text"
                                                render={({ field }) => (
                                                    <Form.Select {...field}>
                                                        <option value="text" defaultChecked>Text box</option>
                                                        <option value="select">Select box</option>
                                                    </Form.Select>
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={12} className="text-center">
                                            <HirexButton btntype="success" slug={slug} flag="button" />
                                            <HirexButton btntype="cancel" flag="link" linkname="Cancel" redirectTo="/package-features" />
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
export default PackageFeatureForm;