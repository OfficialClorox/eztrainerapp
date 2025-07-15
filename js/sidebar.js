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
                <select id="meal-type" onchange="updateMealBuilder()">
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
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
            <button class="btn btn-primary btn-small" onclick="openMacroGoalsModal()" style="width: 100%; margin-top: 10px;">⚙️ Manage Goals</button>
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
        populateFoodListInEdit();
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
    populateFoodListInEdit();
    
    showNotification(`Editing ${meal.name}`, 'success');
}

function populateFoodListInEdit() {
    const foodList = document.getElementById('food-list-edit');
    if (!foodList) return;
    
    const foods = appState.foodDatabase;
    
    foodList.innerHTML = foods.map(food => `
        <div class="food-item-enhanced" data-food-name="${food.name}">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-macros" id="edit-macros-${food.name.replace(/\s+/g, '-')}">${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F</div>
                <div class="food-serving-info">per ${food.servingSize}</div>
            </div>
            <div class="serving-controls">
                <div class="serving-selector">
                    <select class="serving-size-select" id="edit-serving-${food.name.replace(/\s+/g, '-')}" onchange="updateEditFoodDisplay('${food.name}')">
                        ${food.servingOptions.map(option => `
                            <option value="${option}" ${option === food.servingSize ? 'selected' : ''}>${option}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="servings-number">
                    <input type="number" value="1" min="0.25" max="10" step="0.25" 
                           class="servings-input" 
                           id="edit-servings-${food.name.replace(/\s+/g, '-')}"
                           onchange="updateEditFoodDisplay('${food.name}')"
                           onclick="this.select()">
                    <label>servings</label>
                </div>
                <button class="add-food-btn" onclick="addFoodToTempMealWithServing('${food.name}')">Add</button>
            </div>
            <div class="meal-goal-preview" id="edit-preview-${food.name.replace(/\s+/g, '-')}" style="display: none;">
                <!-- Goal progress preview will be shown here -->
            </div>
        </div>
    `).join('');
}

function updateEditFoodDisplay(foodName) {
    const food = appState.foodDatabase.find(f => f.name === foodName);
    if (!food) return;
    
    const safeName = foodName.replace(/\s+/g, '-');
    const servingSelect = document.getElementById(`edit-serving-${safeName}`);
    const servingsInput = document.getElementById(`edit-servings-${safeName}`);
    const macrosDisplay = document.getElementById(`edit-macros-${safeName}`);
    const previewDiv = document.getElementById(`edit-preview-${safeName}`);
    
    if (!servingSelect || !servingsInput || !macrosDisplay) return;
    
    const selectedServing = servingSelect.value;
    const numServings = parseFloat(servingsInput.value) || 1;
    const servingMultiplier = getServingMultiplier(selectedServing, food.servingSize);
    const totalMultiplier = servingMultiplier * numServings;
    
    const adjustedMacros = calculateMacrosForServing(food, totalMultiplier);
    
    macrosDisplay.textContent = `${adjustedMacros.calories} cal • ${adjustedMacros.protein}g P • ${adjustedMacros.carbs}g C • ${adjustedMacros.fat}g F`;
    
    // Show goal progress preview
    if (appState.editingDay && previewDiv) {
        showEditMealGoalPreview(foodName, adjustedMacros, previewDiv);
    }
}

function showEditMealGoalPreview(foodName, macros, previewDiv) {
    const currentMealType = document.getElementById('new-meal-type')?.value || 'breakfast';
    const mealGoals = appState.mealGoals[currentMealType];
    const dayMeals = appState.dayMeals[appState.editingDay] || [];
    
    // Calculate current meal progress (excluding the meal being edited if applicable)
    let currentMealMeals = dayMeals.filter(meal => meal.type === currentMealType);
    if (appState.editingMealIndex !== null) {
        currentMealMeals = currentMealMeals.filter((meal, index) => index !== appState.editingMealIndex);
    }
    
    const currentMealTotals = currentMealMeals.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // Add current temp meal totals
    const tempMealTotals = appState.tempMeal.reduce((acc, food) => ({
        calories: acc.calories + (food.calories || 0),
        protein: acc.protein + (food.protein || 0),
        carbs: acc.carbs + (food.carbs || 0),
        fat: acc.fat + (food.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // Calculate what totals would be after adding this food
    const newMealTotals = {
        calories: currentMealTotals.calories + tempMealTotals.calories + macros.calories,
        protein: currentMealTotals.protein + tempMealTotals.protein + macros.protein,
        carbs: currentMealTotals.carbs + tempMealTotals.carbs + macros.carbs,
        fat: currentMealTotals.fat + tempMealTotals.fat + macros.fat
    };
    
    // Calculate percentages
    const percentages = {
        calories: mealGoals.calories > 0 ? (newMealTotals.calories / mealGoals.calories) * 100 : 0,
        protein: mealGoals.protein > 0 ? (newMealTotals.protein / mealGoals.protein) * 100 : 0,
        carbs: mealGoals.carbs > 0 ? (newMealTotals.carbs / mealGoals.carbs) * 100 : 0,
        fat: mealGoals.fat > 0 ? (newMealTotals.fat / mealGoals.fat) * 100 : 0
    };
    
    const mealEmojis = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
    
    previewDiv.style.display = 'block';
    previewDiv.innerHTML = `
        <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 5px;">
            Adding to ${mealEmojis[currentMealType]} ${currentMealType}:
        </div>
        <div class="macro-preview-grid">
            <div class="macro-preview-item">
                <span>Cal:</span>
                <span class="macro-bar">
                    <div class="macro-fill" style="width: ${Math.min(percentages.calories, 100)}%; background: ${getAdherenceColor(percentages.calories)}"></div>
                </span>
                <span style="color: ${getAdherenceColor(percentages.calories)}">${Math.round(percentages.calories)}%</span>
            </div>
            <div class="macro-preview-item">
                <span>P:</span>
                <span class="macro-bar">
                    <div class="macro-fill" style="width: ${Math.min(percentages.protein, 100)}%; background: ${getAdherenceColor(percentages.protein)}"></div>
                </span>
                <span style="color: ${getAdherenceColor(percentages.protein)}">${Math.round(percentages.protein)}%</span>
            </div>
        </div>
    `;
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
        <div class="food-item-enhanced" data-food-name="${food.name}">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-macros" id="edit-macros-${food.name.replace(/\s+/g, '-')}">${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F</div>
                <div class="food-serving-info">per ${food.servingSize}</div>
            </div>
            <div class="serving-controls">
                <div class="serving-selector">
                    <select class="serving-size-select" id="edit-serving-${food.name.replace(/\s+/g, '-')}" onchange="updateEditFoodDisplay('${food.name}')">
                        ${food.servingOptions.map(option => `
                            <option value="${option}" ${option === food.servingSize ? 'selected' : ''}>${option}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="servings-number">
                    <input type="number" value="1" min="0.25" max="10" step="0.25" 
                           class="servings-input" 
                           id="edit-servings-${food.name.replace(/\s+/g, '-')}"
                           onchange="updateEditFoodDisplay('${food.name}')"
                           onclick="this.select()">
                    <label>servings</label>
                </div>
                <button class="add-food-btn" onclick="addFoodToTempMealWithServing('${food.name}')">Add</button>
            </div>
            <div class="meal-goal-preview" id="edit-preview-${food.name.replace(/\s+/g, '-')}" style="display: none;">
                <!-- Goal progress preview will be shown here -->
            </div>
        </div>
    `).join('');
}

function filterFoodsInEdit() {
    const searchInput = document.getElementById('food-search-edit');
    const query = searchInput ? searchInput.value : '';
    searchFoodsInEdit(query);
}

function addFoodToTempMealWithServing(foodName) {
    const food = appState.foodDatabase.find(f => f.name === foodName);
    if (!food) return;
    
    const safeName = foodName.replace(/\s+/g, '-');
    const servingSelect = document.getElementById(`edit-serving-${safeName}`);
    const servingsInput = document.getElementById(`edit-servings-${safeName}`);
    
    const selectedServing = servingSelect ? servingSelect.value : food.servingSize;
    const numServings = servingsInput ? parseFloat(servingsInput.value) || 1 : 1;
    const servingMultiplier = getServingMultiplier(selectedServing, food.servingSize);
    const totalMultiplier = servingMultiplier * numServings;
    
    const adjustedMacros = calculateMacrosForServing(food, totalMultiplier);
    
    const foodItem = {
        name: foodName,
        servings: numServings,
        servingSize: selectedServing,
        calories: adjustedMacros.calories,
        protein: adjustedMacros.protein,
        carbs: adjustedMacros.carbs,
        fat: adjustedMacros.fat,
        isRecentlyAdded: true
    };
    
    if (!appState.tempMeal) appState.tempMeal = [];
    appState.tempMeal.push(foodItem);
    updateTempMealBuilder();
    
    // Reset servings to 1 but keep serving size
    if (servingsInput) servingsInput.value = '1';
    updateEditFoodDisplay(foodName);
    
    const servingText = numServings === 1 ? selectedServing : `${numServings} × ${selectedServing}`;
    showNotification(`Added ${servingText} of ${foodName} to meal`, 'success');
    
    // Remove recently added highlighting after 3 seconds
    setTimeout(() => {
        const tempItems = appState.tempMeal;
        const recentItem = tempItems.find(item => item.name === foodName && item.isRecentlyAdded);
        if (recentItem) {
            recentItem.isRecentlyAdded = false;
            updateTempMealBuilder();
        }
    }, 3000);
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
    
    // Get current meal type for goal comparison
    const mealTypeSelect = document.getElementById('new-meal-type');
    const currentMealType = mealTypeSelect ? mealTypeSelect.value : 'breakfast';
    const mealGoals = appState.mealGoals[currentMealType];
    
    // Calculate progress percentages
    const progress = {
        calories: mealGoals.calories > 0 ? (totals.calories / mealGoals.calories) * 100 : 0,
        protein: mealGoals.protein > 0 ? (totals.protein / mealGoals.protein) * 100 : 0,
        carbs: mealGoals.carbs > 0 ? (totals.carbs / mealGoals.carbs) * 100 : 0,
        fat: mealGoals.fat > 0 ? (totals.fat / mealGoals.fat) * 100 : 0
    };
    
    builder.innerHTML = `
        <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; font-weight: 600;">Foods in this meal:</div>
            ${appState.tempMeal.map((food, index) => {
                const servingText = food.servings === 1 ? food.servingSize : `${food.servings} × ${food.servingSize}`;
                const recentClass = food.isRecentlyAdded ? 'recently-added' : '';
                return `
                    <div class="temp-meal-item ${recentClass}" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border);">
                        <div style="flex: 1;">
                            <div style="color: var(--text-primary); font-size: 12px; font-weight: 500;">${food.name}</div>
                            <div style="color: var(--text-secondary); font-size: 10px;">${servingText}</div>
                            <div style="color: var(--text-muted); font-size: 9px;">${Math.round(food.calories)} cal • ${Math.round(food.protein)}g P • ${Math.round(food.carbs)}g C • ${Math.round(food.fat)}g F</div>
                        </div>
                        <button onclick="removeFromTempMeal(${index})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 16px; padding: 4px;">×</button>
                    </div>
                `;
            }).join('')}
        </div>
        
        <!-- Meal Goals Progress -->
        <div class="meal-goals-progress" style="margin-bottom: 15px; padding: 10px; background: rgba(0, 188, 212, 0.1); border-radius: 6px; border: 1px solid rgba(0, 188, 212, 0.3);">
            <div style="font-size: 11px; color: var(--primary); font-weight: 600; margin-bottom: 6px;">
                ${currentMealType.charAt(0).toUpperCase() + currentMealType.slice(1)} Goal Progress:
            </div>
            <div class="progress-grid">
                <div class="progress-item">
                    <span style="font-size: 9px;">Cal:</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress.calories, 100)}%; background: ${getAdherenceColor(progress.calories)}"></div>
                    </div>
                    <span style="font-size: 9px; color: ${getAdherenceColor(progress.calories)}">${Math.round(progress.calories)}%</span>
                </div>
                <div class="progress-item">
                    <span style="font-size: 9px;">P:</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress.protein, 100)}%; background: ${getAdherenceColor(progress.protein)}"></div>
                    </div>
                    <span style="font-size: 9px; color: ${getAdherenceColor(progress.protein)}">${Math.round(progress.protein)}%</span>
                </div>
                <div class="progress-item">
                    <span style="font-size: 9px;">C:</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress.carbs, 100)}%; background: ${getAdherenceColor(progress.carbs)}"></div>
                    </div>
                    <span style="font-size: 9px; color: ${getAdherenceColor(progress.carbs)}">${Math.round(progress.carbs)}%</span>
                </div>
                <div class="progress-item">
                    <span style="font-size: 9px;">F:</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress.fat, 100)}%; background: ${getAdherenceColor(progress.fat)}"></div>
                    </div>
                    <span style="font-size: 9px; color: ${getAdherenceColor(progress.fat)}">${Math.round(progress.fat)}%</span>
                </div>
            </div>
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
        foods: appState.tempMeal.map(food => ({
            name: food.name,
            servings: food.servings,
            servingSize: food.servingSize,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat
        }))
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

