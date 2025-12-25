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

    const typeInput = document.querySelector('input[name="種類"]');
    const sizeInput = document.querySelector('input[name="サイズ_Web"]');
    const costInput = document.querySelector('input[name="個人負担"]');

    if (!typeInput || !sizeInput) return;

    clearInterval(wait);

    const datalist = document.createElement('datalist');
    datalist.id = 'size_list';
    document.body.appendChild(datalist);
    sizeInput.setAttribute('list', 'size_list');

    sizeInput.value = '';
    if (costInput) costInput.value = '';

    // ✅ USE input event
    typeInput.addEventListener('input', function () {
      const type = this.value;

      datalist.innerHTML = '';
      sizeInput.value = '';
      if (costInput) costInput.value = '';

      if (!DATA[type]) return;

      Object.keys(DATA[type]).forEach(function (size) {
        const opt = document.createElement('option');
        opt.value = size;
        datalist.appendChild(opt);
      });
    });

    sizeInput.addEventListener('input', function () {
      const type = typeInput.value;
      const size = this.value;

      if (DATA[type] && DATA[type][size] && costInput) {
        costInput.value = DATA[type][size];
      }
    });

  }, 300);

})();
