// 22_modCalc.js

document.addEventListener("DOMContentLoaded", () => {
  // 「計算実行」ボタンにクリックイベントを設定
  document.getElementById("buttonRunCalc").addEventListener("click", () => {
    // スロット数と装備条件のデータを取得
    const slotNum = parseInt(document.getElementById("inputSlotNum").value, 10);
    const mainInputs = getTableInputsData();
    // 「なし」を必ず追加、★平均値改修補正対策
    mainInputs[0] = { nameA: "なし", nameB: "なし", imp: 0, min: 0, max: slotNum };
    // 装備種類数を取得
    const equipKindsCounts = Object.keys(mainInputs).length;

    // 結果出力用の表を生成（No.、連番）※将来的にはソート後に付け加えるイメージ
    // let mainOutputsTable = [["No."]];
    // for(let i = 0; i < combinationsWithRepetition(equipKindsCounts, slotNum); i++){mainOutputsTable.push([i+1]);}

    // 重複組み合わせ表を生成（連番表記）
    let serialCombiArray = generateCombinationsWithRepetitionArray(equipKindsCounts, slotNum);
    // 各No.の装備の上下限でフィルタリング
    serialCombiArray = filterByLimits(serialCombiArray, mainInputs);

    // 装備名表記に変換
    let equipNameCombiArray = convertSerialToEquipNames(serialCombiArray, mainInputs);
    let tableMainOutputs = equipNameCombiArray; // 装備名表記に直してからメインの出力表へ
    // 列名を追加
    let tableMainOutputsHeader = [];
    for(let i = 0; i < slotNum; i++){
      tableMainOutputsHeader.push(`装備${i + 1}`);
    }

    // 各行について
    for(let i = 0; i < serialCombiArray.length; i++) {
      let row = serialCombiArray[i];
      let tempEquipCounts = {};
      let tempImpCounts = {};
      for(let j = 0; j < row.length; j++) {
        let equipSerial = row[j];
        let equipName = mainInputs[equipSerial].nameB;
        let equipImp = mainInputs[equipSerial].imp;
        tempEquipCounts[equipName] = (tempEquipCounts[equipName] || 0) + 1; // 装備の出現回数をカウント
        tempImpCounts[equipName] = (tempImpCounts[equipName] || 0) + equipImp; // 改修の合計値をカウント
      }
      // 補正値算出で使う形に変換
      let equipCounts = {};
      // 改修補正値は先に準備
      let listOfLandingCraftGroup = ["大発", "陸戦隊", "特大発", "士魂", "M4A1", "装甲艇", "武装大発", "2号アフリカ", "ホニ", "3号アフリカ", "チハ", "チハ改", "3号J型"];
      let countsLandingCraftGroup = listOfLandingCraftGroup.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0);
      let impLandingCraftGroup = listOfLandingCraftGroup.reduce((sum, key) => sum + (tempImpCounts[key] || 0), 0);
      let listOfTokuYonGroup = ["特四内火", "特四内火改"];
      let countsTokuYonGroup = listOfTokuYonGroup.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0);
      let impTokuYonGroup = listOfTokuYonGroup.reduce((sum, key) => sum + (tempImpCounts[key] || 0), 0);
      let impModLandingCraftGroup = 1 + (countsLandingCraftGroup ? impLandingCraftGroup / countsLandingCraftGroup / 50 : 0) + (countsTokuYonGroup ? impTokuYonGroup / countsTokuYonGroup / 50 : 0);
      let listOfTokuNiGroup = ["特二内火"];
      let countsTokuNiGroup = listOfTokuNiGroup.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0);
      let impTokuNiGroup = listOfTokuNiGroup.reduce((sum, key) => sum + (tempImpCounts[key] || 0), 0);
      let impModTokuNiGroup = 1 + (countsTokuNiGroup ? impTokuNiGroup / countsTokuNiGroup / 30 : 0);
      // メイン乗算補正
      addGroupCount(equipCounts, tempEquipCounts, "三式弾Gr", ["三式弾", "三式弾改", "三式弾改二"]);
      addGroupCount(equipCounts, tempEquipCounts, "徹甲弾Gr", ["九一徹甲", "一式徹甲", "一式徹甲改"]);
      addGroupCount(equipCounts, tempEquipCounts, "WG", ["WG"]);
      addGroupCount(equipCounts, tempEquipCounts, "四式噴進Gr", ["四式噴進", "四式噴進集中"]);
      addGroupCount(equipCounts, tempEquipCounts, "二式迫撃Gr", ["二式迫撃", "二式迫撃集中"]);
        // 上陸用舟艇関係
      addGroupCount(equipCounts, tempEquipCounts, "上陸用舟艇&特四&陸戦部隊Gr", ["大発", "陸戦隊", "特大発", "士魂", "M4A1", "装甲艇", "武装大発", "2号アフリカ", "ホニ", "3号アフリカ", "チハ", "チハ改", "3号J型", "特四内火", "特四内火改", "歩兵", "チハ戦車", "チハ改戦車", "歩兵チハ改"]);
      addGroupCount(equipCounts, tempEquipCounts, "特大発Gr", ["特大発", "3号アフリカ", "3号J型", "歩兵", "歩兵チハ改"]);
      addGroupCount(equipCounts, tempEquipCounts, "M4A1Gr", ["M4A1", "チハ改", "3号J型", "チハ改戦車", "歩兵チハ改"]);
      addGroupCount(equipCounts, tempEquipCounts, "陸戦隊Gr1", ["陸戦隊", "ホニ", "3号アフリカ", "3号J型", "歩兵", "歩兵チハ改"]);
      addGroupCount(equipCounts, tempEquipCounts, "陸戦隊Gr2", ["陸戦隊", "ホニ", "3号アフリカ", "チハ", "チハ改", "3号J型", "歩兵", "チハ戦車", "チハ改戦車", "歩兵チハ改"]);
      addGroupCount(equipCounts, tempEquipCounts, "2号アフリカ", ["2号アフリカ"]);
      addGroupCount(equipCounts, tempEquipCounts, "装甲艇&武装大発Gr", ["装甲艇", "武装大発"]);
      addGroupCount(equipCounts, tempEquipCounts, "特四内火Gr", ["特四内火", "特四内火改"]); // 特殊大発系の共通追加補正のNo.14でも使う
      let total = Math.max(equipCounts["装甲艇&武装大発Gr"] || 0, equipCounts["特四内火Gr"] || 0);
      if (total > 0) {
        equipCounts["装甲艇&武装大発or特四内火Gr"] = total;
      }
        // 内火艇関係
      addGroupCount(equipCounts, tempEquipCounts, "特二内火", ["特二内火"]);
      addGroupCount(equipCounts, tempEquipCounts, "特四内火改", ["特四内火改"]); // 特殊大発系の共通追加補正のNo.13,15でも使う
      total = Math.max(equipCounts["特二内火"] || 0, equipCounts["特四内火改"] * 2 || 0);
      if (total > 0) {
        equipCounts["特二内火or特四内火改*2Gr"] = total;
      }
        // 陸戦部隊関係
      addGroupCount(equipCounts, tempEquipCounts, "陸戦部隊Gr", ["歩兵", "チハ戦車", "チハ改戦車", "歩兵チハ改"]);
        // 航空機関係
      addGroupCount(equipCounts, tempEquipCounts, "水戦/爆", ["水戦/爆"]);
      addGroupCount(equipCounts, tempEquipCounts, "艦爆", ["艦爆"]);

      // 特殊大発系の共通追加補正
      addGroupCount(equipCounts, tempEquipCounts, "士魂Gr", ["士魂", "ホニ", "3号アフリカ", "3号J型"]); // No.1
      addGroupCount(equipCounts, tempEquipCounts, "M4A1", ["M4A1"]); // No.2
      addGroupCount(equipCounts, tempEquipCounts, "ホニ", ["ホニ"]); // No.3
      addGroupCount(equipCounts, tempEquipCounts, "チハ", ["チハ"]); // No.4
      addGroupCount(equipCounts, tempEquipCounts, "チハ改", ["チハ改"]); // No.5
      addGroupCount(equipCounts, tempEquipCounts, "歩兵Gr", ["歩兵", "歩兵チハ改"]); // No.6
      addGroupCount(equipCounts, tempEquipCounts, "チハ戦車Gr", ["チハ戦車", "チハ改戦車"]); // No.7
      addGroupCount(equipCounts, tempEquipCounts, "チハ改戦車", ["チハ改戦車"]); // No.8
      addGroupCount(equipCounts, tempEquipCounts, "歩兵チハ改", ["歩兵チハ改"]); // No.9
      // No.10～13
      // ベースの陸戦部隊はメイン乗算補正の方でカウント済み
      addGroupCount(equipCounts, tempEquipCounts, "内火&歩兵&チハ戦車Gr", ["特二内火", "特四内火", "特四内火改", "歩兵", "チハ戦車", "チハ改戦車"]); // No.11
      addGroupCount(equipCounts, tempEquipCounts, "特四内火", ["特四内火"]); // No.12
      // No.13はメイン乗算補正の方でカウント済み
      // No.14はメイン乗算補正の方でカウント済み
      // No.15はNo.13でカウント済み

      // 大発系シナジー補正
      addGroupCount(equipCounts, tempEquipCounts, "武装大発", ["武装大発"]); // Aグループ
      addGroupCount(equipCounts, tempEquipCounts, "装甲艇", ["装甲艇"]); // Bグループ
      addGroupCount(equipCounts, tempEquipCounts, "シナジーCGr", ["大発", "陸戦隊", "特大発", "2号アフリカ", "ホニ", "3号J型", "特四内火", "特四内火改"]); // Cグループ
      addGroupCount(equipCounts, tempEquipCounts, "シナジーDGr", ["士魂", "3号アフリカ", "チハ", "チハ改", "3号J型", "特二内火"]); // Dグループ

      // メイン加算補正
      // WGはメイン乗算補正でカウント済み
      addGroupCount(equipCounts, tempEquipCounts, "四式噴進", ["四式噴進"]);
      addGroupCount(equipCounts, tempEquipCounts, "四式噴進集中", ["四式噴進集中"]);
      addGroupCount(equipCounts, tempEquipCounts, "二式迫撃", ["二式迫撃"]);
      addGroupCount(equipCounts, tempEquipCounts, "二式迫撃集中", ["二式迫撃集中"]);

      // キャップ後乗算補正
      // 三式弾Grはメイン乗算補正でカウント済み
      // WGはメイン乗算補正でカウント済み
      // 四式噴進Grはメイン乗算補正でカウント済み
      // 二式迫撃Grはメイン乗算補正でカウント済み
        // 上陸用舟艇関係
        // 上陸用舟艇&特四&陸戦部隊Grはメイン乗算補正でカウント済み
        // 特大発Grはメイン乗算補正でカウント済み
        // M4A1Grはメイン乗算補正でカウント済み
        // 陸戦隊Gr1,2はメイン乗算補正でカウント済み
      addGroupCount(equipCounts, tempEquipCounts, "士魂Gr&歩兵Gr", ["士魂", "ホニ", "3号アフリカ", "3号J型", "歩兵", "歩兵チハ改"]);
        // 2号アフリカはメイン乗算補正でカウント済み
        // 装甲艇&武装大発Grはメイン乗算補正でカウント済み
        // 装甲艇&武装大発or特四内火Grはメイン乗算補正でカウント済み
        // 内火艇関係はメイン乗算補正でカウント済み
        // 陸戦部隊関係はメイン乗算補正でカウント済み
        // 艦爆&噴式機関係
        // 水戦/爆はメイン乗算補正でカウント済み
      addGroupCount(equipCounts, tempEquipCounts, "艦爆&噴式機Gr", ["艦爆", "噴式機"]);
      total = Math.max(tempEquipCounts["艦爆"] || 0, tempEquipCounts["噴式機"] * 2 || 0);
      if(total > 0) {
        equipCounts["艦爆&噴式機Gr2"] = total;
      }
      // デバッグ用出力
      console.log(`temp_Row ${i + 1}:`, row, tempEquipCounts, equipCounts, impModLandingCraftGroup, impModTokuNiGroup);
    }




    // 連番を追加
    for(let i = 0; i < tableMainOutputs.length; i++){
      tableMainOutputs[i].unshift(i + 1); // 1から始まる連番を追加
    }
    tableMainOutputsHeader.unshift("No."); // ヘッダーに「No.」を追加

    // 計算結果の表を表示
    tableMainOutputs.unshift(tableMainOutputsHeader);
    let container = document.getElementById("tableMainOutputs");
    container.innerHTML = ""; // ここで以前の表を削除！
    container.appendChild(createTable(tableMainOutputs));
  });
});

