(function () {
  "use strict";

  const sizeMapping = {
    "ジャンパー": ["S", "M", "L", "2L", "3L"],
    "防寒ベスト": ["M", "L", "2L", "3L", "4L", "5L"],
    "空調服": ["S", "M", "L", "2L", "3L"]
  };

  document.addEventListener("DOMContentLoaded", function () {
    const kindSelect = document.querySelector('select[name="種類"]');
    const sizeInput = document.querySelector('input[name="サイズ"]');

    if (!kindSelect || !sizeInput) return;

    function updateSizeHint() {
      const kind = kindSelect.value;
      const sizes = sizeMapping[kind] || [];

      sizeInput.value = "";
      sizeInput.placeholder =
        sizes.length > 0
          ? "選択可能サイズ: " + sizes.join(", ")
          : "サイズを入力してください";
    }

    kindSelect.addEventListener("change", updateSizeHint);
    updateSizeHint();
  });
})();
