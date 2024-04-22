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
import Select from "react-select";
import HirexButton from 'components/HirexButton';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL ;

const StateForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [findDuplicateName, setFindDuplicateName] = useState();
    const [duplicateFound, setDuplicateFound] = useState(false);
    const { username } = useSessionStorage();
    const { slug } = useParams();
    const { register, handleSubmit, control, formState: {errors}, reset, setValue } = useForm({ mode : "all" });
    const [slugs, setSlugs] = useState();
    const [countries, setCountries] = useState();
    const [err, setErr] = useState();

    // Get By Slug
    const getBySlug = useCallback(() => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'master-state/' + slug).then((response) => {
            if (response?.data) {
                const data = response.data;
                for (const key in data) {
                    setValue(key, data[key]);
                }
                setValue('country', { label: data.countryName, value: data.countryId });
                setIsLoading(false);
            }
        })
    }, [slug, setValue]);

    // Get Countries
    const getCountries = useCallback(() => {
        axios.get(BASE_API_URL+'master-country').then((response) => {
            if(response?.data){
                setCountries(response.data);
            }
        })
    },[])

    // Use Effect
    useEffect(() => {
        getSlug();
        getCountries();
        if (slug) {
            getBySlug();
        }
    }, [slug, getBySlug, getCountries]);

    // Get slug
    const getSlug = () => {
        axios.get(BASE_API_URL+'master-state/slugs').then((response)=>{
            if(response?.data){
                setSlugs(response.data);
            }
        })
    }

    // Save
    const saveData = (data) => {
        if(!duplicateFound){
            setIsLoading(true);
            let slug_name = data.stateName?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
            data.slug = slug_name.replace(/(^-+|-+$)/g, '');
            if(data.country){
                data.countryId = data.country.value;
                data.countryName = data.country.label;
            }
            delete data.country;
            if(slug) {
                updateState(data);
            } else {
                createState(data);
            }
        }
    }

    // Create State
    const createState = (data) => {
        data.createdUser = username;
        data.updatedUser = username;
        axios.post(BASE_API_URL+'master-state', data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/states');
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored",});
                }, 100);   
            } else if (response?.data?.result === false) {
                setErr(response.data.errors);
                setIsLoading(false);
            }
        })
    }

    // Update State
    const updateState = (data) => {
        data.updatedUser = username;
        axios.put(BASE_API_URL+'master-state/'+data._id,data).then((response)=>{
            if(response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/states');
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
                    pageTitle={slug ? 'Edit State' : 'Add State'} 
                    pageUrl="/states" 
                    btnName="Back" 
                />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <Form autoComplete="off" onSubmit={handleSubmit(saveData)}>
                                    {slug && <Form.Control type="hidden" {...register("_id")}></Form.Control> }
                                    <Row className="mb-3">
                                        <Form.Label column="true" md={3}>Country</Form.Label>
                                        <Col md={9}>
                                            <Controller
                                                name="country"
                                                control={control}
                                                rules={{ required: "Country is required" }}
                                                render={({ field }) => (
                                                    <Select {...field} 
                                                        options={countries?.map(country => ({
                                                            value: country.countryId,
                                                            label: country.countryName,
                                                        }))}
                                                        placeholder="Select Country"
                                                    />
                                                )}
                                            />
                                            {errors.country && ( <span className="text-danger">{errors?.country && errors.country.message}</span>)}
                                            { err?.countryName && 
                                                <span className="text-danger">{err?.countryName}</span>
                                            }
                                        </Col>
                                    </Row>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>State</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("stateName",{
                                                    required: "State is required",
                                                    onChange : (e) => { setFindDuplicateName(e.target.value) }
                                                })}
                                                isInvalid = {errors?.stateName}
                                            ></Form.Control>
                                            { errors?.stateName && 
                                                <span className="text-danger">{errors?.stateName && errors.stateName.message}</span>
                                            }
                                            { err?.stateName && 
                                                <span className="text-danger">{err?.stateName}</span>
                                            }
                                            { findDuplicateName && 
                                                <FindDuplicate 
                                                    searchName = {findDuplicateName} 
                                                    slugs = {slugs} 
                                                    message = "State already exists" 
                                                    setDuplicateFound={setDuplicateFound}
                                                    flag = "slug"
                                                /> 
                                            }
                                        </Col>
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Form.Label column="true" md={3}>Filter State</Form.Label>
                                        <Col md={9}>
                                            <Controller
                                                name="filtered"
                                                control={control}
                                                defaultValue="N"
                                                render={({ field }) => (
                                                    <Form.Select {...field}>
                                                        <option value="Y">Yes</option>
                                                        <option value="N" defaultChecked>No</option>
                                                    </Form.Select>
                                                )}
                                            />
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
                                            <HirexButton btntype="cancel" flag="link" linkname="Cancel" redirectTo="/states" />
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
export default StateForm;