// 以下関数置き場
// 列追加・配列結合
function appendColumns(base, extras) {
  for (let i = 0; i < base.length; i++) {
    base[i].push(...extras[i]);
  }
  return base;
}

// 装備条件の表を取得
function getTableInputsData() {
  const table = document.getElementById("tableMainInputs").querySelector("table");
  const result = {};

  const rows = table.querySelectorAll("tr");

  // 最初の行はヘッダーなのでスキップ（i=1から）
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td");

    let serial = cells[0].querySelector("input").value;
    let nameA = cells[1].querySelector("input").value;
    let nameB = cells[2].querySelector("select").value;
    let imp = parseInt(cells[3].querySelector("input").value, 10);
    let min = parseInt(cells[4].querySelector("input").value, 10);
    let max = parseInt(cells[5].querySelector("input").value, 10);

    result[serial] = { nameA, nameB, imp, min, max };
  }

  return result;
}

// 重複組み合わせ（nHr）の計算
// n: 装備種類数, r: スロット数
function combinationsWithRepetition(n, r) {
  function factorial(k) {
    return k <= 1 ? 1 : k * factorial(k - 1);
  }
  return factorial(n + r - 1) / (factorial(r) * factorial(n - 1));
}


// 重複組み合わせのID表を生成
function generateCombinationsWithRepetitionArray(n, r) {
  let result = [];
  let result_i = Array(r).fill(0); // 装備無し行
  result.push([...result_i]); // 装備無し行をコピーして追加
  const totalRows = combinationsWithRepetition(n, r);

  for(let i = 1; i < totalRows; i++) {
    let m = 0;
    while (m < r) {
        if (result_i.slice(m, r).every(val => val === result_i[m])) {
          result_i[m] += 1;
          for (let j = m + 1; j < r; j++) {
            result_i[j] = 0;
          }
          break;
        }
        m++;
      }
    result.push([...result_i]); // 配列のコピーを追加
  }

  return result;
}

