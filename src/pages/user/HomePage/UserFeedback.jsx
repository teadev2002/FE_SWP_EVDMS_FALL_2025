
// post feedback
import React, { useState, useEffect } from 'react';
import {
  Container,
  ListGroup,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
  InputGroup
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ManageFeedbackService from '../../../services/ManageFeedback/FeedbackService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService'; // Thêm
import { Star, StarFill } from 'react-bootstrap-icons';

const UserFeedback = () => {
  const { id: vehicleId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({ text: '', type: '' });

  // Form state
  const [customerId, setCustomerId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);

  // Ngày hiện tại
  const today = new Date().toLocaleDateString('vi-VN');

  // === LOAD FEEDBACKS ===
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setLoading(true);
        setError('');
        const allFeedbacks = await ManageFeedbackService.getAllFeedback();
        const vehicleFeedbacks = allFeedbacks.filter(
          fb => fb.vehicleId === parseInt(vehicleId)
        );

        const feedbacksWithNames = await Promise.all(
          vehicleFeedbacks.map(async (fb) => {
            try {
              const customer = await ManageCustomersService.GetCustomerById(fb.customerId);
              return {
                ...fb,
                customerName: customer.fullName || `Customer #${fb.customerId}`
              };
            } catch (err) {
              console.warn(`Cannot get customerId ${fb.customerId}`, err);
              return {
                ...fb,
                customerName: `Customer #${fb.customerId}`
              };
            }
          })
        );

        setFeedbacks(feedbacksWithNames);
      } catch (err) {
        console.error('Error loading feedback:', err);
        setError('Error loading feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, [vehicleId]);

  // === XỬ LÝ NHẬP PHONE ===
  const handlePhoneSubmit = async () => {
    if (!phone.trim()) {
      setModalMessage({ text: 'Input your phone number', type: 'danger' });
      return;
    }

    setModalLoading(true);
    setModalMessage({ text: '', type: '' });

    try {
      const customers = await ManageCustomersService.getAllCustomers();
      const customer = customers.find(c => c.phone === phone);

      if (!customer) {
        setModalMessage({ text: 'Phone not found', type: 'danger' });
        setModalLoading(false);
        return;
      }

      if (!customer.orders || customer.orders.length === 0) {
        setModalMessage({ text: 'You have not order', type: 'danger' });
        setModalLoading(false);
        return;
      }

      // === DUYỆT TỪNG ORDER → GỌI getOrderById ĐỂ LẤY QUOTES CHÍNH XÁC ===
      let validOrder = null;
      for (const order of customer.orders) {
        try {
          const fullOrder = await ManageOrdersService.getOrderById(order.orderId);
          if (fullOrder.quotes && Array.isArray(fullOrder.quotes)) {
            const hasVehicle = fullOrder.quotes.some(q =>
              q.vehicle && q.vehicle.vehicleId === parseInt(vehicleId)
            );
            if (hasVehicle) {
              validOrder = fullOrder;
              break;
            }
          }
        } catch (err) {
          console.warn(`error get order ${order.orderId}`, err);
          // Bỏ qua lỗi, tiếp tục với order tiếp theo
        }
      }

      if (!validOrder) {
        setModalMessage({ text: 'You have not purchased this vehicle', type: 'danger' });
        setModalLoading(false);
        return;
      }

      // === CHO PHÉP FEEDBACK ===
      setCustomerId(customer.customerId);
      setOrderId(validOrder.orderId);
      setCanSubmit(true);
      setModalMessage({
        text: `Hello ${customer.fullName}! You can feedback this vehicle.`,
        type: 'success'
      });
    } catch (err) {
      console.error('Lỗi kiểm tra phone:', err);
      setModalMessage({ text: 'err system', type: 'danger' });
    } finally {
      setModalLoading(false);
    }
  };

  // === GỬI FEEDBACK ===
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      setModalMessage({ text: 'Rating star', type: 'danger' });
      return;
    }
    if (!comment.trim()) {
      setModalMessage({ text: 'Input your comment', type: 'danger' });
      return;
    }

    setModalLoading(true);
    try {
      const payload = {
        customerId,
        orderId,
        vehicleId: parseInt(vehicleId),
        rating,
        comment,
        createDate: today
      };

      await ManageFeedbackService.addFeedback(payload);

      setModalMessage({ text: 'Send feedback successfully!', type: 'success' });
      setTimeout(() => {
        setShowModal(false);
        // Reset form
        setPhone('');
        setRating(0);
        setComment('');
        setCanSubmit(false);
        setCustomerId(null);
        setOrderId(null);

        // === RELOAD FEEDBACK KHÔNG RELOAD TRANG ===
        const reloadFeedbacks = async () => {
          const allFeedbacks = await ManageFeedbackService.getAllFeedback();
          const filtered = allFeedbacks.filter(fb => fb.vehicleId === parseInt(vehicleId));
          const withNames = await Promise.all(
            filtered.map(async (fb) => {
              try {
                const cust = await ManageCustomersService.GetCustomerById(fb.customerId);
                return { ...fb, customerName: cust.fullName || `Customer #${fb.customerId}` };
              } catch {
                return { ...fb, customerName: `Customer #${fb.customerId}` };
              }
            })
          );
          setFeedbacks(withNames);
        };
        reloadFeedbacks();
      }, 1500);
    } catch (err) {
      console.error('error sending feedback:', err);
      setModalMessage({ text: 'Sending failed. Please try again.', type: 'danger' });
    } finally {
      setModalLoading(false);
    }
  };

  // === RENDER STARS ===
  const renderStars = (rating, clickable = false, onClick = null) => {
    return [...Array(5)].map((_, i) =>
      i < rating ? (
        <StarFill
          key={i}
          className="text-warning"
          style={{ fontSize: '1.2rem', cursor: clickable ? 'pointer' : 'default' }}
          onClick={() => clickable && onClick(i + 1)}
        />
      ) : (
        <Star
          key={i}
          className="text-muted"
          style={{ fontSize: '1.2rem', cursor: clickable ? 'pointer' : 'default' }}
          onClick={() => clickable && onClick(i + 1)}
        />
      )
    );
  };

  return (
    <>
      <Container className="my-5">
        <div className="view-feedback mb-4">
          <h4 className="text-success">Feedback <Button
            variant="success"
            size="sm"
            onClick={() => setShowModal(true)}
            className="mb-2"
          >
            +
          </Button>
          </h4>
          <p className="text-muted">
            {loading ? 'Loading...' : `${feedbacks.length} feedback(s) found`}
          </p>
          
        </div>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="success" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && feedbacks.length === 0 && (
          <p className="text-center text-muted"></p>
        )}

        {!loading && feedbacks.length > 0 && (
          <ListGroup variant="flush">
            {feedbacks.map((fb) => (
              <ListGroup.Item
                key={fb.feedbackId}
                className="border-start mb-3"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span style={{ display: "flex" }}>
                      <strong>{fb.customerName}</strong>
                      <small className="text-muted d-block" style={{ marginTop: "2px" }}>
                        &nbsp; {fb.createDate}
                      </small>
                    </span>
                    <span className="mt-2 mb-0">{fb.comment}</span>
                  </div>
                  <div>{renderStars(fb.rating)}</div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>

      {/* === MODAL FEEDBACK === */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Feedback Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!canSubmit ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Input Phone</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="0901234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={modalLoading}
                  />
                  <Button
                    variant="outline-success"
                    onClick={handlePhoneSubmit}
                    disabled={modalLoading}
                  >
                    {modalLoading ? <Spinner size="sm" /> : 'System checking'}
                  </Button>
                </InputGroup>
              </Form.Group>
            </>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Rating</Form.Label>
                <div className="d-flex justify-content-center gap-1">
                  {renderStars(rating, true, setRating)}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Share your expirience here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Group>

              <Button
                variant="success"
                className="w-100"
                onClick={handleSubmitFeedback}
                disabled={modalLoading}
              >
                {modalLoading ? <Spinner size="sm" /> : 'Send Feedback'}
              </Button>
            </>
          )}

          {modalMessage.text && (
            <Alert variant={modalMessage.type} className="mt-3">
              {modalMessage.text}
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserFeedback;