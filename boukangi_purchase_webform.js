(function () {
  "use strict";

  /* ========= COMMON DATA ========= */
  const sizeMapping = {
    "ジャンパー": ["S", "M", "L", "2L", "3L"],
    "防寒ベスト": ["M", "L", "2L", "3L", "4L", "5L"],
    "ファンセット付": ["S", "M", "L", "2L", "3L"],
    "ベストのみ": ["S", "M", "L", "2L", "3L"],
    "ファンセットのみ": ["ファンセットのみ"]
  };

  const clothTypeMapping = {
    "ジャンパー": sizeMapping["ジャンパー"],
    "防寒ベスト": sizeMapping["防寒ベスト"],
    "空調服": [].concat(
      sizeMapping["ファンセット付"],
      sizeMapping["ベストのみ"],
      sizeMapping["ファンセットのみ"]
    )
  };

  function getSizes(kind) {
    if (!kind || kind === "----") {
      return Object.values(clothTypeMapping).flat();
    }
    return clothTypeMapping[kind] || [];
  }

  /* ========= PC + NORMAL MOBILE ========= */
  if (typeof kintone !== "undefined" && kintone.events) {
    kintone.events.on(
      [
        "app.record.create.show",
        "app.record.edit.show",
        "app.record.create.change.種類",
        "app.record.edit.change.種類"
      ],
      function (event) {

        const record = event.record;
        const kind = record["種類"].value;
        const sizeField = record["サイズ"];

        const sizes = getSizes(kind);

        sizeField.options = {};
        sizes.forEach(function (s) {
          sizeField.options[s] = { label: s, value: s };
        });

        return event;
      }
    );
  }

  /* ========= BOOST INJECTOR WEB FORM ========= */
  document.addEventListener("DOMContentLoaded", function () {

    // If Kintone record exists, this is not WEB FORM
    if (typeof kintone !== "undefined" && kintone.app && kintone.app.record) {
      return;
    }

    const kindSelect = document.querySelector('select[name="種類"]');
    const sizeField =
      document.querySelector('input[name="サイズ"], select[name="サイズ"]');

    if (!kindSelect || !sizeField) return;

    function updateWebFormSize() {
      const sizes = getSizes(kindSelect.value);

      if (sizeField.tagName === "SELECT") {
        sizeField.innerHTML = "";
        sizes.forEach(function (s) {
          const opt = document.createElement("option");
          opt.value = s;
          opt.textContent = s;
          sizeField.appendChild(opt);
        });
      } else {
        sizeField.value = "";
        sizeField.placeholder = sizes.join(", ");
      }
    }

    updateWebFormSize();
    kindSelect.addEventListener("change", updateWebFormSize);
  });

})();
