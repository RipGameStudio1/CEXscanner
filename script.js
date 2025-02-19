document.addEventListener('DOMContentLoaded', function() {
    const addPairBtn = document.getElementById('addPairBtn');
         addPairBtn.addEventListener('click', () => {
         pairsContainer.appendChild(createPairItem());
    });
    const buyExchangesBtn = document.getElementById('buyExchanges');
    const sellExchangesBtn = document.getElementById('sellExchanges');
    const buyExchangesList = document.getElementById('buyExchangesList');
    const sellExchangesList = document.getElementById('sellExchangesList');
    const pairsContainer = document.getElementById('pairsContainer');
    const viewButtons = document.querySelectorAll('.view-btn');

    // Toggle dropdowns
    buyExchangesBtn.addEventListener('click', () => {
        buyExchangesList.classList.toggle('show');
        sellExchangesList.classList.remove('show');
    });

    sellExchangesBtn.addEventListener('click', () => {
        sellExchangesList.classList.toggle('show');
        buyExchangesList.classList.remove('show');
    });

    // View toggle
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const view = btn.dataset.view;
            pairsContainer.className = 'pairs-container ' + view;
        });
    });

    // Create initial pairs
     	function createPairItem() {
    const pairItem = document.createElement('div');
    pairItem.className = 'pair-item';
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
            </div>
            <div class="bottom-info">
                <span class="pair-timer">15с</span>
                <span class="material-icons pin-icon">push_pin</span>
            </div>
        </div>
    `;
    return pairItem;
}
});

function createPairItem() {
    const pairItem = document.createElement('div');
    pairItem.className = 'pair-item';
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
                <div class="info-item">
                    <span class="buy-price price-info">$50,000</span>
                </div>
                <div class="info-item">
                    <span class="sell-price price-info">$49,800</span>
                </div>
            </div>
            <div class="bottom-info">
                <span class="pair-timer">15с</span>
                <span class="material-icons pin-icon">push_pin</span>
            </div>
        </div>
    `;
    return pairItem;
}
