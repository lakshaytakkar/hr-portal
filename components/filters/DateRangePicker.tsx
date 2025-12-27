"use client"

import * as React from "react"
import { Calendar, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface DateRange {
  from: Date | null
  to: Date | null
}

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
  mode?: 'range' | 'single'
  presets?: boolean
  placeholder?: string
  className?: string
  required?: boolean
}

const PRESETS = [
  {
    label: 'Today',
    getValue: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return { from: today, to: today }
    },
  },
  {
    label: 'Yesterday',
    getValue: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)
      return { from: yesterday, to: yesterday }
    },
  },
  {
    label: 'This Week',
    getValue: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const firstDayOfWeek = new Date(today)
      const day = firstDayOfWeek.getDay()
      const diff = firstDayOfWeek.getDate() - day
      firstDayOfWeek.setDate(diff)
      return { from: firstDayOfWeek, to: today }
    },
  },
  {
    label: 'This Month',
    getValue: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      return { from: firstDayOfMonth, to: today }
    },
  },
  {
    label: 'Last Month',
    getValue: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      return { from: firstDayOfLastMonth, to: lastDayOfLastMonth }
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return { from: sevenDaysAgo, to: today }
    },
  },
  {
    label: 'Last 30 Days',
    getValue: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return { from: thirtyDaysAgo, to: today }
    },
  },
]

export function DateRangePicker({
  value,
  onChange,
  mode = 'range',
  presets = true,
  placeholder = 'Select date range',
  className,
  required = false,
}: DateRangePickerProps) {
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [open, setOpen] = React.useState(false)
  const [fromDate, setFromDate] = React.useState<string>(
    value?.from ? formatDateForInput(value.from) : ''
  )
  const [toDate, setToDate] = React.useState<string>(
    value?.to ? formatDateForInput(value.to) : ''
  )

  React.useEffect(() => {
    if (value) {
      setFromDate(value.from ? formatDateForInput(value.from) : '')
      setToDate(value.to ? formatDateForInput(value.to) : '')
    }
  }, [value])

  const parseDateFromInput = (dateString: string): Date | null => {
    if (!dateString) return null
    const date = new Date(dateString)
    date.setHours(0, 0, 0, 0)
    return isNaN(date.getTime()) ? null : date
  }

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value
    setFromDate(dateStr)
    const from = parseDateFromInput(dateStr)
    const to = mode === 'single' ? from : parseDateFromInput(toDate)
    
    if (onChange) {
      onChange({ from, to })
    }
  }

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value
    setToDate(dateStr)
    const to = parseDateFromInput(dateStr)
    const from = parseDateFromInput(fromDate)
    
    // Validate that 'to' is not before 'from'
    if (from && to && to < from) {
      // If to is before from, set to to be the same as from
      setToDate(fromDate)
      if (onChange) {
        onChange({ from, to: from })
      }
      return
    }
    
    if (onChange) {
      onChange({ from, to })
    }
  }

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    const range = preset.getValue()
    setFromDate(range.from ? formatDateForInput(range.from) : '')
    setToDate(range.to ? formatDateForInput(range.to) : '')
    if (onChange) {
      onChange(range)
    }
    setOpen(false)
  }

  const handleClear = () => {
    setFromDate('')
    setToDate('')
    if (onChange) {
      onChange({ from: null, to: null })
    }
  }

  const formatDisplayValue = (): string => {
    if (!value || (!value.from && !value.to)) {
      return placeholder
    }

    if (mode === 'single') {
      if (value.from) {
        return value.from.toLocaleDateString()
      }
      return placeholder
    }

    if (value.from && value.to) {
      const fromStr = value.from.toLocaleDateString()
      const toStr = value.to.toLocaleDateString()
      if (fromStr === toStr) {
        return fromStr
      }
      return `${fromStr} - ${toStr}`
    }

    if (value.from) {
      return `${value.from.toLocaleDateString()} - ...`
    }

    return placeholder
  }

  const hasValue = value && (value.from || value.to)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !hasValue && "text-muted-foreground",
            className
          )}
          type="button"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {formatDisplayValue()}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex flex-col gap-4">
          {presets && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-left text-sm"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className={cn("flex flex-col gap-4", presets && "border-t pt-4")}>
            {mode === 'single' ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="date-single">Date {required && '*'}</Label>
                <Input
                  id="date-single"
                  type="date"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  required={required}
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="date-from">From {required && '*'}</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={fromDate}
                    onChange={handleFromDateChange}
                    max={toDate || undefined}
                    required={required}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="date-to">To {required && '*'}</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={toDate}
                    onChange={handleToDateChange}
                    min={fromDate || undefined}
                    required={required}
                  />
                </div>
              </>
            )}

            {hasValue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="w-full"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

