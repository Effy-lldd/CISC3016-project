/**
 * 路径：js/Tools/search.js
 * 功能：集成金融单词拼写检查与词典查询 (Requirement 5)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 获取 HTML 中的搜索输入框
    const searchInput = document.querySelector('.search-input');

    if (!searchInput) {
        console.error("未找到 class 为 'search-input' 的输入框，请检查 index.html 结构。");
        return;
    }

    // 2. 监听键盘事件[cite: 3]
    searchInput.addEventListener('keypress', async (e) => {
        // 当用户按下回车键时触发
        if (e.key === 'Enter') {
            const word = searchInput.value.trim();

            if (word === "") {
                return; // 输入为空则不处理
            }

            // 执行拼写检查逻辑
            await performSpellCheck(word, searchInput);
        }
    });
});

/**
 * 调用后端 API 进行单词校验[cite: 2, 11]
 * @param {string} word - 用户输入的单词
 * @param {HTMLElement} inputElement - 输入框元素，用于展示加载状态
 */
async function performSpellCheck(word, inputElement) {
    const originalPlaceholder = inputElement.placeholder;
    
    try {
        // 视觉反馈：提示用户正在查询[cite: 3]
        inputElement.placeholder = "Searching dictionary...";
        inputElement.value = ""; // 清空输入框方便下次输入

        // 3. 发送请求到后端 views.py 定义的接口
        // 注意：端口号 54844 需与你运行 Flask 时的端口一致
        const response = await fetch(`http://localhost:54844/api/spell-check?word=${encodeURIComponent(word)}`);
        const data = await response.json();

        if (data.isValid) {
            // 拼写正确：展示定义
            // 你可以根据喜好将 alert 改为页面上的浮窗
            alert(`✅ Correct!\n\nWord: ${word.toUpperCase()}\nDefinition: ${data.definition}`);
        } else {
            // 拼写错误或未找到单词[cite: 2]
            alert(`❌ Spelling Error: ${data.message}`);
        }

    } catch (error) {
        console.error("Dictionary API Error:", error);
        alert("无法连接到词典服务，请确保后端 Flask 已启动。");
    } finally {
        // 恢复搜索框提示文字
        inputElement.placeholder = originalPlaceholder;
    }
}
