# Project Context & Session Continuity Guide

## 🎯 Quick Start for New Chat Sessions

### Current Project Status (Last Updated: 2025-01-12)
- **Project**: Islamic School Website (OIA Academy Edmonton) - Award-winning transformation
- **Technology**: Next.js 15.4.6, TypeScript, Tailwind CSS 4, Framer Motion
- **Current Phase**: Hero Section Complete ✅ → Programs Section Next 🎯

### Immediate Context
```
COMPLETED: Hero section with multi-modal interface (video + gallery + achievements)
WORKING ON: Ready to start Programs section transformation
NEXT STEPS: Apply Hero patterns to Programs section design
```

## 📋 Master Documentation Index

### Design Pattern Files (Read These First!)
1. **`HERO_SECTION_PATTERNS.md`** - Complete patterns library (MUST READ)
2. **`SECTION_TRANSFORMATION_PLAN.md`** - Master roadmap for all sections
3. **`PROJECT_CONTEXT.md`** - This file (session continuity guide)
4. **`CLAUDE.md`** - Original project instructions and workflow

### Section-Specific Documentation (Created As We Go)
- **`PROGRAMS_SECTION_PATTERNS.md`** - Next to create
- **`FACULTY_SECTION_PATTERNS.md`** - Future
- **`NEWS_SECTION_PATTERNS.md`** - Future

## 🎨 Core Design Philosophy (Never Compromise On)

### The "Contrast-First" Rule
- **ALWAYS**: Ensure excellent text readability before any visual effects
- **Dark overlays**: black/70-80 for text over images
- **WCAG AA compliance**: Minimum contrast ratio 4.5:1
- **Test first**: Check readability on mobile before proceeding

### The "Images as Stars" Principle
- **Images should be prominent**, not background elements
- **Minimal overlays**: 5-10% opacity, never more
- **Enhancement**: brightness-100 contrast-105 saturate-110
- **Text**: Only appears on hover with subtle dark overlay

### The "Gentle Movement" Standard
- **2-minute animation cycles** for comfortable viewing
- **300ms hover interactions** with easeOut
- **1.03x scale** on hover (subtle, not jarring)
- **Linear easing** for infinite scrolls, easeOut for interactions

## 🔧 Technical Standards (Established Patterns)

### Animation Performance
```css
/* ALWAYS include for smooth animations */
willChange: 'transform'
backfaceVisibility: 'hidden'
```

### Hover Pattern
```typescript
whileHover={{ 
  scale: 1.03,
  zIndex: 30,
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  transition: { duration: 0.3, ease: "easeOut" }
}}
```

### Filter System Pattern
```typescript
const filters = [
  { key: 'all', label: 'All Items', count: items.length },
  // Add categories with live counts
]
```

### Grid System Pattern
```typescript
// Dynamic spans for visual interest
const widthSpan = cycleOffset % 7 === 0 ? 2 : 1
const heightSpan = cycleOffset % 5 === 0 ? 2 : 1
```

## 🎯 Current Section Status

### ✅ Hero Section (100% Complete)
**What We Built:**
- Multi-modal interface: Default + Video + Gallery modes
- Advanced video player with 3 videos, navigation, controls
- Infinite scroll gallery with dynamic grid spans
- Filter system with live counts
- Premium animations (2-minute cycles)
- Real content integration (new-center images)

**Key Patterns Established:**
- Video navigation with titles and chevron separators
- Dynamic grid system with varying spans that change per cycle
- Gentle infinite scroll without resets
- Professional control bars with backdrop blur
- Hover interactions with scale and shadow

### ✅ About Section (Previously Enhanced)
- Timeline with achievements
- Statistics showcase
- Mission statement with animations
- Already applying Hero section principles

### 🎯 Programs Section (Next Priority)
**Planned Features:**
- Multi-modal: Overview + Interactive Explorer + Student Gallery
- Filter by grade level, subject, program type
- Student work showcase using gallery patterns
- Interactive curriculum map
- Teacher spotlight integration

## 🚀 Session Startup Checklist

