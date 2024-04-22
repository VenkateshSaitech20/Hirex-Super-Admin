import React, { useState, useEffect, useCallback  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Card, Col, Container, Row } from 'react-bootstrap';
import PageTitle from 'components/PageTitle';
import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Loader from 'components/Loader';
import { useSessionStorage } from "context/SessionStorageContext";
import HirexButton from 'components/HirexButton';
import { validateImage } from '../../../utils/validateImage';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL ;

const FeatureCompaniesForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [imageValidationErr, setImageValidationErr] = useState();
    const [isValidImg, setIsValidImg] = useState(false);
    const { username } = useSessionStorage();
    const { slug } = useParams();
    const { register, handleSubmit, control, formState: {errors}, reset, setValue } = useForm({ mode : "all" });
    const [err, setErr] = useState();
    const [featureCompany, setFeatureCompany] = useState();
    
    // Get By Slug
    const getBySlug = useCallback(() => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'feature-companies/' + slug).then((response) => {
            if (response?.data?.result === true) {
                const data = response?.data?.featureCompany;
                setFeatureCompany(data);
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

    // Image change and show error
    const handleImageChange = async (e) => {
        setIsLoading(true);
        setIsValidImg(false);
        let image = e.target.files[0];
        setImageValidationErr();
        if (!validateImage(image, setImageValidationErr)) {
            setIsLoading(false);
            setIsValidImg(true);
        } else {
            setIsLoading(false);
            setIsValidImg(false);
        }
    }

    // Append fields to FormData
    const appendFieldsToFormData = (formData, data) => {
        for (const key in data) {
            formData.append(key, data[key]);
        }
    };

    // Submit
    const saveData = (data) => {
        const formData = new FormData();
        appendFieldsToFormData(formData, data);
        if(isValidImg){
            return;
        }
        if(slug) {
            updateCompany(formData);
        } else {
            saveCompany(formData);
        }
    }

    // Save data
    const saveCompany = (formData) => {
        setIsLoading(true);
        formData.append('createdUser', username);
        axios.post(BASE_API_URL+'feature-companies', formData).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/feature-companies');
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored",});
                }, 100);
            } else if (response?.data?.result === false) {
                setErr(response.data.errors);
                setIsLoading(false);
            }
        })
    }

    // Update data
    const updateCompany = (formData) => {
        setIsLoading(true);
        formData.delete('updatedUser');
        formData.append('updatedUser', username);
        axios.put(BASE_API_URL+'feature-companies/'+formData.get('_id'),formData).then((response)=>{
            if(response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/feature-companies');
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored",});
                }, 100); 
            } else if (response?.data?.result === false) {
                setErr(response.data.errors);
                setIsLoading(false);
            }
        })
    }

    // Use Effect
    useEffect(() => {
        if (slug) {
            getBySlug();
        }
    }, [slug, getBySlug]);

    return(
        <>
            <Container fluid className='section'>
                {isLoading && <Loader />}
                <PageTitle 
                    pageTitle={slug ? 'Edit Company' : 'Add Company'} 
                    pageUrl="/feature-companies" 
                    btnName="Back" 
                />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <Form autoComplete="off" onSubmit={handleSubmit(saveData)}>
                                    { slug && 
                                        <>
                                            <Form.Control type="hidden" {...register("_id")}></Form.Control>
                                            <Row className="mb-3">
                                                <Col md={3}><Form.Label>Current Image</Form.Label></Col>
                                                <Col md={9}>
                                                    {
                                                        featureCompany?.image && 
                                                        <img src={featureCompany?.image} alt="Company Logo" style={{ maxWidth: '100px', maxHeight: '100px' }} /> 
                                                    }
                                                </Col>
                                            </Row>
                                        </>
                                    }
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Image</Form.Label>
                                        <Col md={9}>
                                            <Controller
                                                name="image"
                                                control={control}
                                                rules={{ required: 'Image is required' }}
                                                render={({ field }) => (
                                                    <input 
                                                        type="file"
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            field.onChange(e.target.files[0]);
                                                            handleImageChange(e);
                                                        }}
                                                    />
                                                )}
                                            />
                                            <small className="text-danger">Image size : 760 * 260</small>
                                            {imageValidationErr && <p className="text-danger mb-0">{imageValidationErr}</p>}
                                            { errors?.image && 
                                                <span className="text-danger">{errors?.image && errors.image.message}</span>
                                            }
                                            { err?.image && 
                                                <span className="text-danger">{err?.image}</span>
                                            }
                                        </Col>
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Form.Label column="true" md={3}>Sequence Order</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text" {...register('sequenceOrder',{
                                                    required:"Sequence order is required"
                                                })}
                                                isInvalid = {errors?.sequenceOrder}
                                            ></Form.Control>
                                            { errors?.sequenceOrder && 
                                                <span className="text-danger">{errors?.sequenceOrder && errors.sequenceOrder.message}</span>
                                            }
                                            { err?.sequenceOrder && <span className="text-danger">{err?.sequenceOrder}</span> }
                                        </Col>
                                    </Row>
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
                                            <HirexButton btntype="cancel" flag="link" linkname="Cancel" redirectTo="/feature-companies" />
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
export default FeatureCompaniesForm;