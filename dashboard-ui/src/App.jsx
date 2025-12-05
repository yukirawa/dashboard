import './App.css';
import Clock from './components/Clock';
import Weather from './components/Weather';
import MemoWidget from './components/MemoWidget';
import TodoWidget from './components/TodoWidget';

function App() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">マイ・ダッシュボード</h1>
      
      <div className="dashboard-grid">
        {/* 作った部品をここに配置 */}
        <Clock />
        <Weather />
        <MemoWidget />
        <TodoWidget />
      </div>
    </div>
  );
}

export default App;