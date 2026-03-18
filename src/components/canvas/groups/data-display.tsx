'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
} from 'lucide-react'

import { COMPONENT_GROUPS } from '@/lib/constants'
import { Specimen } from '@/components/canvas/specimen'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const group = COMPONENT_GROUPS.find((g) => g.id === 'data-display')!

// ─── Chart (lazy-loaded) ─────────────────────────────────────────────────────

const LazyChart = dynamic(() => import('./chart-specimen'), {
  loading: () => <Skeleton className="h-[200px] w-full" />,
  ssr: false,
})

function ChartSpecimen() {
  return <LazyChart />
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function AvatarSpecimen() {
  return (
    <div className="flex items-center gap-8">
      <AvatarGroup>
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function BadgeSpecimen() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function CardSpecimen() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages in your inbox.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-pretty">
          Stay on top of your projects by reviewing notifications daily.
          Unread items are highlighted and grouped by priority.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {[
            { label: 'New comments', count: 12, variant: 'secondary' as const },
            { label: 'Mentions', count: 3, variant: 'default' as const },
            { label: 'Reviews pending', count: 7, variant: 'outline' as const },
          ].map(({ label, count, variant }) => (
            <li key={label} className="flex items-center justify-between">
              <span className="text-muted-foreground">{label}</span>
              <Badge variant={variant}>{count}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="gap-2 justify-end">
        <Button variant="ghost" size="sm">Dismiss all</Button>
        <Button size="sm">View inbox</Button>
      </CardFooter>
    </Card>
  )
}

// ─── Data Table ───────────────────────────────────────────────────────────────

type Row = {
  id: string
  name: string
  email: string
  status: 'Active' | 'Pending' | 'Inactive' | 'Processing'
  amount: number
}

const TABLE_DATA: Row[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', amount: 1250.00 },
  { id: '2', name: 'Bob Martinez', email: 'bob@example.com', status: 'Pending', amount: 890.50 },
  { id: '3', name: 'Carol Williams', email: 'carol@example.com', status: 'Active', amount: 3200.00 },
  { id: '4', name: 'David Kim', email: 'david@example.com', status: 'Inactive', amount: 150.00 },
  { id: '5', name: 'Eva Chen', email: 'eva@example.com', status: 'Processing', amount: 720.00 },
  { id: '6', name: 'Frank Okafor', email: 'frank@example.com', status: 'Active', amount: 4100.00 },
  { id: '7', name: 'Grace Liu', email: 'grace@example.com', status: 'Pending', amount: 560.00 },
  { id: '8', name: 'Henry Brown', email: 'henry@example.com', status: 'Active', amount: 980.00 },
  { id: '9', name: 'Isabella Santos', email: 'isabella@example.com', status: 'Inactive', amount: 230.00 },
  { id: '10', name: 'James Taylor', email: 'james@example.com', status: 'Processing', amount: 1780.00 },
  { id: '11', name: 'Keiko Tanaka', email: 'keiko@example.com', status: 'Active', amount: 2100.00 },
  { id: '12', name: "Liam O'Brien", email: 'liam@example.com', status: 'Pending', amount: 440.00 },
  { id: '13', name: 'Maya Patel', email: 'maya@example.com', status: 'Active', amount: 3650.00 },
  { id: '14', name: 'Noah Garcia', email: 'noah@example.com', status: 'Inactive', amount: 70.00 },
  { id: '15', name: 'Olivia Wright', email: 'olivia@example.com', status: 'Processing', amount: 1320.00 },
]

const STATUS_VARIANTS: Record<Row['status'], 'default' | 'secondary' | 'outline' | 'ghost'> = {
  Active: 'default',
  Pending: 'outline',
  Inactive: 'secondary',
  Processing: 'ghost',
}

type SortKey = 'name' | 'amount'
const PAGE_SIZE = 5

function DataTableSpecimen() {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const sorted = [...TABLE_DATA].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    if (sortKey === 'name') return dir * a.name.localeCompare(b.name)
    return dir * (a.amount - b.amount)
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const allChecked = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id))

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allChecked) {
        pageRows.forEach((r) => next.delete(r.id))
      } else {
        pageRows.forEach((r) => next.add(r.id))
      }
      return next
    })
  }

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDownIcon className="size-3 opacity-40" />
    return sortDir === 'asc'
      ? <ArrowUpIcon className="size-3" />
      : <ArrowDownIcon className="size-3" />
  }

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox checked={allChecked} onCheckedChange={() => toggleAll()} />
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-1">
                Name <SortIcon col="name" />
              </div>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead
              className="text-right cursor-pointer select-none"
              onClick={() => handleSort('amount')}
            >
              <div className="flex items-center justify-end gap-1">
                Amount <SortIcon col="amount" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.map((row) => (
            <TableRow
              key={row.id}
              data-state={selected.has(row.id) ? 'selected' : undefined}
            >
              <TableCell>
                <Checkbox
                  checked={selected.has(row.id)}
                  onCheckedChange={() => toggleRow(row.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell className="text-muted-foreground">{row.email}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANTS[row.status]}>{row.status}</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                ${row.amount.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>{selected.size} of {TABLE_DATA.length} row(s) selected</span>
        <div className="flex items-center gap-2">
          <span>Page {page} of {totalPages}</span>
          <Button
            size="sm"
            variant="outline"
            className="size-7 p-0"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeftIcon className="size-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="size-7 p-0"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRightIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Item ─────────────────────────────────────────────────────────────────────

function ItemSpecimen() {
  return (
    <ItemGroup className="max-w-xs">
      {[
        { name: 'Alice Johnson', role: 'Product Designer', badge: 'Admin' as const },
        { name: 'Bob Martinez', role: 'Frontend Engineer', badge: 'Member' as const },
        { name: 'Carol Williams', role: 'Data Scientist', badge: 'Member' as const },
      ].map(({ name, role, badge }) => (
        <Item key={name} variant="outline">
          <ItemMedia variant="icon">
            <UserIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{name}</ItemTitle>
            <ItemDescription>{role}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant={badge === 'Admin' ? 'default' : 'secondary'}>
              {badge}
            </Badge>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}

// ─── Kbd ─────────────────────────────────────────────────────────────────────

function KbdSpecimen() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="flex items-center gap-2">
        <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
        <span className="text-xs text-muted-foreground">Command palette</span>
      </div>
      <div className="flex items-center gap-2">
        <KbdGroup><Kbd>Ctrl</Kbd><Kbd>C</Kbd></KbdGroup>
        <span className="text-xs text-muted-foreground">Copy</span>
      </div>
      <div className="flex items-center gap-2">
        <KbdGroup><Kbd>⇧</Kbd><Kbd>⌘</Kbd><Kbd>P</Kbd></KbdGroup>
        <span className="text-xs text-muted-foreground">Command prompt</span>
      </div>
      <div className="flex items-center gap-2">
        <Kbd>Enter</Kbd>
        <span className="text-xs text-muted-foreground">Confirm</span>
      </div>
    </div>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonSpecimen() {
  return (
    <div className="flex items-start gap-4 w-72">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-4 h-24 w-full rounded-lg" />
      </div>
    </div>
  )
}

// ─── Spinner ─────────────────────────────────────────────────────────────────

function SpinnerSpecimen() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner />
        <span className="text-xs text-muted-foreground">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6" />
        <span className="text-xs text-muted-foreground">Large</span>
      </div>
    </div>
  )
}

// ─── Table ───────────────────────────────────────────────────────────────────

const INVOICE_DATA = [
  { id: 'INV-001', status: 'Paid', method: 'Credit card', amount: 250.00 },
  { id: 'INV-002', status: 'Pending', method: 'Bank transfer', amount: 1500.00 },
  { id: 'INV-003', status: 'Unpaid', method: 'PayPal', amount: 350.00 },
  { id: 'INV-004', status: 'Paid', method: 'Credit card', amount: 825.00 },
  { id: 'INV-005', status: 'Pending', method: 'Stripe', amount: 90.00 },
]

function TableSpecimen() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICE_DATA.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.id}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell className="text-right tabular-nums">
              ${row.amount.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right tabular-nums">
            ${INVOICE_DATA.reduce((s, r) => s + r.amount, 0).toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

// ─── Typography ──────────────────────────────────────────────────────────────

function TypographySpecimen() {
  return (
    <div className="max-w-lg space-y-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
        Heading One
      </h1>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Heading Two
      </h2>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Heading Three
      </h3>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Heading Four
      </h4>
      <p className="text-xl text-muted-foreground leading-7 text-pretty">
        A lead paragraph draws the reader in and provides essential context for the content
        that follows.
      </p>
      <p className="leading-7 text-pretty">
        Body text sits at the core of readable interfaces. Well-chosen line height, measure,
        and font size make extended reading comfortable — each sentence flows naturally into
        the next.
      </p>
      <blockquote className="border-l-2 border-border pl-6 italic text-muted-foreground">
        &ldquo;Good design is as little design as possible.&rdquo; — Dieter Rams
      </blockquote>
      <ul className="ml-6 list-disc space-y-1">
        <li className="text-sm">Consistent spacing creates visual rhythm</li>
        <li className="text-sm">Contrast ratios ensure accessibility</li>
        <li className="text-sm">Semantic HTML improves screen reader support</li>
      </ul>
      <p className="text-sm leading-7">
        Use{' '}
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
          tabular-nums
        </code>{' '}
        for numbers in tables, and{' '}
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
          text-balance
        </code>{' '}
        for headings.
      </p>
    </div>
  )
}

// ─── Group ───────────────────────────────────────────────────────────────────

interface Props {
  showHeader?: boolean
}

export function DataDisplayGroup({ showHeader = true }: Props) {
  return (
    <section id="section-data-display" className="space-y-6">
      {showHeader && (
        <div className="pb-2 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{group.label}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {group.components.length} components
          </p>
        </div>
      )}

      <Specimen name="Avatar"><AvatarSpecimen /></Specimen>
      <Specimen name="Badge"><BadgeSpecimen /></Specimen>
      <Specimen name="Card"><CardSpecimen /></Specimen>
      <Specimen name="Chart"><ChartSpecimen /></Specimen>
      <Specimen name="Data Table"><DataTableSpecimen /></Specimen>
      <Specimen name="Item"><ItemSpecimen /></Specimen>
      <Specimen name="Kbd"><KbdSpecimen /></Specimen>
      <Specimen name="Skeleton"><SkeletonSpecimen /></Specimen>
      <Specimen name="Spinner"><SpinnerSpecimen /></Specimen>
      <Specimen name="Table"><TableSpecimen /></Specimen>
      <Specimen name="Typography"><TypographySpecimen /></Specimen>
    </section>
  )
}
