// Food Database Functions with Progress Tracking
function populateFoodList() {
    const foodList = document.getElementById('food-list');
    if (!foodList) return;
    
    const foods = appState.foodDatabase;
    
    foodList.innerHTML = foods.map((food, index) => `
        <div class="food-item-enhanced" data-food-index="${index}">
            <div class="food-header">
                <div class="food-info">
                    <div class="food-name">${food.name}</div>
                    <div class="food-macros">Base: ${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F (per 100g)</div>
                </div>
            </div>
            <div class="serving-controls">
                <div class="serving-inputs">
                    <div class="serving-input-group">
                        <label>Serving Size:</label>
                        <input type="number" 
                               class="serving-size-input" 
                               value="100" 
                               min="1" 
                               data-food-index="${index}"
                               onchange="updateFoodCalculation(${index})">
                        <select class="serving-unit-select" data-food-index="${index}" onchange="updateFoodCalculation(${index})">
                            <option value="g">g</option>
                            <option value="oz">oz</option>
                            <option value="cup">cup</option>
                            <option value="piece">piece</option>
                        </select>
                    </div>
                    <div class="serving-input-group">
                        <label>Servings:</label>
                        <input type="number" 
                               class="servings-count-input" 
                               value="1" 
                               min="0.1" 
                               step="0.1" 
                               data-food-index="${index}"
                               onchange="updateFoodCalculation(${index})">
                    </div>
                </div>
                <div class="calculated-macros" id="calculated-macros-${index}">
                    = ${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F
                </div>
                <div class="macro-progress-preview" id="macro-progress-${index}">
                    <!-- Progress indicators will be shown here -->
                </div>
            </div>
            <button class="add-food-btn" onclick="addFoodToPlanWithServings(${index})">Add to Meal</button>
        </div>
    `).join('');
}

function updateFoodCalculation(foodIndex) {
    const food = appState.foodDatabase[foodIndex];
    const servingSizeInput = document.querySelector(`input.serving-size-input[data-food-index="${foodIndex}"]`);
    const servingUnitSelect = document.querySelector(`select.serving-unit-select[data-food-index="${foodIndex}"]`);
    const servingsCountInput = document.querySelector(`input.servings-count-input[data-food-index="${foodIndex}"]`);
    const calculatedMacrosDiv = document.getElementById(`calculated-macros-${foodIndex}`);
    const progressDiv = document.getElementById(`macro-progress-${foodIndex}`);
    
    if (!servingSizeInput || !servingsCountInput || !calculatedMacrosDiv) return;
    
    const servingSize = parseFloat(servingSizeInput.value) || 100;
    const servingUnit = servingUnitSelect.value;
    const servingsCount = parseFloat(servingsCountInput.value) || 1;
    
    // Convert serving size to grams if needed
    let servingSizeInGrams = servingSize;
    switch (servingUnit) {
        case 'oz':
            servingSizeInGrams = servingSize * 28.35;
            break;
        case 'cup':
            servingSizeInGrams = servingSize * 240; // Approximate, varies by food
            break;
        case 'piece':
            servingSizeInGrams = servingSize * 100; // Assume 100g per piece as default
            break;
        // 'g' stays as is
    }
    
    // Calculate multiplier based on serving size (food database is per 100g)
    const multiplier = (servingSizeInGrams / 100) * servingsCount;
    
    const calculatedCalories = Math.round(food.calories * multiplier);
    const calculatedProtein = Math.round(food.protein * multiplier * 10) / 10;
    const calculatedCarbs = Math.round(food.carbs * multiplier * 10) / 10;
    const calculatedFat = Math.round(food.fat * multiplier * 10) / 10;
    
    calculatedMacrosDiv.innerHTML = `= ${calculatedCalories} cal • ${calculatedProtein}g P • ${calculatedCarbs}g C • ${calculatedFat}g F`;
    
    // Store calculated values for easy access
    calculatedMacrosDiv.dataset.calories = calculatedCalories;
    calculatedMacrosDiv.dataset.protein = calculatedProtein;
    calculatedMacrosDiv.dataset.carbs = calculatedCarbs;
    calculatedMacrosDiv.dataset.fat = calculatedFat;
    calculatedMacrosDiv.dataset.servingSize = servingSize;
    calculatedMacrosDiv.dataset.servingUnit = servingUnit;
    calculatedMacrosDiv.dataset.servingsCount = servingsCount;
    
    // Update progress preview
    updateMacroProgressPreview(foodIndex, {
        calories: calculatedCalories,
        protein: calculatedProtein,
        carbs: calculatedCarbs,
        fat: calculatedFat
    });
}

