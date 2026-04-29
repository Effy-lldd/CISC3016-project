/**
 * data.js 汇率数据接口层
 * 功能：读取本地 data.json 全量货币数据 / 对接后端Java接口
 * 存放路径：与 data.json 同一级目录
 */

/**
 * 获取【全量汇率数据】（读取本地data.json）
 * @returns Promise<Object> 完整的汇率数据集
 */
export async function getAllCurrencyData() {
  try {
    // 本地读取JSON文件（对接后端时替换为 /api/data/all 即可）
    const response = await fetch('./data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('汇率数据请求失败：', error);
    return null;
  }
}

/**
 * 获取【货币列表】(USD/EUR/GBP/JPY/CNY)
 * @returns Promise<Array> 货币代码数组
 */
export async function getCurrencyList() {
  const data = await getAllCurrencyData();
  return data?.currencyList || [];
}

/**
 * 【核心方法】根据 基准货币+目标货币 筛选对应汇率数据
 * @param {string} baseCurrency 基准货币 (如 USD)
 * @param {string} quoteCurrency 目标货币 (如 CNY)
 * @returns Promise<Object> 单条货币对完整数据（包含面板/历史数据）
 */
export async function getCurrencyPairData(baseCurrency, quoteCurrency) {
  const data = await getAllCurrencyData();
  if (!data || !data.allCurrencyPairs) return null;

  // 精准匹配货币对
  return data.allCurrencyPairs.find(
    pair => 
      pair.baseCurrency === baseCurrency && 
      pair.quoteCurrency === quoteCurrency
  ) || null;
}

/**
 * 获取全局数据更新时间
 * @returns Promise<string> 数据更新时间
 */
export async function getDataUpdateTime() {
  const data = await getAllCurrencyData();
  return data?.updateTime || '';
}

// 全局导出
export default {
  getAllCurrencyData,
  getCurrencyList,
  getCurrencyPairData,
  getDataUpdateTime
};