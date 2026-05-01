import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useDebounce } from './useDebounce';

export const useExpenseFilters = () => {
  const { items } = useSelector((state) => state.expense);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredExpenses = useMemo(() => {
    return items.filter((expense) => {
      const matchSearch = debouncedSearch
        ? expense.notes?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          expense.merchant?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          expense.category?.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
        
      const matchCategory = category ? expense.category === category : true;
      const matchPayment = paymentMethod ? expense.paymentMethod === paymentMethod : true;

      return matchSearch && matchCategory && matchPayment;
    });
  }, [items, debouncedSearch, category, paymentMethod]);

  return {
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    paymentMethod,
    setPaymentMethod,
    filteredExpenses,
  };
};
