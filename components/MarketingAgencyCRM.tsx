import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Users, LayoutDashboard, Briefcase, Calendar, MessageSquare, Settings, Search, Plus, MoreVertical, TrendingUp, DollarSign, CheckCircle2, Clock, Filter, ArrowUpRight, ArrowDownRight, Target, Rocket, Bell, ChevronDown, ChevronRight, Star, Zap, Bot, UserPlus, EyeOff, Video, MoreHorizontal, GripVertical, Table2, LayoutGrid, AlignLeft, ArrowUpDown, KanbanSquare, Send, Paperclip, Smile, Phone, ChevronLeft, X, Activity, BarChart2, TrendingDown, Percent, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
const emitAgencyKpiEvent = (..._args: any[]) => {};
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const formatCompactCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(value || 0);

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value || 0);

const parseRevenueValue = (value: string) => {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
};

const toTelemetryId = (value: string, fallback: string) => {
    const normalized = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    return normalized || fallback;
};

const parseRelativeTimeToMinutes = (value: string) => {
    const text = value.trim().toLowerCase();
    if (!text || text === 'just now') return 0;

    const numberMatch = text.match(/(\d+)/);
    const amount = numberMatch ? Number(numberMatch[1]) : NaN;
    if (!Number.isFinite(amount)) return null;

    if (text.includes('min')) return amount;
    if (text.includes('hour')) return amount * 60;
    if (text.includes('day')) return amount * 60 * 24;
    if (text.includes('week')) return amount * 60 * 24 * 7;
    return null;
};

// ─────────────────────────────────────────────
// DARK THEME TOKENS
// ─────────────────────────────────────────────
// bg-[#0f0f13]  = global background (deep dark gray)
// bg-[#16161d]  = card/panel background (obsidian)
// bg-[#1c1c26]  = elevated card / hover state
// bg-[#22223a]  = borders / dividers
// #6366f1       = electric indigo primary
// #818cf8       = indigo light / accent

// ─────────────────────────────────────────────
// SHARED TYPES & DATA
// ─────────────────────────────────────────────

type Client = {
    id: string;
    name: string;
    industry: string;
    revenue: string;
    status: 'Active' | 'Onboarding' | 'Lead' | 'Paused';
    avatar: string;
    health: 'Good' | 'Fair' | 'At Risk';
};
const CLIENTS: Client[] = [{
    id: '1',
    name: 'Nebula Tech',
    industry: 'SaaS',
    revenue: '$12,500/mo',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nebula',
    health: 'Good'
}, {
    id: '2',
    name: 'EcoWare',
    industry: 'E-commerce',
    revenue: '$8,200/mo',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eco',
    health: 'Fair'
}, {
    id: '3',
    name: 'FreshRoots',
    industry: 'CPG',
    revenue: '$4,500/mo',
    status: 'Onboarding',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roots',
    health: 'Good'
}, {
    id: '4',
    name: 'SkyHigh Real Estate',
    industry: 'Real Estate',
    revenue: '$15,000/mo',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sky',
    health: 'At Risk'
}, {
    id: '5',
    name: 'PixelForge Studio',
    industry: 'Design',
    revenue: '$6,300/mo',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pixel',
    health: 'Good'
}, {
    id: '6',
    name: 'Momentum Health',
    industry: 'Healthcare',
    revenue: '$9,100/mo',
    status: 'Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Health',
    health: 'Fair'
}, {
    id: '7',
    name: 'ArcLight Media',
    industry: 'Media',
    revenue: '$11,200/mo',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arc',
    health: 'Good'
}, {
    id: '8',
    name: 'Cruxel Fintech',
    industry: 'Finance',
    revenue: '$18,000/mo',
    status: 'Paused',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Crux',
    health: 'At Risk'
}];
const PERFORMANCE_DATA = [{
    name: 'Jan',
    revenue: 45000,
    clients: 12,
    ctr: 2.1,
    cac: 340,
    leads: 42,
    conv: 18
}, {
    name: 'Feb',
    revenue: 52000,
    clients: 15,
    ctr: 2.4,
    cac: 310,
    leads: 58,
    conv: 22
}, {
    name: 'Mar',
    revenue: 48000,
    clients: 18,
    ctr: 2.2,
    cac: 290,
    leads: 51,
    conv: 19
}, {
    name: 'Apr',
    revenue: 61000,
    clients: 22,
    ctr: 2.9,
    cac: 275,
    leads: 74,
    conv: 31
}, {
    name: 'May',
    revenue: 59000,
    clients: 25,
    ctr: 2.7,
    cac: 260,
    leads: 67,
    conv: 28
}, {
    name: 'Jun',
    revenue: 72000,
    clients: 28,
    ctr: 3.4,
    cac: 240,
    leads: 89,
    conv: 38
}];
const CHANNEL_DATA = [{
    name: 'Organic',
    value: 38,
    color: '#6366f1'
}, {
    name: 'Paid',
    value: 27,
    color: '#818cf8'
}, {
    name: 'Social',
    value: 20,
    color: '#a5b4fc'
}, {
    name: 'Referral',
    value: 15,
    color: '#c7d2fe'
}];

// ─────────────────────────────────────────────
// MONDAY BOARD TYPES & DATA
// ─────────────────────────────────────────────

type Priority = 'High' | 'Medium' | 'Low' | 'Critical' | '';
type Status = 'Working on it' | 'Waiting for review' | 'Approved' | 'Done' | 'Stuck' | '';
type ViewMode = 'table' | 'kanban';
interface Task {
    id: string;
    name: string;
    person: string | null;
    priority: Priority;
    status: Status;
    date: string;
    description: string;
    selected: boolean;
    updates: number;
}
interface Group {
    id: string;
    title: string;
    color: string;
    items: Task[];
    expanded: boolean;
}
const PRIORITY_COLORS: Record<string, {
    pill: string;
    dot: string;
}> = {
    High: {
        pill: 'bg-rose-500 text-white',
        dot: 'bg-rose-500'
    },
    Medium: {
        pill: 'bg-amber-400 text-white',
        dot: 'bg-amber-400'
    },
    Low: {
        pill: 'bg-emerald-400 text-white',
        dot: 'bg-emerald-400'
    },
    Critical: {
        pill: 'bg-purple-600 text-white',
        dot: 'bg-purple-600'
    },
    '': {
        pill: 'bg-[#22223a] text-gray-500',
        dot: 'bg-[#22223a]'
    }
};
const STATUS_COLORS: Record<string, {
    pill: string;
    dot: string;
}> = {
    'Working on it': {
        pill: 'bg-amber-500 text-white',
        dot: 'bg-amber-500'
    },
    'Waiting for review': {
        pill: 'bg-blue-400 text-white',
        dot: 'bg-blue-400'
    },
    'Approved': {
        pill: 'bg-emerald-500 text-white',
        dot: 'bg-emerald-500'
    },
    'Done': {
        pill: 'bg-green-500 text-white',
        dot: 'bg-green-500'
    },
    'Stuck': {
        pill: 'bg-red-500 text-white',
        dot: 'bg-red-500'
    },
    '': {
        pill: 'bg-[#22223a] text-gray-500',
        dot: 'bg-[#22223a]'
    }
};
const PRIORITIES: Priority[] = ['High', 'Medium', 'Low', 'Critical', ''];
const STATUSES: Status[] = ['Working on it', 'Waiting for review', 'Approved', 'Done', 'Stuck', ''];
const INITIAL_GROUPS: Group[] = [{
    id: 'g1',
    title: 'This Week',
    color: '#6366f1',
    expanded: true,
    items: [{
        id: 't1',
        name: 'Design the new landing page banner',
        person: 'https://i.pravatar.cc/150?u=1',
        priority: 'High',
        status: 'Working on it',
        date: 'Feb 18',
        description: "Let's make a beautiful banner",
        selected: false,
        updates: 2
    }, {
        id: 't2',
        name: 'Create social media post templates',
        person: 'https://i.pravatar.cc/150?u=2',
        priority: 'Medium',
        status: 'Waiting for review',
        date: 'Feb 16',
        description: 'The post design should have colors',
        selected: false,
        updates: 0
    }, {
        id: 't3',
        name: 'Photography session planning',
        person: 'https://i.pravatar.cc/150?u=3',
        priority: 'Low',
        status: 'Approved',
        date: 'Feb 26',
        description: "Let's include the family dogs",
        selected: false,
        updates: 5
    }]
}, {
    id: 'g2',
    title: 'Next Week',
    color: '#818cf8',
    expanded: true,
    items: [{
        id: 't4',
        name: 'Wireframe review session',
        person: null,
        priority: '',
        status: '',
        date: 'Mar 17',
        description: 'Design should be simple and concise',
        selected: false,
        updates: 0
    }, {
        id: 't5',
        name: 'Awaiting client feedback on mockups',
        person: 'https://i.pravatar.cc/150?u=4',
        priority: 'High',
        status: 'Stuck',
        date: 'Mar 19',
        description: 'Waiting on client feedback',
        selected: false,
        updates: 1
    }]
}, {
    id: 'g3',
    title: 'Backlog',
    color: '#a5b4fc',
    expanded: true,
    items: [{
        id: 't6',
        name: 'Update brand style guide',
        person: 'https://i.pravatar.cc/150?u=5',
        priority: 'Medium',
        status: 'Working on it',
        date: 'Apr 2',
        description: 'New typography & color rules',
        selected: false,
        updates: 3
    }, {
        id: 't7',
        name: 'Design onboarding flow',
        person: 'https://i.pravatar.cc/150?u=6',
        priority: 'Critical',
        status: 'Done',
        date: 'Apr 5',
        description: 'User-friendly first experience',
        selected: false,
        updates: 0
    }, {
        id: 't8',
        name: 'Icon library refresh',
        person: null,
        priority: 'Low',
        status: 'Waiting for review',
        date: 'Apr 10',
        description: 'Consistent icon sizing across app',
        selected: false,
        updates: 0
    }]
}];

// ─────────────────────────────────────────────
// BOARD SUB-COMPONENTS (Dark)
// ─────────────────────────────────────────────

const Avatar = ({
    src,
    alt,
    size = 'sm'
}: {
    src: string | null;
    alt: string;
    size?: 'sm' | 'md';
}) => {
    const cls = size === 'md' ? 'w-7 h-7 rounded-full border-2 border-[#22223a] shadow-sm' : 'w-5 h-5 rounded-full border border-[#22223a]';
    if (!src) return <div className={cn(cls, 'bg-[#22223a] flex items-center justify-center text-gray-500')}>
        <Users size={size === 'md' ? 14 : 11} />
    </div>;
    return <img src={src} alt={alt} className={cn(cls, 'object-cover')} />;
};
const PillBadge = ({
    label,
    type,
    onClick
}: {
    label: string;
    type: 'status' | 'priority';
    onClick?: () => void;
}) => {
    const map = type === 'status' ? STATUS_COLORS : PRIORITY_COLORS;
    const colorClass = (map[label] || map['']).pill;
    if (!label) return <span className="text-[11px] text-gray-600 italic">—</span>;
    return <button onClick={onClick} className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium transition-opacity hover:opacity-80 select-none whitespace-nowrap', colorClass)}>
        {label}
    </button>;
};
const DotBadge = ({
    label,
    type,
    onClick
}: {
    label: string;
    type: 'status' | 'priority';
    onClick?: () => void;
}) => {
    const map = type === 'status' ? STATUS_COLORS : PRIORITY_COLORS;
    const dotClass = (map[label] || map['']).dot;
    return <button onClick={onClick} className="flex items-center gap-1.5 px-1.5 cursor-pointer select-none w-full truncate group/dot">
        <span className={cn('flex-shrink-0 w-2 h-2 rounded-full', dotClass)} />
        <span className="text-[11px] text-gray-400 truncate leading-none">
            {label || <span className="text-gray-600 italic">—</span>}
        </span>
    </button>;
};

// ─────────────────────────────────────────────
// TABLE VIEW (Dark)
// ─────────────────────────────────────────────

const TableColumnHeader = ({
    title,
    width,
    icon: Icon
}: {
    title: string;
    width: string;
    icon?: React.ElementType;
}) => <div className="flex items-center justify-center border-r border-[#22223a] h-8 px-2 text-[11px] text-gray-500 font-medium bg-[#16161d] first:justify-start select-none flex-shrink-0" style={{
    width,
    minWidth: width
}}>
        {title}{Icon && <Icon size={11} className="ml-1 text-gray-600" />}
    </div>;
const TableView = ({
    groups,
    onToggleGroup,
    onAddItem,
    onUpdateStatus
}: {
    groups: Group[];
    onToggleGroup: (id: string) => void;
    onAddItem: (groupId: string, name: string) => void;
    onUpdateStatus: (groupId: string, itemId: string, field: 'status' | 'priority') => void;
}) => {
    const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({});
    return <div className="w-full overflow-x-auto pt-4 pb-20">
        <div className="min-w-[860px] pl-6 pr-4">
            {groups.map(group => <div key={group.id} className="mb-6">
                <div className="group flex items-center gap-1.5 mb-1.5 sticky left-0">
                    <button className="p-0.5 rounded hover:bg-[#22223a] cursor-pointer transition-colors" onClick={() => onToggleGroup(group.id)}>
                        <ChevronDown size={14} className={cn('transition-transform duration-200', !group.expanded && '-rotate-90')} style={{
                            color: group.color
                        }} />
                    </button>
                    <h3 className="text-sm font-semibold cursor-pointer leading-none" style={{
                        color: group.color
                    }}>{group.title}</h3>
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                        backgroundColor: group.color + '22',
                        color: group.color
                    }}>
                        {group.items.length}
                    </span>
                </div>
                <AnimatePresence>
                    {group.expanded && <motion.div initial={{
                        opacity: 0,
                        height: 0
                    }} animate={{
                        opacity: 1,
                        height: 'auto'
                    }} exit={{
                        opacity: 0,
                        height: 0
                    }} transition={{
                        duration: 0.18
                    }}>
                        <div className="border border-[#22223a] border-l-4 rounded-md overflow-hidden shadow-sm" style={{
                            borderLeftColor: group.color
                        }}>
                            <div className="flex items-center border-b border-[#22223a] bg-[#1c1c26]">
                                <div className="w-8 flex-shrink-0 flex items-center justify-center border-r border-[#22223a] h-8 bg-[#16161d] z-10">
                                    <input type="checkbox" className="rounded border-[#22223a] w-3 h-3 accent-indigo-500" />
                                </div>
                                <div className="flex-1 min-w-[200px] border-r border-[#22223a] h-8 px-2 flex items-center text-[11px] text-gray-500 font-medium">Item</div>
                                <TableColumnHeader title="Assignee" width="72px" icon={CheckCircle2} />
                                <TableColumnHeader title="Status" width="128px" icon={CheckCircle2} />
                                <TableColumnHeader title="Priority" width="100px" icon={CheckCircle2} />
                                <TableColumnHeader title="Due Date" width="96px" icon={CheckCircle2} />
                                <TableColumnHeader title="Description" width="180px" />
                            </div>
                            {group.items.map(item => <div key={item.id} className="flex items-center border-b border-[#1c1c26] hover:bg-indigo-500/5 group/row h-8 bg-[#16161d] transition-colors">
                                <div className="w-8 flex-shrink-0 flex items-center justify-center border-r border-[#22223a] h-full bg-[#16161d] group-hover/row:bg-indigo-500/5 z-10 transition-colors">
                                    <input type="checkbox" className="rounded border-[#22223a] w-3 h-3 opacity-0 group-hover/row:opacity-100 focus:opacity-100 transition-opacity accent-indigo-500" />
                                </div>
                                <div className="flex-1 min-w-[200px] border-r border-[#22223a] h-full px-2 flex items-center justify-between text-[11px] text-gray-400 group-hover/row:text-gray-200">
                                    <span className="truncate cursor-text font-medium">{item.name}</span>
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity flex-shrink-0 ml-1">
                                        <button className="text-gray-600 hover:text-indigo-400 relative">
                                            <MessageSquare size={12} />
                                            {item.updates > 0 && <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[7px] w-2.5 h-2.5 flex items-center justify-center rounded-full font-bold">{item.updates}</span>}
                                        </button>
                                        <button className="text-gray-600 hover:text-indigo-400"><Star size={11} /></button>
                                    </div>
                                </div>
                                <div className="w-[72px] flex-shrink-0 border-r border-[#22223a] h-full flex items-center justify-center">
                                    <Avatar src={item.person} alt="User" size="sm" />
                                </div>
                                <div className="w-[128px] flex-shrink-0 border-r border-[#22223a] h-full flex items-center">
                                    <DotBadge label={item.status} type="status" onClick={() => onUpdateStatus(group.id, item.id, 'status')} />
                                </div>
                                <div className="w-[100px] flex-shrink-0 border-r border-[#22223a] h-full flex items-center">
                                    <DotBadge label={item.priority} type="priority" onClick={() => onUpdateStatus(group.id, item.id, 'priority')} />
                                </div>
                                <div className="w-[96px] flex-shrink-0 border-r border-[#22223a] h-full flex items-center justify-center text-[11px] text-gray-500">
                                    {item.date && <span className="flex items-center gap-1 hover:bg-indigo-500 hover:text-white px-1.5 py-0.5 rounded transition-colors cursor-pointer group/date w-full justify-center">
                                        <Calendar size={10} className="opacity-0 group-hover/date:opacity-100 flex-shrink-0" />{item.date}
                                    </span>}
                                </div>
                                <div className="w-[180px] flex-shrink-0 h-full px-2 flex items-center text-[11px] text-gray-600 truncate border-r border-[#22223a]">
                                    {item.description}
                                </div>
                            </div>)}
                            <div className="flex items-center h-8 hover:bg-[#1c1c26] group/add">
                                <div className="w-8 flex-shrink-0 border-r border-transparent h-full z-10" />
                                <div className="flex-1 min-w-[200px] border-r border-transparent h-full px-2 flex items-center">
                                    <input type="text" placeholder="+ Add item" className="w-full bg-transparent text-[11px] focus:outline-none placeholder-gray-600 text-gray-400" value={newItemTexts[group.id] || ''} onChange={e => setNewItemTexts(prev => ({
                                        ...prev,
                                        [group.id]: e.target.value
                                    }))} onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            onAddItem(group.id, newItemTexts[group.id] || '');
                                            setNewItemTexts(prev => ({
                                                ...prev,
                                                [group.id]: ''
                                            }));
                                        }
                                    }} />
                                    {(newItemTexts[group.id] || '').trim() && <button className="text-[11px] bg-indigo-600 text-white px-2 py-0.5 rounded ml-1 flex-shrink-0" onClick={() => {
                                        onAddItem(group.id, newItemTexts[group.id] || '');
                                        setNewItemTexts(prev => ({
                                            ...prev,
                                            [group.id]: ''
                                        }));
                                    }}>
                                        Add
                                    </button>}
                                </div>
                            </div>
                        </div>
                    </motion.div>}
                </AnimatePresence>
            </div>)}
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-300 hover:bg-[#22223a] rounded-lg transition-colors">
                <Plus size={14} />Add group
            </button>
        </div>
    </div>;
};

// ─────────────────────────────────────────────
// KANBAN VIEW (Dark)
// ─────────────────────────────────────────────

const TaskCard = ({
    item,
    groupId,
    onUpdateStatus
}: {
    item: Task;
    groupId: string;
    onUpdateStatus: (groupId: string, itemId: string, field: 'status' | 'priority') => void;
}) => <motion.div layout initial={{
    opacity: 0,
    y: 8
}} animate={{
    opacity: 1,
    y: 0
}} exit={{
    opacity: 0,
    y: -8
}} transition={{
    duration: 0.18
}} className="bg-[#1c1c26] rounded-lg shadow-sm border border-[#22223a] hover:shadow-md hover:border-indigo-500/30 transition-all duration-150 cursor-pointer group p-3">
        <div className="flex items-start gap-1.5 mb-2.5">
            <GripVertical size={14} className="text-gray-700 group-hover:text-gray-500 mt-0.5 flex-shrink-0 transition-colors" />
            <p className="text-sm font-medium text-gray-200 leading-snug flex-1 line-clamp-2">{item.name}</p>
        </div>
        {item.description && <p className="text-xs text-gray-600 mb-2.5 pl-5 line-clamp-1">{item.description}</p>}
        <div className="flex items-end justify-between gap-2 pl-5">
            <div className="flex flex-wrap items-center gap-1.5">
                {item.status ? <PillBadge label={item.status} type="status" onClick={() => onUpdateStatus(groupId, item.id, 'status')} /> : null}
                {item.priority ? <PillBadge label={item.priority} type="priority" onClick={() => onUpdateStatus(groupId, item.id, 'priority')} /> : null}
                {!item.status && !item.priority && <span className="text-[11px] text-gray-600 italic">No status</span>}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
                {item.updates > 0 && <div className="relative">
                    <MessageSquare size={13} className="text-gray-500" />
                    <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">{item.updates}</span>
                </div>}
                {item.date && <div className="flex items-center gap-0.5 text-[10px] text-gray-600"><Clock size={10} />{item.date}</div>}
                <Avatar src={item.person} alt="Assignee" size="md" />
            </div>
        </div>
    </motion.div>;
const KanbanColumn = ({
    group,
    onToggle,
    onAddItem,
    onUpdateStatus
}: {
    group: Group;
    onToggle: (id: string) => void;
    onAddItem: (groupId: string, name: string) => void;
    onUpdateStatus: (groupId: string, itemId: string, field: 'status' | 'priority') => void;
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [inputText, setInputText] = useState('');
    const handleAdd = () => {
        if (inputText.trim()) {
            onAddItem(group.id, inputText);
            setInputText('');
        }
        setIsAdding(false);
    };
    return <div className="flex flex-col w-64 flex-shrink-0">
        <div className="flex items-center justify-between px-3 py-2.5 rounded-t-xl" style={{
            backgroundColor: group.color + '18',
            borderTop: `3px solid ${group.color}`
        }}>
            <div className="flex items-center gap-2">
                <button onClick={() => onToggle(group.id)} className="flex items-center gap-1.5">
                    <ChevronDown size={15} className="transition-transform duration-200" style={{
                        color: group.color,
                        transform: group.expanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                    }} />
                    <span className="text-sm font-semibold" style={{
                        color: group.color
                    }}>{group.title}</span>
                </button>
                <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{
                    backgroundColor: group.color + '30',
                    color: group.color
                }}>{group.items.length}</span>
            </div>
            <button className="p-0.5 rounded hover:bg-white/5 transition-colors text-gray-500 hover:text-gray-300"><MoreHorizontal size={15} /></button>
        </div>
        <div className="flex-1 rounded-b-xl overflow-y-auto" style={{
            maxHeight: '420px',
            backgroundColor: group.color + '08',
            borderLeft: `1px solid ${group.color}30`,
            borderRight: `1px solid ${group.color}30`,
            borderBottom: `1px solid ${group.color}30`
        }}>
            <AnimatePresence>
                {group.expanded && <motion.div initial={{
                    opacity: 0,
                    height: 0
                }} animate={{
                    opacity: 1,
                    height: 'auto'
                }} exit={{
                    opacity: 0,
                    height: 0
                }} transition={{
                    duration: 0.2
                }} className="p-2 flex flex-col gap-2">
                    {group.items.map(item => <TaskCard key={item.id} item={item} groupId={group.id} onUpdateStatus={onUpdateStatus} />)}
                    <AnimatePresence>
                        {isAdding ? <motion.div initial={{
                            opacity: 0,
                            y: 4
                        }} animate={{
                            opacity: 1,
                            y: 0
                        }} exit={{
                            opacity: 0,
                            y: -4
                        }} transition={{
                            duration: 0.15
                        }} className="bg-[#1c1c26] rounded-lg border border-indigo-500/40 shadow-sm p-3">
                            <input autoFocus type="text" placeholder="Task name..." className="w-full text-sm text-gray-200 placeholder-gray-600 focus:outline-none mb-2 bg-transparent" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => {
                                if (e.key === 'Enter') handleAdd();
                                if (e.key === 'Escape') {
                                    setIsAdding(false);
                                    setInputText('');
                                }
                            }} />
                            <div className="flex items-center gap-2">
                                <button onClick={handleAdd} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition-colors">Add</button>
                                <button onClick={() => {
                                    setIsAdding(false);
                                    setInputText('');
                                }} className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded hover:bg-[#22223a] transition-colors">Cancel</button>
                            </div>
                        </motion.div> : <motion.button initial={{
                            opacity: 0
                        }} animate={{
                            opacity: 1
                        }} onClick={() => setIsAdding(true)} className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-all duration-150 group/add">
                            <Plus size={13} className="text-gray-600 group-hover/add:text-gray-400 transition-colors" />Add card
                        </motion.button>}
                    </AnimatePresence>
                </motion.div>}
            </AnimatePresence>
            {!group.expanded && <div className="px-3 py-2 text-xs text-gray-600 italic">{group.items.length} item{group.items.length !== 1 ? 's' : ''} hidden</div>}
        </div>
    </div>;
};
const KanbanView = ({
    groups,
    onToggle,
    onAddItem,
    onUpdateStatus
}: {
    groups: Group[];
    onToggle: (id: string) => void;
    onAddItem: (groupId: string, name: string) => void;
    onUpdateStatus: (groupId: string, itemId: string, field: 'status' | 'priority') => void;
}) => <div className="w-full h-full overflow-x-auto overflow-y-hidden">
        <div className="flex items-start gap-3 p-4 min-w-max h-full">
            {groups.map(group => <KanbanColumn key={group.id} group={group} onToggle={onToggle} onAddItem={onAddItem} onUpdateStatus={onUpdateStatus} />)}
            <button className="flex-shrink-0 w-56 flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[#22223a] text-gray-600 hover:border-indigo-500/40 hover:text-gray-400 hover:bg-indigo-500/5 transition-all duration-150 text-sm font-medium">
                <Plus size={16} />Add group
            </button>
        </div>
    </div>;

