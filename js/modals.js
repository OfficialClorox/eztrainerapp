// Modal initialization and management
function initializeModals() {
    const modalsContainer = document.getElementById('modals-container');
    if (!modalsContainer) return;
    
    modalsContainer.innerHTML = `
        <!-- Meal Options Modal -->
        <div class="modal-overlay" id="meal-options-modal">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">🍽️ Select Meal Option</h2>
                    <button class="close-btn" onclick="closeModal('meal-options-modal')">×</button>
                </div>
                <div class="modal-content">
                    <div class="form-group">
                        <label>Meal Type</label>
                        <select id="meal-option-type" onchange="updateMealOptionsList()">
                            <option value="breakfast">🌅 Breakfast</option>
                            <option value="lunch">☀️ Lunch</option>
                            <option value="dinner">🌙 Dinner</option>
                            <option value="snack">🍎 Snack</option>
                        </select>
                    </div>
                    <div id="meal-options-list" style="max-height: 400px; overflow-y: auto;">
                        <!-- Meal options will be populated here -->
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: rgba(0, 188, 212, 0.1); border-radius: var(--radius); border-left: 4px solid var(--primary);">
                        <h4 style="color: var(--primary); margin-bottom: 8px; font-size: 14px;">💡 For Clients</h4>
                        <p style="color: var(--text-primary); font-size: 13px; margin: 0;">Select a meal option created by your trainer. These are pre-planned meals that fit your nutrition goals.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Manage Meal Options Modal -->
        <div class="modal-overlay" id="manage-meal-options-modal">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">📝 Manage Meal Options</h2>
                    <button class="close-btn" onclick="closeModal('manage-meal-options-modal')">×</button>
                </div>
                <div class="modal-content">
                    <div class="form-group">
                        <label>Meal Type</label>
                        <select id="manage-meal-type" onchange="updateManageMealOptionsList()">
                            <option value="breakfast">🌅 Breakfast</option>
                            <option value="lunch">☀️ Lunch</option>
                            <option value="dinner">🌙 Dinner</option>
                            <option value="snack">🍎 Snack</option>
                        </select>
                    </div>
                    <div id="manage-meal-options-list" style="max-height: 300px; overflow-y: auto; margin-bottom: 20px;">
                        <!-- Meal options management will be populated here -->
                    </div>
                    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <button class="btn btn-success" onclick="openCreateMealOptionModal()">➕ Add New Option</button>
                        <button class="btn btn-secondary" onclick="importMealOptions()">📥 Import Options</button>
                    </div>
                    <div style="padding: 15px; background: rgba(255, 152, 0, 0.1); border-radius: var(--radius); border-left: 4px solid var(--secondary);">
                        <h4 style="color: var(--secondary); margin-bottom: 8px; font-size: 14px;">👨‍💼 For Trainers</h4>
                        <p style="color: var(--text-primary); font-size: 13px; margin: 0;">Create multiple meal options for each meal type. Clients can then select from these pre-approved options when tracking their meals.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Meal Option Modal -->
        <div class="modal-overlay" id="create-meal-option-modal">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">➕ Create Meal Option</h2>
                    <button class="close-btn" onclick="closeModal('create-meal-option-modal')">×</button>
                </div>
                <div class="modal-content">
                    <div class="form-group">
                        <label>Meal Name</label>
                        <input type="text" id="new-meal-option-name" placeholder="e.g., Protein Power Bowl">
                    </div>
                    <div class="form-group">
                        <label>Meal Type</label>
                        <select id="new-meal-option-type">
                            <option value="breakfast">🌅 Breakfast</option>
                            <option value="lunch">☀️ Lunch</option>
                            <option value="dinner">🌙 Dinner</option>
                            <option value="snack">🍎 Snack</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Foods in this meal</label>
                        <div id="meal-option-foods" style="min-height: 100px; padding: 15px; background: rgba(26, 26, 26, 0.6); border-radius: var(--radius); margin-bottom: 15px; border: 1px solid var(--border);">
                            <div style="color: var(--text-secondary); font-style: italic; text-align: center;">Add foods from the database below...</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Add Foods with Custom Serving Sizes</label>
                        <div class="search-filters">
                            <input type="text" class="search-input" placeholder="Search foods..." id="meal-option-food-search" oninput="searchMealOptionFoods(this.value)">
                            <select class="filter-select" id="meal-option-food-category" onchange="filterMealOptionFoods()">
                                <option value="">All Categories</option>
                                <option value="protein">Proteins</option>
                                <option value="carbs">Carbohydrates</option>
                                <option value="fats">Fats</option>
                                <option value="vegetables">Vegetables</option>
                                <option value="fruits">Fruits</option>
                            </select>
                        </div>
                        <div class="food-list" id="meal-option-food-list" style="max-height: 300px;">
                            <!-- Food items with serving controls will be populated -->
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn btn-secondary" onclick="closeModal('create-meal-option-modal')">Cancel</button>
                        <button class="btn btn-success" onclick="saveMealOption()">Save Meal Option</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Recipe Modal -->
        <div class="modal-overlay" id="recipe-modal">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">🧾 Create Recipe</h2>
                    <button class="close-btn" onclick="closeModal('recipe-modal')">×</button>
                </div>
                <div class="modal-content">
                    <div class="form-group">
                        <label>Recipe Name</label>
                        <input type="text" id="recipe-name" placeholder="e.g., Protein Pancakes">
                    </div>
                    <div class="form-group">
                        <label>Servings</label>
                        <input type="number" id="recipe-servings" value="1" min="1">
                    </div>
                    <div class="form-group">
                        <label>Add Ingredients with Precise Measurements</label>
                        <div style="margin-bottom: 15px; padding: 15px; background: rgba(0, 188, 212, 0.1); border-radius: var(--radius); border-left: 4px solid var(--primary);">
                            <h4 style="color: var(--primary); margin-bottom: 8px; font-size: 14px;">💡 Recipe Builder Tip</h4>
                            <p style="color: var(--text-primary); font-size: 13px; margin: 0;">Use the enhanced food search below to add ingredients with custom serving sizes, or use the quick add method.</p>
                        </div>
                        
                        <!-- Quick Add Method -->
                        <div style="display: flex; gap: 10px; margin-bottom: 15px; padding: 10px; background: rgba(45, 45, 45, 0.6); border-radius: var(--radius);">
                            <input type="text" id="ingredient-search" placeholder="Search ingredient..." style="flex: 1;">
                            <input type="number" id="ingredient-amount" placeholder="Amount" style="width: 80px;">
                            <select id="ingredient-unit" style="width: 80px;">
                                <option>g</option>
                                <option>oz</option>
                                <option>cup</option>
                                <option>tbsp</option>
                                <option>tsp</option>
                            </select>
                            <button class="btn btn-small" onclick="addIngredient()">Add</button>
                        </div>
                        
                        <!-- Enhanced Food Search for Recipes -->
                        <div class="search-filters">
                            <input type="text" class="search-input" placeholder="Search foods for precise measurements..." id="recipe-food-search" oninput="searchRecipeFoods(this.value)">
                            <select class="filter-select" id="recipe-food-category" onchange="filterRecipeFoods()">
                                <option value="">All Categories</option>
                                <option value="protein">Proteins</option>
                                <option value="carbs">Carbohydrates</option>
                                <option value="fats">Fats</option>
                                <option value="vegetables">Vegetables</option>
                                <option value="fruits">Fruits</option>
                            </select>
                        </div>
                        <div class="food-list" id="recipe-food-list" style="max-height: 200px; margin-bottom: 15px;">
                            <!-- Enhanced food items will be populated -->
                        </div>
                    </div>
                    
                    <div class="ingredient-list" id="recipe-ingredients">
                        <!-- Ingredients will be added here -->
                    </div>
                    <div id="recipe-totals" style="padding: 15px; background: rgba(0, 188, 212, 0.1); border-radius: var(--radius); margin-bottom: 15px;">
                        <strong>Recipe Totals: </strong><span id="recipe-macro-totals">0 cal | 0g P | 0g C | 0g F</span>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn btn-secondary" onclick="closeModal('recipe-modal')">Cancel</button>
                        <button class="btn btn-success" onclick="saveRecipe()">Save Recipe</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Meal Modal -->
        <div class="modal-overlay" id="meal-modal">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">🍽️ Create Meal</h2>
                    <button class="close-btn" onclick="closeModal('meal-modal')">×</button>
                </div>
                <div class="modal-content">
                    <div class="form-group">
                        <label>Meal Name</label>
                        <input type="text" id="meal-name" placeholder="e.g., Power Breakfast">
                    </div>
                    <div class="form-group">
                        <label>Meal Category</label>
                        <select id="meal-category">
                            <option>Breakfast</option>
                            <option>Lunch</option>
                            <option>Dinner</option>
                            <option>Snack</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Add Foods/Recipes</label>
                        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <input type="text" id="meal-food-search" placeholder="Search food or recipe..." style="flex: 1;">
                            <button class="btn btn-small" onclick="addToMeal()">Add</button>
                        </div>
                    </div>
                    <div class="ingredient-list" id="meal-foods">
                        <!-- Foods will be added here -->
                    </div>
                    <div id="meal-totals" style="padding: 15px; background: rgba(0, 188, 212, 0.1); border-radius: var(--radius); margin-bottom: 15px;">
                        <strong>Meal Totals: </strong><span id="meal-macro-totals">0 cal | 0g P | 0g C | 0g F</span>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn btn-secondary" onclick="closeModal('meal-modal')">Cancel</button>
                        <button class="btn btn-success" onclick="saveMeal()">Save Meal</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Hide modals when clicking outside
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
}

// Recipe Food Search Functions
function populateRecipeFoodList() {
    const foodList = document.getElementById('recipe-food-list');
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
                        <label>Size:</label>
                        <input type="number" 
                               class="serving-size-input" 
                               value="100" 
                               min="1" 
                               data-food-index="${index}"
                               onchange="updateRecipeFoodCalculation(${index})">
                        <select class="serving-unit-select" data-food-index="${index}" onchange="updateRecipeFoodCalculation(${index})">
                            <option value="g">g</option>
                            <option value="oz">oz</option>
                            <option value="cup">cup</option>
                            <option value="tbsp">tbsp</option>
                            <option value="tsp">tsp</option>
                            <option value="piece">piece</option>
                        </select>
                    </div>
                    <div class="serving-input-group">
                        <label>Amount:</label>
                        <input type="number" 
                               class="servings-count-input" 
                               value="1" 
                               min="0.1" 
                               step="0.1" 
                               data-food-index="${index}"
                               onchange="updateRecipeFoodCalculation(${index})">
                    </div>
                </div>
                <div class="calculated-macros" id="recipe-calculated-macros-${index}">
                    = ${food.calories} cal • ${food.protein}g P • ${food.carbs}g C • ${food.fat}g F
                </div>
            </div>
            <button class="add-food-btn" onclick="addFoodToRecipeWithServings(${index})">Add to Recipe</button>
        </div>
    `).join('');
    
    // Initialize calculations
    setTimeout(() => {
        foods.forEach((food, index) => {
            updateRecipeFoodCalculation(index);
        });
    }, 100);
}

function updateRecipeFoodCalculation(foodIndex) {
    const food = appState.foodDatabase[foodIndex];
    const servingSizeInput = document.querySelector(`#recipe-food-list input.serving-size-input[data-food-index="${foodIndex}"]`);
    const servingUnitSelect = document.querySelector(`#recipe-food-list select.serving-unit-select[data-food-index="${foodIndex}"]`);
    const servingsCountInput = document.querySelector(`#recipe-food-list input.servings-count-input[data-food-index="${foodIndex}"]`);
    const calculatedMacrosDiv = document.getElementById(`recipe-calculated-macros-${foodIndex}`);
    
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
        case 'tbsp':
            servingSizeInGrams = servingSize * 15;
            break;
        case 'tsp':
            servingSizeInGrams = servingSize * 5;
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

function addFoodToRecipeWithServings(foodIndex) {
    const food = appState.foodDatabase[foodIndex];
    const calculatedMacrosDiv = document.getElementById(`recipe-calculated-macros-${foodIndex}`);
    
    if (!calculatedMacrosDiv) return;
    
    const ingredient = {
        name: food.name,
        amount: calculatedMacrosDiv.dataset.servingSize || 100,
        unit: calculatedMacrosDiv.dataset.servingUnit || 'g',
        calories: parseFloat(calculatedMacrosDiv.dataset.calories) || food.calories,
        protein: parseFloat(calculatedMacrosDiv.dataset.protein) || food.protein,
        carbs: parseFloat(calculatedMacrosDiv.dataset.carbs) || food.carbs,
        fat: parseFloat(calculatedMacrosDiv.dataset.fat) || food.fat,
        servingsCount: parseFloat(calculatedMacrosDiv.dataset.servingsCount) || 1
    };
    
    if (!appState.currentRecipe) appState.currentRecipe = [];
    appState.currentRecipe.push(ingredient);
    updateRecipeDisplay();
    
    showNotification(`Added ${ingredient.servingsCount} × ${ingredient.amount}${ingredient.unit} ${ingredient.name} to recipe`, 'success');
}

function searchRecipeFoods(query) {
    const categorySelect = document.getElementById('recipe-food-category');
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
    populateRecipeFoodList();
    appState.foodDatabase = originalDatabase;
}

function filterRecipeFoods() {
    const searchInput = document.getElementById('recipe-food-search');
    const query = searchInput ? searchInput.value : '';
    searchRecipeFoods(query);
}

// Modal Functions
function openCreateRecipeModal() {
    const modal = document.getElementById('recipe-modal');
    if (modal) {
        modal.style.display = 'flex';
        appState.currentRecipe = [];
        updateRecipeDisplay();
        populateRecipeFoodList();
    }
}

function openCreateMealModal() {
    const modal = document.getElementById('meal-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Meal modal functions
function addToMeal() {
    // Placeholder function for adding foods to meal
    showNotification('Add to meal functionality - placeholder', 'warning');
}

function saveMeal() {
    const nameInput = document.getElementById('meal-name');
    const name = nameInput ? nameInput.value : '';
    
    if (!name) {
        showNotification('Please enter a meal name', 'warning');
        return;
    }
    
    showNotification(`🍽️ Meal "${name}" saved successfully!`, 'success');
    closeModal('meal-modal');
    
    // Reset form
    if (nameInput) nameInput.value = '';
    const categorySelect = document.getElementById('meal-category');
    if (categorySelect) categorySelect.value = 'Breakfast';
    
    const mealFoods = document.getElementById('meal-foods');
    if (mealFoods) mealFoods.innerHTML = '';
    
    const mealTotals = document.getElementById('meal-macro-totals');
    if (mealTotals) mealTotals.textContent = '0 cal | 0g P | 0g C | 0g F';
}

// Additional modal event handlers
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals when Escape is pressed
        const openModals = document.querySelectorAll('.modal-overlay[style*="flex"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
});

// Prevent modal content from closing when clicked
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
    }
});

// Stop propagation on modal content to prevent closing
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.modal') && !e.target.classList.contains('modal-overlay')) {
            e.stopPropagation();
        }
    });
});
