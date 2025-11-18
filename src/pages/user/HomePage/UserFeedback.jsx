
// // post feedback
// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   ListGroup,
//   Spinner,
//   Alert,
//   Button,
//   Modal,
//   Form,
//   InputGroup
// } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
// import ManageFeedbackService from '../../../services/ManageFeedback/FeedbackService';
// import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
// import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService'; // Thêm
// import { Star, StarFill } from 'react-bootstrap-icons';

// const UserFeedback = () => {
//   const { id: vehicleId } = useParams();
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [phone, setPhone] = useState('');
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalMessage, setModalMessage] = useState({ text: '', type: '' });

//   // Form state
//   const [customerId, setCustomerId] = useState(null);
//   const [orderId, setOrderId] = useState(null);
//   const [canSubmit, setCanSubmit] = useState(false);

//   // Ngày hiện tại
//   const today = new Date().toLocaleDateString('vi-VN');

//   // === LOAD FEEDBACKS ===
//   useEffect(() => {
//     const loadFeedbacks = async () => {
//       try {
//         setLoading(true);
//         setError('');
//         const allFeedbacks = await ManageFeedbackService.getAllFeedback();
//         const vehicleFeedbacks = allFeedbacks.filter(
//           fb => fb.vehicleId === parseInt(vehicleId)
//         );

//         const feedbacksWithNames = await Promise.all(
//           vehicleFeedbacks.map(async (fb) => {
//             try {
//               const customer = await ManageCustomersService.GetCustomerById(fb.customerId);
//               return {
//                 ...fb,
//                 customerName: customer.fullName || `Customer #${fb.customerId}`
//               };
//             } catch (err) {
//               console.warn(`Cannot get customerId ${fb.customerId}`, err);
//               return {
//                 ...fb,
//                 customerName: `Customer #${fb.customerId}`
//               };
//             }
//           })
//         );

//         setFeedbacks(feedbacksWithNames);
//       } catch (err) {
//         console.error('Error loading feedback:', err);
//         setError('Error loading feedback. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadFeedbacks();
//   }, [vehicleId]);

//   // === XỬ LÝ NHẬP PHONE ===
//   const handlePhoneSubmit = async () => {
//     if (!phone.trim()) {
//       setModalMessage({ text: 'Input your phone number', type: 'danger' });
//       return;
//     }

//     setModalLoading(true);
//     setModalMessage({ text: '', type: '' });

//     try {
//       const customers = await ManageCustomersService.getAllCustomers();
//       const customer = customers.find(c => c.phone === phone);

//       if (!customer) {
//         setModalMessage({ text: 'Phone not found', type: 'danger' });
//         setModalLoading(false);
//         return;
//       }

//       if (!customer.orders || customer.orders.length === 0) {
//         setModalMessage({ text: 'You have not order', type: 'danger' });
//         setModalLoading(false);
//         return;
//       }

//       // === DUYỆT TỪNG ORDER → GỌI getOrderById ĐỂ LẤY QUOTES CHÍNH XÁC ===
//       let validOrder = null;
//       for (const order of customer.orders) {
//         try {
//           const fullOrder = await ManageOrdersService.getOrderById(order.orderId);
//           if (fullOrder.quotes && Array.isArray(fullOrder.quotes)) {
//             const hasVehicle = fullOrder.quotes.some(q =>
//               q.vehicle && q.vehicle.vehicleId === parseInt(vehicleId)
//               && order.status === 'Completed'
//             );
//             if (hasVehicle) {
//               validOrder = fullOrder;
//               break;
//             }
//           }
//         } catch (err) {
//           console.warn(`error get order ${order.orderId}`, err);
//           // Bỏ qua lỗi, tiếp tục với order tiếp theo
//         }
//       }

//       if (!validOrder) {
//         setModalMessage({ text: 'You have not purchased this vehicle', type: 'danger' });
//         setModalLoading(false);
//         return;
//       }

