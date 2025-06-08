import React, { useState } from 'react';
import axios from 'axios';
import './DebateForm.css';

const allStyles = [
  'Vāda', 'Jalpa', 'Vitandā',
  'Katha', 'Tarka', 'Sambhāṣā',
  'Charchā', 'Parisamvāda',
  'Shastrārtha', 'Prashna-Uttara'
];

function DebateForm() {
  const [topic, setTopic] = useState('');
  const [styles1, setStyles1] = useState([]);
  const [styles2, setStyles2] = useState([]);
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addStyle = (style, debater) => {
    if (style === '') return;
    if (debater === 1 && !styles1.includes(style)) setStyles1([...styles1, style]);
    if (debater === 2 && !styles2.includes(style)) setStyles2([...styles2, style]);
  };

  const removeStyle = (style, debater) => {
    if (debater === 1) setStyles1(styles1.filter(s => s !== style));
    if (debater === 2) setStyles2(styles2.filter(s => s !== style));
  };

  const handleSubmit = async () => {
    if (!topic || styles1.length === 0 || styles2.length === 0) {
      alert('Please fill all required fields and select at least one style for each debater.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/debate', {
        topic,
        styles_1: styles1,
        styles_2: styles2,
        name1,
        name2
      });

      const output = res.data.response;

      const lines = output.trim().split('\n').filter(line => line.trim());
      const messages = lines.map(line => {
        const deb1 = name1 || 'Debater 1';
        const deb2 = name2 || 'Debater 2';
        if (line.startsWith(`${deb1}:`)) {
          return { sender: deb1, text: line.replace(`${deb1}:`, '').trim() };
        } else if (line.startsWith(`${deb2}:`)) {
          return { sender: deb2, text: line.replace(`${deb2}:`, '').trim() };
        } else {
          return { sender: 'System', text: line.trim() };
        }
      });

      setChat([...chat, ...messages]);
    } catch (err) {
      alert('Error during debate. Is your backend running at port 5000?');
    }
    setIsLoading(false);
  };

  return (
    <div className="debate-container">
      <h2>🧠 Sanskrit Philosophy AI Debater</h2>

      <input
        placeholder="Debate Topic"
        value={topic}
        onChange={e => setTopic(e.target.value)}
        className="input"
      />

      <div className="debater-section">
        <h3>Debater 1</h3>
        <input
          placeholder="Optional Name"
          value={name1}
          onChange={e => setName1(e.target.value)}
          className="input"
        />
        <select onChange={e => addStyle(e.target.value, 1)} defaultValue="">
          <option value="" disabled>Select a style</option>
          {allStyles.filter(s => !styles1.includes(s)).map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
        <div className="style-tags">
          {styles1.map(style => (
            <span className="tag" key={style}>
              {style}
              <button onClick={() => removeStyle(style, 1)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="debater-section">
        <h3>Debater 2</h3>
        <input
          placeholder="Optional Name"
          value={name2}
          onChange={e => setName2(e.target.value)}
          className="input"
        />
        <select onChange={e => addStyle(e.target.value, 2)} defaultValue="">
          <option value="" disabled>Select a style</option>
          {allStyles.filter(s => !styles2.includes(s)).map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
        <div className="style-tags">
          {styles2.map(style => (
            <span className="tag" key={style}>
              {style}
              <button onClick={() => removeStyle(style, 2)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Generating...' : chat.length === 0 ? 'Start Debate' : 'Continue Conversation'}
      </button>

      <div className="chat-output">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.sender === (name1 || 'Debater 1') ? 'left' : 'right'}`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DebateForm;
