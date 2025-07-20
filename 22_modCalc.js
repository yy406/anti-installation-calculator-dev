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
    // var mainOutputsTable = [["No."]];
    // for(let i = 0; i < combinationsWithRepetition(equipKindsCounts, slotNum); i++){mainOutputsTable.push([i+1]);}

    // 重複組み合わせ表を生成（連番表記）
    let tableMainOutputs = generateCombinationsWithRepetitionArray(equipKindsCounts, slotNum);
    // 各No.の装備の上下限でフィルタリング
    tableMainOutputs = filterByLimits(tableMainOutputs, mainInputs);
    // 列名を追加
    let tableMainOutputsHeader = [];
    for(let i = 0; i < slotNum; i++){
      tableMainOutputsHeader.push(`装備${i + 1}`);
    }

    // 装備名表記に変換
    const equipNamesCombinations = convertSerialToEquipNames(tableMainOutputs, mainInputs);
    tableMainOutputs = appendColumns(tableMainOutputs, equipNamesCombinations);
    // 列名を追加
    for(let i = 0; i < slotNum; i++){
      tableMainOutputsHeader.push(`装備${i + 1}`);
    }

    // 連番を追加
    for(let i = 0; i < tableMainOutputs.length; i++){
      tableMainOutputs[i].unshift(i + 1); // 1から始まる連番を追加
    }
    tableMainOutputsHeader.unshift("No."); // ヘッダーに「No.」を追加

    // 計算結果の表を表示
    tableMainOutputs.unshift(tableMainOutputsHeader);
    var container = document.getElementById("tableMainOutputs");
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

    var serial = cells[0].querySelector("input").value;
    var nameA = cells[1].querySelector("input").value;
    var nameB = cells[2].querySelector("select").value;
    var imp = parseInt(cells[3].querySelector("input").value, 10);
    var min = parseInt(cells[4].querySelector("input").value, 10);
    var max = parseInt(cells[5].querySelector("input").value, 10);

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
      var equipSerial = array[i][j];
      var equipName = mainInputs[equipSerial].nameA;
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