//       // === CHO PHÉP FEEDBACK ===
//       setCustomerId(customer.customerId);
//       setOrderId(validOrder.orderId);
//       setCanSubmit(true);
//       setModalMessage({
//         text: `Hello ${customer.fullName}! You can feedback this vehicle.`,
//         type: 'success'
//       });
//     } catch (err) {
//       console.error('Lỗi kiểm tra phone:', err);
//       setModalMessage({ text: 'err system', type: 'danger' });
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // === GỬI FEEDBACK ===
//   const handleSubmitFeedback = async () => {
//     if (rating === 0) {
//       setModalMessage({ text: 'Rating star', type: 'danger' });
//       return;
//     }
//     if (!comment.trim()) {
//       setModalMessage({ text: 'Input your comment', type: 'danger' });
//       return;
//     }

//     setModalLoading(true);
//     try {
//       const payload = {
//         customerId,
//         orderId,
//         vehicleId: parseInt(vehicleId),
//         rating,
//         comment,
//         createDate: today
//       };

//       await ManageFeedbackService.addFeedback(payload);

//       setModalMessage({ text: 'Send feedback successfully!', type: 'success' });
//       setTimeout(() => {
//         setShowModal(false);
//         // Reset form
//         setPhone('');
//         setRating(0);
//         setComment('');
//         setCanSubmit(false);
//         setCustomerId(null);
//         setOrderId(null);

//         // === RELOAD FEEDBACK KHÔNG RELOAD TRANG ===
//         const reloadFeedbacks = async () => {
//           const allFeedbacks = await ManageFeedbackService.getAllFeedback();
//           const filtered = allFeedbacks.filter(fb => fb.vehicleId === parseInt(vehicleId));
//           const withNames = await Promise.all(
//             filtered.map(async (fb) => {
//               try {
//                 const cust = await ManageCustomersService.GetCustomerById(fb.customerId);
//                 return { ...fb, customerName: cust.fullName || `Customer #${fb.customerId}` };
//               } catch {
//                 return { ...fb, customerName: `Customer #${fb.customerId}` };
//               }
//             })
//           );
//           setFeedbacks(withNames);
//         };
//         reloadFeedbacks();
//       }, 1500);
//     } catch (err) {
//       console.error('error sending feedback:', err);
//       setModalMessage({ text: 'Sending failed. Please try again.', type: 'danger' });
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // === RENDER STARS ===
//   const renderStars = (rating, clickable = false, onClick = null) => {
//     return [...Array(5)].map((_, i) =>
//       i < rating ? (
//         <StarFill
//           key={i}
//           className="text-warning"
//           style={{ fontSize: '1.2rem', cursor: clickable ? 'pointer' : 'default' }}
//           onClick={() => clickable && onClick(i + 1)}
//         />
//       ) : (
//         <Star
//           key={i}
//           className="text-muted"
//           style={{ fontSize: '1.2rem', cursor: clickable ? 'pointer' : 'default' }}
//           onClick={() => clickable && onClick(i + 1)}
//         />
//       )
//     );
//   };

//   return (
//     <>
//       <Container className="my-5">
//         <div className="view-feedback mb-4">
//           <h4 className="text-success">Feedback <Button
//             variant="success"
//             size="sm"
//             onClick={() => setShowModal(true)}
//             className="mb-2"
//           >
//             +
//           </Button>
//           </h4>
//           <p className="text-muted">
//             {loading ? 'Loading...' : `${feedbacks.length} feedback(s) found`}
//           </p>
          
//         </div>

//         {loading && (
//           <div className="text-center">
//             <Spinner animation="border" variant="success" />
//           </div>
//         )}

//         {error && <Alert variant="danger">{error}</Alert>}

//         {!loading && feedbacks.length === 0 && (
//           <p className="text-center text-muted"></p>
//         )}

//         {!loading && feedbacks.length > 0 && (
//           <ListGroup variant="flush">
//             {feedbacks.map((fb) => (
//               <ListGroup.Item
//                 key={fb.feedbackId}
//                 className="border-start mb-3"
//               >
//                 <div className="d-flex justify-content-between align-items-start">
//                   <div>
//                     <span style={{ display: "flex" }}>
//                       <strong>{fb.customerName}</strong>
//                       <small className="text-muted d-block" style={{ marginTop: "2px" }}>
//                         &nbsp; {fb.createDate}
//                       </small>
//                     </span>
//                     <span className="mt-2 mb-0">{fb.comment}</span>
//                   </div>
//                   <div>{renderStars(fb.rating)}</div>
//                 </div>
//               </ListGroup.Item>
//             ))}
//           </ListGroup>
//         )}
//       </Container>

