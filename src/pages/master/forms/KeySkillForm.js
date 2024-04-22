import React, { useState, useEffect, useCallback  } from 'react';
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
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL ;

const KeySkillForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [findDuplicateName, setFindDuplicateName] = useState();
    const [duplicateFound, setDuplicateFound] = useState(false);
    const { username } = useSessionStorage();
    const { slug } = useParams();
    const { register, handleSubmit, formState: {errors}, reset, setValue } = useForm({ mode : "all" });
    const [slugs, setSlugs] = useState();
    const [err, setErr] = useState();

    // Get By Slug
    const getBySlug = useCallback(() => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'master-keyskill/' + slug).then((response) => {
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
        axios.get(BASE_API_URL+'master-keyskill/slugs').then((response)=>{
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
            let slug_name = data.keySkill?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
            data.slug = slug_name.replace(/(^-+|-+$)/g, '');
            if(slug) {
                updateKeySkill(data);
            } else {
                createKeySkill(data);
            }
        }
    }

    // Save data
    const createKeySkill = (data) => {
        data.createdUser = username;
        data.updatedUser = username;
        axios.post(BASE_API_URL+'master-keyskill', data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/keyskill');
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
    const updateKeySkill = (data) => {
        data.updatedUser = username;
        axios.put(BASE_API_URL+'master-keyskill/'+data._id,data).then((response)=>{
            if(response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/keyskill');
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
                    pageTitle={slug ? 'Edit Keyskill' : 'Add Keyskill'} 
                    pageUrl="/keyskill" 
                    btnName="Back" 
                />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <Form autoComplete="off" onSubmit={handleSubmit(saveData)}>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column="true" md={3}>Keyskill</Form.Label>
                                        <Col md={9}>
                                            {slug && 
                                                <Form.Control type="hidden" {...register("_id")}></Form.Control>
                                            }
                                            <Form.Control type="text"
                                                {...register("keySkill",{
                                                    required: "Keyskill is required",
                                                    onChange : (e) => { setFindDuplicateName(e.target.value) }
                                                })}
                                                isInvalid = {errors?.keySkill}
                                            ></Form.Control>
                                            { errors?.keySkill && 
                                                <span className="text-danger">{errors?.keySkill && errors.keySkill.message}</span>
                                            }
                                            { err?.keySkill && <span className="text-danger">{err?.keySkill}</span> }
                                            { findDuplicateName && 
                                                <FindDuplicate 
                                                    searchName = {findDuplicateName} 
                                                    slugs = {slugs} 
                                                    message = "Keyskill already exists" 
                                                    setDuplicateFound={setDuplicateFound}
                                                    flag = "slug"
                                                /> 
                                            }
                                        </Col>
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Col md={12} className="text-center">
                                            <HirexButton btntype="success" slug={slug} flag="button" />
                                            <HirexButton btntype="cancel" flag="link" linkname="Cancel" redirectTo="/keyskill" />
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
export default KeySkillForm;