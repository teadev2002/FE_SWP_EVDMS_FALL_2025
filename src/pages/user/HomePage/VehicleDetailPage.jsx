// // src/pages/user/VehicleDetailPage/VehicleDetailPage.jsx (updated: restored outline Get Quote, removed ActionButtons)
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Button, Card, ListGroup, Carousel, Tabs, Tab } from 'react-bootstrap';
// import { useParams, useNavigate } from 'react-router-dom';
// import '../../../styles/HomePage.scss';
// import '../../../styles/VehicleDetailPage.scss';
// import ManageHomePageService from '../../../services/ManageHomePageService/ManageHomePageService'; // Service cho detail

// const VehicleDetailPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [vehicleData, setVehicleData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('overview');

//     useEffect(() => {
//         const fetchVehicleData = async () => {
//             setLoading(true);
//             try {
//                 const [vehiclesData, brandsData, storagesData] = await Promise.all([
//                     ManageHomePageService.getAllVehicles(),
//                     ManageHomePageService.getAllBrands(),
//                     ManageHomePageService.getAllStorages()
//                 ]);

//                 const vehicle = vehiclesData.find(v => v.vehicleId === parseInt(id));
//                 if (!vehicle) {
//                     return; // Will show not found
//                 }

//                 const brand = brandsData.find(b => b.brandId === vehicle.brandId) || {};
//                 const storage = storagesData.find(s => s.vehicleId === parseInt(id)) || { quantityAvailable: 0 };

//                 const quantity = storage.quantityAvailable || 0;
//                 let stockType = 'out-of-stock';
//                 let stockText = `${quantity} Available`;
//                 if (quantity > 1) {
//                     stockType = 'available';
//                 } else if (quantity === 1) {
//                     stockType = 'limited';
//                 }

//                 const brandName = brand.brandName || 'Unknown';
//                 const title = vehicle.modelName.startsWith(brandName) ? vehicle.modelName : `${brandName} ${vehicle.modelName}`;

//                 // Enhanced data with interior and exterior specs (sample data; replace with API if available)
//                 const fullVehicle = {
//                     id: vehicle.vehicleId,
//                     slug: `${brandName?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}-${vehicle.modelName.toLowerCase().replace(/\s+/g, '-')}`,
//                     images: {
//                         overview: [
//                             'https://vinfastauto.us/themes/custom/vinfast_v2/images/v3/vf-9/exterior-color-red.webp',
//                             'https://www.tesla.com/sites/default/files/images/model-s/model-s-hero@2x.jpg',
//                             'https://www.tesla.com/sites/default/files/images/model-s/model-s-interior@2x.jpg'
//                         ],
//                         interior: [
//                             'https://www.tesla.com/sites/default/files/images/model-s/model-s-interior@2x.jpg',
//                             'https://www.tesla.com/sites/default/files/images/model-3/model-3-interior@2x.jpg',
//                             'https://www.tesla.com/sites/default/files/images/model-y/model-y-interior@2x.jpg'
//                         ],
//                         exterior: [
//                             'https://vinfastauto.us/themes/custom/vinfast_v2/images/v3/vf-9/exterior-color-red.webp',
//                             'https://www.tesla.com/sites/default/files/images/model-s/model-s-hero@2x.jpg',
//                             'https://www.tesla.com/sites/default/files/images/cybertruck/cybertruck-hero@2x.jpg'
//                         ]
//                     },
//                     title,
//                     description: `The ${vehicle.modelName} ${vehicle.version} offers premium electric performance with a ${vehicle.color} finish.`,
//                     specs: {
//                         range: `${vehicle.rangePerCharge}`,
//                         acceleration: '0-60 mph in 3.1s',
//                         category: `Brand: ${brandName}`
//                     },
//                     additionalSpecs: {
//                         battery: vehicle.batteryCapacity,
//                         topSpeed: '155 mph',
//                         seating: '5 Seats'
//                     },
//                     interiorSpecs: {
//                         material: 'Premium Leather',
//                         infotainment: '15" Touchscreen',
//                         climate: 'Dual-Zone Auto',
//                         audio: '12-Speaker Premium Sound',
//                         storage: '15 cu ft Cargo'
//                     },
//                     exteriorSpecs: {
//                         dimensions: '196.8" L x 76.8" W x 56.3" H',
//                         wheels: '19" Alloy Wheels',
//                         lights: 'LED Matrix Headlights',
//                         roof: 'Panoramic Glass Roof',
//                         doors: '4 Doors'
//                     },
//                     price: `$${vehicle.price.toLocaleString()}`,
//                     stock: stockText,
//                     stockType,
//                     fullData: {
//                         ...vehicle,
//                         brand: {
//                             name: brandName,
//                             country: brand.country,
//                             website: brand.website,
//                             founderYear: brand.founderYear
//                         },
//                         quantityAvailable: quantity
//                     }
//                 };

