// src/pages/user/VehicleDetailPage/VehicleDetailPage.jsx (updated: title fix and add ActionButtons in overview)
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, ListGroup, Carousel, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../styles/HomePage.scss';
import '../../../styles/VehicleDetailPage.scss';
import ActionButtons from '../../HomePage/ActionButtons'; // Add import
import ManageHomePageService from '../../../services/ManageHomePageService/ManageHomePageService'; // Service cho detail

const VehicleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicleData, setVehicleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

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

                const brandName = brand.brandName || 'Unknown';
                const title = vehicle.modelName.startsWith(brandName) ? vehicle.modelName : `${brandName} ${vehicle.modelName}`;

                // Enhanced data with interior and exterior specs (sample data; replace with API if available)
                const fullVehicle = {
                    id: vehicle.vehicleId,
                    slug: `${brandName?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}-${vehicle.modelName.toLowerCase().replace(/\s+/g, '-')}`,
                    images: {
                        overview: [
                            'https://vinfastauto.us/themes/custom/vinfast_v2/images/v3/vf-9/exterior-color-red.webp',
                            'https://www.tesla.com/sites/default/files/images/model-s/model-s-hero@2x.jpg',
                            'https://www.tesla.com/sites/default/files/images/model-s/model-s-interior@2x.jpg'
                        ],
                        interior: [
                            'https://www.tesla.com/sites/default/files/images/model-s/model-s-interior@2x.jpg',
                            'https://www.tesla.com/sites/default/files/images/model-3/model-3-interior@2x.jpg',
                            'https://www.tesla.com/sites/default/files/images/model-y/model-y-interior@2x.jpg'
                        ],
                        exterior: [
                            'https://vinfastauto.us/themes/custom/vinfast_v2/images/v3/vf-9/exterior-color-red.webp',
                            'https://www.tesla.com/sites/default/files/images/model-s/model-s-hero@2x.jpg',
                            'https://www.tesla.com/sites/default/files/images/cybertruck/cybertruck-hero@2x.jpg'
                        ]
                    },
                    title,
                    description: `The ${vehicle.modelName} ${vehicle.version} offers premium electric performance with a ${vehicle.color} finish.`,
                    specs: {
                        range: `${vehicle.rangePerCharge}`,
                        acceleration: '0-60 mph in 3.1s',
                        category: `Brand: ${brandName}`
                    },
                    additionalSpecs: {
                        battery: vehicle.batteryCapacity,
                        topSpeed: '155 mph',
                        seating: '5 Seats'
                    },
                    interiorSpecs: {
                        material: 'Premium Leather',
                        infotainment: '15" Touchscreen',
                        climate: 'Dual-Zone Auto',
                        audio: '12-Speaker Premium Sound',
                        storage: '15 cu ft Cargo'
                    },
                    exteriorSpecs: {
                        dimensions: '196.8" L x 76.8" W x 56.3" H',
                        wheels: '19" Alloy Wheels',
                        lights: 'LED Matrix Headlights',
                        roof: 'Panoramic Glass Roof',
                        doors: '4 Doors'
                    },
                    price: `$${vehicle.price.toLocaleString()}`,
                    stock: stockText,
                    stockType,
                    fullData: {
                        ...vehicle,
                        brand: {
                            name: brandName,
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
                    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
                        <div className="main-content">
                            <h1 className="eco-title">Loading...</h1>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    if (!vehicleData) {
        return (
            <div className="min-h-screen eco-bg">
                <Container fluid className="eco-container">
                    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
                        <div className="main-content">
                            <h1 className="eco-title">Vehicle Not Found</h1>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    const handleTestDriveClick = () => {
        navigate(`/test-drive-register?vehicle=${encodeURIComponent(vehicleData.title)}`);
    };

    const renderSpecsList = (specs, isOverview = false) => (
        <ListGroup variant="flush">
            {Object.entries(specs).map(([key, value]) => (
                <ListGroup.Item key={key} className="highlight-spec">
                    <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong>{' '}
                    <span className="highlight-value">{value}</span>
                </ListGroup.Item>
            ))}
            {isOverview && (
                <>
                    <ListGroup.Item className="highlight-spec">
                        <strong>Stock:</strong> <span className={`stock-badge ${vehicleData.stockType}`}>{vehicleData.stock}</span>
                    </ListGroup.Item>
                    <hr />
                    <h6 className="eco-section-title">Brand Information</h6>
                    <ListGroup.Item className="highlight-spec">
                        <strong>Country:</strong> <span className="highlight-value">{vehicleData.fullData.brand.country}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="highlight-spec">
                        <strong>Website:</strong> <span className="highlight-value"><a href={vehicleData.fullData.brand.website} target="_blank" rel="noopener noreferrer">{vehicleData.fullData.brand.website}</a></span>
                    </ListGroup.Item>
                    <ListGroup.Item className="highlight-spec">
                        <strong>Founded:</strong> <span className="highlight-value">{vehicleData.fullData.brand.founderYear}</span>
                    </ListGroup.Item>
                </>
            )}
        </ListGroup>
    );

    const renderTabContent = (tabKey) => {
        const images = vehicleData.images[tabKey];
        const specs = tabKey === 'overview'
            ? { ...vehicleData.specs, ...vehicleData.additionalSpecs, version: vehicleData.fullData.version, year: vehicleData.fullData.year, color: vehicleData.fullData.color, warranty: vehicleData.fullData.warrantyPeriod }
            : tabKey === 'interior' ? vehicleData.interiorSpecs : vehicleData.exteriorSpecs;

        return (
            <Card.Body>
                <div className="highlight-price eco-price mb-3">
                    {vehicleData.price} <span className="highlight-badge">{tabKey === 'overview' ? 'Best Value' : tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}</span>
                </div>
                <Row className="g-3 mb-3">
                    <Col md={8}>
                        {renderSpecsList(specs, tabKey === 'overview')}
                    </Col>
                    <Col md={4}>
                        <Card className="eco-sub-card">
                            <Carousel className="sub-carousel">
                                {images.map((img, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block w-100 eco-sub-img"
                                            src={img}
                                            alt={`${vehicleData.title} ${tabKey} image ${index + 1}`}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </Card>
                    </Col>
                </Row>
                {tabKey === 'overview' && (
                    <div className="detail-actions eco-buttons mt-3">
                        <Button variant="eco-primary" size="lg" onClick={handleTestDriveClick} className="me-2">
                            Schedule Test Drive
                        </Button>
                        <Button variant="outline-eco" size="lg">
                            Get Quote
                        </Button>
                        <ActionButtons
                            vehicle={vehicleData}
                            vehicleId={vehicleData.id}
                            selectedVehicles={[]}
                            selectedCount={0}
                            onToggleCompare={() => { }} // Placeholder, as compare not implemented in detail
                        />
                    </div>
                )}
            </Card.Body>
        );
    };

    return (
        <div className="min-h-screen eco-bg">
            <Container fluid className="eco-container">
                <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
                    <div className="main-content">
                        <div className="page-header">
                            <h1 className="eco-title">{vehicleData.title}</h1>
                            <p className="eco-subtitle">{vehicleData.description}</p>
                        </div>
                        <Row className="g-4">
                            <Col md={6}>
                                <Card className="eco-detail-card">
                                    <Carousel>
                                        {vehicleData.images.overview.map((img, index) => (
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
                                <Card className="eco-detail-card h-100">
                                    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3 eco-tabs">
                                        <Tab eventKey="overview" title="Overview">
                                            {renderTabContent('overview')}
                                        </Tab>
                                        <Tab eventKey="interior" title="Interior">
                                            {renderTabContent('interior')}
                                        </Tab>
                                        <Tab eventKey="exterior" title="Exterior">
                                            {renderTabContent('exterior')}
                                        </Tab>
                                    </Tabs>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default VehicleDetailPage;