### For ANY New Chat Session:
1. **Read `PROJECT_CONTEXT.md`** (this file) first
2. **Check latest section pattern file** for current work
3. **Review `SECTION_TRANSFORMATION_PLAN.md`** for roadmap
4. **Look at current component** to understand existing code
5. **Apply established patterns** from completed sections

### Quick Context Commands:
```bash
# Check current development status
npm run dev

# See project structure
ls -la

# Check current component
cat src/components/Programs.tsx  # (or current section)

# Review latest patterns
cat HERO_SECTION_PATTERNS.md
```

## 📝 Decision Log (Critical Lessons)

### Hero Section Lessons (Apply to All Future Sections)
1. **User rejected trendy 3D effects** - Focus on fundamentals over trends
2. **Poor contrast is "rookie mistake"** - Always prioritize readability
3. **Overlapping images create gaps** - Use efficient grid layouts instead
4. **Fast animations are jarring** - 2-minute cycles are optimal
5. **Text should be subtle** - Images are the stars, text supports

### Technical Lessons
1. **Use real images** from `/uploads/images/` folders
2. **Triple repetition** needed for smooth infinite scroll
3. **willChange and backfaceVisibility** prevent animation stutters
4. **Filter systems need live counts** for better UX
5. **Grid spans should vary dynamically** for visual interest

### Content Strategy Lessons
1. **Specific over generic** - "98% University Acceptance" vs "High Success Rate"
2. **Named institutions** - "U of A, UBC, McGill" adds credibility
3. **Current projects** - "$5M New Centre" shows progress
4. **Real dates** - Actual achievement dates build trust

## 🔄 Pattern Evolution Tracking

### Hero Section Pattern Maturity
- **V1**: Basic text over image
- **V2**: Added video functionality  
- **V3**: Multi-modal interface
- **V4**: Advanced gallery with infinite scroll
- **V5**: Dynamic grid spans with cycle changes
- **FINAL**: Optimized animations, perfect contrast, real content

### Reusable Components Created
- **Filter System**: Category filtering with live counts
- **Gallery Grid**: Dynamic spans with infinite scroll
- **Video Player**: Multi-video navigation with controls
- **Animation Utils**: Hover patterns, timing constants
- **Typography Scale**: Display fonts and hierarchy

## 📊 Quality Benchmarks (Never Lower These)

### Design Quality
- [ ] WCAG AA contrast compliance
- [ ] 60fps smooth animations
- [ ] Mobile-first responsive design
- [ ] Professional typography hierarchy
- [ ] Islamic design language consistency

### User Experience
- [ ] 2-second hover response time
- [ ] Intuitive navigation patterns
- [ ] Comfortable viewing (2+ minute cycles)
- [ ] Clear content organization
- [ ] Accessible keyboard navigation

### Technical Performance
- [ ] Clean, maintainable code
- [ ] Reusable component patterns
- [ ] Optimized for 60fps performance
- [ ] SEO-friendly structure
- [ ] Admin panel integration ready

## 🎭 Development Personality & Approach

### Communication Style
- **Concise and direct** - Minimize explanation unless asked
- **Focus on results** - Show, don't just tell
- **Quality over speed** - Take time to do it right
- **User feedback priority** - Always address user concerns first

### Problem-Solving Approach
1. **Understand the real problem** (not just the surface issue)
2. **Apply established patterns** before creating new ones
3. **Test contrast and readability** before visual effects
4. **Document decisions** for future reference
5. **Get user approval** before implementing complex changes

## 🔮 Future Context Notes

### When Starting Programs Section:
- Reference Hero gallery patterns for student work showcase
- Apply video player patterns for program demonstrations
- Use filter system for grade levels and subjects
- Maintain 2-minute animation cycles
- Ensure excellent contrast throughout

### When Starting Faculty Section:
- Apply gallery hover patterns to faculty cards
- Use filter system for subject/language/experience
- Implement contact integration following CTA button patterns
- Create achievement showcases using carousel patterns

### Session Handoff Protocol:
1. **Update this file** when completing major work
2. **Create/update section pattern file** for current work
3. **Update todo list** with current status
4. **Commit changes** with descriptive messages
5. **Note any user feedback** for future reference

This system ensures that context, lessons, and patterns persist seamlessly across unlimited chat sessions, maintaining project momentum and quality standards regardless of session boundaries.