//                 setVehicleData(fullVehicle);
//             } catch (error) {
//                 console.error('Failed to fetch vehicle data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchVehicleData();
//     }, [id]);

//     if (loading) {
//         return (
//             <div className="min-h-screen eco-bg">
//                 <Container fluid className="eco-container">
//                     <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
//                         <div className="main-content">
//                             <h1 className="eco-title">Loading...</h1>
//                         </div>
//                     </div>
//                 </Container>
//             </div>
//         );
//     }

//     if (!vehicleData) {
//         return (
//             <div className="min-h-screen eco-bg">
//                 <Container fluid className="eco-container">
//                     <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
//                         <div className="main-content">
//                             <h1 className="eco-title">Vehicle Not Found</h1>
//                         </div>
//                     </div>
//                 </Container>
//             </div>
//         );
//     }

//     const handleTestDriveClick = () => {
//         navigate(`/test-drive-register?vehicle=${encodeURIComponent(vehicleData.title)}`);
//     };

//     const renderSpecsList = (specs, isOverview = false) => (
//         <ListGroup variant="flush">
//             {Object.entries(specs).map(([key, value]) => (
//                 <ListGroup.Item key={key} className="highlight-spec">
//                     <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong>{' '}
//                     <span className="highlight-value">{value}</span>
//                 </ListGroup.Item>
//             ))}
//             {isOverview && (
//                 <>
//                     <ListGroup.Item className="highlight-spec">
//                         <strong>Stock:</strong> <span className={`stock-badge ${vehicleData.stockType}`}>{vehicleData.stock}</span>
//                     </ListGroup.Item>
//                     <hr />
//                     <h6 className="eco-section-title">Brand Information</h6>
//                     <ListGroup.Item className="highlight-spec">
//                         <strong>Country:</strong> <span className="highlight-value">{vehicleData.fullData.brand.country}</span>
//                     </ListGroup.Item>
//                     <ListGroup.Item className="highlight-spec">
//                         <strong>Website:</strong> <span className="highlight-value"><a href={vehicleData.fullData.brand.website} target="_blank" rel="noopener noreferrer">{vehicleData.fullData.brand.website}</a></span>
//                     </ListGroup.Item>
//                     <ListGroup.Item className="highlight-spec">
//                         <strong>Founded:</strong> <span className="highlight-value">{vehicleData.fullData.brand.founderYear}</span>
//                     </ListGroup.Item>
//                 </>
//             )}
//         </ListGroup>
//     );

//     const renderTabContent = (tabKey) => {
//         const specs = tabKey === 'overview'
//             ? { ...vehicleData.specs, ...vehicleData.additionalSpecs, version: vehicleData.fullData.version, year: vehicleData.fullData.year, color: vehicleData.fullData.color, warranty: vehicleData.fullData.warrantyPeriod }
//             : tabKey === 'interior' ? vehicleData.interiorSpecs : vehicleData.exteriorSpecs;

//         return (
//             <Card.Body>
//                 <div className="highlight-price eco-price mb-3">
//                     {vehicleData.price} <span className="highlight-badge">{tabKey === 'overview' ? 'Best Value' : tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}</span>
//                 </div>
//                 <div className="mb-3">
//                     {renderSpecsList(specs, tabKey === 'overview')}
//                 </div>
//                 {tabKey === 'overview' && (
//                     <div className="detail-actions eco-buttons mt-3">
//                         <Button variant="eco-primary" size="lg" onClick={handleTestDriveClick} className="me-2">
//                             Schedule Test Drive
//                         </Button>
//                         <Button variant="outline-eco" size="lg">
//                             Get Quote
//                         </Button>
//                     </div>
//                 )}
//             </Card.Body>
//         );
//     };

//     return (
//         <div className="min-h-screen eco-bg">
//             <Container fluid className="eco-container">
//                 <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
//                     <div className="main-content">
//                         <div className="page-header">
//                             <h1 className="eco-title">{vehicleData.title}</h1>
//                             <p className="eco-subtitle">{vehicleData.description}</p>
//                         </div>
//                         <Row className="g-4">
//                             <Col md={6}>
//                                 <Card className="eco-detail-card">
//                                     <Carousel>
//                                         {vehicleData.images.overview.map((img, index) => (
//                                             <Carousel.Item key={index}>
//                                                 <img
//                                                     className="d-block w-100 eco-detail-img"
//                                                     src={img}
//                                                     alt={`${vehicleData.title} image ${index + 1}`}
//                                                 />
//                                             </Carousel.Item>
//                                         ))}
//                                     </Carousel>
//                                 </Card>
//                             </Col>
//                             <Col md={6}>
//                                 <Card className="eco-detail-card h-100">
//                                     <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3 eco-tabs">
//                                         <Tab eventKey="overview" title={<span className="eco-tab-title">Overview</span>}>
//                                             {renderTabContent('overview')}
//                                         </Tab>
//                                         <Tab eventKey="interior" title={<span className="eco-tab-title">Interior</span>}>
//                                             {renderTabContent('interior')}
//                                         </Tab>
//                                         <Tab eventKey="exterior" title={<span className="eco-tab-title">Exterior</span>}>
//                                             {renderTabContent('exterior')}
//                                         </Tab>
//                                     </Tabs>
//                                 </Card>
//                             </Col>
//                         </Row>
//                     </div>
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default VehicleDetailPage;