//       {/* === MODAL FEEDBACK === */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Feedback Vehicle</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {!canSubmit ? (
//             <>
//               <Form.Group className="mb-3">
//                 <Form.Label>Enter The Purchase Phone Number</Form.Label>
//                 <InputGroup>
//                   <Form.Control
//                     type="text"
//                     placeholder="0901234567"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     disabled={modalLoading}
//                   />
//                   <Button
//                     variant="outline-success"
//                     onClick={handlePhoneSubmit}
//                     disabled={modalLoading}
//                   >
//                     {modalLoading ? <Spinner size="sm" /> : 'Verify'}
//                   </Button>
//                 </InputGroup>
//               </Form.Group>
//             </>
//           ) : (
//             <>
//               <Form.Group className="mb-3">
//                 <Form.Label>Rating</Form.Label>
//                 <div className="d-flex justify-content-center gap-1">
//                   {renderStars(rating, true, setRating)}
//                 </div>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Comment</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   placeholder="Share your expirience here..."
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                 />
//               </Form.Group>

//               <Button
//                 variant="success"
//                 className="w-100"
//                 onClick={handleSubmitFeedback}
//                 disabled={modalLoading}
//               >
//                 {modalLoading ? <Spinner size="sm" /> : 'Send Feedback'}
//               </Button>
//             </>
//           )}

//           {modalMessage.text && (
//             <Alert variant={modalMessage.type} className="mt-3">
//               {modalMessage.text}
//             </Alert>
//           )}
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default UserFeedback;

//paging
import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  ListGroup,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
  InputGroup,
  Pagination
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ManageFeedbackService from '../../../services/ManageFeedback/FeedbackService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import { Star, StarFill } from 'react-bootstrap-icons';

const ITEMS_PER_PAGE = 5;