function updateMacroProgressPreview(foodIndex, foodMacros) {
    const progressDiv = document.getElementById(`macro-progress-${foodIndex}`);
    if (!progressDiv) return;
    
    // Get current meal type from the meal builder
    const mealTypeSelect = document.getElementById('meal-type');
    const currentMealType = mealTypeSelect ? mealTypeSelect.value.toLowerCase().replace(' ', '') : 'breakfast';
    
    // Get current totals
    const currentMealTotals = getCurrentMealTotals();
    const currentDayTotals = getDayTotals(12); // Using day 12 as current day for demo
    
    // Calculate what totals would be after adding this food
    const newMealTotals = {
        calories: currentMealTotals.calories + foodMacros.calories,
        protein: currentMealTotals.protein + foodMacros.protein,
        carbs: currentMealTotals.carbs + foodMacros.carbs,
        fat: currentMealTotals.fat + foodMacros.fat
    };
    
    const newDayTotals = {
        calories: currentDayTotals.calories + foodMacros.calories,
        protein: currentDayTotals.protein + foodMacros.protein,
        carbs: currentDayTotals.carbs + foodMacros.carbs,
        fat: currentDayTotals.fat + foodMacros.fat
    };
    
    // Get goals
    const mealGoals = appState.mealGoals[currentMealType] || appState.mealGoals.breakfast;
    const dayGoals = appState.dailyGoals;
    
    progressDiv.innerHTML = `
        <div class="progress-section">
            <div class="progress-header">🍽️ Meal Impact (${currentMealType.charAt(0).toUpperCase() + currentMealType.slice(1)})</div>
            <div class="progress-bars">
                ${createProgressBar('Calories', currentMealTotals.calories, newMealTotals.calories, mealGoals.calories, 'cal')}
                ${createProgressBar('Protein', currentMealTotals.protein, newMealTotals.protein, mealGoals.protein, 'g')}
                ${createProgressBar('Carbs', currentMealTotals.carbs, newMealTotals.carbs, mealGoals.carbs, 'g')}
                ${createProgressBar('Fat', currentMealTotals.fat, newMealTotals.fat, mealGoals.fat, 'g')}
            </div>
        </div>
        <div class="progress-section">
            <div class="progress-header">📅 Day Impact</div>
            <div class="progress-bars">
                ${createProgressBar('Calories', currentDayTotals.calories, newDayTotals.calories, dayGoals.calories, 'cal')}
                ${createProgressBar('Protein', currentDayTotals.protein, newDayTotals.protein, dayGoals.protein, 'g')}
                ${createProgressBar('Carbs', currentDayTotals.carbs, newDayTotals.carbs, dayGoals.carbs, 'g')}
                ${createProgressBar('Fat', currentDayTotals.fat, newDayTotals.fat, dayGoals.fat, 'g')}
            </div>
        </div>
    `;
}

function createProgressBar(label, current, newValue, goal, unit) {
    const currentPercent = Math.min((current / goal) * 100, 100);
    const newPercent = Math.min((newValue / goal) * 100, 100);
    const addPercent = Math.min(((newValue - current) / goal) * 100, 100 - currentPercent);
    
    const currentColor = getProgressColor(current, goal);
    const newColor = getProgressColor(newValue, goal);
    
    return `
        <div class="progress-bar-container">
            <div class="progress-bar-label">
                <span>${label}</span>
                <span class="progress-values">
                    <span style="color: ${currentColor}">${formatMacroValue(current, unit)}</span>
                    <span style="color: var(--text-secondary)">→</span>
                    <span style="color: ${newColor}">${formatMacroValue(newValue, unit)}</span>
                    <span style="color: var(--text-muted)">/ ${goal}${unit}</span>
                </span>
            </div>
            <div class="progress-bar">
                <div class="progress-bar-bg"></div>
                <div class="progress-bar-current" style="width: ${currentPercent}%; background: ${currentColor};"></div>
                <div class="progress-bar-add" style="left: ${currentPercent}%; width: ${addPercent}%; background: linear-gradient(90deg, ${currentColor}80, ${newColor});"></div>
            </div>
        </div>
    `;
}

function addFoodToPlanWithServings(foodIndex) {
    const food = appState.foodDatabase[foodIndex];
    const calculatedMacrosDiv = document.getElementById(`calculated-macros-${foodIndex}`);
    
    if (!calculatedMacrosDiv) return;
    
    const calculatedFood = {
        name: food.name,
        calories: parseFloat(calculatedMacrosDiv.dataset.calories) || food.calories,
        protein: parseFloat(calculatedMacrosDiv.dataset.protein) || food.protein,
        carbs: parseFloat(calculatedMacrosDiv.dataset.carbs) || food.carbs,
        fat: parseFloat(calculatedMacrosDiv.dataset.fat) || food.fat,
        servingSize: parseFloat(calculatedMacrosDiv.dataset.servingSize) || 100,
        servingUnit: calculatedMacrosDiv.dataset.servingUnit || 'g',
        servingsCount: parseFloat(calculatedMacrosDiv.dataset.servingsCount) || 1,
        displayName: `${food.name} (${calculatedMacrosDiv.dataset.servingsCount || 1} × ${calculatedMacrosDiv.dataset.servingSize || 100}${calculatedMacrosDiv.dataset.servingUnit || 'g'})`
    };
    
    appState.currentMeal.push(calculatedFood);
    updateMealBuilder();
    
    // Add visual feedback
    const foodElement = document.querySelector(`[data-food-index="${foodIndex}"]`);
    if (foodElement) {
        foodElement.classList.add('recently-added');
        setTimeout(() => {
            foodElement.classList.remove('recently-added');
        }, 1000);
    }
    
    showNotification(`Added ${calculatedFood.displayName} to meal builder`, 'success');
    
    // Update all progress previews
    updateAllProgressPreviews();
}

function updateAllProgressPreviews() {
    appState.foodDatabase.forEach((food, index) => {
        updateFoodCalculation(index);
    });
}

function searchFoods(query) {
    const categorySelect = document.getElementById('food-category');
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
    
    // Update the appState.foodDatabase temporarily for populateFoodList
    const originalDatabase = appState.foodDatabase;
    appState.foodDatabase = filteredFoods;
    populateFoodList();
    appState.foodDatabase = originalDatabase;
}

function filterFoods() {
    const searchInput = document.getElementById('food-search');
    const query = searchInput ? searchInput.value : '';
    searchFoods(query);
}

// Keep existing addFoodToPlan for backwards compatibility but mark as deprecated
function addFoodToPlan(name, calories, protein, carbs, fat) {
    appState.currentMeal.push({ name, calories, protein, carbs, fat });
    updateMealBuilder();
    showNotification(`Added ${name} to meal builder`, 'success');
    updateAllProgressPreviews();
}

