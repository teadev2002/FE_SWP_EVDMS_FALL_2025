import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../../styles/TestDriveForm.scss';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import TestDriveService from '../../../services/TestDriveService/TestDriveService';
import ManageHomePageService from '../../../services/ManageHomePageService/ManageHomePageService';

const QuoteForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        preferredVehicle: '',
        storeId: ''
    });
    const [stores, setStores] = useState([]);
    const [vehicleOptions, setVehicleOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});

    const mergeVehicleOptions = useCallback((options) => {
        if (!options?.length) return;
        setVehicleOptions(prev => {
            const merged = new Set(prev);
            options.forEach(opt => {
                if (opt) {
                    merged.add(opt);
                }
            });
            return Array.from(merged);
        });
    }, []);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const [vehiclesData, brandsData] = await Promise.all([
                    ManageHomePageService.getAllVehicles(),
                    ManageHomePageService.getAllBrands()
                ]);
                const formatted = vehiclesData.map(vehicle => {
                    const brand = brandsData.find(b => b.brandId === vehicle.brandId) || {};
                    const brandName = brand.brandName || 'Unknown';
                    return vehicle.modelName?.startsWith(brandName)
                        ? vehicle.modelName
                        : `${brandName} ${vehicle.modelName}`;
                });
                mergeVehicleOptions(formatted);
            } catch (error) {
                console.error('Error loading vehicles:', error);
            }
        };
        fetchVehicles();
    }, [mergeVehicleOptions]);

    useEffect(() => {
        const vehicleTitle = searchParams.get('vehicle');
        if (vehicleTitle && !formData.preferredVehicle) {
            const decoded = decodeURIComponent(vehicleTitle);
            setFormData(prev => ({ ...prev, preferredVehicle: decoded }));
            mergeVehicleOptions([decoded]);
        }
    }, [searchParams, formData.preferredVehicle, mergeVehicleOptions]);

    useEffect(() => {
        const historyQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
        const historyTestDrives = JSON.parse(localStorage.getItem('testDrives') || '[]');
        const collected = new Set();
        historyQuotes.forEach(item => {
            if (item.preferredVehicle) collected.add(item.preferredVehicle);
        });
        historyTestDrives.forEach(item => {
            if (item.preferredVehicle) collected.add(item.preferredVehicle);
        });
        mergeVehicleOptions(Array.from(collected));
    }, [mergeVehicleOptions]);

    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true);
            try {
                const data = await TestDriveService.getAllStores();
                setStores(data);
            } catch (error) {
                console.error('Error loading stores:', error);
                setErrorMessage('Unable to load stores. Please try again.');
                setShowError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, []);

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
        if (!formData.phone.trim() || !/^\d{10,11}$/.test(formData.phone))
            newErrors.phone = 'Phone number must be 10-11 digits.';
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = 'Please enter a valid email.';
        if (!formData.address.trim()) newErrors.address = 'Address is required.';
        if (!formData.preferredVehicle) newErrors.preferredVehicle = 'Please select a vehicle.';
        if (!formData.storeId) newErrors.storeId = 'Please select a store.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setShowError(true);
            setErrorMessage('Please check your information.');
            return;
        }

        setSubmitting(true);
        setShowSuccess(false);
        setShowError(false);

        try {
            const payload = {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                licenseUp: null,
                licenseDown: null,
                storeId: parseInt(formData.storeId)
            };

            await ManageCustomersService.AddCustomer(payload);

            const historyItem = {
                ...formData,
                storeName: stores.find(s => s.storeId === parseInt(formData.storeId))?.storeName || '',
                date: new Date().toISOString(),
                type: 'quote'
            };
            const saved = JSON.parse(localStorage.getItem('quotes') || '[]');
            saved.push(historyItem);
            localStorage.setItem('quotes', JSON.stringify(saved));
            mergeVehicleOptions([formData.preferredVehicle]);

            setShowSuccess(true);
            setTimeout(() => {
                setFormData({
                    fullName: '',
                    phone: '',
                    email: '',
                    address: '',
                    preferredVehicle: formData.preferredVehicle,
                    storeId: ''
                });
            }, 2000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Quote request failed. Please try again.');
            setShowError(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            fullName: '',
            phone: '',
            email: '',
            address: '',
            preferredVehicle: formData.preferredVehicle,
            storeId: ''
        });
        setErrors({});
        setShowSuccess(false);
        setShowError(false);
        navigate(-1);
    };

    return (
        <div className="test-drive-form-wrapper">
            <Form onSubmit={handleSubmit} className="eco-form">
                {showSuccess && (
                    <Alert variant="success" className="eco-alert">
                        Quote request submitted successfully! We will contact you within 24 hours with pricing details.
                    </Alert>
                )}
                {showError && (
                    <Alert variant="danger" className="eco-alert">
                        {errorMessage || 'Please check your information.'}
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
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`eco-input ${errors.phone ? 'is-invalid' : ''}`}
                                placeholder="e.g., 0901234567"
                            />
                            {errors.phone && <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="eco-label">Email *</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`eco-input ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="example@gmail.com"
                            />
                            {errors.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="eco-label">Preferred Vehicle *</Form.Label>
                            <Form.Select
                                name="preferredVehicle"
                                value={formData.preferredVehicle}
                                onChange={handleChange}
                                className={`eco-select ${errors.preferredVehicle ? 'is-invalid' : ''}`}
                            >
                                <option value="">-- Select a vehicle --</option>
                                {vehicleOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.preferredVehicle && <Form.Control.Feedback type="invalid">{errors.preferredVehicle}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>

                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="eco-label">Address *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`eco-input ${errors.address ? 'is-invalid' : ''}`}
                                placeholder="Enter your full address"
                            />
                            {errors.address && <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>

                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="eco-label">Select Store *</Form.Label>
                            {loading ? (
                                <div className="text-center p-3">
                                    <Spinner animation="border" size="sm" /> Loading stores...
                                </div>
                            ) : (
                                <Form.Select
                                    name="storeId"
                                    value={formData.storeId}
                                    onChange={handleChange}
                                    className={`eco-select ${errors.storeId ? 'is-invalid' : ''}`}
                                >
                                    <option value="">-- Select a store --</option>
                                    {stores.map(store => (
                                        <option key={store.storeId} value={store.storeId}>
                                            {store.storeName} - {store.address}
                                        </option>
                                    ))}
                                </Form.Select>
                            )}
                            {errors.storeId && <div className="invalid-feedback d-block">{errors.storeId}</div>}
                        </Form.Group>
                    </Col>
                </Row>

                <div className="form-actions eco-buttons">
                    <Button variant="outline-secondary" size="lg" className="me-3" onClick={handleCancel} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="eco-primary"
                        size="lg"
                        type="submit"
                        disabled={submitting || loading}
                    >
                        {submitting ? (
                            <>
                                <Spinner animation="border" size="sm" /> Submitting...
                            </>
                        ) : (
                            'Request Quote'
                        )}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default QuoteForm;

