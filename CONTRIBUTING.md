# Contributing to DPWH Material Testing System

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Workflow](#-development-workflow)
- [Coding Standards](#-coding-standards)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Testing](#-testing)
- [Documentation](#-documentation)

---

## 🤝 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all.

### Expected Behavior
- Be respectful and inclusive
- Welcome different viewpoints
- Focus on constructive feedback
- Report inappropriate behavior

### Unacceptable Behavior
- Harassment or discrimination
- Offensive language or behavior
- Disrespectful comments
- Publishing private information

---

## 🎯 How Can I Contribute?

### Report Bugs
Found a bug? Help us fix it!

1. **Check existing issues** - Maybe it's already reported
2. **Provide details:**
   - Browser and OS version
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots/error logs
3. **Create an issue** with detailed information

### Suggest Enhancements
Have an idea? We'd love to hear it!

1. **Describe the enhancement** with clear use case
2. **Explain benefits** - How does this help users?
3. **Provide examples** - Show mockups or workflow
4. **Note any concerns** - Performance impact, complexity

### Improve Documentation
Documentation needs love too!

- Fix typos or unclear explanations
- Add examples or guides
- Translate to other languages
- Improve code comments

### Submit Code Changes
Ready to code? Follow our process:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
5. Work with reviewers

---

## 💻 Development Workflow

### Step 1: Fork the Repository
```bash
# On GitHub, click "Fork" button
# Then clone your fork:
git clone https://github.com/YOUR-USERNAME/dpwh-material-testing.git
cd dpwh-material-testing
```

### Step 2: Create a Feature Branch
```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/bug-description
```

### Step 3: Setup Development Environment
```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Start dev server
npm start
```

### Step 4: Make Your Changes
```bash
# Edit files as needed
# Test your changes locally

# Stage changes
git add .

# Commit with meaningful message
git commit -m "Add: Feature description"

# Push to your fork
git push origin feature/your-feature-name
```

### Step 5: Create Pull Request
1. Go to GitHub
2. Click "Compare & pull request"
3. Describe your changes
4. Submit PR

---

## 📝 Coding Standards

### React Components

**Use Functional Components:**
```javascript
// ✅ Good
function UserManagement() {
  const [users, setUsers] = useState([]);
  
  return (
    <div>
      {/* Component code */}
    </div>
  );
}

// ❌ Avoid
class UserManagement extends React.Component {
  // Old class component syntax
}
```

**Use React Hooks:**
```javascript
// ✅ Good
const [data, setData] = useState(null);
useEffect(() => {
  fetchData();
}, []);

// ❌ Avoid
componentDidMount() {
  this.fetchData();
}
```

### Code Style

**Variable Naming:**
```javascript
// ✅ Good
const projectName = "Road Upgrade";
const handleUserCreate = () => {};
const isLoading = true;

// ❌ Avoid
const pn = "Road Upgrade";
const user_create = () => {};
const loading = true;
```

**Comments:**
```javascript
// ✅ Good - Explain WHY, not WHAT
// Fetch user data on component mount
useEffect(() => {
  fetchUsers();
}, []);

// ❌ Avoid - Obvious comments
// Set the users state
setUsers(data);
```

**Formatting:**
```javascript
// Use 2-space indentation
// Keep lines under 100 characters
// Add spacing between logical sections

if (condition) {
  doSomething();
}

return (
  <div>
    <Header />
    <Content />
  </div>
);
```

---

## 🔀 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style (formatting, semicolons)
- **refactor:** Code refactoring
- **perf:** Performance improvement
- **test:** Test changes
- **chore:** Build, dependencies, config

### Examples

```bash
# Good commits
git commit -m "feat(users): Add role selection dropdown"
git commit -m "fix(dashboard): Fix stats calculation error"
git commit -m "docs(readme): Update deployment instructions"
git commit -m "refactor(components): Simplify user form logic"

# Bad commits
git commit -m "fix stuff"
git commit -m "updated"
git commit -m "asdfghjkl"
```

### Commit Message Best Practices
- Use imperative mood: "Add feature" not "Added feature"
- Don't capitalize the first letter
- No period at the end
- Limit to 50 characters for subject line
- Reference issues: "Closes #123" or "Fixes #456"

---

## 🔄 Pull Request Process

### Before Submitting

1. **Test locally:**
   ```bash
   npm start          # Run dev server
   npm run build      # Test production build
   npm test           # Run tests
   ```

2. **Check code quality:**
   - No console errors
   - No console.log statements left
   - Consistent formatting
   - Meaningful variable names

3. **Update documentation:**
   - README if needed
   - Code comments for complex logic
   - Update CHANGELOG if applicable

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
Describe how you tested this change:
- [ ] Tested in development
- [ ] Manual testing steps: ...
- [ ] Added unit tests

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass
```

### Review Process

1. **Automated Checks:**
   - Build passes
   - Tests pass
   - No security issues

2. **Code Review:**
   - At least one maintainer review
   - Address feedback comments
   - Respond to suggestions

3. **Approval & Merge:**
   - Get approval from maintainer
   - PR is squashed and merged
   - Feature branch deleted

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Write Tests
Place tests next to the component:
```
src/
├── DPWH_Admin_Panel.jsx
├── DPWH_Admin_Panel.test.jsx  ← Test file
└── ...
```

### Test Template
```javascript
import { render, screen } from '@testing-library/react';
import DPWHAdminPanel from './DPWH_Admin_Panel';

describe('DPWH Admin Panel', () => {
  test('renders login page', () => {
    render(<DPWHAdminPanel />);
    const loginButton = screen.getByText(/login/i);
    expect(loginButton).toBeInTheDocument();
  });

  test('shows error on invalid credentials', () => {
    // Test implementation
  });
});
```

---

## 📚 Documentation

### Update README
If adding features, update `README.md`:
- Add to features list
- Include usage example
- Document new configuration

### Code Comments
Add comments for:
- Complex algorithms
- Non-obvious logic
- Important business rules

```javascript
// ✅ Good comment
// Fetch fresh project data to ensure latest status
const fetchProjects = async () => {
  const { data } = await supabase
    .from('projects')
    .select('*');
  setProjects(data);
};
```

### Documentation Files
Maintain these files:
- `README.md` - Main guide
- `QUICK_START.md` - Fast setup
- `CONTRIBUTING.md` - This file
- Code comments in complex components

---

## 🚀 Getting Help

### Questions?
- Check existing documentation
- Search GitHub issues
- Create a new discussion

### Need to Discuss?
Before large changes:
1. Open a GitHub issue
2. Describe proposed change
3. Get feedback from maintainers
4. Then start coding

---

## 📊 Development Tips

### Useful Commands
```bash
# Development
npm start              # Start dev server
npm test              # Run tests
npm run build         # Build for production

# Git workflow
git status            # Check changed files
git diff              # View changes
git log --oneline     # View commit history

# Code quality
npm run lint          # Lint code (if available)
npm run format        # Format code (if available)
```

### Common Pitfalls
- ❌ Committing `.env.local` file
- ❌ Leaving console.log statements
- ❌ Not testing locally before PR
- ❌ Making unrelated changes
- ❌ Poor commit messages

### Best Practices
- ✅ Small, focused commits
- ✅ Clear commit messages
- ✅ Test locally first
- ✅ One feature per PR
- ✅ Keep PRs reasonably sized

---

## 🎓 Learning Resources

### React
- [React Documentation](https://react.dev)
- [Hooks Guide](https://react.dev/reference/react)
- [React Patterns](https://react-patterns.com)

### Supabase
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Guide](https://www.postgresql.org/docs/)

### Development Tools
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com)
- [VS Code Tips](https://code.visualstudio.com/docs)

---

## 🙏 Thank You!

Your contributions help make this project better for everyone. We appreciate your effort and enthusiasm!

---

**Happy Contributing!** 🎉

For questions, please open an issue or discussion on GitHub.
