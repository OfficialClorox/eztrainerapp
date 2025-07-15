// Food Database Functions
function populateFoodList() {
    const foodList = document.getElementById('food-list');
    if (!foodList) return;
    
    const foods = appState.foodDatabase;
    
    foodList.innerHTML = foods.map(food => `
        <div class="food-item" onclick="addFoodToPlan('${food.name}', ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat})">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-macros">${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F</div>
            </div>
            <button class="add-food-btn">Add</button>
        </div>
    `).join('');
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
        <div class="food-item" onclick="addFoodToPlan('${food.name}', ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat})">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-macros">${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F</div>
            </div>
            <button class="add-food-btn">Add</button>
        </div>
    `).join('');
}

function filterFoods() {
    const searchInput = document.getElementById('food-search');
    const query = searchInput ? searchInput.value : '';
    searchFoods(query);
}

function addFoodToPlan(name, calories, protein, carbs, fat) {
    appState.currentMeal.push({ name, calories, protein, carbs, fat });
    updateMealBuilder();
    showNotification(`Added ${name} to meal builder`, 'success');
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
    
    builder.innerHTML = `
        <div style="margin-bottom: 15px;">
            ${appState.currentMeal.map((food, index) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid var(--border);">
                    <span style="color: var(--text-primary);">${food.name}</span>
                    <button onclick="removeFromMealBuilder(${index})" style="background: none; border: none; color: var(--danger); cursor: pointer;">×</button>
                </div>
            `).join('')}
        </div>
        <div style="padding: 10px; background: rgba(0, 188, 212, 0.1); border-radius: 6px; color: var(--text-primary);">
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
    // For demo purposes, just show a notification
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
    
    foodList.innerHTML = foods.map(food => `
        <div class="food-item" onclick="addFoodToMealOption('${food.name}', ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat})">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-macros">${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F</div>
            </div>
            <button class="add-food-btn">Add</button>
        </div>
    `).join('');
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
        <div class="food-item" onclick="addFoodToMealOption('${food.name}', ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat})">
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-macros">${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F</div>
            </div>
            <button class="add-food-btn">Add</button>
        </div>
    `).join('');
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
                        <div style="color: var(--text-primary); font-weight: 500; font-size: 13px;">${food.name}</div>
                        <div style="color: var(--text-secondary); font-size: 11px;">${Math.round(food.calories)} cal • ${Math.round(food.protein)}g P • ${Math.round(food.carbs)}g C • ${Math.round(food.fat)}g F</div>
                    </div>
                    <button onclick="removeFromMealOption(${index})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 16px; padding: 4px;">×</button>
                </div>
            `).join('')}
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
        foods: appState.currentMealOption.map(food => food.name)
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
