// fix detail view not showing data - Wait api getStorageByBrandId 
import React, { useState, useEffect } from 'react';
import { Modal, Button, Descriptions, Image, Typography, Tabs, Carousel, Tag, Divider } from 'antd';
import ManageStoreService from '../../../../services/ManageStore/ManageStoreService.jsx';
import ManageVehicleService from '../../../../services/ManageVehicleService/ManageVehicleService.jsx';
import { toast } from 'react-toastify';
import '../../../../styles/dealerStaffManager/ManageVehicle.scss'; // Reuse the same SCSS

const { Text } = Typography;
const { TabPane } = Tabs;

const ViewDetailBrandVehicle = ({
  vehicleId,
  isDetailModalVisible,
  handleDetailCancel,
  getStorageInfo,
   
}) => {
  const [vehicle, setVehicle] = useState(null);
  const [storeName, setStoreName] = useState('N/A');
  const [loading, setLoading] = useState(false);

  // Fetch vehicle details and store name
  useEffect(() => {
    if (!vehicleId || !isDetailModalVisible) {
      setVehicle(null);
      setStoreName('N/A');
      return;
    }

    const fetchVehicleDetails = async () => {
      setLoading(true);
      try {
        const vehicleData = await ManageVehicleService.GetVehicleById(vehicleId);
        setVehicle({ ...vehicleData, status: vehicleData.status || 'Active' });
        const storageInfo = getStorageInfo(vehicleId);
        if (storageInfo.storeId && storageInfo.storeId !== 'N/A') {
          try {
            const storeData = await ManageStoreService.getStoreById(storageInfo.storeId);
            setStoreName(storeData.storeName || 'N/A');
          } catch (error) {
            console.error('Failed to fetch store name:', error);
            setStoreName('N/A');
            toast.error('Failed to fetch store name');
          }
        } else {
          setStoreName('N/A');
        }
      } catch (error) {
        console.error('Failed to fetch vehicle details:', error);
        toast.error('Failed to fetch vehicle details');
        setVehicle(null);
        setStoreName('N/A');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [vehicleId, isDetailModalVisible, getStorageInfo]);

  // Determine stock tag class based on quantity
  const getStockTagClass = (quantity) => {
    if (quantity > 1) return 'available';
    if (quantity === 1) return 'limited';
    return 'out-of-stock';
  };

  return (
    <Modal
      title="Vehicle Details"
      open={isDetailModalVisible}
      onCancel={handleDetailCancel}
      footer={[
        <Button
          key="close"
          type="primary"
          onClick={handleDetailCancel}
          disabled={loading}
          className="ant-btn-primary"
        >
          Close
        </Button>,
      ]}
      width="80%" // Match ManageVehicle modal width
      centered
      aria-label="Vehicle details modal"
      className="ev-dashboard" // Apply same SCSS scope
    >
      {loading ? (
        <Text>Loading...</Text>
      ) : vehicle ? (
        <div>
          {/* Image Carousel */}
          <Carousel autoplay className="ant-carousel">
            {vehicle.imageUrls && vehicle.imageUrls.length > 0 ? (
              vehicle.imageUrls.map((url, index) => (
                <div key={index}>
                  <Image src={url} width="100%" height={300} style={{ objectFit: 'cover', borderRadius: 8 }} />
                </div>
              ))
            ) : (
              <Text>No images available</Text>
            )}
          </Carousel>

          {/* Tabs for organized content */}
          <Tabs defaultActiveKey="1" className="ant-tabs">
            <TabPane tab="General Information" key="1">
              <Descriptions bordered column={2} style={{ marginTop: 16 }}>
                <Descriptions.Item label="Model">{vehicle.modelName || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Version">{vehicle.version || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Color">{vehicle.color || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Price">
                  {vehicle.price >= 1000000
                    ? `${(vehicle.price / 1000000).toFixed(2)}M`
                    : `$${vehicle.price?.toFixed(2) || 'N/A'}`}
                </Descriptions.Item>
                <Descriptions.Item label="Vehicle Type">{vehicle.vehicleType || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag className={vehicle.status === 'Active' ? 'available' : 'out-of-stock'}>
                    {vehicle.status || 'N/A'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Year">{vehicle.year || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Battery Capacity">{vehicle.batteryCapacity || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Range per Charge">{vehicle.rangePerCharge || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Warranty">{vehicle.warrantyPeriod || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Horsepower">{vehicle.horsepower || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Transmission">{vehicle.transmission || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Airbags">{vehicle.airbags || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Seating Capacity">{vehicle.seatingCapacity || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Trunk Capacity">{vehicle.trunkCapacity ? `${vehicle.trunkCapacity} L` : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Daily Driving Limit">{vehicle.dailyDrivingLimit ? `${vehicle.dailyDrivingLimit} km` : 'N/A'}</Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Interior Specifications" key="2">
              <Descriptions bordered column={2} style={{ marginTop: 16 }}>
                <Descriptions.Item label="Screen">{vehicle.screen || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Seat Material">{vehicle.seatMaterial || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Interior Material">{vehicle.interiorMaterial || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Air Conditioning">{vehicle.airConditioning || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Speaker System">{vehicle.speakerSystem || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="In-Vehicle Cabinet">{vehicle.inVehicleCabinet || 'N/A'}</Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Exterior Specifications" key="3">
              <Descriptions bordered column={2} style={{ marginTop: 16 }}>
                <Descriptions.Item label="Length">{vehicle.lengthMm ? `${vehicle.lengthMm} mm` : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Width">{vehicle.widthMm ? `${vehicle.widthMm} mm` : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Height">{vehicle.heightMm ? `${vehicle.heightMm} mm` : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Wheels">{vehicle.wheels || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Headlights">{vehicle.headlights || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Taillights">{vehicle.taillights || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Frame/Chassis">{vehicle.frameChassis || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Door Count">{vehicle.doorCount || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Glass Windows">{vehicle.glassWindows || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Mirrors">{vehicle.mirrors || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Cameras">{vehicle.cameras || 'N/A'}</Descriptions.Item>
              </Descriptions>
            </TabPane>
          </Tabs>

          {/* Storage Information */}
          <Divider orientation="left" className="ant-divider">
            Storage Information
          </Divider>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Store Name">{storeName}</Descriptions.Item>
            <Descriptions.Item label="Quantity Available">
              <Tag className={getStockTagClass(getStorageInfo(vehicleId).quantityAvailable)}>
                {getStorageInfo(vehicleId).quantityAvailable} Available
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">{getStorageInfo(vehicleId).lastUpdated || 'N/A'}</Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <Text>Failed to load vehicle details</Text>
      )}
    </Modal>
  );
};

export default ViewDetailBrandVehicle;