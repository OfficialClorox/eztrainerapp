// App State
const appState = {
    currentClient: 'Sarah Mitchell',
    currentDay: new Date('2025-07-12'),
    selectedDays: [],
    copiedMealPlan: null,
    currentMonth: 7,
    currentYear: 2025,
    isSelecting: false,
    selectionStart: null,
    hasDragged: false,
    currentMeal: [],
    currentRecipe: [],
    currentMealOption: [],
    tempMeal: [],
    savedMeals: [],
    savedRecipes: [],
    editingDay: null,
    editingMealIndex: null,
    editingMealType: null,
    // Daily macro goals
    dailyGoals: {
        calories: 2281,
        protein: 139,
        carbs: 304,
        fat: 65
    },
    // Individual meal macro goals
    mealGoals: {
        breakfast: { calories: 450, protein: 25, carbs: 50, fat: 18 },
        lunch: { calories: 650, protein: 45, carbs: 70, fat: 22 },
        dinner: { calories: 750, protein: 50, carbs: 85, fat: 20 },
        snack: { calories: 250, protein: 15, carbs: 25, fat: 8 }
    },
    mealOptions: {
        breakfast: [
            { name: 'Protein Power Breakfast', calories: 350, protein: 24, carbs: 25, fat: 17, foods: ['3 Eggs', '2 slices whole grain bread'] },
            { name: 'Overnight Oats', calories: 320, protein: 18, carbs: 45, fat: 8, foods: ['1 cup oats', 'Greek yogurt', 'Berries'] },
            { name: 'Smoothie Bowl', calories: 280, protein: 22, carbs: 38, fat: 6, foods: ['Protein powder', 'Banana', 'Spinach'] }
        ],
        lunch: [
            { name: 'Grilled Chicken Bowl', calories: 530, protein: 45, carbs: 40, fat: 12, foods: ['Grilled chicken', 'Brown rice', 'Vegetables'] },
            { name: 'Mediterranean Salad', calories: 450, protein: 28, carbs: 30, fat: 22, foods: ['Chicken breast', 'Quinoa', 'Olives', 'Feta'] },
            { name: 'Turkey Wrap', calories: 400, protein: 35, carbs: 35, fat: 15, foods: ['Turkey breast', 'Whole wheat tortilla', 'Vegetables'] }
        ],
        dinner: [
            { name: 'Salmon & Sweet Potato', calories: 650, protein: 45, carbs: 50, fat: 20, foods: ['Salmon fillet', 'Sweet potato', 'Broccoli'] },
            { name: 'Lean Beef Stir-fry', calories: 580, protein: 42, carbs: 35, fat: 25, foods: ['Lean beef', 'Mixed vegetables', 'Brown rice'] },
            { name: 'Chicken & Quinoa', calories: 520, protein: 48, carbs: 45, fat: 18, foods: ['Chicken breast', 'Quinoa', 'Asparagus'] }
        ],
        snack: [
            { name: 'Greek Yogurt & Berries', calories: 150, protein: 15, carbs: 18, fat: 4, foods: ['Greek yogurt', 'Mixed berries'] },
            { name: 'Protein Shake', calories: 310, protein: 25, carbs: 38, fat: 5, foods: ['Protein powder', 'Banana', 'Almond milk'] },
            { name: 'Apple & Almond Butter', calories: 200, protein: 8, carbs: 20, fat: 12, foods: ['Apple slices', 'Almond butter'] }
        ]
    },
    dayMeals: {
        1: [
            { type: 'breakfast', name: 'Eggs & Toast', calories: 350, protein: 24, carbs: 25, fat: 17, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=150&h=150&fit=crop' },
            { type: 'snack', name: 'Protein Shake', calories: 310, protein: 25, carbs: 38, fat: 5, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop' },
            { type: 'lunch', name: 'Chicken Bowl', calories: 530, protein: 45, carbs: 40, fat: 12, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&h=150&fit=crop' },
            { type: 'snack', name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 10, fat: 4, hasPhoto: false },
            { type: 'dinner', name: 'Salmon Dinner', calories: 650, protein: 45, carbs: 50, fat: 20, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=150&h=150&fit=crop' }
        ],
        2: [
            { type: 'breakfast', name: 'Pancakes', calories: 380, protein: 12, carbs: 65, fat: 8, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=150&h=150&fit=crop' },
            { type: 'lunch', name: 'Greek Salad', calories: 420, protein: 18, carbs: 25, fat: 28, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=150&fit=crop' },
            { type: 'dinner', name: 'Steak & Veggies', calories: 650, protein: 55, carbs: 20, fat: 35, hasPhoto: false }
        ],
        12: [
            { type: 'breakfast', name: 'Eggs & Toast', calories: 350, protein: 24, carbs: 25, fat: 17, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=150&h=150&fit=crop' },
            { type: 'snack', name: 'Protein Shake', calories: 310, protein: 25, carbs: 38, fat: 5, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop' },
            { type: 'lunch', name: 'Chicken Bowl', calories: 530, protein: 45, carbs: 40, fat: 12, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&h=150&fit=crop' },
            { type: 'snack', name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 10, fat: 4, hasPhoto: false },
            { type: 'dinner', name: 'Salmon Dinner', calories: 650, protein: 45, carbs: 50, fat: 20, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=150&h=150&fit=crop' }
        ],
        13: [
            { type: 'breakfast', name: 'Eggs & Toast', calories: 350, protein: 24, carbs: 25, fat: 17, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=150&h=150&fit=crop' },
            { type: 'snack', name: 'Protein Shake', calories: 310, protein: 25, carbs: 38, fat: 5, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop' },
            { type: 'lunch', name: 'Chicken Bowl', calories: 530, protein: 45, carbs: 40, fat: 12, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&h=150&fit=crop' },
            { type: 'snack', name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 10, fat: 4, hasPhoto: false },
            { type: 'dinner', name: 'Salmon Dinner', calories: 650, protein: 45, carbs: 50, fat: 20, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=150&h=150&fit=crop' }
        ],
        14: [
            { type: 'breakfast', name: 'Eggs & Toast', calories: 350, protein: 24, carbs: 25, fat: 17, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=150&h=150&fit=crop' },
            { type: 'snack', name: 'Protein Shake', calories: 310, protein: 25, carbs: 38, fat: 5, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop' },
            { type: 'lunch', name: 'Chicken Bowl', calories: 530, protein: 45, carbs: 40, fat: 12, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&h=150&fit=crop' },
            { type: 'snack', name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 10, fat: 4, hasPhoto: false },
            { type: 'dinner', name: 'Salmon Dinner', calories: 650, protein: 45, carbs: 50, fat: 20, hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=150&h=150&fit=crop' }
        ]
    },
    foodDatabase: [
        { name: 'Chicken Breast', category: 'protein', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        { name: 'Brown Rice', category: 'carbs', calories: 112, protein: 2.6, carbs: 23, fat: 0.9 },
        { name: 'Salmon', category: 'protein', calories: 206, protein: 22, carbs: 0, fat: 12 },
        { name: 'Sweet Potato', category: 'carbs', calories: 112, protein: 2, carbs: 26, fat: 0.1 },
        { name: 'Greek Yogurt', category: 'protein', calories: 100, protein: 17, carbs: 6, fat: 0 },
        { name: 'Avocado', category: 'fats', calories: 160, protein: 2, carbs: 9, fat: 15 },
        { name: 'Eggs', category: 'protein', calories: 78, protein: 6, carbs: 0.6, fat: 5 },
        { name: 'Quinoa', category: 'carbs', calories: 222, protein: 8, carbs: 39, fat: 3.6 },
        { name: 'Broccoli', category: 'vegetables', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
        { name: 'Almonds', category: 'fats', calories: 579, protein: 21, carbs: 22, fat: 50 },
        { name: 'Turkey Breast', category: 'protein', calories: 135, protein: 25, carbs: 0, fat: 3 },
        { name: 'Spinach', category: 'vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
        { name: 'Oats', category: 'carbs', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
        { name: 'Tuna', category: 'protein', calories: 144, protein: 30, carbs: 0, fat: 1 },
        { name: 'Apple', category: 'fruits', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
        { name: 'Banana', category: 'fruits', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
        { name: 'Olive Oil', category: 'fats', calories: 884, protein: 0, carbs: 0, fat: 100 },
        { name: 'Carrots', category: 'vegetables', calories: 41, protein: 0.9, carbs: 10, fat: 0.2 }
    ]
};

// Utility functions for macro calculations
function getDayTotals(day) {
    const dayMeals = appState.dayMeals[day] || [];
    return dayMeals.reduce((totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

function getMealTotals(day, mealType) {
    const dayMeals = appState.dayMeals[day] || [];
    const mealsOfType = dayMeals.filter(meal => meal.type === mealType);
    return mealsOfType.reduce((totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

function getCurrentMealTotals() {
    if (!appState.currentMeal.length) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return appState.currentMeal.reduce((totals, food) => ({
        calories: totals.calories + food.calories,
        protein: totals.protein + food.protein,
        carbs: totals.carbs + food.carbs,
        fat: totals.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

function getTempMealTotals() {
    if (!appState.tempMeal.length) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return appState.tempMeal.reduce((totals, food) => ({
        calories: totals.calories + food.calories,
        protein: totals.protein + food.protein,
        carbs: totals.carbs + food.carbs,
        fat: totals.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

function getProgressColor(current, goal) {
    const percentage = (current / goal) * 100;
    if (percentage <= 80) return 'var(--success)';
    if (percentage <= 95) return 'var(--warning)';
    if (percentage <= 110) return 'var(--primary)';
    return 'var(--danger)';
}

function formatMacroValue(value, unit = '') {
    return Math.round(value * 10) / 10 + unit;
}

// Tab Management
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'calendar') {
        generateCalendar();
    }
}

// Day Navigation Functions
function previousDay() {
    appState.currentDay.setDate(appState.currentDay.getDate() - 1);
    updateDayDisplay();
}

function nextDay() {
    appState.currentDay.setDate(appState.currentDay.getDate() + 1);
    updateDayDisplay();
}

function updateDayDisplay() {
    const dayTitle = document.getElementById('current-day-title');
    dayTitle.textContent = appState.currentDay.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Meal Details Toggle
function toggleMealDetails(mealId) {
    const content = document.getElementById(`${mealId}-content`);
    const arrow = document.getElementById(`${mealId}-arrow`);
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        arrow.classList.remove('expanded');
    } else {
        content.classList.add('expanded');
        arrow.classList.add('expanded');
    }
}

// Tracking Functions
function exportData() {
    showNotification('📊 Nutrition data exported successfully!', 'success');
}

function addMealEntry() {
    showNotification('➕ Meal entry form opened', 'success');
}

function adjustTargets() {
    openMacroGoalsModal();
}

// Macro Goals Management
function openMacroGoalsModal() {
    const modal = document.getElementById('macro-goals-modal');
    if (modal) {
        modal.style.display = 'flex';
        populateMacroGoalsForm();
    }
}

function populateMacroGoalsForm() {
    // Populate daily goals
    document.getElementById('daily-calories').value = appState.dailyGoals.calories;
    document.getElementById('daily-protein').value = appState.dailyGoals.protein;
    document.getElementById('daily-carbs').value = appState.dailyGoals.carbs;
    document.getElementById('daily-fat').value = appState.dailyGoals.fat;
    
    // Populate meal goals
    ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
        document.getElementById(`${mealType}-calories`).value = appState.mealGoals[mealType].calories;
        document.getElementById(`${mealType}-protein`).value = appState.mealGoals[mealType].protein;
        document.getElementById(`${mealType}-carbs`).value = appState.mealGoals[mealType].carbs;
        document.getElementById(`${mealType}-fat`).value = appState.mealGoals[mealType].fat;
    });
}

function saveMacroGoals() {
    // Save daily goals
    appState.dailyGoals = {
        calories: parseInt(document.getElementById('daily-calories').value),
        protein: parseInt(document.getElementById('daily-protein').value),
        carbs: parseInt(document.getElementById('daily-carbs').value),
        fat: parseInt(document.getElementById('daily-fat').value)
    };
    
    // Save meal goals
    ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
        appState.mealGoals[mealType] = {
            calories: parseInt(document.getElementById(`${mealType}-calories`).value),
            protein: parseInt(document.getElementById(`${mealType}-protein`).value),
            carbs: parseInt(document.getElementById(`${mealType}-carbs`).value),
            fat: parseInt(document.getElementById(`${mealType}-fat`).value)
        };
    });
    
    showNotification('🎯 Macro goals updated successfully!', 'success');
    closeModal('macro-goals-modal');
    
    // Update any open interfaces
    if (appState.editingDay) {
        updateDayEditingSidebar(appState.editingDay);
    }
    updateMealBuilder();
}

function autoDistributeMacros() {
    const daily = appState.dailyGoals;
    
    // Distribute calories: 20% breakfast, 30% lunch, 35% dinner, 15% snack
    appState.mealGoals.breakfast.calories = Math.round(daily.calories * 0.20);
    appState.mealGoals.lunch.calories = Math.round(daily.calories * 0.30);
    appState.mealGoals.dinner.calories = Math.round(daily.calories * 0.35);
    appState.mealGoals.snack.calories = Math.round(daily.calories * 0.15);
    
    // Distribute protein evenly across main meals, less for snacks
    appState.mealGoals.breakfast.protein = Math.round(daily.protein * 0.25);
    appState.mealGoals.lunch.protein = Math.round(daily.protein * 0.35);
    appState.mealGoals.dinner.protein = Math.round(daily.protein * 0.30);
    appState.mealGoals.snack.protein = Math.round(daily.protein * 0.10);
    
    // Distribute carbs similarly to calories
    appState.mealGoals.breakfast.carbs = Math.round(daily.carbs * 0.20);
    appState.mealGoals.lunch.carbs = Math.round(daily.carbs * 0.30);
    appState.mealGoals.dinner.carbs = Math.round(daily.carbs * 0.35);
    appState.mealGoals.snack.carbs = Math.round(daily.carbs * 0.15);
    
    // Distribute fats evenly across meals
    appState.mealGoals.breakfast.fat = Math.round(daily.fat * 0.25);
    appState.mealGoals.lunch.fat = Math.round(daily.fat * 0.25);
    appState.mealGoals.dinner.fat = Math.round(daily.fat * 0.25);
    appState.mealGoals.snack.fat = Math.round(daily.fat * 0.25);
    
    populateMacroGoalsForm();
    showNotification('📊 Macros auto-distributed across meals!', 'success');
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    showNotification('💪 EZ Trainer loaded successfully!', 'success');
    updateDayDisplay();
    generateCalendar();
    populateFoodList();
    initializeModals();
    
    // Add global mouse up listener for drag selection
    document.addEventListener('mouseup', () => {
        appState.isSelecting = false;
        appState.selectionStart = null;
        document.querySelectorAll('.calendar-day.selecting').forEach(d => {
            d.classList.remove('selecting');
        });
        // Reset drag state after a small delay
        setTimeout(() => {
            appState.hasDragged = false;
        }, 10);
    });
    
    // Prevent text selection during drag
    document.addEventListener('selectstart', (e) => {
        if (appState.isSelecting) {
            e.preventDefault();
        }
    });
    
    // Initialize calendar UI
    updateCalendarUI();
});
