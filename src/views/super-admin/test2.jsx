import React from 'react';
import ReactFlow from 'react-flow-renderer';

const elements = [
  {
    id: '1',
    data: { label: 'PEK-1-03-IDF3-0001' },
    position: { x: 250, y: 25 },
  },
  // default node
  {
    id: '2',
    data: { label: 'PEK-1-03-IDF3-0002' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    data: { label: 'PEK-1-02-IDF3-0002' },
    position: { x: 250, y: 250 },
  },
  {
    id: '4',
    data: { label: 'PEK-1-02-IDF3-0003' },
    position: { x: 250, y: 250 },
  },
  {
    id: '5',
    data: { label: 'PEK-1-02-IDF3-0004' },
    position: { x: 250, y: 250 },
  },
  // animated edge
  { id: 'e1-2', source: '1', target: '4'},
  { id: 'e2-3', source: '2', target: '5' },
];

export default () => (
  <div style={{ height: 800,width:1600 }}>
    <ReactFlow elements={elements} />
  </div>
);