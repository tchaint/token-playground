'use client'

import { useState } from 'react'
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  CalendarIcon,
  FileTextIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react'

import { COMPONENT_GROUPS } from '@/lib/constants'
import { Specimen } from '@/components/canvas/specimen'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const group = COMPONENT_GROUPS.find((g) => g.id === 'inputs-forms')!

interface Props {
  showHeader?: boolean
}

// ─── Button ───────────────────────────────────────────────────────────────────

const VARIANTS = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const

function ButtonSpecimen() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <Button key={v} variant={v}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
      </div>
      <Button disabled>Disabled</Button>
    </div>
  )
}

// ─── Button Group ─────────────────────────────────────────────────────────────

function ButtonGroupSpecimen() {
  return (
    <ButtonGroup>
      <Button variant="outline">← Previous</Button>
      <Button variant="outline">Page 4</Button>
      <Button variant="outline">Next →</Button>
    </ButtonGroup>
  )
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function CalendarSpecimen() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 2, 8))
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(2026, 2, 1)}
      disabled={[new Date(2026, 2, 10), new Date(2026, 2, 14), new Date(2026, 2, 22)]}
    />
  )
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

function CheckboxSpecimen() {
  const [checked, setChecked] = useState(true)
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-unchecked" />
        <Label htmlFor="cb-unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="cb-checked"
          checked={checked}
          onCheckedChange={(v) => setChecked(v === true)}
        />
        <Label htmlFor="cb-checked">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-disabled" disabled />
        <Label htmlFor="cb-disabled">Disabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-disabled-checked" disabled defaultChecked />
        <Label htmlFor="cb-disabled-checked">Disabled checked</Label>
      </div>
    </div>
  )
}

// ─── Combobox ────────────────────────────────────────────────────────────────

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'remix', label: 'Remix' },
]

