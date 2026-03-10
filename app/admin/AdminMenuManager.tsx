'use client';

import { addMenuItem, deleteMenuItem } from './actions';
import { useRef } from 'react';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  dayOfWeek: string;
};

export default function AdminMenuManager({ initialItems }: { initialItems: MenuItem[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="manager-container">
      <div className="add-item-card">
        <h2>Add New Item</h2>
        <form
          ref={formRef}
          action={async (formData) => {
            await addMenuItem(formData);
            formRef.current?.reset();
          }}
          className="admin-form"
        >
          <div className="form-group">
            <label>Name</label>
            <input name="name" type="text" required placeholder="e.g. Vanilla Latte" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" required placeholder="A delicious description..."></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input name="price" type="number" step="0.01" required placeholder="4.99" />
            </div>
            <div className="form-group">
              <label>Day of Week</label>
              <select name="dayOfWeek" required>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="submit-btn">+ Add Item</button>
        </form>
      </div>

      <div className="items-list-container">
        <h2>Current Menu Items</h2>
        <div className="items-grid">
          {initialItems.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-header">
                <h3>{item.name}</h3>
                <span className="item-day">{item.dayOfWeek}</span>
              </div>
              <p className="item-desc">{item.description}</p>
              <div className="item-footer">
                <span className="item-price">₹{item.price.toFixed(2)}</span>
                <button onClick={() => deleteMenuItem(item.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style /* eslint-disable-next-line react/no-unknown-property */ jsx>{`
        .manager-container {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .manager-container {
            grid-template-columns: 1fr;
          }
        }
        .add-item-card {
          background: rgba(30, 41, 59, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
        }
        .add-item-card h2, .items-list-container h2 {
          font-size: 1.25rem;
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.875rem;
          color: #cbd5e1;
        }
        .form-group input, .form-group textarea, .form-group select {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.75rem;
          color: white;
          font-family: inherit;
        }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
          outline: none;
          border-color: #8b5cf6;
        }
        .submit-btn {
          background: #8b5cf6;
          color: white;
          border: none;
          padding: 0.875rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 0.5rem;
        }
        .submit-btn:hover {
          background: #7c3aed;
        }
        
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.25rem;
        }
        .item-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s;
        }
        .item-card:hover {
          border-color: rgba(139, 92, 246, 0.4);
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        .item-header h3 {
          margin: 0;
          font-size: 1.125rem;
        }
        .item-day {
          background: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .item-desc {
          font-size: 0.875rem;
          color: #94a3b8;
          flex-grow: 1;
        }
        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .item-price {
          font-weight: 700;
          color: #10b981;
        }
        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }
      `}</style>
    </div>
  );
}
