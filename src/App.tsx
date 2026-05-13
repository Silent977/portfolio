import { useEffect, useState } from 'react';

// Encoded credentials (base64)
// username: admin | password: password123
const ENCODED_USERNAME = 'YWRtaW4=';
const ENCODED_PASSWORD = 'cGFzc3dvcmQxMjM=';

// Decode function
const decodeCredential = (encoded: string): string => {
  try {
    return atob(encoded);
  } catch {
    return '';
  }
};

// Project type
interface Project {
  id: string;
  name: string;
  genre: string;
  info: string;
  link: string;
  imageGradient: string;
  screenshotUrl?: string;
}

const PROJECTS_STORAGE_KEY = 'portfolio-projects';

const defaultProjects: Project[] = [
  {
    id: '1',
    name: 'Quality Assurance',
    genre: 'Testing',
    info: 'Automated testing framework',
    link: 'https://example.com',
    imageGradient: 'from-neutral-700 to-neutral-800',
  },
  {
    id: '2',
    name: 'Brand Identity',
    genre: 'Design',
    info: 'UI/UX design',
    link: 'https://example.com',
    imageGradient: 'from-neutral-600 to-neutral-800',
  },
  {
    id: '3',
    name: 'AI Generator',
    genre: 'AI',
    info: 'Machine learning',
    link: 'https://example.com',
    imageGradient: 'from-neutral-800 to-neutral-900',
  },
  {
    id: '4',
    name: 'E-commerce',
    genre: 'Design',
    info: 'Experience redesign',
    link: 'https://example.com',
    imageGradient: 'from-neutral-500 to-neutral-700',
  },
  {
    id: '5',
    name: 'Testing Suite',
    genre: 'Testing',
    info: 'Load & stress tools',
    link: 'https://example.com',
    imageGradient: 'from-neutral-700 to-neutral-900',
  },
  {
    id: '6',
    name: 'Smart Dashboard',
    genre: 'AI',
    info: 'AI analytics',
    link: 'https://example.com',
    imageGradient: 'from-neutral-600 to-neutral-800',
  },
];