function updateMealBuilder() {
    const builder = document.getElementById('current-meal-builder');
    if (!builder) return;
    
    if (appState.currentMeal.length === 0) {
        builder.innerHTML = '<div style="color: var(--text-secondary); font-style: italic; text-align: center;">Add foods to build meal...</div>';
        return;
    }
    
    const totals = appState.currentMeal.reduce((acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // Get current meal type and goals
    const mealTypeSelect = document.getElementById('meal-type');
    const currentMealType = mealTypeSelect ? mealTypeSelect.value.toLowerCase().replace(' ', '') : 'breakfast';
    const mealGoals = appState.mealGoals[currentMealType] || appState.mealGoals.breakfast;
    
    builder.innerHTML = `
        <!-- Meal Progress Summary -->
        <div class="meal-progress-summary">
            <div class="meal-progress-header">
                <h4>🎯 ${currentMealType.charAt(0).toUpperCase() + currentMealType.slice(1)} Progress</h4>
            </div>
            <div class="meal-progress-grid">
                <div class="meal-macro-item">
                    <div class="meal-macro-value" style="color: ${getProgressColor(totals.calories, mealGoals.calories)}">
                        ${Math.round(totals.calories)}
                    </div>
                    <div class="meal-macro-goal">/ ${mealGoals.calories} cal</div>
                    <div class="meal-macro-bar">
                        <div class="meal-macro-fill" style="width: ${Math.min((totals.calories / mealGoals.calories) * 100, 100)}%; background: ${getProgressColor(totals.calories, mealGoals.calories)};"></div>
                    </div>
                </div>
                <div class="meal-macro-item">
                    <div class="meal-macro-value" style="color: ${getProgressColor(totals.protein, mealGoals.protein)}">
                        ${formatMacroValue(totals.protein)}g
                    </div>
                    <div class="meal-macro-goal">/ ${mealGoals.protein}g P</div>
                    <div class="meal-macro-bar">
                        <div class="meal-macro-fill" style="width: ${Math.min((totals.protein / mealGoals.protein) * 100, 100)}%; background: ${getProgressColor(totals.protein, mealGoals.protein)};"></div>
                    </div>
                </div>
                <div class="meal-macro-item">
                    <div class="meal-macro-value" style="color: ${getProgressColor(totals.carbs, mealGoals.carbs)}">
                        ${formatMacroValue(totals.carbs)}g
                    </div>
                    <div class="meal-macro-goal">/ ${mealGoals.carbs}g C</div>
                    <div class="meal-macro-bar">
                        <div class="meal-macro-fill" style="width: ${Math.min((totals.carbs / mealGoals.carbs) * 100, 100)}%; background: ${getProgressColor(totals.carbs, mealGoals.carbs)};"></div>
                    </div>
                </div>
                <div class="meal-macro-item">
                    <div class="meal-macro-value" style="color: ${getProgressColor(totals.fat, mealGoals.fat)}">
                        ${formatMacroValue(totals.fat)}g
                    </div>
                    <div class="meal-macro-goal">/ ${mealGoals.fat}g F</div>
                    <div class="meal-macro-bar">
                        <div class="meal-macro-fill" style="width: ${Math.min((totals.fat / mealGoals.fat) * 100, 100)}%; background: ${getProgressColor(totals.fat, mealGoals.fat)};"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Food List -->
        <div class="meal-foods-list">
            <h5 style="color: var(--text-secondary); margin-bottom: 10px; font-size: 12px;">Foods in this meal:</h5>
            ${appState.currentMeal.map((food, index) => `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid var(--border);">
                    <div style="flex: 1;">
                        <div style="color: var(--text-primary); font-weight: 500; font-size: 13px;">${food.displayName || food.name}</div>
                        <div style="color: var(--text-secondary); font-size: 11px;">${Math.round(food.calories)} cal • ${Math.round(food.protein * 10) / 10}g P • ${Math.round(food.carbs * 10) / 10}g C • ${Math.round(food.fat * 10) / 10}g F</div>
                    </div>
                    <button onclick="removeFromMealBuilder(${index})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 16px; padding: 4px;">×</button>
                </div>
            `).join('')}
        </div>
    `;
}

function removeFromMealBuilder(index) {
    appState.currentMeal.splice(index, 1);
    updateMealBuilder();
    updateAllProgressPreviews();
}

function clearMealBuilder() {
    appState.currentMeal = [];
    updateMealBuilder();
    updateAllProgressPreviews();
    showNotification('🗑️ Meal builder cleared', 'success');
}

function saveMealPlan() {
    if (appState.currentMeal.length === 0) {
        showNotification('Please add foods to the meal first', 'warning');
        return;
    }
    
    const mealTypeSelect = document.getElementById('meal-type');
    const mealType = mealTypeSelect ? mealTypeSelect.value : 'Breakfast';
    showNotification(`💾 ${mealType} plan saved successfully!`, 'success');
    clearMealBuilder();
}

// Initialize food calculations when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculations for all food items
    setTimeout(() => {
        appState.foodDatabase.forEach((food, index) => {
            updateFoodCalculation(index);
        });
    }, 100);
});

// Meal Options Functions
function openMealOptionsModal() {
    const modal = document.getElementById('meal-options-modal');
    if (modal) {
        modal.style.display = 'flex';
        updateMealOptionsList();
    }
}

