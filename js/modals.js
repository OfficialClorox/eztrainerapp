// Modal initialization and management
function initializeModals() {
    const modalsContainer = document.getElementById('modals-container');
    if (!modalsContainer) return;
    
    modalsContainer.innerHTML = `
        <!-- Macro Goals Management Modal -->
        <div class="modal-overlay" id="macro-goals-modal">
            <div class="modal" style="max-width: 900px;">
                <div class="modal-header">
                    <h2 class="modal-title">🎯 Macro Goals Management</h2>
                    <button class="close-btn" onclick="closeModal('macro-goals-modal')">×</button>
                </div>
                <div class="modal-content">
                    <!-- Trainer Controls -->
                    <div style="background: rgba(255, 152, 0, 0.1); padding: 15px; border-radius: var(--radius); margin-bottom: 20px; border: 1px solid rgba(255, 152, 0, 0.3);">
                        <h4 style="color: var(--secondary); margin-bottom: 10px; font-size: 16px;">👨‍💼 Trainer Controls</h4>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button class="btn btn-secondary btn-small" onclick="autoDistributeMealGoals()">🔄 Auto-Distribute</button>
                            <button class="btn btn-small" onclick="resetToDefaults()">↺ Reset Defaults</button>
                            <button class="btn btn-small" onclick="loadPresetGoals('cutting')">✂️ Cutting Phase</button>
                            <button class="btn btn-small" onclick="loadPresetGoals('bulking')">💪 Bulking Phase</button>
                            <button class="btn btn-small" onclick="loadPresetGoals('maintenance')">⚖️ Maintenance</button>
                            <button class="btn btn-warning btn-small" onclick="saveGoalsAsTemplate()">💾 Save Template</button>
                        </div>
                    </div>

                    <!-- Daily Goals Section -->
                    <div style="background: rgba(0, 188, 212, 0.1); padding: 20px; border-radius: var(--radius); margin-bottom: 25px; border: 1px solid rgba(0, 188, 212, 0.3);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h3 style="color: var(--primary); margin: 0; font-size: 18px;">📅 Daily Goals</h3>
                            <div style="font-size: 12px; color: var(--text-secondary);">
                                Current: <span id="daily-totals-display">2281 cal | 139g P | 304g C | 65g F</span>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                            <div class="form-group">
                                <label>Calories</label>
                                <input type="number" id="daily-calories" min="1000" max="5000" onchange="updateDailyGoalsLive()" oninput="previewDailyChanges()">
                                <div class="goal-info">
                                    <span class="current-value" id="daily-calories-current">2281</span>
                                    <span class="change-indicator" id="daily-calories-change"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Protein (g)</label>
                                <input type="number" id="daily-protein" min="50" max="300" onchange="updateDailyGoalsLive()" oninput="previewDailyChanges()">
                                <div class="goal-info">
                                    <span class="current-value" id="daily-protein-current">139</span>
                                    <span class="change-indicator" id="daily-protein-change"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Carbs (g)</label>
                                <input type="number" id="daily-carbs" min="50" max="500" onchange="updateDailyGoalsLive()" oninput="previewDailyChanges()">
                                <div class="goal-info">
                                    <span class="current-value" id="daily-carbs-current">304</span>
                                    <span class="change-indicator" id="daily-carbs-change"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Fat (g)</label>
                                <input type="number" id="daily-fat" min="20" max="200" onchange="updateDailyGoalsLive()" oninput="previewDailyChanges()">
                                <div class="goal-info">
                                    <span class="current-value" id="daily-fat-current">65</span>
                                    <span class="change-indicator" id="daily-fat-change"></span>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 15px; padding: 10px; background: rgba(0, 0, 0, 0.2); border-radius: 6px;">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 5px;">Macro Distribution:</div>
                            <div style="display: flex; gap: 15px; font-size: 11px;">
                                <span>Protein: <span id="protein-percentage">24%</span></span>
                                <span>Carbs: <span id="carbs-percentage">53%</span></span>
                                <span>Fat: <span id="fat-percentage">23%</span></span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Individual Meal Goals -->
                    <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h3 style="color: var(--text-primary); margin: 0; font-size: 18px;">🍽️ Individual Meal Goals</h3>
                            <div style="font-size: 12px; color: var(--text-secondary);">
                                <label style="display: flex; align-items: center; gap: 5px; margin: 0;">
                                    <input type="checkbox" id="lock-meal-goals" onchange="toggleMealGoalsLock()" style="margin: 0;">
                                    Lock meal ratios
                                </label>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                            <!-- Breakfast Goals -->
                            <div class="meal-goal-card" data-meal="breakfast">
                                <div class="meal-goal-header">
                                    <h4 style="color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 8px;">
                                        🌅 Breakfast
                                        <span class="meal-percentage" id="breakfast-percentage">(20%)</span>
                                    </h4>
                                    <button class="btn-small reset-meal-btn" onclick="resetMealGoals('breakfast')" title="Reset to auto-distributed values">↺</button>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Calories</label>
                                        <input type="number" id="breakfast-calories" min="0" max="2000" onchange="updateMealGoalsLive('breakfast')" oninput="previewMealChanges('breakfast')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="breakfast-calories-current">456</span>
                                            <span class="change-indicator" id="breakfast-calories-change"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Protein (g)</label>
                                        <input type="number" id="breakfast-protein" min="0" max="150" onchange="updateMealGoalsLive('breakfast')" oninput="previewMealChanges('breakfast')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="breakfast-protein-current">28</span>
                                            <span class="change-indicator" id="breakfast-protein-change"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Carbs (g)</label>
                                        <input type="number" id="breakfast-carbs" min="0" max="250" onchange="updateMealGoalsLive('breakfast')" oninput="previewMealChanges('breakfast')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="breakfast-carbs-current">61</span>
                                            <span class="change-indicator" id="breakfast-carbs-change"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Fat (g)</label>
                                        <input type="number" id="breakfast-fat" min="0" max="100" onchange="updateMealGoalsLive('breakfast')" oninput="previewMealChanges('breakfast')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="breakfast-fat-current">13</span>
                                            <span class="change-indicator" id="breakfast-fat-change"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Lunch Goals -->
                            <div class="meal-goal-card" data-meal="lunch">
                                <div class="meal-goal-header">
                                    <h4 style="color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 8px;">
                                        ☀️ Lunch
                                        <span class="meal-percentage" id="lunch-percentage">(30%)</span>
                                    </h4>
                                    <button class="btn-small reset-meal-btn" onclick="resetMealGoals('lunch')" title="Reset to auto-distributed values">↺</button>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Calories</label>
                                        <input type="number" id="lunch-calories" min="0" max="2000" onchange="updateMealGoalsLive('lunch')" oninput="previewMealChanges('lunch')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="lunch-calories-current">684</span>
                                            <span class="change-indicator" id="lunch-calories-change"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Protein (g)</label>
                                        <input type="number" id="lunch-protein" min="0" max="150" onchange="updateMealGoalsLive('lunch')" oninput="previewMealChanges('lunch')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="lunch-protein-current">42</span>
                                            <span class="change-indicator" id="lunch-protein-change"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Carbs (g)</label>
                                        <input type="number" id="lunch-carbs" min="0" max="250" onchange="updateMealGoalsLive('lunch')" oninput="previewMealChanges('lunch')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="lunch-carbs-current">91</span>
                                            <span class="change-indicator" id="lunch-carbs-change"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Fat (g)</label>
                                        <input type="number" id="lunch-fat" min="0" max="100" onchange="updateMealGoalsLive('lunch')" oninput="previewMealChanges('lunch')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="lunch-fat-current">20</span>
                                            <span class="change-indicator" id="lunch-fat-change"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Dinner Goals -->
                            <div class="meal-goal-card" data-meal="dinner">
                                <div class="meal-goal-header">
                                    <h4 style="color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 8px;">
                                        🌙 Dinner
                                        <span class="meal-percentage" id="dinner-percentage">(35%)</span>
                                    </h4>
                                    <button class="btn-small reset-meal-btn" onclick="resetMealGoals('dinner')" title="Reset to auto-distributed values">↺</button>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Calories</label>
                                        <input type="number" id="dinner-calories" min="0" max="2000" onchange="updateMealGoalsLive('dinner')" oninput="previewMealChanges('dinner')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="dinner-calories-current">798</span>
                                            <span class="change-indicator" id="dinner-calories-change"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Protein (g)</label>
                                        <input type="number" id="dinner-protein" min="0" max="150" onchange="updateMealGoalsLive('dinner')" oninput="previewMealChanges('dinner')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="dinner-protein-current">49</span>
                                            <span class="change-indicator" id="dinner-protein-change"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Carbs (g)</label>
                                        <input type="number" id="dinner-carbs" min="0" max="250" onchange="updateMealGoalsLive('dinner')" oninput="previewMealChanges('dinner')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="dinner-carbs-current">107</span>
                                            <span class="change-indicator" id="dinner-carbs-change"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Fat (g)</label>
                                        <input type="number" id="dinner-fat" min="0" max="100" onchange="updateMealGoalsLive('dinner')" oninput="previewMealChanges('dinner')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="dinner-fat-current">23</span>
                                            <span class="change-indicator" id="dinner-fat-change"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Snack Goals -->
                            <div class="meal-goal-card" data-meal="snack">
                                <div class="meal-goal-header">
                                    <h4 style="color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 8px;">
                                        🍎 Snacks
                                        <span class="meal-percentage" id="snack-percentage">(15%)</span>
                                    </h4>
                                    <button class="btn-small reset-meal-btn" onclick="resetMealGoals('snack')" title="Reset to auto-distributed values">↺</button>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Calories</label>
                                        <input type="number" id="snack-calories" min="0" max="2000" onchange="updateMealGoalsLive('snack')" oninput="previewMealChanges('snack')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="snack-calories-current">343</span>
                                            <span class="change-indicator" id="snack-calories-change"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Protein (g)</label>
                                        <input type="number" id="snack-protein" min="0" max="150" onchange="updateMealGoalsLive('snack')" oninput="previewMealChanges('snack')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="snack-protein-current">20</span>
                                            <span class="change-indicator" id="snack-protein-change"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Carbs (g)</label>
                                        <input type="number" id="snack-carbs" min="0" max="250" onchange="updateMealGoalsLive('snack')" oninput="previewMealChanges('snack')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="snack-carbs-current">46</span>
                                            <span class="change-indicator" id="snack-carbs-change"></span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label style="font-size: 12px;">Fat (g)</label>
                                        <input type="number" id="snack-fat" min="0" max="100" onchange="updateMealGoalsLive('snack')" oninput="previewMealChanges('snack')">
                                        <div class="meal-goal-info">
                                            <span class="current-value" id="snack-fat-current">9</span>
                                            <span class="change-indicator" id="snack-fat-change"></span>
                                        </div>
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

// Enhanced Macro Goals Management Functions
function updateDailyGoalsLive() {
    const caloriesInput = document.getElementById('daily-calories');
    const proteinInput = document.getElementById('daily-protein');
    const carbsInput = document.getElementById('daily-carbs');
    const fatInput = document.getElementById('daily-fat');
    
    if (caloriesInput) appState.dailyGoals.calories = parseInt(caloriesInput.value) || 2281;
    if (proteinInput) appState.dailyGoals.protein = parseInt(proteinInput.value) || 139;
    if (carbsInput) appState.dailyGoals.carbs = parseInt(carbsInput.value) || 304;
    if (fatInput) appState.dailyGoals.fat = parseInt(fatInput.value) || 65;
    
    updateMacroPercentages();
    updateDailyTotalsDisplay();
    
    // Auto-distribute if lock is enabled
    const lockCheckbox = document.getElementById('lock-meal-goals');
    if (lockCheckbox && lockCheckbox.checked) {
        autoDistributeMealGoals(false); // Silent distribution
    }
    
    // Update any open interfaces
    if (appState.editingDay) {
        updateDayEditingSidebar(appState.editingDay);
    }
    updateMealBuilder();
}

function updateMealGoalsLive(mealType) {
    const goals = {};
    ['calories', 'protein', 'carbs', 'fat'].forEach(macro => {
        const input = document.getElementById(`${mealType}-${macro}`);
        if (input) {
            goals[macro] = parseInt(input.value) || 0;
        }
    });
    
    appState.mealGoals[mealType] = goals;
    updateMealPercentages(mealType);
    
    // Update any open interfaces
    if (appState.editingDay) {
        updateDayEditingSidebar(appState.editingDay);
    }
    updateMealBuilder();
}

function previewDailyChanges() {
    const inputs = ['calories', 'protein', 'carbs', 'fat'];
    inputs.forEach(macro => {
        const input = document.getElementById(`daily-${macro}`);
        const currentSpan = document.getElementById(`daily-${macro}-current`);
        const changeSpan = document.getElementById(`daily-${macro}-change`);
        
        if (input && currentSpan && changeSpan) {
            const newValue = parseInt(input.value) || 0;
            const currentValue = appState.dailyGoals[macro];
            const difference = newValue - currentValue;
            
            if (difference !== 0) {
                changeSpan.textContent = difference > 0 ? `+${difference}` : `${difference}`;
                changeSpan.className = `change-indicator ${difference > 0 ? 'positive' : 'negative'}`;
                changeSpan.style.display = 'inline';
            } else {
                changeSpan.style.display = 'none';
            }
        }
    });
    
    // Preview macro percentages
    const calories = parseInt(document.getElementById('daily-calories').value) || 2281;
    const protein = parseInt(document.getElementById('daily-protein').value) || 139;
    const carbs = parseInt(document.getElementById('daily-carbs').value) || 304;
    const fat = parseInt(document.getElementById('daily-fat').value) || 65;
    
    const proteinCals = protein * 4;
    const carbCals = carbs * 4;
    const fatCals = fat * 9;
    const totalCals = proteinCals + carbCals + fatCals;
    
    if (totalCals > 0) {
        const proteinPerc = Math.round((proteinCals / totalCals) * 100);
        const carbPerc = Math.round((carbCals / totalCals) * 100);
        const fatPerc = Math.round((fatCals / totalCals) * 100);
        
        document.getElementById('protein-percentage').textContent = `${proteinPerc}%`;
        document.getElementById('carbs-percentage').textContent = `${carbPerc}%`;
        document.getElementById('fat-percentage').textContent = `${fatPerc}%`;
    }
}

function previewMealChanges(mealType) {
    const inputs = ['calories', 'protein', 'carbs', 'fat'];
    inputs.forEach(macro => {
        const input = document.getElementById(`${mealType}-${macro}`);
        const currentSpan = document.getElementById(`${mealType}-${macro}-current`);
        const changeSpan = document.getElementById(`${mealType}-${macro}-change`);
        
        if (input && currentSpan && changeSpan) {
            const newValue = parseInt(input.value) || 0;
            const currentValue = appState.mealGoals[mealType][macro];
            const difference = newValue - currentValue;
            
            if (difference !== 0) {
                changeSpan.textContent = difference > 0 ? `+${difference}` : `${difference}`;
                changeSpan.className = `change-indicator ${difference > 0 ? 'positive' : 'negative'}`;
                changeSpan.style.display = 'inline';
            } else {
                changeSpan.style.display = 'none';
            }
        }
    });
    
    // Update meal percentage
    const calories = parseInt(document.getElementById(`${mealType}-calories`).value) || 0;
    const dailyCalories = appState.dailyGoals.calories;
    const percentage = dailyCalories > 0 ? Math.round((calories / dailyCalories) * 100) : 0;
    
    const percentageSpan = document.getElementById(`${mealType}-percentage`);
    if (percentageSpan) {
        percentageSpan.textContent = `(${percentage}%)`;
    }
}

function updateMacroPercentages() {
    const daily = appState.dailyGoals;
    const proteinCals = daily.protein * 4;
    const carbCals = daily.carbs * 4;
    const fatCals = daily.fat * 9;
    const totalCals = proteinCals + carbCals + fatCals;
    
    if (totalCals > 0) {
        const proteinPerc = Math.round((proteinCals / totalCals) * 100);
        const carbPerc = Math.round((carbCals / totalCals) * 100);
        const fatPerc = Math.round((fatCals / totalCals) * 100);
        
        const proteinSpan = document.getElementById('protein-percentage');
        const carbSpan = document.getElementById('carbs-percentage');
        const fatSpan = document.getElementById('fat-percentage');
        
        if (proteinSpan) proteinSpan.textContent = `${proteinPerc}%`;
        if (carbSpan) carbSpan.textContent = `${carbPerc}%`;
        if (fatSpan) fatSpan.textContent = `${fatPerc}%`;
    }
}

function updateMealPercentages(mealType) {
    const mealGoals = appState.mealGoals[mealType];
    const dailyCalories = appState.dailyGoals.calories;
    const percentage = dailyCalories > 0 ? Math.round((mealGoals.calories / dailyCalories) * 100) : 0;
    
    const percentageSpan = document.getElementById(`${mealType}-percentage`);
    if (percentageSpan) {
        percentageSpan.textContent = `(${percentage}%)`;
    }
}

function updateDailyTotalsDisplay() {
    const daily = appState.dailyGoals;
    const display = document.getElementById('daily-totals-display');
    if (display) {
        display.textContent = `${daily.calories} cal | ${daily.protein}g P | ${daily.carbs}g C | ${daily.fat}g F`;
    }
}

function toggleMealGoalsLock() {
    const lockCheckbox = document.getElementById('lock-meal-goals');
    const isLocked = lockCheckbox && lockCheckbox.checked;
    
    showNotification(
        isLocked ? '🔒 Meal ratios locked - will auto-adjust with daily goals' : '🔓 Meal ratios unlocked - can be edited independently',
        'success'
    );
}

function resetToDefaults() {
    if (confirm('Reset all goals to default values? This will overwrite current settings.')) {
        // Reset to original defaults
        appState.dailyGoals = {
            calories: 2281,
            protein: 139,
            carbs: 304,
            fat: 65
        };
        
        // Auto-distribute meal goals
        autoDistributeMealGoals(false);
        
        // Update modal display
        updateMacroGoalsModal();
        
        showNotification('🔄 Goals reset to defaults', 'success');
    }
}

function loadPresetGoals(preset) {
    const presets = {
        cutting: {
            daily: { calories: 1800, protein: 150, carbs: 180, fat: 60 },
            description: 'Fat loss phase with higher protein'
        },
        bulking: {
            daily: { calories: 2800, protein: 160, carbs: 400, fat: 90 },
            description: 'Muscle building phase with surplus'
        },
        maintenance: {
            daily: { calories: 2300, protein: 140, carbs: 280, fat: 75 },
            description: 'Weight maintenance phase'
        }
    };
    
    const selectedPreset = presets[preset];
    if (selectedPreset) {
        appState.dailyGoals = { ...selectedPreset.daily };
        autoDistributeMealGoals(false);
        updateMacroGoalsModal();
        
        showNotification(`📋 Loaded ${preset} preset: ${selectedPreset.description}`, 'success');
    }
}

function resetMealGoals(mealType) {
    if (confirm(`Reset ${mealType} goals to auto-distributed values?`)) {
        const daily = appState.dailyGoals;
        const distribution = {
            breakfast: 0.20,
            lunch: 0.30,
            dinner: 0.35,
            snack: 0.15
        };
        
        const percentage = distribution[mealType];
        appState.mealGoals[mealType] = {
            calories: Math.round(daily.calories * percentage),
            protein: Math.round(daily.protein * percentage),
            carbs: Math.round(daily.carbs * percentage),
            fat: Math.round(daily.fat * percentage)
        };
        
        // Update the inputs for this meal
        ['calories', 'protein', 'carbs', 'fat'].forEach(macro => {
            const input = document.getElementById(`${mealType}-${macro}`);
            if (input) {
                input.value = appState.mealGoals[mealType][macro];
            }
        });
        
        updateMealPercentages(mealType);
        showNotification(`🔄 ${mealType} goals reset`, 'success');
    }
}

function saveGoalsAsTemplate() {
    const templateName = prompt('Enter a name for this template:');
    if (templateName) {
        const template = {
            name: templateName,
            daily: { ...appState.dailyGoals },
            meals: { ...appState.mealGoals },
            created: new Date().toISOString()
        };
        
        // In a real app, this would save to a database
        // For now, we'll store in localStorage
        const templates = JSON.parse(localStorage.getItem('macroTemplates') || '[]');
        templates.push(template);
        localStorage.setItem('macroTemplates', JSON.stringify(templates));
        
        showNotification(`💾 Template "${templateName}" saved successfully!`, 'success');
    }
}

function loadSavedTemplate() {
    // In a real app, this would show a list of saved templates
    const templates = JSON.parse(localStorage.getItem('macroTemplates') || '[]');
    if (templates.length === 0) {
        showNotification('No saved templates found', 'warning');
        return;
    }
    
    // For demo, load the most recent template
    const latestTemplate = templates[templates.length - 1];
    appState.dailyGoals = { ...latestTemplate.daily };
    appState.mealGoals = { ...latestTemplate.meals };
    
    updateMacroGoalsModal();
    showNotification(`📂 Loaded template "${latestTemplate.name}"`, 'success');
}

// Enhanced updateMacroGoalsModal function
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
            // Update current value displays
            const currentSpan = document.getElementById(`daily-${key}-current`);
            if (currentSpan) {
                currentSpan.textContent = appState.dailyGoals[key];
            }
        }
    });
    
    // Update meal goals inputs
    ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
        const goals = appState.mealGoals[mealType];
        ['calories', 'protein', 'carbs', 'fat'].forEach(macro => {
            const input = document.getElementById(`${mealType}-${macro}`);
            if (input) {
                input.value = goals[macro];
                // Update current value displays
                const currentSpan = document.getElementById(`${mealType}-${macro}-current`);
                if (currentSpan) {
                    currentSpan.textContent = goals[macro];
                }
            }
        });
        updateMealPercentages(mealType);
    });
    
    updateMacroPercentages();
    updateDailyTotalsDisplay();
    
    // Clear all change indicators
    document.querySelectorAll('.change-indicator').forEach(span => {
        span.style.display = 'none';
    });
}

function updateDailyGoals() {
    updateDailyGoalsLive();
}

function updateMealGoals(mealType) {
    updateMealGoalsLive(mealType);
}

function saveMacroGoals() {
    // All goals are already updated live, just need to confirm save
    showNotification('🎯 Macro goals saved successfully!', 'success');
    closeModal('macro-goals-modal');
    
    // Update any open meal builders
    if (appState.editingDay) {
        updateDayEditingSidebar(appState.editingDay);
    }
    updateMealBuilder();
    
    // Save to localStorage for persistence
    const goalsData = {
        daily: appState.dailyGoals,
        meals: appState.mealGoals,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('clientMacroGoals', JSON.stringify(goalsData));
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
