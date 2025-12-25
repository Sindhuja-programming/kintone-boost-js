(function () {
  'use strict';

  // ✅ TEST 1: JS file loaded
  console.log('✅ WebForm JS file loaded');
  alert('JS FILE LOADED'); // temporary

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

    console.log('⏳ Checking for fields...');

    const typeInput = document.querySelector('input[name="種類"]');
    const sizeInput = document.querySelector('input[name="サイズ_Web"]');
    const costInput = document.querySelector('input[name="個人負担"]');

    console.log('種類 field:', typeInput);
    console.log('サイズ_Web field:', sizeInput);
    console.log('個人負担 field:', costInput);

    if (!typeInput || !sizeInput) {
      console.log('❌ Fields not found yet');
      return;
    }

    // ✅ TEST 2: Fields found
    alert('FIELDS FOUND');
    console.log('✅ Fields found, attaching logic');

    clearInterval(wait);

    // Create datalist
    const datalist = document.createElement('datalist');
    datalist.id = 'size_list';
    document.body.appendChild(datalist);
    sizeInput.setAttribute('list', 'size_list');

    console.log('✅ Datalist created');

    // Reset fields
    sizeInput.value = '';
    if (costInput) costInput.value = '';

    // 種類 change
    typeInput.addEventListener('change', function () {
      console.log('🔄 種類 changed:', this.value);
      alert('種類 changed: ' + this.value);

      const type = this.value;

      datalist.innerHTML = '';
      sizeInput.value = '';
      if (costInput) costInput.value = '';

      if (!DATA[type]) {
        console.log('⚠ No data for type:', type);
        return;
      }

      Object.keys(DATA[type]).forEach(function (size) {
        const opt = document.createElement('option');
        opt.value = size;
        datalist.appendChild(opt);
      });

      console.log('✅ Sizes populated');
    });

    // サイズ change
    sizeInput.addEventListener('change', function () {
      console.log('🔄 サイズ changed:', this.value);
      alert('サイズ changed: ' + this.value);

      const type = typeInput.value;
      const size = this.value;

      if (DATA[type] && DATA[type][size] && costInput) {
        costInput.value = DATA[type][size];
        console.log('✅ Cost set:', DATA[type][size]);
      } else {
        console.log('⚠ Cost not found');
      }
    });

  }, 300);

})();
