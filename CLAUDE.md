# Islamic School Website Project

## Project Overview
A beautiful, modern, and visually stunning website for an Islamic School with a complete Content Management System (CMS) for administrators to add, edit, and delete content.

## Technology Stack (Free Tier)
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom Islamic design elements
- **CMS**: Payload CMS (open source, self-hosted)
- **Database**: PostgreSQL (Vercel free tier)
- **Authentication**: NextAuth.js for admin authentication
- **Deployment**: Vercel (free tier)

## MCP Servers Integration
- **Web Search MCP Server**: Fetch Islamic events, prayer times, educational content
- **GitHub MCP Server**: Automated version control and deployment workflows
- **Headless CMS MCP Server**: Direct integration with Payload CMS operations

## Key Features

### Public Website
- Modern, responsive design with Islamic aesthetic
- Homepage with school overview and mission
- About Us section with school history and values
- Programs and curriculum information
- Faculty and staff profiles
- News and events section
- Contact information and location
- Islamic calendar integration
- Prayer times display
- Gallery for school activities
- Testimonials from parents and students

### Admin CMS Features
- Secure admin authentication
- Content management for all sections
- Image and media upload
- Event management
- News article creation and editing
- Staff profile management
- Student enrollment inquiries management
- Analytics dashboard

## Design Elements
- Arabic calligraphy and geometric patterns
- Islamic color palette (greens, golds, blues)
- Beautiful typography supporting Arabic and English
- Smooth animations and transitions
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1)

## Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## Project Structure
```
/
├── components/          # Reusable UI components
├── pages/              # Next.js pages
├── styles/             # Global styles and Tailwind config
├── lib/                # Utility functions and configurations
├── public/             # Static assets
├── sanity/             # Sanity CMS schema and configuration
├── types/              # TypeScript type definitions
├── HERO_SECTION_PATTERNS.md     # Hero section design patterns & code snippets
├── SECTION_TRANSFORMATION_PLAN.md # Master plan for all section transformations
├── PROGRAMS_SECTION_PATTERNS.md  # Programs section refinements (when created)
├── FACULTY_SECTION_PATTERNS.md   # Faculty section refinements (when created)
└── NEWS_SECTION_PATTERNS.md      # News section refinements (when created)
```

## Getting Started
1. Set up Sanity.io project
2. Configure environment variables
3. Install dependencies
4. Run development server
5. Access admin panel at /admin

## Environment Variables
```
NEXTAUTH_SECRET=
NEXTAUTH_URL=
DATABASE_URL=
PAYLOAD_SECRET=
```

## MCP Server Configuration
- Install MCP servers for enhanced functionality
- Configure web search for Islamic content
- Set up GitHub integration for deployment
- Connect headless CMS operations

## Design Documentation System

### Section Pattern Documentation
Each major section has its own pattern documentation file that captures:
- **Design refinements made**: All iterations and improvements
- **Technical patterns**: Reusable code snippets and components
- **Animation specifications**: Timing, easing, performance optimizations
- **Content strategy**: How to handle real vs placeholder content
- **Accessibility considerations**: Contrast ratios, keyboard navigation
- **Mobile responsiveness**: Breakpoint handling and touch interactions

### Current Documentation Files
- **`HERO_SECTION_PATTERNS.md`**: Completed - Multi-modal interface, video player, infinite scroll gallery
- **`SECTION_TRANSFORMATION_PLAN.md`**: Master roadmap for all section improvements
- **`PROGRAMS_SECTION_PATTERNS.md`**: To be created during Programs section transformation
- **`FACULTY_SECTION_PATTERNS.md`**: To be created during Faculty section transformation  
- **`NEWS_SECTION_PATTERNS.md`**: To be created during News section transformation

### Pattern Replication Strategy
1. **Reference existing patterns**: Check completed section docs for proven approaches
2. **Document new patterns**: Create section-specific MD file for each transformation
3. **Update master plan**: Keep SECTION_TRANSFORMATION_PLAN.md current with progress
4. **Code reusability**: Extract common components into shared utilities
5. **Cross-section consistency**: Apply same design principles across all sections

## Development Workflow (MANDATORY)

### For All Agents Working on This Project

When assigned any task, agents MUST follow this workflow:

#### 1. **Think Hardest**
- Analyze the request deeply
- Consider all implications and edge cases
- Research existing codebase patterns and conventions
- Identify potential challenges and solutions

#### 2. **Plan Exceptionally Well**
- Create comprehensive plan with clear objectives
- Identify all required components and dependencies
- Consider integration points with existing systems
- Assess risks and mitigation strategies
- Estimate time and complexity

#### 3. **Break Down to Implementation Steps**
- Create detailed, sequential implementation steps
- Define success criteria for each step
- Identify testing requirements
- Plan for error handling and edge cases
- Consider rollback strategies if needed

#### 4. **Get Review and Approval**
- Present the complete plan to the user
- Wait for explicit approval before proceeding
- Address any concerns or modifications requested
- Confirm understanding of requirements

#### 5. **Execute Implementation**
- Follow the approved plan methodically
- Use TodoWrite to track progress transparently
- Test each component thoroughly
- Document any deviations from the plan
- Communicate blockers immediately

### MCP Servers in Development Workflow

MCP servers enhance each step of our workflow:

#### Step 1 (Think Hardest) - Enhanced by MCP
- **Web Search MCP**: Research Islamic educational standards, prayer time APIs, best practices
- **GitHub MCP**: Analyze similar Islamic school websites and their implementations
- **Database MCP**: Query existing data patterns and optimization strategies

#### Step 2 (Plan Exceptionally Well) - Enhanced by MCP  
- **Web Search MCP**: Find relevant libraries, APIs, and resources
- **GitHub MCP**: Check for existing solutions and code patterns
- **Headless CMS MCP**: Plan content structures and management workflows

#### Step 3 (Break Down Implementation) - Enhanced by MCP
- **Database MCP**: Plan database schemas and relationships
- **GitHub MCP**: Structure version control and deployment pipelines
- **Web Search MCP**: Research implementation approaches for each step

#### Step 4 (Get Review) - Enhanced by MCP
- **GitHub MCP**: Create detailed issues and project boards for tracking
- **Documentation**: Auto-generate technical specifications using research

#### Step 5 (Execute Implementation) - Enhanced by MCP
- **Database MCP**: Streamlined database operations and queries
- **GitHub MCP**: Automated commits, PRs, and deployment workflows  
- **Web Search MCP**: Real-time data fetching (prayer times, Islamic events)
- **Headless CMS MCP**: Direct content management operations

### Additional Guidelines
- **Risk Assessment**: Always identify potential risks upfront
- **Timeline Estimates**: Provide realistic time estimates for each phase
- **Dependencies**: Map out all technical and resource dependencies
- **Testing Strategy**: Plan comprehensive testing approach
- **Documentation**: Maintain clear documentation throughout
- **Communication**: Keep stakeholders informed at each milestone
- **MCP Integration**: Leverage MCP servers to enhance research, planning, and implementation efficiency