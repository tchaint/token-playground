'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertCircleIcon,
  TerminalIcon,
  InboxIcon,
  MinusIcon,
  PlusIcon,
  SettingsIcon,
} from 'lucide-react'
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'

import { Specimen } from '@/components/canvas/specimen'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { COMPONENT_GROUPS } from '@/lib/constants'

const group = COMPONENT_GROUPS.find((g) => g.id === 'feedback')!

interface Props {
  showHeader?: boolean
}

// ─── Alert ───────────────────────────────────────────────────────────────────

function AlertSpecimen() {
  return (
    <Specimen name="Alert">
      <div className="flex flex-col gap-3">
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the CLI.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <TerminalIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
      </div>
    </Specimen>
  )
}

// ─── Alert Dialog ────────────────────────────────────────────────────────────

function AlertDialogSpecimen() {
  return (
    <Specimen name="Alert Dialog">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive">Delete Account</Button>} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogPrimitive.Close
              render={<Button variant="destructive">Yes, delete</Button>}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Specimen>
  )
}

// ─── Dialog ──────────────────────────────────────────────────────────────────

function DialogSpecimen() {
  return (
    <Specimen name="Dialog">
      <Dialog>
        <DialogTrigger render={<Button variant="outline">Edit Profile</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dialog-name">Name</Label>
              <Input id="dialog-name" defaultValue="Pedro Duarte" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dialog-email">Email</Label>
              <Input
                id="dialog-email"
                type="email"
                defaultValue="pedro@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Specimen>
  )
}

// ─── Drawer ──────────────────────────────────────────────────────────────────

function DrawerSpecimen() {
  const [goal, setGoal] = useState(350)

  return (
    <Specimen name="Drawer">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily move goal.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setGoal((g) => Math.max(200, g - 10))}
              >
                <MinusIcon className="size-4" />
              </Button>
              <div className="text-center">
                <span className="text-5xl font-bold tabular-nums">{goal}</span>
                <p className="text-sm text-muted-foreground mt-1">calories/day</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setGoal((g) => Math.min(600, g + 10))}
              >
                <PlusIcon className="size-4" />
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button>Submit</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Specimen>
  )
}

// ─── Empty ───────────────────────────────────────────────────────────────────

function EmptySpecimen() {
  return (
    <Specimen name="Empty">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <InboxIcon className="size-8 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>No results</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search to find what you&apos;re looking for.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            Clear filters
          </Button>
        </EmptyContent>
      </Empty>
    </Specimen>
  )
}

// ─── Progress ────────────────────────────────────────────────────────────────

function ProgressSpecimen() {
  return (
    <Specimen name="Progress">
      <div className="flex flex-col gap-4">
        {([33, 66, 100] as const).map((value) => (
          <Progress key={value} value={value}>
            <ProgressLabel>{value}%</ProgressLabel>
            <ProgressValue>{() => `${value}%`}</ProgressValue>
          </Progress>
        ))}
      </div>
    </Specimen>
  )
}

// ─── Sheet ───────────────────────────────────────────────────────────────────

function SheetSpecimen() {
  return (
    <Specimen name="Sheet">
      <Sheet>
        <SheetTrigger render={<Button variant="outline">Open Sheet</Button>} />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when done.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sheet-name">Name</Label>
              <Input id="sheet-name" defaultValue="Pedro Duarte" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sheet-username">Username</Label>
              <Input id="sheet-username" defaultValue="@peduarte" />
            </div>
          </div>
          <SheetFooter>
            <Button>Save changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Specimen>
  )
}

// ─── Sonner ──────────────────────────────────────────────────────────────────

function SonnerSpecimen() {
  return (
    <Specimen name="Sonner">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast('Default toast message')}
        >
          Default Toast
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success('Operation successful!')}
        >
          Success
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.error('Something went wrong.')}
        >
          Error
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast('Event created', {
              action: {
                label: 'Undo',
                onClick: () => toast('Undone!'),
              },
            })
          }
        >
          With Action
        </Button>
      </div>
    </Specimen>
  )
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function TooltipSpecimen() {
  return (
    <Specimen name="Tooltip">
      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-4">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="sm" />}>
              Add to library
            </TooltipTrigger>
            <TooltipContent>Add to library</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <SettingsIcon className="size-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger className="text-sm underline underline-offset-4 text-primary">
              View documentation
            </TooltipTrigger>
            <TooltipContent>View documentation</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </Specimen>
  )
}

// ─── Group ───────────────────────────────────────────────────────────────────

export function FeedbackGroup({ showHeader = true }: Props) {
  return (
    <section id="section-feedback" className="space-y-6">
      {showHeader && (
        <div className="pb-2 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{group.label}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {group.components.length} components
          </p>
        </div>
      )}
      <AlertSpecimen />
      <AlertDialogSpecimen />
      <DialogSpecimen />
      <DrawerSpecimen />
      <EmptySpecimen />
      <ProgressSpecimen />
      <SheetSpecimen />
      <SonnerSpecimen />
      <TooltipSpecimen />
    </section>
  )
}
