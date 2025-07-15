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
    mealGoals: {
        breakfast: { calories: 456, protein: 28, carbs: 61, fat: 13 },
        lunch: { calories: 684, protein: 42, carbs: 91, fat: 20 },
        dinner: { calories: 798, protein: 49, carbs: 107, fat: 23 },
        snack: { calories: 343, protein: 20, carbs: 46, fat: 9 }
    },
    dailyGoals: {
        calories: 2281,
        protein: 139,
        carbs: 304,
        fat: 65
    },
    mealOptions: {
        breakfast: [
            { 
                name: 'Protein Power Breakfast', 
                calories: 350, 
                protein: 24, 
                carbs: 25, 
                fat: 17, 
                foods: [
                    { name: '3 Eggs', servings: 3, servingSize: '1 large egg' },
                    { name: '2 slices whole grain bread', servings: 2, servingSize: '1 slice' }
                ]
            },
            { 
                name: 'Overnight Oats', 
                calories: 320, 
                protein: 18, 
                carbs: 45, 
                fat: 8, 
                foods: [
                    { name: '1 cup oats', servings: 1, servingSize: '1 cup' },
                    { name: 'Greek yogurt', servings: 1, servingSize: '150g' },
                    { name: 'Berries', servings: 0.5, servingSize: '1 cup' }
                ]
            }
        ],
        lunch: [
            { 
                name: 'Grilled Chicken Bowl', 
                calories: 530, 
                protein: 45, 
                carbs: 40, 
                fat: 12, 
                foods: [
                    { name: 'Grilled chicken', servings: 1.5, servingSize: '100g' },
                    { name: 'Brown rice', servings: 0.75, servingSize: '1 cup cooked' },
                    { name: 'Vegetables', servings: 1, servingSize: '1 cup mixed' }
                ]
            }
        ],
        dinner: [
            { 
                name: 'Salmon & Sweet Potato', 
                calories: 650, 
                protein: 45, 
                carbs: 50, 
                fat: 20, 
                foods: [
                    { name: 'Salmon fillet', servings: 1.2, servingSize: '100g' },
                    { name: 'Sweet potato', servings: 1, servingSize: '1 medium' },
                    { name: 'Broccoli', servings: 1.5, servingSize: '1 cup' }
                ]
            }
        ],
        snack: [
            { 
                name: 'Greek Yogurt & Berries', 
                calories: 150, 
                protein: 15, 
                carbs: 18, 
                fat: 4, 
                foods: [
                    { name: 'Greek yogurt', servings: 1, servingSize: '150g' },
                    { name: 'Mixed berries', servings: 0.5, servingSize: '1 cup' }
                ]
            }
        ]
    },
    dayMeals: {
        1: [
            { 
                type: 'breakfast', 
                name: 'Eggs & Toast', 
                calories: 350, 
                protein: 24, 
                carbs: 25, 
                fat: 17, 
                hasPhoto: true, 
                photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=150&h=150&fit=crop',
                foods: [
                    { name: 'Eggs', servings: 3, servingSize: '1 large egg', calories: 210, protein: 18, carbs: 1, fat: 15 },
                    { name: 'Whole grain bread', servings: 2, servingSize: '1 slice', calories: 140, protein: 6, carbs: 24, fat: 2 }
                ]
            }
        ],
        12: [
            { 
                type: 'breakfast', 
                name: 'Eggs & Toast', 
                calories: 350, 
                protein: 24, 
                carbs: 25, 
                fat: 17, 
                hasPhoto: true, 
                photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=150&h=150&fit=crop',
                foods: [
                    { name: 'Eggs', servings: 3, servings_size: '1 large egg', calories: 210, protein: 18, carbs: 1, fat: 15 },
                    { name: 'Whole grain bread', servings: 2, servingSize: '1 slice', calories: 140, protein: 6, carbs: 24, fat: 2 }
                ]
            }
        ]
    },
    foodDatabase: [
        { 
            name: 'Chicken Breast', 
            category: 'protein', 
            calories: 165, 
            protein: 31, 
            carbs: 0, 
            fat: 3.6,
            servingSize: '100g',
            servingOptions: ['50g', '100g', '150g', '200g'],
            unit: 'g'
        },
        { 
            name: 'Brown Rice', 
            category: 'carbs', 
            calories: 112, 
            protein: 2.6, 
            carbs: 23, 
            fat: 0.9,
            servingSize: '100g cooked',
            servingOptions: ['0.5 cup', '1 cup', '1.5 cups'],
            unit: 'cup'
        },
        { 
            name: 'Salmon', 
            category: 'protein', 
            calories: 206, 
            protein: 22, 
            carbs: 0, 
            fat: 12,
            servingSize: '100g',
            servingOptions: ['75g', '100g', '125g', '150g'],
            unit: 'g'
        },
        { 
            name: 'Sweet Potato', 
            category: 'carbs', 
            calories: 112, 
            protein: 2, 
            carbs: 26, 
            fat: 0.1,
            servingSize: '1 medium (128g)',
            servingOptions: ['1 small', '1 medium', '1 large'],
            unit: 'piece'
        },
        { 
            name: 'Greek Yogurt', 
            category: 'protein', 
            calories: 100, 
            protein: 17, 
            carbs: 6, 
            fat: 0,
            servingSize: '150g',
            servingOptions: ['100g', '150g', '200g'],
            unit: 'g'
        },
        { 
            name: 'Avocado', 
            category: 'fats', 
            calories: 160, 
            protein: 2, 
            carbs: 9, 
            fat: 15,
            servingSize: '1/2 medium (75g)',
            servingOptions: ['1/4 medium', '1/2 medium', '1 medium'],
            unit: 'piece'
        },
        { 
            name: 'Eggs', 
            category: 'protein', 
            calories: 78, 
            protein: 6, 
            carbs: 0.6, 
            fat: 5,
            servingSize: '1 large egg',
            servingOptions: ['1 egg', '2 eggs', '3 eggs', '4 eggs'],
            unit: 'piece'
        },
        { 
            name: 'Quinoa', 
            category: 'carbs', 
            calories: 222, 
            protein: 8, 
            carbs: 39, 
            fat: 3.6,
            servingSize: '1 cup cooked',
            servingOptions: ['0.5 cup', '1 cup', '1.5 cups'],
            unit: 'cup'
        },
        { 
            name: 'Broccoli', 
            category: 'vegetables', 
            calories: 34, 
            protein: 2.8, 
            carbs: 7, 
            fat: 0.4,
            servingSize: '1 cup chopped',
            servingOptions: ['0.5 cup', '1 cup', '1.5 cups', '2 cups'],
            unit: 'cup'
        },
        { 
            name: 'Almonds', 
            category: 'fats', 
            calories: 579, 
            protein: 21, 
            carbs: 22, 
            fat: 50,
            servingSize: '100g',
            servingOptions: ['15g (handful)', '30g (small portion)', '50g', '100g'],
            unit: 'g'
        },
        { 
            name: 'Turkey Breast', 
            category: 'protein', 
            calories: 135, 
            protein: 25, 
            carbs: 0, 
            fat: 3,
            servingSize: '100g',
            servingOptions: ['50g', '100g', '150g'],
            unit: 'g'
        },
        { 
            name: 'Spinach', 
            category: 'vegetables', 
            calories: 23, 
            protein: 2.9, 
            carbs: 3.6, 
            fat: 0.4,
            servingSize: '1 cup fresh',
            servingOptions: ['1 cup', '2 cups', '3 cups'],
            unit: 'cup'
        },
        { 
            name: 'Oats', 
            category: 'carbs', 
            calories: 389, 
            protein: 16.9, 
            carbs: 66.3, 
            fat: 6.9,
            servingSize: '100g dry',
            servingOptions: ['40g (1/2 cup)', '50g', '80g (1 cup)'],
            unit: 'g'
        },
        { 
            name: 'Tuna', 
            category: 'protein', 
            calories: 144, 
            protein: 30, 
            carbs: 0, 
            fat: 1,
            servingSize: '100g',
            servingOptions: ['85g (1 can)', '100g', '150g'],
            unit: 'g'
        },
        { 
            name: 'Apple', 
            category: 'fruits', 
            calories: 52, 
            protein: 0.3, 
            carbs: 14, 
            fat: 0.2,
            servingSize: '1 medium (182g)',
            servingOptions: ['1 small', '1 medium', '1 large'],
            unit: 'piece'
        },
        { 
            name: 'Banana', 
            category: 'fruits', 
            calories: 89, 
            protein: 1.1, 
            carbs: 23, 
            fat: 0.3,
            servingSize: '1 medium (118g)',
            servingOptions: ['1 small', '1 medium', '1 large'],
            unit: 'piece'
        },
        { 
            name: 'Olive Oil', 
            category: 'fats', 
            calories: 884, 
            protein: 0, 
            carbs: 0, 
            fat: 100,
            servingSize: '100ml',
            servingOptions: ['1 tsp (5ml)', '1 tbsp (15ml)', '30ml', '50ml'],
            unit: 'ml'
        },
        { 
            name: 'Carrots', 
            category: 'vegetables', 
            calories: 41, 
            protein: 0.9, 
            carbs: 10, 
            fat: 0.2,
            servingSize: '1 cup chopped',
            servingOptions: ['1/2 cup', '1 cup', '1.5 cups'],
            unit: 'cup'
        }
    ]
};

