"use client"

import * as React from "react"
import { Check, X, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Sélectionner...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    onChange(newSelected)
    // Don't close, allow multiple selections
  }

  const handleCreate = () => {
    if (inputValue && !selected.includes(inputValue)) {
      onChange([...selected, inputValue])
      setInputValue("")
    }
  }

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selected.filter((item) => item !== value))
  }

  // Filter options based on input (accent insensitive)
  const filteredOptions = options.filter((option) => {
    const normalize = (str: string) => 
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    
    return normalize(option.label).includes(normalize(inputValue))
  })

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 py-2"
            type="button"
          >
            <div className="flex flex-wrap gap-1 items-center">
              {selected.length > 0 ? (
                selected.map((value) => {
                  const option = options.find((opt) => opt.value === value)
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="mr-1 mb-1"
                    >
                      {option?.label || value}
                      <div
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRemove(value, e as unknown as React.MouseEvent)
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => handleRemove(value, e)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </div>
                    </Badge>
                  )
                })
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="flex flex-col w-full border rounded-md bg-popover text-popover-foreground">
            {/* Search Input */}
            <div className="flex items-center border-b px-3">
              <Input
                placeholder="Rechercher ou ajouter..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border-0 focus-visible:ring-0 px-0 py-4"
              />
            </div>
            
            {/* Options List */}
            <div className="max-h-64 overflow-y-auto p-1">
              {filteredOptions.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  <p className="mb-2">Aucune ville trouvée.</p>
                  {inputValue && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handleCreate}
                      type="button"
                    >
                      <span className="mr-2">+</span>
                      Ajouter &quot;{inputValue}&quot;
                    </Button>
                  )}
                </div>
              )}
              
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    selected.includes(option.value) && "bg-accent text-accent-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selected.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
