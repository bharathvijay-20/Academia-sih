// Comprehensive mock data for Academia platform
export const INITIAL_STUDENT = {
  id: 'stu-001',
  name: 'Rahul Sharma',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'rahul.sharma@apex.edu',
  phone: '+91 98765 43210',
  college: 'Apex Institute of Technology',
  department: 'Computer Science & Engineering',
  year: '3rd Year (6th Sem)',
  graduationYear: '2027',
  cgpa: '8.84',
  location: 'Bangalore, India',
  careerGoal: 'Backend Systems & Cloud Engineer',
  preferredIndustry: ['FinTech', 'HealthTech', 'SaaS', 'Cloud Infrastructure'],
  preferredRoles: ['Backend Developer Intern', 'Cloud Engineer Intern', 'Software Engineer'],
  preferredLocations: ['Bangalore', 'Hyderabad', 'Remote', 'Pune'],
  workPreference: 'Hybrid / On-site',
  bio: 'Passionate 3rd-year CS student focusing on high-concurrency microservices, Spring Boot, distributed databases, and cloud infrastructure. Open for 3-6 month internships and industry-sponsored live projects.',
  profileCompletion: 88,
  skillReadiness: 74,
};

export const INITIAL_SKILLS = [
  {
    id: 'sk-java',
    name: 'Java',
    category: 'Backend',
    proficiency: 82,
    evidence: {
      assessmentScore: 85,
      assessmentName: 'Java Core & Concurrency Assessment',
      assessmentDate: 'Aug 2026',
      projectTitle: 'E-Commerce Distributed Backend',
      projectUrl: 'github.com/rahul/ecommerce-backend',
      certification: 'Oracle Certified Associate Java SE 17',
      facultyEvaluation: 78,
      facultyEvaluator: 'Dr. Ananya Sharma',
      industryMentorRating: 85,
    },
    subTopics: [
      { name: 'Core Syntax & OOP', score: 90 },
      { name: 'Collections & Generics', score: 85 },
      { name: 'Multithreading & Concurrency', score: 72 },
      { name: 'JVM Memory & Performance', score: 78 },
    ],
    lastUpdated: 'August 2026',
    status: 'Verified Evidence'
  },
  {
    id: 'sk-spring',
    name: 'Spring Boot',
    category: 'Backend',
    proficiency: 72,
    evidence: {
      assessmentScore: 75,
      assessmentName: 'Spring Framework & JPA Assessment',
      assessmentDate: 'Jul 2026',
      projectTitle: 'Microservices Payment Gateway API',
      projectUrl: 'github.com/rahul/pay-gateway-service',
      certification: 'Spring Boot 3 Professional - Udemy Verified',
      facultyEvaluation: 70,
      facultyEvaluator: 'Prof. Ramesh K',
      industryMentorRating: 72,
    },
    subTopics: [
      { name: 'Spring Web & REST', score: 80 },
      { name: 'Spring Data JPA / Hibernate', score: 75 },
      { name: 'Spring Security & OAuth2', score: 62 },
      { name: 'Actuator & Config Management', score: 68 },
    ],
    lastUpdated: 'July 2026',
    status: 'Verified Evidence'
  },
  {
    id: 'sk-rest',
    name: 'REST API & Microservices',
    category: 'Architecture',
    proficiency: 78,
    evidence: {
      assessmentScore: 82,
      assessmentName: 'RESTful Architecture & OpenAPI Spec',
      assessmentDate: 'Aug 2026',
      projectTitle: 'Campus Event Orchestration Engine',
      projectUrl: 'github.com/rahul/campus-event-api',
      certification: 'Postman API Fundamentals Student Expert',
      facultyEvaluation: 75,
      facultyEvaluator: 'Dr. Ananya Sharma',
      industryMentorRating: 76,
    },
    subTopics: [
      { name: 'HTTP Status & Idempotency', score: 88 },
      { name: 'API Versioning & Documentation', score: 82 },
      { name: 'Rate Limiting & Caching (Redis)', score: 70 },
    ],
    lastUpdated: 'August 2026',
    status: 'Verified Evidence'
  },
  {
    id: 'sk-postgres',
    name: 'PostgreSQL & SQL',
    category: 'Database',
    proficiency: 75,
    evidence: {
      assessmentScore: 80,
      assessmentName: 'Relational Schema & Query Optimization',
      assessmentDate: 'Aug 2026',
      projectTitle: 'Hospital Inventory Management Schema',
      projectUrl: 'github.com/rahul/hospital-db',
      certification: 'PostgreSQL Database Associate',
      facultyEvaluation: 72,
      facultyEvaluator: 'Prof. Ramesh K',
      industryMentorRating: 74,
    },
    subTopics: [
      { name: 'Complex Joins & Aggregations', score: 85 },
      { name: 'Indexing & EXPLAIN Plans', score: 70 },
      { name: 'Transactions & ACID Isolation', score: 72 },
    ],
    lastUpdated: 'August 2026',
    status: 'Verified Evidence'
  },
  {
    id: 'sk-docker',
    name: 'Docker & Containers',
    category: 'DevOps',
    proficiency: 30,
    evidence: {
      assessmentScore: 35,
      assessmentName: 'Docker Containerization Basics',
      assessmentDate: 'May 2026',
      projectTitle: 'Basic Dockerfile for Spring App',
      projectUrl: 'github.com/rahul/spring-docker-demo',
      certification: 'Pending Practical Lab',
      facultyEvaluation: 40,
      facultyEvaluator: 'Dr. Ananya Sharma',
      industryMentorRating: 30,
    },
    subTopics: [
      { name: 'Dockerfile Multi-stage Builds', score: 35 },
      { name: 'Docker Compose Networking', score: 30 },
      { name: 'Volume Persistence & Security', score: 25 },
    ],
    lastUpdated: 'May 2026',
    status: 'Gap Identified (Action Plan Active)'
  },
  {
    id: 'sk-react',
    name: 'React.js',
    category: 'Frontend',
    proficiency: 58,
    evidence: {
      assessmentScore: 62,
      assessmentName: 'React Hooks & State Management',
      assessmentDate: 'June 2026',
      projectTitle: 'Student Portfolio & Dashboard',
      projectUrl: 'github.com/rahul/portfolio-react',
      certification: 'Meta Frontend Developer - React Essentials',
      facultyEvaluation: 55,
      facultyEvaluator: 'Prof. Sneha Deshmukh',
      industryMentorRating: 58,
    },
    subTopics: [
      { name: 'Component Lifecycle & Hooks', score: 68 },
      { name: 'State (Context / Zustand)', score: 55 },
      { name: 'Tailwind & UI Integration', score: 70 },
    ],
    lastUpdated: 'June 2026',
    status: 'Moderate Evidence'
  },
  {
    id: 'sk-aws',
    name: 'AWS Cloud Basics',
    category: 'Cloud',
    proficiency: 38,
    evidence: {
      assessmentScore: 40,
      assessmentName: 'AWS Cloud Practitioner Prep',
      assessmentDate: 'June 2026',
      projectTitle: 'S3 Image Storage Pipeline',
      projectUrl: 'github.com/rahul/s3-uploader',
      certification: 'AWS Cloud Practitioner (In Progress)',
      facultyEvaluation: 35,
      facultyEvaluator: 'Dr. Ananya Sharma',
      industryMentorRating: 38,
    },
    subTopics: [
      { name: 'EC2 & VPC Networking', score: 35 },
      { name: 'S3 & IAM Security', score: 45 },
      { name: 'Lambda & Serverless', score: 30 },
    ],
    lastUpdated: 'June 2026',
    status: 'Gap Identified'
  },
  {
    id: 'sk-python',
    name: 'Python & AI Fundamentals',
    category: 'AI / Data',
    proficiency: 65,
    evidence: {
      assessmentScore: 70,
      assessmentName: 'Python for Data Structures & ML',
      assessmentDate: 'July 2026',
      projectTitle: 'Smart Resume Classifier using NLP',
      projectUrl: 'github.com/rahul/resume-nlp-parser',
      certification: 'Python for Data Science - NPTEL Elite',
      facultyEvaluation: 65,
      facultyEvaluator: 'Dr. Ananya Sharma',
      industryMentorRating: 62,
    },
    subTopics: [
      { name: 'Data Structures & NumPy/Pandas', score: 75 },
      { name: 'Scikit-Learn & ML Models', score: 62 },
      { name: 'FastAPI / Flask Microservices', score: 68 },
    ],
    lastUpdated: 'July 2026',
    status: 'Verified Evidence'
  }
];