// ─────────────────────────────────────────────
// EMBEDDED BOARD (Dark)
// ─────────────────────────────────────────────

const VIEW_TABS = [{
    id: 'table',
    label: 'Main Table',
    icon: Table2
}, {
    id: 'kanban',
    label: 'Kanban',
    icon: LayoutGrid
}, {
    id: 'timeline',
    label: 'Timeline',
    icon: AlignLeft
}, {
    id: 'calendar',
    label: 'Calendar',
    icon: Calendar
}] as const;
const EmbeddedBoard = ({
    seedGroups
}: {
    seedGroups?: Group[];
}) => {
    const [groups, setGroups] = useState<Group[]>(() => seedGroups?.length ? seedGroups : INITIAL_GROUPS);
    const [activeView, setActiveView] = useState<ViewMode>('table');
    const [searchText, setSearchText] = useState('');
    useEffect(() => {
        if (seedGroups?.length) {
            setGroups(seedGroups);
        }
    }, [seedGroups]);
    const toggleGroup = (groupId: string) => setGroups(prev => prev.map(g => g.id === groupId ? {
        ...g,
        expanded: !g.expanded
    } : g));
    const addItem = (groupId: string, name: string) => {
        if (!name.trim()) return;
        setGroups(prev => prev.map(g => {
            if (g.id !== groupId) return g;
            return {
                ...g,
                items: [...g.items, {
                    id: Math.random().toString(36).substr(2, 9),
                    name,
                    person: null,
                    priority: '',
                    status: '',
                    date: new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    }),
                    description: '',
                    selected: false,
                    updates: 0
                }]
            };
        }));
    };
    const updateItemStatus = (groupId: string, itemId: string, field: 'status' | 'priority') => {
        setGroups(prev => prev.map(g => {
            if (g.id !== groupId) return g;
            return {
                ...g,
                items: g.items.map(item => {
                    if (item.id !== itemId) return item;
                    if (field === 'priority') {
                        const nextIdx = (PRIORITIES.indexOf(item.priority) + 1) % PRIORITIES.length;
                        return {
                            ...item,
                            priority: PRIORITIES[nextIdx]
                        };
                    } else {
                        const nextIdx = (STATUSES.indexOf(item.status) + 1) % STATUSES.length;
                        return {
                            ...item,
                            status: STATUSES[nextIdx]
                        };
                    }
                })
            };
        }));
    };
    const filteredGroups = searchText.trim() ? groups.map(g => ({
        ...g,
        items: g.items.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.description.toLowerCase().includes(searchText.toLowerCase()))
    })).filter(g => g.items.length > 0) : groups;
    const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
    return <div className="flex flex-col h-full w-full bg-[#16161d] text-sm font-sans text-gray-200 overflow-hidden">
        {/* Board Header */}
        <div className="flex-none px-4 py-3 border-b border-[#22223a] bg-[#16161d]">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <h2 className="text-lg font-semibold text-gray-100 truncate">Design Weekly Tasks</h2>
                    <ChevronDown className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-300 flex-shrink-0" />
                    <span className="text-xs text-gray-500 bg-[#22223a] px-2 py-0.5 rounded-full ml-1 flex-shrink-0">{totalItems} items</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                    <button className="flex items-center gap-1 text-gray-500 hover:bg-[#22223a] px-2 py-1 rounded cursor-pointer transition-colors text-xs"><Zap size={13} /> Integrate</button>
                    <button className="flex items-center gap-1 text-gray-500 hover:bg-[#22223a] px-2 py-1 rounded cursor-pointer transition-colors text-xs"><Bot size={13} /> Automate</button>
                    <div className="w-px h-4 bg-[#22223a] mx-0.5" />
                    <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">PF</div>
                    <button className="flex items-center gap-1 px-2 py-1 border border-[#22223a] rounded-lg hover:bg-[#22223a] cursor-pointer text-xs font-medium transition-colors text-gray-400"><UserPlus size={12} /> Invite</button>
                    <button className="p-1.5 hover:bg-[#22223a] rounded text-gray-500 transition-colors"><MoreHorizontal size={15} /></button>
                </div>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                {VIEW_TABS.map(({
                    id,
                    label,
                    icon: Icon
                }) => {
                    const isDisabled = id !== 'table' && id !== 'kanban';
                    return <button key={id} disabled={isDisabled} onClick={() => !isDisabled && setActiveView(id as ViewMode)} className={cn('flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-all duration-150 whitespace-nowrap flex-shrink-0', activeView === id ? 'bg-indigo-600 text-white shadow-sm' : isDisabled ? 'text-gray-700 cursor-default' : 'text-gray-500 hover:bg-[#22223a] hover:text-gray-300')}>
                        <Icon size={13} />{label}
                    </button>;
                })}
                <button className="p-1.5 hover:bg-[#22223a] rounded-md text-gray-500 transition-colors ml-1 flex-shrink-0"><Plus size={13} /></button>
            </div>
        </div>
        {/* Board Toolbar */}
        <div className="flex-none px-4 py-2 border-b border-[#22223a] flex items-center justify-between bg-[#16161d] gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors font-medium shadow-sm shadow-indigo-900/50 whitespace-nowrap">
                    <Plus size={13} />New Item<div className="h-3 w-px bg-indigo-500 mx-0.5" /><ChevronDown size={11} />
                </button>
                <div className="flex items-center gap-1">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3" />
                        <input type="text" placeholder="Search…" value={searchText} onChange={e => setSearchText(e.target.value)} className="pl-7 pr-3 py-1 border border-[#22223a] rounded-full text-[11px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 w-28 hover:w-36 focus:w-36 transition-all duration-200 bg-[#0f0f13] text-gray-300 placeholder-gray-600" />
                    </div>
                    <button className="flex items-center gap-1 px-2 py-1 hover:bg-[#22223a] rounded-md text-gray-500 text-[11px] transition-colors whitespace-nowrap"><Filter size={12} /> Filter</button>
                    <button className="flex items-center gap-1 px-2 py-1 hover:bg-[#22223a] rounded-md text-gray-500 text-[11px] transition-colors whitespace-nowrap"><ArrowUpDown size={12} /> Sort</button>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button className="flex items-center gap-1 px-2 py-1 hover:bg-[#22223a] rounded-md text-gray-500 text-[11px] transition-colors whitespace-nowrap"><EyeOff size={12} /> Hide</button>
                <button className="flex items-center gap-1 px-2 py-1 hover:bg-[#22223a] rounded-md text-gray-500 text-[11px] transition-colors whitespace-nowrap"><Video size={12} /> Group by</button>
                <button className="p-1.5 hover:bg-[#22223a] rounded-md text-gray-500 transition-colors"><MoreHorizontal size={14} /></button>
            </div>
        </div>
        {/* Board Area */}
        <div className="flex-1 overflow-auto bg-[#16161d] min-h-0">
            <AnimatePresence mode="wait">
                <motion.div key={activeView} initial={{
                    opacity: 0,
                    y: 6
                }} animate={{
                    opacity: 1,
                    y: 0
                }} exit={{
                    opacity: 0,
                    y: -6
                }} transition={{
                    duration: 0.15
                }} className="h-full">
                    {activeView === 'table' ? <TableView groups={filteredGroups} onToggleGroup={toggleGroup} onAddItem={addItem} onUpdateStatus={updateItemStatus} /> : <KanbanView groups={filteredGroups} onToggle={toggleGroup} onAddItem={addItem} onUpdateStatus={updateItemStatus} />}
                </motion.div>
            </AnimatePresence>
        </div>
    </div>;
};

// ─────────────────────────────────────────────
// CRM SIDEBAR ITEM (Dark)
// ─────────────────────────────────────────────