// src/pages/user/VehicleDetailPage/VehicleDetailPage.jsx (updated: handle null values with "No Data" display)
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, ListGroup, Carousel, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../styles/HomePage.scss';
import '../../../styles/VehicleDetailPage.scss';
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
                const title = `${brandName} ${vehicle.modelName} ${vehicle.version} (${vehicle.year})`;
                const description = `The ${vehicle.modelName} ${vehicle.version} (${vehicle.year}) is a premium ${vehicle.vehicleType} with ${vehicle.color} finish.`;

                // Use API imageUrls for all tabs (duplicate to 3 if needed)
                const apiImages = vehicle.imageUrls || [];
                const paddedImages = [...apiImages, ...apiImages.slice(0, 3 - apiImages.length)]; // Pad to at least 3

                // Logical categorization with user-friendly labels and order, handle nulls
                const getValueOrNoData = (val) => val || 'No Data';

                const overviewSpecs = {
                    'Vehicle Type': getValueOrNoData(vehicle.vehicleType),
                    'Range per Charge': getValueOrNoData(vehicle.rangePerCharge),
                    'Battery Capacity': getValueOrNoData(vehicle.batteryCapacity),
                    'Horsepower': `${getValueOrNoData(vehicle.horsepower)} HP`,
                    'Transmission': getValueOrNoData(vehicle.transmission),
                    'Seating Capacity': `${getValueOrNoData(vehicle.seatingCapacity)} Seats`,
                    'Airbags': `${getValueOrNoData(vehicle.airbags)}`,
                    'Warranty': getValueOrNoData(vehicle.warrantyPeriod),
                    'Daily Driving Limit': `${getValueOrNoData(vehicle.dailyDrivingLimit)} km`,
                    'Trunk Capacity': `${getValueOrNoData(vehicle.trunkCapacity)} L`,
                    'Version': getValueOrNoData(vehicle.version),
                    'Year': getValueOrNoData(vehicle.year),
                    'Color': getValueOrNoData(vehicle.color)
                };

                const interiorSpecs = {
                    'Screen': getValueOrNoData(vehicle.screen),
                    'Seat Material': getValueOrNoData(vehicle.seatMaterial),
                    'Interior Material': getValueOrNoData(vehicle.interiorMaterial),
                    'Air Conditioning': getValueOrNoData(vehicle.airConditioning),
                    'Speaker System': getValueOrNoData(vehicle.speakerSystem),
                    'In-Vehicle Cabinet': getValueOrNoData(vehicle.inVehicleCabinet)
                };

                const exteriorSpecs = {
                    'Dimensions': `${getValueOrNoData(vehicle.lengthMm)} x ${getValueOrNoData(vehicle.widthMm)} x ${getValueOrNoData(vehicle.heightMm)} mm`,
                    'Wheels': getValueOrNoData(vehicle.wheels),
                    'Head lights': getValueOrNoData(vehicle.headlights),
                    'Tail lights': getValueOrNoData(vehicle.taillights),
                    'Frame/Chassis': getValueOrNoData(vehicle.frameChassis),
                    'Door Count': `${getValueOrNoData(vehicle.doorCount)} Doors`,
                    'Glass Windows': getValueOrNoData(vehicle.glassWindows),
                    'Mirrors': getValueOrNoData(vehicle.mirrors),
                    'Cameras': getValueOrNoData(vehicle.cameras)
                };

                const fullVehicle = {
                    id: vehicle.vehicleId,
                    slug: `${brandName?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}-${vehicle.modelName.toLowerCase().replace(/\s+/g, '-')}`,
                    images: {
                        overview: paddedImages,
                        interior: paddedImages,
                        exterior: paddedImages
                    },
                    title,
                    description,
                    specs: {
                        brand: brandName
                    },
                    overviewSpecs,
                    interiorSpecs,
                    exteriorSpecs,
                    price: `${vehicle.price?.toLocaleString() || 'No Data'} VND`,
                    stock: stockText,
                    stockType,
                    fullData: {
                        ...vehicle,
                        brand: {
                            name: brandName,
                            country: getValueOrNoData(brand.country),
                            website: getValueOrNoData(brand.website),
                            founderYear: getValueOrNoData(brand.founderYear)
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

    const handleGetQuoteClick = () => {
        navigate(`/quote-register?vehicle=${encodeURIComponent(vehicleData.title)}`);
    };

    const renderSpecsList = (specs, isOverview = false) => (
        <ListGroup variant="flush">
            {Object.entries(specs).map(([label, value]) => (
                <ListGroup.Item key={label} className="highlight-spec">
                    <strong>{label}:</strong>{' '}
                    <span className="highlight-value">{value || 'No Data'}</span>
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
                        <strong>Brand:</strong> <span className="highlight-value">{vehicleData.specs.brand}</span>
                    </ListGroup.Item>
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
        const specs = tabKey === 'overview'
            ? vehicleData.overviewSpecs
            : tabKey === 'interior' ? vehicleData.interiorSpecs : vehicleData.exteriorSpecs;

        return (
            <Card.Body className="tab-pane">
                <div className="highlight-price eco-price mb-3">
                    {vehicleData.price} <span className="highlight-badge">{tabKey === 'overview' ? 'Best Value' : tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}</span>
                </div>
                <div className="mb-3">
                    {renderSpecsList(specs, tabKey === 'overview')}
                </div>
                {tabKey === 'overview' && (
                    <div className="detail-actions eco-buttons mt-3">
                        <Button
                            variant="eco-primary"
                            size="lg"
                            onClick={handleTestDriveClick}
                            className="me-2"
                        >
                            Schedule Test Drive
                        </Button>
                        <Button variant="outline-eco" size="lg" onClick={handleGetQuoteClick}>
                            Get Quote
                        </Button>
                    </div>
                )}
            </Card.Body>
        );
    };

    // Inline styles for tabs (kept as per previous)
    const tabStyle = {
        color: '#2e7d32',
        border: 'none',
        borderRadius: '12px',
        marginRight: '0.25rem',
        padding: '0.5rem 1rem',
        fontWeight: '600',
        background: 'transparent',
        transition: 'all 0.3s ease',
        display: 'block',
        width: '100%',
        textAlign: 'center'
    };

    const activeTabStyle = {
        ...tabStyle,
        background: 'linear-gradient(135deg, #2e7d32 0%, #81c784 100%)',
        color: 'white',
        boxShadow: '0 4px 8px rgba(129, 199, 132, 0.3)',
        borderBottom: 'none'
    };

    const hoverTabStyle = {
        ...tabStyle,
        background: 'rgba(129, 199, 132, 0.1)',
        color: '#2e7d32'
    };

    const tabsContainerStyle = {
        '--bs-nav-tabs-border-color': 'transparent',
        '--bs-nav-tabs-link-active-bg': 'transparent',
        '--bs-nav-tabs-link-active-color': '#2e7d32',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid rgba(46, 125, 50, 0.1)'
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
                                    <Tabs
                                        activeKey={activeTab}
                                        onSelect={(k) => setActiveTab(k)}
                                        className="mb-3 eco-tabs"
                                        style={tabsContainerStyle}
                                    >
                                        <Tab
                                            eventKey="overview"
                                            title={
                                                <span
                                                    style={
                                                        activeTab === 'overview'
                                                            ? activeTabStyle
                                                            : tabStyle
                                                    }
                                                    onMouseEnter={(e) => {
                                                        if (activeTab !== 'overview') {
                                                            Object.assign(e.target.style, hoverTabStyle);
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (activeTab !== 'overview') {
                                                            Object.assign(e.target.style, tabStyle);
                                                        }
                                                    }}
                                                >
                                                    Overview
                                                </span>
                                            }
                                        >
                                            {renderTabContent('overview')}
                                        </Tab>
                                        <Tab
                                            eventKey="interior"
                                            title={
                                                <span
                                                    style={
                                                        activeTab === 'interior'
                                                            ? activeTabStyle
                                                            : tabStyle
                                                    }
                                                    onMouseEnter={(e) => {
                                                        if (activeTab !== 'interior') {
                                                            Object.assign(e.target.style, hoverTabStyle);
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (activeTab !== 'interior') {
                                                            Object.assign(e.target.style, tabStyle);
                                                        }
                                                    }}
                                                >
                                                    Interior
                                                </span>
                                            }
                                        >
                                            {renderTabContent('interior')}
                                        </Tab>
                                        <Tab
                                            eventKey="exterior"
                                            title={
                                                <span
                                                    style={
                                                        activeTab === 'exterior'
                                                            ? activeTabStyle
                                                            : tabStyle
                                                    }
                                                    onMouseEnter={(e) => {
                                                        if (activeTab !== 'exterior') {
                                                            Object.assign(e.target.style, hoverTabStyle);
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (activeTab !== 'exterior') {
                                                            Object.assign(e.target.style, tabStyle);
                                                        }
                                                    }}
                                                >
                                                    Exterior
                                                </span>
                                            }
                                        >
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