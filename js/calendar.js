// Calendar Generation with Meal Goal Awareness
function generateCalendar() {
    const grid = document.getElementById('calendar-grid');
    const calendarDays = grid.querySelectorAll('.calendar-day');
    
    // Remove existing days
    calendarDays.forEach(day => day.remove());
    
    // Get first day of month and number of days
    const firstDay = new Date(appState.currentYear, appState.currentMonth - 1, 1);
    const lastDay = new Date(appState.currentYear, appState.currentMonth, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Add previous month days
    const prevMonth = new Date(appState.currentYear, appState.currentMonth - 2, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonth.getDate() - i;
        const dayElement = createCalendarDay(day, appState.currentMonth - 1, true);
        grid.appendChild(dayElement);
    }
    
    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === 14 && appState.currentMonth === 7; // Today is July 14
        const dayElement = createCalendarDay(day, appState.currentMonth, false, isToday);
        grid.appendChild(dayElement);
    }
    
    // Add next month days to fill grid
    const totalCells = grid.children.length - 7; // Subtract headers
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createCalendarDay(day, appState.currentMonth + 1, true);
        grid.appendChild(dayElement);
    }
}

function createCalendarDay(day, month, isOtherMonth = false, isToday = false) {
    const dayElement = document.createElement('div');
    dayElement.className = `calendar-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
    dayElement.setAttribute('data-day', day);
    dayElement.setAttribute('data-month', month);
    
    // Get meal data for this day
    let mealsHtml = '';
    let calories = '';
    let adherenceClass = '';
    
    if (!isOtherMonth && month === 7) {
        const dayMeals = appState.dayMeals[day] || [];
        if (dayMeals.length > 0) {
            // Group meals by type and show first few
            const mealTypes = { breakfast: [], lunch: [], dinner: [], snack: [] };
            dayMeals.forEach(meal => {
                if (mealTypes[meal.type]) {
                    mealTypes[meal.type].push(meal);
                }
            });
            
            const mealEmojis = { breakfast: '🥚', lunch: '🍗', dinner: '🐟', snack: '🥤' };
            let mealItems = [];
            
            Object.entries(mealTypes).forEach(([type, meals]) => {
                if (meals.length > 0) {
                    const emoji = mealEmojis[type];
                    const mealGoal = appState.mealGoals[type];
                    const mealTotals = meals.reduce((acc, meal) => ({
                        calories: acc.calories + meal.calories,
                        protein: acc.protein + meal.protein,
                        carbs: acc.carbs + meal.carbs,
                        fat: acc.fat + meal.fat
                    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
                    
                    // Calculate adherence percentage for this meal type
                    const adherence = Math.round((mealTotals.calories / mealGoal.calories) * 100);
                    const adherenceColor = getProgressColor(mealTotals.calories, mealGoal.calories);
                    
                    mealItems.push(`
                        <div class="day-meal-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
                            <span>${emoji} ${meals[0].name}</span>
                            <span style="color: ${adherenceColor}; font-weight: 600; font-size: 8px;">${adherence}%</span>
                        </div>
                    `);
                }
            });
            
            mealsHtml = mealItems.slice(0, 4).join('');
            
            // Calculate total calories and daily adherence
            const totalCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
            const dailyAdherence = Math.round((totalCalories / appState.dailyGoals.calories) * 100);
            calories = `${totalCalories} cal (${dailyAdherence}%)`;
            
            // Set adherence class for visual indicator
            if (dailyAdherence >= 90 && dailyAdherence <= 110) {
                adherenceClass = 'excellent-adherence';
            } else if (dailyAdherence >= 80 && dailyAdherence <= 120) {
                adherenceClass = 'good-adherence';
            } else if (dailyAdherence >= 60 && dailyAdherence <= 140) {
                adherenceClass = 'fair-adherence';
            } else {
                adherenceClass = 'poor-adherence';
            }
        } else {
            mealsHtml = '<div style="color: var(--text-muted); font-style: italic; text-align: center; margin-top: 25px; font-size: 8px;">Click to plan</div>';
            calories = '- cal (0%)';
            adherenceClass = 'no-data';
        }
    }
    
    dayElement.innerHTML = `
        <div class="day-number">${day}</div>
        <div class="day-meals">${mealsHtml}</div>
        <div class="day-calories ${adherenceClass}">${calories}</div>
        <div class="adherence-indicator ${adherenceClass}"></div>
        <div class="edit-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 188, 212, 0.1); border-radius: var(--radius); opacity: 0; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: var(--primary);">✏️ Edit</div>
    `;
    
    // Add adherence indicator styles
    const adherenceIndicator = dayElement.querySelector('.adherence-indicator');
    if (adherenceIndicator) {
        adherenceIndicator.style.cssText = `
            position: absolute;
            top: 4px;
            left: 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            transition: all 0.3s ease;
        `;
        
        switch (adherenceClass) {
            case 'excellent-adherence':
                adherenceIndicator.style.background = 'var(--success)';
                adherenceIndicator.style.boxShadow = '0 0 6px rgba(76, 175, 80, 0.6)';
                break;
            case 'good-adherence':
                adherenceIndicator.style.background = 'var(--primary)';
                adherenceIndicator.style.boxShadow = '0 0 6px rgba(0, 188, 212, 0.6)';
                break;
            case 'fair-adherence':
                adherenceIndicator.style.background = 'var(--warning)';
                adherenceIndicator.style.boxShadow = '0 0 6px rgba(255, 193, 7, 0.6)';
                break;
            case 'poor-adherence':
                adherenceIndicator.style.background = 'var(--danger)';
                adherenceIndicator.style.boxShadow = '0 0 6px rgba(244, 67, 54, 0.6)';
                break;
            case 'no-data':
                adherenceIndicator.style.background = 'var(--text-muted)';
                adherenceIndicator.style.opacity = '0.3';
                break;
        }
    }
    
    // Add event listeners for drag selection
    dayElement.addEventListener('mousedown', handleMouseDown);
    dayElement.addEventListener('mouseenter', handleMouseEnter);
    dayElement.addEventListener('mouseup', handleMouseUp);
    
    // Add single-click for editing
    dayElement.addEventListener('click', (e) => {
        // Only edit if this wasn't part of a drag selection
        if (!appState.hasDragged && !isOtherMonth) {
            e.preventDefault();
            e.stopPropagation();
            editDayMeals(day);
        }
    });
    
    // Add hover effect for edit overlay
    dayElement.addEventListener('mouseenter', (e) => {
        if (!appState.isSelecting && !isOtherMonth) {
            const overlay = dayElement.querySelector('.edit-overlay');
            overlay.style.opacity = '1';
        }
    });
    
    dayElement.addEventListener('mouseleave', (e) => {
        const overlay = dayElement.querySelector('.edit-overlay');
        overlay.style.opacity = '0';
    });
    
    return dayElement;
}

// Drag Selection Functions
function handleMouseDown(e) {
    if (e.target.closest('.calendar-day').classList.contains('other-month')) return;
    
    e.preventDefault();
    
    appState.isSelecting = true;
    appState.hasDragged = false;
    appState.selectionStart = e.target.closest('.calendar-day');
    
    const day = parseInt(appState.selectionStart.getAttribute('data-day'));
    
    if (!e.ctrlKey && !e.metaKey) {
        // Clear selection if not holding Ctrl
        clearSelection();
    }
    
    toggleDaySelection(appState.selectionStart, day);
    updateCalendarUI();
}

function handleMouseEnter(e) {
    if (!appState.isSelecting || !appState.selectionStart) return;
    
    // Mark that we've dragged
    appState.hasDragged = true;
    
    const currentDay = e.target.closest('.calendar-day');
    if (!currentDay || currentDay.classList.contains('other-month')) return;
    
    // Clear temporary selecting class
    document.querySelectorAll('.calendar-day.selecting').forEach(d => {
        d.classList.remove('selecting');
    });
    
    // Highlight range
    const startDay = parseInt(appState.selectionStart.getAttribute('data-day'));
    const endDay = parseInt(currentDay.getAttribute('data-day'));
    const start = Math.min(startDay, endDay);
    const end = Math.max(startDay, endDay);
    
    for (let day = start; day <= end; day++) {
        const dayElement = document.querySelector(`[data-day="${day}"][data-month="7"]:not(.other-month)`);
        if (dayElement) {
            dayElement.classList.add('selecting');
        }
    }
}

function handleMouseUp(e) {
    if (!appState.isSelecting) return;
    
    appState.isSelecting = false;
    
    // Convert selecting to selected only if we dragged
    if (appState.hasDragged) {
        document.querySelectorAll('.calendar-day.selecting').forEach(day => {
            const dayNum = parseInt(day.getAttribute('data-day'));
            if (!appState.selectedDays.includes(dayNum)) {
                appState.selectedDays.push(dayNum);
            }
            day.classList.remove('selecting');
            day.classList.add('selected');
        });
    } else {
        // Clear any selecting state if we didn't drag
        document.querySelectorAll('.calendar-day.selecting').forEach(day => {
            day.classList.remove('selecting');
        });
    }
    
    appState.selectionStart = null;
    updateCalendarUI();
    
    // Reset drag state after a small delay to allow click event to process
    setTimeout(() => {
        appState.hasDragged = false;
    }, 10);
}

function toggleDaySelection(element, day) {
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        appState.selectedDays = appState.selectedDays.filter(d => d !== day);
    } else {
        element.classList.add('selected');
        if (!appState.selectedDays.includes(day)) {
            appState.selectedDays.push(day);
        }
    }
}

function clearSelection() {
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    appState.selectedDays = [];
}

function updateCalendarUI() {
    const hasSelection = appState.selectedDays.length > 0;
    const hasCopiedData = appState.copiedMealPlan !== null;
    
    // Update button states
    document.getElementById('copy-btn').disabled = !hasSelection;
    document.getElementById('paste-btn').disabled = !hasSelection || !hasCopiedData;
    document.getElementById('clear-btn').disabled = !hasSelection;
    
    // Update selection info
    const selectionInfo = document.getElementById('selection-info');
    const selectionText = document.getElementById('selection-text');
    
    if (hasSelection) {
        selectionInfo.style.display = 'block';
        
        // Calculate aggregated stats for selected days
        let totalCalories = 0;
        let totalMeals = 0;
        let adherenceSum = 0;
        let daysWithData = 0;
        
        appState.selectedDays.forEach(day => {
            const dayMeals = appState.dayMeals[day] || [];
            if (dayMeals.length > 0) {
                const dayCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
                totalCalories += dayCalories;
                totalMeals += dayMeals.length;
                adherenceSum += (dayCalories / appState.dailyGoals.calories) * 100;
                daysWithData++;
            }
        });
        
        const avgAdherence = daysWithData > 0 ? Math.round(adherenceSum / daysWithData) : 0;
        
        if (appState.selectedDays.length === 1) {
            const day = appState.selectedDays[0];
            const dayMeals = appState.dayMeals[day] || [];
            const dayCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
            const dayAdherence = Math.round((dayCalories / appState.dailyGoals.calories) * 100);
            
            selectionText.innerHTML = `
                <strong>Day ${day} Selected</strong><br>
                ${dayMeals.length} meals • ${dayCalories} calories • ${dayAdherence}% goal adherence
            `;
        } else {
            const sortedDays = appState.selectedDays.sort((a, b) => a - b);
            selectionText.innerHTML = `
                <strong>${appState.selectedDays.length} Days Selected</strong> (Days ${sortedDays.join(', ')})<br>
                ${totalMeals} total meals • ${totalCalories} total calories • ${avgAdherence}% avg adherence
            `;
        }
    } else {
        selectionInfo.style.display = 'none';
    }
}

// Calendar Operations with Goal Awareness
function copySelectedDays() {
    if (appState.selectedDays.length === 0) {
        showNotification('Please select days to copy', 'warning');
        return;
    }
    
    // Copy meal plans from the first selected day
    const firstDay = Math.min(...appState.selectedDays);
    const dayMeals = appState.dayMeals[firstDay] || [];
    
    if (dayMeals.length === 0) {
        showNotification('Selected day has no meals to copy', 'warning');
        return;
    }
    
    // Calculate totals and adherence for the copied plan
    const totalCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = dayMeals.reduce((sum, meal) => sum + meal.protein, 0);
    const totalCarbs = dayMeals.reduce((sum, meal) => sum + meal.carbs, 0);
    const totalFat = dayMeals.reduce((sum, meal) => sum + meal.fat, 0);
    
    const adherence = {
        calories: Math.round((totalCalories / appState.dailyGoals.calories) * 100),
        protein: Math.round((totalProtein / appState.dailyGoals.protein) * 100),
        carbs: Math.round((totalCarbs / appState.dailyGoals.carbs) * 100),
        fat: Math.round((totalFat / appState.dailyGoals.fat) * 100)
    };
    
    appState.copiedMealPlan = {
        meals: dayMeals.map(meal => meal.name),
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        adherence: adherence,
        fullMealData: [...dayMeals]
    };
    
    showNotification(`📋 Copied meal plan from Day ${firstDay} (${totalCalories} cal, ${adherence.calories}% adherence)`, 'success');
    updateCalendarUI();
}

function pasteToSelectedDays() {
    if (appState.selectedDays.length === 0) {
        showNotification('Please select days to paste to', 'warning');
        return;
    }
    
    if (!appState.copiedMealPlan) {
        showNotification('No meal plan copied', 'warning');
        return;
    }
    
    // Apply the copied meal plan to each selected day
    appState.selectedDays.forEach(day => {
        appState.dayMeals[day] = [...appState.copiedMealPlan.fullMealData];
    });
    
    // Add visual feedback with adherence info
    appState.selectedDays.forEach(day => {
        const dayElement = document.querySelector(`[data-day="${day}"][data-month="7"]:not(.other-month)`);
        if (dayElement) {
            dayElement.classList.add('highlighted');
            setTimeout(() => {
                dayElement.classList.remove('highlighted');
            }, 3000);
        }
    });
    
    const adherence = appState.copiedMealPlan.adherence;
    showNotification(`📄 Pasted meal plan to ${appState.selectedDays.length} day(s) (${appState.copiedMealPlan.calories} cal, ${adherence.calories}% adherence)`, 'success');
    
    // Refresh calendar to show updated data
    generateCalendar();
    clearSelection();
    updateCalendarUI();
}

function clearSelectedDays() {
    if (appState.selectedDays.length === 0) {
        showNotification('Please select days to clear', 'warning');
        return;
    }
    
    if (confirm(`Clear meals from ${appState.selectedDays.length} selected day(s)?`)) {
        // Clear meal data for selected days
        appState.selectedDays.forEach(day => {
            appState.dayMeals[day] = [];
        });
        
        showNotification(`🗑️ Cleared meals from ${appState.selectedDays.length} day(s)`, 'success');
        
        // Refresh calendar and clear selection
        generateCalendar();
        clearSelection();
        updateCalendarUI();
    }
}

function previousMonth() {
    if (appState.currentMonth === 1) {
        appState.currentMonth = 12;
        appState.currentYear--;
    } else {
        appState.currentMonth--;
    }
    
    // Update calendar header
    const calendarTitle = document.querySelector('.calendar-nav h3');
    if (calendarTitle) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        calendarTitle.textContent = `${monthNames[appState.currentMonth - 1]} ${appState.currentYear}`;
    }
    
    generateCalendar();
    showNotification('📅 Moved to previous month');
}

function nextMonth() {
    if (appState.currentMonth === 12) {
        appState.currentMonth = 1;
        appState.currentYear++;
    } else {
        appState.currentMonth++;
    }
    
    // Update calendar header
    const calendarTitle = document.querySelector('.calendar-nav h3');
    if (calendarTitle) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        calendarTitle.textContent = `${monthNames[appState.currentMonth - 1]} ${appState.currentYear}`;
    }
    
    generateCalendar();
    showNotification('📅 Moved to next month');
}

function saveCalendar() {
    // Calculate overall statistics for the month
    const daysWithData = Object.keys(appState.dayMeals).filter(day => 
        appState.dayMeals[day] && appState.dayMeals[day].length > 0
    ).length;
    
    let totalAdherence = 0;
    let adherenceCount = 0;
    
    Object.keys(appState.dayMeals).forEach(day => {
        const dayMeals = appState.dayMeals[day] || [];
        if (dayMeals.length > 0) {
            const dayCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
            totalAdherence += (dayCalories / appState.dailyGoals.calories) * 100;
            adherenceCount++;
        }
    });
    
    const avgAdherence = adherenceCount > 0 ? Math.round(totalAdherence / adherenceCount) : 0;
    
    showNotification(`💾 Calendar saved! ${daysWithData} days planned, ${avgAdherence}% avg adherence`, 'success');
}

// Day Editing Functions
function editDayMeals(day) {
    appState.editingDay = day;
    openDayEditingSidebar();
    switchToEditMode(day);
    showNotification(`📝 Editing meals for Day ${day}`, 'success');
}

function openDayEditingSidebar() {
    document.getElementById('planning-sidebar').classList.add('open');
    document.getElementById('calendar-container').classList.add('planning-mode');
}

function switchToEditMode(day) {
    const sidebar = document.getElementById('planning-sidebar');
    const sidebarTitle = document.querySelector('.sidebar-title');
    sidebarTitle.innerHTML = `📝 Edit Day ${day} Meals`;
    
    // Update sidebar content to show day editing
    updateDayEditingSidebar(day);
}

function updateDayEditingSidebar(day) {
    const sidebarContent = document.querySelector('.sidebar-content');
    const dayMeals = appState.dayMeals[day] || [];
    
    // Calculate totals for the day
    const totals = dayMeals.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // Calculate goal adherence
    const adherence = {
        calories: Math.round((totals.calories / appState.dailyGoals.calories) * 100),
        protein: Math.round((totals.protein / appState.dailyGoals.protein) * 100),
        carbs: Math.round((totals.carbs / appState.dailyGoals.carbs) * 100),
        fat: Math.round((totals.fat / appState.dailyGoals.fat) * 100)
    };
    
    sidebarContent.innerHTML = `
        <!-- Day Summary -->
        <div class="sidebar-section">
            <h4>📊 Day ${day} Summary</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                <div style="background: rgba(0, 188, 212, 0.1); padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: ${getProgressColor(totals.calories, appState.dailyGoals.calories)};">${Math.round(totals.calories)}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Calories (${adherence.calories}%)</div>
                </div>
                <div style="background: rgba(76, 175, 80, 0.1); padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: ${getProgressColor(totals.protein, appState.dailyGoals.protein)};">${Math.round(totals.protein)}g</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Protein (${adherence.protein}%)</div>
                </div>
                <div style="background: rgba(255, 152, 0, 0.1); padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: ${getProgressColor(totals.carbs, appState.dailyGoals.carbs)};">${Math.round(totals.carbs)}g</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Carbs (${adherence.carbs}%)</div>
                </div>
                <div style="background: rgba(255, 193, 7, 0.1); padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 20px; font-weight: 700; color: ${getProgressColor(totals.fat, appState.dailyGoals.fat)};">${Math.round(totals.fat)}g</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Fat (${adherence.fat}%)</div>
                </div>
            </div>
        </div>

        <!-- Meal Goals Overview -->
        <div class="sidebar-section">
            <h4>🎯 Meal Goals vs Actual</h4>
            <div style="margin-bottom: 15px;">
                ${generateMealGoalsComparison(day, dayMeals)}
            </div>
        </div>

        <!-- Current Meals -->
        <div class="sidebar-section">
            <h4>🍽️ Current Meals</h4>
            <div id="day-meals-list" style="max-height: 200px; overflow-y: auto; border: 1px solid var(--border); border-radius: var(--radius); background: rgba(26, 26, 26, 0.6);">
                ${dayMeals.length > 0 ? dayMeals.map((meal, index) => {
                    const mealEmojis = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
                    const mealGoal = appState.mealGoals[meal.type] || appState.mealGoals.breakfast;
                    const mealAdherence = Math.round((meal.calories / mealGoal.calories) * 100);
                    
                    return `
                        <div class="meal-item-edit" style="padding: 12px 15px; border-bottom: 1px solid var(--border);">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                                        ${mealEmojis[meal.type] || '🍽️'} ${meal.name}
                                        <span style="font-size: 10px; color: ${getProgressColor(meal.calories, mealGoal.calories)}; font-weight: 700; margin-left: 8px;">
                                            ${mealAdherence}%
                                        </span>
                                    </div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">
                                        ${meal.calories} cal • ${meal.protein}g P • ${meal.carbs}g C • ${meal.fat}g F
                                    </div>
                                    <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">
                                        Goal: ${mealGoal.calories} cal • ${mealGoal.protein}g P • ${mealGoal.carbs}g C • ${mealGoal.fat}g F
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
                                    ${meal.foods.map(food => `
                                        <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 2px;">
                                            • ${food.displayName || food.name} (${Math.round(food.calories)} cal)
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('') : '<div style="padding: 20px; text-align: center; color: var(--text-muted); font-style: italic;">No meals added yet</div>'}
            </div>
            <button class="btn btn-small" onclick="showAddMealToDay(${day})" style="width: 100%; margin-top: 10px;">➕ Add New Meal</button>
        </div>

        <!-- Back to Planning -->
        <div class="sidebar-section">
            <button class="btn btn-secondary" onclick="backToPlanning()" style="width: 100%;">🔙 Back to Planning Mode</button>
        </div>
    `;
}

function generateMealGoalsComparison(day, dayMeals) {
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const mealEmojis = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
    
    return mealTypes.map(mealType => {
        const mealsOfType = dayMeals.filter(meal => meal.type === mealType);
        const actualCalories = mealsOfType.reduce((sum, meal) => sum + meal.calories, 0);
        const goalCalories = appState.mealGoals[mealType].calories;
        const percentage = goalCalories > 0 ? Math.round((actualCalories / goalCalories) * 100) : 0;
        const color = getProgressColor(actualCalories, goalCalories);
        
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 8px; background: rgba(45, 45, 45, 0.6); border-radius: 6px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span>${mealEmojis[mealType]}</span>
                    <span style="font-size: 12px; font-weight: 600; color: var(--text-primary); text-transform: capitalize;">${mealType}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; color: var(--text-secondary);">${actualCalories} / ${goalCalories} cal</span>
                    <span style="font-size: 11px; font-weight: 700; color: ${color};">${percentage}%</span>
                    <div style="width: 40px; height: 6px; background: rgba(26, 26, 26, 0.8); border-radius: 3px; overflow: hidden;">
                        <div style="width: ${Math.min(percentage, 100)}%; height: 100%; background: ${color}; transition: width 0.3s ease;"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function backToPlanning() {
    appState.editingDay = null;
    appState.editingMealIndex = null;
    appState.tempMeal = [];
    
    const sidebarTitle = document.querySelector('.sidebar-title');
    sidebarTitle.innerHTML = '🍽️ Meal Planning';
    
    // Restore original sidebar content by calling the sidebar initialization
    initializeSidebar();
}
