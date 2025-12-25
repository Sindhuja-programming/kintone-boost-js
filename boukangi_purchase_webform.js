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

  kb.ready(function (kb) {

    const typeField = kb.field('種類');
    const sizeField = kb.field('サイズ_Web');
    const costField = kb.field('個人負担');

    if (!typeField || !sizeField) return;

    // Clear size initially
    sizeField.setOptions(['----']);
    sizeField.setValue('');

    typeField.on('change', function () {
      const type = typeField.getValue();

      sizeField.setValue('');
      costField.setValue('');

      if (!DATA[type]) {
        sizeField.setOptions(['----']);
        return;
      }

      sizeField.setOptions(
        ['----'].concat(Object.keys(DATA[type]))
      );
    });

    sizeField.on('change', function () {
      const type = typeField.getValue();
      const size = sizeField.getValue();

      if (DATA[type] && DATA[type][size]) {
        costField.setValue(DATA[type][size]);
      }
    });

  });

})();
