# Semaine des Langues - Design System

## Overview
A comprehensive design system for the Semaine des Langues language learning platform built with React and Tailwind CSS.

## Color Palette

### Primary Colors
- **Primary Blue (Dark)**: `#1e3a8a` - Used for headings and primary text
- **Primary Blue (Medium)**: `#2563eb` - Used for buttons and interactive elements
- **Primary Blue (Light)**: `#eff6ff` - Used for backgrounds and light accents

### Semantic Colors
- **Success Green**: `#16a34a` (hover: `#15803d`) - Positive feedback, success states
- **Error Red**: `#dc2626` (hover: `#b91c1c`) - Error messages, destructive actions
- **Warning Orange**: `#ea580c` (hover: `#c2410c`) - Warning states, caution messages

### Neutral Colors
- **Gray 50**: `#f9fafb` - Lightest backgrounds
- **Gray 100**: `#f3f4f6` - Light backgrounds, subtle borders
- **Gray 200**: `#e5e7eb` - Medium borders, dividers
- **Gray 300**: `#d1d5db` - Darker borders
- **Gray 600**: `#4b5563` - Secondary text
- **Gray 900**: `#111827` - Primary text, dark backgrounds

## Typography

### Font Families
- **Default**: Inter, system-ui, -apple-system, sans-serif
- **Monospace**: Courier New (for numeric displays like scores)

### Font Sizes
- **h1**: 2rem (32px) - Page titles
- **h2**: 1.5rem (24px) - Section headers
- **h3**: 1.25rem (20px) - Subsection headers
- **Body**: 1rem (16px) - Regular text
- **Small**: 0.875rem (14px) - Secondary text, labels
- **Tiny**: 0.75rem (12px) - Captions, badges

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Components

### Buttons
All buttons have:
- Minimum height: 44px (mobile accessibility)
- Minimum width: 48px
- Rounded corners: 8px
- Smooth transitions: 0.3s ease
- Box shadow on hover for depth

#### Button Variants
- **Primary**: Blue gradient background, white text
- **Secondary**: Gray background, dark text
- **Success**: Green gradient background, white text
- **Error**: Red gradient background, white text

### Cards
- White background
- 2px border (usually `#dbeafe` for primary)
- 12px border radius
- Subtle box shadow: `0 2px 8px rgba(37, 99, 235, 0.08)`
- Hover state: increased shadow and border color change

### Forms
- Input fields: 12px padding, 2px border
- Focus state: blue border + light blue outline shadow
- Font size: 16px (prevents mobile zoom)
- Rounded corners: 8px

### Score Displays
- Gradient backgrounds (e.g., `linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)`)
- Bold borders in semantic color
- Large numeric values in monospace font
- Hover animation: translateY(-4px)

### Messages
- **Success**: `#dcfce7` background, `#16a34a` border
- **Error**: `#fee2e2` background, `#dc2626` border
- **Info**: `#eff6ff` background, `#2563eb` border
- All with left border accent: 4px

## Spacing Scale

- **4px**: `gap-1`, fine-grain spacing
- **8px**: `gap-2`, tight spacing
- **12px**: `gap-3`, regular spacing
- **16px**: `gap-4`, comfortable spacing
- **20px**: medium padding/spacing
- **24px**: `gap-6`, generous spacing
- **32px**: `gap-8`, large spacing
- **40px**: large section padding

## Responsive Breakpoints

### Mobile First Approach
- **Mobile**: Default (< 480px)
- **Tablet**: 480px - 768px
- **Desktop**: 768px+

### Key Changes
- **Font sizes**: Reduce by 10-20% on mobile
- **Grid**: Single column on mobile, then responsive on tablet+
- **Padding/Margin**: Reduce by 25-50% on mobile (12-16px instead of 20-24px)
- **Button height**: 40px minimum on very small screens

## Shadows

### Elevation System
- **Subtle**: `0 1px 3px rgba(0, 0, 0, 0.1)`
- **Small**: `0 2px 8px rgba(37, 99, 235, 0.08)`
- **Medium**: `0 4px 12px rgba(37, 99, 235, 0.2)`
- **Large**: `0 4px 16px rgba(22, 163, 74, 0.12)`
- **Extra Large**: `0 12px 32px rgba(30, 58, 138, 0.25)`

## Animations

### Transitions
- Standard: `0.2s ease` (quick interactions)
- Form: `0.3s ease` (smoothly entering/exiting focus states)
- Hover: `0.2s ease` (responsive to mouse movement)

### Keyframe Animations
- **pulse**: 1.5s, breathing effect for recording indicator
- **spin**: 1s linear, loading spinner
- **slideIn**: 0.3s ease, smooth element appearance

## Accessibility Features

- **Focus Indicators**: 2px solid outline with 2px offset
- **Color Contrast**: All text meets WCAG AA standards
- **Touch Targets**: Minimum 44px x 44px on mobile
- **Font Sizing**: 16px for inputs to prevent mobile zoom
- **Semantic HTML**: Proper heading hierarchy, form labels
- **Motion**: Respects `prefers-reduced-motion` (optional)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari 12+
- Android Chrome
- IE 11 not supported (no custom properties fallback)

## File Structure

```
frontend/src/styles/
├── globals.css          # Global variables, resets, utility classes
├── App.css             # App layout and routing styles
├── UserSession.css     # User practice session page
├── AudioRecorder.css   # Audio recording component
├── AdminDashboard.css  # Admin dashboard layout
├── AdminLogin.css      # Admin login page
├── SessionManager.css  # Session management panel
└── AnalyticsDashboard.css # Analytics visualization
```

## Migration Guide

When updating existing styles:

1. Replace color variables:
   - `var(--primary-blue)` → `#1e3a8a`
   - `var(--medium-blue)` → `#2563eb`
   - `var(--light-blue)` → `#dbeafe`
   - `var(--light-gray)` → `#f3f4f6`

2. Update shadows with proper elevation level

3. Ensure 12px border radius on all cards (was 8px)

4. Add gradient backgrounds to primary buttons

5. Implement improved hover/active states with transforms

## Future Enhancements

- [ ] Dark mode prefers-color-scheme support
- [ ] CSS-in-JS for component isolation (styled-components)
- [ ] Tailwind CSS integration for utility classes
- [ ] Storybook component documentation
- [ ] Font size scaling system
- [ ] Improved animation performance with GPU acceleration

## Notes

- All colors are hex format for maximum compatibility
- Spacing uses pixel units (no REM conversion needed)
- Border radius is consistent at 8px and 12px
- Focus states include both border color change AND box shadow
- Gradients use 135deg angle for modern, diagonal appearance
