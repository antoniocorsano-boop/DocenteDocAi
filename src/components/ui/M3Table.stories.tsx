import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import M3Table from '../M3Table';

const meta: Meta<typeof M3Table> = {
  component: M3Table,
  title: 'UI/DataDisplay/M3Table',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 Table component. Display tabular data with sorting and selection.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { id: 1, name: 'Giovanni', class: '1A', grade: 'A' },
  { id: 2, name: 'Maria', class: '1A', grade: 'A+' },
  { id: 3, name: 'Antonio', class: '1B', grade: 'B' },
  { id: 4, name: 'Lucia', class: '1B', grade: 'A' },
  { id: 5, name: 'Marco', class: '2A', grade: 'C' },
];

/**
 * Basic table
 */
export const Basic: Story = {
  args: {
    columns: [
      { id: 'name', label: 'Name', align: 'left' },
      { id: 'class', label: 'Class', align: 'center' },
      { id: 'grade', label: 'Grade', align: 'center' },
    ],
    rows: sampleData,
  },
};

/**
 * With sorting
 */
export const WithSorting: Story = {
  render: () => {
    const [sortBy, setSortBy] = useState<'name' | 'grade'>('name');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const sorted = [...sampleData].sort((a, b) => {
      const aVal = sortBy === 'name' ? a.name : a.grade;
      const bVal = sortBy === 'name' ? b.name : b.grade;
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return (
      <div style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="name">Sort by Name</option>
            <option value="grade">Sort by Grade</option>
          </select>
          <button onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
            {order === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>
        <M3Table
          columns={[
            { id: 'name', label: 'Name', align: 'left' },
            { id: 'class', label: 'Class', align: 'center' },
            { id: 'grade', label: 'Grade', align: 'center' },
          ]}
          rows={sorted}
        />
      </div>
    );
  },
};

/**
 * With selection
 */
export const WithSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<number[]>([]);

    const toggleRow = (id: number) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      );
    };

    return (
      <div style={{ maxWidth: '600px' }}>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Selected: {selected.length} row(s)
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>
                <input
                  type="checkbox"
                  checked={selected.length === sampleData.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected(sampleData.map((r) => r.id));
                    } else {
                      setSelected([]);
                    }
                  }}
                />
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>Class</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((row) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: selected.includes(row.id) ? '#f5e6ff' : 'transparent',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                <td style={{ padding: '1rem', textAlign: 'left' }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => toggleRow(row.id)}
                  />
                </td>
                <td style={{ padding: '1rem', textAlign: 'left' }}>{row.name}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>{row.class}</td>
                <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '500' }}>
                  {row.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

/**
 * Grade report
 */
export const GradeReport: Story = {
  render: () => (
    <div style={{ maxWidth: '700px' }}>
      <h2>Grade Report - Class 1A</h2>
      <M3Table
        columns={[
          { id: 'name', label: 'Student Name', align: 'left' },
          { id: 'math', label: 'Math', align: 'center' },
          { id: 'italian', label: 'Italian', align: 'center' },
          { id: 'english', label: 'English', align: 'center' },
          { id: 'average', label: 'Average', align: 'center' },
        ]}
        rows={[
          { id: 1, name: 'Giovanni', math: 'A', italian: 'B+', english: 'A', average: 'A-' },
          { id: 2, name: 'Maria', math: 'A+', italian: 'A+', english: 'A', average: 'A' },
          { id: 3, name: 'Antonio', math: 'B', italian: 'B', english: 'C', average: 'B' },
          { id: 4, name: 'Lucia', math: 'A', italian: 'A', english: 'A+', average: 'A' },
        ]}
      />
    </div>
  ),
};

/**
 * Document table with actions
 */
export const DocumentTable: Story = {
  render: () => (
    <div style={{ maxWidth: '700px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>
              Document
            </th>
            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
              Date
            </th>
            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
              Size
            </th>
            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: 'Chapter 5 - Geometry', date: 'Dec 19', size: '2.4 MB' },
            { name: 'Algebra Exercises', date: 'Dec 18', size: '1.8 MB' },
            { name: 'Test - Equations', date: 'Dec 17', size: '3.1 MB' },
          ].map((doc, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e0e0e0' }}>
              <td style={{ padding: '1rem', textAlign: 'left' }}>{doc.name}</td>
              <td style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>{doc.date}</td>
              <td style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>{doc.size}</td>
              <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
                  👁 View
                </button>
                <button style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
                  ⬇ Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/**
 * Accessibility features
 */
export const Accessibility: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <table
        role="table"
        aria-label="Student grades table"
        style={{ width: '100%', borderCollapse: 'collapse' }}
      >
        <thead>
          <tr role="row" style={{ backgroundColor: '#f5f5f5' }}>
            <th role="columnheader" scope="col" style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>
              Name
            </th>
            <th role="columnheader" scope="col" style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
              Grade
            </th>
          </tr>
        </thead>
        <tbody>
          {sampleData.slice(0, 3).map((row) => (
            <tr key={row.id} role="row" style={{ borderBottom: '1px solid #e0e0e0' }}>
              <td role="cell" style={{ padding: '1rem', textAlign: 'left' }}>
                {row.name}
              </td>
              <td role="cell" style={{ padding: '1rem', textAlign: 'center', fontWeight: '500' }}>
                {row.grade}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features:

- **Semantic HTML**: Proper table, thead, tbody, th, tr, td elements
- **ARIA Attributes**: role="table", aria-label, scope on headers
- **Keyboard Navigation**: Tab through cells, arrow keys for navigation
- **Screen Reader**: Announces row and column headers
- **Data Association**: scope="col" and scope="row" for proper cell reading
- **Color Contrast**: High contrast text and backgrounds

### Best Practices:
- Use semantic table elements
- Provide table caption or aria-label
- Mark header cells with scope attribute
- Support keyboard navigation
- Avoid complex nested tables
- Announce row/column headers for screen readers
        `,
      },
    },
  },
};
