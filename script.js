// 表を作る関数
function createTable(data) {
const table = document.createElement("table");
table.border = "1"; // 罫線をつける（簡易的に）

data.forEach((rowData, rowIndex) => {
    const row = document.createElement("tr");
    rowData.forEach(cellData => {
    const cell = rowIndex === 0 ? document.createElement("th") : document.createElement("td");
    cell.textContent = cellData;
    row.appendChild(cell);
    });
    table.appendChild(row);
});

return table;
}

function enumerateCombinations(data, maxSlots = 4) {
    let equipCounts = data.length - 1; // ヘッダーを除く
    let nHrCounts = nHr(equipCounts, maxSlots)

    let result = [data[0]]; // ヘッダー
    let result_i = Array(maxSlots).fill(0); // 装備無し行
    result.push([...result_i]); // 装備無し行をコピーして追加

    for (let i = 1; i < nHrCounts; i++) {
        let m = 0;
        while (m < maxSlots) {
            if (result_i.slice(m, maxSlots).every(val => val === result_i[m])) {
              result_i[m] += 1;
              for (let j = m + 1; j < maxSlots; j++) {
                result_i[j] = 0;
              }
              break;
            }
            m++;
          }
          result.push([...result_i]); // 配列のコピーを追加
    }
}

// 重複組み合わせ、n：装備種類数、r：スロット数
function nHr(n, r) {
  // 階乗を計算するための関数を定義
  const factorial = num => (num <= 1) ? 1 : num * factorial(num - 1);
  
  // nHr の計算を行う式
  return factorial(n + r - 1) / (factorial(n - 1) * factorial(r));
}

const data = [
    ["ID", "改修"],
    ["A", 10],
    ["B", 10],
    ["C", 10],
    ["D", 10],
    ["E", 10],
  ];

const data2 = [
    ["名前", "年齢", "職業"],
    ["山田太郎2", 30, "エンジニア"],
    ["鈴木花子2", 25, "デザイナー"],
  ];


// HTMLの要素に表を追加する
const container = document.getElementById("table");
container.appendChild(createTable(data));  // createTableは表を作る関数
const container2 = document.getElementById("table2");
container2.appendChild(createTable(data2));  // createTableは表を作る関数
const container3 = document.getElementById("table3");
container3.appendChild(createTable(enumerateCombinations(data)));  // createTableは表を作る関数
