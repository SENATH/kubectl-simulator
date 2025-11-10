# Kubectl Web Terminal Simulator - Design Guidelines

## Design Approach
**Selected Approach:** Design System + Terminal UI Patterns
**Justification:** Developer tool requiring clarity, efficiency, and familiar terminal experience
**References:** VS Code integrated terminal, iTerm2, GitHub CLI interfaces

## Core Design Principles
1. **Clarity First:** Information must be scannable and easy to parse
2. **Terminal Authenticity:** Maintain familiar CLI conventions
3. **Focused Experience:** Minimize chrome, maximize terminal space
4. **Professional Polish:** Clean, modern interface that inspires confidence

---

## Typography System

### Font Families
- **Terminal/Code:** `'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace`
- **UI Elements:** `'Inter', -apple-system, system-ui, sans-serif`

### Terminal Text Hierarchy
- **Command Input:** text-base (16px), font-medium
- **Command Output:** text-sm (14px), font-normal
- **Prompt Prefix:** text-base (16px), font-semibold
- **Help Text:** text-xs (12px), font-normal

### UI Text Hierarchy
- **Page Title:** text-2xl (24px), font-bold
- **Section Headers:** text-lg (18px), font-semibold
- **Labels:** text-sm (14px), font-medium
- **Body Text:** text-base (16px), font-normal

---

## Layout System

### Spacing Primitives
**Core Units:** Use Tailwind spacing of **2, 4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: space-y-4, space-y-6
- Inline spacing: gap-2, gap-4

### Application Structure
```
┌─────────────────────────────────────────┐
│ Header (h-16)                            │
├─────────────────────────────────────────┤
│                                          │
│ Terminal Container (flex-1)             │
│ - max-w-7xl mx-auto                     │
│ - px-4 py-8                             │
│                                          │
└─────────────────────────────────────────┘
```

### Terminal Container Layout
- **Full viewport height:** Use `h-[calc(100vh-4rem)]` for terminal area
- **Maximum width:** max-w-7xl centered
- **Border radius:** rounded-lg for modern feel
- **Shadow:** Use shadow-2xl for depth

---

## Component Library

### 1. Header Component
**Structure:**
- Fixed height: h-16
- Horizontal layout with logo/title left, metadata right
- Border bottom for separation
- Padding: px-6

**Elements:**
- Application title + Kubernetes icon
- Cluster status indicator (e.g., "3 nodes ready")
- Optional: Quick help button

### 2. Terminal Window
**Container:**
- Rounded corners: rounded-lg
- Shadow for depth: shadow-2xl
- Minimum height: min-h-[600px]
- Overflow handling: overflow-y-auto

**Terminal Header Bar:**
- Height: h-10
- Traffic light controls (decorative)
- Session info: "kubectl@k8s-cluster"
- Border bottom

**Terminal Body:**
- Padding: p-6
- Line height: leading-relaxed (1.625)
- Scrollable: overflow-y-auto with custom scrollbar

### 3. Command Line Interface

**Prompt Line:**
```
[user@k8s-cluster ~]$ <cursor>
```
- Prompt symbol spacing: gap-2
- Input field: Transparent background, full width
- Focus state: Outline removed, cursor visible

**Command History:**
- Each command block: mb-6
- Command display: Distinguish input vs output
- Output formatting: Preserve whitespace, monospace

**Output Formatting:**
- **Table outputs:** Use grid layout with borders
- **JSON/YAML:** Syntax highlighting via classes
- **Error messages:** Distinct treatment

### 4. Sidebar Panel (Optional)
**Placement:** Right side or collapsible
**Width:** w-80
**Contents:**
- Quick command reference
- Cluster resource overview
- Command history list

### 5. Status Indicators
**Node Status:**
- Ready/NotReady badges
- Compact design: px-2 py-1, rounded-full
- Icons + text

**Resource Counters:**
- Grid layout: grid-cols-3 gap-4
- Each counter: Text center aligned
- Number prominent, label secondary

---

## Information Hierarchy

### Terminal Content Priority
1. **Current command input** (most prominent)
2. **Recent command output** (immediate context)
3. **Command history** (scrollable context)
4. **Helper UI** (minimal, non-intrusive)

### Visual Weight Distribution
- **80%:** Terminal display area
- **15%:** Supporting UI (header, status)
- **5%:** Helper elements (tips, shortcuts)

---

## Interaction Patterns

### Command Input
- Auto-focus on terminal click
- Command history navigation: Up/Down arrows
- Tab completion hints (subtle)
- Enter to execute

### Command Execution Feedback
- Immediate: Show command in history
- Processing: Optional subtle indicator
- Complete: Display output with slight delay for realism

### Scrolling Behavior
- Auto-scroll to bottom on new output
- Preserve scroll position during reading
- Smooth scroll animation: scroll-smooth

---

## Responsive Behavior

### Desktop (≥1024px)
- Full layout with optional sidebar
- max-w-7xl container
- Comfortable padding: p-8

### Tablet (768px - 1023px)
- Collapsed sidebar or bottom sheet
- Reduced padding: p-6
- Terminal maintains prominence

### Mobile (< 768px)
- Full-width terminal (px-4)
- Header collapses to minimal
- Focus entirely on terminal
- Virtual keyboard considerations

---

## Accessibility Standards

### Keyboard Navigation
- Tab order: Header → Terminal input → Sidebar
- Escape to clear input
- Ctrl+C to interrupt (visual only)
- Ctrl+L to clear terminal

### Screen Readers
- Command history: Proper ARIA labels
- Live region for new output
- Status announcements

### Focus Management
- Visible focus indicators
- Return focus to input after command
- Skip links for navigation

---

## Content Strategy

### Welcome Message
Display on initial load:
- Cluster information (3 nodes)
- kubectl version
- Quick start commands
- Help command reference

### Empty States
- New terminal: Welcome message
- No resources: Helpful creation hints
- Error states: Suggested corrections

### Command Help
- Inline suggestions
- Error messages with examples
- Link to full kubectl documentation

---

## Performance Considerations

### Terminal Rendering
- Virtual scrolling for long outputs
- Limit history: Keep last 100 commands
- Lazy load syntax highlighting
- Debounce live command suggestions

### State Management
- Efficient cluster state updates
- Minimal re-renders
- Clear/reset functionality

---

## Special Features

### Syntax Highlighting
Apply subtle highlighting for:
- Command keywords (kubectl, get, describe)
- Resource types (pods, nodes, deployments)
- Flags (--namespace, -o yaml)
- Output data (READY, STATUS columns)

### Command Autocomplete
- Dropdown below input: absolute positioning
- Max height: max-h-64, overflow-y-auto
- Arrow navigation
- Subtle appearance

### Copy Functionality
- Copy output sections
- Copy full command history
- Visual feedback on copy

---

## Images
**No images required.** This is a terminal/CLI tool that relies on text-based interface. The authenticity comes from monospace typography and proper spacing, not imagery.