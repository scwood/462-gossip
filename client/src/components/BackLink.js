import React from 'react';
import { Link } from 'react-router'

export default function BackLink() {
  return (
    <p style={{ marginBottom: 20 }}>
      <Link to="/">
        <i className="fa fa-long-arrow-left" aria-hidden="true"></i> Back to list of users
      </Link>
    </p>
  );
}
