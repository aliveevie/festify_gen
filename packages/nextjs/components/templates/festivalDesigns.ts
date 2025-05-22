export const festivalDesigns = [
  {
    id: 1,
    name: "Gradient Celebration",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6a11cb;stop-opacity:1">
            <animate attributeName="stop-color" values="#6a11cb;#2575fc;#6a11cb" dur="10s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" style="stop-color:#2575fc;stop-opacity:1">
            <animate attributeName="stop-color" values="#2575fc;#6a11cb;#2575fc" dur="10s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>
      </defs>
      <rect width="500" height="500" fill="url(#grad1)"/>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="32" fill="white" font-weight="bold">
        {{festival}}
      </text>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="24" fill="white">
        {{message}}
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="18" fill="white">
        {{date}}
      </text>
    </svg>`,
  },
  {
    id: 2,
    name: "Festive Stars",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
      <rect width="500" height="500" fill="#1a1a1a"/>
      <g>
        <path d="M50,50 L55,65 L70,65 L60,75 L65,90 L50,80 L35,90 L40,75 L30,65 L45,65 Z" fill="gold"/>
        <path d="M400,100 L405,115 L420,115 L410,125 L415,140 L400,130 L385,140 L390,125 L380,115 L395,115 Z" fill="gold"/>
        <path d="M150,400 L155,415 L170,415 L160,425 L165,440 L150,430 L135,440 L140,425 L130,415 L145,415 Z" fill="gold"/>
      </g>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="32" fill="white" font-weight="bold">
        {{festival}}
      </text>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="24" fill="white">
        {{message}}
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="18" fill="white">
        {{date}}
      </text>
    </svg>`,
  },
  {
    id: 3,
    name: "Modern Minimalist",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
      <rect width="500" height="500" fill="#ffffff"/>
      <circle cx="250" cy="250" r="200" fill="none" stroke="#333" stroke-width="2"/>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="32" fill="#333" font-weight="bold">
        {{festival}}
      </text>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="24" fill="#666">
        {{message}}
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="18" fill="#999">
        {{date}}
      </text>
    </svg>`,
  },
  {
    id: 4,
    name: "Vibrant Celebration",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
      <defs>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1"/>
          <stop offset="50%" style="stop-color:#fad0c4;stop-opacity:1"/>
          <stop offset="100%" style="stop-color:#fad0c4;stop-opacity:1"/>
        </linearGradient>
      </defs>
      <rect width="500" height="500" fill="url(#grad2)"/>
      <circle cx="250" cy="250" r="150" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10,5"/>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="32" fill="#fff" font-weight="bold">
        {{festival}}
      </text>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="24" fill="#fff">
        {{message}}
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="18" fill="#fff">
        {{date}}
      </text>
    </svg>`,
  },
  {
    id: 5,
    name: "Elegant Gold",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
      <rect width="500" height="500" fill="#2c3e50"/>
      <path d="M0,0 L500,500 M500,0 L0,500" stroke="#f1c40f" stroke-width="2"/>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="32" fill="#f1c40f" font-weight="bold">
        {{festival}}
      </text>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="24" fill="#ecf0f1">
        {{message}}
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="18" fill="#bdc3c7">
        {{date}}
      </text>
    </svg>`,
  },
  {
    id: 6,
    name: "Nature Theme",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
      <rect width="500" height="500" fill="#27ae60"/>
      <path d="M0,400 Q125,300 250,400 Q375,500 500,400" fill="#2ecc71"/>
      <circle cx="100" cy="100" r="30" fill="#f1c40f"/>
      <circle cx="400" cy="150" r="20" fill="#f1c40f"/>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="32" fill="#fff" font-weight="bold">
        {{festival}}
      </text>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="24" fill="#fff">
        {{message}}
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="18" fill="#fff">
        {{date}}
      </text>
    </svg>`,
  },
  {
    id: 7,
    name: "Ocean Waves",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
      <rect width="500" height="500" fill="#3498db"/>
      <path d="M0,300 Q125,250 250,300 Q375,350 500,300" fill="#2980b9"/>
      <path d="M0,350 Q125,300 250,350 Q375,400 500,350" fill="#2980b9"/>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="32" fill="#fff" font-weight="bold">
        {{festival}}
      </text>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="24" fill="#fff">
        {{message}}
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="18" fill="#fff">
        {{date}}
      </text>
    </svg>`,
  },
  {
    id: 8,
    name: "Sunset Glow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
      <defs>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#e74c3c;stop-opacity:1"/>
          <stop offset="100%" style="stop-color:#f39c12;stop-opacity:1"/>
        </linearGradient>
      </defs>
      <rect width="500" height="500" fill="url(#grad3)"/>
      <circle cx="250" cy="250" r="100" fill="#f1c40f" opacity="0.3"/>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="32" fill="#fff" font-weight="bold">
        {{festival}}
      </text>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="24" fill="#fff">
        {{message}}
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="18" fill="#fff">
        {{date}}
      </text>
    </svg>`,
  },
  {
    id: 9,
    name: "Geometric Pattern",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
      <rect width="500" height="500" fill="#34495e"/>
      <path d="M0,0 L500,500 M0,500 L500,0" stroke="#3498db" stroke-width="2"/>
      <path d="M0,250 L500,250 M250,0 L250,500" stroke="#3498db" stroke-width="2"/>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="32" fill="#fff" font-weight="bold">
        {{festival}}
      </text>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="24" fill="#fff">
        {{message}}
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="18" fill="#fff">
        {{date}}
      </text>
    </svg>`,
  },
  {
    id: 10,
    name: "Cosmic Theme",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
      <rect width="500" height="500" fill="#2c3e50"/>
      <circle cx="100" cy="100" r="2" fill="#fff"/>
      <circle cx="200" cy="150" r="1.5" fill="#fff"/>
      <circle cx="300" cy="200" r="2" fill="#fff"/>
      <circle cx="400" cy="250" r="1.5" fill="#fff"/>
      <circle cx="150" cy="300" r="2" fill="#fff"/>
      <circle cx="250" cy="350" r="1.5" fill="#fff"/>
      <circle cx="350" cy="400" r="2" fill="#fff"/>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="32" fill="#fff" font-weight="bold">
        {{festival}}
      </text>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="24" fill="#fff">
        {{message}}
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="18" fill="#fff">
        {{date}}
      </text>
    </svg>`,
  }
]; 