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

const BuisinessUnitForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [findDuplicateName, setFindDuplicateName] = useState();
    const [duplicateFound, setDuplicateFound] = useState(false);
    const { username } = useSessionStorage();
    const { slug } = useParams();
    const { register, handleSubmit, control, formState: {errors}, reset, setValue } = useForm({ mode : "all" });
    const [slugs, setSlugs] = useState();
    const [zones, setZones] = useState([]);
    const [err, setErr] = useState();

    // Get By Slug
    const getBySlug = useCallback(() => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'business-unit/' + slug).then((response) => {
            if (response?.data) {
                const data = response.data;
                for (const key in data) {
                    setValue(key, data[key]);
                }
                setValue('zone', { label: data.zoneName, value: data.zoneSlug });
                setIsLoading(false);
            }
        })
        .catch((error) => {
            setIsLoading(false);
        });
    }, [slug, setValue]);

    // Get Zones
    const getZones = () => {
        axios.get(BASE_API_URL+'zone').then((response) => {
            if(response?.data){
                setZones(response.data);
            }
        })
    }

    // Use Effect
    useEffect(() => {
        getSlug();
        if (slug) {
            getBySlug();
        }
        getZones();
    }, [slug, getBySlug]);

    // Get slug
    const getSlug = () => {
        axios.get(BASE_API_URL+'business-unit/slugs').then((response)=>{
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
        if(!duplicateFound){
            setIsLoading(true);
            let slug_name = data.unitName?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
            data.slug = slug_name.replace(/(^-+|-+$)/g, '');
            if (data.zone) {
                data.zoneName = data.zone.label;
                data.zoneSlug = data.zone.value;
                delete data.zone;
            }
            if(slug) {
                updateUnit(data);
            } else {
                createUnit(data);
            }
        }
    }

    // Save data
    const createUnit = (data) => {
        data.createdUser = username;
        data.updatedUser = username;
        axios.post(BASE_API_URL+'business-unit', data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/business-unit');
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
    const updateUnit = (data) => {
        data.updatedUser = username;
        axios.put(BASE_API_URL+'business-unit/'+data._id,data).then((response)=>{
            if(response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/business-unit');
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
                    pageTitle={slug ? 'Edit Business Unit' : 'Add Business Unit'} 
                    pageUrl="/business-unit" 
                    btnName="Back" 
                />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <Form autoComplete="off" onSubmit={handleSubmit(saveData)}>
                                    {slug && <Form.Control type="hidden" {...register("_id")}></Form.Control> }
                                    <Row className="mb-3">
                                        <Form.Label column="true" md={3}>Zone</Form.Label>
                                        <Col md={9}>
                                            <Controller
                                                name="zone"
                                                control={control}
                                                rules={{ required: "Zone is required" }}
                                                render={({ field }) => (
                                                    <Select {...field} 
                                                        options={zones?.map(zone => ({
                                                            value: zone.slug,
                                                            label: zone.zoneName,
                                                        }))}
                                                        placeholder="Select Zone"
                                                    />
                                                )}
                                            />
                                            {errors.zone && ( <span className="text-danger">{errors?.zone && errors.zone.message}</span>)}
                                            { err?.zoneName && <span className="text-danger">{err?.zoneName}</span> }
                                        </Col>
                                    </Row>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Unit Name</Form.Label>
                                        <Col md={9}>
                                            <Form.Control type="text"
                                                {...register("unitName",{
                                                    required: "Unit is required",
                                                    onChange : (e) => { setFindDuplicateName(e.target.value) }
                                                })}
                                                isInvalid = {errors?.unitName}
                                            ></Form.Control>
                                            { errors?.unitName && 
                                                <span className="text-danger">{errors?.unitName && errors.unitName.message}</span>
                                            }
                                            { err?.unitName && <span className="text-danger">{err?.unitName}</span> }
                                            { findDuplicateName && 
                                                <FindDuplicate 
                                                    searchName = {findDuplicateName} 
                                                    slugs = {slugs} 
                                                    message = "Unit already exists" 
                                                    setDuplicateFound={setDuplicateFound}
                                                    flag = "slug"
                                                />
                                            }
                                        </Col>
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Col md={12} className="text-center">
                                            <HirexButton btntype="success" slug={slug} flag="button" />
                                            <HirexButton btntype="cancel" flag="link" linkname="Cancel" redirectTo="/business-unit" />
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
export default BuisinessUnitForm;