const SidebarItem = ({
    icon: Icon,
    label,
    isActive,
    onClick,
    badge
}: {
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
    badge?: number;
}) => <button onClick={onClick} className={cn('w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group', isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-gray-500 hover:bg-[#1c1c26] hover:text-gray-200')}>
        <Icon size={18} className={isActive ? 'text-white' : 'group-hover:text-indigo-400'} />
        <span className="font-medium flex-1 text-left text-sm">{label}</span>
        {badge !== undefined && badge > 0 && <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center', isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400')}>{badge}</span>}
    </button>;

// ─────────────────────────────────────────────
// MINI CHART COMPONENTS
// ─────────────────────────────────────────────

const MiniSparkline = ({
    data,
    color,
    dataKey
}: {
    data: any[];
    color: string;
    dataKey: string;
}) => <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={data} margin={{
            top: 2,
            right: 0,
            left: 0,
            bottom: 0
        }}>
            <defs>
                <linearGradient id={`spark-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} fill={`url(#spark-${dataKey})`} dot={false} />
        </AreaChart>
    </ResponsiveContainer>;
const MiniBarSparkline = ({
    data,
    color,
    dataKey
}: {
    data: any[];
    color: string;
    dataKey: string;
}) => <ResponsiveContainer width="100%" height={40}>
        <BarChart data={data} margin={{
            top: 2,
            right: 0,
            left: 0,
            bottom: 0
        }} barSize={6}>
            <Bar dataKey={dataKey} fill={color} radius={[2, 2, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>;
const MiniLineSparkline = ({
    data,
    color,
    dataKey
}: {
    data: any[];
    color: string;
    dataKey: string;
}) => <ResponsiveContainer width="100%" height={40}>
        <LineChart data={data} margin={{
            top: 2,
            right: 0,
            left: 0,
            bottom: 0
        }}>
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} />
        </LineChart>
    </ResponsiveContainer>;

// ─────────────────────────────────────────────
// KPI MINI CARD
// ─────────────────────────────────────────────

const KpiCard = ({
    title,
    value,
    change,
    trend,
    icon: Icon,
    color,
    chartData,
    chartKey,
    chartType = 'area'
}: {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ElementType;
    color: string;
    chartData: any[];
    chartKey: string;
    chartType?: 'area' | 'bar' | 'line';
}) => <div className="bg-[#16161d] border border-[#22223a] rounded-xl p-4 hover:border-indigo-500/20 transition-colors">
        <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-1.5">
                <Icon size={13} style={{
                    color
                }} />
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{title}</span>
            </div>
            <span className={cn('flex items-center gap-0.5 text-[11px] font-semibold', trend === 'up' ? 'text-emerald-400' : 'text-rose-400')}>
                {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{change}
            </span>
        </div>
        <p className="text-xl font-bold text-gray-100 mb-2">{value}</p>
        {chartType === 'area' && <MiniSparkline data={chartData} color={color} dataKey={chartKey} />}
        {chartType === 'bar' && <MiniBarSparkline data={chartData} color={color} dataKey={chartKey} />}
        {chartType === 'line' && <MiniLineSparkline data={chartData} color={color} dataKey={chartKey} />}
    </div>;

// ─────────────────────────────────────────────
// COMPACT STAT CARD
// ─────────────────────────────────────────────

const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend
}: {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    trend: 'up' | 'down';
}) => <div className="p-4 bg-[#16161d] rounded-xl border border-[#22223a] hover:border-indigo-500/20 transition-colors">
        <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg"><Icon size={18} className="text-indigo-400" /></div>
            <div className={cn('flex items-center gap-1 text-xs font-semibold', trend === 'up' ? 'text-emerald-400' : 'text-rose-400')}>
                {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change}
            </div>
        </div>
        <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-xl font-bold mt-0.5 text-gray-100">{value}</h3>
    </div>;

// ─────────────────────────────────────────────
// COMPACT DATA GRID
// ─────────────────────────────────────────────

const DataGridRow = ({
    label,
    value,
    subValue,
    trend,
    color
}: {
    label: string;
    value: string;
    subValue?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
}) => <div className="flex items-center justify-between py-2 border-b border-[#22223a] last:border-0">
        <div className="flex items-center gap-2">
            {color && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                backgroundColor: color
            }} />}
            <span className="text-[12px] text-gray-400">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {subValue && <span className="text-[11px] text-gray-600">{subValue}</span>}
            <span className={cn('text-[12px] font-semibold', trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-gray-200')}>
                {value}
            </span>
            {trend && trend !== 'neutral' && (trend === 'up' ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-rose-400" />)}
        </div>
    </div>;

// ─────────────────────────────────────────────
// NAV ITEMS CONFIG
// ─────────────────────────────────────────────

type NavTab = 'dashboard' | 'clients' | 'projects' | 'board' | 'calendar' | 'messages' | 'settings';
export type MarketingAgencyCRMTab = NavTab;

type MarketingDeal = {
    company: string;
    value: number;
    stage: string;
    probability: number;
    owner: string;
    closeDate: string;
    activities: number;
    daysInStage: number;
};

type MarketingContact = {
    name: string;
    company: string;
    email: string;
    phone: string;
    type: string;
    deals: number;
};

type MarketingActivity = {
    type: string;
    user: string;
    action: string;
    target: string;
    time: string;
    details: string;
};

type MarketingMeeting = {
    time: string;
    title: string;
    attendees: number;
    location: string;
    type: string;
};

type MarketingTask = {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    assignee: string;
    relatedTo: string;
    type: string;
};

type MarketingMetrics = {
    totalPipeline: number;
    activeDeals: number;
    totalContacts: number;
    meetingsThisWeek: number;
    forecastQuarter: number;
    activitiesToday: number;
    winRatePct: number;
    avgDealSize: number;
    salesCycleDays: number;
    conversionRatePct: number;
    stalledDealsCount: number;
};

type MarketingBanner = {
    status: 'critical' | 'warning' | 'healthy';
    constraint: string;
    recommendation: string;
    actionLabel: string;
};

export interface MarketingAgencyCRMData {
    userName: string;
    banner: MarketingBanner;
    metrics: MarketingMetrics;
    deals: MarketingDeal[];
    contacts: MarketingContact[];
    activities: MarketingActivity[];
    meetings: MarketingMeeting[];
    tasks: MarketingTask[];
}

type MarketingAgencyCRMProps = {
    activeTab?: MarketingAgencyCRMTab;
    onTabChange?: (tab: MarketingAgencyCRMTab) => void;
    data?: MarketingAgencyCRMData;
    onBackToDashboard?: () => void;
};

const NAV_ITEMS: {
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
}[] = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
}, {
    id: 'clients',
    label: 'Clients',
    icon: Users
}, {
    id: 'projects',
    label: 'Projects',
    icon: Briefcase,
    badge: 3
}, {
    id: 'board',
    label: 'Board',
    icon: KanbanSquare
}, {
    id: 'calendar',
    label: 'Calendar',
    icon: Calendar
}, {
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    badge: 5
}];

type ProjectCard = {
    name: string;
    client: string;
    progress: number;
    status: string;
    dueDate: string;
    color: string;
    tasks: number;
};

const FALLBACK_PROJECTS: ProjectCard[] = [{
    name: 'Nebula Tech Rebrand',
    client: 'Nebula Tech',
    progress: 72,
    status: 'Active',
    dueDate: 'Dec 15',
    color: '#6366f1',
    tasks: 8
}, {
    name: 'EcoWare Social Campaign',
    client: 'EcoWare',
    progress: 45,
    status: 'Active',
    dueDate: 'Jan 3',
    color: '#818cf8',
    tasks: 5
}, {
    name: 'FreshRoots Launch',
    client: 'FreshRoots',
    progress: 20,
    status: 'Onboarding',
    dueDate: 'Feb 1',
    color: '#a5b4fc',
    tasks: 12
}, {
    name: 'SkyHigh Q4 Ads',
    client: 'SkyHigh Real Estate',
    progress: 90,
    status: 'Review',
    dueDate: 'Nov 30',
    color: '#e2445c',
    tasks: 4
}];

const stageToProjectStatus = (stage: string) => {
    const normalized = stage.toLowerCase();
    if (normalized.includes('closed')) return 'Review';
    if (normalized.includes('proposal')) return 'Planning';
    if (normalized.includes('negotiation')) return 'Active';
    if (normalized.includes('qualified')) return 'Onboarding';
    return 'Active';
};

const stageToColor = (stage: string) => {
    const normalized = stage.toLowerCase();
    if (normalized.includes('closed')) return '#00c875';
    if (normalized.includes('proposal')) return '#a25ddc';
    if (normalized.includes('qualified')) return '#fdab3d';
    if (normalized.includes('lead')) return '#579bfc';
    return '#6366f1';
};

const taskStatusToBoardStatus = (status: string): Status => {
    if (status === 'completed') return 'Done';
    if (status === 'in-progress') return 'Working on it';
    return 'Waiting for review';
};

const taskPriorityToBoardPriority = (priority: string): Priority => {
    if (priority === 'high') return 'High';
    if (priority === 'medium') return 'Medium';
    if (priority === 'low') return 'Low';
    return '';
};

const buildClientsFromAdapter = (data?: MarketingAgencyCRMData): Client[] => {
    if (!data?.contacts?.length) return CLIENTS;

    const valueByCompany = new Map<string, number>();
    data.deals.forEach((deal) => {
        valueByCompany.set(deal.company, Math.max(deal.value, valueByCompany.get(deal.company) || 0));
    });

    return data.contacts.map((contact, index) => {
        const type = contact.type.toLowerCase();
        const status: Client['status'] = type.includes('customer') ? 'Active' : type.includes('prospect') ? 'Onboarding' : 'Lead';
        const health: Client['health'] = type.includes('customer') ? 'Good' : type.includes('prospect') ? 'Fair' : 'At Risk';
        const dealValue = valueByCompany.get(contact.company) || data.metrics.avgDealSize;
        return {
            id: `${index + 1}`,
            name: contact.company,
            industry: 'Marketing',
            revenue: `${formatCurrency(dealValue)}/mo`,
            status,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(contact.company)}`,
            health
        };
    });
};

const buildProjectsFromAdapter = (data?: MarketingAgencyCRMData): ProjectCard[] => {
    if (!data?.deals?.length) return FALLBACK_PROJECTS;
    return data.deals.map((deal, index) => ({
        name: `${deal.company} Growth Campaign`,
        client: deal.company,
        progress: Math.max(5, Math.min(100, deal.probability)),
        status: stageToProjectStatus(deal.stage),
        dueDate: deal.closeDate,
        color: stageToColor(deal.stage),
        tasks: Math.max(2, deal.activities),
    }));
};

const buildBoardGroupsFromTasks = (tasks?: MarketingTask[]): Group[] => {
    if (!tasks?.length) return INITIAL_GROUPS;

    const groups: Group[] = [{
        id: 'g1',
        title: 'This Week',
        color: '#6366f1',
        expanded: true,
        items: []
    }, {
        id: 'g2',
        title: 'In Progress',
        color: '#818cf8',
        expanded: true,
        items: []
    }, {
        id: 'g3',
        title: 'Completed',
        color: '#00c875',
        expanded: true,
        items: []
    }];

    tasks.forEach((task, index) => {
        const boardTask: Task = {
            id: `task-${task.id}`,
            name: task.title,
            person: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(task.assignee || `owner-${index}`)}`,
            priority: taskPriorityToBoardPriority(task.priority),
            status: taskStatusToBoardStatus(task.status),
            date: task.dueDate.replace(', 2026', ''),
            description: task.description,
            selected: false,
            updates: Math.max(0, index % 4),
        };

        if (task.status === 'completed') {
            groups[2].items.push(boardTask);
            return;
        }
        if (task.status === 'in-progress') {
            groups[1].items.push(boardTask);
            return;
        }
        groups[0].items.push(boardTask);
    });

    return groups.map((group) => ({
        ...group,
        items: group.items.length ? group.items : INITIAL_GROUPS.find((initial) => initial.id === group.id)?.items || []
    }));
};

// ─────────────────────────────────────────────
// BOARD VIEW
// ─────────────────────────────────────────────

const BoardView = ({
    seedGroups
}: {
    seedGroups?: Group[];
}) => <div className="flex flex-col h-full w-full overflow-hidden">
    <EmbeddedBoard seedGroups={seedGroups} />
</div>;

// ─────────────────────────────────────────────
// PROJECTS VIEW (Dark)
// ─────────────────────────────────────────────

const ProjectsView = ({
    projects
}: {
    projects: ProjectCard[];
}) => {
    const projectRows = projects.length ? projects : FALLBACK_PROJECTS;
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    return <div className="space-y-6 h-full flex flex-col">
        <div className="flex items-center justify-between flex-none">
            <div>
                <h1 className="text-2xl font-bold text-gray-100">Projects</h1>
                <p className="text-gray-500 mt-1 text-sm">Manage active campaigns and deliverables.</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-900/40 active:scale-95 text-sm">
                <Plus size={16} />New Project
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-none">
            {projectRows.map(p => <button key={p.name} onClick={() => setSelectedProject(selectedProject === p.name ? null : p.name)} className={cn('text-left p-4 bg-[#16161d] rounded-xl border transition-all duration-200 hover:border-indigo-500/30', selectedProject === p.name ? 'border-indigo-500/50 ring-2 ring-indigo-500/10 shadow-md' : 'border-[#22223a]')}>
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{
                                backgroundColor: p.color
                            }} />
                            <span className="font-bold text-sm text-gray-200">{p.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{p.client}</span>
                    </div>
                    <span className={cn('text-[10px] font-bold uppercase px-2 py-1 rounded-full', p.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : p.status === 'Review' ? 'bg-amber-500/15 text-amber-400' : 'bg-indigo-500/15 text-indigo-400')}>
                        {p.status}
                    </span>
                </div>
                <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span><span className="font-semibold" style={{
                            color: p.color
                        }}>{p.progress}%</span>
                    </div>
                    <div className="h-1 bg-[#22223a] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{
                            width: `${p.progress}%`,
                            backgroundColor: p.color
                        }} />
                    </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mt-3">
                    <div className="flex items-center gap-1"><CheckCircle2 size={11} />{p.tasks} tasks</div>
                    <div className="flex items-center gap-1"><Clock size={11} />Due {p.dueDate}</div>
                    <div className="flex items-center gap-1 text-indigo-400 font-medium">
                        {selectedProject === p.name ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                        {selectedProject === p.name ? 'Hide board' : 'Open board'}
                    </div>
                </div>
            </button>)}
        </div>

        <AnimatePresence>
            {selectedProject && <motion.div initial={{
                opacity: 0,
                height: 0
            }} animate={{
                opacity: 1,
                height: 480
            }} exit={{
                opacity: 0,
                height: 0
            }} transition={{
                duration: 0.3,
                ease: 'easeInOut'
            }} className="flex-none bg-[#16161d] rounded-xl border border-[#22223a] overflow-hidden shadow-lg">
                <div className="h-full overflow-hidden flex flex-col">
                    <EmbeddedBoard />
                </div>
            </motion.div>}
        </AnimatePresence>
    </div>;
};

// ─────────────────────────────────────────────
// CLIENTS VIEW — HIGH DENSITY (Dark)
// ─────────────────────────────────────────────

const ClientsView = ({
    searchQuery,
    clients,
    metrics
}: {
    searchQuery: string;
    clients: Client[];
    metrics?: MarketingMetrics;
}) => {
    const sourceClients = clients.length ? clients : CLIENTS;
    const filtered = useMemo(() => sourceClients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.industry.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery, sourceClients]);
    const totalMrr = sourceClients.reduce((sum, client) => sum + parseRevenueValue(client.revenue), 0);
    const avgMrr = sourceClients.length ? totalMrr / sourceClients.length : 0;
    return <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-100">Clients</h1>
                <p className="text-gray-500 mt-0.5 text-xs">{filtered.length} total clients · {sourceClients.filter(c => c.status === 'Active').length} active</p>
            </div>
            <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 border border-[#22223a] text-gray-400 px-3 py-1.5 rounded-lg text-xs hover:bg-[#1c1c26] transition-colors">
                    <Filter size={12} />Filter
                </button>
                <button className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-900/40 text-xs">
                    <Plus size={13} />Add Client
                </button>
            </div>
        </div>

        {/* High-density table */}
        <div className="bg-[#16161d] rounded-xl border border-[#22223a] overflow-hidden">
            {/* Table header */}
            <div className="grid text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-[#22223a] bg-[#1c1c26] px-3 py-2" style={{
                gridTemplateColumns: '2fr 1fr 1fr 90px 80px 80px 32px'
            }}>
                <div>Client</div>
                <div>Industry</div>
                <div>Revenue</div>
                <div className="text-center">Status</div>
                <div className="text-center">Health</div>
                <div className="text-center">Since</div>
                <div />
            </div>
            {/* Table rows */}
            <div>
                {filtered.map((client, i) => <div key={client.id} className={cn('grid items-center px-3 py-1.5 hover:bg-[#1c1c26] transition-colors border-b border-[#22223a]/50 last:border-0 group', i % 2 === 0 ? 'bg-[#16161d]' : 'bg-[#17171e]')} style={{
                    gridTemplateColumns: '2fr 1fr 1fr 90px 80px 80px 32px'
                }}>
                    {/* Name + avatar */}
                    <div className="flex items-center gap-2 min-w-0">
                        <img src={client.avatar} className="w-6 h-6 rounded-full bg-[#22223a] flex-shrink-0" alt={client.name} />
                        <div className="min-w-0">
                            <p className="font-semibold text-[12px] text-gray-200 truncate leading-tight">{client.name}</p>
                        </div>
                    </div>
                    {/* Industry */}
                    <div className="text-[11px] text-gray-500 truncate">{client.industry}</div>
                    {/* Revenue */}
                    <div className="text-[12px] font-semibold text-gray-300">{client.revenue}</div>
                    {/* Status */}
                    <div className="flex items-center justify-center gap-1.5">
                        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', client.status === 'Active' ? 'bg-emerald-400' : client.status === 'Onboarding' ? 'bg-indigo-400' : client.status === 'Lead' ? 'bg-purple-400' : 'bg-gray-500')} />
                        <span className={cn('text-[10px] font-medium', client.status === 'Active' ? 'text-emerald-400' : client.status === 'Onboarding' ? 'text-indigo-400' : client.status === 'Lead' ? 'text-purple-400' : 'text-gray-500')}>{client.status}</span>
                    </div>
                    {/* Health */}
                    <div className="flex items-center justify-center">
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', client.health === 'Good' ? 'bg-emerald-500/15 text-emerald-400' : client.health === 'Fair' ? 'bg-amber-500/15 text-amber-400' : 'bg-rose-500/15 text-rose-400')}>{client.health}</span>
                    </div>
                    {/* Since */}
                    <div className="text-[10px] text-gray-600 text-center">
                        {client.id === '1' ? 'Jan 24' : client.id === '2' ? 'Mar 24' : client.id === '3' ? 'Oct 24' : client.id === '4' ? 'Aug 23' : client.id === '5' ? 'May 24' : client.id === '6' ? 'Nov 24' : client.id === '7' ? 'Feb 24' : 'Jul 23'}
                    </div>
                    {/* Actions */}
                    <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 rounded hover:bg-[#22223a] text-gray-600 hover:text-gray-300 transition-colors"><MoreVertical size={12} /></button>
                    </div>
                </div>)}
            </div>
            {/* Footer summary */}
            <div className="px-3 py-2 border-t border-[#22223a] bg-[#1c1c26] flex items-center gap-6">
                <span className="text-[10px] text-gray-600">{filtered.length} records</span>
                <span className="text-[10px] text-gray-600">MRR: <span className="text-gray-400 font-semibold">{formatCurrency(totalMrr || metrics?.forecastQuarter || 0)}</span></span>
                <span className="text-[10px] text-gray-600">Avg: <span className="text-gray-400 font-semibold">{formatCurrency(avgMrr || metrics?.avgDealSize || 0)}/mo</span></span>
                <div className="flex items-center gap-2 ml-auto">
                    {['Active', 'Onboarding', 'Lead', 'Paused'].map(s => <div key={s} className="flex items-center gap-1">
                        <span className={cn('w-1.5 h-1.5 rounded-full', s === 'Active' ? 'bg-emerald-400' : s === 'Onboarding' ? 'bg-indigo-400' : s === 'Lead' ? 'bg-purple-400' : 'bg-gray-500')} />
                        <span className="text-[10px] text-gray-600">{sourceClients.filter(c => c.status === s).length} {s}</span>
                    </div>)}
                </div>
            </div>
        </div>
    </div>;
};

// ─────────────────────────────────────────────
// DASHBOARD VIEW — HIGH DENSITY (Dark)
// ─────────────────────────────────────────────

const DashboardView = ({
    searchQuery,
    clients,
    metrics,
    tasks,
    banner,
    userName
}: {
    searchQuery: string;
    clients: Client[];
    metrics?: MarketingMetrics;
    tasks?: MarketingTask[];
    banner?: MarketingBanner;
    userName?: string;
}) => {
    const sourceClients = clients.length ? clients : CLIENTS;
    const filteredClients = useMemo(() => sourceClients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.industry.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery, sourceClients]);
    const dashboardTasks = useMemo(() => {
        if (!tasks?.length) {
            return [{
                title: 'Social Media Strategy Review',
                client: 'Nebula Tech',
                deadline: 'Today, 2 PM',
                priority: 'High'
            }, {
                title: 'Q3 Report Finalization',
                client: 'EcoWare',
                deadline: 'Tomorrow, 10 AM',
                priority: 'Medium'
            }, {
                title: 'Onboarding Call',
                client: 'FreshRoots',
                deadline: 'Oct 24, 11 AM',
                priority: 'High'
            }, {
                title: 'Ad Creative Approval',
                client: 'SkyHigh',
                deadline: 'Oct 25, 4 PM',
                priority: 'Low'
            }, {
                title: 'Campaign Analytics Audit',
                client: 'PixelForge',
                deadline: 'Oct 26, 9 AM',
                priority: 'Medium'
            }];
        }

        return tasks.slice(0, 5).map((task) => ({
            title: task.title,
            client: task.relatedTo,
            deadline: task.dueDate,
            priority: task.priority === 'high' ? 'High' : task.priority === 'low' ? 'Low' : 'Medium',
        }));
    }, [tasks]);

    const monthlyRevenue = Math.round((metrics?.forecastQuarter || 0) / 3);
    const activeClients = metrics?.totalContacts || sourceClients.length;
    const projectsDone = metrics?.activeDeals || 0;
    const avgRetainer = metrics?.avgDealSize || 0;
    return <motion.div key="dashboard" initial={{
        opacity: 0,
        y: 10
    }} animate={{
        opacity: 1,
        y: 0
    }} exit={{
        opacity: 0,
        y: -10
    }} className="space-y-4">
        {banner && <div className={cn('rounded-xl border p-3 flex items-start gap-2', banner.status === 'critical' ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : banner.status === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300')}>
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
                <p className="text-xs font-semibold">{banner.constraint}</p>
                <p className="text-[11px] opacity-80">{banner.recommendation}</p>
            </div>
        </div>}

        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-xl font-bold text-gray-100">Good morning, {userName || 'Alex'}!</h1>
                <p className="text-gray-500 text-xs mt-0.5">Performance overview · Updated 2m ago</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Activity size={10} />Live
                </span>
                <select className="bg-[#16161d] border border-[#22223a] text-xs text-gray-400 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500">
                    <option>Last 6 Months</option><option>Last Year</option><option>YTD</option>
                </select>
            </div>
        </div>

        {/* Top KPI Row — 4 compact stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard title="Monthly Revenue" value={formatCurrency(monthlyRevenue)} change="+12.5%" icon={DollarSign} trend="up" />
            <StatCard title="Active Clients" value={activeClients.toString()} change={`+${Math.max(1, Math.round(activeClients * 0.07))}`} icon={Users} trend="up" />
            <StatCard title="Projects Done" value={projectsDone.toString()} change="+8" icon={CheckCircle2} trend="up" />
            <StatCard title="Avg. Retainer" value={formatCurrency(avgRetainer)} change="-2.1%" icon={TrendingUp} trend="down" />
        </div>

        {/* KPI Mini-Charts Row — 4 sparkline KPI tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard title="Revenue Trend" value={formatCompactCurrency(metrics?.totalPipeline || 0)} change="+16%" trend="up" icon={DollarSign} color="#6366f1" chartData={PERFORMANCE_DATA} chartKey="revenue" chartType="area" />
            <KpiCard title="Win Rate" value={`${metrics?.winRatePct || 0}%`} change="+0.7pp" trend="up" icon={Percent} color="#818cf8" chartData={PERFORMANCE_DATA} chartKey="ctr" chartType="line" />
            <KpiCard title="New Leads" value={`${metrics?.activeDeals || 0}`} change="+33%" trend="up" icon={TrendingUp} color="#a5b4fc" chartData={PERFORMANCE_DATA} chartKey="leads" chartType="bar" />
            <KpiCard title="Sales Cycle" value={`${metrics?.salesCycleDays || 0}d`} change="-12%" trend="up" icon={Target} color="#34d399" chartData={PERFORMANCE_DATA} chartKey="cac" chartType="line" />
        </div>

        {/* Middle row: Data Grid + Channel Pie + Conversions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

            {/* Revenue data grid */}
            <div className="bg-[#16161d] border border-[#22223a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Monthly Breakdown</h3>
                    <span className="text-[10px] text-gray-600">6-month view</span>
                </div>
                <div className="grid grid-cols-3 text-[10px] text-gray-600 uppercase tracking-wider font-bold border-b border-[#22223a] pb-1 mb-1">
                    <span>Month</span><span className="text-right">Revenue</span><span className="text-right">Clients</span>
                </div>
                {PERFORMANCE_DATA.map((row, i) => <div key={row.name} className={cn('grid grid-cols-3 py-1.5 text-[11px] border-b border-[#22223a]/50 last:border-0', i === PERFORMANCE_DATA.length - 1 ? 'text-indigo-300 font-semibold' : '')}>
                    <span className="text-gray-400">{row.name}</span>
                    <span className="text-right text-gray-300">${(row.revenue / 1000).toFixed(0)}K</span>
                    <span className={cn('text-right', i === PERFORMANCE_DATA.length - 1 ? 'text-indigo-300' : 'text-gray-400')}>{row.clients}</span>
                </div>)}
                <div className="mt-2 pt-2 border-t border-[#22223a] grid grid-cols-3 text-[11px] font-bold">
                    <span className="text-gray-500">Total</span>
                    <span className="text-right text-indigo-400">$337K</span>
                    <span className="text-right text-indigo-400">—</span>
                </div>
            </div>

            {/* Channel distribution pie */}
            <div className="bg-[#16161d] border border-[#22223a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Traffic Channels</h3>
                </div>
                <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={120}>
                        <PieChart>
                            <Pie data={CHANNEL_DATA} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value" stroke="none">
                                {CHANNEL_DATA.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{
                                backgroundColor: '#16161d',
                                border: '1px solid #22223a',
                                borderRadius: '8px',
                                fontSize: '11px',
                                color: '#e2e8f0'
                            }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 mt-1">
                    {CHANNEL_DATA.map(item => <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-sm" style={{
                                backgroundColor: item.color
                            }} />
                            <span className="text-[11px] text-gray-500">{item.name}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-300">{item.value}%</span>
                    </div>)}
                </div>
            </div>

            {/* Conversion data grid */}
            <div className="bg-[#16161d] border border-[#22223a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Conversions</h3>
                    <span className="text-[10px] text-indigo-400 font-semibold">+22% MoM</span>
                </div>
                <div className="space-y-0">
                    <DataGridRow label="Jan → Feb" value="+24%" trend="up" color="#6366f1" />
                    <DataGridRow label="Feb → Mar" value="-8%" trend="down" color="#6366f1" />
                    <DataGridRow label="Mar → Apr" value="+63%" trend="up" color="#6366f1" />
                    <DataGridRow label="Apr → May" value="-10%" trend="down" color="#6366f1" />
                    <DataGridRow label="May → Jun" value="+36%" trend="up" color="#6366f1" />
                </div>
                <div className="mt-3">
                    <ResponsiveContainer width="100%" height={48}>
                        <BarChart data={PERFORMANCE_DATA} barSize={8}>
                            <Bar dataKey="conv" fill="#6366f1" radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Bottom row: Client roster + Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

            {/* Compact client list */}
            <div className="bg-[#16161d] border border-[#22223a] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#22223a] flex justify-between items-center bg-[#1c1c26]">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Client Roster</h3>
                    <button className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300">View all</button>
                </div>
                <div>
                    {filteredClients.map((client, i) => <div key={client.id} className="flex items-center gap-3 px-4 py-2 hover:bg-[#1c1c26] transition-colors border-b border-[#22223a]/40 last:border-0">
                        <img src={client.avatar} className="w-7 h-7 rounded-full bg-[#22223a] flex-shrink-0" alt={client.name} />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[12px] text-gray-200 truncate leading-tight">{client.name}</p>
                            <p className="text-[10px] text-gray-600">{client.industry}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-[12px] font-bold text-gray-300">{client.revenue}</p>
                            <div className="flex items-center justify-end gap-1 mt-0.5">
                                <span className={cn('w-1.5 h-1.5 rounded-full', client.health === 'Good' ? 'bg-emerald-400' : client.health === 'Fair' ? 'bg-amber-400' : 'bg-rose-400')} />
                                <span className="text-[10px] text-gray-600">{client.health}</span>
                            </div>
                        </div>
                    </div>)}
                </div>
            </div>

            {/* Upcoming tasks — compact */}
            <div className="bg-[#16161d] border border-[#22223a] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#22223a] flex justify-between items-center bg-[#1c1c26]">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Upcoming Tasks</h3>
                    <button className="p-1 rounded hover:bg-[#22223a] transition-colors"><Filter size={12} className="text-gray-500" /></button>
                </div>
                <div>
                    {dashboardTasks.map((task, i) => <div key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-[#1c1c26] transition-colors border-b border-[#22223a]/40 last:border-0 group">
                        <div className="flex-shrink-0 w-4 h-4 border border-[#22223a] rounded group-hover:border-indigo-500/50 transition-colors cursor-pointer" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-gray-300 truncate leading-tight">{task.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-gray-600">{task.client}</span>
                                <span className="text-[10px] text-gray-700">·</span>
                                <span className="text-[10px] text-gray-600 flex items-center gap-0.5"><Clock size={9} />{task.deadline}</span>
                            </div>
                        </div>
                        <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0', task.priority === 'High' ? 'bg-rose-500/15 text-rose-400' : task.priority === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-500/15 text-slate-400')}>
                            {task.priority}
                        </span>
                    </div>)}
                </div>
            </div>
        </div>
    </motion.div>;
};

// ─────────────────────────────────────────────
// CALENDAR VIEW (Dark)
// ─────────────────────────────────────────────

type CalendarEvent = {
    id: string;
    title: string;
    client: string;
    time: string;
    duration: string;
    type: 'call' | 'deadline' | 'meeting' | 'review';
    color: string;
};
const CALENDAR_EVENTS: Record<number, CalendarEvent[]> = {
    3: [{
        id: 'e1',
        title: 'Strategy Kickoff',
        client: 'Nebula Tech',
        time: '10:00 AM',
        duration: '1h',
        type: 'meeting',
        color: '#6366f1'
    }],
    7: [{
        id: 'e2',
        title: 'Ad Creative Review',
        client: 'SkyHigh',
        time: '2:00 PM',
        duration: '30m',
        type: 'review',
        color: '#e2445c'
    }],
    10: [{
        id: 'e3',
        title: 'Q3 Report Deadline',
        client: 'EcoWare',
        time: 'All day',
        duration: '',
        type: 'deadline',
        color: '#818cf8'
    }],
    12: [{
        id: 'e4',
        title: 'Onboarding Call',
        client: 'FreshRoots',
        time: '11:00 AM',
        duration: '45m',
        type: 'call',
        color: '#00c875'
    }, {
        id: 'e5',
        title: 'Design Sync',
        client: 'Nebula Tech',
        time: '3:00 PM',
        duration: '1h',
        type: 'meeting',
        color: '#6366f1'
    }],
    15: [{
        id: 'e6',
        title: 'Monthly Retainer Call',
        client: 'SkyHigh',
        time: '9:00 AM',
        duration: '1h',
        type: 'call',
        color: '#e2445c'
    }],
    18: [{
        id: 'e7',
        title: 'Campaign Launch',
        client: 'EcoWare',
        time: '12:00 PM',
        duration: '',
        type: 'deadline',
        color: '#818cf8'
    }],
    20: [{
        id: 'e8',
        title: 'Brand Deck Review',
        client: 'FreshRoots',
        time: '4:00 PM',
        duration: '1h',
        type: 'review',
        color: '#00c875'
    }],
    22: [{
        id: 'e9',
        title: 'Content Planning',
        client: 'Nebula Tech',
        time: '10:00 AM',
        duration: '2h',
        type: 'meeting',
        color: '#6366f1'
    }, {
        id: 'e10',
        title: 'Invoice Deadline',
        client: 'All Clients',
        time: 'All day',
        duration: '',
        type: 'deadline',
        color: '#f0ad00'
    }],
    25: [{
        id: 'e11',
        title: 'Photoshoot Prep Call',
        client: 'FreshRoots',
        time: '1:00 PM',
        duration: '30m',
        type: 'call',
        color: '#00c875'
    }],
    28: [{
        id: 'e12',
        title: 'EOMonth Review',
        client: 'All Clients',
        time: '5:00 PM',
        duration: '1h',
        type: 'review',
        color: '#888'
    }]
};
const EVENT_TYPE_STYLES: Record<string, string> = {
    call: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    deadline: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    meeting: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    review: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
};
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CalendarView = () => {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear(y => y - 1);
        } else setMonth(m => m - 1);
        setSelectedDay(null);
    };
    const nextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(y => y + 1);
        } else setMonth(m => m + 1);
        setSelectedDay(null);
    };
    const selectedEvents = selectedDay ? CALENDAR_EVENTS[selectedDay] || [] : [];
    const upcomingEvents = Object.entries(CALENDAR_EVENTS).sort(([a], [b]) => Number(a) - Number(b)).slice(0, 5).flatMap(([day, evts]) => evts.map(e => ({
        ...e,
        day: Number(day)
    })));
    const cells: (number | null)[] = [...Array(firstDayOfMonth).fill(null), ...Array.from({
        length: daysInMonth
    }, (_, i) => i + 1)];
    const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    return <motion.div key="calendar" initial={{
        opacity: 0,
        y: 10
    }} animate={{
        opacity: 1,
        y: 0
    }} exit={{
        opacity: 0,
        y: -10
    }} className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-100">Calendar</h1>
                <p className="text-gray-500 mt-1 text-sm">Schedule and track client meetings & deadlines.</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-900/40 active:scale-95 text-sm">
                <Plus size={16} />New Event
            </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#16161d] rounded-xl border border-[#22223a] p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-100">{MONTH_NAMES[month]} {year}</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-[#22223a] transition-colors text-gray-500 hover:text-gray-300"><ChevronLeft size={18} /></button>
                        <button onClick={() => {
                            setMonth(today.getMonth());
                            setYear(today.getFullYear());
                            setSelectedDay(today.getDate());
                        }} className="text-xs font-semibold px-3 py-1.5 bg-[#22223a] rounded-lg hover:bg-[#2a2a40] transition-colors text-gray-300">Today</button>
                        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-[#22223a] transition-colors text-gray-500 hover:text-gray-300"><ChevronRight size={18} /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 mb-2">
                    {DAYS_OF_WEEK.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wide py-1">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {cells.map((day, i) => {
                        const hasEvents = day !== null && !!CALENDAR_EVENTS[day];
                        const isSelected = day === selectedDay;
                        const isTodayDay = day !== null && isToday(day);
                        return <button key={i} disabled={day === null} onClick={() => day && setSelectedDay(day === selectedDay ? null : day)} className={cn('relative flex flex-col items-center rounded-xl py-1.5 px-1 min-h-[52px] transition-all duration-150 group', day === null ? 'invisible' : 'cursor-pointer', isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : isTodayDay ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'hover:bg-[#22223a] text-gray-400')}>
                            {day !== null && <>
                                <span className={cn('text-sm font-semibold leading-none mb-1', isSelected ? 'text-white' : '')}>{day}</span>
                                {hasEvents && <div className="flex gap-0.5 flex-wrap justify-center">
                                    {(CALENDAR_EVENTS[day] || []).slice(0, 3).map((evt, ei) => <span key={ei} className={cn('w-1.5 h-1.5 rounded-full', isSelected ? 'bg-white/70' : '')} style={{
                                        backgroundColor: isSelected ? undefined : evt.color
                                    }} />)}
                                </div>}
                            </>}
                        </button>;
                    })}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="bg-[#16161d] rounded-xl border border-[#22223a] p-5 flex-1">
                    <h3 className="font-bold text-sm mb-4 text-gray-200">
                        {selectedDay ? `${MONTH_NAMES[month]} ${selectedDay}` : 'Upcoming Events'}
                    </h3>
                    <div className="space-y-3">
                        {(selectedDay ? selectedEvents : upcomingEvents).length === 0 ? <div className="text-center py-8">
                            <div className="w-12 h-12 bg-[#22223a] rounded-full flex items-center justify-center mx-auto mb-3"><Calendar size={22} className="text-gray-600" /></div>
                            <p className="text-sm text-gray-600">No events for this day</p>
                        </div> : (selectedDay ? selectedEvents : upcomingEvents).map((evt: any) => <div key={evt.id} className={cn('flex items-start gap-3 p-3 rounded-xl border transition-colors hover:shadow-sm cursor-pointer', EVENT_TYPE_STYLES[evt.type])}>
                            <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{
                                backgroundColor: evt.color
                            }} />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{evt.title}</p>
                                <p className="text-xs opacity-75 mt-0.5">{evt.client}</p>
                                <div className="flex items-center gap-2 mt-1.5 text-xs opacity-70">
                                    <Clock size={11} /><span>{evt.time}</span>
                                    {evt.duration && <><span>·</span><span>{evt.duration}</span></>}
                                    {!selectedDay && <><span>·</span><span>Day {(evt as any).day}</span></>}
                                </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase opacity-60 flex-shrink-0">{evt.type}</span>
                        </div>)}
                    </div>
                </div>
                <div className="bg-[#16161d] rounded-xl border border-[#22223a] p-5">
                    <h3 className="font-bold text-sm mb-3 text-gray-200">Event Types</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {[['call', 'Call'], ['meeting', 'Meeting'], ['deadline', 'Deadline'], ['review', 'Review']].map(([type, label]) => <div key={type} className={cn('flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium', EVENT_TYPE_STYLES[type])}>
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                                backgroundColor: {
                                    call: '#00c875',
                                    meeting: '#6366f1',
                                    deadline: '#e2445c',
                                    review: '#818cf8'
                                }[type as string]
                            }} />
                            {label}
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    </motion.div>;
};

