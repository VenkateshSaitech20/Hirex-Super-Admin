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
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL ;

const PackageDetailForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { username } = useSessionStorage();
    const { slug } = useParams();
    const { register, handleSubmit, control, reset, setValue } = useForm({ mode : "all" });
    const [fields, setFields] = useState([]);
    const [ updateData, setUpdateData ] = useState();

    // Get By Slug
    const getBySlug = useCallback(() => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'master-package-detail/' + slug).then((response) => {
            if (response?.data) {
                const data = response.data.packagedetails;
                data.forEach((detail) => {
                    setValue(detail.colName, detail.value);
                });
                setIsLoading(false);
                setUpdateData("Y");
            } else {
                setIsLoading(false);
                setUpdateData("N");
            }
        })
        .catch((error) => {
            setIsLoading(false);
        });
    }, [slug, setValue]);

    // Use Effect
    useEffect(() => {
        getPackageFeatures();
        if (slug) {
            getBySlug();
        }
    }, [slug, getBySlug]);

    // Get Package Feature
    const getPackageFeatures = () => {
        axios.get(BASE_API_URL+'master-package-feature').then((response)=>{
            if(response?.data){
                setFields(response.data);
            }
        })
    }

    // Save or update data
    const saveData = (data) => {
        let postdata = {};
        const currentDate = new Date().toISOString();
        if(slug) postdata.packageId = slug; 
        delete data._id;
        if(updateData === "Y"){
            postdata.updatedUser = username;
            postdata.updatedAt = currentDate;
        } else {
            postdata.createdUser = username;
            postdata.updatedUser = username;
            postdata.createdAt = currentDate;
            postdata.updatedAt = currentDate;
        }

        let matchingFields = fields.filter(field => Object.keys(data).includes(field.colName));
        matchingFields.forEach(field => {
            const colName = field.colName;
            if (data.hasOwnProperty(colName)) {
                field.value = data[colName];
                delete data[colName];
            }
        });
        const propertiesToRemove = ['__v', 'createdAt', 'createdUser', 'isDeleted', 'updatedAt', 'updatedUser', '_id'];
        let modifiedMatchingFields = matchingFields.map(obj => {
            for (const prop of propertiesToRemove) {
                delete obj[prop];
            }
            return obj;
        });
        
        postdata.packagedetails = modifiedMatchingFields;
        axios.post(BASE_API_URL+'master-package-detail',postdata).then((response)=>{
            if(response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/packages');
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored",});
                }, 100); 
            }
        })
    }

    const renderField = (field) => {
        if(field.fieldType === "text"){
            return renderTextField(field);
        } else if (field.fieldType === "select"){
            return renderSelectField(field);
        } 
        // else {    
        //     return renderField(field);
        // }
    }

    const renderTextField = (field) => {
        return(
            <Form.Group as={Row} className="mb-3" key={field.slug}>
                <Form.Label column="true" md={3}>{field.featureName}</Form.Label>
                <Col md={9}>
                    <Form.Control type="text" {...register(field.colName)}></Form.Control>
                </Col>
            </Form.Group>
        )
    }

    const renderSelectField = (field) => {
        return(
            <Row className="mb-3" key={field.slug}>
                <Form.Label column="true" md={3}>{field.featureName}</Form.Label>
                <Col md={9}>
                    <Controller
                        name={field.colName}
                        control={control}
                        defaultValue="Y"
                        render={({ field }) => (
                            <Form.Select {...field}>
                                <option value="Y" defaultChecked>Yes</option>
                                <option value="N">No</option>
                            </Form.Select>
                        )}
                    />
                </Col>
            </Row>
        )
    }

    return(
        <>
            <Container fluid className='section'>
                {isLoading && <Loader />}
                <PageTitle 
                    pageTitle={slug ? 'Edit Package Detail' : 'Add Package Detail'} 
                    pageUrl="/packages" 
                    btnName="Back" 
                />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <Form autoComplete="off" onSubmit={handleSubmit(saveData)}>
                                    {fields.map((field) => renderField(field))}
                                    <Row className="mb-3">
                                        <Col md={12} className="text-center">
                                            <HirexButton btntype="success" flag="button" />
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
export default PackageDetailForm;