document.addEventListener('DOMContentLoaded', function() {
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

    // Данные криптовалют
    const cryptoData = [
        { "name": "Bitcoin", "symbol": "BTC" },
        { "name": "Ethereum", "symbol": "ETH" },
        { "name": "Binance Coin", "symbol": "BNB" },
        { "name": "Ripple", "symbol": "XRP" },
        { "name": "Cardano", "symbol": "ADA" },
        { "name": "Solana", "symbol": "SOL" },
        { "name": "Polkadot", "symbol": "DOT" },
        { "name": "Dogecoin", "symbol": "DOGE" },
        { "name": "Polygon", "symbol": "MATIC" },
        { "name": "Chainlink", "symbol": "LINK" },
        { "name": "Avalanche", "symbol": "AVAX" },
        { "name": "Uniswap", "symbol": "UNI" }
    ];

    // Проверка режима просмотра
    function checkViewMode() {
        if (window.innerWidth <= 450) {
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

    // Получение никнейма из Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        const username = window.Telegram.WebApp.initDataUnsafe.user?.username;
        if (username) {
            document.querySelector('.username').textContent = '@' + username;
        }
    }

    // Рендеринг списка криптовалют
    function renderCryptoList(data) {
        cryptoListContainer.innerHTML = data.map(crypto => `
            <label>
                <input type="checkbox" value="${crypto.symbol}">
                ${crypto.name} (${crypto.symbol})
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

    // Обработчик для "Выбрать все"
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = cryptoListContainer.querySelectorAll('input[type="checkbox"]:not(.hidden)');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Обработчик поиска
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
        item.addEventListener('change', (e) => {
            const value = e.target.value;
            const text = value === '0' ? 'Не обновлять' : `Обновление: ${value}с`;
            updateIntervalBtn.querySelector('span:first-child').textContent = text;
        });
    });

    // Добавление начальной пары
    pairsContainer.appendChild(createPairItem());

    // Обработчики кнопок
    addPairBtn.addEventListener('click', () => {
        pairsContainer.appendChild(createPairItem());
    });

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

    // Рендерим список криптовалют
    renderCryptoList(cryptoData);

    // Функция создания карточки
    function createPairItem() {
        const pairItem = document.createElement('div');
        const pairId = 'pair_' + Date.now();
        pairItem.className = 'pair-item new';
        pairItem.dataset.id = pairId;
        pairItem.innerHTML = `
            <div class="exchanges">
                <div class="buy-exchange">
                    <span class="exchange-name">Binance</span>
                    <span class="exchange-price">$50,000</span>
                </div>
                <div class="sell-exchange">
                    <span class="exchange-name">Kraken</span>
                    <span class="exchange-price">$49,800</span>
                </div>
            </div>
            <div class="pair-details">
                <div class="pair-info">
                    <div class="pair-network-group">
                        <div class="info-item">
                            <span class="label">Пара</span>
                            <span class="value">BTC/USDT</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Сеть</span>
                            <span class="value">BTC</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="label">Спред</span>
                        <span class="value">0.4%</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Комиссия</span>
                        <span class="value">0.001 BTC</span>
                    </div>
                    <div class="info-item price-buy">
                        <span class="label">Цена покупки</span>
                        <span class="value">$50,000</span>
                    </div>
                    <div class="info-item price-sell">
                        <span class="label">Цена продажи</span>
                        <span class="value">$49,800</span>
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
        pinIcon.addEventListener('click', () => {
            const isPinned = pinIcon.classList.contains('pinned');
            if (isPinned) {
                pinIcon.classList.remove('pinned');
                pinIcon.style.color = '#666';
                pairItem.style.order = '0';
                const pinnedPairs = JSON.parse(localStorage.getItem('pinnedPairs') || '[]');
                localStorage.setItem('pinnedPairs', JSON.stringify(pinnedPairs.filter(id => id !== pairId)));
            } else {
                pinIcon.classList.add('pinned');
                pinIcon.style.color = '#2196F3';
                pairItem.style.order = '-1';
                const pinnedPairs = JSON.parse(localStorage.getItem('pinnedPairs') || '[]');
                pinnedPairs.push(pairId);
                localStorage.setItem('pinnedPairs', JSON.stringify(pinnedPairs));
            }
        });

        // Проверяем, была ли карточка закреплена ранее
        const pinnedPairs = JSON.parse(localStorage.getItem('pinnedPairs') || '[]');
        if (pinnedPairs.includes(pairId)) {
            pinIcon.classList.add('pinned');
            pinIcon.style.color = '#2196F3';
            pairItem.style.order = '-1';
        }

        setTimeout(() => {
            pairItem.classList.remove('new');
        }, 500);

        return pairItem;
    }
});
