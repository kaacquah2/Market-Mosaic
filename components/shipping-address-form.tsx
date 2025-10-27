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

// Country-specific address format configurations
const ADDRESS_FORMATS: Record<string, {
  stateLabel: string
  stateRequired: boolean
  postalCodeLabel: string
  postalCodeRequired: boolean
  postalCodePattern?: RegExp
  postalCodeExample?: string
}> = {
  // North America
  US: { stateLabel: "State", stateRequired: true, postalCodeLabel: "ZIP Code", postalCodeRequired: true, postalCodePattern: /^\d{5}(-\d{4})?$/, postalCodeExample: "12345 or 12345-6789" },
  CA: { stateLabel: "Province", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, postalCodeExample: "A1A 1A1" },
  MX: { stateLabel: "State", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{5}$/, postalCodeExample: "01000" },
  
  // Europe (most don't use state/province)
  GB: { stateLabel: "County", stateRequired: false, postalCodeLabel: "Postcode", postalCodeRequired: true, postalCodePattern: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/, postalCodeExample: "SW1A 1AA" },
  FR: { stateLabel: "Region", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{5}$/, postalCodeExample: "75001" },
  DE: { stateLabel: "State", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{5}$/, postalCodeExample: "10115" },
  IT: { stateLabel: "Province", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{5}$/, postalCodeExample: "00100" },
  ES: { stateLabel: "Province", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{5}$/, postalCodeExample: "28001" },
  NL: { stateLabel: "Province", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{4}\s?[A-Z]{2}$/, postalCodeExample: "1012 AB" },
  BE: { stateLabel: "Province", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{4}$/, postalCodeExample: "1000" },
  CH: { stateLabel: "Canton", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{4}$/, postalCodeExample: "8000" },
  AT: { stateLabel: "State", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{4}$/, postalCodeExample: "1010" },
  SE: { stateLabel: "County", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{3}\s?\d{2}$/, postalCodeExample: "123 45" },
  NO: { stateLabel: "County", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{4}$/, postalCodeExample: "0150" },
  DK: { stateLabel: "Region", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{4}$/, postalCodeExample: "1000" },
  FI: { stateLabel: "Region", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{5}$/, postalCodeExample: "00100" },
  PL: { stateLabel: "Voivodeship", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{2}-\d{3}$/, postalCodeExample: "00-001" },
  IE: { stateLabel: "County", stateRequired: false, postalCodeLabel: "Eircode", postalCodeRequired: false, postalCodeExample: "D02 AF30" },
  PT: { stateLabel: "District", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{4}-\d{3}$/, postalCodeExample: "1000-001" },
  GR: { stateLabel: "Region", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{3}\s?\d{2}$/, postalCodeExample: "123 45" },
  
  // Asia-Pacific
  AU: { stateLabel: "State/Territory", stateRequired: true, postalCodeLabel: "Postcode", postalCodeRequired: true, postalCodePattern: /^\d{4}$/, postalCodeExample: "2000" },
  NZ: { stateLabel: "Region", stateRequired: false, postalCodeLabel: "Postcode", postalCodeRequired: true, postalCodePattern: /^\d{4}$/, postalCodeExample: "1010" },
  JP: { stateLabel: "Prefecture", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{3}-\d{4}$/, postalCodeExample: "100-0001" },
  CN: { stateLabel: "Province", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{6}$/, postalCodeExample: "100000" },
  KR: { stateLabel: "Province", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{5}$/, postalCodeExample: "03000" },
  IN: { stateLabel: "State", stateRequired: true, postalCodeLabel: "PIN Code", postalCodeRequired: true, postalCodePattern: /^\d{6}$/, postalCodeExample: "110001" },
  TH: { stateLabel: "Province", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{5}$/, postalCodeExample: "10100" },
  SG: { stateLabel: "District", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{6}$/, postalCodeExample: "018956" },
  MY: { stateLabel: "State", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{5}$/, postalCodeExample: "50000" },
  PH: { stateLabel: "Province", stateRequired: true, postalCodeLabel: "ZIP Code", postalCodeRequired: false, postalCodeExample: "1000" },
  ID: { stateLabel: "Province", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{5}$/, postalCodeExample: "10110" },
  VN: { stateLabel: "Province", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: false, postalCodeExample: "100000" },
  HK: { stateLabel: "District", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: false },
  
  // Middle East
  AE: { stateLabel: "Emirate", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: false },
  SA: { stateLabel: "Province", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{5}(-\d{4})?$/, postalCodeExample: "12345" },
  IL: { stateLabel: "District", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{7}$/, postalCodeExample: "1234567" },
  TR: { stateLabel: "Province", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{5}$/, postalCodeExample: "34000" },
  
  // Africa
  ZA: { stateLabel: "Province", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^\d{4}$/, postalCodeExample: "0001" },
  EG: { stateLabel: "Governorate", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: false },
  NG: { stateLabel: "State", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: false },
  GH: { stateLabel: "Region", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: false },
  
  // South America
  BR: { stateLabel: "State", stateRequired: true, postalCodeLabel: "CEP", postalCodeRequired: true, postalCodePattern: /^\d{5}-?\d{3}$/, postalCodeExample: "01310-100" },
  AR: { stateLabel: "Province", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: true, postalCodePattern: /^[A-Z]?\d{4}[A-Z]{3}$/, postalCodeExample: "C1000AAA" },
  CL: { stateLabel: "Region", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: false },
  CO: { stateLabel: "Department", stateRequired: true, postalCodeLabel: "Postal Code", postalCodeRequired: false },
  
  // Default for countries not specified
  DEFAULT: { stateLabel: "State/Province", stateRequired: false, postalCodeLabel: "Postal Code", postalCodeRequired: true }
}

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

  // Get address format configuration for current country
  const getAddressFormat = () => {
    return ADDRESS_FORMATS[address.country] || ADDRESS_FORMATS.DEFAULT
  }

  const validateField = (name: keyof ShippingAddress, value: string) => {
    const format = getAddressFormat()
    
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
        // Only validate state if it's required for this country
        if (format.stateRequired && !value.trim()) {
          return `${format.stateLabel} is required`
        }
        break
      case "postalCode":
        // Only validate postal code if it's required for this country
        if (format.postalCodeRequired && !value.trim()) {
          return `${format.postalCodeLabel} is required`
        }
        // Validate format if pattern is specified and value is provided
        if (value.trim() && format.postalCodePattern && !format.postalCodePattern.test(value)) {
          return `Please enter a valid ${format.postalCodeLabel}${format.postalCodeExample ? ` (e.g., ${format.postalCodeExample})` : ''}`
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
    
    // If country changes, clear state and postal code errors and reset their values if they're now optional
    if (name === "country") {
      const newFormat = ADDRESS_FORMATS[value] || ADDRESS_FORMATS.DEFAULT
      const updatedErrors = { ...errors }
      delete updatedErrors.state
      delete updatedErrors.postalCode
      setErrors(updatedErrors)
    }
    
    setAddress(newAddress)
    
    const error = validateField(name, value)
    const newErrors = { ...errors, [name]: error }
    setErrors(newErrors)
    
    // Get the format for the new address (in case country changed)
    const format = ADDRESS_FORMATS[newAddress.country] || ADDRESS_FORMATS.DEFAULT
    
    // Check if the current field has no error and all required fields are filled
    const isCurrentFieldValid = error === ""
    const allRequiredFieldsFilled = 
      newAddress.fullName.trim() !== "" &&
      newAddress.addressLine1.trim() !== "" &&
      newAddress.city.trim() !== "" &&
      (!format.stateRequired || newAddress.state.trim() !== "") &&
      (!format.postalCodeRequired || newAddress.postalCode.trim() !== "") &&
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

  const addressFormat = getAddressFormat()

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

        {addressFormat.stateRequired && (
          <div className="space-y-2">
            <Label htmlFor="state">{addressFormat.stateLabel} *</Label>
            <Input
              id="state"
              value={address.state}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder={addressFormat.stateLabel}
              required
            />
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="postalCode">
            {addressFormat.postalCodeLabel} {addressFormat.postalCodeRequired && "*"}
          </Label>
          <Input
            id="postalCode"
            value={address.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            placeholder={addressFormat.postalCodeExample || addressFormat.postalCodeLabel}
            required={addressFormat.postalCodeRequired}
          />
          {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
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

