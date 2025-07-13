// 初期状態で最初のタブを開く
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tablinks").click();
});

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

// 表を作る関数
function createTable(data) {
    const table = document.createElement("table");
    table.border = "1"; // 罫線をつける（簡易的に）　非推奨なので、cssに手を付けたらそっちで処理したい
    
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