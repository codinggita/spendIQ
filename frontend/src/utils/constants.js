export const CATEGORIES = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare', 'Travel', 'Education', 'Other'];
export const PAYMENT_METHODS = ['cash', 'card', 'upi', 'other'];

export const MOCK_EXPENSES = [
  { id: '1', date: '2024-03-01', amount: 450, category: 'Food', paymentMethod: 'UPI', notes: 'Lunch' },
  { id: '2', date: '2024-03-02', amount: 1200, category: 'Transport', paymentMethod: 'Credit Card', notes: 'Fuel' },
  { id: '3', date: '2024-03-03', amount: 3500, category: 'Shopping', paymentMethod: 'Debit Card', notes: 'Clothes' },
  { id: '4', date: '2024-03-05', amount: 200, category: 'Food', paymentMethod: 'Cash', notes: 'Snacks' },
  { id: '5', date: '2024-03-08', amount: 1500, category: 'Utilities', paymentMethod: 'UPI', notes: 'Electricity bill' },
  { id: '6', date: '2024-03-10', amount: 800, category: 'Entertainment', paymentMethod: 'Credit Card', notes: 'Movie' },
  { id: '7', date: '2024-03-12', amount: 300, category: 'Health', paymentMethod: 'UPI', notes: 'Medicines' },
  { id: '8', date: '2024-03-15', amount: 50, category: 'Other', paymentMethod: 'Cash', notes: 'Stationery' },
  { id: '9', date: '2024-03-18', amount: 600, category: 'Food', paymentMethod: 'UPI', notes: 'Dinner' },
  { id: '10', date: '2024-03-20', amount: 1000, category: 'Transport', paymentMethod: 'Credit Card', notes: 'Cab' },
  { id: '11', date: '2024-03-22', amount: 2500, category: 'Shopping', paymentMethod: 'Debit Card', notes: 'Shoes' },
  { id: '12', date: '2024-03-25', amount: 150, category: 'Food', paymentMethod: 'Cash', notes: 'Coffee' },
  { id: '13', date: '2024-03-28', amount: 400, category: 'Entertainment', paymentMethod: 'UPI', notes: 'Subscription' },
  { id: '14', date: '2024-03-30', amount: 2000, category: 'Utilities', paymentMethod: 'Net Banking', notes: 'Internet bill' },
  { id: '15', date: '2024-03-31', amount: 100, category: 'Other', paymentMethod: 'UPI', notes: 'Tip' },
];

export const MOCK_BUDGETS = [
  { id: '1', category: 'Food', limit: 5000, spent: 3200 },
  { id: '2', category: 'Transport', limit: 3000, spent: 1500 },
  { id: '3', category: 'Shopping', limit: 8000, spent: 8500 },
  { id: '4', category: 'Utilities', limit: 4000, spent: 3800 },
  { id: '5', category: 'Entertainment', limit: 2000, spent: 1000 },
  { id: '6', category: 'Health', limit: 1500, spent: 500 },
];

export const MOCK_SUBSCRIPTIONS = [
  { id: '1', name: 'Netflix', amount: 499, renewalDate: '2024-04-10', category: 'Streaming' },
  { id: '2', name: 'Spotify', amount: 119, renewalDate: '2024-04-05', category: 'Streaming' },
  { id: '3', name: 'Amazon Prime', amount: 1499, renewalDate: '2024-06-15', category: 'Streaming' },
  { id: '4', name: 'Gym', amount: 1500, renewalDate: '2024-04-01', category: 'Health' },
  { id: '5', name: 'Broadband', amount: 999, renewalDate: '2024-04-20', category: 'Utility' },
];

export const MOCK_CARD = {
  id: '1',
  cardNumber: '4242',
  cardholderName: 'John Doe',
  expiryDate: '12/25',
  network: 'VISA',
  creditLimit: 100000,
  outstanding: 25000,
  availableCredit: 75000,
  dueDate: '2024-04-05',
  minPayment: 1250,
  transactions: [
    { id: '1', date: '2024-03-25', description: 'Amazon', amount: 1500, status: 'Completed' },
    { id: '2', date: '2024-03-24', description: 'Uber', amount: 450, status: 'Completed' },
    { id: '3', date: '2024-03-22', description: 'Starbucks', amount: 350, status: 'Completed' },
    { id: '4', date: '2024-03-20', description: 'Netflix', amount: 499, status: 'Completed' },
    { id: '5', date: '2024-03-18', description: 'Swiggy', amount: 650, status: 'Completed' },
    { id: '6', date: '2024-03-15', description: 'Zomato', amount: 800, status: 'Completed' },
    { id: '7', date: '2024-03-12', description: 'Flipkart', amount: 3200, status: 'Completed' },
    { id: '8', date: '2024-03-10', description: 'BookMyShow', amount: 500, status: 'Completed' },
    { id: '9', date: '2024-03-08', description: 'Uber', amount: 300, status: 'Completed' },
    { id: '10', date: '2024-03-05', description: 'Reliance Fresh', amount: 1200, status: 'Completed' },
  ]
};
