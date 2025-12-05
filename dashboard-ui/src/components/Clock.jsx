import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 1秒ごとに時間を更新するタイマー
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // 画面から消える時にタイマーを掃除
  }, []);

  return (
    <div className="dashboard-card clock-card">
      <h2>現在時刻</h2>
      <div style={{ fontSize: '2em', fontWeight: 'bold' }}>
        {time.toLocaleTimeString()}
      </div>
      <p>{time.toLocaleDateString()}</p>
    </div>
  );
}