// 22_modCalc.js
// const enemyModType = "ソフトスキン型"
// const baseFirePower = 70; // 基本攻撃力換算補正用
// const isDay = true;

document.addEventListener("DOMContentLoaded", () => {
  // 「計算実行」ボタンにクリックイベントを設定
  document.getElementById("buttonRunCalc").addEventListener("click", () => {
    // スロット数、装備条件、敵艦タイプ、基本攻撃力、昼戦or夜戦のデータを取得
    const slotNum = parseInt(document.getElementById("inputSlotNum").value, 10);
    const mainInputs = getTableInputsData();
    const enemyModType = document.getElementById("inputEnemyType").value;
    // const baseFirePower = parseInt(document.getElementById("inputBaseFirePower").value, 10);
    const baseFirePower = 1; // 攻撃力計算機能つけるまではFbase=1
    const isDay = document.getElementById("inputIsDay").value === "true";
    // 「なし」を必ず追加、★平均値改修補正対策
    mainInputs[0] = { nameA: "なし", nameB: "なし", imp: 0, min: 0, max: slotNum };
    // 装備種類数を取得
    const equipKindsCounts = Object.keys(mainInputs).length;

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

    // 補正値関係
    let modList = [];
    let modHeaderList = [];
    // 各行について
    for(let i = 0; i < serialCombiArray.length; i++) {
      let row = serialCombiArray[i];
      let tempEquipCounts = {};
      let tempImpCounts = {};
      let modListRow = [];
      for(let j = 0; j < row.length; j++) {
        let equipSerial = row[j];
        let equipName = mainInputs[equipSerial].nameB;
        let equipImp = mainInputs[equipSerial].imp;
        tempEquipCounts[equipName] = (tempEquipCounts[equipName] || 0) + 1; // 装備の出現回数をカウント
        tempImpCounts[equipName] = (tempImpCounts[equipName] || 0) + equipImp; // 改修の合計値をカウント
      }
      // 補正値算出で使う形に変換
      let equipCounts = {};
      let modFlags = {};
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
      let total = Math.max(equipCounts["装甲艇&武装大発Gr"] || 0, ["特四内火", "特四内火改"].reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0));
      if (total > 0) {
        equipCounts["装甲艇&武装大発or特四内火Gr"] = total;
      }
        // 内火艇関係
      addGroupCount(equipCounts, tempEquipCounts, "特二内火", ["特二内火"]);
      total = Math.max(equipCounts["特二内火"] || 0, ["特四内火改"].reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) * 2);
      if (total > 0) {
        equipCounts["特二内火or特四内火改*2Gr"] = total;
      }
        // 陸戦部隊関係
      addGroupCount(equipCounts, tempEquipCounts, "陸戦部隊Gr", ["歩兵", "チハ戦車", "チハ改戦車", "歩兵チハ改"]);
        // 航空機関係
      addGroupCount(equipCounts, tempEquipCounts, "水戦/爆", ["水戦/爆"]);
      addGroupCount(equipCounts, tempEquipCounts, "艦爆", ["艦爆"]);

      // 特殊大発系の共通追加補正
      keys = ["士魂", "ホニ", "3号アフリカ", "3号J型"]; // No.1
      modFlags["士魂Gr"] = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;
      keys = ["M4A1"]; // No.2
      modFlags["M4A1"] = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;
      keys = ["ホニ"]; // No.3
      modFlags["ホニ"] = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;
      keys = ["チハ"]; // No.4
      modFlags["チハ"] = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;
      keys = ["チハ改"]; // No.5
      modFlags["チハ改"] = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;
      keys = ["歩兵", "歩兵チハ改"]; // No.6
      modFlags["歩兵Gr"] = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;
      keys = ["チハ戦車", "チハ改戦車"]; // No.7
      modFlags["チハ戦車Gr"] = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;
      keys = ["チハ改戦車"]; // No.8
      modFlags["チハ改戦車"] = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;
      keys = ["歩兵チハ改"]; // No.9、No.11でも使う
      modFlags["歩兵チハ改"] = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;
      modFlags["陸戦部隊Gr"] = equipCounts["陸戦部隊Gr"] ?? 0 >= 2 ? true : false; // No.10、メイン乗算補正の方でカウント済み
      keys = ["特二内火", "特四内火", "特四内火改", "歩兵", "チハ戦車", "チハ改戦車"]; // No.11
      modFlags["陸戦&内火Gr"] = modFlags["陸戦部隊Gr"] && (modFlags["歩兵チハ改"] || keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 3) ? true : false;
      keys = ["特四内火"]; // No.12
      modFlags["陸戦&特四内火Gr"] = modFlags["陸戦部隊Gr"] && keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;
      keys = ["特四内火改"]; // No.13
      modFlags["陸戦&特四内火改Gr"] = modFlags["陸戦部隊Gr"] && keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;
      keys = ["特四内火", "特四内火改"]; // No.14
      modFlags["特四内火Gr"] = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;
      keys = ["特四内火改"]; // No.15
      modFlags["特四内火改"] = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0) >= 1 ? true : false;

      // 大発系シナジー補正
      keys = ["武装大発"];
      let synergyGroupA = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0);
      keys = ["装甲艇"];
      let synergyGroupB = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0);
      keys = ["大発", "陸戦隊", "特大発", "2号アフリカ", "ホニ", "3号J型", "特四内火", "特四内火改"];
      let synergyGroupC = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0);
      keys = ["士魂", "3号アフリカ", "チハ", "チハ改", "3号J型", "特二内火"];
      let synergyGroupD = keys.reduce((sum, key) => sum + (tempEquipCounts[key] || 0), 0);
      modFlags["シナジー1"] = (synergyGroupA + synergyGroupB == 1) && (synergyGroupC + synergyGroupD >= 1) ? true : false;
      modFlags["シナジー2"] = synergyGroupA >= 1 && synergyGroupB >= 1 && synergyGroupC == 1 && synergyGroupD == 0 ? true : false;
      modFlags["シナジー3"] = synergyGroupA >= 1 && synergyGroupB >= 1 && synergyGroupC == 0 && synergyGroupD == 1 ? true : false;
      modFlags["シナジー4"] = synergyGroupA >= 1 && synergyGroupB >= 1 && (synergyGroupC + synergyGroupD >= 2) ? true : false;

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
      // console.log(`temp_Row ${i + 1}:`, row, tempEquipCounts, equipCounts, impModLandingCraftGroup, impModTokuNiGroup);

      // 補正値算出
      let conversionModValue = baseFirePower;
      // メイン乗算補正
      if (i === 0) modHeaderList.push("メイン乗算"); // 初回のみヘッダー入れる
      let mod = 1;
      if (Object.keys(paramsBasicBonusA).includes(enemyModType)) {
        for (const [key, value] of Object.entries(equipCounts)) {
          let paramList = paramsBasicBonusA[enemyModType]?.[key] ?? [1];
          let index = Math.min(value, paramList.length) - 1;
          let param = paramList[index];
          mod *= typeof param === "function" ? param(impModLandingCraftGroup, impModTokuNiGroup, isDay) : param;
        }
      }
      conversionModValue *= mod;
      modListRow.push(mod);

      // 特殊大発系補正
      for (const bonus of paramsSpecialBonus) {
        const name = bonus.name;
        const values = bonus.values;
        if(modFlags[name]) {
          mod = values;
          conversionModValue = conversionModValue * mod[0] + mod[1]; // 乗算と加算の処理
        }else {
          mod = [1, 0];
        }
        if(i == 0) {
          modHeaderList.push(name + "乗算"); // 初回のみヘッダー入れる
          modHeaderList.push(name + "加算"); // 初回のみヘッダー入れる
        }
        modListRow.push(...mod);
      }

      // 大発系シナジー補正
      if(modFlags["シナジー1"]) {
        mod = paramsSynergyBonus["シナジー1"];
      }else if(modFlags["シナジー2"]) {
        mod = paramsSynergyBonus["シナジー2"];
      }else if(modFlags["シナジー3"]) {
        mod = paramsSynergyBonus["シナジー3"];
      }else if(modFlags["シナジー4"]) {
        mod = paramsSynergyBonus["シナジー4"];
      }else {
        mod = [1, 0];
      }
      if(i == 0) {
        modHeaderList.push("大発系シナジー乗算"); // 初回のみヘッダー入れる
        modHeaderList.push("大発系シナジー加算"); // 初回のみヘッダー入れる
      }
      conversionModValue = conversionModValue * mod[0] + mod[1];
      modListRow.push(...mod);

      // メイン加算補正
      if (i === 0) modHeaderList.push("メイン加算"); // 初回のみヘッダー入れる
      mod = 0;
      for (const [key, value] of Object.entries(equipCounts)) {
        let paramList = paramsBasicBonusB[key] ?? [0];
        let index = Math.min(value, paramList.length) - 1;
        let param = paramList[index];
        mod += param;
      }
      conversionModValue += mod;
      modListRow.push(mod);

      // キャップ後乗算補正
      if (i === 0) modHeaderList.push("キャップ後乗算"); // 初回のみヘッダー入れる
      mod = 1;
      if (Object.keys(paramsPostCapBonus).includes(enemyModType)) {
        for (const [key, value] of Object.entries(equipCounts)) {
          let paramList = paramsPostCapBonus[enemyModType]?.[key] ?? [1];
          let index = Math.min(value, paramList.length) - 1;
          let param = paramList[index];
          mod *= typeof param === "function" ? param(impModLandingCraftGroup, impModTokuNiGroup) : param;
        }
      }
      modListRow.push(mod);

      // 換算補正処理
      conversionModValue /= baseFirePower;
      if (i === 0) modHeaderList.unshift("換算補正"); // 初回のみヘッダー入れる
      modListRow.unshift(conversionModValue);

      // 全補正push
      if (i === 0) tableMainOutputsHeader.push(...modHeaderList);
      modList.push(modListRow);
    }

    // ソート実行
    [tableMainOutputs, modList] = sortByModList(tableMainOutputs, modList);

    // メイン出力表に追加
    tableMainOutputs = appendColumns(tableMainOutputs, modList);

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

// グループの合計値を計算して追加
// target: 出力先のオブジェクト, source: 入力元のオブジェクト, groupName: グループ名, keys: 対象のキーのリスト
function addGroupCount(target, source, groupName, keys) {
  const total = keys.reduce((sum, key) => sum + (source[key] || 0), 0);
  if (total > 0) {
    target[groupName] = total;
  }
}

// 補正値ソート
function sortByModList(tableMainOutputs, modList) {
  // table と mod をペアでまとめる
  let combined = [];
  for (let i = 0; i < tableMainOutputs.length; i++) {
    combined.push([tableMainOutputs[i], modList[i]]);
  }

  // ソート（最終列 → 1列目 の優先順位、降順）
  combined.sort(function(a, b) {
    let aLast = a[1][a[1].length - 1];
    let bLast = b[1][b[1].length - 1];
    if (aLast !== bLast) {
      return bLast - aLast; // 最終列で降順
    }
    return b[1][0] - a[1][0]; // 1列目で降順
  });

  // 並び替え後の table と mod を取り出す
  let newTable = [];
  let newMod = [];
  for (let i = 0; i < combined.length; i++) {
    newTable.push(combined[i][0]);
    newMod.push(combined[i][1]);
  }

  return [newTable, newMod];
}


// メイン乗算補正（個数ごとのリスト）
// ソフトスキン型、集積地型共通補正
const paramsBasicBonusASoftSkin = {
  "三式弾Gr": [2.5],
  "WG": [1.3, 1.3*1.4], 
  "四式噴進Gr": [1.25, 1.25*1.5], 
  "二式迫撃Gr": [1.2, 1.2*1.3], 
  "上陸用舟艇&特四&陸戦部隊Gr": [(imp, _b, _c) => 1.4 * imp], 
  "特大発Gr": [1.15], 
  "M4A1Gr": [1.1], 
  "陸戦隊Gr1": [1.5], 
  "陸戦隊Gr2": [1, 1.3], 
  "2号アフリカ": [1.5, 1.5*1.3], 
  "装甲艇&武装大発Gr": [(_a, _b, isDay) => isDay ? 1.1 : 1], 
  "装甲艇&武装大発or特四内火Gr": [1, (_a, _b, isDay) => isDay ? 1.1 : 1], 
  "特二内火": [(_a, imp, _c) => 1.5 * imp], 
  "特二内火or特四内火改*2Gr": [1, 1.2], 
  "陸戦部隊Gr": [1.4, 1.4*1.2, 1.4*1.2*1.1], 
  "水戦/爆": [1.2]
}
const paramsBasicBonusA = {
  "ソフトスキン型": paramsBasicBonusASoftSkin,
  "集積地型": paramsBasicBonusASoftSkin,
  "砲台型": {
    "徹甲弾Gr": [1.85],
    "WG": [1.6, 1.6*1.7], 
    "四式噴進Gr": [1.5, 1.5*1.8], 
    "二式迫撃Gr": [1.3, 1.3*1.5], 
    "上陸用舟艇&特四&陸戦部隊Gr": [(imp, _b, _c) => 1.8 * imp], 
    "特大発Gr": [1.15], 
    "M4A1Gr": [2], 
    "陸戦隊Gr1": [1.5], 
    "陸戦隊Gr2": [1, 1.4], 
    "2号アフリカ": [1.5, 1.5*1.4], 
    "装甲艇&武装大発Gr": [(_a, _b, isDay) => isDay ? 1.3 : 1], 
    "装甲艇&武装大発or特四内火Gr": [1, (_a, _b, isDay) => isDay ? 1.2 : 1], 
    "特二内火": [(_a, imp, _c) => 2.4 * imp], 
    "特二内火or特四内火改*2Gr": [1, 1.35], 
    "水戦/爆": [1.5], 
    "艦爆": [1.5, 1.5*2]
  },
  "離島型": {
    "三式弾Gr": [1.75],
    "WG": [1.4, 1.4*1.5], 
    "四式噴進Gr": [1.3, 1.3*1.65], 
    "二式迫撃Gr": [1.2, 1.2*1.4], 
    "上陸用舟艇&特四&陸戦部隊Gr": [(imp, _b, _c) => 1.8 * imp], 
    "特大発Gr": [1.15], 
    "M4A1Gr": [1.8], 
    "陸戦隊Gr1": [1.2], 
    "陸戦隊Gr2": [1, 1.4], 
    "2号アフリカ": [1.2, 1.2*1.4], 
    "装甲艇&武装大発Gr": [(_a, _b, isDay) => isDay ? 1.3 : 1], 
    "装甲艇&武装大発or特四内火Gr": [1, (_a, _b, isDay) => isDay ? 1.1 : 1], 
    "特二内火": [(_a, imp, _c) => 2.4 * imp], 
    "特二内火or特四内火改*2Gr": [1, 1.35], 
    "艦爆": [1.4, 1.4*1.75]
  },
  "港湾夏姫型": {
    "三式弾Gr": [1.75],
    "徹甲弾Gr": [1.3],
    "WG": [1.4, 1.4*1.2], 
    "四式噴進Gr": [1.25, 1.25*1.4], 
    "二式迫撃Gr": [1.1, 1.1*1.15], 
    "上陸用舟艇&特四&陸戦部隊Gr": [(imp, _b, _c) => 1.7 * imp], 
    "特大発Gr": [1.2], 
    "M4A1Gr": [2], 
    "陸戦隊Gr1": [1.6], 
    "陸戦隊Gr2": [1, 1.5], 
    "2号アフリカ": [1.6, 1.6*1.5], 
    "装甲艇&武装大発Gr": [(_a, _b, isDay) => isDay ? 1.5 : 1], 
    "装甲艇&武装大発or特四内火Gr": [1, (_a, _b, isDay) => isDay ? 1.1 : 1], 
    "特二内火": [(_a, imp, _c) => 2.8 * imp], 
    "特二内火or特四内火改*2Gr": [1, 1.5], 
    "水戦/爆": [1.3], 
    "艦爆": [1.3, 1.3*1.2]
  }
}