// ─────────────────────────────────────────────
// MESSAGES VIEW (Dark)
// ─────────────────────────────────────────────

type Message = {
    id: string;
    from: 'me' | 'them';
    text: string;
    time: string;
    read: boolean;
};
type Conversation = {
    id: string;
    name: string;
    role: string;
    avatar: string;
    online: boolean;
    unread: number;
    lastMessage: string;
    lastTime: string;
    messages: Message[];
};
const CONVERSATIONS: Conversation[] = [{
    id: 'c1',
    name: 'Sarah Chen',
    role: 'Nebula Tech · Marketing Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    online: true,
    unread: 3,
    lastMessage: 'Can you share the updated deck?',
    lastTime: '2m ago',
    messages: [{
        id: 'm1',
        from: 'them',
        text: 'Hey Alex! The Q3 campaign results look great 🎉',
        time: '10:02 AM',
        read: true
    }, {
        id: 'm2',
        from: 'me',
        text: "Thanks Sarah! CTR is up 18% MoM.",
        time: '10:05 AM',
        read: true
    }, {
        id: 'm3',
        from: 'them',
        text: "Can we schedule a review call this week?",
        time: '10:06 AM',
        read: true
    }, {
        id: 'm4',
        from: 'me',
        text: 'How does Thursday at 2pm work?',
        time: '10:08 AM',
        read: true
    }, {
        id: 'm5',
        from: 'them',
        text: "Perfect! Can you share the updated brand deck?",
        time: '10:15 AM',
        read: false
    }, {
        id: 'm6',
        from: 'them',
        text: 'Can you share the updated deck?',
        time: '10:16 AM',
        read: false
    }]
}, {
    id: 'c2',
    name: 'Marcus Webb',
    role: 'EcoWare · CEO',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    online: false,
    unread: 1,
    lastMessage: 'Invoice approved ✅',
    lastTime: '1h ago',
    messages: [{
        id: 'm1',
        from: 'me',
        text: 'Hi Marcus, just sent over the October invoice.',
        time: 'Yesterday',
        read: true
    }, {
        id: 'm2',
        from: 'them',
        text: 'Got it, reviewing now.',
        time: 'Yesterday',
        read: true
    }, {
        id: 'm3',
        from: 'them',
        text: 'Invoice approved ✅',
        time: '1h ago',
        read: false
    }]
}, {
    id: 'c3',
    name: 'Priya Nair',
    role: 'FreshRoots · Founder',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    online: true,
    unread: 0,
    lastMessage: 'Sounds great, see you then!',
    lastTime: '3h ago',
    messages: [{
        id: 'm1',
        from: 'them',
        text: "We're really excited about the onboarding process.",
        time: '9:00 AM',
        read: true
    }, {
        id: 'm2',
        from: 'me',
        text: 'Welcome to the family, Priya!',
        time: '9:05 AM',
        read: true
    }, {
        id: 'm3',
        from: 'them',
        text: 'Sounds great, see you then!',
        time: '9:13 AM',
        read: true
    }]
}, {
    id: 'c4',
    name: 'David Kim',
    role: 'SkyHigh Real Estate · Director',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    online: false,
    unread: 1,
    lastMessage: 'We need to talk about the campaign...',
    lastTime: 'Yesterday',
    messages: [{
        id: 'm1',
        from: 'them',
        text: 'Alex, the ad spend is running higher than expected.',
        time: 'Yesterday',
        read: true
    }, {
        id: 'm2',
        from: 'me',
        text: "I'll pull the analytics and get back to you.",
        time: 'Yesterday',
        read: true
    }, {
        id: 'm3',
        from: 'them',
        text: 'We need to talk about the campaign performance...',
        time: 'Yesterday',
        read: false
    }]
}, {
    id: 'c5',
    name: 'Team Channel',
    role: 'Internal · 6 members',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Team',
    online: true,
    unread: 0,
    lastMessage: 'New project brief uploaded',
    lastTime: '2d ago',
    messages: [{
        id: 'm1',
        from: 'them',
        text: "The FreshRoots brief is live in the shared folder.",
        time: '2d ago',
        read: true
    }, {
        id: 'm2',
        from: 'me',
        text: "Thanks! I'll review before EOD.",
        time: '2d ago',
        read: true
    }, {
        id: 'm3',
        from: 'them',
        text: 'New project brief uploaded',
        time: '2d ago',
        read: true
    }]
}];

