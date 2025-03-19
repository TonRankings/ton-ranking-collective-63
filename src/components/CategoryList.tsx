
import { useEffect, useState } from 'react';
import { categories } from '../lib/data';
import * as LucideIcons from 'lucide-react';

interface CategoryListProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryList = ({ selectedCategory, onSelectCategory }: CategoryListProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // This is a dynamic icon component that renders Lucide icons by name
  const DynamicIcon = ({ name }: { name: string }) => {
    // First, convert the component to 'unknown' to avoid type conflicts
    // Then assert it as the proper Record type for icon components
    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[
      name.charAt(0).toUpperCase() + name.slice(1)
    ];
    
    if (!IconComponent) return null;
    return <IconComponent size={18} />;
  };

  return (
    <div className="py-4 mx-auto max-w-full overflow-x-auto scrollbar-hide">
      <div className="flex space-x-2 px-2 pb-2 animate-stagger">
        <button
          onClick={() => onSelectCategory('all')}
          className={`category-button whitespace-nowrap px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-muted hover:bg-muted/80'
          }`}
          style={{
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            opacity: mounted ? 1 : 0,
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out, background-color 0.3s ease',
          }}
        >
          <DynamicIcon name="layers" />
          All Categories
        </button>

        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`category-button whitespace-nowrap px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
              selectedCategory === category.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-muted hover:bg-muted/80'
            }`}
            style={{
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: `transform 0.3s ease-out ${index * 0.05}s, opacity 0.3s ease-out ${
                index * 0.05
              }s, background-color 0.3s ease`,
            }}
          >
            <DynamicIcon name={category.icon} />
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
