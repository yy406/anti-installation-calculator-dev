const data1 = [
    ["ID", "改修"],
    ["A", 10],
    ["B", 10],
    ["C", 10],
    ["D", 10],
    ["E", 10],
  ];

// HTMLの要素に表を追加する
var container = document.getElementById("table1");
container.appendChild(createTable(data1));
var container = document.getElementById("table2");
container.appendChild(createTable(enumerateCombinations(data1)));

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

// 装備の組み合わせを列挙する関数
function enumerateCombinations(data, maxSlots = 4) {
    let equipCounts = data.length - 1; // ヘッダーを除く
    let nHrCounts = nHr(equipCounts, maxSlots)

    let result = [];
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
    return result;
}

// 重複組み合わせ、n：装備種類数、r：スロット数
function nHr(n, r) {
    // 階乗を計算するための関数を定義
    const factorial = num => (num <= 1) ? 1 : num * factorial(num - 1);
    
    // nHr の計算を行う式
    return factorial(n + r - 1) / (factorial(n - 1) * factorial(r));
  }

// // タブ切り替え処理
// document.querySelectorAll(".tab-button").forEach(button => {
//   button.addEventListener("click", () => {
//     // すべてのタブとボタンの active を外す
//     document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
//     document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active-button"));

//     // 選択されたタブだけ active にする
//     const target = button.getAttribute("data-tab");
//     document.getElementById(target).classList.add("active");
//     button.classList.add("active-button");
//   });
// });

// タブを開く関数
function openTab(evt, tabName) {
    // 全てのタブの内容を非表示にする
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // 全てのタブボタンから"active"クラスを外す
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // 選択したタブを表示し、ボタンを"active"にする
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// 初期状態で最初のタブを開く
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tablinks").click();
});