"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  showStrength?: boolean
  onStrengthChange?: (strength: "weak" | "medium" | "strong") => void
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, onStrengthChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [strength, setStrength] = React.useState<"weak" | "medium" | "strong">("weak")

    const value = typeof props.value === "string" ? props.value : ""

    React.useEffect(() => {
      if (showStrength && onStrengthChange) {
        const passwordStrength = calculateStrength(value)
        setStrength(passwordStrength)
        onStrengthChange(passwordStrength)
      }
    }, [value, showStrength, onStrengthChange])

    const calculateStrength = (password: string): "weak" | "medium" | "strong" => {
      if (password.length === 0) return "weak"
      
      let score = 0
      if (password.length >= 8) score += 1
      if (password.length >= 12) score += 1
      if (/[a-z]/.test(password)) score += 1
      if (/[A-Z]/.test(password)) score += 1
      if (/[0-9]/.test(password)) score += 1
      if (/[^a-zA-Z0-9]/.test(password)) score += 1

      if (score <= 2) return "weak"
      if (score <= 4) return "medium"
      return "strong"
    }

    const getStrengthColor = () => {
      switch (strength) {
        case "weak":
          return "bg-red-500"
        case "medium":
          return "bg-yellow-500"
        case "strong":
          return "bg-green-500"
      }
    }

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            {...props}
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowPassword(!showPassword)
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {showStrength && value.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1 h-1">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  strength === "weak" ? "w-1/3" : strength === "medium" ? "w-2/3" : "w-full",
                  getStrengthColor()
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {strength === "weak" && "Password is weak"}
              {strength === "medium" && "Password is medium"}
              {strength === "strong" && "Password is strong"}
            </p>
          </div>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }

