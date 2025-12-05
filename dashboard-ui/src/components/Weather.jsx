import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Weather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // バックエンドから天気取得
    axios.get('http://localhost:5000/api/weather')
      .then(res => setWeather(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="dashboard-card weather-card">
      <h2>天気予報</h2>
      {weather ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={weather.forecasts[0].image.url} alt="icon" width="50" />
            <span style={{ fontSize: '1.2em' }}>{weather.forecasts[0].telop}</span>
          </div>
          <p>{weather.title}</p>
        </div>
      ) : (
        <p>読み込み中...</p>
      )}
    </div>
  );
}