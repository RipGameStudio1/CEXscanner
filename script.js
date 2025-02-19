document.addEventListener('DOMContentLoaded', function() {
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
            <div class="buy-exchange">
                <strong>Binance</strong>
                <div>$50,000</div>
            </div>
            <div class="sell-exchange">
                <strong>Kraken</strong>
                <div>$49,800</div>
            </div>
            <div class="pair-details">
                <span>BTC/USDT</span>
                <span>Спред: 0.4%</span>
                <span>Сеть: BTC</span>
                <span>Комиссия: 0.001 BTC</span>
            </div>
        `;
        return pairItem;
    }

    // Add initial items
    for (let i = 0; i < 5; i++) {
        pairsContainer.appendChild(createPairItem());
    }
});
