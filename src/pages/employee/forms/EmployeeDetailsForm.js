import React, { useState, useEffect, useCallback } from 'react';
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
// import Select from "react-select";
import { useClearStorage } from 'utils/useClearStorage';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const EmployeeDetailsForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [findDuplicateName, setFindDuplicateName] = useState();
    const [duplicateFound, setDuplicateFound] = useState(false);
    const { slug } = useParams();
    const { username, token } = useSessionStorage();
    const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm({ mode: "all" });
    const [slugs, setSlugs] = useState();
    // const [roles, setRoles] = useState();
    const [err, setErr] = useState();
    const { clearStorage } = useClearStorage();
    const [menuItems, setMenuItems] = useState();
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [parentId, setParentId] = useState();
    const [subMenuIds, setSubMenuIds] = useState();

    // Get By Slug
    const getBySlug = useCallback(() => {
        setIsLoading(true);
        axios.get(BASE_API_URL + 'employee-details/' + slug, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
            if (response?.data?.result === true) {
                const data = response.data.employee_detail;
                for (const key in data) {
                    setValue(key, data[key]);
                }
                setValue("role", { label: data.roleType, value: data.roleSlug });
                setSelectedMenus(data.menuIds);
                setIsLoading(false);
            } else if (response?.data?.result === false) {
                clearStorage();
                sessionStorage.setItem("loginErr", LOGIN_ERR);
            }
        })
    }, [slug, setValue, token, clearStorage]);

    // Get slug
    const getSlug = useCallback(async () => {
        const response = await axios.get(BASE_API_URL + 'employee-details/emails', { headers: { Authorization: `Bearer ${token}` } });
        if (response?.data?.result === true) {
            setSlugs(response.data.emails);
        } else if (response?.data?.result === false) {
            clearStorage();
            sessionStorage.setItem("loginErr", LOGIN_ERR);
        }
    }, [token, clearStorage])

    // Get menu
    const getMenus = () => {
        axios.get(BASE_API_URL + 'admin-menus').then((response) => {
            if (response?.data?.result === true) {
                setMenuItems(response?.data?.menus[0]?.menuItems);
            } else {
                console.log(response?.data?.message);
            }
        })
    }

    const handleSubMenuChange = (event, parentId) => {
        const { checked, id } = event.target;
        const isParentIdPresent = selectedMenus.includes(parentId);
        const isSubMenuPresent = selectedMenus.includes(id);
        const subMenuIds = menuItems?.find(item => item.id === parentId)?.subMenu?.map(subItem => subItem.id);
        if (parentId && checked) {
            if (!isParentIdPresent) {
                setSelectedMenus(prevState => [...prevState, parentId, id]);
            } else {
                setSelectedMenus(prevState => [...prevState, id]);
            }
        } else if (parentId && !checked) {
            if (isSubMenuPresent) {
                setParentId(parentId);
                setSubMenuIds(subMenuIds);
                setSelectedMenus(prevState => prevState.filter(menuId => menuId !== id));
            }
        }
    };

    useEffect(() => {
        const areSubMenusUnchecked = subMenuIds?.every(subMenuId => !selectedMenus.includes(subMenuId));
        if (parentId && areSubMenusUnchecked && selectedMenus.includes(parentId)) {
            setSelectedMenus(prevState => prevState.filter(menuId => menuId !== parentId));
        }
    }, [selectedMenus, parentId, subMenuIds]);

    const handleMainMenuChange = (event) => {
        const { checked, id } = event.target;
        const mainMenu = menuItems?.find(item => item.id === id);
        if (mainMenu && checked) {
            if (mainMenu.subMenu) {
                const subMenuIds = mainMenu.subMenu?.map(subItem => subItem.id);
                setSelectedMenus(prevState => [...prevState, id, ...subMenuIds]);
            } else {
                setSelectedMenus(prevState => [...prevState, id]);
            }
        } else if (!checked) {
            const subMenuIds = mainMenu.subMenu?.map(subItem => subItem.id);
            setSelectedMenus(prevState => prevState.filter(menuId => !subMenuIds?.includes(menuId) && menuId !== id));
        }
    };

    // Use Effect
    useEffect(() => {
        getSlug();
        // getRole();
        getMenus();
        if (slug) {
            getBySlug();
        }
    }, [slug, getBySlug, getSlug]);

    // Password validation
    const isPasswordValid = (password) => {
        const specialCharacterRegex = /[@#$%^&*!]/; // Matches specific special characters
        const digitRegex = /\d/; // Matches any digit
        const uppercaseRegex = /[A-Z]/; // Matches any uppercase letter

        return (
            specialCharacterRegex.test(password) &&
            digitRegex.test(password) &&
            uppercaseRegex.test(password)
        );
    };

    // const getRole = () => {
    //     axios.get(BASE_API_URL + 'master-roletype').then((response) => {
    //         if (response?.data) {
    //             setRoles(response.data);
    //         }
    //     })
    // }

    // Save or update data
    const saveData = (data) => {
        if (!duplicateFound) {
            data.token = token;
            data.menuIds = selectedMenus;
            if (!data?.menuIds?.includes('1')) {
                data.menuIds = data.menuIds ? [...data.menuIds, '1'] : ['1'];
            }
            setIsLoading(true);
            if (data.role) {
                data.roleSlug = data.role.value;
                data.roleType = data.role.label;
            }
            delete data.role;
            if (slug) {
                updateEmployee(data);
            } else {
                createEmployee(data);
            }
        }
    }

    // Save Data
    const createEmployee = (data) => {
        data.createdUser = username;
        data.updatedUser = username;
        axios.post(BASE_API_URL + 'employee-details', data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/employee-details');
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored", });
                }, 100);
            } else if (response?.data?.result === false) {
                if (response.data.message === "Token Expired") {
                    clearStorage();
                    sessionStorage.setItem("loginErr", LOGIN_ERR);
                }
                setErr(response.data.errors);
                setIsLoading(false);
            }
        })
    }

    // Update Data
    const updateEmployee = (data) => {
        data.updatedUser = username;
        axios.put(BASE_API_URL + 'employee-details/' + data._id, data).then((response) => {
            if (response?.data?.result === true) {
                setIsLoading(false);
                reset();
                navigate('/employee-details');
                setTimeout(() => {
                    toast.success(response.data.message, { theme: "colored", });
                }, 100);
            } else if (response?.data?.result === false) {
                if (response.data.message === "Token Expired") {
                    clearStorage();
                    sessionStorage.setItem("loginErr", LOGIN_ERR);
                }
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
                    pageTitle={slug ? 'Edit User Details' : 'Add User Details'}
                    pageUrl="/employee-details"
                    btnName="Back"
                />
                <Row className='justify-content-center mb-3'>
                    <Col lg={12}>
                        <Card className='main-card'>
                            <Card.Body className="pb-0">
                                <Form autoComplete="off" onSubmit={handleSubmit(saveData)}>
                                    {slug && <Form.Control type="hidden" {...register("_id")}></Form.Control>}
                                    <Row className="mb-3">
                                        {/* <Col lg={6}>
                                            <div className="mb-3">
                                                <Form.Label md={3}>Employee Role</Form.Label>
                                                <Controller
                                                    name="role"
                                                    control={control}
                                                    rules={{ required: "Role is required" }}
                                                    render={({ field }) => (
                                                        <Select {...field}
                                                            options={roles?.map(role => ({
                                                                value: role.slug,
                                                                label: role.roleType,
                                                            }))}
                                                            placeholder="Select Role"
                                                        />
                                                    )}
                                                />
                                                {errors.role && (<span className="text-danger">{errors?.role && errors.role.message}</span>)}
                                                {err?.roleType && <span className="text-danger">{err?.roleType}</span>}
                                            </div>
                                        </Col> */}
                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>User Name</Form.Label>
                                                <Form.Control type="text"
                                                    {...register("empName", {
                                                        required: "Employee name is required",
                                                    })}
                                                    isInvalid={errors?.empName}
                                                ></Form.Control>
                                                {errors?.empName &&
                                                    <span className="text-danger">{errors?.empName?.message}</span>
                                                }
                                                {err?.empName && <span className="text-danger">{err?.empName}</span>}
                                            </Form.Group>
                                        </Col>
                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="text"
                                                    {...register("email", {
                                                        required: "Email is required",
                                                        pattern: {
                                                            value: /^\S+@\S+$/,
                                                            message: "Invalid email address"
                                                        },
                                                        onChange: (e) => { setFindDuplicateName(e.target.value) }
                                                    })}
                                                    isInvalid={errors?.email}
                                                ></Form.Control>
                                                {errors?.email &&
                                                    <span className="text-danger">{errors?.email?.message}</span>
                                                }
                                                {err?.email && <span className="text-danger">{err?.email}</span>}
                                                {findDuplicateName &&
                                                    <FindDuplicate
                                                        searchName={findDuplicateName}
                                                        slugs={slugs}
                                                        message="Email already exists"
                                                        setDuplicateFound={setDuplicateFound}
                                                        flag="email"
                                                    />
                                                }
                                            </Form.Group>
                                        </Col>
                                        {!slug &&
                                            <Col lg={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Password (Enter password carefully. Can't update after submit)</Form.Label>
                                                    <Form.Control type="password"
                                                        {...register("password", {
                                                            required: "Password is Required",
                                                            minLength: {
                                                                value: 8,
                                                                message: "Password must be minimum 8 characters"
                                                            },
                                                            validate: (value) =>
                                                                isPasswordValid(value) ||
                                                                "Password must contain at least one special character, one digit, and one uppercase letter",
                                                        })}
                                                        isInvalid={errors?.password}
                                                    />
                                                    {errors?.password &&
                                                        <span className="text-danger">{errors?.password?.message}</span>
                                                    }
                                                    {err?.password && <span className="text-danger">{err?.password}</span>}
                                                </Form.Group>
                                            </Col>
                                        }
                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Mobile Number</Form.Label>
                                                <Form.Control type="text"
                                                    {...register("mobileNo", {
                                                        required: "Mobile number is Required",
                                                        pattern: {
                                                            value: /^\d{10}$/,
                                                            message: "Enter digits only"
                                                        },
                                                        minLength: {
                                                            value: 10,
                                                            message: "Mobile number must be minimum 10 digits"
                                                        },
                                                        maxLength: {
                                                            value: 10,
                                                            message: "Mobile number must be 10 digits"
                                                        }
                                                    })}
                                                    isInvalid={errors?.mobileNo}
                                                />
                                                {errors?.mobileNo &&
                                                    <span className="text-danger">{errors?.mobileNo?.message}</span>
                                                }
                                                {err?.mobileNo && <span className="text-danger">{err?.mobileNo}</span>}
                                            </Form.Group>
                                        </Col>
                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Higer Education</Form.Label>
                                                <Form.Control type="text"
                                                    {...register("education", {
                                                        required: "Education is required",
                                                    })}
                                                    isInvalid={errors?.education}
                                                ></Form.Control>
                                                {errors?.education &&
                                                    <span className="text-danger">{errors?.education?.message}</span>
                                                }
                                                {err?.education && <span className="text-danger">{err?.education}</span>}
                                            </Form.Group>
                                        </Col>
                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control type="text"
                                                    {...register("address", {
                                                        required: "Address is required",
                                                    })}
                                                    isInvalid={errors?.address}
                                                ></Form.Control>
                                                {errors?.address &&
                                                    <span className="text-danger">{errors?.address?.message}</span>
                                                }
                                                {err?.address && <span className="text-danger">{err?.address}</span>}
                                            </Form.Group>
                                        </Col>
                                        {/* <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>License No</Form.Label>
                                                <Form.Control type="text" {...register("license")}></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col lg={6}>                                            <Form.Group className="mb-3">
                                            <Form.Label column="true" md={3}>HR UserCode</Form.Label>
                                            <Form.Control type="text" {...register("hrUserCode")}></Form.Control>
                                        </Form.Group>
                                        </Col> */}
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Form.Label>Status</Form.Label>
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
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={12}>
                                            <h4 className='title mb-3'>Menus</h4>
                                            {
                                                menuItems?.map((item, index) => (
                                                    <div key={item.id} className="mb-3">
                                                        <Form.Check
                                                            type='checkbox'
                                                            id={item.id}
                                                            label={item.name}
                                                            className={'mb-2 ' + (index === 0 ? 'd-none' : '')}
                                                            checked={selectedMenus.includes(item.id)}
                                                            onChange={(e) => handleMainMenuChange(e)}
                                                            disabled={index === 0}
                                                        />
                                                        {item.subMenu && (
                                                            <div className="d-flex flex-wrap"> {/* Indent sub-items */}
                                                                {item.subMenu.map(subItem => (
                                                                    <div key={subItem.id}>
                                                                        <Form.Check
                                                                            type='checkbox'
                                                                            id={subItem.id}
                                                                            label={subItem.name}
                                                                            className="me-3 mb-2"
                                                                            checked={selectedMenus.includes(subItem.id)}
                                                                            onChange={(e) => handleSubMenuChange(e, item.id)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            }
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={12} className="text-center">
                                            <HirexButton btntype="success" slug={slug} flag="button" />
                                            <HirexButton btntype="cancel" flag="link" linkname="Cancel" redirectTo="/employee-details" />
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
export default EmployeeDetailsForm;