const UserFeedback = () => {
  const { id: vehicleId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState({ text: '', type: '' });

  // Form eligibility
  const [customerId, setCustomerId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);

  const today = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format

  // Load all feedbacks for this vehicle
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
              console.warn(`Failed to load customer ${fb.customerId}`, err);
              return {
                ...fb,
                customerName: `Customer #${fb.customerId}`
              };
            }
          })
        );

        // Sort newest first
        feedbacksWithNames.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
        setFeedbacks(feedbacksWithNames);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error loading feedbacks:', err);
        setError('Failed to load feedbacks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, [vehicleId]);

  // Pagination logic
  const paginatedFeedbacks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return feedbacks.slice(start, end);
  }, [feedbacks, currentPage]);

  const totalPages = Math.ceil(feedbacks.length / ITEMS_PER_PAGE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.First key="first" onClick={() => setCurrentPage(1)} />,
        <Pagination.Ellipsis key="start-ellipsis" />
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <Pagination.Ellipsis key="end-ellipsis" />,
        <Pagination.Last key="last" onClick={() => setCurrentPage(totalPages)} />
      );
    }

    return <Pagination className="justify-content-center mt-4 mb-2">{items}</Pagination>;
  };

  // Verify phone number and purchase eligibility
  const handlePhoneSubmit = async () => {
    if (!phone.trim()) {
      setModalMessage({ text: 'Please enter your phone number', type: 'danger' });
      return;
    }

    setModalLoading(true);
    setModalMessage({ text: '', type: '' });

    try {
      const customers = await ManageCustomersService.getAllCustomers();
      const customer = customers.find(c => c.phone === phone);

      if (!customer) {
        setModalMessage({ text: 'Phone number not found', type: 'danger' });
        return;
      }

      let validOrder = null;
      for (const order of customer.orders || []) {
        if (order.status !== 'Completed') continue;

        try {
          const fullOrder = await ManageOrdersService.getOrderById(order.orderId);
          const hasThisVehicle = fullOrder.quotes?.some(
            q => q.vehicle?.vehicleId === parseInt(vehicleId)
          );

          if (hasThisVehicle) {
            validOrder = fullOrder;
            break;
          }
        } catch (err) {
          console.warn(`Failed to fetch order ${order.orderId}`, err);
        }
      }

      if (!validOrder) {
        setModalMessage({ text: 'You have not purchased this vehicle or order is not completed', type: 'danger' });
        return;
      }

      setCustomerId(customer.customerId);
      setOrderId(validOrder.orderId);
      setCanSubmit(true);
      
    } catch (err) {
      setModalMessage({ text: 'System error. Please try again.', type: 'danger' }, err);
    } finally {
      setModalLoading(false);
    }
  };

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      setModalMessage({ text: 'Please select a star rating', type: 'danger' });
      return;
    }
    if (!comment.trim()) {
      setModalMessage({ text: 'Please write a comment', type: 'danger' });
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

      // Instantly add new feedback to the top (optimistic UI)
      const newFeedback = {
        ...payload,
        feedbackId: Date.now(), // temporary ID
        customerName: (await ManageCustomersService.GetCustomerById(customerId)).fullName || 'You'
      };

      setFeedbacks(prev => [newFeedback, ...prev]);
      setCurrentPage(1); // Jump to first page to see new review

      setModalMessage({ text: 'Thank you! Your review has been submitted.', type: 'success' });

      setTimeout(() => {
        setShowModal(false);
        setPhone('');
        setRating(0);
        setComment('');
        setCanSubmit(false);
        setCustomerId(null);
        setOrderId(null);
        setModalMessage({ text: '', type: '' });
      }, 1500);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setModalMessage({ text: 'Failed to submit. Please try again.', type: 'danger' });
    } finally {
      setModalLoading(false);
    }
  };

  // Render star rating
  const renderStars = (value, clickable = false, onClick = null) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        style={{ cursor: clickable ? 'pointer' : 'default', fontSize: '1.5rem' }}
        onClick={() => clickable && onClick(i + 1)}
      >
        {i < value ? (
          <StarFill className="text-warning" />
        ) : (
          <Star className="text-muted" />
        )}
      </span>
    ));
  };

  return (
    <>
      <Container className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="text-success mb-1">
              Customer Reviews ({feedbacks.length})
              <Button
                variant="success"
                size="sm"
                className="ms-3"
                onClick={() => setShowModal(true)}
              >
                +
              </Button>
            </h4>
            <p className="text-muted mb-0">
              {loading ? 'Loading reviews...' : `${feedbacks.length} review${feedbacks.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && feedbacks.length === 0 && (
          <Alert variant="light" className="text-center py-4">
            No reviews yet. Be the first to share your experience!
          </Alert>
        )}

        {!loading && paginatedFeedbacks.length > 0 && (
          <>
            <ListGroup variant="flush">
              {paginatedFeedbacks.map((fb) => (
                <ListGroup.Item key={fb.feedbackId} className="border-start py-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <strong>{fb.customerName}</strong>
                        <small className="text-muted">• {fb.createDate}</small>
                      </div>
                      <div className="mb-2">{renderStars(fb.rating)}</div>
                      <p className="mb-0 text-dark">{fb.comment}</p>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>

            {renderPagination()}
          </>
        )}
      </Container>

      {/* Feedback Modal */}
      <Modal show={showModal} onHide={() => !modalLoading && setShowModal(false)} centered>
        <Modal.Header closeButton={!modalLoading}>
          <Modal.Title>Review This Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!canSubmit ? (
            <Form.Group className="mb-3">
              <Form.Label>Enter your purchase phone number</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="e.g. 0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={modalLoading}
                  onKeyPress={(e) => e.key === 'Enter' && handlePhoneSubmit()}
                />
                <Button
                  variant="outline-success"
                  onClick={handlePhoneSubmit}
                  disabled={modalLoading}
                >
                  {modalLoading ? <Spinner size="sm" /> : 'Verify'}
                </Button>
              </InputGroup>
            </Form.Group>
          ) : (
            <>
              <Form.Group className="mb-4 text-center">
                <Form.Label>Your Rating</Form.Label>
                <div className="d-flex justify-content-center gap-3 mt-2">
                  {renderStars(rating, true, setRating)}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Your Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Share your experience with this vehicle..."
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
                {modalLoading ? <Spinner size="sm" /> : 'Submit Review'}
              </Button>
            </>
          )}

          {modalMessage.text && (
            <Alert variant={modalMessage.type} className="mt-3 mb-0">
              {modalMessage.text}
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserFeedback;