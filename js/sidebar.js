// Planning Sidebar Functions
function openPlanningSidebar() {
    document.getElementById('planning-sidebar').classList.add('open');
    document.getElementById('calendar-container').classList.add('planning-mode');
    showNotification('🍽️ Meal planning sidebar opened', 'success');
}

function closePlanningSidebar() {
    document.getElementById('planning-sidebar').classList.remove('open');
    document.getElementById('calendar-container').classList.remove('planning-mode');
    showNotification('📋 Meal planning sidebar closed', 'success');
}

// Initialize sidebar content
function initializeSidebar() {
    const sidebarContent = document.querySelector('.sidebar-content');
    if (!sidebarContent) return;
    
    sidebarContent.innerHTML = `
        <!-- Food Database Section -->
        <div class="sidebar-section">
            <h4>🗄️ Food Database</h4>
            <div class="search-filters">
                <input type="text" class="search-input" placeholder="Search foods..." id="food-search" oninput="searchFoods(this.value)">
                <select class="filter-select" id="food-category" onchange="filterFoods()">
                    <option value="">All Categories</option>
                    <option value="protein">Proteins</option>
                    <option value="carbs">Carbohydrates</option>
                    <option value="fats">Fats</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                </select>
            </div>
            <div class="food-list" id="food-list">
                <!-- Food items will be populated by JavaScript -->
            </div>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button class="btn btn-small" onclick="openCreateRecipeModal()">🧾 New Recipe</button>
                <button class="btn btn-secondary btn-small" onclick="openCreateMealModal()">🍽️ New Meal</button>
                <button class="btn btn-warning btn-small" onclick="openManageMealOptionsModal()">📝 Meal Options</button>
            </div>
        </div>
        
        <!-- Current Meal Builder -->
        <div class="sidebar-section">
            <h4>🔨 Meal Builder</h4>
            <div class="form-group">
                <label>Meal Type</label>
                <select id="meal-type">
                    <option>Breakfast</option>
                    <option>Morning Snack</option>
                    <option>Lunch</option>
                    <option>Afternoon Snack</option>
                    <option>Dinner</option>
                </select>
            </div>
            <div id="current-meal-builder" style="min-height: 100px; padding: 15px; background: rgba(26, 26, 26, 0.6); border-radius: var(--radius); margin-bottom: 15px;">
                <div style="color: var(--text-secondary); font-style: italic; text-align: center;">Add foods to build meal...</div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-success btn-small" onclick="saveMealPlan()">💾 Save</button>
                <button class="btn btn-secondary btn-small" onclick="clearMealBuilder()">🗑️ Clear</button>
            </div>
        </div>
        
        <!-- Macro Targets -->
        <div class="sidebar-section">
            <h4>🎯 Daily Targets</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div class="form-group">
                    <label>Calories</label>
                    <input type="number" value="2281" id="target-calories">
                </div>
                <div class="form-group">
                    <label>Protein (g)</label>
                    <input type="number" value="139" id="target-protein">
                </div>
                <div class="form-group">
                    <label>Carbs (g)</label>
                    <input type="number" value="304" id="target-carbs">
                </div>
                <div class="form-group">
                    <label>Fat (g)</label>
                    <input type="number" value="65" id="target-fat">
                </div>
            </div>
        </div>
    `;
    
    populateFoodList();
}

// Day editing specific functions
function showAddMealToDay(day) {
    const quickAddSection = document.getElementById('quick-add-section');
    if (quickAddSection) {
        quickAddSection.style.display = 'block';
        appState.tempMeal = [];
        updateTempMealBuilder();
    }
}

function cancelAddMeal() {
    const quickAddSection = document.getElementById('quick-add-section');
    if (quickAddSection) {
        quickAddSection.style.display = 'none';
    }
    appState.tempMeal = [];
    appState.editingMealIndex = null;
    
    const nameInput = document.getElementById('new-meal-name');
    const typeSelect = document.getElementById('new-meal-type');
    const titleElement = document.getElementById('meal-action-title');
    
    if (nameInput) nameInput.value = '';
    if (typeSelect) typeSelect.value = 'breakfast';
    if (titleElement) titleElement.textContent = '🍽️ Add New Meal';
    
    // Clear search
    const searchInput = document.getElementById('food-search-edit');
    if (searchInput) searchInput.value = '';
}

function editMealInDay(day, mealIndex) {
    const meal = appState.dayMeals[day][mealIndex];
    appState.editingMealIndex = mealIndex;
    
    // Show the add meal section with current meal data
    const quickAddSection = document.getElementById('quick-add-section');
    const titleElement = document.getElementById('meal-action-title');
    const nameInput = document.getElementById('new-meal-name');
    const typeSelect = document.getElementById('new-meal-type');
    
    if (quickAddSection) quickAddSection.style.display = 'block';
    if (titleElement) titleElement.textContent = `✏️ Edit ${meal.name}`;
    if (nameInput) nameInput.value = meal.name;
    if (typeSelect) typeSelect.value = meal.type;
    
    // Load current foods into temp meal
    appState.tempMeal = meal.foods ? [...meal.foods] : [];
    updateTempMealBuilder();
    
    showNotification(`Editing ${meal.name}`, 'success');
}