function updateMealOptionsList() {
    const mealTypeSelect = document.getElementById('meal-option-type');
    const mealType = mealTypeSelect ? mealTypeSelect.value : 'breakfast';
    const mealOptions = appState.mealOptions[mealType] || [];
    const list = document.getElementById('meal-options-list');
    
    if (!list) return;
    
    list.innerHTML = mealOptions.map((option, index) => `
        <div style="background: rgba(26, 26, 26, 0.6); border-radius: var(--radius); padding: 20px; margin-bottom: 15px; border: 1px solid var(--border); cursor: pointer; transition: var(--transition);" 
             onclick="selectMealOption('${mealType}', ${index})"
             onmouseover="this.style.borderColor='var(--primary)'"
             onmouseout="this.style.borderColor='var(--border)'">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <h4 style="color: var(--text-primary); margin: 0; font-size: 16px;">${option.name}</h4>
                <div style="text-align: right;">
                    <div style="color: var(--primary); font-weight: 600; font-size: 14px;">${option.calories} cal</div>
                    <div style="color: var(--text-secondary); font-size: 12px;">${option.protein}g P • ${option.carbs}g C • ${option.fat}g F</div>
                </div>
            </div>
            <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 10px;">
                <strong>Foods:</strong> ${option.foods.join(', ')}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="color: var(--text-muted); font-size: 11px;">Created by trainer</div>
                <button class="btn btn-success btn-small" onclick="event.stopPropagation(); selectMealOption('${mealType}', ${index})">✓ Select This Meal</button>
            </div>
        </div>
    `).join('');
    
    if (mealOptions.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px; font-style: italic;">No meal options available for this meal type. Ask your trainer to create some options.</div>';
    }
}

function selectMealOption(mealType, optionIndex) {
    const selectedOption = appState.mealOptions[mealType][optionIndex];
    showNotification(`✅ Selected "${selectedOption.name}" for tracking!`, 'success');
    closeModal('meal-options-modal');
}

// Manage Meal Options Functions
function openManageMealOptionsModal() {
    const modal = document.getElementById('manage-meal-options-modal');
    if (modal) {
        modal.style.display = 'flex';
        updateManageMealOptionsList();
    }
}

function updateManageMealOptionsList() {
    const mealTypeSelect = document.getElementById('manage-meal-type');
    const mealType = mealTypeSelect ? mealTypeSelect.value : 'breakfast';
    const mealOptions = appState.mealOptions[mealType] || [];
    const list = document.getElementById('manage-meal-options-list');
    
    if (!list) return;
    
    list.innerHTML = mealOptions.map((option, index) => `
        <div style="background: rgba(26, 26, 26, 0.6); border-radius: var(--radius); padding: 15px; margin-bottom: 10px; border: 1px solid var(--border);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div style="flex: 1;">
                    <h4 style="color: var(--text-primary); margin: 0 0 5px 0; font-size: 14px;">${option.name}</h4>
                    <div style="color: var(--text-secondary); font-size: 12px;">${option.calories} cal • ${option.protein}g P • ${option.carbs}g C • ${option.fat}g F</div>
                </div>
                <div style="display: flex; gap: 5px;">
                    <button class="btn btn-secondary btn-small" onclick="editMealOption('${mealType}', ${index})" style="font-size: 11px; padding: 4px 8px;">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteMealOption('${mealType}', ${index})" style="font-size: 11px; padding: 4px 8px;">Delete</button>
                </div>
            </div>
            <div style="color: var(--text-muted); font-size: 11px;">
                <strong>Foods:</strong> ${option.foods.join(', ')}
            </div>
        </div>
    `).join('');
    
    if (mealOptions.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px; font-style: italic;">No meal options created yet. Click "Add New Option" to create your first meal option.</div>';
    }
}

function deleteMealOption(mealType, optionIndex) {
    const option = appState.mealOptions[mealType][optionIndex];
    if (confirm(`Delete "${option.name}"? This cannot be undone.`)) {
        appState.mealOptions[mealType].splice(optionIndex, 1);
        updateManageMealOptionsList();
        showNotification(`🗑️ Deleted "${option.name}"`, 'success');
    }
}

function editMealOption(mealType, optionIndex) {
    const option = appState.mealOptions[mealType][optionIndex];
    showNotification(`✏️ Editing "${option.name}" (feature coming soon)`, 'warning');
}

function importMealOptions() {
    showNotification('📥 Meal options import feature coming soon!', 'warning');
}

// Create Meal Option Functions
function openCreateMealOptionModal() {
    const modal = document.getElementById('create-meal-option-modal');
    if (modal) {
        modal.style.display = 'flex';
        appState.currentMealOption = [];
        updateMealOptionBuilder();
        populateMealOptionFoodList();
    }
}

function populateMealOptionFoodList() {
    const foodList = document.getElementById('meal-option-food-list');
    if (!foodList) return;
    
    const foods = appState.foodDatabase;
    
    foodList.innerHTML = foods.map((food, index) => `
        <div class="food-item-enhanced" data-food-index="${index}">
            <div class="food-header">
                <div class="food-info">
                    <div class="food-name">${food.name}</div>
                    <div class="food-macros">Base: ${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F (per 100g)</div>
                </div>
            </div>
            <div class="serving-controls">
                <div class="serving-inputs">
                    <div class="serving-input-group">
                        <label>Serving Size:</label>
                        <input type="number" 
                               class="serving-size-input" 
                               value="100" 
                               min="1" 
                               data-food-index="${index}"
                               onchange="updateMealOptionFoodCalculation(${index})">
                        <select class="serving-unit-select" data-food-index="${index}" onchange="updateMealOptionFoodCalculation(${index})">
                            <option value="g">g</option>
                            <option value="oz">oz</option>
                            <option value="cup">cup</option>
                            <option value="piece">piece</option>
                        </select>
                    </div>
                    <div class="serving-input-group">
                        <label>Servings:</label>
                        <input type="number" 
                               class="servings-count-input" 
                               value="1" 
                               min="0.1" 
                               step="0.1" 
                               data-food-index="${index}"
                               onchange="updateMealOptionFoodCalculation(${index})">
                    </div>
                </div>
                <div class="calculated-macros" id="meal-option-calculated-macros-${index}">
                    = ${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F
                </div>
            </div>
            <button class="add-food-btn" onclick="addFoodToMealOptionWithServings(${index})">Add</button>
        </div>
    `).join('');
}

function updateMealOptionFoodCalculation(foodIndex) {
    const food = appState.foodDatabase[foodIndex];
    const servingSizeInput = document.querySelector(`#meal-option-food-list input.serving-size-input[data-food-index="${foodIndex}"]`);
    const servingUnitSelect = document.querySelector(`#meal-option-food-list select.serving-unit-select[data-food-index="${foodIndex}"]`);
    const servingsCountInput = document.querySelector(`#meal-option-food-list input.servings-count-input[data-food-index="${foodIndex}"]`);
    const calculatedMacrosDiv = document.getElementById(`meal-option-calculated-macros-${foodIndex}`);
    
    if (!servingSizeInput || !servingsCountInput || !calculatedMacrosDiv) return;
    
    const servingSize = parseFloat(servingSizeInput.value) || 100;
    const servingUnit = servingUnitSelect.value;
    const servingsCount = parseFloat(servingsCountInput.value) || 1;
    
    // Convert serving size to grams if needed
    let servingSizeInGrams = servingSize;
    switch (servingUnit) {
        case 'oz':
            servingSizeInGrams = servingSize * 28.35;
            break;
        case 'cup':
            servingSizeInGrams = servingSize * 240;
            break;
        case 'piece':
            servingSizeInGrams = servingSize * 100;
            break;
    }
    
    // Calculate multiplier based on serving size (food database is per 100g)
    const multiplier = (servingSizeInGrams / 100) * servingsCount;
    
    const calculatedCalories = Math.round(food.calories * multiplier);
    const calculatedProtein = Math.round(food.protein * multiplier * 10) / 10;
    const calculatedCarbs = Math.round(food.carbs * multiplier * 10) / 10;
    const calculatedFat = Math.round(food.fat * multiplier * 10) / 10;
    
    calculatedMacrosDiv.innerHTML = `= ${calculatedCalories} cal • ${calculatedProtein}g P • ${calculatedCarbs}g C • ${calculatedFat}g F`;
    
    // Store calculated values for easy access
    calculatedMacrosDiv.dataset.calories = calculatedCalories;
    calculatedMacrosDiv.dataset.protein = calculatedProtein;
    calculatedMacrosDiv.dataset.carbs = calculatedCarbs;
    calculatedMacrosDiv.dataset.fat = calculatedFat;
    calculatedMacrosDiv.dataset.servingSize = servingSize;
    calculatedMacrosDiv.dataset.servingUnit = servingUnit;
    calculatedMacrosDiv.dataset.servingsCount = servingsCount;
}

