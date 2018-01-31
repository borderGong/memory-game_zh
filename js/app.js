/*
 * 创建一个包含所有卡片的数组
 */
var cars = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];

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
    // 游戏卡片
    cards: [],
    // 移动次数
    moves: 0,
    // 错误的移动次数
    errorMoves: 0,
    // 星星数量
    star: 3,
    // 游戏是否完成
    isCompleted: false,
    // 初始化game对象
    init: function(){
        // 生成所有卡片
        var allCars = shuffle(cars.concat(cars));
        // 生成所有卡片对象
        var allCarsObj = allCars.map(function(item){
            return new Card(item);
        });
        this.moves = 0;
        this.cards = allCarsObj;
        this.isCompleted = false;    
        this.errorMoves = 0;   
        this.render();
    },
    // 匹配事件
    match: function(card1, card2){
        if(card1.name === card2.name){
            return true
        }else{
            return false;
        }
    },
    // 判断游戏是否完成
    isGameComplete: function(){
        var matchedCards = this.cards.filter(function(item){
            return item.isMatch;
        });
        if(matchedCards.length === this.cards.length){
            this.isCompleted = true;
        }else{
            this.isCompleted = false;
        }
    },
    starData: function(){
        if(this.errorMoves > 10){
            return ['fa-star', 'fa-star-o', 'fa-star-o'];
        }
        if(this.errorMoves <= 10 && this.errorMoves > 5){
            return ['fa-star', 'fa-star', 'fa-star-o'];
        }
        if(this.errorMoves <= 5){
            return ['fa-star', 'fa-star', 'fa-star'];
        }
    },
    render: function(){
        var deckElement = document.querySelector('.deck');
        var movesElement = document.querySelector('.moves');
        var starsElement = document.querySelector('.stars');
        // 移动次数
        movesElement.innerHTML = this.moves; 
        // 渲染星星
        var stars = this.starData().map(function(item){
            return '<li><i class="fa '+ item +'"></i></li>';
        });
        starsElement.innerHTML = stars.join('');
        // 如果游戏已经结束
        if(this.isCompleted){
            var completeHtml = `<li>
                <div class="icon-success">
                    <i class="fa fa-check fa-3x"></i>                    
                </div>
                <p class="text-first">Congratulations! You Won!</p>
                <p class="text-second">With ${this.moves} Moves and ${this.star} Starts</p>
                <p class="text-second">Woooooo!</p>
                <button class="button-restart">play again!</button>
            </li>`;
            $(deckElement).addClass('game-complete');
            deckElement.innerHTML = completeHtml;
            return;
        }
        var elements = this.cards.map(function(item, index){
            var isOpenClassName = '', isMatchClassName = ''; 
            if(item.isOpen){
                isOpenClassName = 'open show';
            }
            if(item.isMatch){
                isMatchClassName = 'match';
            }
            return '<li data-index="'+ index +'" class="card '+ isMatchClassName +' '+ isOpenClassName +'"><i class="fa '+ item.name +'"></i></li>'
        });
        $(deckElement).removeClass('game-complete');        
        deckElement.innerHTML = elements.join('');
    }
};

// 初始化
(function(){
    // 初始化game
    game.init();
    // 添加事件监听器
    $('.deck').on('click', '.button-restart', function(e){
        game.init();
    });
    $('.deck').on('click', '.card', function(e){
        var that = this;
        var index = that.dataset.index;
        // 如果已经匹配过直接返回
        if(game.cards[index].isMatch) return;  
        game.cards[index].open();
        // game.render(); 
        $(that).addClass('open show');                              
        // 判断是否有两个以上的为open状体啊的card 如果有就进行对比否者不做任何操作
        var openCards = game.cards.filter(function(item){return item.isOpen});
        var openCardsIndex = game.cards
            .filter(function(item){
                return item.isOpen
            })
            .map(function(item){ 
                return game.cards.findIndex(function(_item){
                    return item === _item;
                });
            });
        if(openCards.length === 2){
            // 增加次数
            game.moves++;                  
            // 匹配            
            if(!game.match(openCards[0],openCards[1])){
                game.errorMoves++;
                openCards.forEach(function(item){ 
                    Object.assign(item, {isOpen: false});
                });
                $('.deck .card:eq('+ openCardsIndex[0] +'),.deck .card:eq('+ openCardsIndex[1] +')')
                    .addClass('animated shake error')
                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        game.render();
                    });
            }else{
                openCards.map(function(item){ 
                    return Object.assign(item, {isMatch: true, isOpen: false});
                });
                $('.deck .card:eq('+ openCardsIndex[0] +'),.deck .card:eq('+ openCardsIndex[1] +')')
                    .addClass('animated rubberBand match')
                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        game.isGameComplete();
                        game.render();
                    });
            }
        }   
    });
    $('.restart').on('click', function(){
        game.init();
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
