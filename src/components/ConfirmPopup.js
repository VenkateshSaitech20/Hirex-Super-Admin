import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

const ConfirmPopup = ({ show, onClose, onConfirm, message  }) => {
  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false} centered>
      <Modal.Body className="p-4 text-center">
        <h5 className="mb-3">{message}</h5>
        <div className="d-flex justify-content-center">
          <Button variant="danger" size="md" className="me-1 px-3 pt-1" onClick={onConfirm}>Yes</Button>
          <Button variant="secondary" size="md" className="px-3 pt-1" onClick={onClose}>No</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

ConfirmPopup.propTypes = {
  show : PropTypes.bool,
  onClose : PropTypes.func,
  onConfirm : PropTypes.func,
  message : PropTypes.string,
}
export default ConfirmPopup;