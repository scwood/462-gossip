import React from 'react';

export default function Checkin({ data }) {
  return (
    <div className="box">
      {Object.keys(data).map(key => {
        return (
          <div key={key}>
            <strong>{key}</strong>: {data[key]}
          </div>
        );
      })}
    </div>
  );
}
