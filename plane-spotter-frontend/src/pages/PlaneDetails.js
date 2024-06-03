import axios from 'axios';
import { Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
    name: Yup.string().max(150, 'Name must be at most 150 characters').required('Name is required'),
    shortName: Yup.string().max(5, 'Short Name must be at most 5 characters').required('Short Name is required'),
    airlineCode: Yup.string()
        .matches(/^[A-Z]{3}-\d{4}$/, 'Airline Code must be in format AAA-1234')
        .required('Airline Code is required'),
    location: Yup.string().max(200, 'Location must be at most 200 characters').required('Location is required'),
    createdDate: Yup.date().max(new Date(), 'Created Date must be in the past').required('Created Date is required'),
});

const EditPlaneSighting = () => {
    const [planeSighting, setPlaneSighting] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlaneSighting();
    }, []);

    const fetchPlaneSighting = async () => {
        try {
            const response = await axios.get(`https://localhost:7228/api/sighting/${id}`);
            setPlaneSighting(response.data);
        } catch (error) {
            toast.error('Failed to fetch plane sighting');
        }
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (key === 'Photo' && values[key]) {
                formData.append(key, values[key], values[key].name);
            } else {
                formData.append(key, values[key]);
            }
        });

        try {
            await axios.put(`https://localhost:7228/api/sighting/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Plane sighting updated successfully!');
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to update plane sighting');
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center">
            {planeSighting && (
                <Card className="w-100 mt-5" style={{ maxWidth: '600px' }}>
                    <Card.Header>
                        <h3>Plane Detail - {planeSighting.airlineCode}</h3>
                        <p>Created by: {planeSighting.createdUserId}</p>
                    </Card.Header>
                    <Card.Body>
                        <Formik
                            initialValues={{
                                name: planeSighting.name,
                                shortName: planeSighting.shortName,
                                airlineCode: planeSighting.airlineCode,
                                location: planeSighting.location,
                                createdDate: planeSighting.createdDate,
                                active: planeSighting.active,
                                delete: planeSighting.delete,
                                createdUserId: planeSighting.createdUserId,
                                modifiedUserId: localStorage.getItem("userId"),
                                Photo: null
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ handleSubmit, setFieldValue, touched, errors }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formName">
                                        <Form.Label>Name</Form.Label>
                                        <Field
                                            name="name"
                                            type="text"
                                            as={Form.Control}
                                            isInvalid={touched.name && !!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formShortName">
                                        <Form.Label>Short Name</Form.Label>
                                        <Field
                                            name="shortName"
                                            type="text"
                                            as={Form.Control}
                                            isInvalid={touched.shortName && !!errors.shortName}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.shortName}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formAirlineCode">
                                        <Form.Label>Airline Code</Form.Label>
                                        <Field
                                            name="airlineCode"
                                            type="text"
                                            as={Form.Control}
                                            isInvalid={touched.airlineCode && !!errors.airlineCode}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.airlineCode}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formLocation">
                                        <Form.Label>Location</Form.Label>
                                        <Field
                                            name="location"
                                            type="text"
                                            as={Form.Control}
                                            isInvalid={touched.location && !!errors.location}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formCreatedDate">
                                        <Form.Label>Created Date</Form.Label>
                                        <Field
                                            name="createdDate"
                                            type="datetime-local"
                                            as={Form.Control}
                                            isInvalid={touched.createdDate && !!errors.createdDate}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.createdDate}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formActive">
                                        <Form.Check
                                            name="active"
                                            label="Active"
                                            type="checkbox"
                                            defaultChecked={planeSighting.active}
                                            onChange={e => setFieldValue('active', e.target.checked)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formDelete">
                                        <Form.Check
                                            name="delete"
                                            label="Delete"
                                            type="checkbox"
                                            defaultChecked={planeSighting.delete}
                                            onChange={e => setFieldValue('delete', e.target.checked)}
                                        />
                                    </Form.Group>
                                    {planeSighting.photo ? (
                                        <div>
                                            <img
                                                src={`data:image/jpeg;base64,${planeSighting.photo}`}
                                                alt="Plane"
                                                style={{ maxWidth: '100%', maxHeight: '300px' }}
                                            />
                                        </div>
                                    ):(<h3>N/A</h3>)}
                                    <Form.Group controlId="formPhoto">
                                        <Form.Label>Photo</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="Photo"
                                            onChange={(e) => setFieldValue('Photo', e.target.files[0])}
                                        />
                                    </Form.Group>
                                    <div style={{display:"flex",flexDirection:"row",justifyContent:'space-between'}}>
                                    <Button variant="primary" type="submit" className="mt-3 mr-5">
                                        Update
                                    </Button>
                                    
                                    <Button variant="primary" onClick={()=>{
                                        navigate("/")
                                    }} className="mt-3 ">
                                        Cancel
                                    </Button>
                                    </div>
                                    
                                </Form>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default EditPlaneSighting;
