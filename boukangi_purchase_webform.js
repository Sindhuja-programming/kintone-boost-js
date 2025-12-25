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

  // Wait until Web Form is rendered
  setTimeout(function () {

    const typeInput = document.querySelector('[data-field-code="種類"] input');
    const sizeInput = document.querySelector('[data-field-code="サイズ_Web"] input');
    const costInput = document.querySelector('[data-field-code="個人負担"] input');

    if (!typeInput || !sizeInput) {
      console.error('Web form fields not found');
      return;
    }

    // Create datalist for サイズ
    const datalist = document.createElement('datalist');
    datalist.id = 'size_list';
    document.body.appendChild(datalist);
    sizeInput.setAttribute('list', 'size_list');

    // Clear size & cost
    sizeInput.value = '';
    if (costInput) costInput.value = '';

    // When 種類 changes
    typeInput.addEventListener('change', function () {
      const type = this.value;

      datalist.innerHTML = '';
      sizeInput.value = '';
      if (costInput) costInput.value = '';

      if (!DATA[type]) return;

      Object.keys(DATA[type]).forEach(function (size) {
        const option = document.createElement('option');
        option.value = size;
        datalist.appendChild(option);
      });
    });

    // When サイズ changes → set 個人負担
    sizeInput.addEventListener('change', function () {
      const type = typeInput.value;
      const size = this.value;

      if (DATA[type] && DATA[type][size] && costInput) {
        costInput.value = DATA[type][size];
      }
    });

  }, 800); // delay is REQUIRED for Booster

})();
