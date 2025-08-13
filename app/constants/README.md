# Constants Directory

This directory contains all the constant values, arrays, and configuration data used throughout the Property Management application.

## Structure

```
app/constants/
├── index.ts          # Main export file - import everything from here
├── roles.ts          # User roles and permissions
├── property.ts       # Property types, statuses, and amenities
├── maintenance.ts    # Maintenance priorities, statuses, and categories
├── ui.ts            # UI constants like colors, sizes, and breakpoints
├── demo.ts           # Example usage and additional utility constants
└── README.md        # This documentation file
```

## Usage

### Importing Constants

```typescript
// Import everything
import * as Constants from '~/constants';

// Import specific constants
import { USER_ROLES, PROPERTY_TYPES } from '~/constants';

// Import with aliases
import { USER_ROLES as Roles } from '~/constants';
```

### Using Role Constants

```typescript
import { USER_ROLES, getRoleByValue, getRoleColor } from '~/constants';

// Get all roles
const allRoles = USER_ROLES;

// Find a specific role
const tenantRole = getRoleByValue('tenant');

// Get role color for UI
const roleColor = getRoleColor('landlord'); // returns 'green'
```

### Using Property Constants

```typescript
import { PROPERTY_TYPES, PROPERTY_STATUSES, PROPERTY_AMENITIES } from '~/constants';

// Get property types for a dropdown
const propertyTypeOptions = PROPERTY_TYPES.map(type => ({
  label: type.label,
  value: type.value
}));

// Filter amenities by category
import { getAmenitiesByCategory } from '~/constants';
const basicAmenities = getAmenitiesByCategory('basic');
```

### Using Maintenance Constants

```typescript
import { 
  MAINTENANCE_PRIORITIES, 
  MAINTENANCE_STATUSES,
  getMaintenancePriorityByValue 
} from '~/constants';

// Get priority information
const highPriority = getMaintenancePriorityByValue('high');
console.log(highPriority.responseTime); // "Within 24 hours"
```

### Using UI Constants

```typescript
import { COLOR_SCHEMES, SPACING, BREAKPOINTS } from '~/constants';

// Get color scheme
const colors = COLOR_SCHEMES.modern;

// Get spacing value
const margin = SPACING.lg; // "1.5rem"

// Check breakpoint
const isMobile = window.innerWidth < parseInt(BREAKPOINTS.md);
```

## Adding New Constants

When adding new constants:

1. **Create a new file** in the `constants/` directory
2. **Define interfaces** for type safety
3. **Export constants** and helper functions
4. **Update `index.ts`** to export the new constants
5. **Update this README** with usage examples

### Example New Constants File

```typescript
// app/constants/notifications.ts
export interface NotificationType {
  value: string;
  label: string;
  icon: string;
  color: string;
}

export const NOTIFICATION_TYPES: NotificationType[] = [
  {
    value: 'info',
    label: 'Information',
    icon: 'i-heroicons-information-circle',
    color: 'blue'
  }
  // ... more types
];

export const getNotificationTypeByValue = (value: string): NotificationType | undefined => {
  return NOTIFICATION_TYPES.find(type => type.value === value);
};
```

Then update `index.ts`:

```typescript
export * from './notifications';
export { NOTIFICATION_TYPES, getNotificationTypeByValue } from './notifications';
```

## Best Practices

1. **Type Safety**: Always define TypeScript interfaces for your constants
2. **Consistency**: Use consistent naming conventions (UPPER_CASE for constants)
3. **Helper Functions**: Provide utility functions for common operations
4. **Documentation**: Include JSDoc comments for complex constants
5. **Validation**: Consider adding runtime validation for critical constants
6. **Testing**: Write tests for your constants and helper functions

## Demo and Examples

The `demo.ts` file contains practical examples of how to use constants in your components, including:

- **Composable functions** for common operations
- **Form validation constants** for consistent validation rules
- **API endpoint constants** for centralized API configuration
- **Storage keys** for local storage management
- **Error messages** for consistent user feedback

## Benefits

- **Centralized Configuration**: All constants in one place
- **Type Safety**: Full TypeScript support with interfaces
- **Reusability**: Import constants anywhere in the application
- **Maintainability**: Easy to update values across the entire app
- **Consistency**: Ensures consistent values throughout the UI
- **Developer Experience**: Better autocomplete and error checking