export const INITIAL_OPPORTUNITIES = [
  {
    id: 'opp-001',
    type: 'Internship',
    title: 'Java & Cloud Backend Intern',
    company: 'Apex Digital Labs',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore (Hybrid)',
    duration: '6 Months',
    stipend: '₹35,000 / month',
    openings: 4,
    deadline: 'Oct 15, 2026',
    experience: 'Fresher / Final & Pre-Final Year',
    requiredSkills: ['Java', 'Spring Boot', 'REST API & Microservices', 'PostgreSQL & SQL'],
    preferredSkills: ['Docker & Containers', 'AWS Cloud Basics'],
    description: 'We are seeking an ambitious Backend Engineering Intern to develop scalable microservices, manage PostgreSQL queries, and assist in containerizing cloud-native healthcare data pipelines.',
    weights: {
      'Java': 25,
      'Spring Boot': 20,
      'REST API & Microservices': 15,
      'PostgreSQL & SQL': 15,
      'Docker & Containers': 15,
      'AWS Cloud Basics': 10
    },
    whyMatch: 'Your Java (82%), REST API (78%), and Spring Boot (72%) skills strongly match the core requirements. Docker (30%) and AWS (38%) are your main skill gaps.',
    matchScore: 84,
    postedDate: '2 days ago'
  },
  {
    id: 'opp-002',
    type: 'Internship',
    title: 'Full-Stack React & Spring Developer',
    company: 'TechCorp Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&auto=format&fit=crop&q=80',
    location: 'Hyderabad / Remote',
    duration: '3 Months',
    stipend: '₹28,000 / month',
    openings: 6,
    deadline: 'Oct 30, 2026',
    experience: 'Pre-Final / Final Year',
    requiredSkills: ['React.js', 'Java', 'Spring Boot', 'PostgreSQL & SQL'],
    preferredSkills: ['Docker & Containers', 'Tailwind CSS'],
    description: 'Join our customer portal team to build intuitive front-end features with React and robust backend APIs with Spring Boot.',
    weights: {
      'React.js': 25,
      'Java': 25,
      'Spring Boot': 20,
      'PostgreSQL & SQL': 15,
      'Docker & Containers': 15
    },
    whyMatch: 'Balanced match with solid Java and Database foundation. React (58%) is at a moderate level, while Docker remains the target development area.',
    matchScore: 76,
    postedDate: '4 days ago'
  },
  {
    id: 'opp-003',
    type: 'Project',
    title: 'Hospital Queue Optimization Engine',
    company: 'MediCare Cloud Systems',
    companyLogo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&auto=format&fit=crop&q=80',
    location: 'Campus Industry Lab',
    duration: '8 Weeks (Sponsored Project)',
    stipend: '₹40,000 Milestone Grant',
    openings: 3,
    deadline: 'Oct 20, 2026',
    experience: 'Team of 3-4 Students + Faculty Guide',
    requiredSkills: ['Java', 'Spring Boot', 'PostgreSQL & SQL', 'Python & AI Fundamentals'],
    preferredSkills: ['React.js', 'Docker & Containers'],
    description: 'Build a real-time patient queue allocation algorithm with priority triage estimation. Work directly with industry architects and faculty mentors.',
    weights: {
      'Java': 30,
      'PostgreSQL & SQL': 25,
      'Python & AI Fundamentals': 25,
      'Spring Boot': 20
    },
    whyMatch: 'Excellent fit for your backend, database, and Python AI skills. Perfect project to build verified Docker experience with industry guidance.',
    matchScore: 88,
    postedDate: 'Just now'
  },
  {
    id: 'opp-004',
    type: 'Job',
    title: 'Associate Cloud Software Engineer',
    company: 'CloudNova Global',
    companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=80',
    location: 'Bangalore (On-site)',
    duration: 'Full-Time Placement',
    stipend: 'CTC: ₹12.5 - ₹16.0 LPA',
    openings: 10,
    deadline: 'Nov 15, 2026',
    experience: 'Graduating 2027',
    requiredSkills: ['Java', 'Spring Boot', 'Docker & Containers', 'AWS Cloud Basics', 'REST API & Microservices'],
    preferredSkills: ['Kubernetes', 'CI/CD Pipelines'],
    description: 'Fast-track career for high-performing engineering graduates to build next-generation distributed multi-tenant SaaS services.',
    weights: {
      'Java': 20,
      'Spring Boot': 20,
      'REST API & Microservices': 20,
      'Docker & Containers': 20,
      'AWS Cloud Basics': 20
    },
    whyMatch: 'Strong core programming and REST foundations. To achieve 90%+ match readiness, complete the Cloud Immersion action plan.',
    matchScore: 68,
    postedDate: '1 week ago'
  },
  {
    id: 'opp-005',
    type: 'Workshop',
    title: 'Spring Boot 3 & Docker Microservices Masterclass',
    company: 'Apex Digital Labs Academy',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'Live Virtual Workshop + Hands-on Lab',
    duration: '2 Days (Oct 12-13, 2026)',
    stipend: 'Free (Institution Sponsored)',
    openings: 120,
    deadline: 'Oct 10, 2026',
    experience: 'All CSE/IT/ECE Students',
    requiredSkills: ['Java'],
    preferredSkills: ['Docker & Containers'],
    description: 'Hands-on live coding with senior lead architects from Apex Labs. Build, containerize, and deploy a multi-service architecture on AWS ECS.',
    weights: { 'Java': 100 },
    whyMatch: 'Directly addresses your primary skill gap in Docker and containers with hands-on enterprise guidance.',
    matchScore: 95,
    postedDate: '3 days ago'
  },
  {
    id: 'opp-006',
    type: 'Mentorship',
    title: '1-on-1 Backend System Design & Career Coaching',
    company: 'Vikram Singhania (VP Engineering, Apex Labs)',
    companyLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    location: '1:1 Google Meet (45 mins)',
    duration: 'Bi-Weekly Slots',
    stipend: 'Complimentary Mentorship',
    openings: 8,
    deadline: 'Rolling slots',
    experience: 'Pre-final & Final Year',
    requiredSkills: ['Java', 'Spring Boot'],
    preferredSkills: ['PostgreSQL & SQL'],
    description: 'Discuss architecture tradeoffs, database sharding, microservice resilience, and resume portfolio review with an industry veteran of 18+ years.',
    weights: { 'Java': 50, 'Spring Boot': 50 },
    whyMatch: 'Your strong Java foundation makes you fully prepared for advanced system design discussions.',
    matchScore: 92,
    postedDate: 'Active'
  }
];

