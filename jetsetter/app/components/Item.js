import React from 'react';

const Item = ({ packed, id, value, onCheckOff }) => {
  return (
    <article className="item">
      <label>
        <input type="checkbox" checked={packed} onChange={onCheckOff} />
          {value}
      </label>
    </article>
  );
};

export default Item