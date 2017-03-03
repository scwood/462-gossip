import React from 'react';

export default function Error({ message, children, onDismiss }) {
  return (
    <div className="notification is-danger">
      <button className="delete" onClick={onDismiss}></button>
      {children}
    </div>
  );
}