export const INITIAL_PROBLEM_BANK = [
  {
    id: 'prob-001',
    title: 'Smart Hospital Queue & Bed Allocation Engine',
    company: 'MediCare Cloud Systems',
    companyLogo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&auto=format&fit=crop&q=80',
    domain: 'Healthcare & IoT',
    industryContact: 'Dr. Suresh Varma, CTO',
    teamSize: '3–5 Students + 1 Faculty Guide',
    duration: '6–8 Weeks',
    stipendGrant: '₹50,000 Project Stipend + Internship PPO for Top Team',
    mentorAvailable: true,
    mentorName: 'Kavita Menon (Principal Architect)',
    requiredSkills: ['Java', 'Spring Boot', 'PostgreSQL & SQL', 'React.js'],
    preferredSkills: ['Docker & Containers', 'FastAPI'],
    description: 'Hospitals experience severe bottlenecks during peak admission hours. Create a dynamic queuing engine with real-time bed telemetry, nurse allocation algorithms, and emergency priority escalation.',
    deliverables: [
      'Microservice REST API in Spring Boot',
      'Interactive Nurse/Doctor triage dashboard in React',
      'Optimized PostgreSQL query engine with stress testing up to 10k concurrent sessions',
      'Dockerized deployment script'
    ],
    status: 'Open for Student & Faculty Teams',
    applicantsCount: 6,
    tags: ['Healthcare', 'Spring Boot', 'Real-world Scale']
  },
  {
    id: 'prob-002',
    title: 'Cold-Chain IoT Sensor Telemetry & Anomaly Alerts',
    company: 'LogiTrack Global Supply',
    companyLogo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&auto=format&fit=crop&q=80',
    domain: 'Logistics & Embedded IoT',
    industryContact: 'Rajesh Nair, Head of Supply Tech',
    teamSize: '3–4 Students + 1 Faculty Guide',
    duration: '8 Weeks',
    stipendGrant: '₹40,000 Milestone Grant',
    mentorAvailable: true,
    mentorName: 'Deepak Rao (IoT Cloud Specialist)',
    requiredSkills: ['Python & AI Fundamentals', 'PostgreSQL & SQL', 'REST API & Microservices'],
    preferredSkills: ['AWS Cloud Basics', 'MQTT'],
    description: 'Pharmaceutical vaccines spoil if temperatures fluctuate beyond ±2°C during transit. Build a streaming telemetry ingestion service that flags temperature spikes and predicts route delays using historical GPS logs.',
    deliverables: [
      'Time-series sensor ingestion pipeline',
      'Rule-based & ML anomaly detection engine',
      'Automated SMS/Email incident dispatch trigger'
    ],
    status: 'Open for Student & Faculty Teams',
    applicantsCount: 4,
    tags: ['Supply Chain', 'IoT', 'Python / ML']
  },
  {
    id: 'prob-003',
    title: 'Autonomous Exam Question Paper & Rubric Generator',
    company: 'EduTech Innovations Labs',
    companyLogo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100&auto=format&fit=crop&q=80',
    domain: 'Generative AI in Education',
    industryContact: 'Dr. Priya Raman, Director of AI',
    teamSize: '2–4 Students + 1 Faculty Guide',
    duration: '6 Weeks',
    stipendGrant: '₹35,000 Grant + Conference Publication Support',
    mentorAvailable: true,
    mentorName: 'Arun Iyer (GenAI Research Lead)',
    requiredSkills: ['Python & AI Fundamentals', 'REST API & Microservices', 'React.js'],
    preferredSkills: ['LangChain / LLM APIs', 'Docker & Containers'],
    description: 'Help university professors formulate Bloom Taxonomy-compliant question papers with automatic rubric calibration and difficulty distribution matrices.',
    deliverables: [
      'LLM integration for syllabus-to-question synthesis',
      'Difficulty validation algorithm',
      'Export to LaTeX and formatted PDF'
    ],
    status: 'Open for Student & Faculty Teams',
    applicantsCount: 9,
    tags: ['GenAI', 'Education', 'LLMs']
  }
];

export const INITIAL_ASSESSMENTS = [
  {
    id: 'ass-java',
    skillId: 'sk-java',
    skillName: 'Java & Concurrency Assessment',
    category: 'Backend',
    durationMinutes: 15,
    totalQuestions: 5,
    difficulty: 'Intermediate',
    description: 'Tests OOP fundamentals, collections architecture, multithreading synchronization, and JVM execution.',
    questions: [
      {
        id: 'q1',
        text: 'In Java, which mechanism provides thread safety for a shared counter without explicit synchronized locks?',
        subTopic: 'Multithreading & Concurrency',
        options: [
          'AtomicInteger using CAS (Compare-And-Swap) operations',
          'Declaring the variable as volatile alone',
          'Using a plain Integer inside a while loop',
          'Using ThreadLocal without synchronization'
        ],
        correctAnswer: 0,
        explanation: 'AtomicInteger in java.util.concurrent.atomic utilizes low-level CPU Compare-And-Swap (CAS) instructions to guarantee atomic increments without the overhead of heavy locks.'
      },
      {
        id: 'q2',
        text: 'What happens if two unequal objects return the exact same hashCode() value in a Java HashMap?',
        subTopic: 'Collections & Generics',
        options: [
          'The HashMap throws a HashCollisionException',
          'A hash collision occurs; both entries are placed in the same bucket as a linked list / red-black tree and distinguished using equals()',
          'The older key is silently overwritten by the new object',
          'The table automatically resizes and doubles in capacity'
        ],
        correctAnswer: 1,
        explanation: 'Hash collisions are normal. HashMap stores items in bucket collision chains (linked list or balanced tree in Java 8+) and uses equals() to find the exact key.'
      },
      {
        id: 'q3',
        text: 'Which JVM garbage collector is designed for low latency by executing concurrent marking and evacuation phases?',
        subTopic: 'JVM Memory & Performance',
        options: [
          'ZGC (Z Garbage Collector) and G1GC',
          'Serial Garbage Collector',
          'Parallel Mark Sweep GC',
          'Classic Mark-Sweep Stop-The-World Collector'
        ],
        correctAnswer: 0,
        explanation: 'ZGC and G1GC minimize pause times through concurrent mark and evacuation phases, keeping stop-the-world pauses below millisecond thresholds.'
      },
      {
        id: 'q4',
        text: 'What is the key difference between an Interface default method and an Abstract Class in modern Java?',
        subTopic: 'Core Syntax & OOP',
        options: [
          'Abstract classes can maintain instance state (fields), whereas interfaces cannot hold non-static instance state',
          'Default methods cannot have method bodies',
          'A class can only implement one interface but extend multiple abstract classes',
          'Interfaces do not support polymorphism'
        ],
        correctAnswer: 0,
        explanation: 'Interfaces cannot declare instance fields (state), whereas abstract classes can have constructors and instance variables.'
      },
      {
        id: 'q5',
        text: 'How does CompletableFuture.supplyAsync() handle asynchronous execution by default in Java?',
        subTopic: 'Multithreading & Concurrency',
        options: [
          'It runs on the common ForkJoinPool.commonPool() worker threads',
          'It spawns a new unmanaged native OS thread for every single task',
          'It blocks the calling thread until the result is evaluated',
          'It pushes tasks to the main UI thread'
        ],
        correctAnswer: 0,
        explanation: 'By default, CompletableFuture tasks run asynchronously using the shared ForkJoinPool.commonPool() unless a custom Executor is provided.'
      }
    ]
  },
  {
    id: 'ass-docker',
    skillId: 'sk-docker',
    skillName: 'Docker & Containerization Practical Assessment',
    category: 'DevOps',
    durationMinutes: 12,
    totalQuestions: 4,
    difficulty: 'Intermediate',
    description: 'Evaluate multi-stage Dockerfiles, caching strategies, container networking, and docker-compose orchestration.',
    questions: [
      {
        id: 'dq1',
        text: 'Why are multi-stage Docker builds recommended for Java/Spring Boot and Node.js applications?',
        subTopic: 'Dockerfile Multi-stage Builds',
        options: [
          'They separate the heavy build-time SDK tools from the slim runtime image, dramatically reducing image size and attack surface',
          'They execute multiple containers simultaneously during development',
          'They make Docker containers run with root privileges automatically',
          'They bypass Docker layer caching'
        ],
        correctAnswer: 0,
        explanation: 'Multi-stage builds allow compiling in a build container (with JDK/Maven) and copying only the generated .jar to a minimal JRE image (e.g. Alpine), reducing image size from 600MB to under 120MB.'
      },
      {
        id: 'dq2',
        text: 'In docker-compose.yml, how do two microservices on the same custom bridge network discover and communicate with each other?',
        subTopic: 'Docker Compose Networking',
        options: [
          'By using the service name as the DNS hostname (e.g., http://backend-service:8080)',
          'Only by hardcoding the host machine dynamic IP address',
          'Containers cannot talk to each other without port forwarding to public internet',
          'By reading the MAC address of the container'
        ],
        correctAnswer: 0,
        explanation: 'Docker embeds an internal DNS server that automatically resolves service names defined in docker-compose.yml to their container IP addresses.'
      },
      {
        id: 'dq3',
        text: 'What is the purpose of Docker Volumes compared to bind mounts in production deployments?',
        subTopic: 'Volume Persistence & Security',
        options: [
          'Volumes are managed fully by Docker and isolated from host core file systems, enabling safe data persistence and backups',
          'Volumes are deleted every time a container restarts',
          'Volumes slow down database read/write speeds for security',
          'Volumes are only supported on Windows OS'
        ],
        correctAnswer: 0,
        explanation: 'Docker Volumes are stored in a part of the host filesystem managed by Docker (/var/lib/docker/volumes/) and are the best mechanism for persisting database state.'
      },
      {
        id: 'dq4',
        text: 'How can you optimize Docker image layer caching when writing a Dockerfile for a Maven/Spring Boot project?',
        subTopic: 'Dockerfile Multi-stage Builds',
        options: [
          'Copy pom.xml and download dependencies before copying the entire source code directory',
          'Copy the entire project directory on the first line',
          'Run mvn clean package before installing Docker',
          'Never use layer caching in production builds'
        ],
        correctAnswer: 0,
        explanation: 'By copying pom.xml and running dependency downloads in an earlier layer, Docker caches the dependencies and only rebuilds when pom.xml changes, speeding up subsequent builds.'
      }
    ]
  },
  {
    id: 'ass-sql',
    skillId: 'sk-postgres',
    skillName: 'PostgreSQL & Relational Architecture Assessment',
    category: 'Database',
    durationMinutes: 12,
    totalQuestions: 4,
    difficulty: 'Intermediate',
    description: 'Assess schema design, B-tree indexes, transaction isolation levels, and query performance analysis.',
    questions: [
      {
        id: 'sq1',
        text: 'What is the benefit of adding a B-Tree Composite Index on columns (department_id, created_at)?',
        subTopic: 'Indexing & EXPLAIN Plans',
        options: [
          'It accelerates queries filtering by department_id alone or department_id AND created_at simultaneously',
          'It speeds up queries filtering on created_at alone without department_id',
          'It completely eliminates the need for database backups',
          'It compresses table storage by 90%'
        ],
        correctAnswer: 0,
        explanation: 'Composite indexes follow the leftmost prefix rule: they effectively optimize queries on the first column or both columns combined.'
      },
      {
        id: 'sq2',
        text: 'Which PostgreSQL command outputs the execution plan along with real execution times and disk page reads?',
        subTopic: 'Indexing & EXPLAIN Plans',
        options: [
          'EXPLAIN ANALYZE (BUFFERS) SELECT ...',
          'SHOW QUERY PLAN SELECT ...',
          'DEBUG RUN SELECT ...',
          'CHECK PERFORMANCE SELECT ...'
        ],
        correctAnswer: 0,
        explanation: 'EXPLAIN ANALYZE actually executes the query and reports real runtime elapsed per node, row counts, and buffer cache hits.'
      },
      {
        id: 'sq3',
        text: 'Which ACID property ensures that partially completed database transactions roll back completely if a server crashes mid-flight?',
        subTopic: 'Transactions & ACID Isolation',
        options: [
          'Atomicity (All-or-Nothing)',
          'Consistency',
          'Isolation',
          'Durability'
        ],
        correctAnswer: 0,
        explanation: 'Atomicity ensures that all statements within a transaction block either commit successfully as a single unit or leave the database state untouched.'
      },
      {
        id: 'sq4',
        text: 'When should you choose PostgreSQL JSONB column format over a traditional normalized relational table?',
        subTopic: 'Complex Joins & Aggregations',
        options: [
          'When storing semi-structured dynamic attributes with indexing support (GIN indexes) where schema varies frequently per item',
          'For all primary keys and foreign key relationships',
          'When you never need to query inside the JSON object',
          'Only when using MongoDB drivers'
        ],
        correctAnswer: 0,
        explanation: 'JSONB stores decomposed binary JSON data with support for GIN indexing, making it ideal for polymorphic or rapidly evolving product metadata while retaining ACID guarantees.'
      }
    ]
  }
];

