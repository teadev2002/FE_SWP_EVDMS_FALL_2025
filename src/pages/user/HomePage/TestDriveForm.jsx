// // src/pages/user/TestDriveRegisterPage/TestDriveForm.jsx (updated to save to localStorage)
// import React, { useState, useEffect } from 'react';
// import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
// import { useSearchParams } from 'react-router-dom';
// import '../../../styles/TestDriveForm.scss';

// const TestDriveForm = () => {
//     const [searchParams] = useSearchParams();
//     const [formData, setFormData] = useState({
//         fullName: '',
//         phoneNumber: '',
//         idNumber: '',
//         address: '',
//         preferredVehicle: '',
//         dealership: ''
//     });
//     const [showSuccess, setShowSuccess] = useState(false);
//     const [showError, setShowError] = useState(false);
//     const [errors, setErrors] = useState({});

//     const dealerships = [
//         { value: 'hanoi', label: 'Hanoi - 123 Nguyen Trai, Thanh Xuan District' },
//         { value: 'hcmc', label: 'Ho Chi Minh City - 456 Le Loi, District 1' },
//         { value: 'danang', label: 'Da Nang - 789 Nguyen Van Linh, Hai Chau District' }
//     ];

//     useEffect(() => {
//         const vehicleTitle = searchParams.get('vehicle');
//         if (vehicleTitle && !formData.preferredVehicle) {
//             setFormData(prev => ({ ...prev, preferredVehicle: decodeURIComponent(vehicleTitle) }));
//         }
//     }, [searchParams, formData.preferredVehicle]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
//         if (!formData.phoneNumber.trim() || !/^\d{10,11}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10-11 digits.';
//         if (!formData.idNumber.trim() || !/^\d{9,12}$/.test(formData.idNumber)) newErrors.idNumber = 'ID number must be 9-12 digits.';
//         if (!formData.address.trim()) newErrors.address = 'Residential address is required.';
//         if (!formData.preferredVehicle) newErrors.preferredVehicle = 'Please select a preferred vehicle.';
//         if (!formData.dealership) newErrors.dealership = 'Please select a dealership.';
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validateForm()) {
//             const newTestDrive = { ...formData, date: new Date().toISOString() };
//             const saved = JSON.parse(localStorage.getItem('testDrives') || '[]');
//             saved.push(newTestDrive);
//             localStorage.setItem('testDrives', JSON.stringify(saved));
//             setTimeout(() => {
//                 setShowSuccess(true);
//                 setShowError(false);
//                 setFormData({
//                     fullName: '',
//                     phoneNumber: '',
//                     idNumber: '',
//                     address: '',
//                     preferredVehicle: '',
//                     dealership: ''
//                 });
//             }, 1000);
//         } else {
//             setShowError(true);
//             setShowSuccess(false);
//         }
//     };

//     const handleCancel = () => {
//         setFormData({
//             fullName: '',
//             phoneNumber: '',
//             idNumber: '',
//             address: '',
//             preferredVehicle: '',
//             dealership: ''
//         });
//         setErrors({});
//         setShowSuccess(false);
//         setShowError(false);
//     };

//     return (
//         <div className="test-drive-form-wrapper">
//             <Form onSubmit={handleSubmit} className="eco-form">
//                 {showSuccess && (
//                     <Alert variant="success" className="eco-alert">
//                         Test drive registration successful! We will contact you within 24 hours. Check your history in the Test Drives tab.
//                     </Alert>
//                 )}
//                 {showError && (
//                     <Alert variant="danger" className="eco-alert">
//                         Please check your form information.
//                     </Alert>
//                 )}
//                 <Row className="g-3">
//                     <Col md={6}>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="eco-label">Full Name *</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="fullName"
//                                 value={formData.fullName}
//                                 onChange={handleChange}
//                                 className={`eco-input ${errors.fullName ? 'is-invalid' : ''}`}
//                                 placeholder="Enter full name"
//                             />
//                             {errors.fullName && <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>}
//                         </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="eco-label">Phone Number *</Form.Label>
//                             <Form.Control
//                                 type="tel"
//                                 name="phoneNumber"
//                                 value={formData.phoneNumber}
//                                 onChange={handleChange}
//                                 className={`eco-input ${errors.phoneNumber ? 'is-invalid' : ''}`}
//                                 placeholder="Enter phone number"
//                             />
//                             {errors.phoneNumber && <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>}
//                         </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="eco-label">ID Number *</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="idNumber"
//                                 value={formData.idNumber}
//                                 onChange={handleChange}
//                                 className={`eco-input ${errors.idNumber ? 'is-invalid' : ''}`}
//                                 placeholder="Enter ID number"
//                             />
//                             {errors.idNumber && <Form.Control.Feedback type="invalid">{errors.idNumber}</Form.Control.Feedback>}
//                         </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="eco-label">Preferred Vehicle *</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="preferredVehicle"
//                                 value={formData.preferredVehicle}
//                                 onChange={handleChange}
//                                 className={`eco-input ${errors.preferredVehicle ? 'is-invalid' : ''}`}
//                                 placeholder="Enter preferred vehicle"
//                                 readOnly
//                             />
//                             {errors.preferredVehicle && <Form.Control.Feedback type="invalid">{errors.preferredVehicle}</Form.Control.Feedback>}
//                         </Form.Group>
//                     </Col>
//                     <Col md={12}>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="eco-label">Residential Address *</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 name="address"
//                                 value={formData.address}
//                                 onChange={handleChange}
//                                 className={`eco-input ${errors.address ? 'is-invalid' : ''}`}
//                                 placeholder="Enter detailed residential address"
//                             />
//                             {errors.address && <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>}
//                         </Form.Group>
//                     </Col>
//                     <Col md={12}>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="eco-label">Nearest Dealership *</Form.Label>
//                             <Form.Select
//                                 name="dealership"
//                                 value={formData.dealership}
//                                 onChange={handleChange}
//                                 className={`eco-select ${errors.dealership ? 'is-invalid' : ''}`}
//                             >
//                                 <option value="">Select dealership</option>
//                                 {dealerships.map((dealership) => (
//                                     <option key={dealership.value} value={dealership.label}>{dealership.label}</option>
//                                 ))}
//                             </Form.Select>
//                             {errors.dealership && <div className="invalid-feedback">{errors.dealership}</div>}
//                         </Form.Group>
//                     </Col>
//                 </Row>
//                 <div className="form-actions eco-buttons">
//                     <Button variant="outline-secondary" size="lg" className="me-3" onClick={handleCancel}>
//                         Cancel
//                     </Button>
//                     <Button variant="eco-primary" size="lg" type="submit">
//                         Submit Registration
//                     </Button>
//                 </div>
//             </Form>
//         </div>
//     );
// };

// export default TestDriveForm;

// src/pages/user/TestDriveRegisterPage/TestDriveForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../../styles/TestDriveForm.scss';
import TestDriveService from '../../../services/TestDriveService/TestDriveService';
import ManageHomePageService from '../../../services/ManageHomePageService/ManageHomePageService';

const TestDriveForm = () => {
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
                console.error('Error fetching vehicles:', error);
            }
        };
        fetchVehicles();
    }, [mergeVehicleOptions]);

    // Load vehicle title from URL
    useEffect(() => {
        const vehicleTitle = searchParams.get('vehicle');
        if (vehicleTitle && !formData.preferredVehicle) {
            const decoded = decodeURIComponent(vehicleTitle);
            setFormData(prev => ({ ...prev, preferredVehicle: decoded }));
            mergeVehicleOptions([decoded]);
        }
    }, [searchParams, formData.preferredVehicle, mergeVehicleOptions]);

    useEffect(() => {
        const historyTestDrives = JSON.parse(localStorage.getItem('testDrives') || '[]');
        const collected = historyTestDrives
            .map(item => item.preferredVehicle)
            .filter(Boolean);
        mergeVehicleOptions(collected);
    }, [mergeVehicleOptions]);

    // Load stores
    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true);
            try {
                const data = await TestDriveService.getAllStores();
                setStores(data);
            } catch {
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
            return;
        }

        setSubmitting(true);
        setShowSuccess(false);
        setShowError(false);

        try {
            const customerPayload = {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                licenseUp: null,
                licenseDown: null,
                storeId: parseInt(formData.storeId)
            };

            await TestDriveService.createCustomer(customerPayload);

            // Save to localStorage for history
            const historyItem = {
                ...formData,
                storeName: stores.find(s => s.storeId === parseInt(formData.storeId))?.storeName || '',
                date: new Date().toISOString()
            };
            const saved = JSON.parse(localStorage.getItem('testDrives') || '[]');
            saved.push(historyItem);
            localStorage.setItem('testDrives', JSON.stringify(saved));
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
            setErrorMessage(error.response?.data?.message || 'Registration failed. Please try again.');
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
                        Test drive registered successfully! We will contact you within 24 hours.
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
                            {errors.preferredVehicle && <div className="invalid-feedback d-block">{errors.preferredVehicle}</div>}
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
                            'Register Test Drive'
                        )}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default TestDriveForm;