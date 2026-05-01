// 路径：js/Tools/search.js[cite: 10]
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    
    // 监听回车键进行搜索
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const word = searchInput.value.trim();
            if (word) {
                performSpellCheck(word);
            }
        }
    });
});

async function performSpellCheck(word) {
    const searchInput = document.querySelector('.search-input');
    const originalPlaceholder = searchInput.placeholder;
    
    try {
        searchInput.placeholder = "Checking spelling...";
        const response = await fetch(`http://localhost:54844/api/spell-check?word=${word}`);
        const data = await response.json();
        
        if (data.isValid) {
            // 拼写正确，弹出定义（或在页面某处展示）
            alert(`✅ ${word.toUpperCase()}: ${data.definition}`);
        } else {
            // 拼写错误提示
            alert(`❌ ${data.message}`);
        }
    } catch (err) {
        console.error("Spell check failed:", err);
    } finally {
        searchInput.placeholder = originalPlaceholder;
    }
}
