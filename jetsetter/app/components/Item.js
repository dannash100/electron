import React from 'react';

const Item = ({ packed, id, value, onCheckOff, onDelete}) => {
  return (
    <article className="item">
      <label>
        <input type="checkbox" checked={packed} onChange={onCheckOff} />
          {value}
      </label>
      <button className='delete' onClick={onDelete}>X</button>
    </article>
  );
};

export default Item