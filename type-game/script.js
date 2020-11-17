
// 一些引用的话
const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];
// 存储正在输入的单词的下标
let words = [];
let wordIndex = 0;

// 默认开始时间
let startTime = Date.now();

// 获取dom组件
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');

document.getElementById('start').addEventListener('click', function() {
    // 随机取到quote
    const quoteIndex = Math.floor(Math.random() * (quotes.length + 1));
    const quote = quotes[quoteIndex];
    // 将quote放入单词数组
    words = quote.split(' ');
    // 初始化单词下标以备追踪
    wordIndex = 0;

    // UI更新
    // 创建一个数组的span元素用来设置class
    const spanWords = words.map(function(word) { return `<span>${word} </span>`});
    // 转换成string类型并通过innerHTML展示
    quoteElement.innerHTML = spanWords.join('');
    // 高亮显示第一个单词
    quoteElement.childNodes[0].className = 'highlight';
    // 清除之前的消息
    messageElement.innerText = '';

    // 设置消息盒子 
    // 清除消息盒子
    typedValueElement.value = '';
    // 设置聚焦
    typedValueElement.focus();
    // 设置事件

    // 开始时间
    startTime = new Date().getTime();
    
});

typedValueElement.addEventListener('input', (e) => {
    // 获取当前的单词
    const currentWord = words[wordIndex];
    // 拿到当前的句子值
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        // 如果是最后一个单词
        // 显示成功
        const elapsedTime = new Date().getTime() - startTime;
        const message = `CONGRATULATIONS! You finished in ${elapsedTime / 1000} seconds`;
        messageElement.innerText = message;
    } else if(typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        // 最后一个单词
        // 清除打印的单词 让位给新单词
        typedValueElement.value = '';
        // 移动到下一个单词
        wordIndex++;
        // 重设所有的元素class
        for (const wordElement of quoteElement.childNodes) {
            wordElement.className = '';
        }
        // 高亮新单词
        quoteElement.childNodes[wordIndex].className = 'highlight';
    } else if (currentWord.startsWith(typedValue)) {
        // 当前的正确
        // 高亮下一个单词
        typedValueElement.className = '';
    } else {
        typedValueElement.className = 'error';
    }
});