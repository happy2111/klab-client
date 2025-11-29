'use client';

import { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { productStore } from '@/stores/product.store';
import { categoryStore } from '@/stores/category.store';
import { Button } from '@/components/ui/button';
import Calendar05 from "@/components/calendar-05";
import { Funnel } from "lucide-react";
import {Input} from "@/components/ui/input";

export const ProductFilterBar = observer(() => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({});

  const calendarRef = useRef(null);

  useEffect(() => {
    if (categoryStore.categories.length === 0) {
      categoryStore.fetchAll();
    }

    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyFilters = () => {
    const filter = {
      categoryId: selectedCategory || undefined,
      createdFrom: dateRange.from ? dateRange.from.toISOString() : undefined,
      createdTo: dateRange.to ? dateRange.to.toISOString() : undefined,
      search: productStore.search || undefined,
    };
    productStore.getAll(filter);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setDateRange({});
    setSearch('');
    setShowCalendar(false);
    productStore.search = '';
    productStore.getAll({});
  };

  return (
    <div className="relative flex flex-wrap items-center gap-2 mb-4 w-full">
      {/* Поиск */}
      <Input
        type="text"
        // Привязываем к состоянию store
        value={productStore.search}
        onChange={(e) => productStore.setSearch(e.target.value)}
        // Измените onKeyUp, чтобы он вызывал поиск (который уже есть в store)
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            productStore.setSearch(e.target.value); // setsearch уже вызывает getAll
          }
        }}
        placeholder="Izlash..."
      />

      {/* Кнопка календаря */}
      <div className="relative">
        <Button onClick={() => setShowCalendar(prev => !prev)}>
          <Funnel />
        </Button>
        {showCalendar && (
          <div
            ref={calendarRef}
            className="absolute z-50 mt-2 bg-white dark:bg-black p-2 rounded-lg shadow-lg border"
          >
            <Calendar05 selected={dateRange} onSelect={setDateRange} />
            <Button className="mt-2 w-full" onClick={applyFilters}>
              Filtrlash
            </Button>
          </div>
        )}
      </div>

      {/* Категории */}
      <Button
        variant={selectedCategory === '' ? 'default' : 'outline'}
        onClick={() => {
          setSelectedCategory('');
          productStore.getAll({
            search: productStore.search || undefined,
            categoryId: undefined
          });
        }}
      >
        Barchasi
      </Button>
      {categoryStore.categories.map(cat => (
        <Button
          key={cat.id}
          variant={selectedCategory === cat.id ? 'default' : 'outline'}
          onClick={() => {
            setSelectedCategory(cat.id);
            productStore.getAll({
              search: productStore.search || undefined,
              categoryId: cat.id
            });
          }}
        >
          {cat.name}
        </Button>
      ))}

      {/* Сброс */}
      <Button variant="outline" onClick={resetFilters}>
        Tozalash
      </Button>
    </div>
  );
});
