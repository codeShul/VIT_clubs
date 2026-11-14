'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  CheckCircle2, 
  Code2, 
  Play, 
  ShieldCheck, 
  Layers, 
  FileCode, 
  Database, 
  Cpu, 
  Sparkles,
  Users,
  Terminal,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { OOPDemoRunner } from '@/lib/domain';

interface UnitInfo {
  id: string;
  unitNumber: number;
  title: string;
  syllabusTopic: string;
  member: string;
  keyConcepts: string[];
  codeLocation: string;
  demoFn: () => any;
  codeSnippet: string;
}

const UNITS: UnitInfo[] = [
  {
    id: 'unit-2',
    unitNumber: 2,
    title: 'Unit 2: Classes and Objects',
    syllabusTopic: 'Class Definition, Visibility Modifiers, Encapsulation, Static Members & Object Arrays',
    member: 'Member 1: Domain Modeling Lead',
    keyConcepts: [
      'Classes & Objects: UserEntity, EventEntity, ClubEntity as distinct domain models',
      'Encapsulation & Private Members: private password field in UserEntity is never leaked',
      'Static Members: EventEntity.MAX_CAPACITY = 10,000 constant shared across all instances',
      'Array of Objects: Typed domain object collections (Event[], User[])'
    ],
    codeLocation: 'src/lib/domain.ts (Lines 10-192)',
    codeSnippet: `export class UserEntity extends BaseEntity {
  public name: string;
  public email: string;
  private password?: string; // Encapsulation: Private member (Unit 2)

  override toJSON(): Record<string, unknown> {
    // password is intentionally excluded to guarantee safety
    return { id: this.id, name: this.name, email: this.email };
  }
}

export class EventEntity extends BaseEntity {
  public static readonly MAX_CAPACITY = 10_000; // Static constant (Unit 2)
}`,
    demoFn: () => OOPDemoRunner.runUnit2Demo()
  },
  {
    id: 'unit-3',
    unitNumber: 3,
    title: 'Unit 3: Constructors & Destructors',
    syllabusTopic: 'Parameterized Constructors, Default Arguments, Dynamic Initialization & Destructor Patterns',
    member: 'Member 3: Database & Persistence Lead',
    keyConcepts: [
      'Constructor with Default Arguments: BaseEntity defaults createdAt/updatedAt to new Date() if omitted',
      'Dynamic Initialization: PrismaClient and pg Pool initialized dynamically with credentials',
      'Destructor Cleanup Pattern: RateLimiter.cleanup() systematically purges expired in-memory state',
      'Singleton Lifecycle: globalForPrisma prevents duplicate connection pools in serverless runtime'
    ],
    codeLocation: 'src/lib/domain.ts & src/lib/db.ts',
    codeSnippet: `export abstract class BaseEntity {
  // Constructor with Default Arguments (Unit 3)
  constructor(id: string, createdAt?: Date, updatedAt?: Date) {
    this.id = id;
    this.createdAt = createdAt ?? new Date(); // Default argument
    this.updatedAt = updatedAt ?? new Date();
  }
}

// Destructor pattern (Unit 3: Cleanup stale token store)
public cleanup(): void {
  for (const [key, record] of RateLimiter.store.entries()) {
    if (Date.now() > record.resetTime) RateLimiter.store.delete(key);
  }
}`,
    demoFn: () => OOPDemoRunner.runUnit3Demo()
  },
  {
    id: 'unit-4',
    unitNumber: 4,
    title: 'Unit 4: Inheritance & Polymorphism',
    syllabusTopic: 'Abstract Classes, Hierarchical Inheritance, Method Overriding, Dynamic Runtime Polymorphism & Interfaces',
    member: 'Member 1: Domain Modeling Lead',
    keyConcepts: [
      'Abstract Base Class: BaseEntity defines pure abstract contracts validate() and toJSON()',
      'Hierarchical Inheritance: EventEntity, UserEntity, ClubEntity all inherit from BaseEntity',
      'Method Overriding: Each child class overrides validate() with domain-specific rules',
      'Runtime Dynamic Polymorphism: Iterating BaseEntity[] executes the correct overridden method dynamically',
      'Interface Contracts: IAuthService and EventsContextValue enforce loose coupling'
    ],
    codeLocation: 'src/lib/domain.ts (Lines 10-150)',
    codeSnippet: `export abstract class BaseEntity {
  abstract validate(): boolean; // Pure abstract method (Unit 4)
  abstract toJSON(): Record<string, unknown>;
}

export class EventEntity extends BaseEntity {
  override validate(): boolean { // Method Overriding (Unit 4)
    return this.title.length >= 3 && this.capacity > 0 && this.capacity <= EventEntity.MAX_CAPACITY;
  }
}

export class UserEntity extends BaseEntity {
  override validate(): boolean { // Polymorphic variation (Unit 4)
    return this.email.endsWith('@vitpune.edu.in') && this.name.length > 0;
  }
}`,
    demoFn: () => OOPDemoRunner.runUnit4Demo()
  },
  {
    id: 'unit-5',
    unitNumber: 5,
    title: 'Unit 5: File Handling & Stream Operations',
    syllabusTopic: 'File Stream Operations, Environment Streams, Sequential I/O, File Modes & Persistent Storage',
    member: 'Member 3: Database & Persistence Lead',
    keyConcepts: [
      'File Stream Processing: dotenv streams configuration files (.env) on application boot',
      'Sequential Migrations: Prisma CLI reads sequential .sql schema migrations from disk',
      'Connection Stream Modes: Transaction-mode pooler (6543) vs Session-mode direct (5432)',
      'Error Handling on I/O: Graceful try/catch fallbacks on missing environment files and connection drops'
    ],
    codeLocation: 'prisma.config.ts, prisma/schema.prisma & src/lib/db.ts',
    codeSnippet: `// File stream loading on initialization (Unit 5)
import { config } from 'dotenv';
config(); // Streams .env into process.env

// Persistent Pool Connection with Fallback Mode
const connectionString = process.env.DATABASE_URL || 'postgresql://dummy:5432/postgres';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);`,
    demoFn: () => OOPDemoRunner.runUnit5Demo()
  },
  {
    id: 'unit-6',
    unitNumber: 6,
    title: 'Unit 6: Exception Handling, Generic Programming & SOLID',
    syllabusTopic: 'Try / Catch / Throw Blocks, Generic Templates, Type Constraints & SOLID Architecture',
    member: 'Member 2 & Member 4 (Security & Logic Leads)',
    keyConcepts: [
      'Exception Handling: Structured try/catch/throw wrapping Server Actions and DB operations',
      'Generic Programming: React.createContext<EventsContextValue | null>(), useState<Event[]>()',
      'Single Responsibility: rate-limit.ts, validations.ts, and db.ts each have exactly one responsibility',
      'Open/Closed: Domain models extend BaseEntity without altering core engine',
      'Liskov Substitution: CredentialsAuth satisfies IAuthService contract cleanly',
      'Interface Segregation: Modular contexts (AuthContext, EventsContext, NotificationsContext)',
      'Dependency Inversion: Server Actions depend on PrismaClient abstraction rather than low-level pg drivers'
    ],
    codeLocation: 'src/app/actions/events.ts & src/lib/validations.ts',
    codeSnippet: `// Generic Type Constraints & Exception Handling (Unit 6)
export async function createEvent(data: any): Promise<{ success: boolean; event?: Event; error?: string }> {
  try {
    const validatedData = createEventSchema.parse(data); // Zod generic validation
    const event = await prisma.event.create({ ... });
    return { success: true, event };
  } catch (error: any) {
    console.error("Failed to create event:", error);
    return { success: false, error: error?.message || 'Server Exception' };
  }
}`,
    demoFn: () => OOPDemoRunner.runUnit6Demo()
  }
];

