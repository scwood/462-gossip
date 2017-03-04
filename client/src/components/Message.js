import React from 'react';

export default function Message({ name, date, children }) {
  return (
    <article className="media">
      <div className="media-content">
        <div className="content">
          <p>
            {name && <strong>{name}</strong>}
            &nbsp;
            &nbsp;
            {children}
          </p>
        </div>
      </div>
    </article>
  );
}