function addFoodToMealOptionWithServings(foodIndex) {
    const food = appState.foodDatabase[foodIndex];
    const calculatedMacrosDiv = document.getElementById(`meal-option-calculated-macros-${foodIndex}`);
    
    if (!calculatedMacrosDiv) return;
    
    const calculatedFood = {
        name: food.name,
        calories: parseFloat(calculatedMacrosDiv.dataset.calories) || food.calories,
        protein: parseFloat(calculatedMacrosDiv.dataset.protein) || food.protein,
        carbs: parseFloat(calculatedMacrosDiv.dataset.carbs) || food.carbs,
        fat: parseFloat(calculatedMacrosDiv.dataset.fat) || food.fat,
        servingSize: parseFloat(calculatedMacrosDiv.dataset.servingSize) || 100,
        servingUnit: calculatedMacrosDiv.dataset.servingUnit || 'g',
        servingsCount: parseFloat(calculatedMacrosDiv.dataset.servingsCount) || 1,
        displayName: `${food.name} (${calculatedMacrosDiv.dataset.servingsCount || 1} × ${calculatedMacrosDiv.dataset.servingSize || 100}${calculatedMacrosDiv.dataset.servingUnit || 'g'})`
    };
    
    if (!appState.currentMealOption) appState.currentMealOption = [];
    appState.currentMealOption.push(calculatedFood);
    updateMealOptionBuilder();
    showNotification(`Added ${calculatedFood.displayName} to meal option`, 'success');
}

function searchMealOptionFoods(query) {
    const categorySelect = document.getElementById('meal-option-food-category');
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
    
    const originalDatabase = appState.foodDatabase;
    appState.foodDatabase = filteredFoods;
    populateMealOptionFoodList();
    appState.foodDatabase = originalDatabase;
}

function filterMealOptionFoods() {
    const searchInput = document.getElementById('meal-option-food-search');
    const query = searchInput ? searchInput.value : '';
    searchMealOptionFoods(query);
}

function addFoodToMealOption(name, calories, protein, carbs, fat) {
    if (!appState.currentMealOption) appState.currentMealOption = [];
    appState.currentMealOption.push({ name, calories, protein, carbs, fat });
    updateMealOptionBuilder();
    showNotification(`Added ${name} to meal option`, 'success');
}