export const INITIAL_ACTION_PLAN = {
  opportunityId: 'opp-001',
  opportunityTitle: 'Java & Cloud Backend Intern at Apex Digital Labs',
  targetReadiness: '88% → 94%',
  overallGapStatus: 'Moderate Gap in Docker & AWS Cloud',
  missingSkills: [
    {
      skillName: 'Docker & Containers',
      currentScore: 30,
      targetScore: 70,
      impactWeight: '+12% match boost',
      tasks: [
        {
          id: 'task-doc-1',
          title: 'Complete Docker Multi-Stage Containerization Guide',
          type: 'Learning & Practice',
          duration: '45 mins',
          link: 'https://docs.docker.com/build/building/multi-stage/',
          completed: true,
          points: 10
        },
        {
          id: 'task-doc-2',
          title: 'Containerize Spring Boot & PostgreSQL with docker-compose',
          type: 'Hands-on Project Evidence',
          duration: '2 hours',
          completed: false,
          points: 15
        },
        {
          id: 'task-doc-3',
          title: 'Take Docker & Containerization Practical Assessment',
          type: 'Assessment Validation',
          duration: '15 mins',
          completed: false,
          points: 15
        }
      ]
    },
    {
      skillName: 'AWS Cloud Basics',
      currentScore: 38,
      targetScore: 65,
      impactWeight: '+8% match boost',
      tasks: [
        {
          id: 'task-aws-1',
          title: 'Deploy Containerized App to AWS ECS / App Runner',
          type: 'Lab Simulation',
          duration: '1.5 hours',
          completed: false,
          points: 12
        },
        {
          id: 'task-aws-2',
          title: 'Enroll in Institution AWS Cloud Immersion Workshop',
          type: 'Campus Workshop',
          duration: 'Oct 12-13',
          completed: true,
          points: 10
        }
      ]
    }
  ]
};

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-001',
    opportunityId: 'opp-001',
    title: 'Java & Cloud Backend Intern',
    company: 'Apex Digital Labs',
    appliedDate: 'Sep 02, 2026',
    status: 'Shortlisted',
    statusStage: 3, // 1: Applied, 2: Under Review, 3: Shortlisted, 4: Interview, 5: Selected
    matchScore: 84,
    timeline: [
      { stage: 'Applied', date: 'Sep 02, 2026', note: 'Application submitted with Evidence-based Skill Passport.' },
      { stage: 'Under Review', date: 'Sep 04, 2026', note: 'AI Matching scored profile 84%. Recruiter reviewed GitHub evidence.' },
      { stage: 'Shortlisted', date: 'Sep 06, 2026', note: 'Shortlisted for Round 1 Technical Architecture Discussion.' },
      { stage: 'Interview', date: 'Scheduled for Sep 12, 2026', note: 'Technical Round with VP of Engineering.' }
    ]
  },
  {
    id: 'app-002',
    opportunityId: 'opp-003',
    title: 'Hospital Queue Optimization Engine',
    company: 'MediCare Cloud Systems',
    appliedDate: 'Sep 01, 2026',
    status: 'Interview',
    statusStage: 4,
    matchScore: 88,
    timeline: [
      { stage: 'Applied', date: 'Sep 01, 2026', note: 'Team applied with Faculty Guide Dr. Ananya Sharma.' },
      { stage: 'Under Review', date: 'Sep 03, 2026', note: 'Problem statement solution pitch reviewed.' },
      { stage: 'Shortlisted', date: 'Sep 05, 2026', note: 'Top 3 team selection.' },
      { stage: 'Interview', date: 'Sep 08, 2026', note: 'Team presentation and architecture defense.' }
    ]
  },
  {
    id: 'app-003',
    opportunityId: 'opp-002',
    title: 'Full-Stack React & Spring Developer',
    company: 'TechCorp Solutions',
    appliedDate: 'Aug 28, 2026',
    status: 'Under Review',
    statusStage: 2,
    matchScore: 76,
    timeline: [
      { stage: 'Applied', date: 'Aug 28, 2026', note: 'Resume & Skill Passport submitted.' },
      { stage: 'Under Review', date: 'Aug 30, 2026', note: 'Talent Acquisition team reviewing applicants.' }
    ]
  }
];

