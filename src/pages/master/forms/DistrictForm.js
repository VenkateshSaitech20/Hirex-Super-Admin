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

const DistrictForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [findDuplicateName, setFindDuplicateName] = useState();
    const [duplicateFound, setDuplicateFound] = useState(false);
    const { username } = useSessionStorage();
    const { slug } = useParams();
    const { register, handleSubmit, control, formState: {errors}, reset, setValue } = useForm({ mode : "all" });
    const [slugs, setSlugs] = useState();
    const [countries, setCountries] = useState();
    const [allStates, setAllStates] = useState();
    const [states, setStates] = useState();
    const [selectedState, setSelectedState] = useState(null);
    const [slugCountryId, setSlugCountryId] = useState(null);
    const [err, setErr] = useState();

    // Get By Slug
    const getBySlug = useCallback(async () => {
        const response = await axios.get(BASE_API_URL + 'master-district/' + slug);
        if (response?.data) {
            const data = response.data;
            for (const key in data) {
                setValue(key, data[key]);
            }
            setValue('country', { label: data.countryName, value: data.countryId });
            setValue('state', { label: data.stateName, value: data.stateId });
            setSlugCountryId(data.countryId);
        }
    }, [slug, setValue]);

    // Get Countries
    const getCountries = useCallback(() => {
        axios.get(BASE_API_URL+'master-country').then((response) => {
            if(response?.data){
                setCountries(response.data);
            }
        })
    },[])

    // Get States
    const getStates = useCallback(() => {
        axios.get(BASE_API_URL+'master-state').then((response) => {
            if(response?.data){
                setAllStates(response.data);
            }
        })
    },[])

    useEffect(() => {
        if(allStates && slugCountryId) {
            let states = allStates.filter(states => states.countryId === slugCountryId);
            setStates(states);
        }
    }, [allStates, slugCountryId]);

    // Use Effect
    useEffect(() => {
        getSlug();
        getCountries();
        getStates();
        if (slug) {
            getBySlug();
        }
    }, [slug, getBySlug, getCountries, getStates]);

    // Get slug
    const getSlug = async () => {
        setIsLoading(true);
        const response = await axios.get(BASE_API_URL+'master-district/slugs');
        if(response?.data){
            setSlugs(response.data);
            setIsLoading(false);
        }
    }

    // States populated based on country
    const handleStates = (selectedCountryId) => {
        setSelectedState(null);
        setValue("state", selectedState);
        let states = allStates?.filter(states => states.countryId === selectedCountryId);
        setStates(states);
    }

    // Submit data
    const saveData = (data) => {
        if(!duplicateFound){
            setIsLoading(true);
            let slug_name = data.districtName?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
            data.slug = slug_name.replace(/(^-+|-+$)/g, '');
            if(data.country){
                data.countryId = data.country.value;
                data.countryName = data.country.label;
            }
            delete data.country;
            if(data.state){
                data.stateId = data.state.value;
                data.stateName = data.state.label;
            }
            delete data.state;
            if(slug) {
                updateDistrict(data);
            } else {
                createDistrict(data);
            }
        }
    }

    // Save data
    const createDistrict = (data) => {
        data.createdUser = username;
        data.updatedUser = username;
        axios.post(BASE_API_URL+'master-district', data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/district');
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
    const updateDistrict = (data) => {
        data.updatedUser = username;
        axios.put(BASE_API_URL+'master-district/'+data._id,data).then((response)=>{
            if(response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/district');
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
                    pageTitle={slug ? 'Edit District' : 'Add District'} 
                    pageUrl="/district" 
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
                                                        onChange = {(selectedCountry) => {
                                                            field.onChange(selectedCountry);
                                                            handleStates(selectedCountry.value);
                                                        }}
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
                                    <Row className="mb-3">
                                        <Form.Label column="true" md={3}>State</Form.Label>
                                        <Col md={9}>
                                            <Controller
                                                name="state"
                                                control={control}
                                                rules={{ required: "State is required" }}
                                                render={({ field }) => (
                                                    <Select {...field} 
                                                        options={states?.map(state => ({
                                                            value: state.stateId,
                                                            label: state.stateName,
                                                        }))}
                                                        isClearable
                                                        placeholder="Select State"
                                                    />
                                                )}
                                            />
                                            {errors.state && ( <span className="text-danger">{errors?.state && errors.state.message}</span>)}
                                            { err?.stateName && <span className="text-danger">{err?.stateName}</span>}
                                        </Col>
                                    </Row>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>District</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("districtName",{
                                                    required: "District is required",
                                                    onChange : (e) => { setFindDuplicateName(e.target.value) }
                                                })}
                                                isInvalid = {errors?.districtName}
                                            ></Form.Control>
                                            { errors?.districtName && 
                                                <span className="text-danger">{errors?.districtName && errors.districtName.message}</span>
                                            }
                                            { err?.districtName && <span className="text-danger">{err?.districtName}</span>}
                                            { findDuplicateName && 
                                                <FindDuplicate 
                                                    searchName = {findDuplicateName} 
                                                    slugs = {slugs} 
                                                    message = "District already exists" 
                                                    setDuplicateFound={setDuplicateFound}
                                                    flag = "slug"
                                                /> 
                                            }
                                        </Col>
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Form.Label column="true" md={3}>Top List</Form.Label>
                                        <Col md={9}>
                                            <Controller
                                                name="topList"
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
                                            <HirexButton btntype="cancel" flag="link" linkname="Cancel" redirectTo="/district" />
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
export default DistrictForm;