function updateMealOptionBuilder() {
    const builder = document.getElementById('meal-option-foods');
    if (!builder) return;
    
    if (!appState.currentMealOption || appState.currentMealOption.length === 0) {
        builder.innerHTML = '<div style="color: var(--text-secondary); font-style: italic; text-align: center;">Add foods from the database below...</div>';
        return;
    }
    
    const totals = appState.currentMealOption.reduce((acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    builder.innerHTML = `
        <div style="margin-bottom: 15px;">
            ${appState.currentMealOption.map((food, index) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border);">
                    <div style="flex: 1;">
                        <div style="color: var(--text-primary); font-weight: 500; font-size: 13px;">${food.displayName || food.name}</div>
                        <div style="color: var(--text-secondary); font-size: 11px;">${Math.round(food.calories)} cal • ${Math.round(food.protein * 10) / 10}g P • ${Math.round(food.carbs * 10) / 10}g C • ${Math.round(food.fat * 10) / 10}g F</div>
                    </div>
                    <button onclick="removeFromMealOption(${index})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 16px; padding: 4px;">×</button>
                </div>
            `).join('')}
        </div>
        <div style="padding: 12px; background: rgba(0, 188, 212, 0.1); border-radius: 6px; color: var(--text-primary); font-size: 12px; text-align: center; border: 1px solid rgba(0, 188, 212, 0.3);">
            <strong>Total:</strong> ${Math.round(totals.calories)} cal | ${Math.round(totals.protein * 10) / 10}g P | ${Math.round(totals.carbs * 10) / 10}g C | ${Math.round(totals.fat * 10) / 10}g F
        </div>
    `;
}

function removeFromMealOption(index) {
    if (appState.currentMealOption) {
        appState.currentMealOption.splice(index, 1);
        updateMealOptionBuilder();
    }
}

function saveMealOption() {
    const nameInput = document.getElementById('new-meal-option-name');
    const typeSelect = document.getElementById('new-meal-option-type');
    const name = nameInput ? nameInput.value : '';
    const mealType = typeSelect ? typeSelect.value : 'breakfast';
    
    if (!name || !appState.currentMealOption || appState.currentMealOption.length === 0) {
        showNotification('Please enter meal name and add foods', 'warning');
        return;
    }
    
    const totals = appState.currentMealOption.reduce((acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    const mealOption = {
        name: name,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
        foods: appState.currentMealOption.map(food => food.displayName || food.name)
    };
    
    if (!appState.mealOptions[mealType]) {
        appState.mealOptions[mealType] = [];
    }
    
    appState.mealOptions[mealType].push(mealOption);
    
    showNotification(`✅ "${name}" added to ${mealType} options!`, 'success');
    
    // Reset form
    appState.currentMealOption = [];
    if (nameInput) nameInput.value = '';
    if (typeSelect) typeSelect.value = 'breakfast';
    updateMealOptionBuilder();
    closeModal('create-meal-option-modal');
    
    // Update management list if it's open
    const manageModal = document.getElementById('manage-meal-options-modal');
    if (manageModal && manageModal.style.display === 'flex') {
        updateManageMealOptionsList();
    }
}

// Recipe Functions
function addIngredient() {
    const ingredientInput = document.getElementById('ingredient-search');
    const amountInput = document.getElementById('ingredient-amount');
    const unitSelect = document.getElementById('ingredient-unit');
    
    const ingredient = ingredientInput ? ingredientInput.value : '';
    const amount = amountInput ? amountInput.value : '';
    const unit = unitSelect ? unitSelect.value : 'g';
    
    if (!ingredient || !amount) {
        showNotification('Please enter ingredient and amount', 'warning');
        return;
    }
    
    // Find ingredient in database
    const foundFood = appState.foodDatabase.find(food => 
        food.name.toLowerCase().includes(ingredient.toLowerCase())
    );
    
    if (foundFood) {
        const multiplier = parseFloat(amount) / 100; // Assuming 100g base
        appState.currentRecipe.push({
            name: ingredient,
            amount: amount,
            unit: unit,
            calories: foundFood.calories * multiplier,
            protein: foundFood.protein * multiplier,
            carbs: foundFood.carbs * multiplier,
            fat: foundFood.fat * multiplier
        });
        
        updateRecipeDisplay();
        
        // Clear inputs
        if (ingredientInput) ingredientInput.value = '';
        if (amountInput) amountInput.value = '';
    } else {
        showNotification('Ingredient not found in database', 'warning');
    }
}

function updateRecipeDisplay() {
    const list = document.getElementById('recipe-ingredients');
    const totalsDiv = document.getElementById('recipe-macro-totals');
    
    if (list) {
        list.innerHTML = appState.currentRecipe.map((ingredient, index) => `
            <div class="ingredient-item">
                <span>${ingredient.amount}${ingredient.unit} ${ingredient.name}</span>
                <button class="remove-ingredient" onclick="removeRecipeIngredient(${index})">Remove</button>
            </div>
        `).join('');
    }
    
    const totals = appState.currentRecipe.reduce((acc, ingredient) => ({
        calories: acc.calories + ingredient.calories,
        protein: acc.protein + ingredient.protein,
        carbs: acc.carbs + ingredient.carbs,
        fat: acc.fat + ingredient.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    if (totalsDiv) {
        totalsDiv.textContent = `${Math.round(totals.calories)} cal | ${Math.round(totals.protein)}g P | ${Math.round(totals.carbs)}g C | ${Math.round(totals.fat)}g F`;
    }
}

function removeRecipeIngredient(index) {
    appState.currentRecipe.splice(index, 1);
    updateRecipeDisplay();
}

function saveRecipe() {
    const nameInput = document.getElementById('recipe-name');
    const servingsInput = document.getElementById('recipe-servings');
    const name = nameInput ? nameInput.value : '';
    const servings = servingsInput ? parseInt(servingsInput.value) : 1;
    
    if (!name || appState.currentRecipe.length === 0) {
        showNotification('Please enter recipe name and add ingredients', 'warning');
        return;
    }
    
    const totals = appState.currentRecipe.reduce((acc, ingredient) => ({
        calories: acc.calories + ingredient.calories,
        protein: acc.protein + ingredient.protein,
        carbs: acc.carbs + ingredient.carbs,
        fat: acc.fat + ingredient.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // Add to database as a recipe
    appState.foodDatabase.push({
        name: name,
        category: 'recipe',
        calories: totals.calories / servings,
        protein: totals.protein / servings,
        carbs: totals.carbs / servings,
        fat: totals.fat / servings,
        isRecipe: true
    });
    
    showNotification(`🧾 Recipe "${name}" saved successfully!`, 'success');
    
    // Reset form
    appState.currentRecipe = [];
    if (nameInput) nameInput.value = '';
    if (servingsInput) servingsInput.value = '1';
    updateRecipeDisplay();
    closeModal('recipe-modal');
    populateFoodList();
}
