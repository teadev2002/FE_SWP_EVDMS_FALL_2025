// src/pages/user/VehicleDetailPage/VehicleDetailPage.jsx (updated with API fetch)
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, ListGroup, Carousel } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../styles/HomePage.scss';
import '../../../styles/VehicleDetailPage.scss';
import Sidebar from '../../../components/sidebar/Sidebar';
import ManageHomePageService from '../../../services/ManageHomePageService/ManageHomePageService'; // Service cho detail

const VehicleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicleData, setVehicleData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicleData = async () => {
            setLoading(true);
            try {
                const [vehiclesData, brandsData, storagesData] = await Promise.all([
                    ManageHomePageService.getAllVehicles(),
                    ManageHomePageService.getAllBrands(),
                    ManageHomePageService.getAllStorages()
                ]);

                const vehicle = vehiclesData.find(v => v.vehicleId === parseInt(id));
                if (!vehicle) {
                    return; // Will show not found
                }

                const brand = brandsData.find(b => b.brandId === vehicle.brandId) || {};
                const storage = storagesData.find(s => s.vehicleId === parseInt(id)) || { quantityAvailable: 0 };

                const quantity = storage.quantityAvailable || 0;
                let stockType = 'out-of-stock';
                let stockText = `${quantity} Available`;
                if (quantity > 1) {
                    stockType = 'available';
                } else if (quantity === 1) {
                    stockType = 'limited';
                }

                const fullVehicle = {
                    id: vehicle.vehicleId,
                    slug: `${brand.brandName?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}-${vehicle.modelName.toLowerCase().replace(/\s+/g, '-')}`,
                    images: [
                        'https://vinfastauto.us/themes/custom/vinfast_v2/images/v3/vf-9/exterior-color-red.webp',
                        'https://www.tesla.com/sites/default/files/images/model-s/model-s-hero@2x.jpg',
                        'https://www.tesla.com/sites/default/files/images/model-s/model-s-interior@2x.jpg'
                    ],
                    title: `${brand.brandName || 'Unknown'} ${vehicle.modelName}`,
                    description: `The ${vehicle.modelName} ${vehicle.version} offers premium electric performance with a ${vehicle.color} finish.`,
                    specs: {
                        range: `${vehicle.rangePerCharge}`,
                        acceleration: 'N/A',
                        category: `Brand: ${brand.brandName || 'Unknown'}`
                    },
                    additionalSpecs: {
                        battery: vehicle.batteryCapacity,
                        topSpeed: 'N/A',
                        seating: 'N/A'
                    },
                    price: `$${vehicle.price.toLocaleString()}`,
                    stock: stockText,
                    stockType,
                    fullData: {
                        ...vehicle,
                        brand: {
                            name: brand.brandName,
                            country: brand.country,
                            website: brand.website,
                            founderYear: brand.founderYear
                        },
                        quantityAvailable: quantity
                    }
                };

                setVehicleData(fullVehicle);
            } catch (error) {
                console.error('Failed to fetch vehicle data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen eco-bg">
                <Container fluid className="eco-container">
                    <Row className="g-0">
                        <Col md={2} className="p-0">
                            <Sidebar activeItem="Products" />
                        </Col>
                        <Col md={10} className="p-4">
                            <div className="main-content">
                                <h1 className="eco-title">Loading...</h1>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    if (!vehicleData) {
        return (
            <div className="min-h-screen eco-bg">
                <Container fluid className="eco-container">
                    <Row className="g-0">
                        <Col md={2} className="p-0">
                            <Sidebar activeItem="Products" />
                        </Col>
                        <Col md={10} className="p-4">
                            <div className="main-content">
                                <h1 className="eco-title">Vehicle Not Found</h1>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    const handleTestDriveClick = () => {
        navigate(`/test-drive-register?vehicle=${encodeURIComponent(vehicleData.title)}`);
    };

    return (
        <div className="min-h-screen eco-bg">
            <Container fluid className="eco-container">
                <Row className="g-0">
                    <Col md={2} className="p-0">
                        <Sidebar activeItem="Products" />
                    </Col>
                    <Col md={10} className="p-4">
                        <div className="main-content">
                            <div className="page-header">
                                <h1 className="eco-title">{vehicleData.title}</h1>
                                <p className="eco-subtitle">{vehicleData.description}</p>
                            </div>
                            <Row className="g-4">
                                <Col md={6}>
                                    <Card className="eco-detail-card">
                                        <Carousel>
                                            {vehicleData.images.map((img, index) => (
                                                <Carousel.Item key={index}>
                                                    <img
                                                        className="d-block w-100 eco-detail-img"
                                                        src={img}
                                                        alt={`${vehicleData.title} image ${index + 1}`}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="eco-detail-card">
                                        <Card.Body>
                                            <Card.Title className="eco-card-title">{vehicleData.title}</Card.Title>
                                            <div className="highlight-price eco-price mb-3">
                                                {vehicleData.price} <span className="highlight-badge">Best Value</span>
                                            </div>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Brand:</strong> <span className="highlight-value">{vehicleData.fullData.brand.name}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Version:</strong> <span className="highlight-value">{vehicleData.fullData.version}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Year of Manufacture:</strong> <span className="highlight-value">{vehicleData.fullData.year}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Color:</strong> <span className="highlight-value">{vehicleData.fullData.color}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Battery:</strong> <span className="highlight-value">{vehicleData.additionalSpecs.battery}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Range Per Charge:</strong> <span className="highlight-value">{vehicleData.specs.range}</span>
                                                </ListGroup.Item>                                         
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Top Speed:</strong> <span className="highlight-value">{vehicleData.additionalSpecs.topSpeed}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Seating:</strong> <span className="highlight-value">{vehicleData.additionalSpecs.seating}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Warranty Period:</strong> <span className="highlight-value">{vehicleData.fullData.warrantyPeriod}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Stock:</strong> <span className={`stock-badge ${vehicleData.stockType}`}>{vehicleData.stock}</span>
                                                </ListGroup.Item>
                                            </ListGroup>
                                            <hr />
                                            <h6>Brand Information</h6>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Country:</strong> <span className="highlight-value">{vehicleData.fullData.brand.country}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Website:</strong> <span className="highlight-value"><a href={vehicleData.fullData.brand.website} target="_blank" rel="noopener noreferrer">{vehicleData.fullData.brand.website}</a></span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Founded:</strong> <span className="highlight-value">{vehicleData.fullData.brand.founderYear}</span>
                                                </ListGroup.Item>
                                            </ListGroup>
                                            <div className="detail-actions eco-buttons mt-3">
                                                <Button variant="eco-primary" size="lg" onClick={handleTestDriveClick} className="me-2">
                                                    Schedule Test Drive
                                                </Button>
                                                <Button variant="outline-eco" size="lg">
                                                    Get Quote
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default VehicleDetailPage;