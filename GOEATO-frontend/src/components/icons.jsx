import React from 'react';

/**
 * GoEato inline icon set.
 *
 * Replaces emoji-as-iconography (which renders differently on every OS and reads
 * as a prototype) with one consistent 24x24 stroke system. Every icon inherits
 * `currentColor`, so it themes itself from the token palette.
 *
 * @param {Object} props
 * @param {number} [props.size=18] - Rendered width and height in px.
 * @param {number} [props.strokeWidth=1.75] - Stroke weight.
 * @param {string} [props.title] - When provided the icon becomes a labelled image
 *   for assistive tech; otherwise it is hidden from screen readers.
 * @returns {Object} Shared SVG attribute bag.
 */
const svgProps = ({ size = 18, strokeWidth = 1.75, className = '', title, ...rest }) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: `icon ${className}`.trim(),
  role: title ? 'img' : undefined,
  'aria-hidden': title ? undefined : 'true',
  'aria-label': title,
  focusable: 'false',
  ...rest,
});

export const IconSearch = (p) => (
  <svg {...svgProps(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20.5 20.5-4.3-4.3" />
  </svg>
);

export const IconBasket = (p) => (
  <svg {...svgProps(p)}>
    <path d="M4 8h16l-1.3 10.2A2 2 0 0 1 16.7 20H7.3a2 2 0 0 1-2-1.8L4 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const IconPin = (p) => (
  <svg {...svgProps(p)}>
    <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const IconClock = (p) => (
  <svg {...svgProps(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconStar = (p) => (
  <svg {...svgProps(p)} fill="currentColor" stroke="none">
    <path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.6Z" />
  </svg>
);

export const IconStore = (p) => (
  <svg {...svgProps(p)}>
    <path d="M3.5 9.5 5.5 4.5h13l2 5" />
    <path d="M4.8 9.5V20h14.4V9.5" />
    <path d="M9.8 20v-5.2h4.4V20" />
  </svg>
);

export const IconTarget = (p) => (
  <svg {...svgProps(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCheck = (p) => (
  <svg {...svgProps(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const IconClose = (p) => (
  <svg {...svgProps(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconArrowRight = (p) => (
  <svg {...svgProps(p)}>
    <path d="M4.5 12h15" />
    <path d="m13.5 6 6 6-6 6" />
  </svg>
);

export const IconFlame = (p) => (
  <svg {...svgProps(p)}>
    <path d="M12 2.8c3 3.1 5.2 5.8 5.2 9.1a5.2 5.2 0 0 1-10.4 0c0-1.9 1-3.4 2.2-4.8.4 1 1.2 1.7 2.1 1.9-.4-2.2-.2-4.2.9-6.2Z" />
  </svg>
);

export const IconLeaf = (p) => (
  <svg {...svgProps(p)}>
    <path d="M4.5 19.5c0-8 6-13.5 15-14 .5 9-5 15-13.5 15H4.5Z" />
    <path d="M4.5 19.5C8 16 11 13.5 15 11.5" />
  </svg>
);

export const IconBox = (p) => (
  <svg {...svgProps(p)}>
    <path d="M3.5 8.2 12 4l8.5 4.2v7.6L12 20l-8.5-4.2V8.2Z" />
    <path d="M3.5 8.2 12 12.4l8.5-4.2" />
    <path d="M12 12.4V20" />
  </svg>
);

export const IconUser = (p) => (
  <svg {...svgProps(p)}>
    <circle cx="12" cy="8.5" r="3.6" />
    <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
  </svg>
);

export const IconCrown = (p) => (
  <svg {...svgProps(p)}>
    <path d="M4 17h16" />
    <path d="m5 15-1.2-9 4.7 3.6L12 5l3.5 4.6L20.2 6 19 15H5Z" />
  </svg>
);

export const IconMenu = (p) => (
  <svg {...svgProps(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconTicket = (p) => (
  <svg {...svgProps(p)}>
    <path d="M4 8.5V7a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 20 7v1.6a2.9 2.9 0 0 0 0 6.8V17a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17v-1.6a2.9 2.9 0 0 0 0-6.8Z" />
    <path d="M14 6v12" strokeDasharray="2 2.4" />
  </svg>
);

export const IconSparkle = (p) => (
  <svg {...svgProps(p)}>
    <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4Z" />
    <path d="m18.6 16.4.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9Z" />
  </svg>
);

export const IconMinus = (p) => (
  <svg {...svgProps(p)}>
    <path d="M5.5 12h13" />
  </svg>
);

export const IconPlus = (p) => (
  <svg {...svgProps(p)}>
    <path d="M12 5.5v13M5.5 12h13" />
  </svg>
);

export const IconAlert = (p) => (
  <svg {...svgProps(p)}>
    <path d="M12 4.5 21 19.5H3L12 4.5Z" />
    <path d="M12 9.5v4.5" />
    <circle cx="12" cy="16.8" r=".9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconInfo = (p) => (
  <svg {...svgProps(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.5" />
    <circle cx="12" cy="8" r=".9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconLogout = (p) => (
  <svg {...svgProps(p)}>
    <path d="M15 5.5h3A1.5 1.5 0 0 1 19.5 7v10A1.5 1.5 0 0 1 18 18.5h-3" />
    <path d="m11 8.5 3.5 3.5L11 15.5" />
    <path d="M14.5 12h-10" />
  </svg>
);