function ComboboxSpecimen() {
  return (
    <Combobox>
      <ComboboxInput placeholder="Search framework…" className="w-56" />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          {FRAMEWORKS.map((f) => (
            <ComboboxItem key={f.value} value={f.value}>
              {f.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

// ─── Command ─────────────────────────────────────────────────────────────────

function CommandSpecimen() {
  return (
    <div className="w-72 overflow-hidden rounded-lg border border-border">
      <Command>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <FileTextIcon />
              New Document
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <SearchIcon />
              Quick Search
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <UserIcon />
              View Profile
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Settings">
            <CommandItem>
              <SettingsIcon />
              Preferences
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

// ─── Date Picker ─────────────────────────────────────────────────────────────

function DatePickerSpecimen() {
  const [date, setDate] = useState<Date | undefined>()
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" className="w-52 justify-start font-normal">
            <CalendarIcon className="mr-1 size-4 opacity-60" />
            {date
              ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : <span className="text-muted-foreground">Pick a date</span>}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────

function FieldSpecimen() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-lg">
      <Field>
        <FieldLabel htmlFor="field-name">Full name</FieldLabel>
        <Input id="field-name" placeholder="Jane Smith" />
        <FieldDescription>As it appears on your government-issued ID.</FieldDescription>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="field-email">Email address</FieldLabel>
        <Input id="field-email" aria-invalid="true" defaultValue="jane@" />
        <FieldError>Please enter a valid email address.</FieldError>
      </Field>
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────

function InputSpecimen() {
  return (
    <div className="flex flex-col gap-2 w-72">
      <Input placeholder="Search projects…" />
      <Input defaultValue="jane.smith@example.com" />
      <Input disabled placeholder="Not editable" defaultValue="readonly@example.com" />
      <Input aria-invalid="true" defaultValue="invalid-email" />
    </div>
  )
}

// ─── Input Group ─────────────────────────────────────────────────────────────

function InputGroupSpecimen() {
  return (
    <InputGroup className="w-44">
      <InputGroupAddon>
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="0.00" type="number" min="0" step="0.01" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>USD</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  )
}

// ─── Input OTP ───────────────────────────────────────────────────────────────

function InputOTPSpecimen() {
  const [otp, setOtp] = useState('123')
  return (
    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}

// ─── Label ───────────────────────────────────────────────────────────────────

function LabelSpecimen() {
  return (
    <div className="flex flex-col gap-1.5 w-64">
      <Label htmlFor="label-input">Project name</Label>
      <Input id="label-input" placeholder="My awesome project" />
    </div>
  )
}

// ─── Native Select ───────────────────────────────────────────────────────────

function NativeSelectSpecimen() {
  return (
    <div className="flex items-center gap-3">
      <NativeSelect defaultValue="medium">
        <NativeSelectOption value="" disabled>
          Select priority…
        </NativeSelectOption>
        <NativeSelectOption value="low">Low</NativeSelectOption>
        <NativeSelectOption value="medium">Medium</NativeSelectOption>
        <NativeSelectOption value="high">High</NativeSelectOption>
        <NativeSelectOption value="urgent">Urgent</NativeSelectOption>
      </NativeSelect>
      <NativeSelect disabled defaultValue="draft">
        <NativeSelectOption value="draft">Draft</NativeSelectOption>
        <NativeSelectOption value="published">Published</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}

// ─── Radio Group ─────────────────────────────────────────────────────────────

function RadioGroupSpecimen() {
  const [density, setDensity] = useState('comfortable')
  return (
    <RadioGroup value={density} onValueChange={setDensity} className="w-fit gap-3">
      {[
        { value: 'default', label: 'Default', hint: '16px gap' },
        { value: 'comfortable', label: 'Comfortable', hint: '20px gap' },
        { value: 'compact', label: 'Compact', hint: '12px gap' },
      ].map(({ value, label, hint }) => (
        <div key={value} className="flex items-center gap-2.5">
          <RadioGroupItem id={`density-${value}`} value={value} />
          <div>
            <Label htmlFor={`density-${value}`}>{label}</Label>
            <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  )
}

// ─── Select ──────────────────────────────────────────────────────────────────

const FRUIT_GROUPS = [
  {
    group: 'Citrus',
    items: [
      { value: 'orange', label: 'Orange' },
      { value: 'lemon', label: 'Lemon' },
      { value: 'grapefruit', label: 'Grapefruit' },
    ],
  },
  {
    group: 'Tropical',
    items: [
      { value: 'mango', label: 'Mango' },
      { value: 'papaya', label: 'Papaya' },
      { value: 'guava', label: 'Guava' },
    ],
  },
]

function SelectSpecimen() {
  const [value, setValue] = useState('')
  return (
    <Select value={value} onValueChange={(val) => val && setValue(val)}>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        {FRUIT_GROUPS.map(({ group, items }) => (
          <SelectGroup key={group}>
            <SelectLabel>{group}</SelectLabel>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}

// ─── Slider ──────────────────────────────────────────────────────────────────

function SliderSpecimen() {
  const [volume, setVolume] = useState([60])
  const [price, setPrice] = useState([20, 75])
  const [rating, setRating] = useState([40])
  return (
    <div className="space-y-5 w-64">
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Volume</span>
          <span>{volume[0]}%</span>
        </div>
        <Slider value={volume} onValueChange={(v) => setVolume(Array.isArray(v) ? [...v] : [v])} min={0} max={100} />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Price range</span>
          <span>${price[0]} – ${price[1]}</span>
        </div>
        <Slider value={price} onValueChange={(v) => setPrice(Array.isArray(v) ? [...v] : [v])} min={0} max={100} />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Rating (steps of 10)</span>
          <span>{rating[0]}</span>
        </div>
        <Slider value={rating} onValueChange={(v) => setRating(Array.isArray(v) ? [...v] : [v])} min={0} max={100} step={10} />
      </div>
    </div>
  )
}

// ─── Switch ──────────────────────────────────────────────────────────────────

function SwitchSpecimen() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Switch id="sw-notifications" />
        <Label htmlFor="sw-notifications">Notifications</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw-darkmode" defaultChecked />
        <Label htmlFor="sw-darkmode">Dark mode</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw-analytics" disabled />
        <Label htmlFor="sw-analytics">Analytics</Label>
      </div>
    </div>
  )
}

// ─── Textarea ────────────────────────────────────────────────────────────────

function TextareaSpecimen() {
  return (
    <div className="flex flex-col gap-2 w-80">
      <Textarea placeholder="Write your feedback here…" />
      <Textarea
        defaultValue="Looking great so far! The color palette feels balanced and the contrast ratios are solid on all surfaces."
      />
      <Textarea disabled defaultValue="This field cannot be edited at this time." />
    </div>
  )
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

function ToggleSpecimen() {
  return (
    <div className="flex items-center gap-2">
      <Toggle variant="outline" aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle variant="outline" defaultPressed aria-label="Bold">
        <BoldIcon />
      </Toggle>
      <Toggle variant="outline" disabled aria-label="Underline">
        <UnderlineIcon />
      </Toggle>
    </div>
  )
}

// ─── Toggle Group ────────────────────────────────────────────────────────────

function ToggleGroupSpecimen() {
  const [align, setAlign] = useState('left')
  const [formats, setFormats] = useState(new Set(['bold']))

  const toggleFormat = (key: string, pressed: boolean) => {
    setFormats((prev) => {
      const next = new Set(prev)
      pressed ? next.add(key) : next.delete(key)
      return next
    })
  }

  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Single select</p>
        <ToggleGroup variant="outline">
          <ToggleGroupItem
            pressed={align === 'left'}
            onPressedChange={(p) => p && setAlign('left')}
            aria-label="Align left"
          >
            <AlignLeftIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            pressed={align === 'center'}
            onPressedChange={(p) => p && setAlign('center')}
            aria-label="Align center"
          >
            <AlignCenterIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            pressed={align === 'right'}
            onPressedChange={(p) => p && setAlign('right')}
            aria-label="Align right"
          >
            <AlignRightIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Multiple select</p>
        <ToggleGroup variant="outline">
          <ToggleGroupItem
            pressed={formats.has('bold')}
            onPressedChange={(p) => toggleFormat('bold', p)}
            aria-label="Bold"
          >
            <BoldIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            pressed={formats.has('italic')}
            onPressedChange={(p) => toggleFormat('italic', p)}
            aria-label="Italic"
          >
            <ItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            pressed={formats.has('underline')}
            onPressedChange={(p) => toggleFormat('underline', p)}
            aria-label="Underline"
          >
            <UnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}

// ─── Group ───────────────────────────────────────────────────────────────────

export function InputsFormsGroup({ showHeader = true }: Props) {
  return (
    <section id="section-inputs-forms">
      {showHeader && (
        <div className="pb-3 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{group.label}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {group.components.length} components
          </p>
        </div>
      )}

      <Specimen name="Button"><ButtonSpecimen /></Specimen>
      <Specimen name="Button Group"><ButtonGroupSpecimen /></Specimen>
      <Specimen name="Calendar"><CalendarSpecimen /></Specimen>
      <Specimen name="Checkbox"><CheckboxSpecimen /></Specimen>
      <Specimen name="Combobox"><ComboboxSpecimen /></Specimen>
      <Specimen name="Command"><CommandSpecimen /></Specimen>
      <Specimen name="Date Picker"><DatePickerSpecimen /></Specimen>
      <Specimen name="Field"><FieldSpecimen /></Specimen>
      <Specimen name="Input"><InputSpecimen /></Specimen>
      <Specimen name="Input Group"><InputGroupSpecimen /></Specimen>
      <Specimen name="Input OTP"><InputOTPSpecimen /></Specimen>
      <Specimen name="Label"><LabelSpecimen /></Specimen>
      <Specimen name="Native Select"><NativeSelectSpecimen /></Specimen>
      <Specimen name="Radio Group"><RadioGroupSpecimen /></Specimen>
      <Specimen name="Select"><SelectSpecimen /></Specimen>
      <Specimen name="Slider"><SliderSpecimen /></Specimen>
      <Specimen name="Switch"><SwitchSpecimen /></Specimen>
      <Specimen name="Textarea"><TextareaSpecimen /></Specimen>
      <Specimen name="Toggle"><ToggleSpecimen /></Specimen>
      <Specimen name="Toggle Group"><ToggleGroupSpecimen /></Specimen>
    </section>
  )
}