// 連番表記から装備名表記へ変換
function convertSerialToEquipNames(array, mainInputs) {
  result = [];
  for(let i =0; i < array.length; i++) {
    let row = [];
    for(let j = 0; j < array[i].length; j++ ) {
      let equipSerial = array[i][j];
      let equipName = mainInputs[equipSerial].nameA;
      row.push(equipName);
    }
    result.push(row);
  }
  return result;
}

// 各No.の装備の上下限でフィルタリング
function filterByLimits(serialNumberArray, mainInputs) {
  // 出力用の配列を初期化
  let result = [];
  // 各行でfor文を回す
  for(let i = 0; i < serialNumberArray.length; i++) {
    // 各装備の出現回数をカウントするリストを初期化
    let countsList =  Array(Object.keys(mainInputs).length).fill(0);
    // 各装備の出現回数をカウント
    for(let j = 0; j < serialNumberArray[i].length; j++) {
      countsList[serialNumberArray[i][j]]++;
    }
    // countsListの各装備の出現回数が、mainInputsのmin, maxに収まっているかチェック
    let isValid = true;
    for(let k = 0; k < countsList.length; k++) {
      // 装備の出現回数がmin, maxの範囲外ならば
      if (countsList[k] < mainInputs[k].min || countsList[k] > mainInputs[k].max) {
        isValid = false;
        break;
      }
    }

    // 判定に応じて push
    if (isValid) {
      result.push(serialNumberArray[i]);
    }
  }
  return result;
}

// とりあえずで定数定義してみる。乗算加算両方あるとこはリストの中要素増やしていくイメージ
const paramsBasicBonusA = {
  "ソフトスキン型": {
    "三式弾Gr": {"a": [2.5]},
    "WG": {"a": [1.3, 1.82]}
  },
  "砲台型": {
    "徹甲弾Gr": {"a": [1.85]}
  }
}

// グループの合計値を計算して追加
// target: 出力先のオブジェクト, source: 入力元のオブジェクト, groupName: グループ名, keys: 対象のキーのリスト
function addGroupCount(target, source, groupName, keys) {
  const total = keys.reduce((sum, key) => sum + (source[key] || 0), 0);
  if (total > 0) {
    target[groupName] = total;
  }
}

// 改修値の合計値を計算して追加
// target: 出力先のオブジェクト, source: 入力元のオbject, groupName: グループ名, keys: 対象のキーのリスト
function addGroupImpCount(target, source, groupName, keys) {
  const hasHit = keys.some(key => source[key] !== undefined);
  if (!hasHit) return;

  const total = keys.reduce((sum, key) => sum + (source[key] || 0), 0);
  target[groupName] = total;
}