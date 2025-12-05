import { useState } from 'react';

export default function MemoWidget() {
  return (
    <div className="dashboard-card memo-card">
      <h2>メモ帳</h2>
      <p>ここにメモ一覧を表示します</p>
      <button onClick={() => alert('AIに機能実装を依頼しましょう！')}>
        + メモを追加
      </button>
    </div>
  );
}