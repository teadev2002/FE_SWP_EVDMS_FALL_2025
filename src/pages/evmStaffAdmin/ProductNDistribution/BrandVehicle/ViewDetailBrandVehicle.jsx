import React, { useState, useEffect } from 'react';
import { Modal, Button, Descriptions, Image, Typography } from 'antd';
import ManageStoreService from '../../../../services/ManageStore/ManageStoreService.jsx';
import { toast } from 'react-toastify';
import ManageVehicleService from '../../../../services/ManageVehicleService/ManageVehicleService.jsx';
const { Text } = Typography;

const ViewDetailBrandVehicle = ({
  vehicleId, // Changed from selectedVehicle to vehicleId for API fetch
  isDetailModalVisible,
  handleDetailCancel,
  getStorageInfo,
  buttonStyle,
}) => {
  const [vehicle, setVehicle] = useState(null);
  const [storeName, setStoreName] = useState('N/A');
  const [loading, setLoading] = useState(false);

  // Fetch vehicle details and store name when vehicleId changes
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
        setVehicle({ ...vehicleData, status: vehicleData.status || 'Active' }); // Default status if not provided
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

  return (
    <Modal
      title="Vehicle Details"
      open={isDetailModalVisible}
      onCancel={handleDetailCancel}
      footer={[
        <Button
          key="close"
          onClick={handleDetailCancel}
          style={buttonStyle}
          disabled={loading}
        >
          Close
        </Button>,
      ]}
      width={800}
    >
      {loading ? (
        <Text>Loading...</Text>
      ) : vehicle ? (
        <div>
          <Image.PreviewGroup>
            {vehicle.imageUrls && vehicle.imageUrls.length > 0 ? (
              vehicle.imageUrls.map((url, index) => (
                <Image key={index} src={url} width={100} style={{ marginRight: 8 }} />
              ))
            ) : (
              <Text>No images available</Text>
            )}
          </Image.PreviewGroup>
          <Descriptions title="General Information" bordered column={2} style={{ marginTop: 16 }}>
            <Descriptions.Item label="Model">{vehicle.modelName || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Version">{vehicle.version || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Color">{vehicle.color || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Price">
              {vehicle.price >= 1000000
                ? `${(vehicle.price / 1000000).toFixed(2)}M`
                : `$${vehicle.price?.toFixed(2) || 'N/A'}`}
            </Descriptions.Item>
            <Descriptions.Item label="Vehicle Type">{vehicle.vehicleType || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Status">{vehicle.status || 'N/A'}</Descriptions.Item>
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
          <Descriptions title="Interior Specifications" bordered column={2} style={{ marginTop: 16 }}>
            <Descriptions.Item label="Screen">{vehicle.screen || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Seat Material">{vehicle.seatMaterial || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Interior Material">{vehicle.interiorMaterial || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Air Conditioning">{vehicle.airConditioning || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Speaker System">{vehicle.speakerSystem || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="In-Vehicle Cabinet">{vehicle.inVehicleCabinet || 'N/A'}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="Exterior Specifications" bordered column={2} style={{ marginTop: 16 }}>
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
          <Descriptions title="Storage Information" bordered column={2} style={{ marginTop: 16 }}>
            <Descriptions.Item label="Store Name">{storeName}</Descriptions.Item>
            <Descriptions.Item label="Quantity Available">{getStorageInfo(vehicleId).quantityAvailable}</Descriptions.Item>
            <Descriptions.Item label="Last Updated">{getStorageInfo(vehicleId).lastUpdated}</Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <Text>Failed to load vehicle details</Text>
      )}
    </Modal>
  );
};

export default ViewDetailBrandVehicle;

// fix detail view not showing data - Wait api getStorageByBrandId 
 