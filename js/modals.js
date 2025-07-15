// Modal initialization and management
function initializeModals() {
    const modalsContainer = document.getElementById('modals-container');
    if (!modalsContainer) return;
    
    modalsContainer.innerHTML = `
        <!-- Macro Goals Management Modal -->
        <div class="modal-overlay" id="macro-goals-modal">
            <div class="modal" style="max-width: 800px;">
                <div class="modal-header">
                    <h2 class="modal-title">🎯 Macro Goals Management</h2>
                    <button class="close-btn" onclick="closeModal('macro-goals-modal')">×</button>
                </div>
                <div class="modal-content">
                    <!-- Daily Goals Section -->
                    <div style="background: rgba(0, 188, 212, 0.1); padding: 20px; border-radius: var(--radius); margin-bottom: 25px; border: 1px solid rgba(0, 188, 212, 0.3);">
                        <h3 style="color: var(--primary); margin-bottom: 15px; font-size: 18px;">📅 Daily Goals</h3>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                            <div class="form-group">
                                <label>Calories</label>
                                <input type="number" id="daily-calories" min="1000" max="5000" onchange="updateDailyGoals()">
                            </div>
                            <div class="form-group">
                                <label>Protein (g)</label>
                                <input type="number" id="daily-protein" min="50" max="300" onchange="updateDailyGoals()">
                            </div>
                            <div class="form-group">
                                <label>Carbs (g)</label>
                                <input type="number" id="daily-carbs" min="50" max="500" onchange="updateDailyGoals()">
                            </div>
                            <div class="form-group">
                                <label>Fat (g)</label>
                                <input type="number" id="daily-fat" min="20" max="200" onchange="updateDailyGoals()">
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-small" onclick="autoDistributeMealGoals()" style="margin-top: 10px;">
                            🔄 Auto-Distribute to Meals
                        </button>
                    </div>
                    
                    <!-- Individual Meal Goals -->
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: var(--text-primary); margin-bottom: 15px; font-size: 18px;">🍽️ Individual Meal Goals</h3>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                            <!-- Breakfast Goals -->
                            <div style="background: rgba(26, 26, 26, 0.6); padding: 15px; border-radius: var(--radius); border: 1px solid var(--border);">
                                <h4 style="color: var(--text-primary); margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                                    🌅 Breakfast
                                </h4>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Calories</label>
                                        <input type="number" id="breakfast-calories" onchange="updateMealGoals('breakfast')">
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Protein (g)</label>
                                        <input type="number" id="breakfast-protein" onchange="updateMealGoals('breakfast')">
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Carbs (g)</label>
                                        <input type="number" id="breakfast-carbs" onchange="updateMealGoals('breakfast')">
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Fat (g)</label>
                                        <input type="number" id="breakfast-fat" onchange="updateMealGoals('breakfast')">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Lunch Goals -->
                            <div style="background: rgba(26, 26, 26, 0.6); padding: 15px; border-radius: var(--radius); border: 1px solid var(--border);">
                                <h4 style="color: var(--text-primary); margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                                    ☀️ Lunch
                                </h4>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Calories</label>
                                        <input type="number" id="lunch-calories" onchange="updateMealGoals('lunch')">
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Protein (g)</label>
                                        <input type="number" id="lunch-protein" onchange="updateMealGoals('lunch')">
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Carbs (g)</label>
                                        <input type="number" id="lunch-carbs" onchange="updateMealGoals('lunch')">
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Fat (g)</label>
                                        <input type="number" id="lunch-fat" onchange="updateMealGoals('lunch')">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Dinner Goals -->
                            <div style="background: rgba(26, 26, 26, 0.6); padding: 15px; border-radius: var(--radius); border: 1px solid var(--border);">
                                <h4 style="color: var(--text-primary); margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                                    🌙 Dinner
                                </h4>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Calories</label>
                                        <input type="number" id="dinner-calories" onchange="updateMealGoals('dinner')">
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Protein (g)</label>
                                        <input type="number" id="dinner-protein" onchange="updateMealGoals('dinner')">
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Carbs (g)</label>
                                        <input type="number" id="dinner-carbs" onchange="updateMealGoals('dinner')">
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Fat (g)</label>
                                        <input type="number" id="dinner-fat" onchange="updateMealGoals('dinner')">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Snack Goals -->
                            <div style="background: rgba(26, 26, 26, 0.6); padding: 15px; border-radius: var(--radius); border: 1px solid var(--border);">
                                <h4 style="color: var(--text-primary); margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                                    🍎 Snacks
                                </h4>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Calories</label>
                                        <input type="number" id="snack-calories" onchange="updateMealGoals('snack')">
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Protein (g)</label>
                                        <input type="number" id="snack-protein" onchange="updateMealGoals('snack')">
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Carbs (g)</label>
                                        <input type="number" id="snack-carbs" onchange="updateMealGoals('snack')">
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Fat (g)</label>
                                        <input type="number" id="snack-fat" onchange="updateMealGoals('snack')">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Goal Distribution Info -->
                    <div style="background: rgba(255, 152, 0, 0.1); padding: 15px; border-radius: var(--radius); border-left: 4px solid var(--secondary); margin-bottom: 20px;">
                        <h4 style="color: var(--secondary); margin-bottom: 8px; font-size: 14px;">💡 Goal Management Tips</h4>
                        <ul style="color: var(--text-primary); font-size: 13px; margin: 0; padding-left: 20px;">
                            <li>Use "Auto-Distribute" for standard meal planning (20% breakfast, 30% lunch, 35% dinner, 15% snacks)</li>
                            <li>Adjust individual meal goals based on client preferences and schedules</li>
                            <li>Goals help track meal-by-meal progress and maintain balanced nutrition</li>
                        </ul>
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn btn-secondary" onclick="closeModal('macro-goals-modal')">Cancel</button>
                        <button class="btn btn-success" onclick="saveMacroGoals()">💾 Save Goals</button>
                    </div>
                </div>
            </div>
        </div>

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
                        <p style="color: var(--text-primary); font-size: 13px; margin: 0;">Select a meal option created by your trainer. These are pre-planned meals that fit your nutrition goals with precise serving sizes.</p>
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
                        <p style="color: var(--text-primary); font-size: 13px; margin: 0;">Create multiple meal options for each meal type with precise serving sizes. Clients can then select from these pre-approved options when tracking their meals.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Meal Option Modal -->
        <div class="modal-overlay" id="create-meal-option-modal">
            <div class="modal" style="max-width: 700px;">
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
                        <label>Add Foods with Serving Control</label>
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
                        <div class="food-list" id="meal-option-food-list" style="max-height: 200px;">
                            <!-- Food items will be populated -->
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
            <div class="modal" style="max-width: 700px;">
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
                        <label>Total Servings</label>
                        <input type="number" id="recipe-servings" value="1" min="1" max="20">
                    </div>
                    <div class="form-group">
                        <label>Add Ingredients with Precise Measurements</label>
                        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <input type="text" id="ingredient-search" placeholder="Search ingredient..." style="flex: 1;">
                            <input type="number" id="ingredient-amount" placeholder="Amount" style="width: 80px;" step="0.1">
                            <select id="ingredient-unit" style="width: 80px;">
                                <option>g</option>
                                <option>oz</option>
                                <option>cup</option>
                                <option>tbsp</option>
                                <option>tsp</option>
                                <option>ml</option>
                                <option>piece</option>
                            </select>
                            <button class="btn btn-small" onclick="addIngredient()">Add</button>
                        </div>
                    </div>
                    <div class="ingredient-list" id="recipe-ingredients">
                        <!-- Ingredients will be added here -->
                    </div>
                    <div id="recipe-totals" style="padding: 15px; background: rgba(0, 188, 212, 0.1); border-radius: var(--radius); margin-bottom: 15px;">
                        <strong>Recipe Totals (all servings): </strong><span id="recipe-macro-totals">0 cal | 0g P | 0g C | 0g F</span>
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

// Macro Goals Management Functions
function updateDailyGoals() {
    const caloriesInput = document.getElementById('daily-calories');
    const proteinInput = document.getElementById('daily-protein');
    const carbsInput = document.getElementById('daily-carbs');
    const fatInput = document.getElementById('daily-fat');
    
    if (caloriesInput) appState.dailyGoals.calories = parseInt(caloriesInput.value) || 2281;
    if (proteinInput) appState.dailyGoals.protein = parseInt(proteinInput.value) || 139;
    if (carbsInput) appState.dailyGoals.carbs = parseInt(carbsInput.value) || 304;
    if (fatInput) appState.dailyGoals.fat = parseInt(fatInput.value) || 65;
}

function updateMealGoals(mealType) {
    const goals = {};
    ['calories', 'protein', 'carbs', 'fat'].forEach(macro => {
        const input = document.getElementById(`${mealType}-${macro}`);
        if (input) {
            goals[macro] = parseInt(input.value) || 0;
        }
    });
    
    appState.mealGoals[mealType] = goals;
}

function saveMacroGoals() {
    // Update all goals from form
    updateDailyGoals();
    ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
        updateMealGoals(mealType);
    });
    
    showNotification('🎯 Macro goals saved successfully!', 'success');
    closeModal('macro-goals-modal');
    
    // Update any open meal builders
    if (appState.editingDay) {
        updateDayEditingSidebar(appState.editingDay);
    }
    updateMealBuilder();
}

// Modal Functions
function openCreateRecipeModal() {
    const modal = document.getElementById('recipe-modal');
    if (modal) {
        modal.style.display = 'flex';
        appState.currentRecipe = [];
        updateRecipeDisplay();
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
