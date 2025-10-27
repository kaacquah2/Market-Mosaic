# International Address Format System

## Overview
The shipping address form has been enhanced to support country-specific address formats. Different countries have different address requirements, and the form now dynamically adapts based on the selected country.

## Key Features

### 1. **Dynamic Field Visibility**
- The state/province field only appears if required for the selected country
- Some countries (like most European countries) don't use state/province divisions
- The field automatically hides/shows when you change countries

### 2. **Country-Specific Labels**
Different countries use different terminology:
- **State** (US, India)
- **Province** (Canada, China, Thailand)
- **Prefecture** (Japan)
- **County** (UK, Ireland, Sweden)
- **Region** (France, many others)
- **Emirate** (UAE)
- **Canton** (Switzerland)
- **Governorate** (Egypt)
- **Department** (Colombia)
- And more...

### 3. **Postal Code Requirements**
- Some countries require postal codes, some don't
- Different labels: "ZIP Code", "Postcode", "PIN Code", "CEP", "Eircode", etc.
- Country-specific validation patterns and examples

### 4. **Smart Validation**
The form validates addresses based on the selected country:
- **Required fields** vary by country
- **Postal code formats** are validated (e.g., US ZIP codes must be 5 digits)
- **Error messages** are context-aware

## Supported Countries Configuration

### Countries with Required State/Province Field
- United States, Canada, Mexico
- Australia
- Japan, China, South Korea, India, Thailand, Malaysia, Philippines, Indonesia, Vietnam
- United Arab Emirates, Saudi Arabia, Turkey
- South Africa, Egypt, Nigeria, Ghana
- Brazil, Argentina, Chile, Colombia

### Countries WITHOUT Required State Field
- Most European countries (UK, France, Germany, Italy, Spain, etc.)
- New Zealand, Singapore, Hong Kong
- Israel
- And many others

## Examples of Address Formats

### United States
```
Full Name: John Doe
Country: United States
Address Line 1: 123 Main St
Address Line 2: Apt 4B
City: New York
State: NY ⭐ (Required)
ZIP Code: 10001 ⭐ (Required, validated)
Phone: +1 (555) 123-4567
```

### United Kingdom
```
Full Name: John Smith
Country: United Kingdom
Address Line 1: 10 Downing Street
Address Line 2: 
City: London
County: (Optional - field appears but not required)
Postcode: SW1A 2AA ⭐ (Required, validated)
Phone: +44 20 1234 5678
```

### France
```
Full Name: Marie Dubois
Country: France
Address Line 1: 123 Rue de la Paix
Address Line 2: 
City: Paris
Region: (Optional - field appears but not required)
Postal Code: 75001 ⭐ (Required, validated)
Phone: +33 1 23 45 67 89
```

### Hong Kong
```
Full Name: Wong Li
Country: Hong Kong
Address Line 1: 123 Nathan Road
Address Line 2: Flat 5A
City: Kowloon
District: (Optional - field appears but not required)
Postal Code: (Optional - no validation)
Phone: +852 1234 5678
```

### Japan
```
Full Name: Tanaka Yuki
Country: Japan
Address Line 1: 1-2-3 Shibuya
Address Line 2: 
City: Tokyo
Prefecture: Tokyo ⭐ (Required)
Postal Code: 100-0001 ⭐ (Required, validated format: XXX-XXXX)
Phone: +81 3 1234 5678
```

## Postal Code Validation Examples

Different countries have different postal code formats:

- **US**: 12345 or 12345-6789
- **Canada**: A1A 1A1
- **UK**: SW1A 1AA
- **France**: 75001
- **Germany**: 10115
- **Japan**: 100-0001
- **India**: 110001
- **Brazil**: 01310-100
- **Netherlands**: 1012 AB
- **Poland**: 00-001
- **Portugal**: 1000-001

## How It Works

1. **Select Country First**: The country selector is now positioned near the top of the form
2. **Form Adapts**: Fields appear/disappear and labels change based on your selection
3. **Smart Validation**: The form only validates what's required for that country
4. **Clear Errors**: When you change countries, validation errors are cleared for state/postal code fields

## Technical Implementation

The system uses an `ADDRESS_FORMATS` configuration object that defines:
- `stateLabel`: What to call the state/province field
- `stateRequired`: Whether the field is required
- `postalCodeLabel`: What to call the postal code field
- `postalCodeRequired`: Whether postal code is required
- `postalCodePattern`: Regex for validation (if applicable)
- `postalCodeExample`: Example format to show users

Countries not explicitly configured use sensible defaults.

## Benefits

1. **Better User Experience**: Users only see fields relevant to their country
2. **Reduced Errors**: Validation matches real-world address formats
3. **International Support**: Proper handling of 50+ countries' address formats
4. **Clear Guidance**: Examples and proper labels help users enter correct information
5. **Flexibility**: Easy to add new countries or update existing configurations

## Future Enhancements

Potential improvements:
- Add dropdown selectors for states/provinces in countries with defined lists
- Integrate with address lookup APIs for auto-completion
- Add more countries to the configuration
- Implement postal code format auto-formatting (add hyphens/spaces automatically)