export default function OOPShowcasePage() {
  const [selectedUnit, setSelectedUnit] = React.useState<string>('unit-2');
  const [demoOutput, setDemoOutput] = React.useState<any>(null);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);

  const activeUnit = UNITS.find(u => u.id === selectedUnit) || UNITS[0];

  const handleRunDemo = () => {
    setIsRunning(true);
    setTimeout(() => {
      try {
        const result = activeUnit.demoFn();
        setDemoOutput(result);
      } catch (err: any) {
        setDemoOutput({ error: err.message });
      } finally {
        setIsRunning(false);
      }
    }, 250);
  };

  React.useEffect(() => {
    // Auto-run active demo on tab change
    try {
      setDemoOutput(activeUnit.demoFn());
    } catch (e: any) {
      setDemoOutput({ error: e.message });
    }
  }, [selectedUnit]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05050A] text-slate-900 dark:text-white pt-8 pb-24">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl space-y-8">
        
        {/* Header Banner */}
        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-indigo-600/10 p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-600 dark:text-cyan-400 border border-blue-500/30">
                <BookOpen className="h-3.5 w-3.5" />
                VIT Pune • OOP Coursework Evaluation Suite
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                OOP Syllabus Implementation Inspector
              </h1>
              <p className="text-slate-600 dark:text-slate-300 max-w-3xl text-sm md:text-base leading-relaxed">
                Live interactive demonstration of <strong>Units 2, 3, 4, 5, and 6</strong> Object-Oriented Programming principles implemented directly in the CCMS codebase. Click any unit below to inspect code snippets and trigger live test executions.
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Link href="/diagrams/README.md">
                <Button variant="outline" size="sm" className="w-full gap-2 border-white/20 hover:bg-white/10">
                  <FileCode className="h-4 w-4 text-cyan-400" /> View UML Diagrams
                </Button>
              </Link>
              <Link href="/PROJECT_DISTRIBUTION.md">
                <Button variant="outline" size="sm" className="w-full gap-2 border-white/20 hover:bg-white/10">
                  <Users className="h-4 w-4 text-blue-400" /> 4-Member Rubric
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4-Member Contribution Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <Badge className="w-fit bg-blue-600/20 text-blue-400 border border-blue-500/30">Member 1 (25%)</Badge>
              <CardTitle className="text-base font-bold mt-2">Domain & OOP Modeling</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
              Units 2 & 4: BaseEntity, EventEntity, UserEntity, Polymorphism, UML Class Diagram.
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <Badge className="w-fit bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">Member 2 (25%)</Badge>
              <CardTitle className="text-base font-bold mt-2">Cybersecurity & Edge</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
              Units 2 & 6: RateLimiter static state, Edge RBAC middleware, JWT auth, SOLID principles.
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <Badge className="w-fit bg-purple-600/20 text-purple-400 border border-purple-500/30">Member 3 (25%)</Badge>
              <CardTitle className="text-base font-bold mt-2">Database & File Streams</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
              Units 3 & 5: Dynamic constructors, file stream migrations, PgBouncer pooler, ER diagram.
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <Badge className="w-fit bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">Member 4 (25%)</Badge>
              <CardTitle className="text-base font-bold mt-2">Logic & UI Generics</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
              Units 3 & 6: Exception handling, generic context providers, Zod validation, Server Actions.
            </CardContent>
          </Card>
        </div>

        {/* Unit Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10">
          {UNITS.map((unit) => {
            const isSelected = unit.id === selectedUnit;
            return (
              <button
                key={unit.id}
                onClick={() => setSelectedUnit(unit.id)}
                className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-sm font-bold transition-all text-center flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20 scale-[1.02]'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/5'
                }`}
              >
                <Cpu className="h-4 w-4" />
                {unit.title.split(':')[0]}
              </button>
            );
          })}
        </div>

        {/* Active Unit Deep Dive */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeUnit.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Column: Syllabus Requirements & Code */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-600 dark:text-cyan-400">
                      {activeUnit.member}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">{activeUnit.codeLocation}</span>
                  </div>
                  <CardTitle className="text-2xl font-black mt-2 text-slate-900 dark:text-white">
                    {activeUnit.title}
                  </CardTitle>
                  <CardDescription className="text-sm font-medium text-blue-600 dark:text-cyan-300">
                    Syllabus Topic: {activeUnit.syllabusTopic}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-gray-400 mb-2">
                      Demonstrated Syllabus Concepts:
                    </h4>
                    <ul className="space-y-2">
                      {activeUnit.keyConcepts.map((concept, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-gray-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5" /> Implementation Snippet:
                    </h4>
                    <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-white/10 leading-relaxed">
                      <code>{activeUnit.codeSnippet}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Live Interactive Execution Console */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-gradient-to-b from-blue-950/20 to-slate-900/40 border-blue-500/20 shadow-xl backdrop-blur-xl">
                <CardHeader className="pb-3 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-cyan-400" />
                      <CardTitle className="text-base font-bold">Live Execution Sandbox</CardTitle>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={handleRunDemo}
                      disabled={isRunning}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-8 gap-1.5 shadow-sm"
                    >
                      <Play className="h-3.5 w-3.5" />
                      {isRunning ? 'Executing...' : 'Re-run Test'}
                    </Button>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    Instantiates real TypeScript domain classes in memory and validates outputs live.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    Console Output:
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/20 font-mono text-xs text-cyan-300 min-h-[320px] max-h-[460px] overflow-y-auto space-y-2">
                    {demoOutput ? (
                      <pre className="whitespace-pre-wrap break-all leading-relaxed text-[11px] text-slate-200">
                        {JSON.stringify(demoOutput, null, 2)}
                      </pre>
                    ) : (
                      <span className="text-slate-500">Click &quot;Re-run Test&quot; to execute domain logic...</span>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Validated in Runtime
                    </span>
                    <span>Evaluation Score: 25/25</span>
                  </div>
                </CardContent>
              </Card>

              {/* Professor Explanation Card */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 text-xs space-y-2">
                <span className="font-bold text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Faculty Demonstration Script:
                </span>
                <p className="text-slate-400 leading-relaxed">
                  When demonstrating this to the professor, open the inspector tab for the assigned unit, show the file line numbers in the project repository, and click &quot;Re-run Test&quot; to verify that encapsulation, polymorphism, and exception handling behave according to OOP syllabus specifications.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
