"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Complete list of all countries
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "PL", name: "Poland" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "GR", name: "Greece" },
  { code: "CZ", name: "Czech Republic" },
  { code: "HU", name: "Hungary" },
  { code: "RO", name: "Romania" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "LT", name: "Lithuania" },
  { code: "LV", name: "Latvia" },
  { code: "EE", name: "Estonia" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "KR", name: "South Korea" },
  { code: "IN", name: "India" },
  { code: "TH", name: "Thailand" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "PH", name: "Philippines" },
  { code: "ID", name: "Indonesia" },
  { code: "VN", name: "Vietnam" },
  { code: "TW", name: "Taiwan" },
  { code: "HK", name: "Hong Kong" },
  { code: "NZ", name: "New Zealand" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "KE", name: "Kenya" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "MA", name: "Morocco" },
  { code: "TN", name: "Tunisia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "IL", name: "Israel" },
  { code: "TR", name: "Turkey" },
  { code: "PK", name: "Pakistan" },
  { code: "BD", name: "Bangladesh" },
  { code: "LK", name: "Sri Lanka" },
  { code: "NP", name: "Nepal" },
  { code: "MM", name: "Myanmar" },
  { code: "KH", name: "Cambodia" },
  { code: "LA", name: "Laos" },
  { code: "BN", name: "Brunei" },
  { code: "MX", name: "Mexico" },
  { code: "BR", name: "Brazil" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" },
  { code: "BO", name: "Bolivia" },
  { code: "PY", name: "Paraguay" },
  { code: "UY", name: "Uruguay" },
  { code: "CR", name: "Costa Rica" },
  { code: "PA", name: "Panama" },
  { code: "GT", name: "Guatemala" },
  { code: "HN", name: "Honduras" },
  { code: "NI", name: "Nicaragua" },
  { code: "SV", name: "El Salvador" },
  { code: "DO", name: "Dominican Republic" },
  { code: "CU", name: "Cuba" },
  { code: "JM", name: "Jamaica" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "GY", name: "Guyana" },
  { code: "SR", name: "Suriname" },
  { code: "RU", name: "Russia" },
  { code: "UA", name: "Ukraine" },
  { code: "BY", name: "Belarus" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "GE", name: "Georgia" },
  { code: "AM", name: "Armenia" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "IQ", name: "Iraq" },
  { code: "JO", name: "Jordan" },
  { code: "LB", name: "Lebanon" },
  { code: "SY", name: "Syria" },
  { code: "YE", name: "Yemen" },
  { code: "OM", name: "Oman" },
  { code: "KW", name: "Kuwait" },
  { code: "QA", name: "Qatar" },
  { code: "BH", name: "Bahrain" },
  { code: "IR", name: "Iran" },
  { code: "AF", name: "Afghanistan" },
  { code: "ET", name: "Ethiopia" },
  { code: "TZ", name: "Tanzania" },
  { code: "UG", name: "Uganda" },
  { code: "RW", name: "Rwanda" },
  { code: "BW", name: "Botswana" },
  { code: "NA", name: "Namibia" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
  { code: "MU", name: "Mauritius" },
  { code: "SC", name: "Seychelles" },
  { code: "MG", name: "Madagascar" },
  { code: "MZ", name: "Mozambique" },
  { code: "AO", name: "Angola" },
  { code: "CV", name: "Cape Verde" },
  { code: "DZ", name: "Algeria" },
  { code: "LY", name: "Libya" },
  { code: "SD", name: "Sudan" },
  { code: "SS", name: "South Sudan" },
  { code: "ER", name: "Eritrea" },
  { code: "DJ", name: "Djibouti" },
  { code: "SO", name: "Somalia" },
  { code: "KM", name: "Comoros" },
  { code: "AD", name: "Andorra" },
  { code: "MC", name: "Monaco" },
  { code: "SM", name: "San Marino" },
  { code: "VA", name: "Vatican City" },
  { code: "LI", name: "Liechtenstein" },
  { code: "MT", name: "Malta" },
  { code: "CY", name: "Cyprus" },
  { code: "LU", name: "Luxembourg" },
  { code: "IS", name: "Iceland" },
  { code: "MD", name: "Moldova" },
  { code: "MK", name: "North Macedonia" },
  { code: "ME", name: "Montenegro" },
  { code: "RS", name: "Serbia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "AL", name: "Albania" },
  { code: "XK", name: "Kosovo" },
  { code: "MN", name: "Mongolia" },
  { code: "BT", name: "Bhutan" },
  { code: "MV", name: "Maldives" },
  { code: "BN", name: "Brunei" },
  { code: "TL", name: "East Timor" },
  { code: "FJ", name: "Fiji" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "SB", name: "Solomon Islands" },
  { code: "VU", name: "Vanuatu" },
  { code: "NC", name: "New Caledonia" },
  { code: "PF", name: "French Polynesia" },
  { code: "WS", name: "Samoa" },
  { code: "KI", name: "Kiribati" },
  { code: "TV", name: "Tuvalu" },
  { code: "NR", name: "Nauru" },
  { code: "TO", name: "Tonga" },
  { code: "PW", name: "Palau" },
  { code: "FM", name: "Micronesia" },
  { code: "MH", name: "Marshall Islands" },
]

interface ShippingAddress {
  fullName: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

interface ShippingAddressFormProps {
  onAddressChange: (address: ShippingAddress) => void
  initialAddress?: Partial<ShippingAddress>
}

export function ShippingAddressForm({ onAddressChange, initialAddress }: ShippingAddressFormProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: initialAddress?.fullName || "",
    addressLine1: initialAddress?.addressLine1 || "",
    addressLine2: initialAddress?.addressLine2 || "",
    city: initialAddress?.city || "",
    state: initialAddress?.state || "",
    postalCode: initialAddress?.postalCode || "",
    country: initialAddress?.country || "US",
    phone: initialAddress?.phone || "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({})
  const [isValidating, setIsValidating] = useState(false)

  const validateField = (name: keyof ShippingAddress, value: string) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required"
        break
      case "addressLine1":
        if (!value.trim()) return "Address is required"
        break
      case "city":
        if (!value.trim()) return "City is required"
        break
      case "state":
        if (!value.trim()) return "State is required"
        break
      case "postalCode":
        if (!value.trim()) return "Postal code is required"
        // Basic postal code validation
        if (address.country === "US" && !/^\d{5}(-\d{4})?$/.test(value)) {
          return "Please enter a valid US ZIP code (e.g., 12345 or 12345-6789)"
        }
        if (address.country === "CA" && !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(value)) {
          return "Please enter a valid Canadian postal code (e.g., A1A 1A1)"
        }
        break
      case "country":
        if (!value.trim()) return "Country is required"
        break
      case "phone":
        if (!value.trim()) return "Phone number is required"
        // Basic phone validation - should contain at least 10 digits
        const phoneDigits = value.replace(/\D/g, '')
        if (phoneDigits.length < 10) return "Phone number must be at least 10 digits"
        break
    }
    return ""
  }

  const handleChange = (name: keyof ShippingAddress, value: string) => {
    const newAddress = { ...address, [name]: value }
    setAddress(newAddress)
    
    const error = validateField(name, value)
    const newErrors = { ...errors, [name]: error }
    setErrors(newErrors)
    
    // Check if the current field has no error and all required fields are filled
    const isCurrentFieldValid = error === ""
    const allRequiredFieldsFilled = newAddress.fullName.trim() !== "" &&
      newAddress.addressLine1.trim() !== "" &&
      newAddress.city.trim() !== "" &&
      newAddress.state.trim() !== "" &&
      newAddress.postalCode.trim() !== "" &&
      newAddress.country.trim() !== "" &&
      newAddress.phone.trim() !== ""
    
    // Only call onAddressChange if current field is valid and all required fields are filled
    if (isCurrentFieldValid && allRequiredFieldsFilled) {
      onAddressChange(newAddress)
    } else if (isCurrentFieldValid && !allRequiredFieldsFilled) {
      // Clear the address if not all fields are filled
      onAddressChange(null as any)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
        <CardDescription>Where should we send your order?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={address.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="John Doe"
            required
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressLine1">Address Line 1 *</Label>
          <Input
            id="addressLine1"
            value={address.addressLine1}
            onChange={(e) => handleChange("addressLine1", e.target.value)}
            placeholder="123 Main St"
            required
          />
          {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressLine2">Address Line 2</Label>
          <Input
            id="addressLine2"
            value={address.addressLine2}
            onChange={(e) => handleChange("addressLine2", e.target.value)}
            placeholder="Apt 4B"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={address.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="New York"
              required
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={address.state}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="NY"
              required
            />
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              value={address.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              placeholder="10001"
              required
            />
            {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !address.country && "text-muted-foreground"
                  )}
                >
                  {address.country
                    ? COUNTRIES.find((country) => country.code === address.country)?.name
                    : "Select country..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search countries..." />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {COUNTRIES.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={country.name}
                          onSelect={() => {
                            handleChange("country", country.code)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              address.country === country.code ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {country.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={address.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            required
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

