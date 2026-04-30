/**
 * data.js 汇率数据接口层
 * 功能：读取本地 data.json 全量货币数据 / 对接后端Java接口
 * 存放路径：与 data.json 同一级目录
 */
// 【二选一模式切换】
const MODE = "PROD"; // TEST = 读本地data.json | PROD = 读浏览器缓存
const LOCAL_JSON_PATH = '../../../Backend/Data/data.json'; // 测试文件路径
const CACHE_KEY = 'DATA_LOCAL_DATA'; // 正式缓存key
/**
 * 获取【全量汇率数据】（双模式自动切换）
 * @returns Promise<Object> 完整的汇率数据集
 */
export async function getAllCurrencyData() {
  try {
    let data;
    // 模式1：测试环境 - 读取本地JSON文件
    if (MODE === "TEST") {
      const response = await fetch(LOCAL_JSON_PATH);
      data = await response.json();
    }
    // 模式2：正式环境 - 读取浏览器本地缓存
    else {
      const cached = localStorage.getItem(CACHE_KEY);
      data = cached ? JSON.parse(cached) : null;
    }
    return data;
  } catch (error) {
    console.error('汇率数据读取失败：', error);
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

window.currencyApi = {
  getAllCurrencyData,
  getCurrencyList,
  getCurrencyPairData,
  getDataUpdateTime
};