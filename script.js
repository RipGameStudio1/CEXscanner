
const API_URL = 'https://underground-mia-slimeapp-847f161d.koyeb.app';

function stopPairTimer(pairItem) {
    const timerId = pairItem.dataset.timerId;
    if (timerId) {
        clearInterval(timerId);
        delete pairItem.dataset.timerId;
    }
}

function clearAllTimers() {
    const pairItems = document.querySelectorAll('.pair-item');
    pairItems.forEach(stopPairTimer);
}

function startPairTimer(pairItem) {
    const timerElement = pairItem.querySelector('.pair-timer');
    if (!timerElement || !pairItem.dataset.aliveTime) return;

    const startTime = new Date(pairItem.dataset.aliveTime);

    function updateTimer() {
        const now = new Date();
        const diff = Math.floor((now - startTime) / 1000);

        let timerText;
        if (diff < 60) {
            // Только секунды
            timerText = `${diff}с`;
        } else if (diff < 3600) {
            // Минуты и секунды
            const minutes = Math.floor(diff / 60);
            const seconds = diff % 60;
            timerText = `${minutes}м ${seconds}с`;
        } else if (diff < 86400) {
            // Часы, минуты и секунды
            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;
            timerText = `${hours}ч ${minutes}м ${seconds}с`;
        } else {
            // Дни, часы, минуты и секунды
            const days = Math.floor(diff / 86400);
            const hours = Math.floor((diff % 86400) / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;
            timerText = `${days}д ${hours}ч ${minutes}м ${seconds}с`;
        }

        timerElement.textContent = timerText;
    }

    // Запускаем обновление каждую секунду
    const timerId = setInterval(updateTimer, 1000);
    updateTimer(); // Первое обновление сразу

    // Сохраняем ID таймера в dataset элемента
    pairItem.dataset.timerId = timerId;
}

function updatePairTimer(pairItem, timerElement) {
    const aliveTime = pairItem.dataset.aliveTime;
    if (!aliveTime) return;

    const startTime = new Date(aliveTime);
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);

    // Форматируем время
    let timerText;
    if (diff < 60) {
        // Только секунды
        timerText = `${diff}с`;
    } else if (diff < 3600) {
        // Минуты и секунды
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        timerText = `${minutes}м ${seconds}с`;
    } else if (diff < 86400) {
        // Часы, минуты и секунды
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        timerText = `${hours}ч ${minutes}м ${seconds}с`;
    } else {
        // Дни, часы, минуты и секунды
        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        timerText = `${days}д ${hours}ч ${minutes}м ${seconds}с`;
    }

    timerElement.textContent = timerText;
}

