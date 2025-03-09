// components/Modal.jsx
import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Confirm Order</h2>
          <button className="modal-close" onClick={onClose}>
            &times; {/* Close button with an "X" */}
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;