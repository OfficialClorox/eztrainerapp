// Food Database Functions with Serving Controls
function populateFoodList() {
    const foodList = document.getElementById('food-list');
    if (!foodList) return;
    
    const foods = appState.foodDatabase;
    
    foodList.innerHTML = foods.map(food => `
        <div class="food-item-enhanced" data-food-name="${food.name}">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-macros" id="macros-${food.name.replace(/\s+/g, '-')}">${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F</div>
                <div class="food-serving-info">per ${food.servingSize}</div>
            </div>
            <div class="serving-controls">
                <div class="serving-selector">
                    <select class="serving-size-select" id="serving-${food.name.replace(/\s+/g, '-')}" onchange="updateFoodMacroDisplay('${food.name}')">
                        ${food.servingOptions.map(option => `
                            <option value="${option}" ${option === food.servingSize ? 'selected' : ''}>${option}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="servings-number">
                    <input type="number" value="1" min="0.25" max="10" step="0.25" 
                           class="servings-input" 
                           id="servings-${food.name.replace(/\s+/g, '-')}"
                           onchange="updateFoodMacroDisplay('${food.name}')"
                           onclick="this.select()">
                    <label>servings</label>
                </div>
                <button class="add-food-btn" onclick="addFoodToPlanWithServing('${food.name}')">Add</button>
            </div>
            <div class="meal-goal-preview" id="preview-${food.name.replace(/\s+/g, '-')}" style="display: none;">
                <!-- Goal progress preview will be shown here -->
            </div>
        </div>
    `).join('');
}

function updateFoodMacroDisplay(foodName) {
    const food = appState.foodDatabase.find(f => f.name === foodName);
    if (!food) return;
    
    const safeName = foodName.replace(/\s+/g, '-');
    const servingSelect = document.getElementById(`serving-${safeName}`);
    const servingsInput = document.getElementById(`servings-${safeName}`);
    const macrosDisplay = document.getElementById(`macros-${safeName}`);
    const previewDiv = document.getElementById(`preview-${safeName}`);
    
    if (!servingSelect || !servingsInput || !macrosDisplay) return;
    
    const selectedServing = servingSelect.value;
    const numServings = parseFloat(servingsInput.value) || 1;
    const servingMultiplier = getServingMultiplier(selectedServing, food.servingSize);
    const totalMultiplier = servingMultiplier * numServings;
    
    const adjustedMacros = calculateMacrosForServing(food, totalMultiplier);
    
    macrosDisplay.textContent = `${adjustedMacros.calories} cal • ${adjustedMacros.protein}g P • ${adjustedMacros.carbs}g C • ${adjustedMacros.fat}g F`;
    
    // Show goal progress preview if we're in meal building mode
    if (appState.editingDay && previewDiv) {
        showMealGoalPreview(foodName, adjustedMacros, previewDiv);
    }
}

function showMealGoalPreview(foodName, macros, previewDiv) {
    const currentMealType = document.getElementById('new-meal-type')?.value || 'breakfast';
    const mealGoals = appState.mealGoals[currentMealType];
    const dayMeals = appState.dayMeals[appState.editingDay] || [];
    
    // Calculate current meal progress
    const currentMealMeals = dayMeals.filter(meal => meal.type === currentMealType);
    const currentMealTotals = currentMealMeals.reduce((acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // Calculate what totals would be after adding this food
    const newMealTotals = {
        calories: currentMealTotals.calories + macros.calories,
        protein: currentMealTotals.protein + macros.protein,
        carbs: currentMealTotals.carbs + macros.carbs,
        fat: currentMealTotals.fat + macros.fat
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

function addFoodToPlanWithServing(foodName) {
    const food = appState.foodDatabase.find(f => f.name === foodName);
    if (!food) return;
    
    const safeName = foodName.replace(/\s+/g, '-');
    const servingSelect = document.getElementById(`serving-${safeName}`);
    const servingsInput = document.getElementById(`servings-${safeName}`);
    
    const selectedServing = servingSelect ? servingSelect.value : food.servingSize;
    const numServings = servingsInput ? parseFloat(servingsInput.value) || 1 : 1;
    const servingMultiplier = getServingMultiplier(selectedServing, food.servingSize);
    const totalMultiplier = servingMultiplier * numServings;
    
    const adjustedMacros = calculateMacrosForServing(food, totalMultiplier);
    
    const foodItem = {
        name: foodName,
        servings: numServings,
        servingSize: selectedServing,
        totalMultiplier: totalMultiplier,
        calories: adjustedMacros.calories,
        protein: adjustedMacros.protein,
        carbs: adjustedMacros.carbs,
        fat: adjustedMacros.fat,
        isRecentlyAdded: true
    };
    
    appState.currentMeal.push(foodItem);
    updateMealBuilder();
    
    // Reset servings to 1 but keep serving size
    if (servingsInput) servingsInput.value = '1';
    updateFoodMacroDisplay(foodName);
    
    const servingText = numServings === 1 ? selectedServing : `${numServings} × ${selectedServing}`;
    showNotification(`Added ${servingText} of ${foodName} to meal builder`, 'success');
    
    // Remove recently added highlighting after 3 seconds
    setTimeout(() => {
        const mealItems = appState.currentMeal;
        const recentItem = mealItems.find(item => item.name === foodName && item.isRecentlyAdded);
        if (recentItem) {
            recentItem.isRecentlyAdded = false;
            updateMealBuilder();
        }
    }, 3000);
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
    
    const foodList = document.getElementById('food-list');
    if (!foodList) return;
    
    foodList.innerHTML = filteredFoods.map(food => `
        <div class="food-item-enhanced" data-food-name="${food.name}">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-macros" id="macros-${food.name.replace(/\s+/g, '-')}">${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F</div>
                <div class="food-serving-info">per ${food.servingSize}</div>
            </div>
            <div class="serving-controls">
                <div class="serving-selector">
                    <select class="serving-size-select" id="serving-${food.name.replace(/\s+/g, '-')}" onchange="updateFoodMacroDisplay('${food.name}')">
                        ${food.servingOptions.map(option => `
                            <option value="${option}" ${option === food.servingSize ? 'selected' : ''}>${option}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="servings-number">
                    <input type="number" value="1" min="0.25" max="10" step="0.25" 
                           class="servings-input" 
                           id="servings-${food.name.replace(/\s+/g, '-')}"
                           onchange="updateFoodMacroDisplay('${food.name}')"
                           onclick="this.select()">
                    <label>servings</label>
                </div>
                <button class="add-food-btn" onclick="addFoodToPlanWithServing('${food.name}')">Add</button>
            </div>
            <div class="meal-goal-preview" id="preview-${food.name.replace(/\s+/g, '-')}" style="display: none;">
                <!-- Goal progress preview will be shown here -->
            </div>
        </div>
    `).join('');
}

function filterFoods() {
    const searchInput = document.getElementById('food-search');
    const query = searchInput ? searchInput.value : '';
    searchFoods(query);
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
    
    // Get current meal type for goal comparison
    const mealTypeSelect = document.getElementById('meal-type');
    const currentMealType = mealTypeSelect ? mealTypeSelect.value.toLowerCase() : 'breakfast';
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
            ${appState.currentMeal.map((food, index) => {
                const servingText = food.servings === 1 ? food.servingSize : `${food.servings} × ${food.servingSize}`;
                const recentClass = food.isRecentlyAdded ? 'recently-added' : '';
                return `
                    <div class="meal-builder-item ${recentClass}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border);">
                        <div style="flex: 1;">
                            <div style="color: var(--text-primary); font-weight: 500;">${food.name}</div>
                            <div style="color: var(--text-secondary); font-size: 11px;">${servingText}</div>
                            <div style="color: var(--text-muted); font-size: 10px;">${Math.round(food.calories)} cal • ${Math.round(food.protein)}g P • ${Math.round(food.carbs)}g C • ${Math.round(food.fat)}g F</div>
                        </div>
                        <button onclick="removeFromMealBuilder(${index})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 16px; padding: 4px;">×</button>
                    </div>
                `;
            }).join('')}
        </div>
        
        <!-- Meal Goals Progress -->
        <div class="meal-goals-progress" style="margin-bottom: 15px; padding: 12px; background: rgba(0, 188, 212, 0.1); border-radius: 8px; border: 1px solid rgba(0, 188, 212, 0.3);">
            <div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 8px;">
                ${currentMealType.charAt(0).toUpperCase() + currentMealType.slice(1)} Goal Progress:
            </div>
            <div class="progress-grid">
                <div class="progress-item">
                    <span style="font-size: 10px;">Cal:</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress.calories, 100)}%; background: ${getAdherenceColor(progress.calories)}"></div>
                    </div>
                    <span style="font-size: 10px; color: ${getAdherenceColor(progress.calories)}">${Math.round(progress.calories)}%</span>
                </div>
                <div class="progress-item">
                    <span style="font-size: 10px;">P:</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress.protein, 100)}%; background: ${getAdherenceColor(progress.protein)}"></div>
                    </div>
                    <span style="font-size: 10px; color: ${getAdherenceColor(progress.protein)}">${Math.round(progress.protein)}%</span>
                </div>
                <div class="progress-item">
                    <span style="font-size: 10px;">C:</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress.carbs, 100)}%; background: ${getAdherenceColor(progress.carbs)}"></div>
                    </div>
                    <span style="font-size: 10px; color: ${getAdherenceColor(progress.carbs)}">${Math.round(progress.carbs)}%</span>
                </div>
                <div class="progress-item">
                    <span style="font-size: 10px;">F:</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress.fat, 100)}%; background: ${getAdherenceColor(progress.fat)}"></div>
                    </div>
                    <span style="font-size: 10px; color: ${getAdherenceColor(progress.fat)}">${Math.round(progress.fat)}%</span>
                </div>
            </div>
        </div>
        
        <!-- Totals Summary -->
        <div style="padding: 10px; background: rgba(0, 188, 212, 0.1); border-radius: 6px; color: var(--text-primary); text-align: center;">
            <strong>Totals: </strong>${Math.round(totals.calories)} cal | ${Math.round(totals.protein)}g P | ${Math.round(totals.carbs)}g C | ${Math.round(totals.fat)}g F
        </div>
    `;
}

function removeFromMealBuilder(index) {
    appState.currentMeal.splice(index, 1);
    updateMealBuilder();
}

function clearMealBuilder() {
    appState.currentMeal = [];
    updateMealBuilder();
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

// Meal Options Functions with Serving Support
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
                <strong>Foods:</strong><br>
                ${option.foods.map(food => `
                    <div style="margin-left: 10px; margin-bottom: 2px;">
                        • ${food.servings === 1 ? food.servingSize : `${food.servings} × ${food.servingSize}`} ${food.name}
                    </div>
                `).join('')}
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
    
    // For demo purposes, just show a notification
    showNotification(`✅ Selected "${selectedOption.name}" for tracking!`, 'success');
    closeModal('meal-options-modal');
    
    // In a real app, this would add the meal to the current day's tracking
    // and update the UI accordingly
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
                <strong>Foods:</strong><br>
                ${option.foods.map(food => `
                    <div style="margin-left: 10px;">
                        • ${food.servings === 1 ? food.servingSize : `${food.servings} × ${food.servingSize}`} ${food.name}
                    </div>
                `).join('')}
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
    // For demo purposes, just show a notification
    const option = appState.mealOptions[mealType][optionIndex];
    showNotification(`✏️ Editing "${option.name}" (feature coming soon)`, 'warning');
}

function importMealOptions() {
    showNotification('📥 Meal options import feature coming soon!', 'warning');
}

// Create Meal Option Functions with Serving Support
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
    
    foodList.innerHTML = foods.map(food => `
        <div class="food-item-enhanced" data-food-name="${food.name}">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-macros" id="option-macros-${food.name.replace(/\s+/g, '-')}">${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F</div>
                <div class="food-serving-info">per ${food.servingSize}</div>
            </div>
            <div class="serving-controls">
                <div class="serving-selector">
                    <select class="serving-size-select" id="option-serving-${food.name.replace(/\s+/g, '-')}" onchange="updateMealOptionFoodDisplay('${food.name}')">
                        ${food.servingOptions.map(option => `
                            <option value="${option}" ${option === food.servingSize ? 'selected' : ''}>${option}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="servings-number">
                    <input type="number" value="1" min="0.25" max="10" step="0.25" 
                           class="servings-input" 
                           id="option-servings-${food.name.replace(/\s+/g, '-')}"
                           onchange="updateMealOptionFoodDisplay('${food.name}')"
                           onclick="this.select()">
                    <label>servings</label>
                </div>
                <button class="add-food-btn" onclick="addFoodToMealOption('${food.name}')">Add</button>
            </div>
        </div>
    `).join('');
}

