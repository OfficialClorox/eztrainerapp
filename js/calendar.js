// Calendar Generation with Goal Adherence
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
        const isToday = day === 15 && appState.currentMonth === 7; // Today is July 15
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
    let adherenceIndicator = '';
    
    if (!isOtherMonth && month === 7) {
        const dayMeals = appState.dayMeals[day] || [];
        
        if (dayMeals.length > 0) {
            // Calculate adherence for color coding
            const { adherence, overall } = calculateDayAdherence(dayMeals);
            const adherenceColor = getAdherenceColor(overall);
            
            // Group meals by type and show first few
            const mealTypes = { breakfast: [], lunch: [], dinner: [], snack: [] };
            dayMeals.forEach(meal => {
                if (mealTypes[meal.type]) {
                    mealTypes[meal.type].push(meal);
                }
            });
            
            const mealEmojis = { breakfast: '🥚', lunch: '🍗', dinner: '🐟', snack: '🥤' };
            let mealItems = [];
            
            // Show meal progress indicators
            Object.entries(mealTypes).forEach(([type, meals]) => {
                if (meals.length > 0) {
                    const emoji = mealEmojis[type];
                    const mealProgress = calculateMealProgress(type, dayMeals);
                    const avgProgress = (mealProgress.progress.calories + mealProgress.progress.protein + 
                                       mealProgress.progress.carbs + mealProgress.progress.fat) / 4;
                    const progressColor = getAdherenceColor(avgProgress);
                    
                    mealItems.push(`
                        <div class="day-meal-item" style="display: flex; justify-content: space-between; align-items: center;">
                            <span>${emoji} ${meals[0].name}</span>
                            <div style="width: 6px; height: 6px; border-radius: 50%; background: ${progressColor}; margin-left: 4px;"></div>
                        </div>
                    `);
                }
            });
            
            mealsHtml = mealItems.slice(0, 4).join('');
            
            // Calculate total calories
            const totalCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
            calories = `${Math.round(totalCalories)} cal`;
            
            // Adherence indicator dot
            adherenceIndicator = `<div class="adherence-indicator" style="background: ${adherenceColor}; width: 8px; height: 8px; border-radius: 50%;"></div>`;
        } else {
            mealsHtml = '<div style="color: var(--text-muted); font-style: italic; text-align: center; margin-top: 25px; font-size: 8px;">Click to plan</div>';
            calories = '- cal';
            adherenceIndicator = '<div class="adherence-indicator" style="background: var(--border);"></div>';
        }
    }
    
    dayElement.innerHTML = `
        <div class="day-number">
            <span>${day}</span>
            ${adherenceIndicator}
        </div>
        <div class="day-meals">${mealsHtml}</div>
        <div class="day-calories">${calories}</div>
        <div class="edit-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 188, 212, 0.1); border-radius: var(--radius); opacity: 0; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: var(--primary);">✏️ Edit</div>
    `;
    
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
            if (overlay) overlay.style.opacity = '1';
        }
    });
    
    dayElement.addEventListener('mouseleave', (e) => {
        const overlay = dayElement.querySelector('.edit-overlay');
        if (overlay) overlay.style.opacity = '0';
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
    const copyBtn = document.getElementById('copy-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    if (copyBtn) copyBtn.disabled = !hasSelection;
    if (pasteBtn) pasteBtn.disabled = !hasSelection || !hasCopiedData;
    if (clearBtn) clearBtn.disabled = !hasSelection;
    
    // Update selection info
    const selectionInfo = document.getElementById('selection-info');
    const selectionText = document.getElementById('selection-text');
    
    if (hasSelection && selectionInfo && selectionText) {
        selectionInfo.style.display = 'block';
        
        if (appState.selectedDays.length === 1) {
            const day = appState.selectedDays[0];
            const dayMeals = appState.dayMeals[day] || [];
            const { overall } = calculateDayAdherence(dayMeals);
            selectionText.textContent = `1 day selected (Day ${day}) - ${Math.round(overall)}% adherence`;
        } else {
            const sortedDays = appState.selectedDays.sort((a, b) => a - b);
            // Calculate average adherence for selected days
            const totalAdherence = appState.selectedDays.reduce((sum, day) => {
                const dayMeals = appState.dayMeals[day] || [];
                const { overall } = calculateDayAdherence(dayMeals);
                return sum + overall;
            }, 0);
            const avgAdherence = totalAdherence / appState.selectedDays.length;
            selectionText.textContent = `${appState.selectedDays.length} days selected (Days ${sortedDays.join(', ')}) - ${Math.round(avgAdherence)}% avg adherence`;
        }
    } else if (selectionInfo) {
        selectionInfo.style.display = 'none';
    }
}

// Calendar Operations with Goal Awareness
function copySelectedDays() {
    if (appState.selectedDays.length === 0) {
        showNotification('Please select days to copy', 'warning');
        return;
    }
    
    // Copy the meal plan from the first selected day, including goal adherence
    const firstDay = appState.selectedDays[0];
    const dayMeals = appState.dayMeals[firstDay] || [];
    
    if (dayMeals.length === 0) {
        showNotification('No meals to copy from selected day(s)', 'warning');
        return;
    }
    
    const { adherence, overall } = calculateDayAdherence(dayMeals);
    
    appState.copiedMealPlan = {
        meals: dayMeals.map(meal => ({
            ...meal,
            foods: meal.foods || []
        })),
        adherence: {
            overall: Math.round(overall),
            calories: Math.round(adherence.calories),
            protein: Math.round(adherence.protein),
            carbs: Math.round(adherence.carbs),
            fat: Math.round(adherence.fat)
        },
        totalCalories: dayMeals.reduce((sum, meal) => sum + meal.calories, 0)
    };
    
    showNotification(`📋 Copied meal plan from Day ${firstDay} (${Math.round(overall)}% adherence)`, 'success');
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
    
    // Paste the meal plan to all selected days
    appState.selectedDays.forEach(day => {
        // Deep clone the meals to avoid reference issues
        appState.dayMeals[day] = appState.copiedMealPlan.meals.map(meal => ({
            ...meal,
            foods: meal.foods ? [...meal.foods] : []
        }));
    });
    
    // Add visual feedback
    appState.selectedDays.forEach(day => {
        const dayElement = document.querySelector(`[data-day="${day}"][data-month="7"]:not(.other-month)`);
        if (dayElement) {
            dayElement.classList.add('highlighted');
            setTimeout(() => {
                dayElement.classList.remove('highlighted');
            }, 3000);
        }
    });
    
    // Regenerate calendar to show updated meals and adherence
    generateCalendar();
    
    const adherence = appState.copiedMealPlan.adherence;
    showNotification(`📄 Pasted meal plan to ${appState.selectedDays.length} day(s) (${adherence.overall}% adherence)`, 'success');
}

function clearSelectedDays() {
    if (appState.selectedDays.length === 0) {
        showNotification('Please select days to clear', 'warning');
        return;
    }
    
    if (confirm(`Clear meals from ${appState.selectedDays.length} selected day(s)?`)) {
        appState.selectedDays.forEach(day => {
            appState.dayMeals[day] = [];
        });
        
        generateCalendar();
        showNotification(`🗑️ Cleared meals from ${appState.selectedDays.length} day(s)`, 'success');
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
    
    // Update month display
    updateMonthDisplay();
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
    
    // Update month display
    updateMonthDisplay();
    generateCalendar();
    showNotification('📅 Moved to next month');
}

function updateMonthDisplay() {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthDisplays = document.querySelectorAll('.calendar-header h3');
    monthDisplays.forEach(display => {
        if (display) {
            display.textContent = `${monthNames[appState.currentMonth - 1]} ${appState.currentYear}`;
        }
    });
}

function saveCalendar() {
    // Calculate overall statistics for the month
    const daysWithMeals = Object.keys(appState.dayMeals).filter(day => 
        appState.dayMeals[day] && appState.dayMeals[day].length > 0
    );
    
    const totalAdherence = daysWithMeals.reduce((sum, day) => {
        const dayMeals = appState.dayMeals[day];
        const { overall } = calculateDayAdherence(dayMeals);
        return sum + overall;
    }, 0);
    
    const avgAdherence = daysWithMeals.length > 0 ? Math.round(totalAdherence / daysWithMeals.length) : 0;
    
    showNotification(`💾 Calendar saved! ${daysWithMeals.length} days planned (${avgAdherence}% avg adherence)`, 'success');
}

// Day Editing Functions
function editDayMeals(day) {
    appState.editingDay = day;
    openDayEditingSidebar();
    switchToEditMode(day);
    
    const dayMeals = appState.dayMeals[day] || [];
    const { overall } = calculateDayAdherence(dayMeals);
    showNotification(`📝 Editing meals for Day ${day} (${Math.round(overall)}% adherence)`, 'success');
}

function openDayEditingSidebar() {
    document.getElementById('planning-sidebar').classList.add('open');
    document.getElementById('calendar-container').classList.add('planning-mode');
}

function switchToEditMode(day) {
    const sidebar = document.getElementById('planning-sidebar');
    const sidebarTitle = document.querySelector('.sidebar-title');
    if (sidebarTitle) {
        sidebarTitle.innerHTML = `📝 Edit Day ${day} Meals`;
    }
    
    // Update sidebar content to show day editing
    updateDayEditingSidebar(day);
}

// Export calendar data with goal adherence
function exportCalendarData() {
    const calendarData = {
        month: appState.currentMonth,
        year: appState.currentYear,
        dailyGoals: appState.dailyGoals,
        mealGoals: appState.mealGoals,
        dayMeals: appState.dayMeals,
        adherenceStats: {}
    };
    
    // Calculate adherence stats for each day
    Object.keys(appState.dayMeals).forEach(day => {
        const dayMeals = appState.dayMeals[day];
        if (dayMeals && dayMeals.length > 0) {
            const { adherence, overall } = calculateDayAdherence(dayMeals);
            calendarData.adherenceStats[day] = {
                overall: Math.round(overall),
                calories: Math.round(adherence.calories),
                protein: Math.round(adherence.protein),
                carbs: Math.round(adherence.carbs),
                fat: Math.round(adherence.fat)
            };
        }
    });
    
    const jsonString = JSON.stringify(calendarData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meal-calendar-${appState.currentYear}-${String(appState.currentMonth).padStart(2, '0')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('📊 Calendar data exported successfully!', 'success');
}

// Generate adherence summary report
function generateAdherenceReport() {
    const daysWithMeals = Object.keys(appState.dayMeals).filter(day => 
        appState.dayMeals[day] && appState.dayMeals[day].length > 0
    );
    
    if (daysWithMeals.length === 0) {
        showNotification('No meal data available for report', 'warning');
        return;
    }
    
    const adherenceData = daysWithMeals.map(day => {
        const dayMeals = appState.dayMeals[day];
        const { adherence, overall } = calculateDayAdherence(dayMeals);
        return {
            day: parseInt(day),
            overall: Math.round(overall),
            calories: Math.round(adherence.calories),
            protein: Math.round(adherence.protein),
            carbs: Math.round(adherence.carbs),
            fat: Math.round(adherence.fat)
        };
    });
    
    const avgAdherence = {
        overall: Math.round(adherenceData.reduce((sum, d) => sum + d.overall, 0) / adherenceData.length),
        calories: Math.round(adherenceData.reduce((sum, d) => sum + d.calories, 0) / adherenceData.length),
        protein: Math.round(adherenceData.reduce((sum, d) => sum + d.protein, 0) / adherenceData.length),
        carbs: Math.round(adherenceData.reduce((sum, d) => sum + d.carbs, 0) / adherenceData.length),
        fat: Math.round(adherenceData.reduce((sum, d) => sum + d.fat, 0) / adherenceData.length)
    };
    
    const reportData = {
        month: `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][appState.currentMonth - 1]} ${appState.currentYear}`,
        daysTracked: daysWithMeals.length,
        averageAdherence: avgAdherence,
        dailyData: adherenceData,
        goals: {
            daily: appState.dailyGoals,
            meals: appState.mealGoals
        }
    };
    
    console.log('Adherence Report:', reportData);
    showNotification(`📈 Generated adherence report for ${daysWithMeals.length} days (${avgAdherence.overall}% avg)`, 'success');
    
    return reportData;
}
