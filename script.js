document.addEventListener('DOMContentLoaded', function() {
    const addPairBtn = document.getElementById('addPairBtn');
    const buyExchangesBtn = document.getElementById('buyExchanges');
    const sellExchangesBtn = document.getElementById('sellExchanges');
    const buyExchangesList = document.getElementById('buyExchangesList');
    const sellExchangesList = document.getElementById('sellExchangesList');
    const pairsContainer = document.getElementById('pairsContainer');
    const viewButtons = document.querySelectorAll('.view-btn');

    // Получение никнейма из Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        const username = window.Telegram.WebApp.initDataUnsafe.user?.username;
        if (username) {
            document.querySelector('.username').textContent = '@' + username;
        }
    }

    // Добавление начальной пары
    pairsContainer.appendChild(createPairItem());

    // Обработчик добавления новой пары
    addPairBtn.addEventListener('click', () => {
        pairsContainer.appendChild(createPairItem());
    });

    // Обработчики выпадающих списков
    buyExchangesBtn.addEventListener('click', () => {
        buyExchangesList.classList.toggle('show');
        sellExchangesList.classList.remove('show');
    });

    sellExchangesBtn.addEventListener('click', () => {
        sellExchangesList.classList.toggle('show');
        buyExchangesList.classList.remove('show');
    });

    // Обработчик переключения видов отображения
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const view = btn.dataset.view;
            
            pairsContainer.classList.add('transitioning');
            
            setTimeout(() => {
                pairsContainer.className = 'pairs-container ' + view;
            }, 50);

            setTimeout(() => {
                pairsContainer.classList.remove('transitioning');
            }, 300);
        });
    });

    // Закрытие выпадающих списков при клике вне них
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.filter-btn') && !event.target.closest('.dropdown-content')) {
            buyExchangesList.classList.remove('show');
            sellExchangesList.classList.remove('show');
        }
    });

    // Функция для работы с закреплением
    function handlePinClick(pinIcon) {
        const pairItem = pinIcon.closest('.pair-item');
        const isPinned = pinIcon.classList.contains('pinned');
        const pairId = pairItem.dataset.id;

        if (isPinned) {
            pinIcon.classList.remove('pinned');
            pinIcon.style.color = '#666';
            pairItem.style.order = '0';
            // Удаляем из localStorage
            const pinnedPairs = JSON.parse(localStorage.getItem('pinnedPairs') || '[]');
            localStorage.setItem('pinnedPairs', JSON.stringify(pinnedPairs.filter(id => id !== pairId)));
        } else {
            pinIcon.classList.add('pinned');
            pinIcon.style.color = '#2196F3';
            pairItem.style.order = '-1';
            // Добавляем в localStorage
            const pinnedPairs = JSON.parse(localStorage.getItem('pinnedPairs') || '[]');
            pinnedPairs.push(pairId);
            localStorage.setItem('pinnedPairs', JSON.stringify(pinnedPairs));
        }
    }

    // Функция создания карточки
    function createPairItem() {
        const pairItem = document.createElement('div');
        const pairId = 'pair_' + Date.now(); // Создаем уникальный ID
        pairItem.className = 'pair-item';
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
                    <div class="info-item">
                        <span class="label">Пара</span>
                        <span class="value">BTC/USDT</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Сеть</span>
                        <span class="value">BTC</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Спред</span>
                        <span class="value">0.4%</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Комиссия</span>
                        <span class="value">0.001 BTC</span>
                    </div>
                    <div class="info-item price-sell">
                        <span class="label">Цена продажи</span>
                        <span class="value">$49,800</span>
                    </div>
                    <div class="info-item price-buy">
                        <span class="label">Цена покупки</span>
                        <span class="value">$50,000</span>
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
        pinIcon.addEventListener('click', () => handlePinClick(pinIcon));

        // Проверяем, была ли карточка закреплена ранее
        const pinnedPairs = JSON.parse(localStorage.getItem('pinnedPairs') || '[]');
        if (pinnedPairs.includes(pairId)) {
            pinIcon.classList.add('pinned');
            pinIcon.style.color = '#2196F3';
            pairItem.style.order = '-1';
        }

        return pairItem;
    }
});
