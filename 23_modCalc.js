document.addEventListener("DOMContentLoaded", () => {
  // 「計算実行」ボタンにクリックイベントを設定
  document.getElementById("runCalcBtn").addEventListener("click", () => {
    // スロット数と装備条件のデータを取得
    const slotNum = getSlotNum();
    const mainInputs = getMainInputTableData();
  });
});

/**
 * 対地スロット数の値を取得する関数
 * @returns {number} スロット数（整数）
 */
function getSlotNum() {
  return parseInt(document.getElementById("inputSlotNum").value, 10);
}

// 装備条件の表を取得
function getMainInputTableData() {
  const table = document.getElementById("tableMainInputs").querySelector("table");
  const result = {};

  const rows = table.querySelectorAll("tr");

  // 最初の行はヘッダーなのでスキップ（i=1から）
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td");

    var id = cells[0].querySelector("input").value;
    var nameA = cells[1].querySelector("input").value;
    var nameB = cells[2].querySelector("select").value;
    var imp = parseInt(cells[3].querySelector("input").value, 10);
    var min = parseInt(cells[4].querySelector("input").value, 10);
    var max = parseInt(cells[5].querySelector("input").value, 10);
    if (nameB === "") {
        nameA = `${"なし"}${imp != 0 ? `★${imp}` : ''}`;
        nameB = "なし";
    }

    result[id] = { nameA, nameB, imp, min, max };
  }

  return result;
}