function updateMealOptionFoodDisplay(foodName) {
    const food = appState.foodDatabase.find(f => f.name === foodName);
    if (!food) return;
    
    const safeName = foodName.replace(/\s+/g, '-');
    const servingSelect = document.getElementById(`option-serving-${safeName}`);
    const servingsInput = document.getElementById(`option-servings-${safeName}`);
    const macrosDisplay = document.getElementById(`option-macros-${safeName}`);
    
    if (!servingSelect || !servingsInput || !macrosDisplay) return;
    
    const selectedServing = servingSelect.value;
    const numServings = parseFloat(servingsInput.value) || 1;
    const servingMultiplier = getServingMultiplier(selectedServing, food.servingSize);
    const totalMultiplier = servingMultiplier * numServings;
    
    const adjustedMacros = calculateMacrosForServing(food, totalMultiplier);
    
    macrosDisplay.textContent = `${adjustedMacros.calories} cal • ${adjustedMacros.protein}g P • ${adjustedMacros.carbs}g C • ${adjustedMacros.fat}g F`;
}

function addFoodToMealOption(foodName) {
    const food = appState.foodDatabase.find(f => f.name === foodName);
    if (!food) return;
    
    const safeName = foodName.replace(/\s+/g, '-');
    const servingSelect = document.getElementById(`option-serving-${safeName}`);
    const servingsInput = document.getElementById(`option-servings-${safeName}`);
    
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
        fat: adjustedMacros.fat
    };
    
    if (!appState.currentMealOption) appState.currentMealOption = [];
    appState.currentMealOption.push(foodItem);
    updateMealOptionBuilder();
    
    // Reset servings to 1 but keep serving size
    if (servingsInput) servingsInput.value = '1';
    updateMealOptionFoodDisplay(foodName);
    
    const servingText = numServings === 1 ? selectedServing : `${numServings} × ${selectedServing}`;
    showNotification(`Added ${servingText} of ${foodName} to meal option`, 'success');
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
    
    const foodList = document.getElementById('meal-option-food-list');
    if (!foodList) return;
    
    foodList.innerHTML = filteredFoods.map(food => `
        <div class="food-item-enhanced" data-food-name="${food.name}">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-macros" id="option-macros-${food.name.replace(/\s+/g, '-')}">${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F</div>
                <div class="food-serving-info">per ${food.servingSize}</div>
            </div>
            <div class="serving-controls">
                <div class="serving-selector">
                    <select class="serving-size-select" id="option-serving-${food.name.replace(/\s+/g, '-')}" onchange="updateMealOptionFoodDisplay('${food.name}')">
                        ${food.servingOptions.map(option => `
                            <option value="${option}" ${option === food.servingSize ? 'selected' : ''}>${option}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="servings-number">
                    <input type="number" value="1" min="0.25" max="10" step="0.25" 
                           class="servings-input" 
                           id="option-servings-${food.name.replace(/\s+/g, '-')}"
                           onchange="updateMealOptionFoodDisplay('${food.name}')"
                           onclick="this.select()">
                    <label>servings</label>
                </div>
                <button class="add-food-btn" onclick="addFoodToMealOption('${food.name}')">Add</button>
            </div>
        </div>
    `).join('');
}

function filterMealOptionFoods() {
    const searchInput = document.getElementById('meal-option-food-search');
    const query = searchInput ? searchInput.value : '';
    searchMealOptionFoods(query);
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
            ${appState.currentMealOption.map((food, index) => {
                const servingText = food.servings === 1 ? food.servingSize : `${food.servings} × ${food.servingSize}`;
                return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border);">
                        <div style="flex: 1;">
                            <div style="color: var(--text-primary); font-weight: 500; font-size: 13px;">${food.name}</div>
                            <div style="color: var(--text-secondary); font-size: 11px;">${servingText}</div>
                            <div style="color: var(--text-muted); font-size: 10px;">${Math.round(food.calories)} cal • ${Math.round(food.protein)}g P • ${Math.round(food.carbs)}g C • ${Math.round(food.fat)}g F</div>
                        </div>
                        <button onclick="removeFromMealOption(${index})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 16px; padding: 4px;">×</button>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="padding: 12px; background: rgba(0, 188, 212, 0.1); border-radius: 6px; color: var(--text-primary); font-size: 12px; text-align: center; border: 1px solid rgba(0, 188, 212, 0.3);">
            <strong>Total:</strong> ${Math.round(totals.calories)} cal | ${Math.round(totals.protein)}g P | ${Math.round(totals.carbs)}g C | ${Math.round(totals.fat)}g F
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
        foods: appState.currentMealOption.map(food => ({
            name: food.name,
            servings: food.servings,
            servingSize: food.servingSize
        }))
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

// Recipe Functions with Serving Support
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
        servingSize: '1 serving',
        servingOptions: ['0.5 serving', '1 serving', '1.5 servings', '2 servings'],
        unit: 'serving',
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