// 特殊大発系追加補正（乗算と加算のリスト）
const paramsSpecialBonus = [
  { name: "士魂Gr", values: [1.8, 25] },       // No.1
  { name: "M4A1", values: [1.4, 35] },         // No.2
  { name: "ホニ", values: [1.3, 42] },         // No.3
  { name: "チハ", values: [1.4, 28] },         // No.4
  { name: "チハ改", values: [1.5, 33] },       // No.5
  { name: "歩兵Gr", values: [1.2, 60] },      // No.6
  { name: "チハ戦車Gr", values: [1.5, 70] },  // No.7
  { name: "チハ改戦車", values: [1.5, 50] },  // No.8
  { name: "歩兵チハ改", values: [1.6, 70] },  // No.9
  { name: "陸戦部隊Gr", values: [2, 100] },  // No.10
  { name: "陸戦&内火Gr", values: [3, 150] }, // No.11
  { name: "陸戦&特四内火Gr", values: [1, 100] }, // No.12
  { name: "陸戦&特四内火改Gr", values: [1, 172] }, // No.13
  { name: "特四内火Gr", values: [1.2, 42] },  // No.14
  { name: "特四内火改", values: [1.1, 28] }   // No.15
];

// 大発系シナジー補正（乗算と加算のリスト）
const paramsSynergyBonus = {
  "シナジー1": [1.2, 10], 
  "シナジー2": [1.3, 15], 
  "シナジー3": [1.4, 20], 
  "シナジー4": [1.5, 25]  
}