export const INITIAL_ACTIVE_INTERNSHIP = {
  id: 'intern-001',
  role: 'Java Backend Engineering Intern',
  company: 'Apex Digital Labs',
  mentorName: 'Vikram Singhania (VP Engineering)',
  mentorEmail: 'vikram.s@apexdigital.io',
  startDate: 'July 15, 2026',
  endDate: 'Oct 15, 2026',
  duration: '12 Weeks (Current: Week 8)',
  progressPercentage: 66,
  status: 'In Progress',
  weeklyLogs: [
    {
      week: 1,
      title: 'Dev Environment & Microservices Architecture Onboarding',
      tasks: 'Configured local IntelliJ, Docker desktop, cloned enterprise auth services, and reviewed API style guides.',
      skillsPracticed: ['Java', 'Git', 'REST API'],
      status: 'Approved by Mentor',
      mentorFeedback: 'Smooth onboarding. Demonstrated great initiative with code reviews.',
      mentorRating: 4.8
    },
    {
      week: 2,
      title: 'High-Concurrency Redis Caching Layer Implementation',
      tasks: 'Implemented Redis cache abstraction on hospital bed lookup endpoint, reducing query response time from 380ms to 42ms.',
      skillsPracticed: ['Java', 'Spring Data Redis', 'PostgreSQL'],
      status: 'Approved by Mentor',
      mentorFeedback: 'Impressive benchmark results and clean test coverage.',
      mentorRating: 5.0
    },
    {
      week: 3,
      title: 'PostgreSQL Query Optimization & Connection Pool Tuning',
      tasks: 'Analyzed slow query logs using EXPLAIN ANALYZE; added composite indexes on patient admission tables and tuned HikariCP pool.',
      skillsPracticed: ['PostgreSQL & SQL', 'Spring Boot'],
      status: 'Approved by Mentor',
      mentorFeedback: 'Solid understanding of indexing tradeoffs.',
      mentorRating: 4.7
    },
    {
      week: 4,
      title: 'JWT Authentication & OAuth2 Role Hierarchy',
      tasks: 'Integrated RBAC for Doctors, Nurses, and Admin roles with refresh token rotation.',
      skillsPracticed: ['Spring Security', 'REST API'],
      status: 'Approved by Mentor',
      mentorFeedback: 'Handled security edge cases effectively.',
      mentorRating: 4.9
    }
  ],
  mentorEvaluation: {
    lastEvaluated: 'August 28, 2026',
    evaluator: 'Vikram Singhania',
    scores: {
      technicalCompetence: 4.8,
      problemSolving: 5.0,
      codeQuality: 4.6,
      teamCollaboration: 4.9,
      professionalism: 5.0,
    },
    overallAverage: 4.86,
    summaryRemarks: 'Rahul is performing in the top 5% of interns we have hosted. His backend fundamentals are rock solid, and he actively incorporates feedback into production-grade pull requests.',
    recommendedSkillsForPassport: [
      { skill: 'Java', bonusPoints: '+5% Confidence', verified: true },
      { skill: 'PostgreSQL & SQL', bonusPoints: '+6% Confidence', verified: true },
      { skill: 'Spring Boot', bonusPoints: '+4% Confidence', verified: true }
    ]
  }
};

