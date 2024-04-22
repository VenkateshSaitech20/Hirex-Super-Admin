import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Loader from 'components/Loader';
import { useNavigate } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import { useSessionStorage } from 'context/SessionStorageContext';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { username, setUsername, token, setToken, empno, setEmpno } = useSessionStorage();
    const { register, handleSubmit, formState : {errors}} = useForm({ mode : "all"});
    const [loginErr, setLoginErr] = useState();
    const [sessErr, setSessErr] = useState();

    useEffect(()=>{
        if(!username || !token || !empno){
            setIsLoading(true);
            let empNo = localStorage.getItem("empno");
            if(empNo) {
                axios.post(BASE_API_URL+'login/'+empNo).then((response)=>{
                    if(response?.data?.result === true) {
                        setIsLoading(false);
                        setUsername(response.data.username);
                        setEmpno(response.data.empno);
                        setToken(response.data.token);
                        navigate('/dashboard');
                    } else {
                        setIsLoading(false);
                        navigate("/");
                    }
                })
            } else {
                setIsLoading(false);
                navigate("/");
            }
        } else { 
            setIsLoading(false);
            navigate("/dashboard");
        };
    }, [navigate, username, token, empno, setUsername, setToken, setEmpno]);

    useEffect(()=>{
        let sessLoginErrData = sessionStorage.getItem("loginErr");
        if(sessLoginErrData){
            setSessErr(sessLoginErrData);
            setTimeout(()=>{
                sessionStorage.removeItem("loginErr");
                setSessErr(null);
            },5000);
        }
    },[setSessErr])

    const onLogin = (data) => {
        setIsLoading(true);
        axios.post(BASE_API_URL+'login',data).then((response)=>{
            if(response?.data?.result === true) {
                setIsLoading(false);
                localStorage.setItem("username",response.data.username);
                localStorage.setItem("empno",response.data.empno);
                localStorage.setItem("token",response.data.token);
                setUsername(response.data.username);
                setEmpno(response.data.empno);
                setToken(response.data.token);
                navigate('/dashboard');
                setTimeout(()=>{
                    toast.success("Hi "+response.data.username,{theme : "colored"});
                }, 100);
            } else {
                setLoginErr(response?.data?.message);
                setIsLoading(false);
            }
        })
    }

    return (
        <div className='login-bg'>
            <Container>
                <Row className='justify-content-center'>
                    {isLoading && <Loader />}
                    <Col lg={6}>
                        <Card className='login-card'>
                            <Card.Header>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4>Sign In</h4>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className='login-logo-box'>
                                    <img src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt='accreHealth' />
                                </div>
                                {loginErr && <Alert variant="danger">{loginErr}</Alert>}
                                {sessErr && <Alert variant="danger">{sessErr}</Alert>}
                                <Form className='default-form' onSubmit={handleSubmit(onLogin)}autoComplete="off">
                                    <Form.Group className="mb-3" >
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Email" 
                                            {...register("email",{
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^\S+@\S+$/,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                            isInvalid = {errors?.email}
                                        />
                                        {errors?.email && <span className="text-danger">{errors?.email?.message}</span>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Control 
                                            type="password"
                                            placeholder="Password" 
                                            {...register("password",{
                                                required: "Password is required"
                                            })}
                                            isInvalid = {errors?.password}
                                        />
                                        {errors?.password && <span className="text-danger">{errors?.password?.message}</span>}
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-center">
                                        <Button type="submit" className="btn btn-main">
                                            <FontAwesomeIcon icon={faArrowRightToBracket} className='me-2' />
                                            Sign In
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer/>
        </div>
    );
};

export default Login;