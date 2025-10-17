# Component Usage Guide

## Footer.jsx
A comprehensive footer component with company info, services, quick links, and contact information.

### Usage:
```jsx
import { Footer } from '../components';

function App() {
  return (
    <div>
      {/* Your app content */}
      <Footer />
    </div>
  );
}
```

## ServiceCard.jsx
A reusable service card component that displays service information with booking functionality.

### Props:
- `service` (object, required): Service data object
- `onBookNow` (function): Callback when book button is clicked
- `showBookButton` (boolean): Whether to show the book button (default: true)
- `className` (string): Additional CSS classes
- `imageHeight` (string): Height class for the image (default: "h-48")

### Usage:
```jsx
import { ServiceCard } from '../components';

const service = {
  _id: "1",
  name: "Facial Treatment",
  description: "Rejuvenating facial for all skin types",
  price: 75,
  duration: 60,
  category: "facial",
  image: "https://example.com/image.jpg",
  isActive: true,
  availableFor: "all",
  tags: ["relaxing", "skincare"]
};

function ServicesPage() {
  const handleBooking = (service) => {
    console.log('Booking service:', service.name);
    // Handle booking logic
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ServiceCard 
        service={service} 
        onBookNow={handleBooking}
        showBookButton={true}
      />
    </div>
  );
}
```

## Loader.jsx
Multiple loading component variants with skeleton loaders.

### Loader Props:
- `size` (string): 'small', 'medium', 'large', 'xlarge'
- `color` (string): 'pink', 'blue', 'green', 'purple', 'gray', 'white'
- `type` (string): 'spinner', 'dots', 'pulse', 'bars', 'ring'
- `text` (string): Loading text to display
- `fullScreen` (boolean): Whether to show as full screen overlay
- `className` (string): Additional CSS classes

### Usage:
```jsx
import Loader, { SkeletonLoader, TableSkeleton } from '../components/Loader';

// Basic loader
<Loader size="medium" color="pink" type="spinner" text="Loading..." />

// Full screen loader
<Loader size="large" color="pink" fullScreen={true} text="Please wait..." />

// Skeleton for cards
<SkeletonLoader card={true} />

// Skeleton for text content
<SkeletonLoader lines={4} avatar={true} />

// Table skeleton
<TableSkeleton rows={5} columns={4} />
```

## Component Examples in Pages

### Using in AdminServices.jsx:
```jsx
import { ServiceCard, Loader, TableSkeleton } from '../components';

function AdminServices() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);

  if (loading) {
    return <Loader size="large" color="pink" text="Loading services..." />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map(service => (
          <ServiceCard 
            key={service._id}
            service={service}
            showBookButton={false}
            className="admin-service-card"
          />
        ))}
      </div>
    </div>
  );
}
```

### Using in Public Services Page:
```jsx
import { ServiceCard, SkeletonLoader, Footer } from '../components';

function PublicServices() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);

  const handleBooking = (service) => {
    // Navigate to booking page or open booking modal
    navigate(`/book/${service._id}`);
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({length: 6}).map((_, i) => (
              <SkeletonLoader key={i} card={true} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(service => (
              <ServiceCard 
                key={service._id}
                service={service}
                onBookNow={handleBooking}
                showBookButton={true}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
```

## Styling Notes

All components use Tailwind CSS classes and are designed to be responsive and accessible. The components include:

- **Responsive design**: Works on mobile, tablet, and desktop
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Dark mode ready**: Can be easily adapted for dark mode
- **Customizable**: Props allow for easy customization
- **Loading states**: Smooth loading animations and skeleton loaders