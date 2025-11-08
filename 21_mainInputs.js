// 21_mainInputs.js

const DEBUG_MODE = true;  // ← これがオンのときだけ、デフォルト値を入れる
const defaultSelectValues = [
  "陸戦隊", "士魂", "M4A1", "2号アフリカ", "ホニ",
  "3号アフリカ", "チハ改", "3号J型", "特二内火", "特四内火改"
];
const defaultImpValues = [10, 3, 0, 0, 0, 0, 1, 2, 10, 2];
const defaultMinValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const defaultMaxValues = [6, 1, 1, 2, 3, 1, 1, 1, 3, 1];


// プルダウンで参照するリスト
const options = ["なし", "三式弾", "三式弾改", "三式弾改二", "九一徹甲", "一式徹甲", "一式徹甲改", "WG", "四式噴進", "四式噴進集中", "二式迫撃", "二式迫撃集中", "大発", "陸戦隊", "特大発", "士魂", "M4A1", "装甲艇", "武装大発", "2号アフリカ", "ホニ", "3号アフリカ", "チハ", "チハ改", "3号J型", "特二内火", "特四内火", "特四内火改", "歩兵", "チハ戦車", "チハ改戦車", "歩兵チハ改", "気球", "水戦/爆", "艦爆", "噴式機"]

// 表を構成するデータを生成し、createTable() で使う
function generateTableMainInputsData(rows = 10, selectedRows = []) {
  const data = [["", "", "装備名", "改修", "min", "max"]]; // ヘッダー

  for (let i = 0; i < rows; i++) {
    // 1列目　連番
    const indexSerialNum = document.createElement("input");
    indexSerialNum.type = "number";
    indexSerialNum.readOnly = true;
    indexSerialNum.value = i + 1;

    // 2列目　装備名★改修
    // 後で

    // 3列目　装備名　プルダウンメニュー
    const selectEquipName = document.createElement("select");
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      selectEquipName.appendChild(option);
    });

    // 4列目　改修
    const inputImpNum = document.createElement("input");
    inputImpNum.type = "number";
    inputImpNum.min = 0;
    inputImpNum.max = 10;
    inputImpNum.value = 0; // 初期値

    // 5列目　最小値
    const inputMinValue = document.createElement("input");
    inputMinValue.type = "number";
    inputMinValue.min = 0;
    inputMinValue.value = 0; // 初期値

    // 6列目　最大値
    const inputMaxValue = document.createElement("input");
    inputMaxValue.type = "number";
    inputMaxValue.min = 0;
    inputMaxValue.value = 6; // 初期値

    // デフォルト値を設定（DEBUG_MODEがオンのときだけ）
    if (DEBUG_MODE && i < defaultSelectValues.length) {
      selectEquipName.value = defaultSelectValues[i];
      inputImpNum.value = defaultImpValues[i];
      inputMinValue.value = defaultMinValues[i];
      inputMaxValue.value = defaultMaxValues[i];
    }

    // selectedRowsから値を取得して反映
    if (selectedRows[i]) {
      // 選択行があれば反映
      selectEquipName.value = selectedRows[i].equipName;
      inputImpNum.value = selectedRows[i].level;
      inputMaxValue.value = selectedRows[i].count;
    }

    // 2列目　装備名★改修
    const inputEquipNameAndImpNum = document.createElement("input");
    inputEquipNameAndImpNum.type = "text";
    inputEquipNameAndImpNum.readOnly = true;
    inputEquipNameAndImpNum.value = `${selectEquipName.value}${inputImpNum.value != 0 ? `★${inputImpNum.value}` : ''}`;

    // プルダウン変更時の挙動
    selectEquipName.addEventListener("change", () => {
        inputEquipNameAndImpNum.value = `${selectEquipName.value}${inputImpNum.value != 0 ? `★${inputImpNum.value}` : ''}`;
    });
    // 改修入力変更時の挙動
    inputImpNum.addEventListener("input", () => {
        inputEquipNameAndImpNum.value = `${selectEquipName.value}${inputImpNum.value != 0 ? `★${inputImpNum.value}` : ''}`;
    });

    // 1行分のデータとして追加（要素ごと）
    data.push([indexSerialNum, inputEquipNameAndImpNum, selectEquipName, inputImpNum, inputMinValue, inputMaxValue]);
  }

  return data;
}

// 表を表示
const tableMainInputsData = generateTableMainInputsData(10);
document.getElementById("tableMainInputs").appendChild(createTable(tableMainInputsData));