// Функция форматирования оставшегося времени
function formatTimeRemaining(expiresAt) {
    if (!expiresAt) return 'не указано';
    
    try {
        // Извлекаем значение даты из объекта MongoDB
        const dateStr = expiresAt.$date || expiresAt;
        
        const now = new Date();
        const expires = new Date(dateStr);
        
        if (isNaN(expires.getTime())) {
            console.error('Invalid date:', expiresAt);
            return 'ошибка даты';
        }
        
        const diff = expires - now;

        if (diff <= 0) return 'истекла';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `${days}д ${hours}ч`;
        } else if (hours > 0) {
            return `${hours}ч ${minutes}м`;
        } else {
            return `${minutes}м`;
        }
    } catch (error) {
        console.error('Error formatting time:', error);
        return 'ошибка';
    }
}
// Функции для работы с API
const api = {
    async getUserLicense(telegramId) {
        const response = await fetch(`${API_URL}/users/${telegramId}/license`);
        return await response.json();
    },

    // Обновление лицензии
    async updateUserLicense(telegramId, licenseData) {
        const response = await fetch(`${API_URL}/users/${telegramId}/license`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(licenseData)
        });
        return await response.json();
    },
    // Получение списка бирж
    async getExchanges() {
        const response = await fetch(`${API_URL}/exchanges`);
        return await response.json();
    },

    // Получение списка монет
    async getCoins() {
        const response = await fetch(`${API_URL}/coins`);
        return await response.json();
    },

    // Получение пар
    async getPairs(userId = null) {
        const url = userId ? `${API_URL}/pairs?user_id=${userId}` : `${API_URL}/pairs`;
        const response = await fetch(url);
        return await response.json();
    },

    // Закрепление пары
    async pinPair(pairId, userId) {
        const response = await fetch(`${API_URL}/pairs/${pairId}/pin?user_id=${userId}`, {
            method: 'POST'
        });
        return await response.json();
    },

    // Открепление пары
    async unpinPair(pairId, userId) {
        const response = await fetch(`${API_URL}/pairs/${pairId}/pin?user_id=${userId}`, {
            method: 'DELETE'
        });
        return await response.json();
    },

    // Получение пользователя
    async getUser(telegramId) {
        console.log('Getting user with ID:', telegramId);
        const response = await fetch(`${API_URL}/users/${telegramId}`);
        if (!response.ok) {
            throw new Error(`User not found: ${response.status}`);
        }
        return await response.json();
    },

    // Создание пользователя
    async createUser(telegramId, username) {
        console.log('Creating user:', { telegramId, username });
        const response = await fetch(`${API_URL}/users/${telegramId}?username=${username || 'unknown'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to create user: ${response.status}`);
        }
        return await response.json();
    },

    // Обновление настроек пользователя
    async updateUserSettings(telegramId, settings) {
        const response = await fetch(`${API_URL}/users/${telegramId}/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        return await response.json();
    }
};
// Функция обновления статуса лицензии
function updateLicenseStatus(license) {
    const licenseStatusElement = document.querySelector('.license-status');
    if (!licenseStatusElement || !license) return;
    if (license.type === "Free") {
        licenseStatusElement.innerHTML = `${license.type}`;
        return;
    }
    const now = new Date();
    const expiresAt = license.expires_at;
    
    // Проверяем активность лицензии
    if (!license.is_active || !expiresAt) {
        licenseStatusElement.innerHTML = `${license.type}<br>неактивна`;
        return;
    }

    // Вычисляем оставшееся время и отображаем статус
    const timeRemaining = formatTimeRemaining(expiresAt);
    licenseStatusElement.innerHTML = `${license.type}<br>${timeRemaining}`;
}
// Периодическая проверка статуса лицензии
async function checkLicenseStatus(telegramId) {
    try {
        const response = await api.getUserLicense(telegramId);
        if (response) {
            updateLicenseStatus(response);
        }
    } catch (error) {
        console.error('Error checking license status:', error);
    }
}
// Функция фильтрации пар
function filterPairs(pairs, filters) {
    return pairs.filter(pair => {
        // Фильтр по монетам
        if (filters.selected_coins.length > 0) {
            const pairCoin = pair.coin_pair.split('/')[0];
            if (!filters.selected_coins.includes(pairCoin)) {
                return false;
            }
        }

        // Фильтр по бирже покупки
        if (filters.buy_exchanges.length > 0 && !filters.buy_exchanges.includes(pair.buy_exchange)) {
            return false;
        }

        // Фильтр по бирже продажи
        if (filters.sell_exchanges.length > 0 && !filters.sell_exchanges.includes(pair.sell_exchange)) {
            return false;
        }

        return true;
    });
}


document.addEventListener('DOMContentLoaded', async function() {
    let currentUser = null;
    let updateInterval = null;

    // Получаем все необходимые элементы
    const addPairBtn = document.getElementById('addPairBtn');
    const buyExchangesBtn = document.getElementById('buyExchanges');
    const sellExchangesBtn = document.getElementById('sellExchanges');
    const buyExchangesList = document.getElementById('buyExchangesList');
    const sellExchangesList = document.getElementById('sellExchangesList');
    const pairsContainer = document.getElementById('pairsContainer');
    const viewButtons = document.querySelectorAll('.view-btn');
    const cryptoFilter = document.getElementById('cryptoFilter');
    const cryptoList = document.getElementById('cryptoList');
    const cryptoSearch = document.getElementById('cryptoSearch');
    const selectAllCheckbox = document.getElementById('selectAllCrypto');
    const cryptoListContainer = document.querySelector('.crypto-list');
    const updateIntervalBtn = document.getElementById('updateInterval');
    const intervalList = document.getElementById('intervalList');

    async function updatePairsWithTimerCleanup() {
        clearAllTimers();
        await updatePairs();
    }
    // Проверка режима просмотра
    function checkViewMode() {
        if (window.innerWidth <= 601) {
            pairsContainer.className = 'pairs-container grid';
            viewButtons.forEach(btn => {
                if (btn.dataset.view === 'grid') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }

    window.addEventListener('load', checkViewMode);
    window.addEventListener('resize', checkViewMode);

    // Инициализация пользователя из Telegram WebApp
	if (window.Telegram && window.Telegram.WebApp) {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
    if (telegramUser) {
        try {
            // Добавим логи для отладки
            console.log('Telegram user data:', telegramUser);
            
            currentUser = await api.getUser(telegramUser.id.toString());
            document.querySelector('.username').textContent = '@' + telegramUser.username;
            updateLicenseStatus(currentUser.license);

            // Обновляем статус лицензии каждую минуту
            setInterval(() => {
                updateLicenseStatus(currentUser.license);
            }, 60000);

        } catch (error) {
            // Получаем username, используя first_name если username не доступен
            const username = telegramUser.username || telegramUser.first_name || 'unknown';
            console.log('Creating new user:', {
                id: telegramUser.id.toString(),
                username: username
            });

            currentUser = await api.createUser(telegramUser.id.toString(), username);
            document.querySelector('.username').textContent = '@' + username;
            updateLicenseStatus(currentUser.license);
        }
    }
}

    // Заполняем списки бирж
    try {
    const exchanges = await api.getExchanges();
    const coins = await api.getCoins();

    // Очищаем списки перед добавлением
    buyExchangesList.innerHTML = '';
    sellExchangesList.innerHTML = '';

    exchanges.forEach(exchange => {
        buyExchangesList.innerHTML += `
            <label><input type="checkbox" value="${exchange.symbol}"> ${exchange.name}</label>
        `;
        sellExchangesList.innerHTML += `
            <label><input type="checkbox" value="${exchange.symbol}"> ${exchange.name}</label>
        `;
    });

    // Заполняем список монет
    renderCryptoList(coins);
} catch (error) {
    console.error('Error loading initial data:', error);
}

    // Функция обновления пар
async function updatePairs() {
    try {
        if (!currentUser) {
            pairsContainer.innerHTML = '<div class="no-pairs">Необходима авторизация через Telegram</div>';
            return;
        }

        if (!currentUser.license || currentUser.license.type === "Free") {
            pairsContainer.innerHTML = '<div class="no-pairs">Чтобы функции работали - купите лицензию</div>';
            return;
        }

        pairsContainer.innerHTML = '<div class="loading">Загрузка пар...</div>';
        
        const pairsData = await api.getPairs(currentUser.telegram_id);
        console.log('Received pairs data:', pairsData);

        const filters = {
            selected_coins: Array.from(cryptoListContainer.querySelectorAll('input:checked'))
                .map(cb => cb.value),
            buy_exchanges: Array.from(buyExchangesList.querySelectorAll('input:checked'))
                .map(cb => cb.value),
            sell_exchanges: Array.from(sellExchangesList.querySelectorAll('input:checked'))
                .map(cb => cb.value)
        };

        pairsContainer.innerHTML = '';

        // Создаем массив всех пар для отображения
        let allPairsToShow = [];

        // Обрабатываем закрепленные пары
        if (pairsData.pinned_pairs && pairsData.pinned_pairs.length > 0) {
            for (const pinnedPair of pairsData.pinned_pairs) {
                const activePair = pairsData.active_pairs.find(ap => 
                    (ap._id.$oid || ap._id) === (pinnedPair.pair_id.$oid || pinnedPair.pair_id)
                );

                if (activePair) {
                    allPairsToShow.push({
                        ...activePair,
                        is_pinned: true,
                        is_active: pinnedPair.is_active,
                        pinned_at: pinnedPair.pinned_at
                    });
                }
            }
        }

        // Добавляем неприкрепленные активные пары
        if (pairsData.active_pairs && pairsData.active_pairs.length > 0) {
            const pinnedIds = new Set(pairsData.pinned_pairs?.map(pp => pp.pair_id.$oid || pp.pair_id) || []);
            
            const unpinnedPairs = pairsData.active_pairs
                .filter(pair => !pinnedIds.has(pair._id.$oid || pair._id))
                .map(pair => ({
                    ...pair,
                    is_pinned: false,
                    is_active: true
                }));

            allPairsToShow = [...allPairsToShow, ...unpinnedPairs];
        }

        // Применяем фильтры ко всем парам
        const filteredPairs = filterPairs(allPairsToShow, filters);

        // Сортируем пары: сначала закрепленные, потом остальные
        filteredPairs.sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            if (a.is_pinned && b.is_pinned) {
                // Сортируем закрепленные пары по времени закрепления
                return new Date(b.pinned_at.$date) - new Date(a.pinned_at.$date);
            }
            return 0;
        });

        // Отображаем отфильтрованные пары
        if (filteredPairs.length > 0) {
            filteredPairs.forEach(pair => {
                const pairElement = createPairItem(pair);
                if (pair.is_pinned && !pair.is_active) {
                    pairElement.classList.add('inactive');
                }
                pairsContainer.appendChild(pairElement);
            });
        } else {
            const noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-pairs';
            noResultsMessage.textContent = (filters.selected_coins.length > 0 || 
                                          filters.buy_exchanges.length > 0 || 
                                          filters.sell_exchanges.length > 0)
                ? 'Нет пар, соответствующих выбранным фильтрам'
                : 'Нет активных пар';
            pairsContainer.appendChild(noResultsMessage);
        }

    } catch (error) {
        console.error('Error updating pairs:', error);
        pairsContainer.innerHTML = '<div class="error-message">Ошибка загрузки пар</div>';
    }
}
    // Рендеринг списка криптовалют
    function renderCryptoList(coins) {
        cryptoListContainer.innerHTML = coins.map(coin => `
            <label>
                <input type="checkbox" value="${coin.symbol}">
                ${coin.name} (${coin.symbol})
            </label>
        `).join('');

        const checkboxes = cryptoListContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleCheckboxChange);
        });
    }

    // Обработчик изменения состояния чекбоксов
    function handleCheckboxChange() {
        const checkboxes = cryptoListContainer.querySelectorAll('input[type="checkbox"]:not(.hidden)');
        const checkedBoxes = cryptoListContainer.querySelectorAll('input[type="checkbox"]:checked:not(.hidden)');
        
        selectAllCheckbox.checked = checkboxes.length === checkedBoxes.length;
        selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkboxes.length !== checkedBoxes.length;
    }
    

    // Создание карточки пары
    function createPairItem(pairData) {
	    const pairItem = document.createElement('div');
	    pairItem.className = 'pair-item new';
	
	    const pairId = pairData._id.$oid || pairData.pair_id?.$oid || pairData._id;
	    pairItem.dataset.id = pairId;
	    
	    if (pairData.alive_time) {
	        pairItem.dataset.aliveTime = pairData.alive_time.$date || pairData.alive_time;
	    }
	    
	    // Сохраняем URL для покупки и продажи
	    const buyUrl = pairData.buy_url || '#';
	    const sellUrl = pairData.sell_url || '#';
	    
	    pairItem.innerHTML = `
	        <div class="exchanges">
	            <div class="buy-exchange" data-url="${buyUrl}">
	                <span class="exchange-name">${pairData.buy_exchange}</span>
	                <span class="exchange-price">$${pairData.buy_price}</span>
	            </div>
	            <div class="sell-exchange" data-url="${sellUrl}">
	                <span class="exchange-name">${pairData.sell_exchange}</span>
	                <span class="exchange-price">$${pairData.sell_price}</span>
	            </div>
	        </div>
	        <div class="pair-details">
	            <div class="pair-info">
	                <div class="pair-network-group">
	                    <div class="info-item">
	                        <span class="label">Пара</span>
	                        <span class="value">${pairData.coin_pair}</span>
	                    </div>
	                    <div class="info-item">
	                        <span class="label">Сеть</span>
	                        <span class="value">${pairData.network}</span>
	                    </div>
	                </div>
	                <div class="info-item">
	                    <span class="label">Спред</span>
	                    <span class="value">${pairData.spread}%</span>
	                </div>
	                <div class="info-item">
	                    <span class="label">Комиссия</span>
	                    <span class="value">${pairData.commission} ${pairData.coin_pair.split('/')[0]}</span>
	                </div>
	                <div class="info-item price-buy">
	                    <span class="label">Цена покупки</span>
	                    <span class="value">$${pairData.buy_price}</span>
	                </div>
	                <div class="info-item price-sell">
	                    <span class="label">Цена продажи</span>
	                    <span class="value">$${pairData.sell_price}</span>
	                </div>
	            </div>
	            <div class="bottom-info">
	                <span class="pair-timer">15с</span>
	                <span class="material-icons pin-icon">push_pin</span>
	            </div>
	        </div>
	    `;
	
	    // Добавляем обработчик для кнопки закрепления
	    const pinIcon = pairItem.querySelector('.pin-icon');
	    if (pairData.is_pinned) {
	        pinIcon.classList.add('pinned');
	    }
	    pinIcon.addEventListener('click', async (event) => {
	        event.stopPropagation(); // Предотвращаем всплытие события    
	        if (!currentUser) return;
	    
	        const isPinned = pinIcon.classList.contains('pinned');
	        try {
	            if (isPinned) {
	                await api.unpinPair(pairId, currentUser.telegram_id);
	                pinIcon.classList.remove('pinned');
	                pinIcon.style.color = '#666';
	            } else {
	                await api.pinPair(pairId, currentUser.telegram_id);
	                pinIcon.classList.add('pinned');
	                pinIcon.style.color = '#2196F3';
	            }
	            setTimeout(() => {
	                updatePairs();
	            }, 100);
	        } catch (error) {
	            console.error('Error toggling pin:', error);
	        }
	    });
	
	    // Добавляем обработчики для зон покупки и продажи
	    const buyExchange = pairItem.querySelector('.buy-exchange');
	    const sellExchange = pairItem.querySelector('.sell-exchange');
	    
	    buyExchange.addEventListener('click', () => {
	        const url = buyExchange.dataset.url;
	        if (url && url !== '#') {
	            window.open(url, '_blank');
	        }
	    });
	    
	    sellExchange.addEventListener('click', () => {
	        const url = sellExchange.dataset.url;
	        if (url && url !== '#') {
	            window.open(url, '_blank');
	        }
	    });
	    
	    const timerElement = pairItem.querySelector('.pair-timer');
	    startPairTimer(pairItem);
	    return pairItem;
	}


    // Обработчики событий
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = cryptoListContainer.querySelectorAll('input[type="checkbox"]:not(.hidden)');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    cryptoSearch.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        const labels = cryptoListContainer.querySelectorAll('label');
        
        labels.forEach(label => {
            const text = label.textContent.toLowerCase();
            if (text.includes(searchText)) {
                label.classList.remove('hidden');
                label.querySelector('input').classList.remove('hidden');
            } else {
                label.classList.add('hidden');
                label.querySelector('input').classList.add('hidden');
            }
        });

        handleCheckboxChange();
    });

    // Обработчик выбора интервала
    const intervalItems = document.querySelectorAll('input[name="interval"]');
    intervalItems.forEach(item => {
        item.addEventListener('change', async (e) => {
            const value = parseInt(e.target.value);
            const text = value === 0 ? 'Не обновлять' : `Обновление: ${value}с`;
            updateIntervalBtn.querySelector('span:first-child').textContent = text;

            if (updateInterval) {
                clearInterval(updateInterval);
            }

            if (value > 0) {
                updateInterval = setInterval(updatePairsWithTimerCleanup, value * 1000);
            }

            if (currentUser) {
                try {
                    await api.updateUserSettings(currentUser.telegram_id, {
                        ...currentUser.settings,
                        update_interval: value
                    });
                } catch (error) {
                    console.error('Error updating interval:', error);
                }
            }
        });
    });

    // Обработчики кнопок фильтров
    buyExchangesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        buyExchangesList.classList.toggle('show');
        sellExchangesList.classList.remove('show');
        cryptoList.classList.remove('show');
        intervalList.classList.remove('show');
    });

    sellExchangesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sellExchangesList.classList.toggle('show');
        buyExchangesList.classList.remove('show');
        cryptoList.classList.remove('show');
        intervalList.classList.remove('show');
    });

    cryptoFilter.addEventListener('click', (e) => {
        e.stopPropagation();
        cryptoList.classList.toggle('show');
        buyExchangesList.classList.remove('show');
        sellExchangesList.classList.remove('show');
        intervalList.classList.remove('show');
    });

    updateIntervalBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        intervalList.classList.toggle('show');
        buyExchangesList.classList.remove('show');
        sellExchangesList.classList.remove('show');
        cryptoList.classList.remove('show');
    });

    // Обработчик переключения видов
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            pairsContainer.classList.add('transitioning');
            
            setTimeout(() => {
                pairsContainer.className = 'pairs-container ' + btn.dataset.view;
            }, 50);

            setTimeout(() => {
                pairsContainer.classList.remove('transitioning');
            }, 300);
        });
    });

    // Закрытие выпадающих списков при клике вне
    document.addEventListener('click', (event) => {
        const isFilterClick = event.target.closest('.filter-btn');
        const isDropdownClick = event.target.closest('.dropdown-content');
        
        if (!isFilterClick && !isDropdownClick) {
            buyExchangesList.classList.remove('show');
            sellExchangesList.classList.remove('show');
            cryptoList.classList.remove('show');
            intervalList.classList.remove('show');
        }
    });

    // Первоначальная загрузка пар
    await updatePairs();

    // Применяем сохраненные настройки пользователя
    if (currentUser && currentUser.settings) {
        const settings = currentUser.settings;
        
        // Устанавливаем интервал обновления
        const intervalInput = document.querySelector(`input[name="interval"][value="${settings.update_interval}"]`);
        if (intervalInput) {
            intervalInput.checked = true;
            const value = settings.update_interval;
            const text = value === 0 ? 'Не обновлять' : `Обновление: ${value}с`;
            updateIntervalBtn.querySelector('span:first-child').textContent = text;

            if (value > 0) {
                updateInterval = setInterval(updatePairsWithTimerCleanup, value * 1000);
            }
        }

        // Отмечаем выбранные монеты
        settings.selected_coins.forEach(coin => {
            const checkbox = cryptoListContainer.querySelector(`input[value="${coin}"]`);
            if (checkbox) checkbox.checked = true;
        });

        // Отмечаем выбранные биржи покупки
        settings.buy_exchanges.forEach(exchange => {
            const checkbox = buyExchangesList.querySelector(`input[value="${exchange}"]`);
            if (checkbox) checkbox.checked = true;
        });

        // Отмечаем выбранные биржи продажи
        settings.sell_exchanges.forEach(exchange => {
            const checkbox = sellExchangesList.querySelector(`input[value="${exchange}"]`);
            if (checkbox) checkbox.checked = true;
        });

        handleCheckboxChange(); // Обновляем состояние "выбрать все"
    }

    // Обработчики изменения фильтров
    function handleFiltersChange() {
        if (!currentUser) return;

        const selectedCoins = Array.from(cryptoListContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);

        const selectedBuyExchanges = Array.from(buyExchangesList.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);

        const selectedSellExchanges = Array.from(sellExchangesList.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);

        const newSettings = {
            ...currentUser.settings,
            selected_coins: selectedCoins,
            buy_exchanges: selectedBuyExchanges,
            sell_exchanges: selectedSellExchanges
        };

        api.updateUserSettings(currentUser.telegram_id, newSettings)
        .then(() => {
            currentUser.settings = newSettings;
            updatePairs();
        })
        .catch(error => console.error('Error updating settings:', error));
    }


    // Добавляем обработчики изменения фильтров
    cryptoListContainer.addEventListener('change', () => {
    handleFiltersChange();
    handleCheckboxChange();
    });;
    buyExchangesList.addEventListener('change', handleFiltersChange);
    sellExchangesList.addEventListener('change', handleFiltersChange);

    // Обработчик добавления новой пары (если нужно)
    addPairBtn.addEventListener('click', async () => {
        // Здесь можно добавить логику создания новой пары
        // Пока просто обновляем существующие
        await updatePairs();
    });

    // Функция для форматирования времени последнего обновления
    function formatLastUpdated(timestamp) {
        const now = new Date();
        const updated = new Date(timestamp);
        const diff = Math.floor((now - updated) / 1000);

        if (diff < 60) return `${diff}с`;
        if (diff < 3600) return `${Math.floor(diff / 60)}м`;
        return `${Math.floor(diff / 3600)}ч`;
    }

    // Функция обновления таймеров на карточках
    function updateTimers() {
        const timerElements = document.querySelectorAll('.pair-timer');
        timerElements.forEach(timer => {
            const pairItem = timer.closest('.pair-item');
            const timestamp = pairItem.dataset.lastUpdated;
            if (timestamp) {
                timer.textContent = formatLastUpdated(timestamp);
            }
        });
    }

    // Запускаем обновление таймеров
    setInterval(updateTimers, 1000);
    setInterval(updateAllTimers, 1000);
});