export const INITIAL_INDUSTRY_PROFILE = {
  id: 'ind-001',
  companyName: 'Apex Digital Labs',
  representativeName: 'Vikram Singhania',
  designation: 'VP of Engineering & University Relations',
  email: 'partnerships@apexdigital.io',
  website: 'https://apexdigital.io',
  industryDomain: 'Enterprise Cloud, Healthcare Tech & AI Platforms',
  companySize: '500–1,000 Employees',
  headquarters: 'Bangalore, India (Hubs: Hyderabad, San Francisco)',
  bio: 'Apex Digital Labs is a premier enterprise digital engineering partner building mission-critical cloud backends, real-time telemetry systems, and AI accelerators for Fortune 500 healthcare and fintech leaders.',
  collaborationInterests: [
    'Summer & Long-Term Internships',
    'Campus Placements & PPO Fast-track',
    'Industry Problem Bank Challenges',
    'Faculty Immersion & R&D Sabbaticals',
    'Technical Masterclasses & Workshops',
    '1-on-1 Engineering Mentorship'
  ],
  stats: {
    activeListings: 6,
    applicationsReceived: 148,
    shortlistedCandidates: 24,
    activeInterns: 12,
    collaboratingInstitutions: 8,
    solvedProblemProjects: 14
  }
};

export const INITIAL_FACULTY_PROFILE = {
  id: 'fac-001',
  name: 'Dr. Ananya Sharma',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  designation: 'Professor & Head of Research (CSE)',
  department: 'Computer Science & Engineering',
  institution: 'Apex Institute of Technology',
  email: 'ananya.sharma@apex.edu',
  phone: '+91 98123 45678',
  experience: '16 Years Academic & Industrial Research',
  specialization: ['Distributed Cloud Systems', 'Computer Vision & AI', 'High-Performance Computing'],
  subjectsTaught: ['Advanced Database Systems', 'Distributed Systems & Microservices', 'Cloud Architecture'],
  publicationsCount: 28,
  patentsGranted: 3,
  industryConsultingProjects: 6,
  menteesCount: 42,
  industryInterests: [
    'Joint Research & Applied Grant Proposals',
    'Faculty Industry Immersion / Sabbatical Program',
    'Industry-Guided Curriculum Modernization',
    'Supervising Industry Problem Bank Teams',
    'Keynote Technical Workshops & FDPs'
  ],
  studentsList: [
    {
      id: 'stu-001',
      name: 'Rahul Sharma',
      year: '3rd Year CSE',
      careerGoal: 'Backend Systems Engineer',
      skillReadiness: 74,
      keyGaps: ['Docker & Containers', 'AWS Cloud Basics'],
      topStrengths: ['Java (82%)', 'REST APIs (78%)', 'PostgreSQL (75%)'],
      status: 'Active Internship at Apex Labs',
      recommendedAction: 'Assigned Docker Practical Lab & AWS Immersion'
    },
    {
      id: 'stu-002',
      name: 'Priya Iyer',
      year: '3rd Year CSE',
      careerGoal: 'Full-Stack Developer',
      skillReadiness: 86,
      keyGaps: ['System Design', 'CI/CD Pipelines'],
      topStrengths: ['React (90%)', 'Node.js (84%)', 'MongoDB (80%)'],
      status: 'Shortlisted for FinTech Hackathon',
      recommendedAction: 'Encourage applying to Problem Bank #003'
    },
    {
      id: 'stu-003',
      name: 'Arjun Verma',
      year: '4th Year CSE',
      careerGoal: 'AI / Machine Learning Engineer',
      skillReadiness: 91,
      keyGaps: ['Model Quantization (ONNX)'],
      topStrengths: ['Python (95%)', 'PyTorch (88%)', 'FastAPI (82%)'],
      status: 'PPO Offered from MediCare Cloud',
      recommendedAction: 'Nominated for Best Research Paper Award'
    },
    {
      id: 'stu-004',
      name: 'Neha Deshmukh',
      year: '3rd Year IT',
      careerGoal: 'DevOps & SRE Engineer',
      skillReadiness: 68,
      keyGaps: ['Kubernetes Clusters', 'Terraform'],
      topStrengths: ['Linux (80%)', 'Docker (75%)', 'Python (70%)'],
      status: 'Preparing for AWS Cert',
      recommendedAction: 'Enrolled in Campus DevOps Bootcamp'
    }
  ]
};

