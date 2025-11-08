// 23_insEquipInputs.js

// フィルタリング対象
const allowedEquip = new Map([
    [35, {equipName: "三式弾", priority: 51}], 
    [317, {equipName: "三式弾改", priority: 52}], 
    [483, {equipName: "三式弾改二", priority: 53}], 
    [36, {equipName: "九一徹甲", priority: 54}], 
    [116, {equipName: "一式徹甲", priority: 55}], 
    [365, {equipName: "一式徹甲改", priority: 56}], 
    [126, {equipName: "WG", priority: 1}], 
    [348, {equipName: "四式噴進", priority: 2}], 
    [349, {equipName: "四式噴進集中", priority: 3}], 
    [346, {equipName: "二式迫撃", priority: 71}], 
    [347, {equipName: "二式迫撃集中", priority: 72}], 
    [68, {equipName: "大発", priority: 61}], 
    [166, {equipName: "陸戦隊", priority: 11}], 
    [193, {equipName: "特大発", priority: 62}], 
    [230, {equipName: "士魂", priority: 12}], 
    [355, {equipName: "M4A1", priority: 13}], 
    [408, {equipName: "装甲艇", priority: 14}], 
    [409, {equipName: "武装大発", priority: 15}], 
    [436, {equipName: "2号アフリカ", priority: 16}], 
    [449, {equipName: "ホニ", priority: 17}], 
    [482, {equipName: "3号アフリカ", priority: 18}], 
    [494, {equipName: "チハ", priority: 19}], 
    [495, {equipName: "チハ改", priority: 20}], 
    [514, {equipName: "3号J型", priority: 21}], 
    [167, {equipName: "特二内火", priority: 31}], 
    [525, {equipName: "特四内火", priority: 32}], 
    [526, {equipName: "特四内火改", priority: 33}], 
    [496, {equipName: "歩兵", priority: 81}], 
    [497, {equipName: "チハ戦車", priority: 82}], 
    [498, {equipName: "チハ改戦車", priority: 83}], 
    [499, {equipName: "歩兵チハ改", priority: 84}], 
    [513, {equipName: "気球", priority: 41}]
]);

// ページが読み込まれたら実行
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loadEquipCode").addEventListener("click", () => {
    // テキストエリアの中身を取得
    const inputText = document.getElementById("equipCodeInput").value;

    // JSONとしてパース（try-catchで安全に）
    let equipData;
    try {
      equipData = JSON.parse(inputText);
    } catch (error) {
      alert("⚠ 装備コードの形式が正しくありません。");
      return;
    }

    // 対地装備のみフィルタリング（allowedEquipに存在するidだけ残す）
    const filtered = equipData.filter(item => allowedEquip.has(item.id));

    // 装備の集計
    const countMap = {};
    for (const item of filtered) {
      const key = `${item.id}_${item.lv}`;
      const info = allowedEquip.get(item.id);
      if (!countMap[key]) {
        countMap[key] = {
          id: item.id,
          level: item.lv,
          count: 0,
          equipName: info?.equipName ?? "(unknown)"
        };
      }
      countMap[key].count++;
    }

    // 結果の配列化
    const resultList = Object.values(countMap);

    // ソート処理を追加
    resultList.sort((a, b) => {
      const pa = allowedEquip.get(a.id)?.priority ?? 9999;
      const pb = allowedEquip.get(b.id)?.priority ?? 9999;
      // まず priority が小さい順
      if (pa !== pb) return pa - pb;
      // 同じ priority の場合は level が大きい順
      return b.level - a.level;
    });

    // 結果を表示
    let container = document.getElementById("tableInsCodeImport");
    if (resultList.length > 0) {
      const header = ["ID", "装備名", "改修", "個数"];
      const rows = resultList.map(item => [item.id, item.equipName, item.level, item.count]);
      container.innerHTML = ""; // 前回の表をクリア
      container.appendChild(createTable([header, ...rows]));
    } else {
      container.textContent = "該当する装備はありません。";
    }
  });
});