// Utility Functions for Serving Calculations
function calculateMacrosForServing(food, servings = 1) {
    return {
        calories: Math.round(food.calories * servings),
        protein: Math.round(food.protein * servings * 10) / 10,
        carbs: Math.round(food.carbs * servings * 10) / 10,
        fat: Math.round(food.fat * servings * 10) / 10
    };
}

function getServingMultiplier(selectedServing, baseServing) {
    // Basic conversion logic - in a real app this would be more sophisticated
    const servingMap = {
        // Eggs
        '1 egg': 1,
        '2 eggs': 2,
        '3 eggs': 3,
        '4 eggs': 4,
        // Cups
        '0.5 cup': 0.5,
        '1 cup': 1,
        '1.5 cups': 1.5,
        '2 cups': 2,
        // Grams
        '15g (handful)': 0.15,
        '30g (small portion)': 0.3,
        '40g (1/2 cup)': 0.4,
        '50g': 0.5,
        '75g': 0.75,
        '80g (1 cup)': 0.8,
        '85g (1 can)': 0.85,
        '100g': 1,
        '125g': 1.25,
        '150g': 1.5,
        '200g': 2,
        // Pieces
        '1 small': 0.7,
        '1 medium': 1,
        '1 large': 1.3,
        '1/4 medium': 0.25,
        '1/2 medium': 0.5,
        // Volume
        '1 tsp (5ml)': 0.05,
        '1 tbsp (15ml)': 0.15,
        '30ml': 0.3,
        '50ml': 0.5
    };
    
    return servingMap[selectedServing] || 1;
}