export const INITIAL_INSTITUTION_DATA = {
  institutionName: 'Apex Institute of Technology',
  logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80',
  accreditation: 'NAAC A++ Grade (CGPA 3.82) | NIRF Top 35 Ranking',
  deanName: 'Dr. Rajeshwar Rao, Principal & Director',
  totalStudents: 4280,
  totalFaculty: 186,
  industryPartners: 74,
  activeInternships: 326,
  placementsThisYear: 892,
  averagePackage: '₹8.6 LPA',
  highestPackage: '₹44.0 LPA',
  liveProjects: 48,
  researchCollaborations: 17,
  skillDemandHeatmap: [
    {
      skill: 'Cloud Computing (AWS / GCP / Azure)',
      category: 'Cloud',
      industryDemand: 86,
      studentAvailability: 34,
      gapPercentage: 52,
      gapLevel: 'High Gap',
      studentsEligible: 280,
      studentsTrained: 95,
      hiringCompanies: 42,
      recommendation: 'Immediate Campus Immersion Bootcamp Needed'
    },
    {
      skill: 'Docker & Kubernetes (Containerization)',
      category: 'DevOps',
      industryDemand: 78,
      studentAvailability: 26,
      gapPercentage: 52,
      gapLevel: 'High Gap',
      studentsEligible: 310,
      studentsTrained: 80,
      hiringCompanies: 38,
      recommendation: 'Add Hands-on Lab to 6th Sem Distributed Systems'
    },
    {
      skill: 'Generative AI & LLM Engineering',
      category: 'AI / Data',
      industryDemand: 74,
      studentAvailability: 31,
      gapPercentage: 43,
      gapLevel: 'High Gap',
      studentsEligible: 240,
      studentsTrained: 74,
      hiringCompanies: 31,
      recommendation: 'Organize Faculty Development Program with Apex Labs'
    },
    {
      skill: 'React.js & Modern Frontend',
      category: 'Frontend',
      industryDemand: 76,
      studentAvailability: 54,
      gapPercentage: 22,
      gapLevel: 'Medium Gap',
      studentsEligible: 420,
      studentsTrained: 226,
      hiringCompanies: 45,
      recommendation: 'Continue Capstone Project Component'
    },
    {
      skill: 'Java & Spring Boot Microservices',
      category: 'Backend',
      industryDemand: 88,
      studentAvailability: 72,
      gapPercentage: 16,
      gapLevel: 'Low Gap',
      studentsEligible: 510,
      studentsTrained: 367,
      hiringCompanies: 56,
      recommendation: 'Institutional Core Strength — Enhance Advanced Concurrency'
    },
    {
      skill: 'PostgreSQL & High-Performance SQL',
      category: 'Database',
      industryDemand: 82,
      studentAvailability: 70,
      gapPercentage: 12,
      gapLevel: 'Low Gap',
      studentsEligible: 480,
      studentsTrained: 336,
      hiringCompanies: 49,
      recommendation: 'Cover Index Tuning & Query Optimization'
    },
    {
      skill: 'System Design & Distributed Scalability',
      category: 'Architecture',
      industryDemand: 70,
      studentAvailability: 38,
      gapPercentage: 32,
      gapLevel: 'Medium Gap',
      studentsEligible: 320,
      studentsTrained: 121,
      hiringCompanies: 34,
      recommendation: 'Schedule Weekend Industry Expert Masterclass Series'
    }
  ],
  departmentPlacements: [
    { department: 'Computer Science (CSE)', total: 420, placed: 395, percentage: 94, avgLpa: 10.4 },
    { department: 'Information Tech (IT)', total: 240, placed: 221, percentage: 92, avgLpa: 9.6 },
    { department: 'Electronics & Comm (ECE)', total: 320, placed: 278, percentage: 87, avgLpa: 7.8 },
    { department: 'Electrical & Electronics (EEE)', total: 180, placed: 142, percentage: 79, avgLpa: 6.9 },
    { department: 'Mechanical Engg (ME)', total: 190, placed: 138, percentage: 73, avgLpa: 6.2 }
  ],
  activeMoUs: [
    {
      partner: 'Apex Digital Labs',
      signedDate: 'Jan 2025',
      validTill: 'Dec 2028',
      type: 'Tier-1 Strategic R&D & Placement Partner',
      activeInterns: 18,
      jointLabs: 'Apex Cloud Systems Innovation Hub',
      status: 'Active'
    },
    {
      partner: 'MediCare Cloud Systems',
      signedDate: 'Aug 2024',
      validTill: 'Aug 2027',
      type: 'Healthcare Tech Innovation Grant',
      activeInterns: 12,
      jointLabs: 'Smart Medical Telemetry Lab',
      status: 'Active'
    },
    {
      partner: 'CloudNova Global',
      signedDate: 'Nov 2024',
      validTill: 'Nov 2027',
      type: 'Cloud Infrastructure Talent Center',
      activeInterns: 8,
      jointLabs: 'Distributed DevOps Training Center',
      status: 'Active'
    }
  ]
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    roleTarget: 'student',
    title: 'Shortlisted for Round 1 Interview!',
    message: 'Apex Digital Labs has shortlisted your application for Java & Cloud Backend Intern.',
    timestamp: '10 mins ago',
    type: 'success',
    read: false
  },
  {
    id: 'notif-2',
    roleTarget: 'student',
    title: 'New Industry Problem Challenge Posted',
    message: 'MediCare Cloud Systems posted "Hospital Queue Optimization Engine". Apply with your faculty guide.',
    timestamp: '2 hours ago',
    type: 'info',
    read: false
  },
  {
    id: 'notif-3',
    roleTarget: 'industry',
    title: 'New High-Match Applicant',
    message: 'Rahul Sharma (Match: 84%) applied for Java & Cloud Backend Intern.',
    timestamp: '4 hours ago',
    type: 'success',
    read: false
  },
  {
    id: 'notif-4',
    roleTarget: 'faculty',
    title: 'Mentorship Request from Rahul Sharma',
    message: 'Rahul requested review for Docker containerization project evidence.',
    timestamp: '1 day ago',
    type: 'info',
    read: true
  },
  {
    id: 'notif-5',
    roleTarget: 'institution',
    title: 'Skill Gap Alert: Cloud Computing',
    message: 'Industry demand reached 86% with student readiness at 34%. Recommend triggering campus bootcamp.',
    timestamp: '1 day ago',
    type: 'warning',
    read: false
  }
];
