// src/pages/user/TestDriveRegisterPage/TestDriveForm.jsx (updated to save to localStorage)
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import '../../../styles/TestDriveForm.scss';

const TestDriveForm = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        idNumber: '',
        address: '',
        preferredVehicle: '',
        dealership: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errors, setErrors] = useState({});

    const dealerships = [
        { value: 'hanoi', label: 'Hanoi - 123 Nguyen Trai, Thanh Xuan District' },
        { value: 'hcmc', label: 'Ho Chi Minh City - 456 Le Loi, District 1' },
        { value: 'danang', label: 'Da Nang - 789 Nguyen Van Linh, Hai Chau District' }
    ];

    useEffect(() => {
        const vehicleTitle = searchParams.get('vehicle');
        if (vehicleTitle && !formData.preferredVehicle) {
            setFormData(prev => ({ ...prev, preferredVehicle: decodeURIComponent(vehicleTitle) }));
        }
    }, [searchParams, formData.preferredVehicle]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
        if (!formData.phoneNumber.trim() || !/^\d{10,11}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10-11 digits.';
        if (!formData.idNumber.trim() || !/^\d{9,12}$/.test(formData.idNumber)) newErrors.idNumber = 'ID number must be 9-12 digits.';
        if (!formData.address.trim()) newErrors.address = 'Residential address is required.';
        if (!formData.preferredVehicle) newErrors.preferredVehicle = 'Please select a preferred vehicle.';
        if (!formData.dealership) newErrors.dealership = 'Please select a dealership.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const newTestDrive = { ...formData, date: new Date().toISOString() };
            const saved = JSON.parse(localStorage.getItem('testDrives') || '[]');
            saved.push(newTestDrive);
            localStorage.setItem('testDrives', JSON.stringify(saved));
            setTimeout(() => {
                setShowSuccess(true);
                setShowError(false);
                setFormData({
                    fullName: '',
                    phoneNumber: '',
                    idNumber: '',
                    address: '',
                    preferredVehicle: '',
                    dealership: ''
                });
            }, 1000);
        } else {
            setShowError(true);
            setShowSuccess(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            fullName: '',
            phoneNumber: '',
            idNumber: '',
            address: '',
            preferredVehicle: '',
            dealership: ''
        });
        setErrors({});
        setShowSuccess(false);
        setShowError(false);
    };

    return (
        <div className="test-drive-form-wrapper">
            <Form onSubmit={handleSubmit} className="eco-form">
                {showSuccess && (
                    <Alert variant="success" className="eco-alert">
                        Test drive registration successful! We will contact you within 24 hours. Check your history in the Test Drives tab.
                    </Alert>
                )}
                {showError && (
                    <Alert variant="danger" className="eco-alert">
                        Please check your form information.
                    </Alert>
                )}
                <Row className="g-3">
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="eco-label">Full Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`eco-input ${errors.fullName ? 'is-invalid' : ''}`}
                                placeholder="Enter full name"
                            />
                            {errors.fullName && <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="eco-label">Phone Number *</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`eco-input ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                placeholder="Enter phone number"
                            />
                            {errors.phoneNumber && <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="eco-label">ID Number *</Form.Label>
                            <Form.Control
                                type="text"
                                name="idNumber"
                                value={formData.idNumber}
                                onChange={handleChange}
                                className={`eco-input ${errors.idNumber ? 'is-invalid' : ''}`}
                                placeholder="Enter ID number"
                            />
                            {errors.idNumber && <Form.Control.Feedback type="invalid">{errors.idNumber}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="eco-label">Preferred Vehicle *</Form.Label>
                            <Form.Control
                                type="text"
                                name="preferredVehicle"
                                value={formData.preferredVehicle}
                                onChange={handleChange}
                                className={`eco-input ${errors.preferredVehicle ? 'is-invalid' : ''}`}
                                placeholder="Enter preferred vehicle"
                                readOnly
                            />
                            {errors.preferredVehicle && <Form.Control.Feedback type="invalid">{errors.preferredVehicle}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="eco-label">Residential Address *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`eco-input ${errors.address ? 'is-invalid' : ''}`}
                                placeholder="Enter detailed residential address"
                            />
                            {errors.address && <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="eco-label">Nearest Dealership *</Form.Label>
                            <Form.Select
                                name="dealership"
                                value={formData.dealership}
                                onChange={handleChange}
                                className={`eco-select ${errors.dealership ? 'is-invalid' : ''}`}
                            >
                                <option value="">Select dealership</option>
                                {dealerships.map((dealership) => (
                                    <option key={dealership.value} value={dealership.label}>{dealership.label}</option>
                                ))}
                            </Form.Select>
                            {errors.dealership && <div className="invalid-feedback">{errors.dealership}</div>}
                        </Form.Group>
                    </Col>
                </Row>
                <div className="form-actions eco-buttons">
                    <Button variant="outline-secondary" size="lg" className="me-3" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="eco-primary" size="lg" type="submit">
                        Submit Registration
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default TestDriveForm;