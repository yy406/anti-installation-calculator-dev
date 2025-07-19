// プルダウンで参照するリスト
const options = ["なし", "三式弾", "三式弾改", "三式弾改二", "九一徹甲", "一式徹甲", "一式徹甲改", "WG", "四式噴進", "四式噴進集中", "二式迫撃", "二式迫撃集中", "大発", "陸戦隊", "特大発", "士魂", "M4A1", "装甲艇", "武装大発", "2号アフリカ", "ホニ", "3号アフリカ", "チハ", "チハ改", "3号J型", "特二内火", "特四内火", "特四内火改", "歩兵", "チハ戦車", "チハ改戦車", "歩兵チハ改", "気球", "水戦/爆", "艦爆", "噴式機"]


// 表を構成するデータを生成し、createTable() で使う
function generateMainInputTableData(rows = 10) {
  const data = [["", "", "装備名", "改修", "min", "max"]]; // ヘッダー

  for (let i = 0; i < rows; i++) {
    // 1列目　連番
    const indexCell = document.createElement("input");
    indexCell.type = "number";
    indexCell.readOnly = true;
    indexCell.value = i + 1;

    // 2列目　装備名★改修
    // 後で

    // 3列目　装備名　プルダウンメニュー
    const select = document.createElement("select");
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });

    // 4列目　改修
    const impNum = document.createElement("input");
    impNum.type = "number";
    impNum.min = 0;
    impNum.max = 10;
    impNum.value = 0; // 初期値

    // 5列目　最小値
    const minInput = document.createElement("input");
    minInput.type = "number";
    minInput.min = 0;
    minInput.value = 0; // 初期値

    // 6列目　最大値
    const maxInput = document.createElement("input");
    maxInput.type = "number";
    maxInput.min = 0;
    maxInput.value = 6; // 初期値

    // 2列目　装備名★改修
    const selectedAndImpNum = document.createElement("input");
    selectedAndImpNum.type = "text";
    selectedAndImpNum.readOnly = true;
    selectedAndImpNum.value = `${select.value}${impNum.value != 0 ? `★${impNum.value}` : ''}`;

    // プルダウン変更時の挙動
    select.addEventListener("change", () => {
        const selected = select.value;
        selectedAndImpNum.value = `${select.value}${impNum.value != 0 ? `★${impNum.value}` : ''}`;
    });
    // 改修入力変更時の挙動を追加
    impNum.addEventListener("input", () => {
        selectedAndImpNum.value = `${select.value}${impNum.value != 0 ? `★${impNum.value}` : ''}`;
    });

    // 1行分のデータとして追加（要素ごと）
    data.push([indexCell, selectedAndImpNum, select, impNum, minInput, maxInput]);
  }

  return data;
}

// 表を表示
const tableData = generateMainInputTableData(10);
document.getElementById("tableMainInputs").appendChild(createTable(tableData));
