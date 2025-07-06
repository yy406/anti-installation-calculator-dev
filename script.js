// 例：JavaScriptで動的にHTMLに表を追加するコード例
const data = [
    ["名前", "年齢", "職業"],
    ["山田太郎", 30, "エンジニア"],
    ["鈴木花子", 25, "デザイナー"],
  ];

const data2 = [
    ["名前", "年齢", "職業"],
    ["山田太郎2", 30, "エンジニア"],
    ["鈴木花子2", 25, "デザイナー"],
  ];

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
  
const container = document.getElementById("table");
container.appendChild(createTable(data));  // createTableは表を作る関数
const container2 = document.getElementById("table2");
container2.appendChild(createTable(data2));  // createTableは表を作る関数
