(function () {
  'use strict';

  const DATA = {
    "ジャンパー": {
      "ジャンパー　S": 1000,
      "ジャンパー　M": 1000,
      "ジャンパー　L": 1000,
      "ジャンパー　2L": 1000,
      "ジャンパー　3L": 1000
    },
    "防寒ベスト": {
      "防寒ベスト　M": 1000,
      "防寒ベスト　L": 1000,
      "防寒ベスト　2L": 1000,
      "防寒ベスト　3L": 1000,
      "防寒ベスト　4L": 1000,
      "防寒ベスト　5L": 1000
    },
    "空調服": {
      "ファンセット付　S": 3000,
      "ファンセット付　M": 3000,
      "ファンセット付　L": 3000,
      "ファンセット付　2L": 3000,
      "ファンセット付　3L": 3000,
      "ベストのみ　S": 1000,
      "ベストのみ　M": 1000,
      "ベストのみ　L": 1000,
      "ベストのみ　2L": 1000,
      "ベストのみ　3L": 1000,
      "ファンセットのみ": 2000
    }
  };

  const wait = setInterval(function () {

    const typeWrap = document.querySelector('[data-field-code="種類"]');
    const sizeWrap = document.querySelector('[data-field-code="サイズ_Web"]');
    const costWrap = document.querySelector('[data-field-code="個人負担"]');

    if (!typeWrap || !sizeWrap) return;

    const typeSelect = typeWrap.querySelector('select');
    const sizeSelect = sizeWrap.querySelector('select');
    const costInput = costWrap ? costWrap.querySelector('input') : null;

    if (!typeSelect || !sizeSelect) return;

    clearInterval(wait);

    // Reset size dropdown
    sizeSelect.innerHTML = '<option value="">----</option>';

    const updateSizes = function () {
      const type = typeSelect.value;

      sizeSelect.innerHTML = '<option value="">----</option>';
      if (costInput) costInput.value = '';

      if (!DATA[type]) return;

      Object.keys(DATA[type]).forEach(function (size) {
        const opt = document.createElement('option');
        opt.value = size;
        opt.textContent = size;
        sizeSelect.appendChild(opt);
      });
    };

    // 種類 change (both events for safety)
    typeSelect.addEventListener('change', updateSizes);
    typeSelect.addEventListener('input', updateSizes);

    // サイズ change → 個人負担
    sizeSelect.addEventListener('change', function () {
      const type = typeSelect.value;
      const size = this.value;

      if (DATA[type] && DATA[type][size] && costInput) {
        costInput.value = DATA[type][size];
      }
    });

  }, 300);

})();
