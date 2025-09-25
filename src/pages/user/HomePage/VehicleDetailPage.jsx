// src/pages/user/VehicleDetailPage/VehicleDetailPage.jsx (updated with image carousel and highlights)
import React from 'react';
import { Container, Row, Col, Button, Card, ListGroup, Carousel } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../styles/HomePage.scss';
import '../../../styles/VehicleDetailPage.scss';
import Sidebar from '../../../components/sidebar/Sidebar';

const VehicleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Vehicles data with multiple images
    const vehicles = [
        {
            id: 1,
            slug: 'tesla-model-s',
            images: [
                'https://vinfastauto.us/themes/custom/vinfast_v2/images/v3/vf-9/exterior-color-red.webp',
                'https://www.tesla.com/sites/default/files/images/model-s/model-s-hero@2x.jpg',
                'https://www.tesla.com/sites/default/files/images/model-s/model-s-interior@2x.jpg'
            ],
            title: 'Tesla Model S',
            description: 'The Tesla Model S is a premium electric sedan offering unparalleled performance and range.',
            specs: {
                range: '405 miles',
                acceleration: '3.1s',
                category: 'Luxury Sedan'
            },
            additionalSpecs: {
                battery: '100 kWh',
                topSpeed: '200 mph',
                seating: '5 seats'
            },
            price: '$89,900',
            stock: '5 Available',
            stockType: 'available'
        },
        {
            id: 2,
            slug: 'bmw-ix',
            images: [
                'https://s1.cdn.autoevolution.com/images/gallery/vinfast-vf-9-2022-7300_1.jpg',
                'https://www.bmw.com/content/dam/bmw/market/MiddleEast/bmw-me/2023/ix/model-overview/bmw-ix-model-overview-desktop.jpg.asset.1674489562907.jpg',
                'https://www.bmw.com/content/dam/bmw/market/MiddleEast/bmw-me/2023/ix/interior/bmw-ix-interior-desktop.jpg.asset.1674489562907.jpg'
            ],
            title: 'BMW iX',
            description: 'The BMW iX combines luxury with sustainable electric power in an SUV form.',
            specs: {
                range: '324 miles',
                acceleration: '4.6s',
                category: 'Luxury SUV'
            },
            additionalSpecs: {
                battery: '111 kWh',
                topSpeed: '124 mph',
                seating: '5 seats'
            },
            price: '$83,200',
            stock: '3 Available',
            stockType: 'available'
        },
        {
            id: 3,
            slug: 'audi-e-tron-gt',
            images: [
                'https://tse3.mm.bing.net/th/id/OIP.8tjx039IiQN9y342QEvYHAHaE8?w=1200&h=800&rs=1&pid=ImgDetMain&o=7&rm=3',
                'https://www.audi.com/content/dam/audiusa2/models/e-tron-gt/e-tron-gt-2024/hero-desktop.jpg',
                'https://www.audi.com/content/dam/audiusa2/models/e-tron-gt/e-tron-gt-2024/interior-desktop.jpg'
            ],
            title: 'Audi e-tron GT',
            description: 'The Audi e-tron GT delivers thrilling performance in a sleek electric sports car design.',
            specs: {
                range: '238 miles',
                acceleration: '3.9s',
                category: 'Sports Car'
            },
            additionalSpecs: {
                battery: '93 kWh',
                topSpeed: '155 mph',
                seating: '4 seats'
            },
            price: '$102,400',
            stock: '1 Available',
            stockType: 'limited'
        }
    ];

    const vehicle = vehicles.find(v => v.id === parseInt(id));

    if (!vehicle) {
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
        navigate(`/test-drive-register?vehicle=${encodeURIComponent(vehicle.title)}`);
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
                                <h1 className="eco-title">{vehicle.title}</h1>
                                <p className="eco-subtitle">{vehicle.description}</p>
                            </div>
                            <Row className="g-4">
                                <Col md={6}>
                                    <Card className="eco-detail-card">
                                        <Carousel>
                                            {vehicle.images.map((img, index) => (
                                                <Carousel.Item key={index}>
                                                    <img
                                                        className="d-block w-100 eco-detail-img"
                                                        src={img}
                                                        alt={`${vehicle.title} image ${index + 1}`}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="eco-detail-card">
                                        <Card.Body>
                                            <Card.Title className="eco-card-title">{vehicle.title}</Card.Title>
                                            <div className="highlight-price eco-price mb-3">
                                                {vehicle.price} <span className="highlight-badge">Best Value</span>
                                            </div>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Range:</strong> <span className="highlight-value">{vehicle.specs.range}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Acceleration (0-60 mph):</strong> <span className="highlight-value">{vehicle.specs.acceleration}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Category:</strong> <span className="highlight-value">{vehicle.specs.category}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Battery:</strong> <span className="highlight-value">{vehicle.additionalSpecs.battery}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Top Speed:</strong> <span className="highlight-value">{vehicle.additionalSpecs.topSpeed}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Seating:</strong> <span className="highlight-value">{vehicle.additionalSpecs.seating}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="highlight-spec">
                                                    <strong>Stock:</strong> <span className={`stock-badge ${vehicle.stockType}`}>{vehicle.stock}</span>
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