const loadProjects = (): Project[] => {
  try {
    const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!savedProjects) {
      return defaultProjects;
    }

    const parsedProjects = JSON.parse(savedProjects);
    return Array.isArray(parsedProjects) ? parsedProjects : defaultProjects;
  } catch {
    return defaultProjects;
  }
};

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectGenre, setProjectGenre] = useState('');
  const [projectInfo, setProjectInfo] = useState('');
  const [projectLink, setProjectLink] = useState('');

  const validUsername = decodeCredential(ENCODED_USERNAME);
  const validPassword = decodeCredential(ENCODED_PASSWORD);

  const [projects, setProjects] = useState<Project[]>(loadProjects);

  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  // Get screenshot URL from the project link
  const getScreenshotUrl = (url: string): string => {
    const encodedUrl = encodeURIComponent(url);
    return `https://api.microlink.io/?url=${encodedUrl}&screenshot=true&meta=false&embed=screenshot.url`;
  };

  // Generate screenshot URL for new projects
  const addScreenshotUrlToProject = (project: Project): Project => {
    if (project.link) {
      return { ...project, screenshotUrl: getScreenshotUrl(project.link) };
    }
    return project;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (email === validUsername && password === validPassword) {
      setIsLoggedIn(true);
      setShowLogin(false);
      setEmail('');
      setPassword('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName,
      genre: projectGenre,
      info: projectInfo,
      link: projectLink,
      imageGradient: 'from-neutral-700 to-neutral-800',
    };

    // Add screenshot URL if link exists
    const projectWithScreenshot = addScreenshotUrlToProject(newProject);
    setProjects([...projects, projectWithScreenshot]);
    alert('Project added successfully!');
    
    setShowAddProject(false);
    setProjectName('');
    setProjectGenre('');
    setProjectInfo('');
    setProjectLink('');
  };

  const handleEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      const updatedProjects = projects.map(p => {
        if (p.id === editingProject.id) {
          const updated: Project = { 
            ...p, 
            name: projectName, 
            genre: projectGenre, 
            info: projectInfo, 
            link: projectLink 
          };
          // Update screenshot URL if link changed
          return addScreenshotUrlToProject(updated);
        }
        return p;
      });
      setProjects(updatedProjects);
      alert('Project updated successfully!');
    }
    
    setShowEditProject(false);
    setEditingProject(null);
    setProjectName('');
    setProjectGenre('');
    setProjectInfo('');
    setProjectLink('');
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
      alert('Project deleted successfully!');
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectGenre(project.genre);
    setProjectInfo(project.info);
    setProjectLink(project.link);
    setShowEditProject(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    e.currentTarget.parentElement?.classList.add('bg-gradient-to-br');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* Background with subtle pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowLogin(false)}
          ></div>
          <div className="relative bg-neutral-800 border border-neutral-700 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl mx-4">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-light text-neutral-100 mb-2">Welcome Back</h3>
                <p className="text-sm text-neutral-500">Sign in to access your dashboard</p>
              </div>

              {loginError && (
                <div className="bg-red-900/20 border border-red-800 text-red-400 text-sm px-4 py-2 rounded-lg">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Username</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter username"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded bg-neutral-900 border-neutral-700" />
                    <span className="text-neutral-500 text-xs md:text-sm">Remember me</span>
                  </label>
                  <a href="#" className="text-neutral-400 hover:text-neutral-200 transition-colors text-xs md:text-sm">Forgot password?</a>
                </div>
                <button
                  type="submit"
                  className="w-full bg-neutral-600 hover:bg-neutral-500 text-neutral-100 font-light py-3 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              </form>

              <div className="text-center">
                <p className="text-sm text-neutral-500">
                  Don't have an account?{' '}
                  <a href="#" className="text-neutral-400 hover:text-neutral-200 transition-colors">Sign up</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAddProject(false)}
          ></div>
          <div className="relative bg-neutral-800 border border-neutral-700 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl mx-4">
            <button
              onClick={() => setShowAddProject(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-light text-neutral-100 mb-2">Add New Project</h3>
                <p className="text-sm text-neutral-500">Fill in the details below</p>
              </div>

              <form onSubmit={handleAddProject} className="space-y-5">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    required
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Genre</label>
                  <input
                    type="text"
                    value={projectGenre}
                    onChange={(e) => setProjectGenre(e.target.value)}
                    placeholder="e.g., Testing, Design, AI"
                    required
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Project Info</label>
                  <textarea
                    value={projectInfo}
                    onChange={(e) => setProjectInfo(e.target.value)}
                    placeholder="Describe your project..."
                    rows={4}
                    required
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Project Link (Website URL)</label>
                  <input
                    type="url"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    placeholder="https://your-project-url.com"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Leave empty for gradient preview</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProject(false);
                      setProjectName('');
                      setProjectGenre('');
                      setProjectInfo('');
                      setProjectLink('');
                    }}
                    className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 font-light py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-light py-3 rounded-lg transition-colors"
                  >
                    Add Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowEditProject(false)}
          ></div>
          <div className="relative bg-neutral-800 border border-neutral-700 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl mx-4">
            <button
              onClick={() => setShowEditProject(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-light text-neutral-100 mb-2">Edit Project</h3>
                <p className="text-sm text-neutral-500">Update the project details</p>
              </div>

              <form onSubmit={handleEditProject} className="space-y-5">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    required
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Genre</label>
                  <input
                    type="text"
                    value={projectGenre}
                    onChange={(e) => setProjectGenre(e.target.value)}
                    placeholder="e.g., Testing, Design, AI"
                    required
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Project Info</label>
                  <textarea
                    value={projectInfo}
                    onChange={(e) => setProjectInfo(e.target.value)}
                    placeholder="Describe your project..."
                    rows={4}
                    required
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Project Link (Website URL)</label>
                  <input
                    type="url"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    placeholder="https://your-project-url.com"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Leave empty for gradient preview</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditProject(false);
                      setEditingProject(null);
                      setProjectName('');
                      setProjectGenre('');
                      setProjectInfo('');
                      setProjectLink('');
                    }}
                    className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 font-light py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-light py-3 rounded-lg transition-colors"
                  >
                    Update Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6 flex justify-between items-center">
          <h1 className="text-lg md:text-xl font-light tracking-widest text-neutral-400">PORTFOLIO</h1>
          
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={() => setShowAddProject(true)}
                className="px-4 py-2 md:px-5 md:py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs md:text-sm font-light transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            )}
            
            {isLoggedIn ? (
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-sm text-green-400 hidden sm:inline">● {validUsername}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 md:px-4 py-2 border border-neutral-600 hover:border-red-500 text-neutral-400 hover:text-red-400 rounded text-xs md:text-sm font-light transition-all duration-300"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 md:px-5 md:py-2 bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-neutral-300 rounded-lg text-xs md:text-sm font-light transition-all duration-300"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-20 md:pt-24 pb-16 md:pb-20">
        {/* Hero Section */}
        <section className="min-h-[50vh] md:min-h-[70vh] flex items-center px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-7xl lg:text-9xl font-light text-neutral-100">Creating</h2>
              <h2 className="text-4xl md:text-7xl lg:text-9xl font-light text-neutral-500">Digital</h2>
              <h2 className="text-4xl md:text-7xl lg:text-9xl font-light text-neutral-700">Experiences</h2>
            </div>
            <p className="text-base md:text-xl lg:text-2xl text-neutral-400 font-light tracking-wide max-w-md">
              Testing • Design • AI-Powered Websites
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section className="px-4 md:px-6 py-12 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-16">
              <h3 className="text-xs md:text-sm tracking-widest text-neutral-400">MY PROJECTS</h3>
              <div className="flex-grow h-px bg-neutral-700"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {projects.map((project) => (
                <div key={project.id} className={`group ${!isLoggedIn && project.link ? 'cursor-pointer' : ''}`}>
                  {project.link && !isLoggedIn ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="block">
                      <div className={`aspect-[3/2] rounded-lg overflow-hidden relative mb-3 md:mb-4 ${project.screenshotUrl ? '' : `bg-gradient-to-br ${project.imageGradient}`}`}>
                        {project.screenshotUrl ? (
                          <>
                            <img 
                              src={project.screenshotUrl} 
                              alt={project.name}
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-500"></div>
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-neutral-600/20 group-hover:bg-transparent transition-all duration-500"></div>
                        )}
                        <div className="absolute top-3 md:top-4 left-3 md:left-4">
                          <span className="text-[10px] md:text-xs text-neutral-500 bg-neutral-800/80 px-2 py-1 rounded">{project.genre}</span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">Visit Site →</span>
                        </div>
                      </div>
                      <h4 className="text-sm md:text-lg font-light text-neutral-300 group-hover:text-neutral-100 transition-colors">{project.name}</h4>
                      <p className="text-xs md:text-sm text-neutral-500 mt-1">{project.info}</p>
                    </a>
                  ) : (
                    <div className={`aspect-[3/2] rounded-lg overflow-hidden relative mb-3 md:mb-4 ${project.screenshotUrl ? '' : `bg-gradient-to-br ${project.imageGradient}`}`}>
                      {project.screenshotUrl ? (
                        <>
                          <img 
                            src={project.screenshotUrl} 
                            alt={project.name}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/30"></div>
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-neutral-600/20"></div>
                      )}
                      <div className="absolute top-3 md:top-4 left-3 md:left-4">
                        <span className="text-[10px] md:text-xs text-neutral-500 bg-neutral-800/80 px-2 py-1 rounded">{project.genre}</span>
                      </div>
                      {isLoggedIn && project.link && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">Visit Site →</a>
                        </div>
                      )}
                      {isLoggedIn && (
                        <div className="absolute top-2 md:top-3 right-2 md:right-3 flex gap-1.5 md:gap-2 z-10">
                          <button 
                            onClick={() => openEditModal(project)}
                            className="w-6 h-6 md:w-7 md:h-7 border border-neutral-600 hover:border-blue-500 bg-neutral-900/80 text-neutral-400 hover:text-blue-400 rounded flex items-center justify-center transition-all"
                          >
                            <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="w-6 h-6 md:w-7 md:h-7 border border-neutral-600 hover:border-red-500 bg-neutral-900/80 text-neutral-400 hover:text-red-400 rounded flex items-center justify-center transition-all"
                          >
                            <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {!project.link || isLoggedIn ? (
                    <>
                      <h4 className="text-sm md:text-lg font-light text-neutral-300 group-hover:text-neutral-100 transition-colors">{project.name}</h4>
                      <p className="text-xs md:text-sm text-neutral-500 mt-1">{project.info}</p>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="px-4 md:px-6 py-12 md:py-24 bg-neutral-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-16">
              <h3 className="text-xs md:text-sm tracking-widest text-neutral-400">EXPERTISE</h3>
              <div className="flex-grow h-px bg-neutral-700"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Service Card 1 */}
              <div className="bg-neutral-800 p-5 md:p-8 rounded-lg border border-neutral-700 hover:border-neutral-500 transition-all duration-300 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-700 rounded-lg flex items-center justify-center mb-4 md:mb-6 group-hover:bg-neutral-600 transition-colors">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg md:text-2xl font-light text-neutral-200 mb-2 md:mb-3">Quality Testing</h4>
                <p className="text-sm md:text-base text-neutral-500 font-light leading-relaxed">
                  Comprehensive QA strategies ensuring your applications perform flawlessly across all scenarios.
                </p>
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-neutral-700">
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    <span className="text-[10px] md:text-xs bg-neutral-700 text-neutral-400 px-2 py-1 rounded">Unit Testing</span>
                    <span className="text-[10px] md:text-xs bg-neutral-700 text-neutral-400 px-2 py-1 rounded">E2E</span>
                    <span className="text-[10px] md:text-xs bg-neutral-700 text-neutral-400 px-2 py-1 rounded">Automation</span>
                  </div>
                </div>
              </div>

              {/* Service Card 2 */}
              <div className="bg-neutral-800 p-5 md:p-8 rounded-lg border border-neutral-700 hover:border-neutral-500 transition-all duration-300 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-700 rounded-lg flex items-center justify-center mb-4 md:mb-6 group-hover:bg-neutral-600 transition-colors">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h4 className="text-lg md:text-2xl font-light text-neutral-200 mb-2 md:mb-3">Design Systems</h4>
                <p className="text-sm md:text-base text-neutral-500 font-light leading-relaxed">
                  Creating cohesive visual languages and scalable design systems for consistent user experiences.
                </p>
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-neutral-700">
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    <span className="text-[10px] md:text-xs bg-neutral-700 text-neutral-400 px-2 py-1 rounded">UI Design</span>
                    <span className="text-[10px] md:text-xs bg-neutral-700 text-neutral-400 px-2 py-1 rounded">UX Research</span>
                    <span className="text-[10px] md:text-xs bg-neutral-700 text-neutral-400 px-2 py-1 rounded">Prototyping</span>
                  </div>
                </div>
              </div>

              {/* Service Card 3 */}
              <div className="bg-neutral-800 p-5 md:p-8 rounded-lg border border-neutral-700 hover:border-neutral-500 transition-all duration-300 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-700 rounded-lg flex items-center justify-center mb-4 md:mb-6 group-hover:bg-neutral-600 transition-colors">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-lg md:text-2xl font-light text-neutral-200 mb-2 md:mb-3">AI Integration</h4>
                <p className="text-sm md:text-base text-neutral-500 font-light leading-relaxed">
                  Harnessing the power of AI to build intelligent, adaptive, and innovative web applications.
                </p>
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-neutral-700">
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    <span className="text-[10px] md:text-xs bg-neutral-700 text-neutral-400 px-2 py-1 rounded">ML Models</span>
                    <span className="text-[10px] md:text-xs bg-neutral-700 text-neutral-400 px-2 py-1 rounded">Chatbots</span>
                    <span className="text-[10px] md:text-xs bg-neutral-700 text-neutral-400 px-2 py-1 rounded">Automation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="px-4 md:px-6 py-12 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <h3 className="text-xs md:text-sm tracking-widest text-neutral-400">ABOUT</h3>
                  <div className="flex-grow h-px bg-neutral-700"></div>
                </div>
                <p className="text-base md:text-xl text-neutral-300 font-light leading-relaxed">
                  I'm a digital craftsman who bridges the gap between technical perfection and creative innovation.
                </p>
                <p className="text-sm md:text-lg text-neutral-500 font-light leading-relaxed">
                  With expertise spanning rigorous testing, thoughtful design, and cutting-edge AI technologies, 
                  I help businesses build digital build digital products that are not just functional, but exceptional.
                </p>
              </div>
              <div className="bg-neutral-800 p-5 md:p-8 rounded-lg border border-neutral-700">
                <div className="grid grid-cols-2 gap-6 md:gap-8">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-light text-neutral-100 mb-1 md:mb-2">50+</div>
                    <div className="text-xs md:text-sm text-neutral-500">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-light text-neutral-100 mb-1 md:mb-2">5+</div>
                    <div className="text-xs md:text-sm text-neutral-500">Years</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-light text-neutral-100 mb-1 md:mb-2">30+</div>
                    <div className="text-xs md:text-sm text-neutral-500">Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-light text-neutral-100 mb-1 md:mb-2">100%</div>
                    <div className="text-xs md:text-sm text-neutral-500">Dedicated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-4 md:px-6 py-12 md:py-24 bg-neutral-800/50">
          <div className="max-w-2xl mx-auto text-center space-y-6 md:space-y-12">
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xs md:text-sm tracking-widest text-neutral-400">GET IN TOUCH</h3>
              <div className="w-px h-12 md:h-16 bg-neutral-700 mx-auto"></div>
            </div>
            <p className="text-base md:text-xl text-neutral-300 font-light px-4">
              Have a project in mind? Let's create something amazing together.
            </p>
            
            <div className="bg-neutral-800 p-4 md:p-8 rounded-lg border border-neutral-700 inline-block">
              <a 
                href="#" 
                className="text-base md:text-xl text-neutral-100 hover:text-neutral-400 transition-colors duration-300 tracking-wide block"
              >
                zwemanhlwin7@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 md:px-6 py-6 md:py-8 border-t border-neutral-800 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm text-neutral-500 font-light">© 2026 Portfolio</p>
          <div className="flex items-center gap-4 md:gap-6">
            <a href="#" className="text-xs md:text-sm text-neutral-500 hover:text-neutral-300 transition-colors">LinkedIn</a>
            <a href="#" className="text-xs md:text-sm text-neutral-500 hover:text-neutral-300 transition-colors">GitHub</a>
            <a href="https://t.me/zwemahnL" className="text-xs md:text-sm text-neutral-500 hover:text-neutral-300 transition-colors">Telegram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
