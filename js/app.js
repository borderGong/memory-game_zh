/*
 * 创建一个包含所有卡片的数组
 */
var cars = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-diamond'];

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// 创建每个卡片的对象
var Card = function(name){
    this.name = name;
    this.isOpen = false;
    this.isMatch = false; 
    this.onClick = function(){
        this.open();
    };
}
Card.prototype.open = function(){
    this.isOpen = true;
}
// 创建卡片集合
var game = {
    cards: [],
    init: function(cards){
        this.cards = cards
    },
    match: function(card1, card2){
        if(card1.name === card2.name){
            return true
        }else{
            return false;
        }
    },
    render: function(){
        var elements = this.cards.map(function(item, index){
            var isOpenClassName = '', isMatchClassName = ''; 
            if(item.isOpen){
                isOpenClassName = 'open show';
            }
            if(item.isMatch){
                isMatchClassName = 'match';
            }
            return '<li data-index="'+ index +'" class="card '+ isMatchClassName +' '+ isOpenClassName +'"><i class="fa '+ item.name +'"></i></li>'
        })
        document.querySelector('.deck').innerHTML = elements.join('');
    }
};

// 初始化
(function(){
    // 生成所有卡片
    var allCars = shuffle(cars.concat(cars));
    // 生成所有卡片对象
    var allCarsObj = allCars.map(function(item){
        return new Card(item);
    })
    // 初始化game
    game.init(allCarsObj);
    game.render();
    // 添加事件监听器
    $('.deck').on('click', '.card', function(e){
        var index = this.dataset.index;
        game.cards[index].open();
        game.render();                               
        // 判断是否有两个以上的为open状体啊的card 如果有就进行对比否者不做任何操作
        var openCards = game.cards.filter(function(item){return item.isOpen});
        if(openCards.length === 2){
            if(openCards[0].name !== openCards[1].name){
                openCards.map(function(item){ 
                    return Object.assign(item, {isOpen: false});
                })
            }else{
                openCards.map(function(item){ 
                    return Object.assign(item, {isMatch: true, isOpen: false});
                })
            }
        }
        setTimeout(function(){    
            // 如果超过打开超过两个则调用macth方法
            game.render();
        }, 500)    
    })
})()
/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */
