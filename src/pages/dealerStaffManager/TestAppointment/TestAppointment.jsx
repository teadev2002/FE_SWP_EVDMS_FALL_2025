// // src/pages/dealerStaffManager/TestAppointment/TestAppointment.jsx
// import React, { useState, useEffect } from 'react';
// import {
//     Container, Row, Col, Card, Table, Badge, Button, Modal, Form,
//     Dropdown, DropdownButton, InputGroup, FormControl, Pagination
// } from 'react-bootstrap';
// import '../../../styles/dealerStaffManager/TestAppointment.scss';

// const TestAppointment = () => {
//     const [appointments, setAppointments] = useState([]);
//     const [filteredAppointments, setFilteredAppointments] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('All');
//     const [dateRange, setDateRange] = useState({ start: '', end: '' });
//     const [currentPage, setCurrentPage] = useState(1);
//     const [showDetailModal, setShowDetailModal] = useState(false);
//     const [selectedAppointment, setSelectedAppointment] = useState(null);
//     const [showConfirmModal, setShowConfirmModal] = useState(false);
//     const [confirmAction, setConfirmAction] = useState('');

//     const itemsPerPage = 10;
//     const statuses = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'];

//     // Mock data - Thay thế bằng API call sau
//     useEffect(() => {
//         const mockData = [
//             {
//                 id: 1,
//                 customerName: 'Nguyễn Văn A',
//                 phone: '0123456789',
//                 email: 'nguyenvana@email.com',
//                 vehicleModel: 'Tesla Model 3',
//                 vehicleVersion: 'Long Range',
//                 vehicleColor: 'Pearl White',
//                 appointmentDate: '2024-12-15T10:00:00',
//                 location: 'Showroom Hà Nội',
//                 duration: 30,
//                 status: 'Confirmed',
//                 notes: 'Customer interested in performance version',
//                 createdAt: '2024-12-10T08:30:00'
//             },
//             {
//                 id: 2,
//                 customerName: 'Trần Thị B',
//                 phone: '0987654321',
//                 email: 'tranthib@email.com',
//                 vehicleModel: 'BYD Atto 3',
//                 vehicleVersion: 'Standard',
//                 vehicleColor: 'Blue',
//                 appointmentDate: '2024-12-16T14:30:00',
//                 location: 'Showroom TP.HCM',
//                 duration: 45,
//                 status: 'Pending',
//                 notes: '',
//                 createdAt: '2024-12-12T11:15:00'
//             },
//             {
//                 id: 3,
//                 customerName: 'Lê Văn C',
//                 phone: '0912345678',
//                 email: 'levanc@email.com',
//                 vehicleModel: 'VinFast VF 8',
//                 vehicleVersion: 'Eco',
//                 vehicleColor: 'Red',
//                 appointmentDate: '2024-12-17T09:00:00',
//                 location: 'Showroom Đà Nẵng',
//                 duration: 30,
//                 status: 'Completed',
//                 notes: 'Customer very satisfied',
//                 createdAt: '2024-12-13T14:20:00'
//             },
//             {
//                 id: 4,
//                 customerName: 'Phạm Thị D',
//                 phone: '0934567890',
//                 email: 'phamthid@email.com',
//                 vehicleModel: 'MG ZS EV',
//                 vehicleVersion: 'Luxury',
//                 vehicleColor: 'Black',
//                 appointmentDate: '2024-12-18T16:00:00',
//                 location: 'Showroom Hà Nội',
//                 duration: 30,
//                 status: 'Cancelled',
//                 notes: 'Customer changed schedule',
//                 createdAt: '2024-12-14T09:45:00'
//             }
//         ];

//         setAppointments(mockData);
//         setFilteredAppointments(mockData);
//         setLoading(false);
//     }, []);

//     // Filter appointments
//     useEffect(() => {
//         let filtered = [...appointments];

//         // Search filter
//         if (searchTerm) {
//             filtered = filtered.filter(appointment =>
//                 appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 appointment.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 appointment.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }

//         // Status filter
//         if (statusFilter !== 'All') {
//             filtered = filtered.filter(appointment => appointment.status === statusFilter);
//         }

//         // Date range filter
//         if (dateRange.start && dateRange.end) {
//             filtered = filtered.filter(appointment => {
//                 const appointmentDate = new Date(appointment.appointmentDate);
//                 const startDate = new Date(dateRange.start);
//                 const endDate = new Date(dateRange.end);
//                 return appointmentDate >= startDate && appointmentDate <= endDate;
//             });
//         }

//         setFilteredAppointments(filtered);
//         setCurrentPage(1);
//     }, [searchTerm, statusFilter, dateRange, appointments]);

//     const handleStatusUpdate = async (appointmentId, newStatus) => {
//         // Mock update - Thay bằng API call
//         setAppointments(prev => prev.map(appointment =>
//             appointment.id === appointmentId
//                 ? { ...appointment, status: newStatus }
//                 : appointment
//         ));

//         setFilteredAppointments(prev => prev.map(appointment =>
//             appointment.id === appointmentId
//                 ? { ...appointment, status: newStatus }
//                 : appointment
//         ));
//     };

//     const handleActionConfirm = async () => {
//         if (confirmAction === 'delete') {
//             // Mock delete - Thay bằng API call
//             setAppointments(prev => prev.filter(a => a.id !== selectedAppointment.id));
//             setFilteredAppointments(prev => prev.filter(a => a.id !== selectedAppointment.id));
//         }
//         setShowConfirmModal(false);
//         setConfirmAction('');
//     };

//     const paginatedAppointments = filteredAppointments.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

//     const getStatusBadge = (status) => {
//         const badgeConfig = {
//             Pending: 'warning',
//             Confirmed: 'info',
//             Completed: 'success',
//             Cancelled: 'danger',
//             'No Show': 'secondary'
//         };
//         const variant = badgeConfig[status] || 'secondary';
//         return (
//             <Badge bg={variant} className="status-badge">
//                 {status}
//             </Badge>
//         );
//     };

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('vi-VN', {
//             year: 'numeric',
//             month: '2-digit',
//             day: '2-digit',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     return (
//         <div className="admin-page">
//             <Container fluid className="py-4">
//                 <Row className="align-items-center mb-4">
//                     <Col md={6}>
//                         <div className="page-header">
//                             <h1 className="page-title">
//                                 Test Drive Appointments
//                             </h1>
//                             <p className="page-subtitle">Manage customer test drive requests</p>
//                         </div>
//                     </Col>
//                     <Col md={6} className="text-end">
//                         <Button
//                             variant="outline-primary"
//                             className="me-2"
//                             onClick={() => window.location.reload()}
//                         >
//                             Refresh
//                         </Button>
//                         <Button variant="primary">
//                             Export
//                         </Button>
//                     </Col>
//                 </Row>

//                 {/* Filters & Search */}
//                 <Card className="filter-card mb-4">
//                     <Card.Body>
//                         <Row className="g-3 align-items-end">
//                             <Col md={3}>
//                                 <InputGroup>
//                                     <InputGroup.Text>
//                                         🔍
//                                     </InputGroup.Text>
//                                     <FormControl
//                                         placeholder="Search by name, email, phone..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                     />
//                                 </InputGroup>
//                             </Col>
//                             <Col md={2}>
//                                 <Form.Group>
//                                     <Form.Label>Status</Form.Label>
//                                     <DropdownButton
//                                         title={statusFilter}
//                                         variant="outline-secondary"
//                                         align="end"
//                                         className="w-100"
//                                     >
//                                         {statuses.map(status => (
//                                             <Dropdown.Item
//                                                 key={status}
//                                                 onClick={() => setStatusFilter(status)}
//                                                 active={statusFilter === status}
//                                             >
//                                                 {status}
//                                             </Dropdown.Item>
//                                         ))}
//                                     </DropdownButton>
//                                 </Form.Group>
//                             </Col>
//                             <Col md={4}>
//                                 <Form.Group>
//                                     <Form.Label>Date Range</Form.Label>
//                                     <div className="d-flex gap-2">
//                                         <Form.Control
//                                             type="date"
//                                             value={dateRange.start}
//                                             onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
//                                         />
//                                         <span className="align-self-end">-</span>
//                                         <Form.Control
//                                             type="date"
//                                             value={dateRange.end}
//                                             onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
//                                         />
//                                     </div>
//                                 </Form.Group>
//                             </Col>
//                             <Col md={3}>
//                                 <Button variant="primary" className="w-100" onClick={() => { }}>
//                                     Apply Filters
//                                 </Button>
//                             </Col>
//                         </Row>
//                     </Card.Body>
//                 </Card>

//                 {/* Stats Cards */}
//                 <Row className="mb-4">
//                     <Col md={2}>
//                         <Card className="stat-card total">
//                             <Card.Body>
//                                 <div className="stat-number">{filteredAppointments.length}</div>
//                                 <div className="stat-label">Total Requests</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={2}>
//                         <Card className="stat-card pending">
//                             <Card.Body>
//                                 <div className="stat-number">
//                                     {filteredAppointments.filter(a => a.status === 'Pending').length}
//                                 </div>
//                                 <div className="stat-label">Pending</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={2}>
//                         <Card className="stat-card confirmed">
//                             <Card.Body>
//                                 <div className="stat-number">
//                                     {filteredAppointments.filter(a => a.status === 'Confirmed').length}
//                                 </div>
//                                 <div className="stat-label">Confirmed</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={2}>
//                         <Card className="stat-card completed">
//                             <Card.Body>
//                                 <div className="stat-number">
//                                     {filteredAppointments.filter(a => a.status === 'Completed').length}
//                                 </div>
//                                 <div className="stat-label">Completed</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={2}>
//                         <Card className="stat-card cancelled">
//                             <Card.Body>
//                                 <div className="stat-number">
//                                     {filteredAppointments.filter(a => a.status === 'Cancelled').length}
//                                 </div>
//                                 <div className="stat-label">Cancelled</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                     <Col md={2}>
//                         <Card className="stat-card noshow">
//                             <Card.Body>
//                                 <div className="stat-number">
//                                     {filteredAppointments.filter(a => a.status === 'No Show').length}
//                                 </div>
//                                 <div className="stat-label">No Show</div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>

//                 {/* Main Table */}
//                 <Card className="main-card">
//                     <Card.Header className="d-flex justify-content-between align-items-center">
//                         <h5 className="mb-0">Appointment List</h5>
//                         <div>
//                             Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
//                             {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of{' '}
//                             {filteredAppointments.length} appointments
//                         </div>
//                     </Card.Header>
//                     <Card.Body className="p-0">
//                         {loading ? (
//                             <div className="text-center py-5">
//                                 <div className="spinner-border text-primary" role="status">
//                                     <span className="visually-hidden">Loading...</span>
//                                 </div>
//                             </div>
//                         ) : filteredAppointments.length === 0 ? (
//                             <div className="text-center py-5">
//                                 <h5>No appointments found</h5>
//                                 <p className="text-muted">Try adjusting your search or filter criteria</p>
//                             </div>
//                         ) : (
//                             <div className="table-responsive">
//                                 <Table hover className="appointment-table mb-0">
//                                     <thead>
//                                         <tr>
//                                             <th>#</th>
//                                             <th>Customer</th>
//                                             <th>Vehicle</th>
//                                             <th>Date & Time</th>
//                                             <th>Location</th>
//                                             <th>Status</th>
//                                             <th>Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {paginatedAppointments.map((appointment, index) => (
//                                             <tr key={appointment.id} className="appointment-row">
//                                                 <td>
//                                                     <strong>{(currentPage - 1) * itemsPerPage + index + 1}</strong>
//                                                 </td>
//                                                 <td>
//                                                     <div className="customer-info">
//                                                         <div className="customer-name">{appointment.customerName}</div>
//                                                         <small className="customer-contact">
//                                                             {appointment.phone}
//                                                         </small>
//                                                         <small className="customer-email">
//                                                             {appointment.email}
//                                                         </small>
//                                                     </div>
//                                                 </td>
//                                                 <td>
//                                                     <div className="vehicle-info">
//                                                         <div className="vehicle-model">{appointment.vehicleModel}</div>
//                                                         <small className="vehicle-version">{appointment.vehicleVersion}</small>
//                                                     </div>
//                                                 </td>
//                                                 <td>
//                                                     <div className="datetime-info">
//                                                         <div className="appointment-date">
//                                                             {formatDate(appointment.appointmentDate)}
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td>
//                                                     <div className="location-info">
//                                                         {appointment.location}
//                                                     </div>
//                                                 </td>
//                                                 <td>{getStatusBadge(appointment.status)}</td>
//                                                 <td>
//                                                     <DropdownButton
//                                                         title="Actions"
//                                                         variant="link"
//                                                         className="action-dropdown"
//                                                         align="end"
//                                                     >
//                                                         <Dropdown.Item onClick={() => {
//                                                             setSelectedAppointment(appointment);
//                                                             setShowDetailModal(true);
//                                                         }}>
//                                                             View Details
//                                                         </Dropdown.Item>
//                                                         <Dropdown.Item
//                                                             onClick={() => handleStatusUpdate(appointment.id, 'Confirmed')}
//                                                             disabled={appointment.status === 'Confirmed' || appointment.status === 'Completed'}
//                                                         >
//                                                             Confirm
//                                                         </Dropdown.Item>
//                                                         <Dropdown.Item
//                                                             onClick={() => handleStatusUpdate(appointment.id, 'Completed')}
//                                                             disabled={appointment.status === 'Completed'}
//                                                         >
//                                                             Mark Complete
//                                                         </Dropdown.Item>
//                                                         <Dropdown.Item
//                                                             onClick={() => handleStatusUpdate(appointment.id, 'Cancelled')}
//                                                             disabled={['Cancelled', 'Completed'].includes(appointment.status)}
//                                                             className="text-danger"
//                                                         >
//                                                             Cancel
//                                                         </Dropdown.Item>
//                                                         <Dropdown.Divider />
//                                                         <Dropdown.Item
//                                                             onClick={() => {
//                                                                 setSelectedAppointment(appointment);
//                                                                 setConfirmAction('delete');
//                                                                 setShowConfirmModal(true);
//                                                             }}
//                                                             className="text-danger"
//                                                         >
//                                                             Delete
//                                                         </Dropdown.Item>
//                                                     </DropdownButton>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </Table>
//                             </div>
//                         )}
//                     </Card.Body>
//                     <Card.Footer className="d-flex justify-content-between align-items-center">
//                         <div className="text-muted">
//                             Total: {filteredAppointments.length} appointments
//                         </div>
//                         <Pagination size="sm">
//                             <Pagination.Prev
//                                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                                 disabled={currentPage === 1}
//                             />
//                             {[...Array(totalPages)].map((_, index) => (
//                                 <Pagination.Item
//                                     key={index + 1}
//                                     active={index + 1 === currentPage}
//                                     onClick={() => setCurrentPage(index + 1)}
//                                 >
//                                     {index + 1}
//                                 </Pagination.Item>
//                             ))}
//                             <Pagination.Next
//                                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                                 disabled={currentPage === totalPages}
//                             />
//                         </Pagination>
//                     </Card.Footer>
//                 </Card>
//             </Container>

//             {/* Detail Modal */}
//             <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Appointment Details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {selectedAppointment && (
//                         <div className="appointment-details">
//                             <Row>
//                                 <Col md={6}>
//                                     <h6><strong>Customer Information</strong></h6>
//                                     <p><strong>Name:</strong> {selectedAppointment.customerName}</p>
//                                     <p><strong>Phone:</strong> {selectedAppointment.phone}</p>
//                                     <p><strong>Email:</strong> {selectedAppointment.email}</p>
//                                 </Col>
//                                 <Col md={6}>
//                                     <h6><strong>Vehicle Information</strong></h6>
//                                     <p><strong>Model:</strong> {selectedAppointment.vehicleModel}</p>
//                                     <p><strong>Version:</strong> {selectedAppointment.vehicleVersion}</p>
//                                     <p><strong>Color:</strong> {selectedAppointment.vehicleColor}</p>
//                                 </Col>
//                             </Row>
//                             <Row className="mt-3">
//                                 <Col md={6}>
//                                     <h6><strong>Appointment Details</strong></h6>
//                                     <p><strong>Date & Time:</strong> {formatDate(selectedAppointment.appointmentDate)}</p>
//                                     <p><strong>Location:</strong> {selectedAppointment.location}</p>
//                                     <p><strong>Duration:</strong> {selectedAppointment.duration} minutes</p>
//                                 </Col>
//                                 <Col md={6}>
//                                     <h6><strong>Additional Information</strong></h6>
//                                     <p><strong>Status:</strong> {getStatusBadge(selectedAppointment.status)}</p>
//                                     {selectedAppointment.notes && (
//                                         <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
//                                     )}
//                                     <p><strong>Created:</strong> {formatDate(selectedAppointment.createdAt)}</p>
//                                 </Col>
//                             </Row>
//                         </div>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             {/* Confirm Delete Modal */}
//             <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Confirm Action</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {confirmAction === 'delete' && (
//                         <>
//                             <h6>Are you sure you want to delete this appointment?</h6>
//                             <p className="text-muted">
//                                 This action cannot be undone. The appointment for{' '}
//                                 <strong>{selectedAppointment?.customerName}</strong> will be permanently removed.
//                             </p>
//                         </>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="danger"
//                         onClick={handleActionConfirm}
//                     >
//                         Confirm Delete
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default TestAppointment;

import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Card, Table, Badge, Button, Modal, Form,
    Tabs, Tab, Spinner, Alert, InputGroup, FormControl
} from 'react-bootstrap';
import '../../../styles/dealerStaffManager/TestAppointment.scss';
import ManageTestAppointment from '../../../services/ManageTestAppointment/ManageTestAppointment';

const TestAppointment = () => {
    const [activeTab, setActiveTab] = useState('requests');
    const [requests, setRequests] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState({ requests: true, appointments: true });
    const [error, setError] = useState({ requests: '', appointments: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [formData, setFormData] = useState({
        vehicleId: '',
        dealerId: '',
        appointmentDate: ''
    });
    const [vehicles, setVehicles] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (activeTab === 'requests') fetchRequests();
        if (activeTab === 'appointments') fetchAppointments();
    }, [activeTab]);

    const fetchRequests = async () => {
        setLoading(prev => ({ ...prev, requests: true }));
        setError(prev => ({ ...prev, requests: '' }));
        try {
            const data = await ManageTestAppointment.getAllRequests();
            const pending = data.filter(c => !c.testAppointments || c.testAppointments.length === 0);
            setRequests(pending);
        } catch (err) {
            setError(prev => ({ ...prev, requests: 'Failed to load requests.' }));
        } finally {
            setLoading(prev => ({ ...prev, requests: false }));
        }
    };

    const fetchAppointments = async () => {
        setLoading(prev => ({ ...prev, appointments: true }));
        setError(prev => ({ ...prev, appointments: '' }));
        try {
            const data = await ManageTestAppointment.getAllAppointments();
            const enriched = await Promise.all(
                data.map(async (apt) => {
                    let customerName = 'Unknown';
                    let vehicleName = 'Unknown';
                    let dealerName = 'Unknown';

                    try {
                        const customer = await ManageTestAppointment.getCustomerById(apt.customerId);
                        customerName = customer.fullName;
                    } catch (e) { console.warn(`Customer ${apt.customerId} not found`); }

                    try {
                        const vehicle = await ManageTestAppointment.getVehicleById(apt.vehicleId);
                        vehicleName = `${vehicle.modelName} ${vehicle.version}`;
                    } catch (e) { console.warn(`Vehicle ${apt.vehicleId} not found`); }

                    try {
                        const dealer = await ManageTestAppointment.getDealerById(apt.dealerId);
                        dealerName = dealer.fullName;
                    } catch (e) { console.warn(`Dealer ${apt.dealerId} not found`); }

                    return {
                        ...apt,
                        customerName,
                        vehicleName,
                        dealerName,
                        // Chuyển DD-MM-YYYY → DD/MM/YYYY
                        appointmentDate: apt.appointmentDate.replace(/-/g, '/')
                    };
                })
            );
            setAppointments(enriched);
        } catch (err) {
            console.error("fetchAppointments error:", err);
            setError(prev => ({ ...prev, appointments: 'Failed to load appointments.' }));
        } finally {
            setLoading(prev => ({ ...prev, appointments: false }));
        }
    };

    const handleCreateAppointment = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
        fetchVehiclesAndDealers();
    };

    const fetchVehiclesAndDealers = async () => {
        try {
            const [veh, deal] = await Promise.all([
                fetch('https://localhost:7269/api/Vehicles').then(r => r.json()),
                fetch('https://localhost:7269/api/Dealers').then(r => r.json()),
            ]);
            setVehicles(Array.isArray(veh) ? veh : []);
            setDealers(Array.isArray(deal) ? deal : []);
        } catch (err) {
            console.error("Load vehicles/dealers error:", err);
        }
    };

    const formatDateForAPI = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`; // "03/11/2025"
    };

    const handleSubmitAppointment = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await ManageTestAppointment.createAppointment({
                customerId: selectedCustomer.customerId,
                vehicleId: parseInt(formData.vehicleId),
                dealerId: parseInt(formData.dealerId),
                appointmentDate: formatDateForAPI(formData.appointmentDate),
                status: 'Draft'
            });

            // ẨN REQUEST ĐÃ TẠO LỊCH
            setRequests(prev => prev.filter(r => r.customerId !== selectedCustomer.customerId));

            setShowModal(false);
            setFormData({ vehicleId: '', dealerId: '', appointmentDate: '' });
            setSelectedCustomer(null);

            // Reload appointments nếu đang ở tab đó
            if (activeTab === 'appointments') {
                fetchAppointments();
            }
        } catch (err) {
            alert('Failed to create appointment.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredRequests = requests.filter(r =>
        r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.includes(searchTerm)
    );

    const filteredAppointments = appointments.filter(a =>
        a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-page">
            <Container fluid className="py-4">
                <Row className="align-items-center mb-4">
                    <Col md={6}>
                        <div className="page-header">
                            <h1 className="page-title">Test Drive Management</h1>
                            <p className="page-subtitle">Manage customer requests and test drive appointments</p>
                        </div>
                    </Col>
                    <Col md={6} className="text-end">
                        <Button variant="outline-primary" onClick={() => window.location.reload()}>
                            Refresh
                        </Button>
                    </Col>
                </Row>

                <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4" fill>
                    <Tab
                        eventKey="requests"
                        title={
                            <span>
                                Requests <Badge bg="warning" text="dark">{requests.length}</Badge>
                            </span>
                        }
                    >
                        <Card className="filter-card mb-3">
                            <Card.Body>
                                <InputGroup>
                                    <InputGroup.Text>Search</InputGroup.Text>
                                    <FormControl
                                        placeholder="Name, email, phone..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Card.Body>
                        </Card>

                        {loading.requests ? (
                            <div className="text-center py-5"><Spinner animation="border" /></div>
                        ) : error.requests ? (
                            <Alert variant="danger">{error.requests}</Alert>
                        ) : filteredRequests.length === 0 ? (
                            <Alert variant="info">No pending requests.</Alert>
                        ) : (
                            <Card className="main-card">
                                <Card.Body className="p-0">
                                    <Table hover responsive className="appointment-table mb-0">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                                <th>Address</th>
                                                <th>Request Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredRequests.map((req) => (
                                                <tr key={req.customerId}>
                                                    <td><strong>{req.fullName}</strong></td>
                                                    <td>{req.phone}</td>
                                                    <td>{req.email}</td>
                                                    <td>{req.address}</td>
                                                    <td>{req.createDate}</td>
                                                    <td>
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            className="d-flex align-items-center gap-1 px-3 py-2 fw-medium"
                                                            style={{
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                fontSize: '0.875rem',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                                                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                                            onClick={() => handleCreateAppointment(req)}
                                                        >
                                                            Create
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        )}
                    </Tab>

                    <Tab
                        eventKey="appointments"
                        title={
                            <span>
                                Appointments <Badge bg="success">{appointments.length}</Badge>
                            </span>
                        }
                    >
                        <Card className="filter-card mb-3">
                            <Card.Body>
                                <InputGroup>
                                    <InputGroup.Text>Search</InputGroup.Text>
                                    <FormControl
                                        placeholder="Customer, vehicle..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Card.Body>
                        </Card>

                        {loading.appointments ? (
                            <div className="text-center py-5"><Spinner animation="border" /></div>
                        ) : error.appointments ? (
                            <Alert variant="danger">{error.appointments}</Alert>
                        ) : filteredAppointments.length === 0 ? (
                            <Alert variant="info">No appointments created.</Alert>
                        ) : (
                            <Card className="main-card">
                                <Card.Body className="p-0">
                                    <Table hover responsive className="appointment-table mb-0">
                                        <thead>
                                            <tr>
                                                <th>Customer</th>
                                                <th>Vehicle</th>
                                                <th>Dealer</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAppointments.map((apt) => (
                                                <tr key={apt.testAppointmentId}>
                                                    <td><strong>{apt.customerName}</strong></td>
                                                    <td>{apt.vehicleName}</td>
                                                    <td>{apt.dealerName}</td>
                                                    <td>{apt.appointmentDate}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        )}
                    </Tab>
                </Tabs>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Test Drive Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Customer:</strong> {selectedCustomer?.fullName}</p>
                    <Form onSubmit={handleSubmitAppointment}>
                        <Form.Group className="mb-3">
                            <Form.Label>Vehicle</Form.Label>
                            <Form.Select
                                value={formData.vehicleId}
                                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                                required
                            >
                                <option value="">Select vehicle</option>
                                {vehicles.map(v => (
                                    <option key={v.vehicleId} value={v.vehicleId}>
                                        {v.modelName} {v.version}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Dealer</Form.Label>
                            <Form.Select
                                value={formData.dealerId}
                                onChange={(e) => setFormData({ ...formData, dealerId: e.target.value })}
                                required
                            >
                                <option value="">Select dealer</option>
                                {dealers.map(d => (
                                    <option key={d.dealerId} value={d.dealerId}>
                                        {d.fullName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={formData.appointmentDate}
                                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                required
                            />
                            <Form.Text className="text-muted">
                                Will send: {formData.appointmentDate ? formatDateForAPI(formData.appointmentDate) : 'None'}
                            </Form.Text>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={submitting}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={submitting}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                            >
                                {submitting ? 'Creating...' : 'Create Appointment'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TestAppointment;