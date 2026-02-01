import React from 'react';

const DetectiveStrings = () => {
  return (
    <svg 
      className="detective-strings-overlay" 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.4
      }}
    >
      {/* Horizontal strings */}
      <line x1="10%" y1="25%" x2="90%" y2="25%" stroke="#ff3333" strokeWidth="2" strokeDasharray="10,5" />
      <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#ff3333" strokeWidth="2" strokeDasharray="10,5" />
      <line x1="10%" y1="75%" x2="90%" y2="75%" stroke="#ff3333" strokeWidth="2" strokeDasharray="10,5" />
      
      {/* Vertical strings */}
      <line x1="25%" y1="10%" x2="25%" y2="90%" stroke="#ff3333" strokeWidth="2" strokeDasharray="10,5" />
      <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#ff3333" strokeWidth="2" strokeDasharray="10,5" />
      <line x1="75%" y1="10%" x2="75%" y2="90%" stroke="#ff3333" strokeWidth="2" strokeDasharray="10,5" />
      
      {/* Diagonal strings for connections */}
      <line x1="15%" y1="20%" x2="85%" y2="80%" stroke="#cc0000" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.5" />
      <line x1="85%" y1="20%" x2="15%" y2="80%" stroke="#cc0000" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.5" />
      
      {/* Push pins at intersections */}
      <circle cx="25%" cy="25%" r="4" fill="#ffd700" stroke="#333" strokeWidth="1" />
      <circle cx="50%" cy="25%" r="4" fill="#ffd700" stroke="#333" strokeWidth="1" />
      <circle cx="75%" cy="25%" r="4" fill="#ffd700" stroke="#333" strokeWidth="1" />
      
      <circle cx="25%" cy="50%" r="4" fill="#ffd700" stroke="#333" strokeWidth="1" />
      <circle cx="50%" cy="50%" r="4" fill="#ffd700" stroke="#333" strokeWidth="1" />
      <circle cx="75%" cy="50%" r="4" fill="#ffd700" stroke="#333" strokeWidth="1" />
      
      <circle cx="25%" cy="75%" r="4" fill="#ffd700" stroke="#333" strokeWidth="1" />
      <circle cx="50%" cy="75%" r="4" fill="#ffd700" stroke="#333" strokeWidth="1" />
      <circle cx="75%" cy="75%" r="4" fill="#ffd700" stroke="#333" strokeWidth="1" />
    </svg>
  );
};

export default DetectiveStrings;
