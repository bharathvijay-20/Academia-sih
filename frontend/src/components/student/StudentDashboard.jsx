import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { studentService } from '../../services/studentService';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { 
  Award, 
  CheckSquare, 
  Briefcase, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Search,
  ExternalLink,
  Loader2,
  FileCode2,
  TrendingUp,
  HelpCircle,
  BarChart3,
  Star,
  Layers,
  ChevronRight,
  Plus,
  Sparkles,
  Target,
  Brain,
  Zap,
  BookOpen,
  Flame,
  Activity,
  Code2,
  GraduationCap,
  Globe,
  Bookmark,
  PlayCircle,
  Laptop,
  Check
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard Data State
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    profile: {},
    identity: null,
    skills: [],
    assessmentHistory: [],
    jobs: [],
    applications: [],
    notifications: []
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Identity Form State
  const [identityType, setIdentityType] = useState('AADHAAR');
  const [identityNumber, setIdentityNumber] = useState('');
  const [identitySubmitting, setIdentitySubmitting] = useState(false);

  // Skill Declaration State
  const [newSkillName, setNewSkillName] = useState('');
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  // 3-Stage Assessment State
  const [selectedSkillForAssessment, setSelectedSkillForAssessment] = useState('Java');
  const [activeAttempt, setActiveAttempt] = useState(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [stageQuestions, setStageQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  // Placement Prep & Diagnostic Test State
  const [placementViewMode, setPlacementViewMode] = useState('hub'); // 'hub' | 'test' | 'result'
  const [selectedPlacementType, setSelectedPlacementType] = useState('MOCK'); // 'MOCK' | 'CODING' | 'APTITUDE'
  const [currentPlacementIndex, setCurrentPlacementIndex] = useState(0);
  const [placementAnswers, setPlacementAnswers] = useState({});
  const [placementTimer, setPlacementTimer] = useState(900);
  const [placementTestResult, setPlacementTestResult] = useState({
    overallScore: 82,
    codingScore: 88,
    aptitudeScore: 76,
    status: 'PLACEMENT READY',
    confidenceLevel: 'High (Tier-1 Ready)',
    strongConcepts: [
      { name: 'SQL Window Functions & Joins', score: 92, domain: 'Coding' },
      { name: 'Array Two-Pointers & Sliding Window', score: 90, domain: 'Coding' },
      { name: 'Percentages & Profit/Loss', score: 88, domain: 'Aptitude' },
      { name: 'Binary Search Trees (BST)', score: 84, domain: 'Coding' }
    ],
    developingConcepts: [
      { name: 'Logical Syllogisms & Statements', score: 68, domain: 'Aptitude' },
      { name: 'Time, Speed & Relative Distance', score: 65, domain: 'Aptitude' }
    ],
    weakConcepts: [
      { name: 'Dynamic Programming & Memoization', score: 38, domain: 'Coding', impact: 'Crucial for Product Companies (Google, Amazon, Microsoft)' },
      { name: 'Probability & Conditional Permutations', score: 42, domain: 'Aptitude', impact: 'High Frequency in TCS, Cognizant, Infosys Online Assessments' },
      { name: 'Graph BFS/DFS Cycle Detection', score: 45, domain: 'Coding', impact: 'Core for Technical Round 2 Coding Interviews' }
    ],
    recommendations: [
      'Focus on 1D/2D DP state transitions (e.g. 0/1 Knapsack, Coin Change) to master memoization.',
      'Review Permutations vs Combinations formulas and without-replacement probability models.',
      'Practice Graph Cycle Detection using 3-state DFS recursion stack coloring.'
    ]
  });

  const placementQuestionsBank = [
    {
      id: 1,
      domain: 'CODING',
      category: 'Dynamic Programming',
      difficulty: 'Hard',
      title: '0/1 Knapsack & State Transition Optimization',
      question: 'In the 0/1 Knapsack problem with weights W and values V for N items and capacity C, what is the optimal time and space complexity using a 1D DP array?',
      snippet: '// State Transition:\nfor (int i = 0; i < N; i++) {\n  for (int w = C; w >= weights[i]; w--) {\n    dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n  }\n}',
      options: [
        'Time: O(N * C), Space: O(C)',
        'Time: O(2^N), Space: O(N)',
        'Time: O(N log C), Space: O(1)',
        'Time: O(N * C^2), Space: O(C)'
      ],
      correct: 0,
      explanation: 'Using reverse iteration from capacity C down to weights[i], we can optimize the 2D DP matrix into a single 1D array of size C, achieving O(N * C) time and O(C) space.'
    },
    {
      id: 2,
      domain: 'CODING',
      category: 'Trees & BST',
      difficulty: 'Medium',
      title: 'Lowest Common Ancestor in Binary Search Tree',
      question: 'What is the time complexity to find the Lowest Common Ancestor (LCA) of two given nodes p and q in a balanced Binary Search Tree with N nodes?',
      snippet: '// BST LCA Traversal\nif (p.val < root.val && q.val < root.val) return lca(root.left, p, q);\nif (p.val > root.val && q.val > root.val) return lca(root.right, p, q);\nreturn root;',
      options: [
        'O(log N) — proportional to tree height',
        'O(N) — must visit every node',
        'O(1) — constant time hash lookup',
        'O(N log N) — requires sorting'
      ],
      correct: 0,
      explanation: 'In a balanced BST, binary search properties allow moving left or right at each level, reaching the LCA in O(height) = O(log N) time.'
    },
    {
      id: 3,
      domain: 'CODING',
      category: 'SQL Databases',
      difficulty: 'Medium',
      title: 'SQL Window Function for Ranking Without Gaps',
      question: 'Which SQL window function assigns consecutive ranks without skipping rank numbers when values tie (e.g. 1st, 2nd, 2nd, 3rd)?',
      snippet: 'SELECT employee_id, salary, \n       DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rnk\nFROM employees;',
      options: [
        'DENSE_RANK()',
        'RANK()',
        'ROW_NUMBER()',
        'PERCENT_RANK()'
      ],
      correct: 0,
      explanation: 'DENSE_RANK() guarantees consecutive rank values without skips upon ties (1, 2, 2, 3), whereas RANK() leaves gaps (1, 2, 2, 4).'
    },
    {
      id: 4,
      domain: 'CODING',
      category: 'Arrays & Two Pointers',
      difficulty: 'Easy',
      title: 'Optimal Two-Sum on Sorted Array',
      question: 'Given an already sorted integer array of size N, what is the optimal time and auxiliary space complexity to find two numbers that add up to target T?',
      snippet: 'int left = 0, right = n - 1;\nwhile (left < right) {\n  int sum = arr[left] + arr[right];\n  if (sum == target) return true;\n  else if (sum < target) left++;\n  else right--;\n}',
      options: [
        'Time: O(N), Space: O(1)',
        'Time: O(N log N), Space: O(N)',
        'Time: O(N^2), Space: O(1)',
        'Time: O(log N), Space: O(N)'
      ],
      correct: 0,
      explanation: 'Using inward two pointers from opposite ends of a sorted array finds target pairs in single pass O(N) time with O(1) space.'
    },
    {
      id: 5,
      domain: 'CODING',
      category: 'Graph Algorithms',
      difficulty: 'Hard',
      title: 'Cycle Detection in Directed Graph',
      question: 'Which algorithm detects a cycle in a directed graph in linear O(V + E) time?',
      snippet: '// 3-Color States: 0=White (Unvisited), 1=Gray (In Recursion Stack), 2=Black (Finished)',
      options: [
        'DFS with 3-State Recursion Stack Coloring (O(V+E))',
        'Kruskal\'s Minimum Spanning Tree Algorithm',
        'Dijkstra\'s Single-Source Shortest Path',
        'Prim\'s Greedy Algorithm'
      ],
      correct: 0,
      explanation: 'A back-edge pointing to an ancestor currently residing in the active DFS recursion call stack (GRAY state) detects a directed cycle in O(V + E) time.'
    },
    {
      id: 6,
      domain: 'APTITUDE',
      category: 'Time, Speed & Distance',
      difficulty: 'Medium',
      title: 'Relative Speed of Approaching Trains',
      question: 'Two trains 140m and 160m long travel in opposite directions at 60 km/h and 40 km/h on parallel tracks. How many seconds will they take to completely pass each other?',
      snippet: 'Formula: Relative Speed = S1 + S2; Total Distance = L1 + L2; Time = Distance / Speed',
      options: [
        '10.8 seconds',
        '12.4 seconds',
        '9.6 seconds',
        '14.2 seconds'
      ],
      correct: 0,
      explanation: 'Relative Speed = 60 + 40 = 100 km/h = 100 * (5/18) = 27.78 m/s. Total Distance = 140 + 160 = 300m. Time = 300 / 27.78 = 10.8 seconds.'
    },
    {
      id: 7,
      domain: 'APTITUDE',
      category: 'Probability & Combinations',
      difficulty: 'Hard',
      title: 'Probability Without Replacement',
      question: 'A box contains 4 red, 5 blue, and 6 green balls. If 2 balls are drawn at random without replacement, what is the probability that both are red?',
      snippet: 'P(Both Red) = (4 / 15) * (3 / 14)',
      options: [
        '2 / 35',
        '4 / 105',
        '1 / 7',
        '4 / 15'
      ],
      correct: 0,
      explanation: 'Total balls = 15. Probability = (4/15) * (3/14) = 12 / 210 = 2 / 35.'
    },
    {
      id: 8,
      domain: 'APTITUDE',
      category: 'Logical Syllogisms',
      difficulty: 'Medium',
      title: 'Logical Deduction & Syllogism',
      question: 'Statements: (1) All software engineers are problem solvers. (2) Some problem solvers are architects. Conclusions: I. Some engineers are architects. II. All architects are engineers. Which conclusion(s) logically follow?',
      snippet: 'Venn Diagram: Engineers ⊂ Problem Solvers; Architects ∩ Problem Solvers ≠ ∅',
      options: [
        'Neither conclusion I nor II follows',
        'Only conclusion I follows',
        'Only conclusion II follows',
        'Both conclusions follow'
      ],
      correct: 0,
      explanation: 'Because the intersection between problem solvers and architects does not necessarily overlap with software engineers, neither conclusion follows.'
    },
    {
      id: 9,
      domain: 'APTITUDE',
      category: 'Percentages & Profit/Loss',
      difficulty: 'Medium',
      title: 'Markup and Successive Discounts',
      question: 'A retailer marks up a laptop by 40% over cost price, and then offers two successive discounts of 10% and 10%. What is the net profit percentage?',
      snippet: 'Net SP = CP * (1 + 0.40) * (1 - 0.10) * (1 - 0.10) = CP * 1.40 * 0.90 * 0.90',
      options: [
        '13.4% Profit',
        '16.0% Profit',
        '10.2% Profit',
        '18.5% Profit'
      ],
      correct: 0,
      explanation: 'Let CP = 100. Marked Price = 140. After 1st 10% discount = 126. After 2nd 10% discount = 126 - 12.6 = 113.4. Net Profit = 13.4%.'
    },
    {
      id: 10,
      domain: 'APTITUDE',
      category: 'Number Series & Pattern Puzzles',
      difficulty: 'Easy',
      title: 'Missing Number Series Pattern',
      question: 'Find the next number in the sequence: 3, 8, 18, 38, 78, ?',
      snippet: 'Pattern Rule: (prev_num * 2) + 2',
      options: [
        '158',
        '148',
        '162',
        '156'
      ],
      correct: 0,
      explanation: 'Pattern: Each term is (previous * 2) + 2. (78 * 2) + 2 = 156 + 2 = 158.'
    }
  ];

  // W3Schools Skill Learning Tracks State & Data
  const [searchLearningKeyword, setSearchLearningKeyword] = useState('');
  const [selectedLearningCategory, setSelectedLearningCategory] = useState('ALL');
  const [selectedLearningLevel, setSelectedLearningLevel] = useState('ALL');
  const [activeLearningTrackModal, setActiveLearningTrackModal] = useState(null);
  const [bookmarkedTracks, setBookmarkedTracks] = useState(['w3-dsa', 'w3-java', 'w3-sql']);

  const w3LearningTracks = [
    {
      id: 'w3-dsa',
      title: 'Data Structures & Algorithms (DSA)',
      skillName: 'DSA',
      category: 'Algorithms & DSA',
      level: 'Intermediate',
      icon: '⚡',
      badgeColor: 'text-indigo-400 bg-indigo-950 border-indigo-800',
      w3Url: 'https://www.w3schools.com/dsa/',
      exercisesUrl: 'https://www.w3schools.com/dsa/dsa_exercises.php',
      quizUrl: 'https://www.w3schools.com/dsa/dsa_quiz.php',
      duration: '24 Hours • 68 Chapters',
      rating: '4.9/5.0',
      placementPriority: 'High - Tier-1 Product Companies Filter',
      description: 'Master Big-O asymptotic notation, Arrays, Linked Lists, Stacks, Queues, Binary Trees, BSTs, Graph Traversals (BFS/DFS), Dynamic Programming, and Sorting on W3Schools.',
      keyTopics: [
        'Big-O Time & Space Complexity',
        'Arrays, Linked Lists & Pointers',
        'Binary Search & Tree Traversals',
        'Graph BFS / DFS & Cycle Detection',
        'Dynamic Programming & Memoization',
        'Greedy Algorithms & Recursion'
      ],
      tryItCode: `// W3Schools DSA: QuickSort Partition Logic
int partition(int arr[], int low, int high) {
  int pivot = arr[high];
  int i = (low - 1);
  for (int j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      swap(arr[i], arr[j]);
    }
  }
  swap(arr[i + 1], arr[high]);
  return (i + 1);
}`,
      relevance: 'Targeted in Google, Microsoft, Amazon, Swiggy, Uber Technical Rounds.'
    },
    {
      id: 'w3-java',
      title: 'Java OOP & Enterprise Backend Track',
      skillName: 'Java',
      category: 'Backend & Languages',
      level: 'Beginner',
      icon: '☕',
      badgeColor: 'text-amber-400 bg-amber-950 border-amber-800',
      w3Url: 'https://www.w3schools.com/java/',
      exercisesUrl: 'https://www.w3schools.com/java/java_exercises.asp',
      quizUrl: 'https://www.w3schools.com/java/java_quiz.asp',
      duration: '20 Hours • 54 Chapters',
      rating: '4.9/5.0',
      placementPriority: 'High - Core Placement Tech Stack',
      description: 'Comprehensive Java learning track covering JVM architecture, OOP concepts, Collections Framework (ArrayList, HashMap), Multi-threading, Exception Handling, Lambdas, and Streams API.',
      keyTopics: [
        'Java Syntax, Datatypes & Operators',
        'OOP: Polymorphism, Encapsulation, Abstraction',
        'Collections Framework (List, Set, Map)',
        'Multi-Threading & Thread Synchronization',
        'Java Lambda Expressions & Streams API',
        'File Handling & Exception Management'
      ],
      tryItCode: `// W3Schools Java: Stream API & Lambda Filter
import java.util.*;
import java.util.stream.*;

public class Main {
  public static void main(String[] args) {
    List<String> names = Arrays.asList("Apex", "Google", "Amazon", "Infosys");
    List<String> result = names.stream()
      .filter(s -> s.startsWith("A"))
      .collect(Collectors.toList());
    System.out.println(result);
  }
}`,
      relevance: 'Standard language for TCS Digital, Cognizant GenC Next, Oracle, and Spring Boot Backends.'
    },
    {
      id: 'w3-sql',
      title: 'SQL Database Architecture & Window Functions',
      skillName: 'SQL',
      category: 'Databases & Cloud',
      level: 'Beginner',
      icon: '🗄️',
      badgeColor: 'text-cyan-400 bg-cyan-950 border-cyan-800',
      w3Url: 'https://www.w3schools.com/sql/',
      exercisesUrl: 'https://www.w3schools.com/sql/sql_exercises.asp',
      quizUrl: 'https://www.w3schools.com/sql/sql_quiz.asp',
      duration: '16 Hours • 45 Chapters',
      rating: '4.9/5.0',
      placementPriority: 'High - Universal Screening Question',
      description: 'Master relational queries, Complex Multi-Table JOINs, Subqueries, Aggregations, Window Functions (DENSE_RANK, ROW_NUMBER, OVER), Indexes, and Transactions on W3Schools.',
      keyTopics: [
        'SELECT, WHERE, ORDER BY, GROUP BY, HAVING',
        'INNER, LEFT, RIGHT, FULL OUTER JOINs',
        'Window Functions (ROW_NUMBER, DENSE_RANK)',
        'Subqueries, CTEs (WITH Clause) & EXISTS',
        'Database Normalization & Constraints',
        'Transactions, ACID Properties & Indexing'
      ],
      tryItCode: `-- W3Schools SQL: DENSE_RANK Window Query
SELECT employee_id, department, salary,
       DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank_in_dept
FROM employees;`,
      relevance: 'Essential for Data Engineering, Full-Stack Roles, Amazon, Goldman Sachs, and Product Companies.'
    },
    {
      id: 'w3-react',
      title: 'React.js Component Architecture & Hooks',
      skillName: 'React',
      category: 'Web & Frontend',
      level: 'Intermediate',
      icon: '⚛️',
      badgeColor: 'text-sky-400 bg-sky-950 border-sky-800',
      w3Url: 'https://www.w3schools.com/react/',
      exercisesUrl: 'https://www.w3schools.com/react/react_exercises.asp',
      quizUrl: 'https://www.w3schools.com/react/react_quiz.asp',
      duration: '18 Hours • 42 Chapters',
      rating: '4.8/5.0',
      placementPriority: 'High - High Demand Frontend Role',
      description: 'Master JSX syntax, Functional Components, Props & State, React Hooks (useState, useEffect, useMemo, useCallback), Context API, and Custom Hooks on W3Schools.',
      keyTopics: [
        'JSX & Virtual DOM Architecture',
        'Component Props, State & Event Handling',
        'Hooks: useState, useEffect, useRef',
        'Advanced Hooks: useMemo & useCallback',
        'Global State Management & Context API',
        'React Router & SPA Client Navigation'
      ],
      tryItCode: `// W3Schools React: Custom Reactive Counter Hook
import { useState, useEffect } from 'react';

export function useTimer(initialSeconds = 60) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(timer);
  }, []);
  return seconds;
}`,
      relevance: 'Frontend & Full Stack roles at top startups, unicorn tech companies, and modern SaaS enterprises.'
    },
    {
      id: 'w3-python',
      title: 'Python Core & Scripting Fundamentals',
      skillName: 'Python',
      category: 'Backend & Languages',
      level: 'Beginner',
      icon: '🐍',
      badgeColor: 'text-emerald-400 bg-emerald-950 border-emerald-800',
      w3Url: 'https://www.w3schools.com/python/',
      exercisesUrl: 'https://www.w3schools.com/python/python_exercises.asp',
      quizUrl: 'https://www.w3schools.com/python/python_quiz.asp',
      duration: '18 Hours • 50 Chapters',
      rating: '4.9/5.0',
      placementPriority: 'High - Fast Algorithm Coding',
      description: 'Learn Python data structures (Lists, Tuples, Sets, Dicts), List Comprehensions, OOP Classes, File I/O, Generators, Decorators, and Standard Libraries on W3Schools.',
      keyTopics: [
        'Variables, Flow Control & Slicing',
        'Lists, Dictionaries, Sets & Tuples',
        'List & Dict Comprehensions',
        'OOP Classes, Inheritance & Dunder Methods',
        'Iterators, Generators & Decorators',
        'Exception Handling & Virtual Environments'
      ],
      tryItCode: `# W3Schools Python: Generator Function for Large Datasets
def prime_generator(limit):
    for num in range(2, limit):
        if all(num % i != 0 for i in range(2, int(num ** 0.5) + 1)):
            yield num

primes = list(prime_generator(30))
print("Primes:", primes)`,
      relevance: 'Preferred coding test language due to concise syntax in LeetCode and Online Assessments.'
    },
    {
      id: 'w3-js',
      title: 'JavaScript Modern ES6+ & Async/Await',
      skillName: 'JavaScript',
      category: 'Web & Frontend',
      level: 'Beginner',
      icon: '🟨',
      badgeColor: 'text-yellow-400 bg-yellow-950 border-yellow-800',
      w3Url: 'https://www.w3schools.com/js/',
      exercisesUrl: 'https://www.w3schools.com/js/js_exercises.asp',
      quizUrl: 'https://www.w3schools.com/js/js_quiz.asp',
      duration: '22 Hours • 65 Chapters',
      rating: '4.9/5.0',
      placementPriority: 'High - Universal Web Standard',
      description: 'Deep-dive into Event Loop, Closures, Prototypal Inheritance, Promises, Async/Await, DOM manipulation, Destructuring, and Modern ES2024 features on W3Schools.',
      keyTopics: [
        'Closures & Scope Chain Execution',
        'Event Loop, Microtasks & Macrotasks',
        'Promises & Async / Await Pipelines',
        'Prototypes, Classes & ES Modules',
        'DOM Manipulation & Event Bubbling',
        'Array Methods (map, filter, reduce)'
      ],
      tryItCode: `// W3Schools JavaScript: Async Fetch Pipeline
async function fetchCandidateData(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.filter(item => item.verified === true);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}`,
      relevance: 'Mandatory for all Web Developer and Full-Stack Engineering roles.'
    },
    {
      id: 'w3-cpp',
      title: 'C++ Systems Programming & STL Library',
      skillName: 'C++',
      category: 'Backend & Languages',
      level: 'Advanced',
      icon: '⚙️',
      badgeColor: 'text-blue-400 bg-blue-950 border-blue-800',
      w3Url: 'https://www.w3schools.com/cpp/',
      exercisesUrl: 'https://www.w3schools.com/cpp/cpp_exercises.asp',
      duration: '16 Hours • 40 Chapters',
      rating: '4.8/5.0',
      placementPriority: 'High - High Performance Computing',
      description: 'Master Pointers, Dynamic Memory Allocation (new/delete), References, Standard Template Library (STL vectors, maps, priority queues), and Template Metaprogramming on W3Schools.',
      keyTopics: [
        'Pointers, References & Memory Management',
        'STL Vectors, Sets, Maps & Deques',
        'STL Priority Queue (Min/Max Heaps)',
        'Object-Oriented C++ & Virtual Methods',
        'Operator Overloading & Move Semantics'
      ],
      tryItCode: `// W3Schools C++: STL Priority Queue Max-Heap
#include <iostream>
#include <queue>
using namespace std;

int main() {
    priority_queue<int> maxHeap;
    maxHeap.push(10);
    maxHeap.push(30);
    maxHeap.push(20);
    cout << "Top Element: " << maxHeap.top() << endl; // 30
    return 0;
}`,
      relevance: 'Top choice for Competitive Programming, High-Frequency Trading, and System Software.'
    },
    {
      id: 'w3-git',
      title: 'Git Version Control & Collaboration Workflows',
      skillName: 'Git',
      category: 'Databases & Cloud',
      level: 'Beginner',
      icon: '🐙',
      badgeColor: 'text-orange-400 bg-orange-950 border-orange-800',
      w3Url: 'https://www.w3schools.com/git/',
      exercisesUrl: 'https://www.w3schools.com/git/git_exercises.asp',
      duration: '8 Hours • 25 Chapters',
      rating: '4.9/5.0',
      placementPriority: 'Medium - Professional Engineering Prerequisite',
      description: 'Learn branching, merging, rebasing, resolving merge conflicts, Git stash, Cherry-pick, and pull request collaboration workflows on W3Schools.',
      keyTopics: [
        'git init, add, commit, status, log',
        'Branching, Merging & Rebase Flow',
        'Merge Conflict Isolation & Resolution',
        'Git Stash, Reset, Revert & Clean',
        'Remote Repositories & Pull Requests'
      ],
      tryItCode: `# W3Schools Git Workflow
git checkout -b feature/placement-module
git add .
git commit -m "feat: add W3Schools learning tracks"
git push origin feature/placement-module`,
      relevance: 'Essential for all corporate software team onboarding and code reviews.'
    },
    {
      id: 'w3-mysql',
      title: 'MySQL Database Administration & Optimization',
      skillName: 'MySQL',
      category: 'Databases & Cloud',
      level: 'Intermediate',
      icon: '🐬',
      badgeColor: 'text-teal-400 bg-teal-950 border-teal-800',
      w3Url: 'https://www.w3schools.com/mysql/',
      exercisesUrl: 'https://www.w3schools.com/mysql/mysql_exercises.asp',
      duration: '14 Hours • 38 Chapters',
      rating: '4.8/5.0',
      placementPriority: 'Medium - Production Backend Persistence',
      description: 'Learn MySQL database schema design, Foreign Key constraints, Stored Procedures, Views, Triggers, and query performance tuning on W3Schools.',
      keyTopics: [
        'Database & Table Creation with Constraints',
        'Foreign Keys, Cascades & Data Integrity',
        'Stored Procedures & Custom Functions',
        'Indexes, B-Trees & Query EXPLAIN Plans'
      ],
      tryItCode: `-- W3Schools MySQL: Create Indexed Table with Constraints
CREATE TABLE student_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  INDEX idx_student (student_id)
);`,
      relevance: 'Production backend database standard for enterprise web applications.'
    },
    {
      id: 'w3-ai-ml',
      title: 'Artificial Intelligence & Machine Learning Fundamentals',
      skillName: 'AI & ML',
      category: 'AI & Data Science',
      level: 'Intermediate',
      icon: '🤖',
      badgeColor: 'text-purple-400 bg-purple-950 border-purple-800',
      w3Url: 'https://www.w3schools.com/ai/',
      exercisesUrl: 'https://www.w3schools.com/python/python_ml_getting_started.asp',
      duration: '15 Hours • 35 Chapters',
      rating: '4.8/5.0',
      placementPriority: 'High - Modern AI/ML Opportunities',
      description: 'Explore Machine Learning algorithms (Linear Regression, Decision Trees, K-Means), Neural Networks basics, Prompt Engineering, and Python AI libraries on W3Schools.',
      keyTopics: [
        'Supervised vs Unsupervised Machine Learning',
        'Linear Regression & Polynomial Models',
        'Decision Trees, Random Forests & Confusion Matrix',
        'Generative AI & Neural Network Principles'
      ],
      tryItCode: `# W3Schools Python ML: Linear Regression Example
from scipy import stats
x = [5,7,8,7,2,17,2,9,4,11,12,9,6]
y = [99,86,87,88,111,86,103,87,94,78,77,85,86]
slope, intercept, r, p, std_err = stats.linregress(x, y)
print(f"R-squared: {r**2:.4f}")`,
      relevance: 'High demand for AI Engineer, Data Scientist, and Applied ML Developer roles.'
    },
    {
      id: 'w3-cyber',
      title: 'Cyber Security & Web Security Fundamentals',
      skillName: 'Cyber Security',
      category: 'Databases & Cloud',
      level: 'Intermediate',
      icon: '🛡️',
      badgeColor: 'text-rose-400 bg-rose-950 border-rose-800',
      w3Url: 'https://www.w3schools.com/cybersecurity/',
      duration: '12 Hours • 30 Chapters',
      rating: '4.7/5.0',
      placementPriority: 'Medium - Secure Software Development',
      description: 'Understand OWASP Top 10 vulnerabilities (SQL Injection, XSS, CSRF), Cryptography, Authentication tokens (JWT), and Security best practices on W3Schools.',
      keyTopics: [
        'OWASP Top 10 Vulnerabilities',
        'SQL Injection & Parameterized Queries',
        'Cross-Site Scripting (XSS) Prevention',
        'JWT Auth, Hashing & HTTPS Encryption'
      ],
      tryItCode: `// Secure Code Example: Parameterized SQL to prevent injection
const sql = "SELECT * FROM users WHERE email = ? AND status = ?";
db.query(sql, [userEmail, "ACTIVE"], (err, results) => {
  // Safe from SQL Injection!
});`,
      relevance: 'Essential knowledge for Secure Coding interviews and InfoSec certification.'
    },
    {
      id: 'w3-html-css',
      title: 'HTML5 & Modern CSS3 Flexbox/Grid',
      skillName: 'HTML & CSS',
      category: 'Web & Frontend',
      level: 'Beginner',
      icon: '🌐',
      badgeColor: 'text-emerald-400 bg-emerald-950 border-emerald-800',
      w3Url: 'https://www.w3schools.com/html/',
      exercisesUrl: 'https://www.w3schools.com/html/html_exercises.asp',
      quizUrl: 'https://www.w3schools.com/html/html_quiz.asp',
      duration: '14 Hours • 45 Chapters',
      rating: '4.9/5.0',
      placementPriority: 'Medium - Web Foundation',
      description: 'Master Semantic HTML5, Responsive Web Design, CSS Flexbox, CSS Grid, Media Queries, Transitions, and Web Accessibility (a11y) on W3Schools.',
      keyTopics: [
        'Semantic HTML5 Tags & Accessibility',
        'CSS Flexbox Layouts & Alignment',
        'CSS Grid Template Columns & Areas',
        'Responsive Media Queries & Dark Modes'
      ],
      tryItCode: `/* W3Schools CSS: Modern Responsive Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}`,
      relevance: 'Foundation of all UI engineering and web frontend assessments.'
    }
  ];

  // Job Search Filter & View
  const [searchJobKeyword, setSearchJobKeyword] = useState('');
  const [qualificationFilter, setQualificationFilter] = useState('ALL');
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);

  // Internship Packages Filter & View
  const [searchInternshipKeyword, setSearchInternshipKeyword] = useState('');
  const [internshipFilter, setInternshipFilter] = useState('ALL');
  const [applyingInternshipId, setApplyingInternshipId] = useState(null);
  const [internshipsList, setInternshipsList] = useState([
    {
      id: 'int-001',
      title: 'Full Stack Software Engineering Intern',
      company: 'Apex Digital Labs',
      location: 'Bengaluru, India (Hybrid)',
      type: '6 Months Internship + PPO',
      stipend: '₹45,000 / month',
      ppoPackage: '₹14.5 - 18.0 LPA',
      description: 'Join the Core Platform Engineering team to build scalable microservices, reactive UI components, and real-time event pipelines for enterprise analytics.',
      requiredSkills: ['SQL', 'React', 'Java', 'Spring Boot'],
      matchScore: 94,
      qualificationState: 'PERFECTLY_QUALIFIED',
      matchedSkills: [
        { skill: 'SQL', score: 80 },
        { skill: 'React', score: 75 }
      ],
      missingSkills: [],
      perks: ['Pre-Placement Offer (PPO)', 'Flexible Working Hours', 'MacBook Pro Setup', 'Mentorship from Staff Engineers'],
      isApplied: false
    },
    {
      id: 'int-002',
      title: 'Cloud Systems & DevOps Engineering Intern',
      company: 'CloudScale Technologies',
      location: 'Hyderabad, India (Remote)',
      type: '6 Months Internship',
      stipend: '₹40,000 / month',
      ppoPackage: '₹12.0 - 16.0 LPA',
      description: 'Architect container orchestration pipelines, optimize CI/CD release workflows, and implement automated infrastructure monitoring on Kubernetes.',
      requiredSkills: ['Docker', 'Linux', 'SQL'],
      matchScore: 85,
      qualificationState: 'QUALIFIED',
      matchedSkills: [
        { skill: 'SQL', score: 80 }
      ],
      missingSkills: ['Docker'],
      perks: ['AWS Certification Sponsorship', 'Wellness Allowance', 'PPO Track'],
      isApplied: false
    },
    {
      id: 'int-003',
      title: 'AI/ML Systems Research Intern',
      company: 'NeuroSynthetix AI',
      location: 'Pune / Remote',
      type: '3 Months Summer Internship',
      stipend: '₹55,000 / month',
      ppoPackage: '₹18.0 - 24.0 LPA',
      description: 'Train and fine-tune large language models, evaluate embedding clustering performance, and deploy scalable inference microservices.',
      requiredSkills: ['Python', 'SQL', 'FastAPI'],
      matchScore: 78,
      qualificationState: 'QUALIFIED',
      matchedSkills: [
        { skill: 'SQL', score: 80 }
      ],
      missingSkills: ['Python'],
      perks: ['High-Performance GPU Clusters Access', 'Research Publication Support', '₹55k Stipend'],
      isApplied: false
    },
    {
      id: 'int-004',
      title: 'Enterprise Java & Microservices Intern',
      company: 'FinTech Nexus Systems',
      location: 'Mumbai, India (On-Site)',
      type: '6 Months Internship + PPO',
      stipend: '₹50,000 / month',
      ppoPackage: '₹16.0 - 20.0 LPA',
      description: 'Develop high-throughput transaction processing APIs with Spring Boot, PostgreSQL, and Kafka event streaming for tier-1 banking institutions.',
      requiredSkills: ['Java', 'Spring Boot', 'SQL'],
      matchScore: 88,
      qualificationState: 'QUALIFIED',
      matchedSkills: [
        { skill: 'SQL', score: 80 }
      ],
      missingSkills: ['Java'],
      perks: ['Tier-1 Banking Domain Exposure', 'Competitive PPO Package', 'Meal & Travel Subsidies'],
      isApplied: false
    },
    {
      id: 'int-005',
      title: 'Frontend Experience & Design Systems Intern',
      company: 'Zenith UI Studios',
      location: 'Gurugram, India (Hybrid)',
      type: '4 Months Internship',
      stipend: '₹35,000 / month',
      ppoPackage: '₹10.0 - 13.5 LPA',
      description: 'Craft responsive, accessible component design systems with React, Tailwind CSS, and Web Animations for next-gen consumer SaaS apps.',
      requiredSkills: ['React', 'JavaScript', 'CSS/Design'],
      matchScore: 90,
      qualificationState: 'PERFECTLY_QUALIFIED',
      matchedSkills: [
        { skill: 'React', score: 75 }
      ],
      missingSkills: [],
      perks: ['UX/UI Design Mentorship', 'Paid Creative Subscriptions', 'PPO Evaluation'],
      isApplied: false
    }
  ]);

  // Fetch student dashboard data
  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await studentService.getDashboard();
      setDashboardData({
        profile: res.profile || {},
        identity: res.identity || null,
        skills: res.skills || [],
        assessmentHistory: res.assessmentHistory || [],
        jobs: res.jobs || [],
        applications: res.applications || [],
        notifications: res.notifications || []
      });
    } catch (err) {
      console.warn('Dashboard load notice:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Identity Verification Handler
  const handleVerifyIdentity = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIdentitySubmitting(true);

    try {
      const res = await studentService.verifyIdentity({
        identityType,
        identityNumber,
        fullName: dashboardData.profile?.name,
        institution: dashboardData.profile?.college
      });
      setSuccessMessage(res.message || 'Identity verified successfully!');
      setIdentityNumber('');
      await loadDashboard();
    } catch (err) {
      setErrorMessage(err.message || 'Identity verification failed.');
    } finally {
      setIdentitySubmitting(false);
    }
  };

  // Add Self-Declared Skill Handler
  const handleDeclareSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      await studentService.declareSkill(newSkillName.trim(), 50);
      setNewSkillName('');
      setShowAddSkillModal(false);
      await loadDashboard();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add skill.');
    }
  };

  // Start 3-Stage Assessment
  const handleStartAssessment = async (skillName) => {
    setErrorMessage('');
    setSuccessMessage('');
    setAssessmentResult(null);
    setUserAnswers({});
    setAssessmentLoading(true);

    try {
      const res = await studentService.startAssessment(skillName);
      setActiveAttempt(res.attemptId);
      setCurrentStage(res.currentStage);
      setStageQuestions(res.questions);
      setSelectedSkillForAssessment(skillName);
      setActiveTab('assessment');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to start assessment.');
    } finally {
      setAssessmentLoading(false);
    }
  };

  // Submit Stage Answers
  const handleSubmitStage = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setAssessmentLoading(true);

    try {
      const res = await studentService.submitStage({
        attemptId: activeAttempt,
        stage: currentStage,
        answers: userAnswers
      });

      if (res.completed) {
        setAssessmentResult(res.analysis);
        setActiveAttempt(null);
        await loadDashboard();
      } else {
        setCurrentStage(res.nextStage);
        setStageQuestions(res.questions);
        setUserAnswers({});
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit stage.');
    } finally {
      setAssessmentLoading(false);
    }
  };

  // Placement Test Timer Countdown
  useEffect(() => {
    let interval = null;
    if (placementViewMode === 'test' && placementTimer > 0) {
      interval = setInterval(() => {
        setPlacementTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [placementViewMode, placementTimer]);

  const activePlacementQuestions = selectedPlacementType === 'CODING'
    ? placementQuestionsBank.filter(q => q.domain === 'CODING')
    : selectedPlacementType === 'APTITUDE'
    ? placementQuestionsBank.filter(q => q.domain === 'APTITUDE')
    : placementQuestionsBank;

  const handleStartPlacementTest = (type = 'MOCK') => {
    setSelectedPlacementType(type);
    setCurrentPlacementIndex(0);
    setPlacementAnswers({});
    const totalQ = type === 'MOCK' ? 10 : 5;
    setPlacementTimer(totalQ * 90); // 90 seconds per question
    setPlacementViewMode('test');
  };

  const handleSelectPlacementAnswer = (questionId, optionIndex) => {
    setPlacementAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitPlacementTest = () => {
    const questionsToEval = activePlacementQuestions;
    let codingCorrect = 0;
    let codingTotal = 0;
    let aptitudeCorrect = 0;
    let aptitudeTotal = 0;
    let totalCorrect = 0;

    const answeredDetails = questionsToEval.map(q => {
      const selected = placementAnswers[q.id];
      const isCorrect = selected === q.correct;
      if (q.domain === 'CODING') {
        codingTotal++;
        if (isCorrect) codingCorrect++;
      } else {
        aptitudeTotal++;
        if (isCorrect) aptitudeCorrect++;
      }
      if (isCorrect) totalCorrect++;
      return {
        ...q,
        userSelected: selected,
        isCorrect
      };
    });

    const overallScore = Math.round((totalCorrect / questionsToEval.length) * 100);
    const codingScore = codingTotal > 0 ? Math.round((codingCorrect / codingTotal) * 100) : 85;
    const aptitudeScore = aptitudeTotal > 0 ? Math.round((aptitudeCorrect / aptitudeTotal) * 100) : 80;

    const strongList = [];
    const weakList = [];
    const developingList = [];

    answeredDetails.forEach(item => {
      if (item.isCorrect) {
        strongList.push({
          name: item.category,
          score: 100,
          domain: item.domain === 'CODING' ? 'Coding' : 'Aptitude'
        });
      } else {
        weakList.push({
          name: item.category,
          score: 0,
          domain: item.domain === 'CODING' ? 'Coding' : 'Aptitude',
          impact: item.domain === 'CODING' ? 'High Impact in Technical Rounds & Coding Assessments' : 'Screening Filter in Tier-1 & Tier-2 Placement Drives'
        });
      }
    });

    setPlacementTestResult({
      overallScore,
      codingScore,
      aptitudeScore,
      status: overallScore >= 80 ? 'TIER-1 PLACEMENT READY' : overallScore >= 50 ? 'INTERMEDIATE - TARGET REVISION' : 'NEEDS FOUNDATIONAL PRACTICE',
      confidenceLevel: overallScore >= 80 ? 'Very High (Top Tier Confident)' : overallScore >= 50 ? 'Moderate (Ready with Brush-up)' : 'Building Stage',
      strongConcepts: strongList.length > 0 ? strongList : [
        { name: 'SQL Window Functions & Joins', score: 92, domain: 'Coding' },
        { name: 'Array Two-Pointers & Sorting', score: 90, domain: 'Coding' }
      ],
      developingConcepts: developingList.length > 0 ? developingList : [
        { name: 'Percentages & Profit/Loss', score: 70, domain: 'Aptitude' },
        { name: 'Binary Search Trees (BST)', score: 65, domain: 'Coding' }
      ],
      weakConcepts: weakList.length > 0 ? weakList : [
        { name: 'Dynamic Programming (0/1 Knapsack & Memoization)', score: 40, domain: 'Coding', impact: 'Crucial for Product Companies (Google, Amazon, Microsoft)' },
        { name: 'Probability & Conditional Permutations', score: 45, domain: 'Aptitude', impact: 'High Frequency in TCS, Cognizant, Infosys Online Assessments' }
      ],
      recommendations: [
        codingScore < 80 ? 'Strengthen Dynamic Programming state transitions and Graph cycle detection algorithms.' : 'DSA logic is solid! Keep maintaining speed on LeetCode Mediums.',
        aptitudeScore < 80 ? 'Practice Time-Speed-Distance relative speed and Probability without-replacement problems.' : 'Quantitative & Logical Aptitude is at top percentile level!',
        'Review the detailed question explanations below to eliminate recurring misconceptions.'
      ],
      evaluatedQuestions: answeredDetails
    });

    setPlacementViewMode('result');
  };

  // Apply to Job
  const handleApplyJob = async (jobId) => {
    setErrorMessage('');
    setSuccessMessage('');
    setApplyingJobId(jobId);

    try {
      await studentService.applyJob(jobId, 'Application submitted with verified skill credentials.');
      setSuccessMessage('Application submitted successfully!');
      await loadDashboard();
    } catch (err) {
      setErrorMessage(err.message || 'Application submission failed.');
    } finally {
      setApplyingJobId(null);
    }
  };

  // Notifications click navigation & persistent read update
  const handleNotificationClick = async (notif) => {
    try {
      await studentService.markNotificationRead(notif.id);
      setDashboardData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => n.id === notif.id ? { ...n, is_read: 1, read: true } : n)
      }));
    } catch (err) {
      console.warn('Failed to mark notification read:', err);
    }

    if (notif.link && notif.link.includes('opportunities')) {
      setActiveTab('opportunities');
    } else if (notif.link && notif.link.includes('passport')) {
      setActiveTab('passport');
    } else if (notif.link && notif.link.includes('assessment')) {
      setActiveTab('assessment');
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await studentService.markNotificationRead('all');
      setDashboardData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, is_read: 1, read: true }))
      }));
    } catch (err) {
      console.warn('Failed to mark all notifications read:', err);
    }
  };

  const verifiedSkills = dashboardData.skills.filter(s => s.isVerified);
  const selfDeclaredSkills = dashboardData.skills.filter(s => !s.isVerified);

  // Evaluated internships based on live verified skills
  const evaluatedInternships = internshipsList.map(internship => {
    const matched = [];
    const missing = [];

    internship.requiredSkills.forEach(reqSkill => {
      const match = verifiedSkills.find(v => v.name.toLowerCase() === reqSkill.toLowerCase());
      if (match) {
        matched.push({ skill: reqSkill, score: match.overallScore || match.score || 80 });
      } else {
        missing.push(reqSkill);
      }
    });

    const hasMissingSkills = missing.length > 0;
    const matchScore = Math.round((matched.length / internship.requiredSkills.length) * 100);
    const qualState = missing.length === 0 ? 'PERFECTLY_QUALIFIED' : matched.length > 0 ? 'QUALIFIED' : 'NEEDS_IMPROVEMENT';

    return {
      ...internship,
      matchedSkills: matched,
      missingSkills: missing,
      hasMissingSkills,
      matchScore: matchScore > 0 ? matchScore : 35,
      qualificationState: qualState
    };
  });

  // Apply to Internship Offer
  const handleApplyInternship = async (internshipId) => {
    setErrorMessage('');
    setSuccessMessage('');

    const internship = evaluatedInternships.find(i => i.id === internshipId);
    if (!internship) return;

    if (internship.hasMissingSkills) {
      setErrorMessage(`Cannot apply: Please complete assessment and verify all missing skills (${internship.missingSkills.join(', ')}) first.`);
      return;
    }

    setApplyingInternshipId(internshipId);

    try {
      // Mark applied in local state
      setInternshipsList(prev => prev.map(item => item.id === internshipId ? { ...item, isApplied: true } : item));

      // Append to application tracker
      const newApp = {
        id: `app-int-${Date.now()}`,
        job_id: internshipId,
        title: `${internship.title} • ${internship.stipend}`,
        company: internship.company,
        company_name: internship.company,
        location: internship.location,
        type: 'INTERNSHIP_PACKAGE',
        stipend: internship.stipend,
        status: 'OFFER_PENDING',
        applied_at: new Date().toISOString(),
        match_score: internship.matchScore
      };

      setDashboardData(prev => ({
        ...prev,
        applications: [newApp, ...prev.applications],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            type: 'SUCCESS',
            title: `Internship Applied: ${internship.company}`,
            message: `Your verified skill credentials have been submitted for ${internship.title} (${internship.stipend}).`,
            is_read: 0,
            link: 'applications'
          },
          ...prev.notifications
        ]
      }));

      setSuccessMessage(`Application for "${internship.title}" (${internship.stipend}) submitted successfully to ${internship.company}!`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit internship application.');
    } finally {
      setApplyingInternshipId(null);
    }
  };

  // Filtered Jobs
  const filteredJobs = dashboardData.jobs.filter(job => {
    const matchesKeyword = !searchJobKeyword || 
      job.title.toLowerCase().includes(searchJobKeyword.toLowerCase()) ||
      job.company.toLowerCase().includes(searchJobKeyword.toLowerCase()) ||
      job.requiredSkills.some(s => s.toLowerCase().includes(searchJobKeyword.toLowerCase()));

    const matchesQual = qualificationFilter === 'ALL' || job.qualificationState === qualificationFilter;
    return matchesKeyword && matchesQual;
  });

  // Filtered Internships
  const filteredInternships = evaluatedInternships.filter(internship => {
    const matchesKeyword = !searchInternshipKeyword || 
      internship.title.toLowerCase().includes(searchInternshipKeyword.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchInternshipKeyword.toLowerCase()) ||
      internship.requiredSkills.some(s => s.toLowerCase().includes(searchInternshipKeyword.toLowerCase()));

    const matchesFilter = internshipFilter === 'ALL' || 
      internship.qualificationState === internshipFilter || 
      (internshipFilter === 'PPO' && internship.ppoPackage);
    return matchesKeyword && matchesFilter;
  });

  // Filtered W3Schools Learning Tracks
  const filteredLearningTracks = w3LearningTracks.filter(track => {
    const matchesKeyword = !searchLearningKeyword || 
      track.title.toLowerCase().includes(searchLearningKeyword.toLowerCase()) ||
      track.skillName.toLowerCase().includes(searchLearningKeyword.toLowerCase()) ||
      track.description.toLowerCase().includes(searchLearningKeyword.toLowerCase()) ||
      track.keyTopics.some(t => t.toLowerCase().includes(searchLearningKeyword.toLowerCase()));

    const matchesCategory = selectedLearningCategory === 'ALL' || track.category === selectedLearningCategory;
    const matchesLevel = selectedLearningLevel === 'ALL' || track.level === selectedLearningLevel;
    return matchesKeyword && matchesCategory && matchesLevel;
  });

  const toggleBookmarkTrack = (trackId) => {
    setBookmarkedTracks(prev => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-xs font-medium text-slate-400">Loading Student Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Navbar 
        notifications={dashboardData.notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      {/* Main Dashboard Layout */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar */}
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main Content Area */}
          <section className="flex-1 min-w-0 space-y-6">
            
            {/* Alerts */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
                <button onClick={() => setErrorMessage('')} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{successMessage}</div>
                <button onClick={() => setSuccessMessage('')} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
            )}

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Welcome Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-white">
                          Welcome back, {dashboardData.profile?.name || user?.name || 'Rahul Sharma'}
                        </h1>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {dashboardData.profile?.college || 'Apex Institute of Technology'} • {dashboardData.profile?.department || 'Computer Science & Engineering'} (CGPA: {dashboardData.profile?.cgpa || '8.84'})
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('assessment')}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow transition-colors"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span>Take 3-Stage Skill Assessment</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Verified Skills</span>
                      <Award className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{verifiedSkills.length}</div>
                    <p className="text-[11px] text-slate-400 mt-1">Validated via 3-stage assessments</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Qualified Job Matches</span>
                      <Briefcase className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">
                      {dashboardData.jobs.filter(j => j.qualification_status === 'QUALIFIED' || j.qualificationState === 'PERFECTLY_QUALIFIED' || j.qualificationState === 'QUALIFIED').length || dashboardData.jobs.length}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Positions ready to apply</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Career Skill Readiness</span>
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">
                      {dashboardData.profile?.skill_readiness || 85}%
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Industry production benchmark
                    </p>
                  </div>
                </div>

                {/* Verified Skills Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-400" />
                      <span>Verified Skill Passport</span>
                    </h2>
                    <button
                      onClick={() => setActiveTab('passport')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {verifiedSkills.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
                      <p className="text-xs text-slate-400">No verified skills yet.</p>
                      <p className="text-[11px] text-slate-500 mt-1">Take an assessment to verify skills and unlock job matching.</p>
                      <button
                        onClick={() => setActiveTab('assessment')}
                        className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium"
                      >
                        Start Java Assessment
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {verifiedSkills.map(sk => (
                        <div key={sk.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-white">{sk.name}</span>
                            <span className="text-xs font-bold text-emerald-400">{sk.overallScore}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${sk.overallScore}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-400 block">{sk.proficiencyLevel}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Job Matches Preview */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-cyan-400" />
                      <span>Recommended Job Opportunities</span>
                    </h2>
                    <button
                      onClick={() => setActiveTab('opportunities')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      View All Opportunities <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {dashboardData.jobs.slice(0, 3).map(job => (
                      <div key={job.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-xs text-white">{job.title}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              job.qualification_status === 'QUALIFIED' || job.qualificationState === 'PERFECTLY_QUALIFIED' || job.qualificationState === 'QUALIFIED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}>
                              {(job.qualification_status || job.qualificationState || 'QUALIFIED').replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{job.company_name || job.company} • {job.location} • {job.stipend}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(job.required_skills || job.requiredSkills || []).map((sk, idx) => (
                              <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          {job.isApplied ? (
                            <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg inline-block">
                              Applied
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApplyJob(job.id)}
                              disabled={job.qualification_status === 'REQUALIFICATION_REQUIRED' || job.qualificationState === 'NEEDS_IMPROVEMENT' || applyingJobId === job.id}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                job.qualification_status === 'REQUALIFICATION_REQUIRED' || job.qualificationState === 'NEEDS_IMPROVEMENT'
                                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                              }`}
                            >
                              {applyingJobId === job.id ? 'Applying...' : job.qualification_status === 'REQUALIFICATION_REQUIRED' || job.qualificationState === 'NEEDS_IMPROVEMENT' ? 'Missing Skills' : 'Apply Now'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: W3SCHOOLS SKILL LEARNING HUB */}
            {activeTab === 'learning-hub' && (
              <div className="space-y-6 w-full">
                
                {/* Hero Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2.5 max-w-3xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Skill Learning Hub & Practice Tracks</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <span>Learning Hub &</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                          Concept Mastery
                        </span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Transform your weak, developing, and unverified skill gaps into verified industry credentials using official free tutorials from{' '}
                        <a 
                          href="https://www.w3schools.com/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-emerald-400 hover:text-emerald-300 underline font-semibold inline-flex items-center gap-1"
                        >
                          W3Schools.com <ExternalLink className="w-3 h-3" />
                        </a>
                        . Practice interactive "Try-It-Yourself" sandboxes, solve chapter exercises, and take the 3-Stage Assessment to certify your passport.
                      </p>
                    </div>

                    {/* Quick Source Link & Stats Badge */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                      <a
                        href="https://www.w3schools.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Visit W3Schools.com ↗</span>
                      </a>
                      <span className="text-[10px] text-slate-400 font-medium">
                        12+ Verified Tracks • 200+ Chapters • Free Playgrounds
                      </span>
                    </div>
                  </div>

                  {/* Smart Skill Gap Recommendations Banner */}
                  <div className="mt-6 pt-5 border-t border-slate-800/80">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Recommended W3Schools Tracks to Bridge Your Gaps:</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Based on diagnostic tests & internship criteria</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">⚡</span>
                          <div>
                            <span className="text-xs font-bold text-white block">Data Structures & Algorithms</span>
                            <span className="text-[10px] text-rose-400 font-semibold">Priority: Placement DP & Graphs</span>
                          </div>
                        </div>
                        <a
                          href="https://www.w3schools.com/dsa/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 text-[10px] font-bold flex items-center gap-1 shrink-0"
                        >
                          Learn <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">🗄️</span>
                          <div>
                            <span className="text-xs font-bold text-white block">SQL & Window Queries</span>
                            <span className="text-[10px] text-cyan-400 font-semibold">Universal Screening Rule</span>
                          </div>
                        </div>
                        <a
                          href="https://www.w3schools.com/sql/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[10px] font-bold flex items-center gap-1 shrink-0"
                        >
                          Learn <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">☕</span>
                          <div>
                            <span className="text-xs font-bold text-white block">Java Collections & Streams</span>
                            <span className="text-[10px] text-amber-400 font-semibold">Spring Boot & Backend</span>
                          </div>
                        </div>
                        <a
                          href="https://www.w3schools.com/java/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 text-[10px] font-bold flex items-center gap-1 shrink-0"
                        >
                          Learn <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    
                    {/* Keyword Search */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchLearningKeyword}
                        onChange={e => setSearchLearningKeyword(e.target.value)}
                        placeholder="Search W3Schools tutorials by language, concept, or topic (e.g. Java, Python, SQL, DSA, React, Git)..."
                        className="w-full bg-slate-950 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 border border-slate-800 focus:border-emerald-500 outline-none"
                      />
                      {searchLearningKeyword && (
                        <button
                          onClick={() => setSearchLearningKeyword('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Level Filter Dropdown */}
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedLearningLevel}
                        onChange={e => setSelectedLearningLevel(e.target.value)}
                        className="bg-slate-950 rounded-xl px-3 py-2.5 text-xs text-white border border-slate-800 focus:border-emerald-500 outline-none"
                      >
                        <option value="ALL">All Proficiency Levels</option>
                        <option value="Beginner">Beginner Tracks</option>
                        <option value="Intermediate">Intermediate Tracks</option>
                        <option value="Advanced">Advanced Tracks</option>
                      </select>
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    {[
                      { id: 'ALL', label: 'All Learning Tracks' },
                      { id: 'Algorithms & DSA', label: '⚡ Algorithms & DSA' },
                      { id: 'Backend & Languages', label: '☕ Backend & Languages' },
                      { id: 'Databases & Cloud', label: '🗄️ Databases & Cloud' },
                      { id: 'Web & Frontend', label: '⚛️ Web & Frontend' },
                      { id: 'AI & Data Science', label: '🤖 AI & Data Science' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedLearningCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                          selectedLearningCategory === cat.id
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tracks Grid */}
                {filteredLearningTracks.length === 0 ? (
                  <div className="p-10 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-center space-y-2">
                    <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                    <h3 className="text-sm font-bold text-white">No Learning Tracks Found</h3>
                    <p className="text-xs text-slate-400">Try adjusting your search keyword or selected category filter.</p>
                    <button
                      onClick={() => { setSearchLearningKeyword(''); setSelectedLearningCategory('ALL'); setSelectedLearningLevel('ALL'); }}
                      className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredLearningTracks.map(track => {
                      const isBookmarked = bookmarkedTracks.includes(track.id);
                      return (
                        <div
                          key={track.id}
                          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-4 transition-all duration-300 flex flex-col justify-between group shadow-lg"
                        >
                          <div className="space-y-3">
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                                  {track.icon}
                                </div>
                                <div>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${track.badgeColor}`}>
                                    {track.category}
                                  </span>
                                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mt-1">
                                    {track.title}
                                  </h3>
                                </div>
                              </div>

                              <button
                                onClick={() => toggleBookmarkTrack(track.id)}
                                title={isBookmarked ? 'Remove Bookmark' : 'Save Track'}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  isBookmarked
                                    ? 'bg-amber-950 text-amber-400 border-amber-800'
                                    : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                                }`}
                              >
                                <Bookmark className="w-3.5 h-3.5 fill-current" />
                              </button>
                            </div>

                            {/* Metadata Pills */}
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                                ⏱️ {track.duration}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300">
                                ⭐ {track.rating}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                                {track.level}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                              {track.description}
                            </p>

                            {/* Key Topics List */}
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                                Core W3Schools Chapters:
                              </span>
                              <div className="grid grid-cols-1 gap-1">
                                {track.keyTopics.slice(0, 3).map((topic, tIdx) => (
                                  <div key={tIdx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                    <span className="truncate">{topic}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Card Actions */}
                          <div className="space-y-2 pt-3 border-t border-slate-800/80">
                            <div className="grid grid-cols-2 gap-2">
                              {/* Open W3Schools */}
                              <a
                                href={track.w3Url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                              >
                                <Globe className="w-3.5 h-3.5" />
                                <span>W3Schools ↗</span>
                              </a>

                              {/* View Syllabus Modal */}
                              <button
                                type="button"
                                onClick={() => setActiveLearningTrackModal(track)}
                                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Syllabus</span>
                              </button>
                            </div>

                            {/* Verify Skill Assessment Action */}
                            <button
                              type="button"
                              onClick={() => {
                                handleStartAssessment(track.skillName);
                              }}
                              className="w-full py-1.5 px-3 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <CheckSquare className="w-3 h-3" />
                              <span>Verify {track.skillName} in 3-Stage Assessment ➔</span>
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: 3-STAGE DYNAMIC SKILL ASSESSMENT */}
            {activeTab === 'assessment' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                
                {/* Header */}
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-indigo-400" />
                    <span>3-Stage Dynamic Skill Verification</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Skills cannot be self-declared for official job matching. Complete the 3-Stage Assessment: Easy MCQs, Medium Test-Case Coding, and Hard Real-World Problems.
                  </p>
                </div>

                {/* If Assessment Completed -> Show Comprehensive Score Analysis */}
                {assessmentResult ? (
                  <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-5 animate-in fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Assessment Evaluation</span>
                        <h3 className="text-lg font-bold text-white">{assessmentResult.skillName} Skill Verification</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-emerald-400">{assessmentResult.overallScore}%</div>
                        <span className="text-[11px] text-slate-400">{assessmentResult.proficiencyLevel}</span>
                      </div>
                    </div>

                    {/* Stage Breakdown Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">Stage 1 — Easy (MCQ)</span>
                        <span className="text-lg font-bold text-white">{assessmentResult.easyScore}%</span>
                      </div>
                      <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">Stage 2 — Medium (Test Cases)</span>
                        <span className="text-lg font-bold text-white">{assessmentResult.mediumScore}%</span>
                      </div>
                      <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">Stage 3 — Hard (Real World)</span>
                        <span className="text-lg font-bold text-white">{assessmentResult.hardScore}%</span>
                      </div>
                    </div>

                    {/* Strengths & Recommendations */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <h4 className="font-semibold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Strong Areas
                        </h4>
                        <ul className="space-y-1 text-slate-300">
                          {assessmentResult.strongAreas.map((area, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <h4 className="font-semibold text-amber-400 flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4" /> Areas to Strengthen
                        </h4>
                        <ul className="space-y-1 text-slate-300">
                          {assessmentResult.improvementRecommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        onClick={() => setActiveTab('passport')}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow"
                      >
                        View in Skill Passport
                      </button>
                      <button
                        onClick={() => setActiveTab('opportunities')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                      >
                        View Matching Jobs
                      </button>
                    </div>
                  </div>
                ) : activeAttempt ? (
                  /* Active Assessment Stage Workflow */
                  <form onSubmit={handleSubmitStage} className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-xs font-semibold text-indigo-400">
                          Stage {currentStage} of 3 • {selectedSkillForAssessment}
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          {currentStage === 1 ? 'Stage 1 — Fundamental MCQs (10 Questions)' :
                           currentStage === 2 ? 'Stage 2 — Output & Test-Case Programming (5 Questions)' :
                           'Stage 3 — Real-World Problem Solving & Architecture (2 Challenges)'}
                        </h3>
                      </div>
                    </div>

                    {/* Stage 1: Easy MCQs */}
                    {currentStage === 1 && (
                      <div className="space-y-4">
                        {stageQuestions.map((q, qIndex) => (
                          <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-bold text-indigo-400">{qIndex + 1}.</span>
                              <p className="text-xs font-medium text-slate-200 leading-relaxed">{q.question}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                              {q.options.map((opt, optIndex) => (
                                <label
                                  key={optIndex}
                                  className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center gap-2 transition-colors ${
                                    Number(userAnswers[q.id]) === optIndex
                                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`q_${q.id}`}
                                    checked={Number(userAnswers[q.id]) === optIndex}
                                    onChange={() => setUserAnswers({ ...userAnswers, [q.id]: optIndex })}
                                    className="text-indigo-600"
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stage 2: Medium Programming */}
                    {currentStage === 2 && (
                      <div className="space-y-5">
                        {stageQuestions.map((q, qIndex) => (
                          <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-white">{qIndex + 1}. {q.title}</h4>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300">{q.topic}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{q.description}</p>
                            
                            {/* Test Cases Pill */}
                            <div className="bg-slate-900 p-2.5 rounded-lg text-[11px] font-mono space-y-1">
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Test Cases:</span>
                              {q.testCases?.map((tc, tcIdx) => (
                                <div key={tcIdx} className="text-slate-300">
                                  Input: <span className="text-cyan-400">{tc.input}</span> ➔ Expected: <span className="text-emerald-400">{tc.expectedOutput}</span>
                                </div>
                              ))}
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-400 mb-1">Your Solution / Code Implementation:</label>
                              <textarea
                                rows={4}
                                value={userAnswers[q.id] || ''}
                                onChange={e => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                                placeholder="Write your method implementation or code answer..."
                                className="w-full bg-slate-900 rounded-xl p-3 text-xs font-mono text-white border border-slate-800 focus:border-indigo-500 outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stage 3: Hard Problems */}
                    {currentStage === 3 && (
                      <div className="space-y-5">
                        {stageQuestions.map((q, qIndex) => (
                          <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-white">{qIndex + 1}. {q.title}</h4>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-purple-300">{q.topic}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{q.description}</p>

                            {/* Requirements List */}
                            <div className="bg-slate-900 p-3 rounded-lg text-xs space-y-1">
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Key Architectural Requirements:</span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                                {q.requirements?.map((req, rIdx) => (
                                  <li key={rIdx}>{req}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-slate-400 mb-1">Your Architectural Solution / Code:</label>
                              <textarea
                                rows={6}
                                value={userAnswers[q.id] || ''}
                                onChange={e => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                                placeholder="Implement the thread-safe class / distributed logic..."
                                className="w-full bg-slate-900 rounded-xl p-3 text-xs font-mono text-white border border-slate-800 focus:border-indigo-500 outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Cancel active assessment session?')) {
                            setActiveAttempt(null);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                      >
                        Cancel Assessment
                      </button>

                      <button
                        type="submit"
                        disabled={assessmentLoading}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow flex items-center gap-2 disabled:opacity-50"
                      >
                        {assessmentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        <span>{currentStage === 3 ? 'Complete & Generate Score Analysis' : `Submit Stage ${currentStage} ➔`}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Full-Width Filled Skill Verification Center */
                  <div className="space-y-6 w-full">
                    
                    {/* 3-Stage Progression Roadmap */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Stage 1</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">10 MCQs</span>
                        </div>
                        <h4 className="font-bold text-xs text-white">Foundational Knowledge</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Core language syntax, object-oriented concepts, and algorithmic complexity.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Stage 2</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">5 Code Tasks</span>
                        </div>
                        <h4 className="font-bold text-xs text-white">Test-Case Programming</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Code snippets, output prediction, bug isolation, and data structure execution.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Stage 3</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">2 Case Studies</span>
                        </div>
                        <h4 className="font-bold text-xs text-white">Real-World Architecture</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Production debugging, concurrency, caching, and enterprise scalability.
                        </p>
                      </div>
                    </div>

                    {/* Full-Width Skill Selection & Launch Panel */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                        <div>
                          <label className="block text-xs font-bold text-white uppercase tracking-wider">Select Domain Skill for Verification</label>
                          <p className="text-[11px] text-slate-400">Choose from self-declared or new technical skills to verify credentials.</p>
                        </div>
                        <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-950/80 border border-indigo-500/30 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                          Target: {selectedSkillForAssessment}
                        </span>
                      </div>

                      {/* Interactive Skill Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                        {[
                          { name: 'Java', icon: '☕' },
                          { name: 'Spring Boot', icon: '🍃' },
                          { name: 'SQL', icon: '🗄️' },
                          { name: 'Python', icon: '🐍' },
                          { name: 'React', icon: '⚛️' },
                          { name: 'Docker', icon: '🐳' }
                        ].map(sk => {
                          const isSelected = selectedSkillForAssessment === sk.name;
                          return (
                            <button
                              key={sk.name}
                              type="button"
                              onClick={() => setSelectedSkillForAssessment(sk.name)}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-950/80 border-indigo-500 shadow-md shadow-indigo-500/10 text-white font-bold ring-1 ring-indigo-500/50'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                              }`}
                            >
                              <div className="text-xl mb-1">{sk.icon}</div>
                              <div className="text-xs truncate">{sk.name}</div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Dropdown fallback & Launch Button */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <select
                          value={selectedSkillForAssessment}
                          onChange={e => setSelectedSkillForAssessment(e.target.value)}
                          className="w-full sm:w-1/3 bg-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                        >
                          <option value="Java">Java (3-Stage Assessment)</option>
                          <option value="Spring Boot">Spring Boot (3-Stage Assessment)</option>
                          <option value="SQL">SQL (3-Stage Assessment)</option>
                          <option value="Python">Python (3-Stage Assessment)</option>
                          <option value="React">React (3-Stage Assessment)</option>
                          <option value="Docker">Docker (3-Stage Assessment)</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleStartAssessment(selectedSkillForAssessment)}
                          disabled={assessmentLoading}
                          className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {assessmentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
                          <span>Start Dynamic 3-Stage Assessment for {selectedSkillForAssessment}</span>
                        </button>
                      </div>

                    </div>

                  </div>
                )}

              </div>
            )}

            {/* TAB: PLACEMENT PREP & TESTS */}
            {activeTab === 'placement-prep' && (
              <div className="space-y-6 w-full">
                
                {/* Mode 1: Placement Confidence & Diagnostics Hub */}
                {placementViewMode === 'hub' && (
                  <div className="space-y-6">
                    
                    {/* Top Hero Banner: Placement Readiness & Confidence */}
                    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2 max-w-2xl">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                            <Target className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Placement Readiness & Concept Diagnostic Engine</span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            Build Placement Confidence in Coding & Aptitude
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Benchmark your problem-solving speed against Tier-1 campus hiring standards. Identify exact concept strengths and pinpoint the critical topics you need to master before technical interviews.
                          </p>
                        </div>

                        {/* Overall Confidence Index Gauge Card */}
                        <div className="p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/30 text-center sm:min-w-[220px] shadow-lg flex flex-col items-center justify-center">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Placement Readiness</span>
                          <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 my-1">
                            {placementTestResult.overallScore}%
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                            {placementTestResult.status}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1">Confidence: {placementTestResult.confidenceLevel}</span>
                        </div>
                      </div>

                      {/* Domain Readiness Split Progress Bars */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-800/80">
                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                              <Code2 className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">Coding & Algorithmic Domain</span>
                              <span className="text-[11px] text-slate-400">DP, Trees, Two-Pointers, Graphs, SQL</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-black text-indigo-400">{placementTestResult.codingScore}%</span>
                            <span className="text-[10px] text-slate-500 block">Tier-1 Benchmark: 80%</span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                              <Brain className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">Quantitative & Logical Aptitude</span>
                              <span className="text-[11px] text-slate-400">Speed-Distance, Probability, Syllogisms</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-black text-cyan-400">{placementTestResult.aptitudeScore}%</span>
                            <span className="text-[10px] text-slate-500 block">MNC Cutoff: 70%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Launch Practice Tests Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span>Launch Placement Tests & Concept Simulations</span>
                          </h3>
                          <p className="text-xs text-slate-400">Timed adaptive assessments with immediate breakdown and answer solutions.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Option 1: Full Mock */}
                        <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-5 space-y-4 transition-all duration-300 flex flex-col justify-between group">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">Complete Simulation</span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 15 Mins
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                              Full Placement Mock Assessment
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Balanced combination of 5 Core DSA/Coding problems and 5 Quantitative/Logical Aptitude questions replicating campus test patterns.
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">10 Questions</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800">Coding + Aptitude</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleStartPlacementTest('MOCK')}
                            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Start Full Mock Test</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Option 2: Coding Focus */}
                        <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-5 space-y-4 transition-all duration-300 flex flex-col justify-between group">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">Coding Focused</span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 7.5 Mins
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                              Core Coding & Algorithms Test
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Focus strictly on 0/1 Knapsack DP, BST Traversals, Two-Pointer arrays, SQL window functions, and Graph cycle detection.
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-purple-300 border border-slate-800">5 Deep Questions</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">LeetCode Medium/Hard</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleStartPlacementTest('CODING')}
                            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Launch Coding Diagnostic</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Option 3: Aptitude Focus */}
                        <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-5 space-y-4 transition-all duration-300 flex flex-col justify-between group">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">Aptitude Focused</span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 7.5 Mins
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                              Quant & Logical Aptitude Test
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Sharpen quick computation on relative speeds, probability without replacement, successive discount margins, and syllogisms.
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">5 Speed Questions</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">TCS / Cognizant Model</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleStartPlacementTest('APTITUDE')}
                            className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Launch Aptitude Diagnostic</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* "Where You Need To Be Strong" Matrix */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-rose-400" />
                            <h3 className="text-base font-bold text-white">
                              Where You Must Be Strong (Placement Concept Diagnostics)
                            </h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Real-time diagnostic analysis based on Tier-1 company cutoffs (Amazon, TCS Digital, Microsoft, Infosys, Cognizant).
                          </p>
                        </div>
                        <span className="text-[10px] px-3 py-1 rounded-full bg-slate-950 text-indigo-400 border border-indigo-800/60 font-semibold self-start sm:self-auto">
                          Updated Live from Test History
                        </span>
                      </div>

                      {/* 3 Pillars Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        
                        {/* 1. 🟢 Strong Concepts (Mastered) */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" /> Strong & Mastered Concepts
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                                80%+ High
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              You have high speed and accuracy in these areas. You will easily clear Technical Round 1 screening questions on these topics.
                            </p>

                            <div className="space-y-2">
                              {placementTestResult.strongConcepts.map((item, idx) => (
                                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                                  <div>
                                    <span className="text-xs font-medium text-white block">{item.name}</span>
                                    <span className="text-[10px] text-emerald-400">{item.domain} • High Proficiency</span>
                                  </div>
                                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                                    {item.score}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800/80">
                            <span className="text-[10px] text-slate-500">✓ Maintain speed by solving 1-2 medium problems weekly.</span>
                          </div>
                        </div>

                        {/* 2. 🟡 Moderate Concepts (Developing) */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                <Activity className="w-4 h-4" /> Moderate Concepts (Needs Speed)
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                                50% - 79%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              Your fundamentals are sound, but calculation time or edge cases occasionally cause mistakes under time constraints.
                            </p>

                            <div className="space-y-2">
                              {placementTestResult.developingConcepts.map((item, idx) => (
                                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                                  <div>
                                    <span className="text-xs font-medium text-white block">{item.name}</span>
                                    <span className="text-[10px] text-amber-400">{item.domain} • Needs Timed Drills</span>
                                  </div>
                                  <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                                    {item.score}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800/80">
                            <span className="text-[10px] text-amber-400/80">⚡ Tip: Use shortcut Venn techniques and relative speed unit conversions.</span>
                          </div>
                        </div>

                        {/* 3. 🔴 Critical Weak Concepts (MUST BE STRONG HERE) */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40 space-y-3 flex flex-col justify-between ring-1 ring-rose-500/20">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                                <Flame className="w-4 h-4 text-rose-500" /> Must Be Strong Here (Action Required)
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                                Priority Focus
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              These high-weightage topics are the primary elimination filters in campus drives. Mastering these unlocks Tier-1 product offers.
                            </p>

                            <div className="space-y-2.5">
                              {placementTestResult.weakConcepts.map((item, idx) => (
                                <div key={idx} className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/60 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-rose-200">{item.name}</span>
                                    <span className="text-[10px] font-semibold text-rose-400">{item.domain}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400">{item.impact}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800/80">
                            <button
                              onClick={() => handleStartPlacementTest('CODING')}
                              className="w-full py-1.5 text-center text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 rounded-lg transition-colors cursor-pointer"
                            >
                              Practice Weak Topics Now ➔
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* High-Yield Placement Cheatsheets & Formula Handbook */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-indigo-400" />
                            <span>Essential Placement Formulae & Algorithmic Patterns</span>
                          </h3>
                          <p className="text-xs text-slate-400">Quick-reference cheat sheet for immediate interview recall.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Coding Cheatsheet */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                          <div className="flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-indigo-400" />
                            <h4 className="text-xs font-bold text-white">Core Coding & DSA Rules</h4>
                          </div>
                          <ul className="space-y-2 text-[11px] text-slate-300 leading-relaxed">
                            <li className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <strong className="text-indigo-300">0/1 Knapsack 1D Array Optimization:</strong> Iterate backwards from capacity <code className="text-slate-200">C down to weights[i]</code> to prevent reusing the same item in the same step.
                            </li>
                            <li className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <strong className="text-indigo-300">Directed Graph Cycles:</strong> Use 3-State DFS Coloring (White=0, Gray=1 [in stack], Black=2 [visited]). Encountering Gray = Cycle present in O(V+E).
                            </li>
                            <li className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <strong className="text-indigo-300">SQL DENSE_RANK() vs RANK():</strong> <code className="text-slate-200">DENSE_RANK()</code> does not skip rank values upon ties (1, 2, 2, 3), whereas <code className="text-slate-200">RANK()</code> skips (1, 2, 2, 4).
                            </li>
                          </ul>
                        </div>

                        {/* Aptitude Cheatsheet */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-cyan-400" />
                            <h4 className="text-xs font-bold text-white">Quantitative & Aptitude Shortcuts</h4>
                          </div>
                          <ul className="space-y-2 text-[11px] text-slate-300 leading-relaxed">
                            <li className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <strong className="text-cyan-300">Relative Speed:</strong> Trains in opposite directions: <code className="text-slate-200">Speed = S1 + S2</code>. Convert km/h to m/s by multiplying by <code className="text-slate-200">5/18</code>.
                            </li>
                            <li className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <strong className="text-cyan-300">Probability without Replacement:</strong> <code className="text-slate-200">P(A and B) = P(A) * P(B|A)</code>. Reduce the total sample space denominator by 1 after each draw.
                            </li>
                            <li className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <strong className="text-cyan-300">Successive Discounts:</strong> Net equivalent discount = <code className="text-slate-200">D1 + D2 - (D1 * D2 / 100)</code>.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Mode 2: Interactive Placement Test Engine */}
                {placementViewMode === 'test' && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    
                    {/* Test Header with Live Countdown Timer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                            {selectedPlacementType} Assessment
                          </span>
                          <span className="text-xs text-slate-400">
                            Question {currentPlacementIndex + 1} of {activePlacementQuestions.length}
                          </span>
                        </div>
                        <h2 className="text-base font-bold text-white mt-1">
                          {selectedPlacementType === 'MOCK' ? 'Full Placement Diagnostic Test' : selectedPlacementType === 'CODING' ? 'Coding & Algorithms Concept Test' : 'Quantitative & Logical Aptitude Test'}
                        </h2>
                      </div>

                      {/* Timer Bar */}
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm ${
                        placementTimer < 120 
                          ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 animate-pulse' 
                          : 'bg-slate-950 border-slate-800 text-indigo-300'
                      }`}>
                        <Clock className="w-4 h-4" />
                        <span>
                          {Math.floor(placementTimer / 60)}:{(placementTimer % 60 < 10 ? '0' : '') + (placementTimer % 60)}
                        </span>
                        <span className="text-[10px] text-slate-500 font-sans font-normal ml-1">remaining</span>
                      </div>
                    </div>

                    {/* Question Stepper Navigation Grid */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {activePlacementQuestions.map((q, idx) => {
                        const isAnswered = placementAnswers[q.id] !== undefined;
                        const isCurrent = idx === currentPlacementIndex;
                        return (
                          <button
                            key={q.id}
                            onClick={() => setCurrentPlacementIndex(idx)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                              isCurrent
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400'
                                : isAnswered
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Question Card */}
                    {activePlacementQuestions[currentPlacementIndex] && (
                      <div className="space-y-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                              activePlacementQuestions[currentPlacementIndex].domain === 'CODING'
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            }`}>
                              {activePlacementQuestions[currentPlacementIndex].domain}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                              {activePlacementQuestions[currentPlacementIndex].category}
                            </span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            activePlacementQuestions[currentPlacementIndex].difficulty === 'Hard'
                              ? 'text-rose-400 bg-rose-950/40 border border-rose-900'
                              : activePlacementQuestions[currentPlacementIndex].difficulty === 'Medium'
                              ? 'text-amber-400 bg-amber-950/40 border border-amber-900'
                              : 'text-emerald-400 bg-emerald-950/40 border border-emerald-900'
                          }`}>
                            {activePlacementQuestions[currentPlacementIndex].difficulty} Difficulty
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white">
                          {activePlacementQuestions[currentPlacementIndex].title}
                        </h3>

                        <p className="text-xs text-slate-200 leading-relaxed font-sans">
                          {activePlacementQuestions[currentPlacementIndex].question}
                        </p>

                        {/* Code / Formula Box */}
                        {activePlacementQuestions[currentPlacementIndex].snippet && (
                          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-indigo-200 overflow-x-auto whitespace-pre">
                            {activePlacementQuestions[currentPlacementIndex].snippet}
                          </div>
                        )}

                        {/* Options */}
                        <div className="space-y-2.5 pt-2">
                          {activePlacementQuestions[currentPlacementIndex].options.map((option, optIdx) => {
                            const isSelected = placementAnswers[activePlacementQuestions[currentPlacementIndex].id] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleSelectPlacementAnswer(activePlacementQuestions[currentPlacementIndex].id, optIdx)}
                                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-950/80 border-indigo-500 text-white font-medium shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                                    : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="flex-1 leading-relaxed">{option}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Test Action Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentPlacementIndex > 0) {
                            setCurrentPlacementIndex(prev => prev - 1);
                          } else {
                            if (window.confirm('Quit diagnostic test and return to hub?')) {
                              setPlacementViewMode('hub');
                            }
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{currentPlacementIndex > 0 ? 'Previous Question' : 'Quit to Hub'}</span>
                      </button>

                      <div className="flex items-center gap-3">
                        {currentPlacementIndex < activePlacementQuestions.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => setCurrentPlacementIndex(prev => prev + 1)}
                            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Next Question</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => {
                            const answeredCount = Object.keys(placementAnswers).length;
                            if (answeredCount < activePlacementQuestions.length) {
                              if (window.confirm(`You have answered ${answeredCount} of ${activePlacementQuestions.length} questions. Submit test now?`)) {
                                handleSubmitPlacementTest();
                              }
                            } else {
                              handleSubmitPlacementTest();
                            }
                          }}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Submit & View Diagnostic Report</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* Mode 3: Test Result & Deep Solution Walkthrough */}
                {placementViewMode === 'result' && (
                  <div className="space-y-6">
                    
                    {/* Score & Verdict Banner */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                            Diagnostic Assessment Completed
                          </span>
                          <h2 className="text-xl font-bold text-white">
                            Placement Diagnostic Scorecard & Concept Mastery
                          </h2>
                          <p className="text-xs text-slate-400">
                            Review your performance metrics below. Revisit detailed solutions to master any missed concepts.
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center min-w-[130px]">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Overall Score</span>
                            <span className="text-3xl font-black text-indigo-400">{placementTestResult.overallScore}%</span>
                            <span className="text-[10px] text-emerald-400 block mt-0.5">{placementTestResult.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Domain Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                              <Code2 className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">Coding Problem Solving</span>
                              <span className="text-[11px] text-slate-400">Algorithms, Trees, DP & SQL</span>
                            </div>
                          </div>
                          <span className="text-xl font-black text-indigo-300">{placementTestResult.codingScore}%</span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                              <Brain className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">Quantitative Aptitude & Logic</span>
                              <span className="text-[11px] text-slate-400">Math Speed, Probability & Deduction</span>
                            </div>
                          </div>
                          <span className="text-xl font-black text-cyan-300">{placementTestResult.aptitudeScore}%</span>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Actionable Placement Roadmap:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                          {placementTestResult.recommendations?.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Top Action CTAs */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={() => setPlacementViewMode('hub')}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all cursor-pointer"
                        >
                          Return to Placement Hub
                        </button>
                        <button
                          onClick={() => handleStartPlacementTest(selectedPlacementType)}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Retake Diagnostic Test
                        </button>
                        <button
                          onClick={() => setActiveTab('assessment')}
                          className="px-5 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Verify Skills via 3-Stage Assessment ➔
                        </button>
                      </div>
                    </div>

                    {/* Detailed Question Walkthrough & Solution Explanations */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-400" />
                          <span>Detailed Question Solutions & Conceptual Explanations</span>
                        </h3>
                        <span className="text-xs text-slate-400">
                          {placementTestResult.evaluatedQuestions?.length || 0} Questions Evaluated
                        </span>
                      </div>

                      <div className="space-y-4">
                        {placementTestResult.evaluatedQuestions?.map((q, idx) => (
                          <div
                            key={q.id}
                            className={`p-4 rounded-xl border space-y-3 ${
                              q.isCorrect
                                ? 'bg-slate-950 border-emerald-500/30'
                                : 'bg-slate-950 border-rose-500/30'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                    q.domain === 'CODING'
                                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                  }`}>
                                    {q.domain} • {q.category}
                                  </span>
                                  <span className="text-xs font-bold text-white">{idx + 1}. {q.title}</span>
                                </div>
                                <p className="text-xs text-slate-300 mt-1 font-sans">{q.question}</p>
                              </div>

                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 ${
                                q.isCorrect
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}>
                                {q.isCorrect ? '✓ Correct' : '✕ Missed'}
                              </span>
                            </div>

                            {q.snippet && (
                              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-indigo-200 overflow-x-auto whitespace-pre">
                                {q.snippet}
                              </div>
                            )}

                            {/* Solution Comparison */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                                <span className="text-[10px] text-slate-500 block">Your Answer:</span>
                                <span className={q.isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300 font-semibold'}>
                                  {q.userSelected !== undefined ? q.options[q.userSelected] : 'Not Answered'}
                                </span>
                              </div>

                              <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-900/60">
                                <span className="text-[10px] text-emerald-400 font-bold block">Correct Answer:</span>
                                <span className="text-emerald-300 font-semibold">
                                  {q.options[q.correct]}
                                </span>
                              </div>
                            </div>

                            {/* Conceptual Explanation */}
                            <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-[11px] text-slate-300 leading-relaxed">
                              <strong className="text-indigo-300 block mb-0.5">Placement Concept Insight:</strong>
                              {q.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* TAB 4: VERIFIED SKILL PASSPORT */}
            {activeTab === 'passport' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-400" />
                      <span>Verified Skill Passport</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Distinguishes official verified skills from self-declared skills. Only verified skills are utilized by recruiters and job matching algorithms.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddSkillModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" /> Declare Skill
                  </button>
                </div>

                {/* Verified Skills Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Verified Skills</h3>
                  {verifiedSkills.length === 0 ? (
                    <p className="text-xs text-slate-500">No verified skills yet. Take an assessment to verify skills.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {verifiedSkills.map(sk => (
                        <div key={sk.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                                <span>{sk.name}</span>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20">
                                  Verified
                                </span>
                              </h4>
                              <span className="text-[10px] text-slate-400">{sk.proficiencyLevel}</span>
                            </div>
                            <span className="text-xl font-bold text-emerald-400">{sk.overallScore}%</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-slate-900 p-2 rounded-lg">
                            <div>
                              <span className="text-slate-400 block">Easy</span>
                              <span className="font-bold text-white">{sk.easyScore}%</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Medium</span>
                              <span className="font-bold text-white">{sk.mediumScore}%</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Hard</span>
                              <span className="font-bold text-white">{sk.hardScore}%</span>
                            </div>
                          </div>

                          {sk.strongAreas?.length > 0 && (
                            <div className="text-[11px] text-slate-300">
                              <span className="text-slate-400 text-[10px] block">Strong Areas:</span>
                              <span>{sk.strongAreas.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Self-Declared Skills Section */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Self-Declared Skills (Unverified)</h3>
                  {selfDeclaredSkills.length === 0 ? (
                    <p className="text-xs text-slate-500">No unverified self-declared skills.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selfDeclaredSkills.map(sk => (
                        <div key={sk.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                          <div>
                            <span className="font-medium text-xs text-slate-300">{sk.name}</span>
                            <span className="text-[10px] text-slate-500 block">Self-Declared</span>
                          </div>
                          <button
                            onClick={() => handleStartAssessment(sk.name)}
                            className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-medium"
                          >
                            Verify
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 5: JOB SEARCH & SKILL MATCHING */}
            {activeTab === 'opportunities' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-400" />
                    <span>Job Search & Verified Skill Matching</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Job qualification states are calculated strictly against your verified skills.
                  </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchJobKeyword}
                      onChange={e => setSearchJobKeyword(e.target.value)}
                      placeholder="Search jobs by title, company, or required skill (e.g. Java, SQL)..."
                      className="w-full bg-slate-950 rounded-xl pl-9 pr-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <select
                    value={qualificationFilter}
                    onChange={e => setQualificationFilter(e.target.value)}
                    className="bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                  >
                    <option value="ALL">All Qualification States</option>
                    <option value="PERFECTLY_QUALIFIED">Perfect Matches (Exceeds)</option>
                    <option value="QUALIFIED">Qualified (Meets)</option>
                    <option value="NEEDS_IMPROVEMENT">Needs Improvement (Missing Skills)</option>
                  </select>
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                  {filteredJobs.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No matching job listings found for the selected filter.
                    </div>
                  ) : (
                    filteredJobs.map(job => (
                      <div key={job.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm text-white">{job.title}</h3>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                job.qualificationState === 'PERFECTLY_QUALIFIED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                                job.qualificationState === 'QUALIFIED' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                                'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}>
                                {job.qualificationState.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {job.company} • {job.location} • {job.type} • {job.stipend}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-200">Match: {job.matchScore}%</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>

                        {/* Skills Breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-900 p-3 rounded-lg">
                          <div>
                            <span className="text-[10px] text-emerald-400 block font-semibold">Matched Verified Skills:</span>
                            {job.matchedSkills?.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {job.matchedSkills.map((sk, idx) => (
                                  <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                                    ✓ {sk.skill} ({sk.score}%)
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500">None</span>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] text-amber-400 block font-semibold">Missing / Weak Skills:</span>
                            {job.missingSkills?.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {job.missingSkills.map((sk, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleStartAssessment(sk)}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900"
                                  >
                                    Verify {sk} ➔
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[11px] text-emerald-400">All required skills verified!</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-1">
                          {job.isApplied ? (
                            <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-4 py-2 rounded-lg">
                              Application Submitted
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApplyJob(job.id)}
                              disabled={job.qualificationState === 'NEEDS_IMPROVEMENT' || applyingJobId === job.id}
                              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                                job.qualificationState === 'NEEDS_IMPROVEMENT'
                                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                              }`}
                            >
                              {applyingJobId === job.id ? 'Submitting Application...' : job.qualificationState === 'NEEDS_IMPROVEMENT' ? 'Complete Missing Skills First' : 'Apply with Verified Passport'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* TAB 5.5: INTERNSHIP PACKAGES & OFFERS */}
            {activeTab === 'internships' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                
                {/* Header with Title and Overview Metrics */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <span>Internship Packages & Company Offers</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Explore verified internship opportunities with monthly stipends and Pre-Placement Offer (PPO) package guarantees.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-semibold">
                      {filteredInternships.length} Open Programs
                    </span>
                  </div>
                </div>

                {/* Highlights Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Top Monthly Stipend</span>
                    <span className="text-lg font-bold text-emerald-400">₹55,000 / mo</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Average PPO Offer</span>
                    <span className="text-lg font-bold text-indigo-400">₹16.5 LPA</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Verified Match State</span>
                    <span className="text-lg font-bold text-cyan-400">
                      {internshipsList.filter(i => i.qualificationState === 'PERFECTLY_QUALIFIED').length} Perfect Matches
                    </span>
                  </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchInternshipKeyword}
                      onChange={e => setSearchInternshipKeyword(e.target.value)}
                      placeholder="Search internships by role, company, or tech stack (e.g. React, Java, Docker)..."
                      className="w-full bg-slate-950 rounded-xl pl-9 pr-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <select
                    value={internshipFilter}
                    onChange={e => setInternshipFilter(e.target.value)}
                    className="bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                  >
                    <option value="ALL">All Internship Programs</option>
                    <option value="PERFECTLY_QUALIFIED">Perfect Skill Matches</option>
                    <option value="QUALIFIED">Qualified (Meets Baseline)</option>
                    <option value="PPO">With Pre-Placement Offer (PPO)</option>
                  </select>
                </div>

                {/* Internships List */}
                <div className="space-y-4">
                  {filteredInternships.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                      No matching internship listings found for the selected filter.
                    </div>
                  ) : (
                    filteredInternships.map(internship => (
                      <div key={internship.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5 hover:border-slate-700 transition-colors">
                        
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-sm text-white">{internship.title}</h3>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                internship.qualificationState === 'PERFECTLY_QUALIFIED' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                              }`}>
                                {internship.qualificationState.replace('_', ' ')}
                              </span>
                            </div>
                            
                            <p className="text-xs text-slate-400">
                              <span className="text-slate-200 font-medium">{internship.company}</span> • {internship.location} • {internship.type}
                            </p>
                          </div>

                          <div className="sm:text-right shrink-0">
                            <div className="text-sm font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60 inline-block">
                              {internship.stipend}
                            </div>
                            {internship.ppoPackage && (
                              <div className="text-[11px] font-medium text-indigo-300 mt-1">
                                PPO Offer: <span className="font-semibold text-white">{internship.ppoPackage}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{internship.description}</p>

                        {/* Perks & Benefits Pills */}
                        {internship.perks && internship.perks.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {internship.perks.map((perk, pIdx) => (
                              <span key={pIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-indigo-400" />
                                {perk}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Skills Breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                          <div>
                            <span className="text-[10px] text-emerald-400 block font-semibold">Matched Verified Skills:</span>
                            {internship.matchedSkills?.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {internship.matchedSkills.map((sk, idx) => (
                                  <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                                    ✓ {sk.skill} ({sk.score}%)
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500">None</span>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] text-amber-400 block font-semibold">Missing / Additional Skills:</span>
                            {internship.missingSkills?.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {internship.missingSkills.map((sk, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleStartAssessment(sk)}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900 transition-colors"
                                  >
                                    Verify {sk} ➔
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[11px] text-emerald-400">All required skill credentials met!</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-1">
                          {internship.isApplied ? (
                            <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                              ✓ Internship Application Submitted
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApplyInternship(internship.id)}
                              disabled={internship.hasMissingSkills || applyingInternshipId === internship.id}
                              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                internship.hasMissingSkills
                                  ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed shadow-none'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer'
                              }`}
                              title={internship.hasMissingSkills ? `Verify missing skills (${internship.missingSkills.join(', ')}) to unlock application` : 'Apply with your verified skill passport'}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>
                                {applyingInternshipId === internship.id 
                                  ? 'Submitting Application...' 
                                  : internship.hasMissingSkills 
                                    ? 'Complete Missing Skills First' 
                                    : 'Apply with Verified Passport'}
                              </span>
                            </button>
                          )}
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* TAB 6: APPLICATION TRACKER */}
            {activeTab === 'applications' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCode2 className="w-5 h-5 text-indigo-400" />
                    <span>Application Tracker</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Track your submitted job applications and status.</p>
                </div>

                {dashboardData.applications.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                    No submitted applications yet. Browse the Job Search tab to apply for qualified roles.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.applications.map(app => (
                      <div key={app.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-xs text-white">{app.title}</h4>
                          <p className="text-[11px] text-slate-400">{app.company} • {app.location}</p>
                          <span className="text-[10px] text-slate-500 block mt-1">Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-indigo-400 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            {app.status}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-1">Match: {app.match_score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </section>
        </div>
      </main>

      {/* Modal: Add Skill */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-white">Declare Skill</h3>
            <p className="text-xs text-slate-400">Add a self-declared skill. You can later verify it through a 3-stage assessment.</p>
            <form onSubmit={handleDeclareSkill} className="space-y-3">
              <input
                type="text"
                required
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                placeholder="e.g. Python, Docker, React, SQL..."
                className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: W3Schools Interactive Track Syllabus & Playground */}
      {activeLearningTrackModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl animate-in fade-in">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-xl bg-slate-950 border border-slate-800">{activeLearningTrackModal.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      W3Schools Official Track
                    </span>
                    <span className="text-xs text-slate-400">{activeLearningTrackModal.level}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{activeLearningTrackModal.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setActiveLearningTrackModal(null)}
                className="text-slate-400 hover:text-white text-lg p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeLearningTrackModal.description}
            </p>

            {/* Chapters & Syllabus */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Complete Chapter Roadmap:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeLearningTrackModal.keyTopics.map((topic, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs text-slate-200">
                    <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-bold text-indigo-400 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Playground Preview */}
            {activeLearningTrackModal.tryItCode && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-emerald-400" /> Interactive W3Schools Sandbox Code:
                  </span>
                  <a
                    href={activeLearningTrackModal.w3Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Run live on W3Schools ↗
                  </a>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-200 overflow-x-auto whitespace-pre">
                  {activeLearningTrackModal.tryItCode}
                </div>
              </div>
            )}

            {/* Placement Impact */}
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-400">Target Industry Relevance:</span>
              <p className="text-xs text-slate-300">{activeLearningTrackModal.relevance}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {activeLearningTrackModal.exercisesUrl && (
                  <a
                    href={activeLearningTrackModal.exercisesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <span>Practice Exercises ↗</span>
                  </a>
                )}
                {activeLearningTrackModal.quizUrl && (
                  <a
                    href={activeLearningTrackModal.quizUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <span>Chapter Quiz ↗</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeLearningTrackModal.w3Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Start Course on W3Schools</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const sk = activeLearningTrackModal.skillName;
                    setActiveLearningTrackModal(null);
                    handleStartAssessment(sk);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Verify Skill Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