function populateFoodListInEdit() {
    const foodList = document.getElementById('food-list-edit');
    if (!foodList) return;
    
    const foods = appState.foodDatabase;
    
    foodList.innerHTML = foods.map(food => `
        <div class="food-item" onclick="addFoodToTempMeal('${food.name}', ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat})">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-macros">${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F</div>
            </div>
            <button class="add-food-btn">Add</button>
        </div>
    `).join('');
}

function searchFoodsInEdit(query) {
    const categorySelect = document.getElementById('food-category-edit');
    const category = categorySelect ? categorySelect.value : '';
    let filteredFoods = appState.foodDatabase;
    
    if (query) {
        filteredFoods = filteredFoods.filter(food => 
            food.name.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    if (category) {
        filteredFoods = filteredFoods.filter(food => food.category === category);
    }
    
    const foodList = document.getElementById('food-list-edit');
    if (!foodList) return;
    
    foodList.innerHTML = filteredFoods.map(food => `
        <div class="food-item" onclick="addFoodToTempMeal('${food.name}', ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat})">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-macros">${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F</div>
            </div>
            <button class="add-food-btn">Add</button>
        </div>
    `).join('');
}

function filterFoodsInEdit() {
    const searchInput = document.getElementById('food-search-edit');
    const query = searchInput ? searchInput.value : '';
    searchFoodsInEdit(query);
}

function addFoodToTempMeal(name, calories, protein, carbs, fat) {
    if (!appState.tempMeal) appState.tempMeal = [];
    appState.tempMeal.push({ name, calories, protein, carbs, fat });
    updateTempMealBuilder();
    showNotification(`Added ${name} to meal`, 'success');
}

function updateTempMealBuilder() {
    const builder = document.getElementById('temp-meal-builder');
    if (!builder) return;
    
    if (!appState.tempMeal || appState.tempMeal.length === 0) {
        builder.innerHTML = '<div style="color: var(--text-secondary); font-style: italic; text-align: center; font-size: 12px;">Click foods above to add them here...</div>';
        return;
    }
    
    const totals = appState.tempMeal.reduce((acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    builder.innerHTML = `
        <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; font-weight: 600;">Foods in this meal:</div>
            ${appState.tempMeal.map((food, index) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border);">
                    <div style="flex: 1;">
                        <div style="color: var(--text-primary); font-size: 12px; font-weight: 500;">${food.name}</div>
                        <div style="color: var(--text-secondary); font-size: 10px;">${Math.round(food.calories)} cal • ${Math.round(food.protein)}g P • ${Math.round(food.carbs)}g C • ${Math.round(food.fat)}g F</div>
                    </div>
                    <button onclick="removeFromTempMeal(${index})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 16px; padding: 4px;">×</button>
                </div>
            `).join('')}
        </div>
        <div style="padding: 12px; background: rgba(0, 188, 212, 0.1); border-radius: 6px; color: var(--text-primary); font-size: 12px; text-align: center; border: 1px solid rgba(0, 188, 212, 0.3);">
            <strong>Meal Totals:</strong><br>
            ${Math.round(totals.calories)} cal | ${Math.round(totals.protein)}g P | ${Math.round(totals.carbs)}g C | ${Math.round(totals.fat)}g F
        </div>
    `;
}

function removeFromTempMeal(index) {
    if (appState.tempMeal) {
        appState.tempMeal.splice(index, 1);
        updateTempMealBuilder();
    }
}

function saveMealToDay(day) {
    const nameInput = document.getElementById('new-meal-name');
    const typeSelect = document.getElementById('new-meal-type');
    const mealName = nameInput ? nameInput.value : '';
    const mealType = typeSelect ? typeSelect.value : 'breakfast';
    
    if (!mealName || !appState.tempMeal || appState.tempMeal.length === 0) {
        showNotification('Please enter meal name and add foods', 'warning');
        return;
    }
    
    // Calculate totals for the meal
    const totals = appState.tempMeal.reduce((acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    const mealData = {
        type: mealType,
        name: mealName,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
        foods: [...appState.tempMeal]
    };
    
    // Initialize day meals if needed
    if (!appState.dayMeals[day]) {
        appState.dayMeals[day] = [];
    }
    
    if (appState.editingMealIndex !== null) {
        // Editing existing meal
        appState.dayMeals[day][appState.editingMealIndex] = mealData;
        showNotification(`✅ ${mealName} updated!`, 'success');
        appState.editingMealIndex = null;
    } else {
        // Adding new meal
        appState.dayMeals[day].push(mealData);
        showNotification(`✅ ${mealName} added to Day ${day}!`, 'success');
    }
    
    // Reset form
    resetMealForm();
    
    // Update displays
    updateDayEditingSidebar(day);
    generateCalendar();
}

function resetMealForm() {
    appState.tempMeal = [];
    appState.editingMealIndex = null;
    
    const nameInput = document.getElementById('new-meal-name');
    const typeSelect = document.getElementById('new-meal-type');
    const titleElement = document.getElementById('meal-action-title');
    
    if (nameInput) nameInput.value = '';
    if (typeSelect) typeSelect.value = 'breakfast';
    if (titleElement) titleElement.textContent = '🍽️ Add New Meal';
    
    cancelAddMeal();
}

function removeMealFromDay(day, mealIndex) {
    if (confirm('Remove this meal from the day?')) {
        appState.dayMeals[day].splice(mealIndex, 1);
        updateDayEditingSidebar(day);
        generateCalendar();
        showNotification('🗑️ Meal removed from day', 'success');
    }
}
