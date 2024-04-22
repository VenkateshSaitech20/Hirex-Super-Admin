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

const CountryForm = () => {
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
        axios.get(BASE_API_URL + 'master-country/' + slug).then((response) => {
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
        getShortName();
        if (slug) {
            getBySlug();
        }
    }, [slug, getBySlug]);

    // Get Short Name
    const getShortName = () => {
        axios.get(BASE_API_URL+'master-country/shortname').then((response)=>{
            if(response?.data){
                let data = response.data.map(item => item.toLowerCase());
                setSlugs(data);
            }
        })
    }

    // Save
    const saveData = (data) => {
        if(!duplicateFound){
            setIsLoading(true);
            if(slug) {
                updateCountry(data);
            } else {
                createCountry(data);
            }
        }
    }

    // Create country
    const createCountry = (data) => {
        data.createdUser = username;
        data.updatedUser = username;
        data.shortName = data.shortName.toUpperCase();
        axios.post(BASE_API_URL+'master-country', data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/country');
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored",});
                }, 100);   
            } else if (response?.data?.result === false) {
                setErr(response.data.errors);
                setIsLoading(false);
            }
        })
    }

    // Update country
    const updateCountry = (data) => {
        data.updatedUser = username;
        data.shortName = data.shortName.toUpperCase();
        axios.put(BASE_API_URL+'master-country/'+data._id,data).then((response)=>{
            if(response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/country');
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
                    pageTitle={slug ? 'Edit Country' : 'Add Country'} 
                    pageUrl="/country" 
                    btnName="Back" 
                />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <Form autoComplete="off" onSubmit={handleSubmit(saveData)}>
                                    {slug && <Form.Control type="hidden" {...register("_id")}></Form.Control>}
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Country Short Name</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("shortName",{
                                                    required: "Country short name is required",
                                                    onChange : (e) => { setFindDuplicateName(e.target.value.toLowerCase()) }
                                                })}
                                                isInvalid = {errors?.shortName}
                                            ></Form.Control>
                                            { errors?.shortName && 
                                                <span className="text-danger">{errors?.shortName && errors.shortName.message}</span>
                                            }
                                            { err?.shortName && 
                                                <span className="text-danger">{err?.shortName}</span>
                                            }
                                            { findDuplicateName && 
                                                <FindDuplicate 
                                                    searchName = {findDuplicateName} 
                                                    slugs = {slugs} 
                                                    message = "Short name already exists" 
                                                    setDuplicateFound={setDuplicateFound}
                                                    flag = "email"
                                                /> 
                                            }
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Country</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("countryName",{
                                                    required: "Country name is required"
                                                })}
                                                isInvalid = {errors?.countryName}
                                            ></Form.Control>
                                            { errors?.countryName && 
                                                <span className="text-danger">{errors?.countryName && errors.countryName.message}</span>
                                            }
                                            { err?.countryName && 
                                                <span className="text-danger">{err?.countryName}</span>
                                            }
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Phone Code</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("phoneCode",{
                                                    required: "Phone Code is required"
                                                })}
                                                isInvalid = {errors?.phoneCode}
                                            ></Form.Control>
                                            { errors?.phoneCode && 
                                                <span className="text-danger">{errors?.phoneCode && errors.phoneCode.message}</span>
                                            }
                                            { err?.phoneCode && 
                                                <span className="text-danger">{err?.phoneCode}</span>
                                            }
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
                                            <HirexButton btntype="cancel" flag="link" linkname="Cancel" redirectTo="/country" />
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
export default CountryForm;