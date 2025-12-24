(function () {
  "use strict";

  const sizeMapping = {
    "ジャンパー": ["S", "M", "L", "2L", "3L"],
    "防寒ベスト": ["M", "L", "2L", "3L", "4L", "5L"],
    "ファンセット付": ["S", "M", "L", "2L", "3L"],
    "ベストのみ": ["S", "M", "L", "2L", "3L"],
    "ファンセットのみ": ["ファンセットのみ"]
  };

  function getSizes(kind) {
    if (!kind || kind === "----") {
      return Object.values(sizeMapping).flat();
    }
    return sizeMapping[kind] || [];
  }

  document.addEventListener("DOMContentLoaded", function () {

    const kindSelect =
      document.querySelector('select[name="kinds"], select[name="種類"]');
    const sizeField =
      document.querySelector('input[name="サイズ"], select[name="サイズ"]');

    if (!kindSelect || !sizeField) return;

    function updateSize() {
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

    updateSize();
    kindSelect.addEventListener("change", updateSize);
  });

})();