const buildConversationsFromActivities = (activities?: MarketingActivity[]): Conversation[] => {
    if (!activities?.length) return CONVERSATIONS;

    const grouped = new Map<string, MarketingActivity[]>();
    activities.forEach((activity) => {
        const key = activity.user || activity.target || 'Client';
        const list = grouped.get(key) || [];
        list.push(activity);
        grouped.set(key, list);
    });

    const rows = Array.from(grouped.entries()).map(([name, items], index) => {
        const latest = items[0];
        const messages = items.map((item, itemIndex) => ({
            id: `m-${index}-${itemIndex}`,
            from: itemIndex % 2 === 0 ? 'them' : 'me',
            text: `${item.action} ${item.target}. ${item.details}`,
            time: item.time,
            read: itemIndex > 0,
        } as Message));

        return {
            id: `c-${index + 1}`,
            name,
            role: `${latest.target} · CRM Activity`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
            online: index % 2 === 0,
            unread: Math.min(3, items.length),
            lastMessage: `${latest.action} ${latest.target}`,
            lastTime: latest.time,
            messages,
        } as Conversation;
    });

    return rows.length ? rows : CONVERSATIONS;
};

const MessagesView = ({
    activities
}: {
    activities?: MarketingActivity[];
}) => {
    const seedConversations = useMemo(() => buildConversationsFromActivities(activities), [activities]);
    const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
    const [activeConvId, setActiveConvId] = useState<string>(seedConversations[0]?.id || 'c1');
    const [inputText, setInputText] = useState('');
    const [searchText, setSearchText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const firstResponseTrackedRef = useRef(false);
    const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

    useEffect(() => {
        setConversations(seedConversations);
        setActiveConvId(seedConversations[0]?.id || 'c1');
    }, [seedConversations]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [activeConvId, activeConv?.messages.length]);

    if (!activeConv) {
        return <div className="h-full rounded-xl border border-[#22223a] bg-[#16161d] p-6 text-sm text-gray-500">No activity messages yet.</div>;
    }
    const handleSelect = (id: string) => {
        setActiveConvId(id);
        setConversations(prev => prev.map(c => c.id === id ? {
            ...c,
            unread: 0,
            messages: c.messages.map(m => ({
                ...m,
                read: true
            }))
        } : c));
    };
    const handleSend = () => {
        if (!inputText.trim()) return;

        if (!firstResponseTrackedRef.current && activeConv) {
            const responseTimeMinutes = parseRelativeTimeToMinutes(activeConv.lastTime) ?? 60;
            const slaTargetMinutes = 60;
            emitAgencyKpiEvent({
                event_name: 'first_response_sla_met',
                occurred_at: new Date().toISOString(),
                workspace: 'crm',
                source: 'user_action',
                thread_id: activeConv.id,
                response_time_minutes: responseTimeMinutes,
                sla_target_minutes: slaTargetMinutes,
                within_sla: responseTimeMinutes <= slaTargetMinutes,
                is_first_observed: true,
            });
            firstResponseTrackedRef.current = true;
        }

        const newMsg: Message = {
            id: `m${Date.now()}`,
            from: 'me',
            text: inputText.trim(),
            time: 'Just now',
            read: true
        };
        setConversations(prev => prev.map(c => c.id === activeConvId ? {
            ...c,
            lastMessage: inputText.trim(),
            lastTime: 'Just now',
            messages: [...c.messages, newMsg]
        } : c));
        setInputText('');
    };
    const filtered = conversations.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()) || c.role.toLowerCase().includes(searchText.toLowerCase()));
    const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);
    return <motion.div key="messages" initial={{
        opacity: 0,
        y: 10
    }} animate={{
        opacity: 1,
        y: 0
    }} exit={{
        opacity: 0,
        y: -10
    }} className="h-full flex flex-col" style={{
        minHeight: 0
    }}>
        <div className="flex items-center justify-between mb-6 flex-none">
            <div>
                <h1 className="text-2xl font-bold text-gray-100">Messages</h1>
                <p className="text-gray-500 mt-1 text-sm">{totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'All caught up!'}</p>
            </div>
        </div>
        <div className="flex-1 min-h-0 bg-[#16161d] rounded-xl border border-[#22223a] overflow-hidden flex shadow-sm">
            {/* Sidebar */}
            <div className="w-72 flex-shrink-0 border-r border-[#22223a] flex flex-col">
                <div className="p-4 border-b border-[#22223a]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                        <input type="text" placeholder="Search conversations…" value={searchText} onChange={e => setSearchText(e.target.value)} className="w-full bg-[#0f0f13] pl-9 pr-3 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-300 placeholder-gray-700" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filtered.map(conv => <button key={conv.id} onClick={() => handleSelect(conv.id)} className={cn('w-full flex items-start gap-3 p-4 border-b border-[#22223a]/50 transition-all text-left hover:bg-[#1c1c26]', activeConvId === conv.id ? 'bg-indigo-500/5 border-l-2 border-l-indigo-500' : '')}>
                        <div className="relative flex-shrink-0">
                            <img src={conv.avatar} alt={conv.name} className="w-9 h-9 rounded-full bg-[#22223a]" />
                            {conv.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#16161d]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <span className={cn('text-sm font-semibold truncate', conv.unread > 0 ? 'text-gray-100' : 'text-gray-300')}>{conv.name}</span>
                                <span className="text-[10px] text-gray-600 flex-shrink-0 ml-1">{conv.lastTime}</span>
                            </div>
                            <p className="text-[11px] text-gray-600 truncate mb-1">{conv.role}</p>
                            <div className="flex items-center justify-between">
                                <p className={cn('text-xs truncate flex-1', conv.unread > 0 ? 'font-semibold text-gray-300' : 'text-gray-600')}>{conv.lastMessage}</p>
                                {conv.unread > 0 && <span className="ml-2 flex-shrink-0 w-5 h-5 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{conv.unread}</span>}
                            </div>
                        </div>
                    </button>)}
                </div>
            </div>
            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#22223a] flex-none bg-[#1c1c26]">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img src={activeConv.avatar} alt={activeConv.name} className="w-9 h-9 rounded-full bg-[#22223a]" />
                            {activeConv.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1c1c26]" />}
                        </div>
                        <div>
                            <p className="font-bold text-sm text-gray-200">{activeConv.name}</p>
                            <p className="text-xs text-gray-600">{activeConv.online ? '🟢 Online' : '⚫ Offline'} · {activeConv.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-xl hover:bg-[#22223a] transition-colors text-gray-600 hover:text-gray-300"><Phone size={17} /></button>
                        <button className="p-2 rounded-xl hover:bg-[#22223a] transition-colors text-gray-600 hover:text-gray-300"><Video size={17} /></button>
                        <button className="p-2 rounded-xl hover:bg-[#22223a] transition-colors text-gray-600 hover:text-gray-300"><MoreHorizontal size={17} /></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 min-h-0">
                    {activeConv.messages.map((msg, i) => {
                        const isMe = msg.from === 'me';
                        return <motion.div key={msg.id} initial={{
                            opacity: 0,
                            y: 6
                        }} animate={{
                            opacity: 1,
                            y: 0
                        }} transition={{
                            delay: i * 0.03
                        }} className={cn('flex items-end gap-2', isMe ? 'flex-row-reverse' : 'flex-row')}>
                            {!isMe && <img src={activeConv.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0 mb-1" />}
                            <div className={cn('max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm', isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-[#22223a] text-gray-200 rounded-bl-sm')}>
                                <p>{msg.text}</p>
                                <p className={cn('text-[10px] mt-1 opacity-60', isMe ? 'text-right' : '')}>{msg.time}</p>
                            </div>
                        </motion.div>;
                    })}
                    <div ref={messagesEndRef} />
                </div>
                <div className="px-6 py-4 border-t border-[#22223a] flex-none">
                    <div className="flex items-center gap-3 bg-[#0f0f13] rounded-2xl px-4 py-2 border border-[#22223a] focus-within:border-indigo-500/30 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                        <button className="text-gray-600 hover:text-indigo-400 transition-colors flex-shrink-0"><Paperclip size={18} /></button>
                        <input type="text" placeholder={`Message ${activeConv.name}…`} value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }} className="flex-1 bg-transparent text-sm outline-none placeholder-gray-700 text-gray-200" />
                        <button className="text-gray-600 hover:text-indigo-400 transition-colors flex-shrink-0"><Smile size={18} /></button>
                        <button onClick={handleSend} disabled={!inputText.trim()} className={cn('flex-shrink-0 p-2 rounded-xl transition-all', inputText.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' : 'text-gray-700 opacity-40 cursor-not-allowed')}>
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>;
};

// ─────────────────────────────────────────────
// PLACEHOLDER VIEW (Dark)
// ─────────────────────────────────────────────

const PlaceholderView = ({
    tab,
    onBack
}: {
    tab: string;
    onBack: () => void;
}) => <motion.div key="placeholder" initial={{
    opacity: 0,
    x: 20
}} animate={{
    opacity: 1,
    x: 0
}} exit={{
    opacity: 0,
    x: -20
}} className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-2"><Target size={32} /></div>
        <h2 className="text-2xl font-bold capitalize text-gray-100">{tab} Section</h2>
        <p className="text-gray-500 max-w-sm text-sm">We're currently enhancing the {tab} experience. Check back soon for deeper insights and management tools.</p>
        <button onClick={onBack} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all">Back to Dashboard</button>
    </motion.div>;

// ─────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────

// @component: MarketingAgencyCRM
export const MarketingAgencyCRM = ({
    activeTab: activeTabProp,
    onTabChange,
    data,
    onBackToDashboard
}: MarketingAgencyCRMProps) => {
    const [internalActiveTab, setInternalActiveTab] = useState<NavTab>(activeTabProp || 'dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const kpiTelemetryRef = useRef({
        leadSourceConnected: false,
        firstLeadReceived: false,
        bookedConversion: false,
    });
    useEffect(() => {
        if (activeTabProp) {
            setInternalActiveTab(activeTabProp);
        }
    }, [activeTabProp]);

    const activeTab = activeTabProp || internalActiveTab;
    const resolvedClients = useMemo(() => buildClientsFromAdapter(data), [data]);
    const resolvedProjects = useMemo(() => buildProjectsFromAdapter(data), [data]);
    const resolvedBoardGroups = useMemo(() => buildBoardGroupsFromTasks(data?.tasks), [data?.tasks]);

    useEffect(() => {
        if (!data) return;

        if (!kpiTelemetryRef.current.leadSourceConnected && data.contacts.length > 0) {
            const leadSource = data.contacts.some((contact) => contact.type.toLowerCase().includes('lead'))
                ? 'crm_lead_capture'
                : 'crm_contact_sync';

            emitAgencyKpiEvent({
                event_name: 'lead_source_connected',
                occurred_at: new Date().toISOString(),
                workspace: 'crm',
                source: 'workflow_observed',
                lead_source: leadSource,
                integration_name: 'crm',
                is_first_observed: true,
            });
            kpiTelemetryRef.current.leadSourceConnected = true;
        }

        if (!kpiTelemetryRef.current.firstLeadReceived && data.contacts.length > 0) {
            const leadContact = data.contacts.find((contact) => contact.type.toLowerCase().includes('lead')) || data.contacts[0];
            emitAgencyKpiEvent({
                event_name: 'first_lead_received',
                occurred_at: new Date().toISOString(),
                workspace: 'crm',
                source: 'workflow_observed',
                lead_id: toTelemetryId(`${leadContact.company}-${leadContact.name}`, 'lead-1'),
                lead_source: leadContact.type || 'crm',
                is_first_observed: true,
            });
            kpiTelemetryRef.current.firstLeadReceived = true;
        }

        if (!kpiTelemetryRef.current.bookedConversion && data.deals.length > 0) {
            const bookedDeal = data.deals.find((deal) => deal.stage.toLowerCase().includes('closed'));
            if (!bookedDeal) return;

            emitAgencyKpiEvent({
                event_name: 'booked_conversion',
                occurred_at: new Date().toISOString(),
                workspace: 'crm',
                source: 'workflow_observed',
                deal_id: toTelemetryId(bookedDeal.company, 'deal-1'),
                deal_value: bookedDeal.value,
                stage: bookedDeal.stage,
                is_first_observed: true,
            });
            kpiTelemetryRef.current.bookedConversion = true;
        }
    }, [data]);

    const navItems = useMemo(() => NAV_ITEMS.map((item) => {
        if (item.id === 'projects') {
            return {
                ...item,
                badge: data?.metrics?.activeDeals ? Math.min(99, data.metrics.activeDeals) : item.badge
            };
        }
        if (item.id === 'messages') {
            return {
                ...item,
                badge: data?.metrics?.activitiesToday ? Math.min(99, data.metrics.activitiesToday) : item.badge
            };
        }
        return item;
    }), [data?.metrics?.activeDeals, data?.metrics?.activitiesToday]);
    const handleTabChange = (tab: NavTab) => {
        onTabChange?.(tab);
        if (!activeTabProp) {
            setInternalActiveTab(tab);
        }
    };
    const handleBackToDashboard = () => {
        if (onBackToDashboard) {
            onBackToDashboard();
            return;
        }
        handleTabChange('dashboard');
    };

    const isBoardTab = activeTab === 'board';
    const isMessagesTab = activeTab === 'messages';
    const isFullHeight = isBoardTab || isMessagesTab;

    // @return
    return <div className="flex h-screen bg-[#0f0f13] overflow-hidden text-gray-200">
        {/* ── Sidebar ── */}
        <aside className="w-60 bg-[#16161d] border-r border-[#22223a] p-5 flex flex-col gap-6 flex-shrink-0">
            <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-900/50">
                    <Rocket className="text-white" size={18} />
                </div>
                <span className="text-base font-bold tracking-tight text-gray-100">Rambo CRM</span>
            </div>

            <nav className="flex-1 flex flex-col gap-0.5">
                {navItems.map(item => <SidebarItem key={item.id} icon={item.icon} label={item.label} isActive={activeTab === item.id} onClick={() => handleTabChange(item.id)} badge={item.badge} />)}
            </nav>

            <div className="pt-4 border-t border-[#22223a] flex flex-col gap-0.5">
                <SidebarItem icon={Settings} label="Settings" isActive={activeTab === 'settings'} onClick={() => handleTabChange('settings')} />
                <div className="flex items-center gap-2.5 px-4 py-2.5 mt-1">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data?.userName || 'Admin')}`} className="w-8 h-8 rounded-full border border-indigo-500/30" alt="Admin" />
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold truncate text-gray-200">{data?.userName || 'Alex Rivera'}</p>
                        <p className="text-[10px] text-gray-600 truncate">Rambo CRM</p>
                    </div>
                </div>
            </div>
        </aside>

        {/* ── Main Area ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* ── Header ── */}
            <header className="h-14 bg-[#16161d] border-b border-[#22223a] px-6 flex items-center justify-between flex-none">
                <div className="flex items-center gap-2">
                    <button onClick={handleBackToDashboard} className="inline-flex items-center gap-1 rounded-lg border border-[#22223a] bg-[#0f0f13] px-2 py-1 text-[11px] text-gray-400 hover:text-gray-200 hover:border-indigo-500/40 transition-colors">
                        <ChevronLeft size={12} />
                        Dashboard
                    </button>
                    <span className="text-gray-700">|</span>
                    <span className="text-gray-600 text-xs">Rambo CRM</span>
                    <ChevronRight size={12} className="text-gray-700" />
                    <span className="text-xs font-semibold capitalize text-gray-400">{activeTab}</span>
                </div>
                <div className="flex items-center gap-3">
                    {!isBoardTab && !isMessagesTab && <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                        <input type="text" placeholder="Search clients, projects, or tasks…" className="w-full bg-[#0f0f13] border border-[#22223a] rounded-xl py-1.5 pl-9 pr-4 focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all text-xs outline-none text-gray-300 placeholder-gray-700" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>}
                    <button className="p-2 rounded-xl hover:bg-[#22223a] text-gray-600 transition-colors relative">
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-[#16161d]" />
                        <Bell size={16} />
                    </button>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-900/50 active:scale-95 text-xs">
                        <Plus size={14} /><span>New Project</span>
                    </button>
                </div>
            </header>

            {/* ── Content ── */}
            <main className={cn('flex-1 min-h-0', isFullHeight ? 'overflow-hidden p-6 flex flex-col' : isBoardTab ? 'overflow-hidden p-0 flex flex-col' : 'overflow-y-auto p-6')}>
                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && <DashboardView key="dashboard" searchQuery={searchQuery} clients={resolvedClients} metrics={data?.metrics} tasks={data?.tasks} banner={data?.banner} userName={data?.userName} />}
                    {activeTab === 'clients' && <ClientsView key="clients" searchQuery={searchQuery} clients={resolvedClients} metrics={data?.metrics} />}
                    {activeTab === 'projects' && <motion.div key="projects" initial={{
                        opacity: 0,
                        y: 10
                    }} animate={{
                        opacity: 1,
                        y: 0
                    }} exit={{
                        opacity: 0,
                        y: -10
                    }} className="h-full">
                        <ProjectsView projects={resolvedProjects} />
                    </motion.div>}
                    {activeTab === 'board' && <motion.div key="board" initial={{
                        opacity: 0,
                        y: 10
                    }} animate={{
                        opacity: 1,
                        y: 0
                    }} exit={{
                        opacity: 0,
                        y: -10
                    }} className="h-full flex flex-col">
                        <BoardView seedGroups={resolvedBoardGroups} />
                    </motion.div>}
                    {activeTab === 'calendar' && <CalendarView key="calendar" />}
                    {activeTab === 'messages' && <MessagesView key="messages" activities={data?.activities} />}
                    {activeTab === 'settings' && <PlaceholderView key="settings" tab="settings" onBack={() => handleTabChange('dashboard')} />}
                </AnimatePresence>
            </main>
        </div>
    </div>;
};

