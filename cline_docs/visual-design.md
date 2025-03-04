Below is a concise, integrated set of instructions for your visual design coding agent. These guidelines unify the minimalist principles (inspired by Apple, Braun, and Dieter Rams) with your specific color palette, typography rules, and layout recommendations.

---

## 1. Core Minimalist Philosophy

1. **Show Only Essentials**  
   - Limit interface elements to those necessary for the user’s current task (PDF conversion, image parsing, data extraction).  
   - Keep decorative or non-functional visuals to an absolute minimum.

2. **Focus on Clarity & Utility**  
   - Prioritize legibility and intuitive controls.  
   - Provide clear, immediate feedback (e.g., status indicators, progress bars) with minimal on-screen clutter.

3. **Consistency & Predictability**  
   - Apply the same colors, typography, and component styles across all screens to maintain a cohesive experience.  
   - Ensure buttons, icons, and forms behave in a predictable, standard way.

---

## 2. Color Palette & Usage

### Primary Accent Colors
- **Pantone Blue 2995 C**: `#00AEEF`  
- **Pantone Green 3395 C**: `#00B398`  
- **Pantone Yellow 012 C**: `#FFD700`  
- **Pantone Warm Red C**: `#F93822`

**Instruction:** Use these accent colors sparingly for call-to-action elements (e.g., main buttons), hover states, or icons that require immediate user attention.

### Neutral Backgrounds
- **Primary Background**: `#F5F5F5`  
- **Secondary Background**: `#CCCCCC` at 10% opacity  

**Instruction:**  
- Employ `#F5F5F5` for the main interface background to maintain a clean, modern look.  
- Use the slightly tinted grey (`#CCCCCC` at 10% opacity) for subtler panels or secondary sections to create unobtrusive layering.

### Black & Greyscale
- **Black**: `#000000`  
- **Greys**: `#333333`, `#666666`, `#999999`, `#CCCCCC`, `#FFFFFF`  

**Instruction:**  
- Use greys for shadows, dividers, or text that doesn’t need high prominence.  
- Maintain sufficient contrast for readability and accessibility (e.g., black/white text on contrasting backgrounds).

---

## 3. Typography & Hierarchy

### Font
- **Sans-serif, Geometric** (e.g., SF Pro, Roboto, or similar)

### Usage
1. **Uppercase** for primary titles and headers to create a strong visual hierarchy.  
2. **Lowercase** for body text, secondary labels, and user instructions to maintain readability.

**Instruction:**  
- Limit your type sizes to no more than three tiers: large for headers (uppercase), medium for subheads, and standard for body text.  
- Maintain consistent spacing (line height, letter spacing) across all components for a streamlined look.

---

## 4. Layout & Spacing

1. **Grid-Based Structure**  
   - Align elements on a grid to provide a uniform, orderly layout.  
   - Ensure consistent margins and gutters throughout.

2. **Ample White Space**  
   - Surround key elements (buttons, input fields) with enough negative space to accentuate their importance.  
   - Avoid cramming too many controls in one area; consider a progressive disclosure approach (e.g., collapsing advanced settings).

3. **Clear Visual Hierarchy**  
   - Place the most critical actions or information (e.g., “Convert PDF”) at eye level and in a prominent spot.  
   - Use secondary backgrounds or subtle greys to group related content without overwhelming the screen.

---

## 5. Interaction & Feedback

1. **Minimal Clicks/Taps**  
   - Design the user flow so that common tasks (PDF conversion or image parsing) require as few steps as possible.  
   - Provide direct, easily recognized buttons for core actions (e.g., “Upload PDF,” “Start Parsing”).

2. **Use Accent Colors for Feedback**  
   - Highlight buttons or links in an accent color when hovered or pressed.  
   - Show progress or success/error states with subtle color indicators or concise messages.

3. **Non-Intrusive Notifications**  
   - Rely on banners or brief toast messages for status updates.  
   - Keep alerts succinct, appearing in a consistent location on screen, and disappearing after a short duration if no user action is required.

---

## 6. Accessibility & Consistency

1. **Contrast & Legibility**  
   - Adhere to WCAG guidelines for sufficient text contrast.  
   - Ensure tap areas meet a minimum of 44×44 px for touch targets on mobile.

2. **Consistent Component Design**  
   - Buttons, input fields, toggles, and icons should maintain the same line weight, shape, and color rules throughout the app.  
   - Apply the same corner radius and spacing for all interactive elements to build familiarity.

3. **Scalable Text**  
   - Enable dynamic text sizing where possible so users can adjust for better readability.

---

## 7. Implementation & Iteration

1. **Prototype & Test Early**  
   - Create wireframes or clickable prototypes to verify user flow and screen layout before refining visuals.  
   - Gather feedback from test users to confirm clarity and ease of use.

2. **Refine & Simplify**  
   - Continuously remove or condense any elements that do not directly aid in PDF-to-text conversion, image parsing, or data extraction.  
   - Keep push notifications, icons, and decorative flourishes to the minimum needed for clarity.

3. **Ensure Global Consistency**  
   - Document each component style (buttons, form fields, notifications) with corresponding colors, typography rules, and spacing.  
   - Apply these standards to every screen to avoid fragmented design.

---