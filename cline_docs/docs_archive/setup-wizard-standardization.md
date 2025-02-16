# Setup Wizard Standardization Plan

## Current State Analysis

### Pages 1-2 (Target Design)
- Clean, modern menu bubble design
- Horizontal layout with pill-shaped buttons
- Simple state management (active/inactive)
- Consistent font usage (Roboto)
- Material Design color scheme

### Pages 3-6 (To Be Updated)
- Circle-based numbered steps
- Connecting lines between steps
- Different font family
- More complex state visualization
- Inconsistent with pages 1-2

## Standardization Requirements

### CSS Standardization
```css
/* Core stepper styles to be applied across all pages */
.stepper {
    display: flex;
    justify-content: space-between;
    margin: 2rem 0;
    padding: 0 1rem;
}

.step {
    background: #e0e0e0;
    color: #666;
    padding: 0.5rem 1.5rem;
    border-radius: 100px;
    font-size: 0.875rem;
    font-weight: 500;
}

.step.active {
    background: #1976d2;
    color: white;
}

.step.completed {
    background: #4caf50;
    color: white;
}
```

### HTML Structure Standardization
```html
<div class="stepper">
    <span class="step [active/completed]">Step Name</span>
    <!-- Repeat for each step -->
</div>
```

## Implementation Steps

1. For each page (3-6):
   - Remove existing stepper styles
   - Remove circle and line-based design
   - Implement standardized CSS
   - Update HTML structure
   - Maintain state management
   - Standardize fonts to Roboto

2. Specific Changes Needed:
   - Remove `.stepper::before` (connecting line)
   - Remove `.step-circle` elements
   - Convert numbered indicators to text-based steps
   - Standardize spacing and margins
   - Update color scheme to match pages 1-2

3. Font Standardization:
   - Add Roboto font import to all pages
   - Update font-family declarations
   - Ensure consistent font weights

4. Color Scheme Standardization:
   - Active: #1976d2 (blue)
   - Inactive: #e0e0e0 (gray)
   - Completed: #4caf50 (green)
   - Text: #666 (inactive), white (active/completed)

## Testing Checklist

- [ ] Verify consistent appearance across all pages
- [ ] Check state transitions (active/completed)
- [ ] Validate responsive behavior
- [ ] Ensure proper spacing and alignment
- [ ] Confirm font consistency
- [ ] Test navigation between pages

## Files to Update

1. preview-step3.html
2. preview-step4.html
3. preview-step5.html
4. preview-step6.html

Each file will need CSS and HTML structure updates to match the target design from pages 1-2.