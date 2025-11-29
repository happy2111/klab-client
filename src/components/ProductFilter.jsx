'use client';

import { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { productStore } from '@/stores/product.store';
import { categoryStore } from '@/stores/category.store';
import { Button } from '@/components/ui/button';
import Calendar05 from "@/components/calendar-05";
import {Funnel} from "lucide-react"

export const ProductFilter = observer(() => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({});

  const calendarRef = useRef(null);

  useEffect(() => {
    if (categoryStore.categories.length === 0) {
      categoryStore.fetchAll();
    }

    // Закрытие календаря по клику вне
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
    ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    productStore.getAll({ categoryId });
  };

  const applyDateFilter = () => {
    const from = dateRange.from ? dateRange.from.toISOString() : undefined;
    const to = dateRange.to ? dateRange.to.toISOString() : undefined;
    productStore.getAll({ createdFrom: from, createdTo: to });
    setShowCalendar(false);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setDateRange({});
    setShowCalendar(false);
    productStore.getAll({});
  };

  return (
    <div className="relative flex flex-wrap items-center gap-2 mb-4">
      <div className="relative">
        <Button onClick={() => setShowCalendar((prev) => !prev)}>
          <Funnel />
          {/*{showCalendar ? 'Yopish' : 'Vaqt oralig’ini tanlash'}*/}
        </Button>

        {showCalendar && (
          <div
            ref={calendarRef}
            className="absolute z-50 mt-2 bg-white dark:bg-black p-2 rounded-lg shadow-lg border"
          >
            <Calendar05 selected={dateRange} onSelect={setDateRange} />
            <Button className="mt-2 w-full" onClick={applyDateFilter}>
              Filtrlash
            </Button>
          </div>
        )}
      </div>
      {/* Категории как кнопки */}
      <Button
        variant={selectedCategory === '' ? 'default' : 'outline'}
        onClick={() => applyCategoryFilter('')}
      >
        Barchasi
      </Button>
      {categoryStore.categories.map((cat) => (
        <Button
          key={cat.id}
          variant={selectedCategory === cat.id ? 'default' : 'outline'}
          onClick={() => applyCategoryFilter(cat.id)}
        >
          {cat.name}
        </Button>
      ))}

      {/* Кнопка для показа календаря */}


      {/* Сброс */}
      <Button variant="outline" onClick={resetFilters}>
        Tozalash
      </Button>
    </div>
  );
});
