import { useState } from 'react';

export default function TodoWidget() {
  return (
    <div className="dashboard-card todo-card">
      <h2>やることリスト</h2>
      <ul>
        <li>サンプルタスク（未完了）</li>
      </ul>
    </div>
  );
}