function autoDistributeMealGoals() {
    const daily = appState.dailyGoals;
    
    // Distribution percentages
    const distribution = {
        breakfast: 0.20,
        lunch: 0.30,
        dinner: 0.35,
        snack: 0.15
    };
    
    Object.keys(distribution).forEach(mealType => {
        const percentage = distribution[mealType];
        appState.mealGoals[mealType] = {
            calories: Math.round(daily.calories * percentage),
            protein: Math.round(daily.protein * percentage),
            carbs: Math.round(daily.carbs * percentage),
            fat: Math.round(daily.fat * percentage)
        };
    });
    
    showNotification('🎯 Meal goals auto-distributed based on daily targets!', 'success');
    
    // Update any open modals
    const goalModal = document.getElementById('macro-goals-modal');
    if (goalModal && goalModal.style.display === 'flex') {
        updateMacroGoalsModal();
    }
}

function calculateMealProgress(mealType, dayMeals) {
    const meals = dayMeals.filter(meal => meal.type === mealType);
    const goals = appState.mealGoals[mealType];
    
    const totals = meals.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    const progress = {
        calories: goals.calories > 0 ? (totals.calories / goals.calories) * 100 : 0,
        protein: goals.protein > 0 ? (totals.protein / goals.protein) * 100 : 0,
        carbs: goals.carbs > 0 ? (totals.carbs / goals.carbs) * 100 : 0,
        fat: goals.fat > 0 ? (totals.fat / goals.fat) * 100 : 0
    };
    
    return { totals, progress, goals };
}

function getAdherenceColor(percentage) {
    if (percentage >= 90 && percentage <= 110) return 'var(--success)';
    if (percentage >= 80 && percentage <= 120) return 'var(--primary)';
    if (percentage >= 60 && percentage <= 140) return 'var(--warning)';
    return 'var(--danger)';
}

function calculateDayAdherence(dayMeals) {
    const daily = appState.dailyGoals;
    const totals = dayMeals.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    const adherence = {
        calories: daily.calories > 0 ? (totals.calories / daily.calories) * 100 : 0,
        protein: daily.protein > 0 ? (totals.protein / daily.protein) * 100 : 0,
        carbs: daily.carbs > 0 ? (totals.carbs / daily.carbs) * 100 : 0,
        fat: daily.fat > 0 ? (totals.fat / daily.fat) * 100 : 0
    };
    
    // Overall adherence is average of macro adherences
    const overall = (adherence.calories + adherence.protein + adherence.carbs + adherence.fat) / 4;
    
    return { totals, adherence, overall };
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
    if (dayTitle) {
        dayTitle.textContent = appState.currentDay.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Meal Details Toggle
function toggleMealDetails(mealId) {
    const content = document.getElementById(`${mealId}-content`);
    const arrow = document.getElementById(`${mealId}-arrow`);
    
    if (content && arrow) {
        if (content.classList.contains('expanded')) {
            content.classList.remove('expanded');
            arrow.classList.remove('expanded');
        } else {
            content.classList.add('expanded');
            arrow.classList.add('expanded');
        }
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

function openMacroGoalsModal() {
    const modal = document.getElementById('macro-goals-modal');
    if (modal) {
        modal.style.display = 'flex';
        updateMacroGoalsModal();
    }
}

function updateMacroGoalsModal() {
    // Update daily goals inputs
    const dailyInputs = {
        calories: document.getElementById('daily-calories'),
        protein: document.getElementById('daily-protein'),
        carbs: document.getElementById('daily-carbs'),
        fat: document.getElementById('daily-fat')
    };
    
    Object.keys(dailyInputs).forEach(key => {
        if (dailyInputs[key]) {
            dailyInputs[key].value = appState.dailyGoals[key];
        }
    });
    
    // Update meal goals inputs
    ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
        const goals = appState.mealGoals[mealType];
        ['calories', 'protein', 'carbs', 'fat'].forEach(macro => {
            const input = document.getElementById(`${mealType}-${macro}`);
            if (input) {
                input.value = goals[macro];
            }
        });
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    showNotification('💪 EZ Trainer loaded successfully!', 'success');
    updateDayDisplay();
    generateCalendar();
    populateFoodList();
    initializeModals();
    initializeSidebar();
    
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
