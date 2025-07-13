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

/**
 * 2次元配列（文字列・数値・HTML要素）からHTMLのtable要素を生成する関数
 * @param {Array<Array<string | number | HTMLElement>>} data - 表の行データ（2次元配列）
 * @returns {HTMLTableElement} - 作成された表のDOM要素
 */
function createTable(data) {
  const table = document.createElement("table");  // <table>タグを作成
  table.border = "1"; // 枠線を表示（本当はCSSでやるのが望ましい）

  // 各行に対してループ
  data.forEach((rowData, rowIndex) => {
    const row = document.createElement("tr");  // <tr>タグを作成（表の1行）

    // 各セルに対してループ
    rowData.forEach(cellData => {
      // 1行目なら <th>（見出しセル）、それ以降は <td>（普通のセル）
      const cell = rowIndex === 0
        ? document.createElement("th")
        : document.createElement("td");

      // セルの中身が HTML要素（例: input や select）ならそのまま追加
      if (cellData instanceof HTMLElement) {
        cell.appendChild(cellData);
      } else {
        // それ以外（文字列や数値）はテキストとして表示
        cell.textContent = cellData;
      }

      row.appendChild(cell); // セルを行に追加
    });

    table.appendChild(row); // 行を表に追加
  });

  return table;
}