// メイン加算補正（個数ごとのリスト）
const paramsBasicBonusB = {
  "WG": [75, 110, 140, 160], 
  "四式噴進": [55, 115, 160, 190], 
  "四式噴進集中": [80, 170, 230, 260], 
  "二式迫撃": [30, 55, 75, 90], 
  "二式迫撃集中": [60, 110, 150, 180], 
}

// キャップ後乗算補正（個数ごとのリスト）
// 集積地型、新集積地型共通補正
const paramsPostCapBonusSupplyDepotPrincess = {
  "WG": [1.25, 1.25*1.3], 
  "四式噴進Gr": [1.2, 1.2*1.4],
  "二式迫撃Gr": [1.15, 1.15*1.2],
  "上陸用舟艇&特四&陸戦部隊Gr": [(imp, _) => 1.7 * imp], 
  "特大発Gr": [1.2], 
  "M4A1Gr": [1.2], 
  "陸戦隊Gr1": [(imp, _) => 1.3 * imp], 
  "陸戦隊Gr2": [1, 1.6], 
  "2号アフリカ": [(imp, _) => 1.3 * imp, (imp, _) => 1.3 * imp * 1.6], 
  "装甲艇&武装大発Gr": [1.5], 
  "装甲艇&武装大発or特四内火Gr": [1, 1.1], 
  "特二内火": [(_, imp) => 1.7 * imp], 
  "特二内火or特四内火改*2Gr": [1, 1.5], 
  "陸戦部隊Gr": [1.85, 1.85*1.45, 1.85*1.45*1.2]
}
const paramsPostCapBonus = {
  "集積地型": paramsPostCapBonusSupplyDepotPrincess,
  "新集積地型": paramsPostCapBonusSupplyDepotPrincess, 
  "泊地vac型": {
    "三式弾Gr": [1.45],
    "WG": [1.2, 1.2*1.3], 
    "四式噴進Gr": [1.15, 1.15*1.4],
    "二式迫撃Gr": [1.1, 1.1*1.2],
    "上陸用舟艇&特四&陸戦部隊Gr": [(imp, _) => 1.4 * imp], 
    "特大発Gr": [1.15], 
    "M4A1Gr": [1.8], 
    "陸戦隊Gr1": [1.2], 
    "陸戦隊Gr2": [1, 1.4], 
    "2号アフリカ": [1.2, 1.2*1.4], 
    "装甲艇&武装大発Gr": [1.2], 
    "装甲艇&武装大発or特四内火Gr": [1, 1.1], 
    "特二内火": [(_, imp) => 2.4 * imp], 
    "特二内火or特四内火改*2Gr": [1, 1.35], 
    // "陸戦部隊Gr": [1.85, 1.85*1.45, 1.85*1.45*1.2] 未検証、仮置き
    "艦爆&噴式機Gr": [1.4],
    "艦爆&噴式機Gr2": [1, 1.75]
  }, 
  "船渠型": {
    "三式弾Gr": [1.3],
    "WG": [1.1, 1.1*1.2], 
    "四式噴進Gr": [1.1, 1.1*1.25],
    "上陸用舟艇&特四&陸戦部隊Gr": [(imp, _) => 1.1 * imp], 
    "特大発Gr": [1.1], 
    "M4A1Gr": [1.1], 
    "陸戦隊Gr1": [1.15], 
    "陸戦隊Gr2": [1, 1.15], 
    "士魂Gr&歩兵Gr": [1.4], 
    "2号アフリカ": [1.15, 1.15*1.15], 
    "装甲艇&武装大発Gr": [1.1], 
    // "装甲艇&武装大発or特四内火Gr": [1, 1.1], 仮置き 
    "特二内火": [(_, imp) => 1.2 * imp], 
    "特二内火or特四内火改*2Gr": [1, 1.2], 
    // "陸戦部隊Gr": [1.85, 1.85*1.45, 1.85*1.45*1.2] 未検証、仮置き
    "水戦/爆": [1.1], 
    "艦爆&噴式機Gr": [1.1],
    "艦爆&噴式機Gr2": [1, 1.1]
  }
}