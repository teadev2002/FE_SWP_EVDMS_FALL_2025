import React from 'react';
import { Modal, Form, Input, Select, Row, Col, InputNumber, Button, Divider, Typography } from 'antd';
const { Option } = Select;
const { Title } = Typography;

// Hàm lấy brandId từ localStorage
const getBrandIdFromStorage = () => {
  try {
    const staffInfo = localStorage.getItem('staffInfo');
    if (staffInfo) {
      const parsed = JSON.parse(staffInfo);
      return parsed.brandId;
    }
  } catch (error) {
    console.error('Failed to parse staffInfo from localStorage:', error);
  }
  return null;
};

const ModalVehicle = ({
  isModalVisible,
  editingVehicle,
  form,
  brands,
  handleSave,
  handleCancel,
  buttonStyle,
  inputStyle,
}) => {
  // Form layout for responsive design
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  // Function to generate random demo data
  const handleAutoFill = () => {
    const models = [
      'Model X', 'Taycan', 'E-Tron', 'i4', 'Cybertruck', 'ID.4', 'Mustang Mach-E',
      'Model Y', 'Ioniq 5', 'EV6', 'Ariya', 'Polestar 2', 'Lucid Air', 'Hummer EV',
      'BMW iX', 'Mercedes EQS', 'Volvo EX30'
    ];

    const versions = ['Standard', 'Turbo', 'Performance', 'Sport', 'Luxury', 'Pro', 'GT'];
    const colors = ['Jet Black', 'Snow White', 'Midnight Blue', 'Racing Red', 'Silver Metallic', 'Emerald Green'];
    const batteryCapacities = ['75 kWh', '82 kWh', '93.4 kWh', '100 kWh', '120 kWh'];
    const ranges = ['500 km', '550 km', '600 km', '640 km', '700 km'];
    const warranties = ['6 years or 120,000 km', '8 years or 160,000 km', '7 years or 140,000 km'];
    const transmissions = ['Automatic Single Speed', 'Automatic 2-Speed', 'Direct Drive'];
    const vehicleTypes = ['Electric Sedan', 'Electric SUV', 'Electric Coupe', 'High-Performance EV'];
    const seatMaterials = ['Premium Leather', 'Vegan Leather', 'Alcantara', 'Fabric'];
    const interiorMaterials = ['Carbon Fiber', 'Wood Trim', 'Leather & Wood', 'Aluminum & Fabric'];
    const airConditionings = ['Dual-Zone Auto', 'Tri-Zone Auto', 'Quad-Zone Auto'];
    const speakerSystems = ['Bose 12 Speakers', 'Burmester 14 Speakers', 'Bang & Olufsen 16 Speakers'];
    const cabinets = ['Center Console', 'Front Trunk', 'Center & Front Trunk'];
    const wheels = ['19 inch Alloy', '20 inch Sport', '21 inch Performance', '22 inch Luxury'];
    const headlights = ['LED Matrix', 'Adaptive LED', 'Laser Light'];
    const taillights = ['LED Strip', '3D LED', 'Dynamic LED'];
    const frames = ['Aluminum', 'Steel & Aluminum', 'Carbon Fiber Composite'];
    const glassWindows = ['Tinted UV-Protective', 'Acoustic Glass', 'Laminated Glass'];
    const mirrors = ['Auto-Dimming', 'Power-Folding', 'Heated & Auto-Dimming'];
    const cameras = ['360° Camera', 'Rear & Side Cameras', 'Full Surround Sensors'];

    // ✅ Lấy brandId từ localStorage khi thêm mới
    const currentBrandId = editingVehicle 
      ? editingVehicle.brandId 
      : getBrandIdFromStorage();

    const randomData = {
      brandId: currentBrandId,
      modelName: models[Math.floor(Math.random() * models.length)] + ` ${Math.floor(1000 + Math.random() * 9000)}`,
      version: versions[Math.floor(Math.random() * versions.length)],
      year: 2023 + Math.floor(Math.random() * 3),
      color: colors[Math.floor(Math.random() * colors.length)],
      price: Math.floor(1000000000 + Math.random() * 4000000000),
      batteryCapacity: batteryCapacities[Math.floor(Math.random() * batteryCapacities.length)],
      rangePerCharge: ranges[Math.floor(Math.random() * ranges.length)],
      warrantyPeriod: warranties[Math.floor(Math.random() * warranties.length)],
      imageUrls: `https://storage.googleapis.com/demo-vehicle-${Math.floor(1000 + Math.random() * 9000)}.jpg`,
      seatingCapacity: 4 + Math.floor(Math.random() * 4),
      transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
      airbags: 6 + Math.floor(Math.random() * 4),
      horsepower: 300 + Math.floor(Math.random() * 500),
      vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      trunkCapacity: 300 + Math.floor(Math.random() * 400),
      dailyDrivingLimit: 300 + Math.floor(Math.random() * 200),
      screen: `Main ${(15 + Math.random() * 3).toFixed(1)} inch + Secondary ${(10 + Math.random() * 2).toFixed(1)} inch`,
      seatMaterial: seatMaterials[Math.floor(Math.random() * seatMaterials.length)],
      interiorMaterial: interiorMaterials[Math.floor(Math.random() * interiorMaterials.length)],
      airConditioning: airConditionings[Math.floor(Math.random() * airConditionings.length)],
      speakerSystem: speakerSystems[Math.floor(Math.random() * speakerSystems.length)],
      inVehicleCabinet: cabinets[Math.floor(Math.random() * cabinets.length)],
      lengthMm: 4500 + Math.floor(Math.random() * 500),
      widthMm: 1800 + Math.floor(Math.random() * 300),
      heightMm: 1300 + Math.floor(Math.random() * 300),
      wheels: wheels[Math.floor(Math.random() * wheels.length)],
      headlights: headlights[Math.floor(Math.random() * headlights.length)],
      taillights: taillights[Math.floor(Math.random() * taillights.length)],
      frameChassis: frames[Math.floor(Math.random() * frames.length)],
      doorCount: 2 + Math.floor(Math.random() * 3),
      glassWindows: glassWindows[Math.floor(Math.random() * glassWindows.length)],
      mirrors: mirrors[Math.floor(Math.random() * mirrors.length)],
      cameras: cameras[Math.floor(Math.random() * cameras.length)],
    };

    form.setFieldsValue(randomData);
  };

  // ✅ Tự động set brandId khi mở modal thêm mới
  React.useEffect(() => {
    if (isModalVisible && !editingVehicle) {
      const brandId = getBrandIdFromStorage();
      if (brandId) {
        form.setFieldsValue({ brandId });
      }
    }
  }, [isModalVisible, editingVehicle, form]);

  return (
    <Modal
      title={editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
      visible={isModalVisible}
      onOk={handleSave}
      onCancel={handleCancel}
      okText={editingVehicle ? 'Update' : 'Add'}
      cancelText="Cancel"
      okButtonProps={{ style: { ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' } }}
      cancelButtonProps={{ style: buttonStyle }}
      width={1000}
      footer={[
        <Button key="auto-fill" onClick={handleAutoFill} style={{ ...buttonStyle, marginRight: 8 }}>
          Auto Fill
        </Button>,
        <Button key="cancel" onClick={handleCancel} style={buttonStyle}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSave}
          style={{ ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' }}
        >
          {editingVehicle ? 'Update' : 'Add'}
        </Button>,
      ]}
    >
      <Form form={form} layout="horizontal" {...formItemLayout}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Divider orientation="left">
              <Title level={5}>General Information</Title>
            </Divider>

            {/* ✅ Ẩn dropdown brand khi thêm mới, chỉ hiển thị khi chỉnh sửa */}
            {editingVehicle ? (
              <Form.Item
                name="brandId"
                label="Brand"
                rules={[{ required: true, message: 'Please select a brand' }]}
              >
                <Select placeholder="Select a brand">
                  {brands.map((brand) => (
                    <Option key={brand.brandId} value={brand.brandId}>
                      {brand.brandName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              // Hiển thị brand name thay vì dropdown khi thêm mới
              <Form.Item label="Brand" required>
                <Input
                  value={brands.find(b => b.brandId === getBrandIdFromStorage())?.brandName || 'Loading...'}
                  disabled
                  style={inputStyle}
                />
                {/* Ẩn field brandId nhưng vẫn giữ giá trị trong form */}
                <Form.Item name="brandId" noStyle>
                  <Input type="hidden" />
                </Form.Item>
              </Form.Item>
            )}

            <Form.Item
              name="modelName"
              label="Model Name"
              rules={[{ required: true, message: 'Please enter model name' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="version"
              label="Version"
              rules={[{ required: true, message: 'Please enter version' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="year"
              label="Year"
              rules={[{ required: true, message: 'Please enter year' }]}
            >
              <InputNumber min={1900} max={new Date().getFullYear() + 1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="color"
              label="Color"
              rules={[{ required: true, message: 'Please enter color' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price (VND)"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
            <Form.Item
              name="imageUrls"
              label="Image URL"
              rules={[{ required: true, message: 'Please enter an image URL' }]}
            >
              <Input style={inputStyle} placeholder="e.g., https://example.com/image.jpg" />
            </Form.Item>
            <Divider orientation="left">
              <Title level={5}>Interior</Title>
            </Divider>
            <Form.Item
              name="seatingCapacity"
              label="Seating Capacity"
              rules={[{ required: true, message: 'Please enter seating capacity' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="trunkCapacity"
              label="Trunk Capacity (L)"
              rules={[{ required: true, message: 'Please enter trunk capacity' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="screen"
              label="Screen"
              rules={[{ required: true, message: 'Please enter screen details' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="seatMaterial"
              label="Seat Material"
              rules={[{ required: true, message: 'Please enter seat material' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="interiorMaterial"
              label="Interior Material"
              rules={[{ required: true, message: 'Please enter interior material' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="airConditioning"
              label="Air Conditioning"
              rules={[{ required: true, message: 'Please enter air conditioning details' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="speakerSystem"
              label="Speaker System"
              rules={[{ required: true, message: 'Please enter speaker system details' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="inVehicleCabinet"
              label="In-Vehicle Cabinet"
              rules={[{ required: true, message: 'Please enter cabinet details' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="airbags"
              label="Airbags"
              rules={[{ required: true, message: 'Please enter number of airbags' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Divider orientation="left">
              <Title level={5}>Performance</Title>
            </Divider>
            <Form.Item
              name="batteryCapacity"
              label="Battery Capacity"
              rules={[{ required: true, message: 'Please enter battery capacity' }]}
            >
              <Input style={inputStyle} placeholder="e.g., 93.4 kWh" />
            </Form.Item>
            <Form.Item
              name="rangePerCharge"
              label="Range per Charge"
              rules={[{ required: true, message: 'Please enter range per charge' }]}
            >
              <Input style={inputStyle} placeholder="e.g., 640 km" />
            </Form.Item>
            <Form.Item
              name="warrantyPeriod"
              label="Warranty Period"
              rules={[{ required: true, message: 'Please enter warranty period' }]}
            >
              <Input style={inputStyle} placeholder="e.g., 8 years or 160,000 km" />
            </Form.Item>
            <Form.Item
              name="transmission"
              label="Transmission"
              rules={[{ required: true, message: 'Please enter transmission type' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="horsepower"
              label="Horsepower"
              rules={[{ required: true, message: 'Please enter horsepower' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="dailyDrivingLimit"
              label="Daily Driving Limit (km)"
              rules={[{ required: true, message: 'Please enter daily driving limit' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <br />
            
            <Divider orientation="left">
              <Title level={5}>Exterior</Title>
            </Divider>
            <Form.Item
              name="vehicleType"
              label="Vehicle Type"
              rules={[{ required: true, message: 'Please enter vehicle type' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="lengthMm"
              label="Length (mm)"
              rules={[{ required: true, message: 'Please enter length' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="widthMm"
              label="Width (mm)"
              rules={[{ required: true, message: 'Please enter width' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="heightMm"
              label="Height (mm)"
              rules={[{ required: true, message: 'Please enter height' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="wheels"
              label="Wheels"
              rules={[{ required: true, message: 'Please enter wheel details' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="headlights"
              label="Headlights"
              rules={[{ required: true, message: 'Please enter headlight details' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="taillights"
              label="Taillights"
              rules={[{ required: true, message: 'Please enter taillight details' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="frameChassis"
              label="Frame/Chassis"
              rules={[{ required: true, message: 'Please enter frame/chassis details' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="doorCount"
              label="Door Count"
              rules={[{ required: true, message: 'Please enter number of doors' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="glassWindows"
              label="Glass Windows"
              rules={[{ required: true, message: 'Please enter glass window details' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="mirrors"
              label="Mirrors"
              rules={[{ required: true, message: 'Please enter mirror details' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="cameras"
              label="Cameras"
              rules={[{ required: true, message: 'Please enter camera details' }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalVehicle;