import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users }) => (
  <div className='textContainer'>
    <div>
      <h1>
        Realtime Chat Application{' '}
        <span role='img' aria-label='emoji'>
          💬
        </span>
      </h1>
      <h2>
        Created with React, Express, Node and Socket.IO{' '}
        <span role='img' aria-label='emoji'>
          ❤️
        </span>
      </h2>
      <h2>Check our chatbot out!</h2>
      <div>
        <p>
          <em>Usage:</em> <u>!command &lt;option&gt;</u>
        </p>
        <p>
          <strong>!covid</strong> | Get the latest update about Covid-19 in
          Canada
        </p>
        <p>
          <strong>!stock &lt;symbol&gt;</strong> | Get the latest market update
          about a company with stock symbol
        </p>
        <p>
          <strong>!weather &lt;city&gt;</strong> | Get the latest weather
          forecast of a city
        </p>
      </div>
    </div>
    {users ? (
      <div>
        <h1>People online: </h1>
        <div className='activeContainer'>
          <h2>
            {users.map(({ name }) => (
              <div key={name} className='activeItem'>
                {name}
                <img alt='Online Icon' src={onlineIcon} />
              </div>
            ))}
          </h2>
        </div>
      </div>
    ) : null}
  </div>
);

export default TextContainer;
