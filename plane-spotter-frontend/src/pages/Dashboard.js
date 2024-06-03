import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, FormControl, InputGroup, Modal, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
    Name: Yup.string().max(150, 'Name must be at most 150 characters').required('Name is required'),
    ShortName: Yup.string().max(5, 'Short Name must be at most 5 characters').required('Short Name is required'),
    AirlineCode: Yup.string()
        .matches(/^[A-Z]{3}-\d{4}$/, 'Airline Code must be in format AAA-1234')
        .required('Airline Code is required'),
    Location: Yup.string().max(200, 'Location must be at most 200 characters').required('Location is required'),
    CreatedDate: Yup.date().max(new Date(), 'Created Date must be in the past').required('Created Date is required'),
});

const Dashboard = () => {
    const [planeSightings, setPlaneSightings] = useState([]);
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlaneSightings();
    }, []);

    const fetchPlaneSightings = async () => {
        try {
            const response = await axios.get('https://localhost:7228/api/sighting');
            setPlaneSightings(response.data);
        } catch (error) {
            toast.error('Failed to fetch plane sightings');
        }
    };

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7228/api/sighting/${id}`);
            toast.success('Plane sighting deleted successfully!');
            fetchPlaneSightings();
        } catch (error) {
            toast.error('Failed to delete plane sighting');
        }
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredSightings = planeSightings.filter(sighting =>
        sighting.name.toLowerCase().includes(search.toLowerCase()) ||
        sighting.shortName.toLowerCase().includes(search.toLowerCase()) ||
        sighting.airlineCode.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container>
            <Row className="my-4">
                <Col>
                    <h2>Spotted Planes</h2>
                </Col>
                <Col className="text-right">
                    <Button onClick={handleShow}>Add Plane</Button>
                </Col>
            </Row>
            <Row className="my-4">
                <Col md="4">
                    <InputGroup>
                        <FormControl
                            placeholder="Search by Name, Short Name, or Airline Code"
                            value={search}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Table responsive striped bordered hover className="table-sm table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Photo</th>
                        <th>Short Name</th>
                        <th>Airline Code</th>
                        <th>Location</th>
                        <th>Created Date</th>
                        <th>Active</th>
                        <th>Delete</th>
                        <th>Created User ID</th>
                        <th>Modified User ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSightings.map(sighting => (
                        <tr key={sighting.planeId} onClick={() => navigate(`/plane/${sighting.planeId}`)}>
                            <td>
                                {sighting.photo==="null" || !sighting.photo ?  'N/A':(
                                    <img
                                        src={`data:image/jpeg;base64,${sighting.photo}`}
                                        alt="plane"
                                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                                    />
                                )}
                            </td>
                            <td>{sighting.shortName}</td>
                            <td>{sighting.airlineCode}</td>
                            <td>{sighting.location}</td>
                            <td>{new Date(sighting.createdDate).toLocaleString()}</td>
                            <td>{sighting.active ? 'Yes' : 'No'}</td>
                            <td>{sighting.delete ? 'Yes' : 'No'}</td>
                            <td>{sighting.createdUserId}</td>
                            <td>{sighting.modifiedUserId}</td>
                            <td>
                                <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleDelete(sighting.planeId); }}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Plane Sighting</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            Name: '',
                            ShortName: '',
                            AirlineCode: '',
                            Location: '',
                            CreatedDate: '',
                            Active: true,
                            Delete: false,
                            CreatedUserId: localStorage.getItem('userId'),
                            ModifiedUserId: localStorage.getItem('userId'),
                            Photo: null
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            const formData = new FormData();
                            Object.keys(values).forEach(key => {
                                if (key === 'Photo' && values[key]) {
                                    formData.append(key, values[key]);
                                } else {
                                    formData.append(key, values[key]);
                                }
                            });

                            try {
                                await axios.post('https://localhost:7228/api/sighting', formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                });
                                toast.success('Plane sighting added successfully!');
                                fetchPlaneSightings();
                                handleClose();
                            } catch (error) {
                                if (error.response && error.response.status === 409) {
                                    toast.error(error.response.data.message);
                                } else {
                                    toast.error('Failed to add plane sighting');
                                }
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ handleSubmit, setFieldValue, touched, errors }) => (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Field
                                        name="Name"
                                        type="text"
                                        as={Form.Control}
                                        isInvalid={touched.Name && !!errors.Name}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.Name}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formShortName">
                                    <Form.Label>Short Name</Form.Label>
                                    <Field
                                        name="ShortName"
                                        type="text"
                                        as={Form.Control}
                                        isInvalid={touched.ShortName && !!errors.ShortName}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.ShortName}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formAirlineCode">
                                    <Form.Label>Airline Code</Form.Label>
                                    <Field
                                        name="AirlineCode"
                                        type="text"
                                        as={Form.Control}
                                        isInvalid={touched.AirlineCode && !!errors.AirlineCode}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.AirlineCode}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formLocation">
                                    <Form.Label>Location</Form.Label>
                                    <Field
                                        name="Location"
                                        type="text"
                                        as={Form.Control}
                                        isInvalid={touched.Location && !!errors.Location}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.Location}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formCreatedDate">
                                    <Form.Label>Created Date</Form.Label>
                                    <Field
                                        name="CreatedDate"
                                        type="datetime-local"
                                        as={Form.Control}
                                        isInvalid={touched.CreatedDate && !!errors.CreatedDate}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.CreatedDate}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formActive">
                                    <Form.Check
                                        name="Active"
                                        label="Active"
                                        type="checkbox"
                                        onChange={e => setFieldValue('Active', e.target.checked)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formDelete">
                                    <Form.Check
                                        name="Delete"
                                        label="Delete"
                                        type="checkbox"
                                        onChange={e => setFieldValue('Delete', e.target.checked)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPhoto">
                                    <Form.Label>Photo</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="Photo"
                                        onChange={(e) => setFieldValue('Photo', e.target.files[0])}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Add
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Dashboard;