// Enhanced day editing sidebar with goal progress
function updateDayEditingSidebar(day) {
    const sidebarContent = document.querySelector('.sidebar-content');
    const dayMeals = appState.dayMeals[day] || [];
    
    // Calculate day totals and adherence
    const { totals, adherence, overall } = calculateDayAdherence(dayMeals);
    
    // Calculate meal type progress
    const mealProgress = {};
    ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
        mealProgress[mealType] = calculateMealProgress(mealType, dayMeals);
    });
    
    sidebarContent.innerHTML = `
        <!-- Day Summary with Goals -->
        <div class="sidebar-section">
            <h4>📊 Day ${day} Summary</h4>
            
            <!-- Overall Adherence -->
            <div style="background: linear-gradient(135deg, rgba(0, 188, 212, 0.1), rgba(0, 188, 212, 0.05)); padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid rgba(0, 188, 212, 0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: 600; color: var(--primary);">Overall Adherence</span>
                    <span style="font-size: 18px; font-weight: 700; color: ${getAdherenceColor(overall)}">${Math.round(overall)}%</span>
                </div>
                <div class="progress-bar" style="height: 8px;">
                    <div class="progress-fill" style="width: ${Math.min(overall, 100)}%; background: ${getAdherenceColor(overall)}"></div>
                </div>
            </div>
            
            <!-- Macro Breakdown -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                <div style="background: rgba(0, 188, 212, 0.1); padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: var(--text-primary);">${Math.round(totals.calories)}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">/ ${appState.dailyGoals.calories} cal</div>
                    <div style="font-size: 10px; color: ${getAdherenceColor(adherence.calories)}">${Math.round(adherence.calories)}%</div>
                </div>
                <div style="background: rgba(76, 175, 80, 0.1); padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: var(--text-primary);">${Math.round(totals.protein)}g</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">/ ${appState.dailyGoals.protein}g</div>
                    <div style="font-size: 10px; color: ${getAdherenceColor(adherence.protein)}">${Math.round(adherence.protein)}%</div>
                </div>
                <div style="background: rgba(255, 152, 0, 0.1); padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: var(--text-primary);">${Math.round(totals.carbs)}g</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">/ ${appState.dailyGoals.carbs}g</div>
                    <div style="font-size: 10px; color: ${getAdherenceColor(adherence.carbs)}">${Math.round(adherence.carbs)}%</div>
                </div>
                <div style="background: rgba(255, 193, 7, 0.1); padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: var(--text-primary);">${Math.round(totals.fat)}g</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">/ ${appState.dailyGoals.fat}g</div>
                    <div style="font-size: 10px; color: ${getAdherenceColor(adherence.fat)}">${Math.round(adherence.fat)}%</div>
                </div>
            </div>
        </div>

        <!-- Meal Progress Overview -->
        <div class="sidebar-section">
            <h4>🍽️ Meal Progress</h4>
            <div style="margin-bottom: 15px;">
                ${['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                    const mealEmojis = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
                    const progress = mealProgress[mealType];
                    const avgProgress = (progress.progress.calories + progress.progress.protein + progress.progress.carbs + progress.progress.fat) / 4;
                    return `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border);">
                            <span style="font-size: 12px; color: var(--text-primary);">
                                ${mealEmojis[mealType]} ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                            </span>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div class="progress-bar" style="width: 60px; height: 6px;">
                                    <div class="progress-fill" style="width: ${Math.min(avgProgress, 100)}%; background: ${getAdherenceColor(avgProgress)}"></div>
                                </div>
                                <span style="font-size: 10px; color: ${getAdherenceColor(avgProgress)}; min-width: 30px;">${Math.round(avgProgress)}%</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <!-- Current Meals -->
        <div class="sidebar-section">
            <h4>🍽️ Current Meals</h4>
            <div id="day-meals-list" style="max-height: 200px; overflow-y: auto; border: 1px solid var(--border); border-radius: var(--radius); background: rgba(26, 26, 26, 0.6);">
                ${dayMeals.length > 0 ? dayMeals.map((meal, index) => {
                    const mealEmojis = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
                    return `
                        <div class="meal-item-edit" style="padding: 12px 15px; border-bottom: 1px solid var(--border);">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                                        ${mealEmojis[meal.type] || '🍽️'} ${meal.name}
                                    </div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">
                                        ${Math.round(meal.calories)} cal • ${Math.round(meal.protein)}g P • ${Math.round(meal.carbs)}g C • ${Math.round(meal.fat)}g F
                                    </div>
                                </div>
                                <div style="display: flex; gap: 5px;">
                                    <button onclick="editMealInDay(${day}, ${index})" style="background: var(--primary); color: var(--text-on-primary); border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">Edit</button>
                                    <button onclick="removeMealFromDay(${day}, ${index})" style="background: var(--danger); color: var(--text-primary); border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">Remove</button>
                                </div>
                            </div>
                            ${meal.foods ? `
                                <div style="margin-left: 10px; padding-left: 10px; border-left: 2px solid var(--border);">
                                    <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 5px;">Foods:</div>
                                    ${meal.foods.map(food => {
                                        const servingText = food.servings === 1 ? food.servingSize : `${food.servings} × ${food.servingSize}`;
                                        return `
                                            <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 2px;">
                                                • ${servingText} ${food.name} (${Math.round(food.calories)} cal)
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('') : '<div style="padding: 20px; text-align: center; color: var(--text-muted); font-style: italic;">No meals added yet</div>'}
            </div>
            <button class="btn btn-small" onclick="showAddMealToDay(${day})" style="width: 100%; margin-top: 10px;">➕ Add New Meal</button>
        </div>

        <!-- Add Meal Section (Hidden by default) -->
        <div class="sidebar-section" id="quick-add-section" style="display: none;">
            <h4 id="meal-action-title">🍽️ Add New Meal</h4>
            
            <!-- Meal Details Form -->
            <div class="form-group">
                <label>Meal Name</label>
                <input type="text" id="new-meal-name" placeholder="e.g., Power Breakfast">
            </div>
            <div class="form-group">
                <label>Meal Type</label>
                <select id="new-meal-type" onchange="updateTempMealBuilder()">
                    <option value="breakfast">🌅 Breakfast</option>
                    <option value="lunch">☀️ Lunch</option>
                    <option value="dinner">🌙 Dinner</option>
                    <option value="snack">🍎 Snack</option>
                </select>
            </div>
            
            <!-- Current Meal Builder -->
            <div class="form-group">
                <label>Foods in this meal</label>
                <div id="temp-meal-builder" style="min-height: 80px; padding: 10px; background: rgba(26, 26, 26, 0.6); border-radius: var(--radius); margin-bottom: 15px; border: 1px solid var(--border);">
                    <div style="color: var(--text-secondary); font-style: italic; text-align: center; font-size: 12px;">Click foods below to add them here...</div>
                </div>
            </div>
            
            <!-- Food Database for Adding -->
            <div class="form-group">
                <label>Add Foods</label>
                <div class="search-filters">
                    <input type="text" class="search-input" placeholder="Search foods..." id="food-search-edit" oninput="searchFoodsInEdit(this.value)">
                    <select class="filter-select" id="food-category-edit" onchange="filterFoodsInEdit()">
                        <option value="">All Categories</option>
                        <option value="protein">Proteins</option>
                        <option value="carbs">Carbohydrates</option>
                        <option value="fats">Fats</option>
                        <option value="vegetables">Vegetables</option>
                        <option value="fruits">Fruits</option>
                    </select>
                </div>
                <div class="food-list" id="food-list-edit" style="max-height: 180px;">
                    <!-- Food items will be populated -->
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="btn btn-success btn-small" onclick="saveMealToDay(${day})" style="flex: 1;">💾 Save Meal</button>
                <button class="btn btn-secondary btn-small" onclick="cancelAddMeal()">Cancel</button>
            </div>
        </div>

        <!-- Back to Planning -->
        <div class="sidebar-section">
            <button class="btn btn-secondary" onclick="backToPlanning()" style="width: 100%;">🔙 Back to Planning Mode</button>
        </div>
    `;
}

function backToPlanning() {
    appState.editingDay = null;
    appState.editingMealIndex = null;
    appState.tempMeal = [];
    
    const sidebarTitle = document.querySelector('.sidebar-title');
    if (sidebarTitle) {
        sidebarTitle.innerHTML = '🍽️ Meal Planning';
    }
    
    // Restore original sidebar content by calling the sidebar initialization
    initializeSidebar();
}
