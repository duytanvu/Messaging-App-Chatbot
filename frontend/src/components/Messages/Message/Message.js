import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user, isChatbot, botData }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    if (!isChatbot) {
      isSentByCurrentUser = true;
    }
  }

  if (isChatbot) {
    if (botData === 'covid') {
      const { data } = JSON.parse(text);
      if (data) {
        text = `
        Covid-19 information in Canada\n
        Data last updated on ${data[0].latest_date}\n
        Total cases: ${data[0].total_cases}\n
        Total tests: ${data[0].total_tests}\n
        Total criticals: ${data[0].total_criticals}\n
        Total recoveries: ${data[0].total_recoveries}\n
        Total vaccinations: ${data[0].total_vaccinations}
        `;
      }
    } else if (botData === 'stock') {
      const [data] = JSON.parse(text);
      if (data) {
        text = `
        Company name: ${data.companyName}\n
        Industry: ${data.industry}\n
        CEO: ${data.ceo}\n
        Stock price: ${data.price} ${data.currency}\n
        Beta: ${data.beta}\n
        Volume Average: ${data.volAvg}
        `;
      } else {
        text = 'Company stock symbol is incorrect.';
      }
    } else if (botData === 'weather') {
      const data = JSON.parse(text);
      if (data) {
        text = `
        City: ${data.name}\n
        Country: ${data.sys.country}\n
        Main weather: ${data.weather[0].main}\n
        Description: ${data.weather[0].description}\n
        Temperature: ${data.main.temp} Celcius degree\n
        Feel like: ${data.main.feels_like} Celcius degree\n
        Humidity: ${data.main.humidity}
        `;
      }
    }
  }

  return isSentByCurrentUser ? (
    <div className='messageContainer justifyEnd'>
      <p className='sentText pr-10'>{trimmedName}</p>
      <div className='messageBox backgroundBlue'>
        <p className='messageText colorWhite'>{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  ) : (
    <div className='messageContainer justifyStart'>
      <div className='messageBox backgroundLight'>
        <p className='messageText colorDark new-line'>
          {isChatbot ? text : ReactEmoji.emojify(text)}
        </p>
      </div>
      <p className='sentText pl-10 '>{isChatbot ? 'Bot' : user}</p>
    </div>
  );
};

export default Message;
