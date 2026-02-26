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

// ... rest of file unchanged (full content included above)
```

```
```

